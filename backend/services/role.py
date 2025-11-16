from backend.repos.role import RoleRepository
from backend.schemas.role import RoleBase, RoleGet


class RoleService:
    def __init__(self, role_repo: RoleRepository) -> None:
        self.role_repo = role_repo

    async def create_role(self, data: RoleBase) -> RoleGet:
        return RoleGet.model_validate(await self.role_repo.create_role(**data.model_dump()))

    async def get_role(self, role_id: int) -> RoleGet:
        return RoleGet.model_validate(await self.role_repo.get_role(role_id))

    async def get_all(self) -> list[RoleGet]:
        return [RoleGet.model_validate(role) for role in await self.role_repo.get_all_roles()]

    async def update_role(self, role_id: int, data: RoleBase) -> RoleGet:
        return RoleGet.model_validate(await self.role_repo.update_role(role_id, **data.model_dump()))

    async def delete_role(self, role_id: int) -> bool:
        return await self.role_repo.delete_role(role_id)


async def get_role_service() -> RoleService:
    return RoleService(RoleRepository())
