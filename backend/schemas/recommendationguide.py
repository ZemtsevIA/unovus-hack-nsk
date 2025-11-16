from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RecommendationGuideBase(BaseModel):
    user_id: int

    title: str
    summary: str
    description: str
    category: str
    benefits: list[str] = []
    is_actual: bool = True

    model_config = ConfigDict(from_attributes=True)


class RecommendationGuideGet(RecommendationGuideBase):
    id: int
    created_at: datetime
