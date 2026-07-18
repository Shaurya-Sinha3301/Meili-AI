from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "MeiliAi"
    
    # SECURITY
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # Refresh tokens valid for 7 days
    
    # DATABASE
    SQLALCHEMY_DATABASE_URI: str

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8443", "http://127.0.0.1:8443", "http://localhost:5174", "http://127.0.0.1:5174"]
    
    # AGENT CONFIGURATION
    GEMINI_API_KEY: str
    GROQ_API_KEY: str
    
    # ML OPTIMIZER PATHS
    ML_OPTIMIZER_BASE_DATA: str = "ml_or/data"
    TRIP_SESSION_STORAGE: str = "./trip_sessions"
    OPTIMIZER_OUTPUT_DIR: str = "./optimizer_outputs"

    # TBO HOTEL API
    TBO_API_URL: str
    TBO_USERNAME: str
    TBO_PASSWORD: str

    # TBO AIR API
    TBO_AIR_AUTHENTICATE_URL: str
    TBO_AIR_SERVICE_URL: str
    TBO_AIR_USERNAME: str
    TBO_AIR_PASSWORD: str

    # CELERY / REDIS
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"
    REDIS_URL: str = "redis://localhost:6379/0"

    # TEST CREDENTIALS
    TEST_USER_EMAIL: str = "test@example.com"
    TEST_USER_PASSWORD: str = "testpassword123"

    class Config:
        case_sensitive = True
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
        env_file_encoding = 'utf-8'
        extra = 'ignore'

settings = Settings()
