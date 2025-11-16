from datetime import datetime

from pydantic import BaseModel, ConfigDict


class KPIBase(BaseModel):
    user_id: int

    kpi_rate: float
    registered_at: datetime

    model_config = ConfigDict(from_attributes=True)


class KPIGet(KPIBase):
    id: int


class KPIMedianResponse(BaseModel):
    month: str  # Формат "YYYY-MM-DD"
    median: float