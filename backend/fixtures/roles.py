import asyncio

from sqlalchemy import select

from backend.db.engine import get_async_session
from backend.repos.role import Role


async def write_data():
    async with get_async_session(commit=True) as session:
        roles = [
            Role(id=1, name="HR-сотрудник"),
            Role(id=2, name="Сотрудник"),
        ]
        for role in roles:
            exist_role = await session.execute(select(Role).where(Role.name == role.name))
            exist_role = exist_role.scalar_one_or_none()
            if exist_role:
                continue
            session.add(role)
        await session.flush()


if __name__ == '__main__':
    asyncio.run(write_data())
