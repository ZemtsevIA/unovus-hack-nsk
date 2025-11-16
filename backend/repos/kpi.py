import statistics
from collections import defaultdict
from datetime import datetime, UTC, timedelta

from sqlalchemy import select, and_
from sqlalchemy.exc import IntegrityError

from backend.db.engine import get_async_session
from backend.db.models import KPI, User


class KPIRepository:
    async def create_kpi(self, **fields) -> KPI:
        kpi = KPI(**fields)
        async with get_async_session(commit=True) as session:
            try:
                session.add(kpi)
                await session.flush()
                await session.refresh(kpi)
            except IntegrityError:
                raise ValueError("Error on kpi creation: kpi already exists")
            return kpi

    async def get_kpi(self, kpi_id: int) -> KPI:
        async with get_async_session(commit=False) as session:
            kpi = await session.execute(select(KPI).where(KPI.id == kpi_id))
            kpi = kpi.scalar_one_or_none()
            if kpi is None:
                raise ValueError(f"KPI {kpi_id} not found")
            return kpi

    async def get_kpis_by_user(self, user_id: int) -> list[KPI]:
        async with get_async_session(commit=False) as session:
            kpis = await session.execute(select(KPI).where(KPI.user_id == user_id).order_by(KPI.registered_at))
            return kpis.scalars().all()

    async def get_all_kpis(self) -> list[KPI]:
        async with get_async_session(commit=False) as session:
            kpis = await session.execute(select(KPI))
            return kpis.scalars().all()

    async def get_kpi_median_by_department(self, hr_id: int, department: str) -> list[dict]:
        async with get_async_session(commit=False) as session:
            users_query = select(User).where(
                and_(
                    User.hr_id == hr_id,
                    User.department == department
                )
            )
            users_result = await session.execute(users_query)
            users = users_result.scalars().all()

            if not users:
                return []

            user_ids = [user.id for user in users]

            twelve_months_ago = datetime.now(UTC) - timedelta(days=365)
            kpis_query = select(KPI).where(
                and_(
                    KPI.user_id.in_(user_ids),
                    KPI.registered_at >= twelve_months_ago
                )
            ).order_by(KPI.registered_at)

            kpis_result = await session.execute(kpis_query)
            kpis = kpis_result.scalars().all()

            kpis_by_month = defaultdict(list)

            for kpi in kpis:
                month_key = kpi.registered_at.strftime('%Y-%m')
                kpis_by_month[month_key].append(kpi.kpi_rate)

            result = []
            for month, rates in sorted(kpis_by_month.items()):
                if rates:
                    median_value = statistics.median(rates)
                    result.append({
                        'month': f"{month}-01",
                        'median': median_value
                    })

            return result

    async def update_kpi(self, kpi_id: int, **fields) -> KPI:
        async with get_async_session(commit=True) as session:
            old_kpi = await session.execute(select(KPI).where(KPI.id == kpi_id))
            old_kpi = old_kpi.scalar_one_or_none()
            if old_kpi is None:
                raise ValueError(f"KPI {kpi_id} not found")
            try:
                for field, value in fields.items():
                    setattr(old_kpi, field, value)
                await session.flush()
                await session.refresh(old_kpi)
            except IntegrityError:
                raise ValueError("Error on kpi update: kpi already exists")
            return old_kpi

    async def delete_kpi(self, kpi_id: int) -> bool:
        async with get_async_session(commit=True) as session:
            kpi = await session.execute(select(KPI).where(KPI.id == kpi_id))
            kpi = kpi.scalar_one_or_none()
            if kpi is None:
                raise AttributeError(f"KPI {kpi_id} not found")
            await session.delete(kpi)
        return True


async def get_kpi_repository() -> KPIRepository:
    return KPIRepository()
