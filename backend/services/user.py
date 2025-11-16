from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt, ExpiredSignatureError

from backend.config import settings
from backend.repos.user import UserRepository
from backend.schemas.user import UserRegister, UserGet, UserUpdate
from backend.schemas.token import TokenPair
from backend.services.security import get_password_hash, verify_password, create_access_token, create_refresh_token


class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def create_user(self, user: UserRegister) -> UserGet:
        if user.password != user.password_confirm:
            raise ValueError('Passwords do not match')
        if await self.user_repository.get_user_by_email(str(user.email)) is not None:
            raise AttributeError('Email already registered')
        hashed_password = await get_password_hash(user.password)
        user = await self.user_repository.register_user(email=user.email, password_hash=hashed_password)
        if user is not None:
            return UserGet.model_validate(user)
        raise MemoryError('User not registered')

    async def login_user(self, email, password) -> TokenPair:
        email_user = await self.user_repository.get_user_by_email(email)
        if email_user is None or not await verify_password(password, email_user.password_hash):
            raise AttributeError('Invalid email or password')
        access_token = await create_access_token({"sub": email_user.email})
        return TokenPair.model_validate({
            "access_token": access_token,
            "refresh_token": await create_refresh_token({"sub": email_user.email}),
            "token_type": "bearer"
        })

    async def get_user_by_email(self, email: str) -> UserGet:
        email_user = await self.user_repository.get_user_by_email(email)
        return UserGet.model_validate(email_user)

    async def get_user_by_id(self, user_id: int) -> UserGet:
        user = await self.user_repository.get_user_by_id(user_id)
        if user is None:
            raise AttributeError('User not found')
        return UserGet.model_validate(user)

    async def get_all(self) -> list[UserGet]:
        return [UserGet.model_validate(user) for user in await self.user_repository.get_all_users()]

    async def update_user(self, user_id: int, data: UserUpdate) -> UserGet:
        new_data = await self.user_repository.update_user(user_id, **data.model_dump(exclude_unset=True))
        return UserGet.model_validate(new_data)

    async def delete_user(self, user_id: int) -> bool:
        await self.user_repository.delete_user(user_id)
        return True

    async def get_employees_by_hr(self, hr_id: int) -> list[UserGet]:
        """Получить всех сотрудников по HR"""
        employees = await self.user_repository.get_employees_by_hr(hr_id)
        return [UserGet.model_validate(emp) for emp in employees]

    async def get_hr_by_employee(self, employee_id: int) -> UserGet | None:
        """Получить HR по сотруднику"""
        hr = await self.user_repository.get_hr_by_employee(employee_id)
        if hr is None:
            return None
        return UserGet.model_validate(hr)

    async def assign_employees_to_hr(self, hr_id: int, employee_ids: list[int]) -> bool:
        """Назначить сотрудников HR"""
        # Проверяем, что HR существует
        hr = await self.user_repository.get_user_by_id(hr_id)
        if not hr:
            raise ValueError(f"HR user {hr_id} not found")

        await self.user_repository.assign_employees_to_hr(hr_id, employee_ids)
        return True

    async def unassign_employees_from_hr(self, employee_ids: list[int]) -> bool:
        """Убрать привязку сотрудников от HR"""
        await self.user_repository.unassign_employees_from_hr(employee_ids)
        return True


async def get_user_service() -> UserService:
    return UserService(UserRepository())


# ------------------- Current User Dependency -------------------
async def get_current_user(
        token: str = Depends(OAuth2PasswordBearer(tokenUrl="users/login")),
        user_service=Depends(get_user_service)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except JWTError:
        raise credentials_exception

    user = await user_service.get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user
