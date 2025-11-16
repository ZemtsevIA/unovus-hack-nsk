from datetime import datetime, timedelta, UTC

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt, ExpiredSignatureError
from passlib.context import CryptContext

from backend.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ------------------- Password Hashing -------------------
async def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


async def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# ------------------- JWT Token Handling -------------------
async def create_access_token(data: dict) -> str:
    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    expire = datetime.now(UTC) + expires_delta

    to_encode = data.copy()
    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm
    )


async def create_refresh_token(data: dict) -> str:
    expires_delta = timedelta(days=settings.refresh_token_expire_days)
    expire = datetime.now(UTC) + expires_delta

    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "refresh"})

    return jwt.encode(
        to_encode,
        settings.refresh_secret_key,
        algorithm=settings.algorithm
    )


# ------------------- Email from Token Handling -------------------
async def get_email_from_access(token: str = Depends(OAuth2PasswordBearer(tokenUrl="users/login"))):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        email: str = payload.get("sub")
        if not email:
            raise credentials_exception
        return email

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The token has expired."
        )

    except JWTError:
        raise credentials_exception


async def get_email_from_refresh(token: str = Depends(OAuth2PasswordBearer(tokenUrl="users/refresh"))):
    try:
        payload = jwt.decode(
            token,
            settings.refresh_secret_key,
            algorithms=[settings.algorithm]
        )
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")

        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")