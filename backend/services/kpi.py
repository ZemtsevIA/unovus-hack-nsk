from backend.repos.kpi import KPIRepository
from backend.schemas.kpi import KPIBase, KPIGet


class KPIService:
    def __init__(self, kpi_repo: KPIRepository) -> None:
        self.kpi_repo = kpi_repo

    async def create_kpi(self, data: KPIBase) -> KPIGet:
        return KPIGet.model_validate(await self.kpi_repo.create_kpi(**data.model_dump()))

    async def get_kpi(self, kpi_id: int) -> KPIGet:
        return KPIGet.model_validate(await self.kpi_repo.get_kpi(kpi_id))

    async def get_all(self) -> list[KPIGet]:
        return [KPIGet.model_validate(kpi) for kpi in await self.kpi_repo.get_all_kpis()]

    async def get_kpis_by_user(self, user_id: int) -> list[KPIGet]:
        return [KPIGet.model_validate(kpi) for kpi in await self.kpi_repo.get_kpis_by_user(user_id)]

    async def get_kpi_median_by_department(self, hr_id: int, department: str) -> list[dict]:
        return await self.kpi_repo.get_kpi_median_by_department(hr_id, department)

    async def delete_kpi(self, kpi_id: int) -> bool:
        return await self.kpi_repo.delete_kpi(kpi_id)


async def get_kpi_service() -> KPIService:
    return KPIService(KPIRepository())
