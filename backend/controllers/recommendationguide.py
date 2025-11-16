from fastapi import APIRouter, Depends, HTTPException, status

from backend.schemas.recommendationguide import RecommendationGuideGet, RecommendationGuideBase

from backend.services.recommendationguide import RecommendationGuideService, get_recommendation_guide_service
from backend.services.user import get_current_user

router = APIRouter(prefix="/recommendation_guides", tags=["recommendation_guides"])


@router.post('/', response_model=RecommendationGuideGet)
async def create_recommendation_guide(data: RecommendationGuideBase,
                                      current_user=Depends(get_current_user),
                                      recommendation_guide_service: RecommendationGuideService = Depends(
                                          get_recommendation_guide_service)):
    try:
        return await recommendation_guide_service.create_recommendation_guide(data)

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.get('/', response_model=list[RecommendationGuideGet])
async def get_recommendation_guides(current_user=Depends(get_current_user),
                                    recommendation_guide_service: RecommendationGuideService = Depends(
                                        get_recommendation_guide_service)):
    return await recommendation_guide_service.get_all()


@router.get('/by_user/{user_id}', response_model=list[RecommendationGuideGet])
async def get_recommendation_guides_by_user(user_id: int,
                                            current_user=Depends(get_current_user),
                                            recommendation_guide_service: RecommendationGuideService = Depends(
                                                get_recommendation_guide_service)):
    return await recommendation_guide_service.get_recommendation_guides_by_user(user_id)


@router.get('/{id}', response_model=RecommendationGuideGet)
async def get_recommendation_guide(recommendation_guide_id: int,
                                   current_user=Depends(get_current_user),
                                   recommendation_guide_service: RecommendationGuideService = Depends(
                                       get_recommendation_guide_service)):
    try:
        return await recommendation_guide_service.get_recommendation_guide(recommendation_guide_id)

    except AttributeError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.get('/{recommendation_guide_id}/is_completed', response_model=RecommendationGuideGet)
async def markdown_guide_as_completed(recommendation_guide_id: int,
                                      current_user=Depends(get_current_user),
                                      recommendation_guide_service: RecommendationGuideService = Depends(
                                          get_recommendation_guide_service)
                                      ):
    try:
        return await recommendation_guide_service.markdown_guide_as_completed(recommendation_guide_id)

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )

@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_recommendation_guide(recommendation_guide_id: int,
                                      current_user=Depends(get_current_user),
                                      recommendation_guide_service: RecommendationGuideService = Depends(
                                          get_recommendation_guide_service)):
    try:
        return await recommendation_guide_service.delete_recommendation_guide(recommendation_guide_id)

    except AttributeError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )
