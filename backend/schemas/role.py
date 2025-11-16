from pydantic import BaseModel, ConfigDict


class RoleBase(BaseModel):
    name: str

    model_config = ConfigDict(from_attributes=True)


class RoleGet(RoleBase):
    id: int