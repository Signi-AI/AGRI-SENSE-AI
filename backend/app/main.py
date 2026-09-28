from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import auth_router, user_router, seed_role, ml_router


app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(seed_role.router)
app.include_router(ml_router.router)

@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "Ok",
        "message": "welcome to AGRI SENSE AI"
    }