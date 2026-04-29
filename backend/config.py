from pydantic_settings import BaseSettings
from functools import lru_cache
from dotenv import load_dotenv
import os

load_dotenv()


def get_database_url() -> str:
    """Get properly formatted database URL for asyncpg"""
    url = os.getenv("DATABASE_URL", "")
    
    if not url:
        return "postgresql+asyncpg://kabanye:Kabanye123@localhost:5432/kabanye_space"
    
    # Fix for Supabase: postgresql:// → postgresql+asyncpg://
    # Fix for Render:   postgres:// → postgresql+asyncpg://
    if "+asyncpg" not in url:
        url = url.replace("postgresql://", "postgresql+asyncpg://")
        url = url.replace("postgres://", "postgresql+asyncpg://")
    
    return url


class Settings(BaseSettings):
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