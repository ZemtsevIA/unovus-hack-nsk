from pydantic import BaseModel, ConfigDict
from datetime import datetime


class MetricBase(BaseModel):
    user_id: int
    emotional_score: float
    physical_score: float
    workload_score: float
    total_score: float

    model_config = ConfigDict(from_attributes=True)


class MetricGet(MetricBase):
    id: int
    created_at: datetime