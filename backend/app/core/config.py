from pydantic_settings import BaseSettings,SettingsConfigDict




class Settings(BaseSettings):
    APP_NAME:str
    DATABASE_URL:str
    SECRET_KEY:str
    ALGORITHM:str
    EXPIRE_ACCESS_TOKEN:int
    
    
    model_config=SettingsConfigDict(
        env_file=".env",
        enable_decoding="utf-8",
        extra="ignore"
    )
    
settings=Settings()    
