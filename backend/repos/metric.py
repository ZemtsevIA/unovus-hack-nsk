from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from backend.db.engine import get_async_session
from backend.db.models import Metric


class MetricRepository:
    async def create_metric(self, **fields) -> Metric:
        metric = Metric(**fields)
        async with get_async_session(commit=True) as session:
            try:
                session.add(metric)
                await session.flush()
                await session.refresh(metric)
            except IntegrityError:
                raise ValueError("Error on metric creation: metric already exists")
            return metric

    async def get_metric(self, metric_id: int) -> Metric:
        async with get_async_session(commit=False) as session:
            metric = await session.execute(select(Metric).where(Metric.id == metric_id))
            metric = metric.scalar_one_or_none()
            if metric is None:
                raise AttributeError(f"Metric {metric_id} not found")
            return metric

    async def get_metrics_by_user(self, user_id: int) -> list[Metric]:
        async with get_async_session(commit=False) as session:
            metrics = await session.execute(select(Metric).where(Metric.user_id == user_id).order_by(Metric.created_at))
            return metrics.scalars().all()

    async def get_all_metrics(self) -> list[Metric]:
        async with get_async_session(commit=False) as session:
            metrics = await session.execute(select(Metric))
            return metrics.scalars().all()

    async def update_metric(self, metric_id: int, **fields) -> Metric:
        async with get_async_session(commit=True) as session:
            old_metric = await session.execute(select(Metric).where(Metric.id == metric_id))
            old_metric = old_metric.scalar_one_or_none()
            if old_metric is None:
                raise ValueError(f"Metric {metric_id} not found")
            try:
                for field, value in fields.items():
                    setattr(old_metric, field, value)
                await session.flush()
                await session.refresh(old_metric)
            except IntegrityError:
                raise ValueError("Error on metric update: metric already exists")
            return old_metric

    async def delete_metric(self, metric_id: int) -> bool:
        async with get_async_session(commit=True) as session:
            metric = await session.execute(select(Metric).where(Metric.id == metric_id))
            metric = metric.scalar_one_or_none()
            if metric is None:
                raise AttributeError(f"Metric {metric_id} not found")
            await session.delete(metric)
        return True


async def get_metric_repository() -> MetricRepository:
    return MetricRepository()
