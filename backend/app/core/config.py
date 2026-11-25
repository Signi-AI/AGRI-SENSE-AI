from pydantic_settings import BaseSettings,SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME:str
    DATABASE_URL:str
    SECRET_KEY:str
    ALGORITHM:str
    EXPIRE_ACCESS_TOKEN:int

    # Legacy compatibility (CORS is intentionally open for Vercel previews).
    CORS_ORIGINS:str="http://localhost:5173"

    # Security settings
    ADMIN_EMAILS:str=""                 # comma-separated emails that keep admin role
    REQUIRE_EMAIL_VERIFICATION:bool=False
    VERIFY_TOKEN_EXPIRE:int=1440        # minutes
    RESET_TOKEN_EXPIRE:int=30           # minutes
    SMTP_HOST:str=""
    SMTP_PORT:int=587
    SMTP_USER:str=""
    SMTP_PASSWORD:str=""
    EMAIL_FROM:str="no-reply@agrisense.local"
    FIREBASE_PROJECT_ID:str="agri-sense-ai"
    GOOGLE_TOKENINFO_URL:str="https://oauth2.googleapis.com/tokeninfo"
    FRONTEND_URL:str="http://localhost:5173"
    RATE_LIMIT_PER_MINUTE:int=60
    AUTH_RATE_LIMIT_PER_MINUTE:int=5
    ML_RATE_LIMIT_PER_MINUTE:int=20
    MAX_REQUEST_BYTES:int=1000000
    MAX_FAILED_LOGINS:int=5
    LOCKOUT_MINUTES:int=15


    model_config=SettingsConfigDict(
        env_file=".env",
        enable_decoding="utf-8",
        extra="ignore"
    )

settings=Settings()
