from pydantic_settings import BaseSettings
from functools import lru_cache
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseSettings):
    # Database - Handle Render's PostgreSQL connection string
    # Render uses "postgres://" but asyncpg needs "postgresql+asyncpg://"
    _raw_db_url: str = os.getenv("DATABASE_URL", "")
    DATABASE_URL: str = (
        _raw_db_url.replace("postgres://", "postgresql+asyncpg://", 1)
        if _raw_db_url
        else "postgresql+asyncpg://kabanye:Kabanye123@localhost:5432/kabanye_space"
    )
    
    # M-Pesa Daraja API
    MPESA_CONSUMER_KEY: str = os.getenv("MPESA_CONSUMER_KEY", "your_consumer_key")
    MPESA_CONSUMER_SECRET: str = os.getenv("MPESA_CONSUMER_SECRET", "your_consumer_secret")
    MPESA_PASSKEY: str = os.getenv("MPESA_PASSKEY", "your_passkey")
    MPESA_SHORTCODE: str = os.getenv("MPESA_SHORTCODE", "174379")
    MPESA_ENVIRONMENT: str = os.getenv("MPESA_ENVIRONMENT", "sandbox")
    
    # Admin
    ADMIN_SECRET_KEY: str = os.getenv("ADMIN_SECRET_KEY", "kabanye-admin-2026-secret")
    
    # App
    CALLBACK_BASE_URL: str = os.getenv("CALLBACK_BASE_URL", "https://your-domain.com")
    APP_NAME: str = "Kabanye Space"
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()