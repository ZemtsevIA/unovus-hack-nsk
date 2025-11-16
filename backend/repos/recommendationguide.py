from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from backend.db.engine import get_async_session
from backend.db.models import RecommendationGuide


class RecommendationGuideRepository:
    async def create_recommendation_guide(self, **fields) -> RecommendationGuide:
        recommendation_guide = RecommendationGuide(**fields)
        async with get_async_session(commit=True) as session:
            try:
                session.add(recommendation_guide)
                await session.flush()
                await session.refresh(recommendation_guide)
            except IntegrityError:
                raise ValueError("Error on recommendation_guide creation: recommendation_guide already exists")
            return recommendation_guide

    async def get_recommendation_guide(self, recommendation_guide_id: int) -> RecommendationGuide:
        async with get_async_session(commit=False) as session:
            recommendation_guide = await session.execute(select(RecommendationGuide).where(RecommendationGuide.id == recommendation_guide_id))
            recommendation_guide = recommendation_guide.scalar_one_or_none()
            if recommendation_guide is None:
                raise ValueError(f"RecommendationGuide {recommendation_guide_id} not found")
            return recommendation_guide

    async def get_recommendation_guides_by_user(self, user_id: int) -> list[RecommendationGuide]:
        async with get_async_session(commit=False) as session:
            recommendation_guides = await session.execute(select(RecommendationGuide).where(RecommendationGuide.user_id == user_id).order_by(RecommendationGuide.created_at))
            return recommendation_guides.scalars().all()

    async def get_all_recommendation_guides(self) -> list[RecommendationGuide]:
        async with get_async_session(commit=False) as session:
            recommendation_guides = await session.execute(select(RecommendationGuide))
            return recommendation_guides.scalars().all()

    async def update_recommendation_guide(self, recommendation_guide_id: int, **fields) -> RecommendationGuide:
        async with get_async_session(commit=True) as session:
            old_recommendation_guide = await session.execute(select(RecommendationGuide).where(RecommendationGuide.id == recommendation_guide_id))
            old_recommendation_guide = old_recommendation_guide.scalar_one_or_none()
            if old_recommendation_guide is None:
                raise ValueError(f"RecommendationGuide {recommendation_guide_id} not found")
            try:
                for field, value in fields.items():
                    setattr(old_recommendation_guide, field, value)
                await session.flush()
                await session.refresh(old_recommendation_guide)
            except IntegrityError:
                raise ValueError("Error on recommendation_guide update: recommendation_guide already exists")
            return old_recommendation_guide

    async def delete_recommendation_guide(self, recommendation_guide_id: int) -> bool:
        async with get_async_session(commit=True) as session:
            recommendation_guide = await session.execute(select(RecommendationGuide).where(RecommendationGuide.id == recommendation_guide_id))
            recommendation_guide = recommendation_guide.scalar_one_or_none()
            if recommendation_guide is None:
                raise AttributeError(f"RecommendationGuide {recommendation_guide_id} not found")
            await session.delete(recommendation_guide)
        return True

    async def markdown_guide_as_completed(self, recommendation_guide_id: int) -> RecommendationGuide:
        async with get_async_session(commit=True) as session:
            recommendation_guide = await session.execute(select(RecommendationGuide).where(RecommendationGuide.id == recommendation_guide_id))
            recommendation_guide = recommendation_guide.scalar_one_or_none()
            if recommendation_guide is None:
                raise ValueError(f"RecommendationGuide {recommendation_guide_id} not found")
            else:
                setattr(recommendation_guide, "is_actual", False)
                await session.flush()
                await session.refresh(recommendation_guide)
                return recommendation_guide


async def get_recommendation_guide_repository() -> RecommendationGuideRepository:
    return RecommendationGuideRepository()
