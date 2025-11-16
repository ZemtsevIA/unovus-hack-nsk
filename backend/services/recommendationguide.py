from backend.repos.recommendationguide import RecommendationGuideRepository
from backend.schemas.recommendationguide import RecommendationGuideBase, RecommendationGuideGet


class RecommendationGuideService:
    def __init__(self, recommendation_guide_repo: RecommendationGuideRepository) -> None:
        self.recommendation_guide_repo = recommendation_guide_repo

    async def create_recommendation_guide(self, data: RecommendationGuideBase) -> RecommendationGuideGet:
        return RecommendationGuideGet.model_validate(await self.recommendation_guide_repo.create_recommendation_guide(**data.model_dump()))

    async def get_recommendation_guide(self, recommendation_guide_id: int) -> RecommendationGuideGet:
        return RecommendationGuideGet.model_validate(await self.recommendation_guide_repo.get_recommendation_guide(recommendation_guide_id))

    async def get_all(self) -> list[RecommendationGuideGet]:
        return [RecommendationGuideGet.model_validate(recommendation_guide) for recommendation_guide in await self.recommendation_guide_repo.get_all_recommendation_guides()]

    async def get_recommendation_guides_by_user(self, user_id: int) -> list[RecommendationGuideGet]:
        return [RecommendationGuideGet.model_validate(recommendation_guide) for recommendation_guide in await self.recommendation_guide_repo.get_recommendation_guides_by_user(user_id)]

    async def markdown_guide_as_completed(self, recommendation_guide_id: int) -> RecommendationGuideGet:
        recommendation_guide = await self.recommendation_guide_repo.markdown_guide_as_completed(recommendation_guide_id)
        return RecommendationGuideGet.model_validate(recommendation_guide)

    async def delete_recommendation_guide(self, recommendation_guide_id: int) -> bool:
        return await self.recommendation_guide_repo.delete_recommendation_guide(recommendation_guide_id)


async def get_recommendation_guide_service() -> RecommendationGuideService:
    return RecommendationGuideService(RecommendationGuideRepository())
