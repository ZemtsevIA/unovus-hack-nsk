from backend.repos.metric import MetricRepository
from backend.schemas.metric import MetricBase, MetricGet


class MetricService:
    def __init__(self, metric_repo: MetricRepository) -> None:
        self.metric_repo = metric_repo

    async def create_metric(self, data: MetricBase) -> MetricGet:
        return MetricGet.model_validate(await self.metric_repo.create_metric(**data.model_dump()))

    async def get_metric(self, metric_id: int) -> MetricGet:
        return MetricGet.model_validate(await self.metric_repo.get_metric(metric_id))

    async def get_all(self) -> list[MetricGet]:
        return [MetricGet.model_validate(metric) for metric in await self.metric_repo.get_all_metrics()]

    async def get_metrics_by_user(self, user_id: int) -> list[MetricGet]:
        return [MetricGet.model_validate(metric) for metric in await self.metric_repo.get_metrics_by_user(user_id)]

    async def delete_metric(self, metric_id: int) -> bool:
        return await self.metric_repo.delete_metric(metric_id)


async def get_metric_service() -> MetricService:
    return MetricService(MetricRepository())
