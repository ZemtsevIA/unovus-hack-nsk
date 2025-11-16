from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from backend.db.engine import get_async_session
from backend.db.models import User


class UserRepository:
    async def register_user(self, password_hash, email) -> User | None:
        new_user = User(email=email, password_hash=password_hash)
        async with get_async_session(commit=True) as session:
            try:
                session.add(new_user)
                await session.flush()
                await session.refresh(new_user)
            except IntegrityError as error:
                raise ValueError(f'Error on user creation: {str(error)}')
            return new_user

    async def get_user_by_email(self, email: str) -> User | None:
        async with get_async_session(commit=False) as session:
            result = await session.execute(select(User).where(User.email == email))
            return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: int) -> User | None:
        async with get_async_session(commit=False) as session:
            result = await session.execute(select(User).where(User.id == user_id))
            return result.scalar_one_or_none()

    async def get_all_users(self) -> list[User] | None:
        async with get_async_session(commit=False) as session:
            result = await session.execute(select(User).order_by(User.email))
            return result.scalars().all()

    async def update_user(self, user_id: int, **fields) -> User | None:
        async with get_async_session(commit=True) as session:
            user = await session.execute(select(User).where(User.id == user_id))
            user = user.scalar_one_or_none()
            if user is None:
                raise ValueError(f'User not found: {user_id}')
            for field, value in fields.items():
                setattr(user, field, value)
            await session.flush()
            await session.refresh(user)
            return user

    async def update_password_by_email(self, email: str, new_password: str) -> User:
        async with get_async_session(commit=True) as session:
            user = await self.get_user_by_email(email)
            if user is None:
                raise ValueError(f'User not found: {email}')
            user.password_hash = new_password
            await session.flush()
            await session.refresh(user)
            return user

    async def delete_user(self, user_id: int) -> bool:
        async with get_async_session(commit=True) as session:
            user = await session.execute(select(User).where(User.id == user_id))
            user = user.scalar_one_or_none()
            if user is None:
                raise ValueError(f'User not found: {user_id}')
            await session.delete(user)
        return True

    async def get_employees_by_hr(self, hr_id: int) -> list[User]:
        """Получить всех сотрудников по HR"""
        async with get_async_session(commit=False) as session:
            result = await session.execute(
                select(User).where(User.hr_id == hr_id).order_by(User.email)
            )
            return result.scalars().all()

    async def get_hr_by_employee(self, employee_id: int) -> User | None:
        """Получить HR по сотруднику"""
        async with get_async_session(commit=False) as session:
            employee_result = await session.execute(
                select(User).where(User.id == employee_id)
            )
            employee = employee_result.scalar_one_or_none()

            if employee is None or employee.hr_id is None:
                return None

            hr_result = await session.execute(
                select(User).where(User.id == employee.hr_id)
            )
            return hr_result.scalar_one_or_none()

    async def assign_employees_to_hr(self, hr_id: int, employee_ids: list[int]) -> bool:
        """Назначить сотрудников HR"""
        async with get_async_session(commit=True) as session:
            hr = await session.execute(select(User).where(User.id == hr_id))
            hr = hr.scalar_one_or_none()
            if not hr:
                raise ValueError(f"HR user {hr_id} not found")

            for employee_id in employee_ids:
                employee_result = await session.execute(
                    select(User).where(User.id == employee_id)
                )
                employee = employee_result.scalar_one_or_none()
                if employee:
                    employee.hr_id = hr_id

            await session.flush()
            return True

    async def unassign_employees_from_hr(self, employee_ids: list[int]) -> bool:
        """Убрать привязку сотрудников от HR"""
        async with get_async_session(commit=True) as session:
            for employee_id in employee_ids:
                employee_result = await session.execute(
                    select(User).where(User.id == employee_id)
                )
                employee = employee_result.scalar_one_or_none()
                if employee:
                    employee.hr_id = None

            await session.flush()
            return True


async def get_user_repository() -> UserRepository:
    return UserRepository()
