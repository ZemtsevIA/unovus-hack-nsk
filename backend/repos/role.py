from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from backend.db.engine import get_async_session
from backend.db.models import Role


class RoleRepository:
    async def create_role(self, **fields) -> Role:
        role = Role(**fields)
        async with get_async_session(commit=True) as session:
            try:
                session.add(role)
                await session.flush()
                await session.refresh(role)
            except IntegrityError:
                raise ValueError("Error on role creation: role already exists")
            return role

    async def get_role(self, role_id: int) -> Role:
        async with get_async_session(commit=False) as session:
            role = await session.execute(select(Role).where(Role.id == role_id))
            role = role.scalar_one_or_none()
            if role is None:
                raise ValueError(f"Role {role_id} not found")
            return role

    async def get_all_roles(self) -> list[Role]:
        async with get_async_session(commit=False) as session:
            roles = await session.execute(select(Role))
            return roles.scalars().all()

    async def update_role(self, role_id: int, **fields) -> Role:
        async with get_async_session(commit=True) as session:
            old_role = await session.execute(select(Role).where(Role.id == role_id))
            old_role = old_role.scalar_one_or_none()
            if old_role is None:
                raise ValueError(f"Role {role_id} not found")
            try:
                for field, value in fields.items():
                    setattr(old_role, field, value)
                await session.flush()
                await session.refresh(old_role)
            except IntegrityError:
                raise ValueError("Error on role update: role already exists")
            return old_role

    async def delete_role(self, role_id: int) -> bool:
        async with get_async_session(commit=True) as session:
            role = await session.execute(select(Role).where(Role.id == role_id))
            role = role.scalar_one_or_none()
            if role is None:
                raise AttributeError(f"Role {role_id} not found")
            await session.delete(role)
        return True


async def get_role_repository() -> RoleRepository:
    return RoleRepository()
