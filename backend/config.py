from pydantic_settings import BaseSettings
from os import getenv
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    host: str = getenv('HOST', 'localhost')
    port: int | None = getenv('PORT', 8000)
    frontend_host: str = "http://localhost:3000"
    is_debug: bool = bool(getenv('IS_DEBUG', False))
    db_url: str = getenv(
        'DB_URL',
        'postgresql+asyncpg://wellness_user:wellness_password@localhost:5432/wellness_db',
    )

    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 30
    algorithm: str = 'HS256'
    secret_key: str = getenv('SECRET_KEY', 'some-secret-key')
    refresh_secret_key: str = getenv('SECRET_KEY', 'some-refresh-secret-key')


settings = Settings()
