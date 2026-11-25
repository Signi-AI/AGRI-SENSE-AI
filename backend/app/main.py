import logging
import threading
import time
from collections import defaultdict
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse

from app.core.audit import client_ip, log_security
from app.core.config import settings
from app.core.database import sessionLocal
from app.services.seed_role import seed as seed_roles, normalize_legacy_admins
from app.api.router import auth_router, user_router, seed_role, ml_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logging.getLogger("agrisense.security").setLevel(logging.INFO)

AUTH_PATHS = {
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/auth/verify-email",
    "/api/auth/firebase",
    "/user/changepassword",
}
ML_PATHS = {"/api/chat", "/api/predict", "/api/diagnose", "/api/weather"}
PUBLIC_PATHS = {"/health", "/api/health", "/api/ml-status"}
# Swagger UI na ReDoc hupakua JS/CSS kutoka jsDelivr; CSP kali inayofaa API
# ingezizuia kurasa hizi na kuacha white page.
DOCS_PATHS = {"/docs", "/redoc", "/docs/oauth2-redirect"}


def warn_about_weak_config() -> None:
    weak_secrets = {"secret", "changeme", "change-me", "local-testing-secret-replace-me"}
    if len(settings.SECRET_KEY) < 32 or settings.SECRET_KEY.lower() in weak_secrets:
        logger.warning("SECRET_KEY is a placeholder or too short. Set a long random value before deploying.")
    if not settings.SMTP_HOST:
        logger.warning("SMTP is not configured. Verification and password-reset emails will not be delivered.")
    if settings.REQUIRE_EMAIL_VERIFICATION and not settings.SMTP_HOST:
        logger.warning("REQUIRE_EMAIL_VERIFICATION is on but SMTP is missing, so verification is not enforced.")
    if not settings.ADMIN_EMAILS:
        logger.warning("ADMIN_EMAILS is empty; legacy admin accounts will be downgraded at startup.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Prepare a fresh database (e.g. a new Neon DB) before serving requests.
    # Failures are logged so the API still starts and Render reports a live service.
    from alembic import command
    from alembic.config import Config

    backend_dir = Path(__file__).resolve().parents[1]
    alembic_config = Config(str(backend_dir / "alembic.ini"))

    db = sessionLocal()
    try:
        command.upgrade(alembic_config, "head")
        seed_roles(db)
        result = normalize_legacy_admins(db, settings.ADMIN_EMAILS)
        if result["downgraded"]:
            logger.warning("Downgraded %s legacy admin account(s) to farmer", result["downgraded"])
    except Exception:
        logger.exception("Could not initialize the database at startup")
    finally:
        db.close()
    warn_about_weak_config()
    yield


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

# Allow any browser origin (Render/Vercel preview URLs change between deploys).
# The frontend sends the JWT in the Authorization header, not in cookies, so
# credentials are not needed and "*" is safe here.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_credentials=False,
    allow_headers=["*"],
)


class RateLimiter:
    """In-memory, per-IP and per-path-bucket limiter (one process)."""

    def __init__(self):
        self.hits = defaultdict(list)
        self.lock = threading.Lock()
        self.requests = 0

    def allow(self, key: str, limit: int, window: int = 60) -> bool:
        now = time.monotonic()
        with self.lock:
            self.requests += 1
            if self.requests % 200 == 0:
                for bucket in list(self.hits):
                    self.hits[bucket] = [t for t in self.hits[bucket] if now - t < window]
                    if not self.hits[bucket]:
                        del self.hits[bucket]
            recent = [t for t in self.hits[key] if now - t < window]
            if len(recent) >= limit:
                return False
            recent.append(now)
            self.hits[key] = recent
            return True


limiter = RateLimiter()


def apply_security_headers(response, request: Request) -> None:
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-XSS-Protection"] = "0"
    response.headers["Permissions-Policy"] = "geolocation=(self), camera=(), microphone=(), payment=()"
    if request.url.path in DOCS_PATHS:
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "img-src 'self' data: https:; font-src 'self' data: https://cdn.jsdelivr.net; "
            "connect-src 'self' https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
        )
    else:
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; "
            "object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
        )
    if request.url.scheme == "https":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    apply_security_headers(response, request)
    return response


@app.middleware("http")
async def limit_and_validate(request: Request, call_next):
    ip = client_ip(request)
    path = request.url.path

    # Reject oversized payloads before they are parsed into memory.
    declared_length = request.headers.get("content-length")
    if declared_length and declared_length.isdigit() and int(declared_length) > settings.MAX_REQUEST_BYTES:
        response = JSONResponse(status_code=413, content={"detail": "Request body too large"})
        response.headers["Access-Control-Allow-Origin"] = "*"
        apply_security_headers(response, request)
        return response

    if request.method != "OPTIONS" and path not in PUBLIC_PATHS:
        if path in AUTH_PATHS:
            limit = settings.AUTH_RATE_LIMIT_PER_MINUTE
        elif path in ML_PATHS:
            limit = settings.ML_RATE_LIMIT_PER_MINUTE
        else:
            limit = settings.RATE_LIMIT_PER_MINUTE

        if not limiter.allow(f"{ip}:{path}", limit):
            log_security("rate_limited", ip=ip, path=path)
            response = JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."},
                headers={"Retry-After": "60", "Access-Control-Allow-Origin": "*"},
            )
            apply_security_headers(response, request)
            return response

    return await call_next(request)


app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(seed_role.router)
app.include_router(ml_router.router)


@app.get("/", include_in_schema=False)
def root():
    """Bare backend URL iweke moja kwa moja kwenye Swagger UI."""
    return RedirectResponse(url="/docs")


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "Ok",
        "message": "welcome to AGRI SENSE AI"
    }
