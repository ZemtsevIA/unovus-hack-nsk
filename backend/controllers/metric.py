from fastapi import APIRouter, Depends, HTTPException, status

from backend.schemas.metric import MetricGet, MetricBase

from backend.services.metric import MetricService, get_metric_service
from backend.services.user import get_current_user

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.post('/', response_model=MetricGet)
async def create_metric(data: MetricBase,
                        current_user=Depends(get_current_user),
                        metric_service: MetricService = Depends(get_metric_service)):
    try:
        return await metric_service.create_metric(data)

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.get('/', response_model=list[MetricGet])
async def get_metrics(current_user=Depends(get_current_user),
                      metric_service: MetricService = Depends(get_metric_service)):
    return await metric_service.get_all()


@router.get('/by_user/{user_id}', response_model=list[MetricGet])
async def get_metrics_by_user(user_id: int,
                              current_user=Depends(get_current_user),
                              metric_service: MetricService = Depends(get_metric_service)):
    return await metric_service.get_metrics_by_user(user_id)


@router.get('/{metric_id}', response_model=MetricGet)
async def get_metric(metric_id: int,
                     current_user=Depends(get_current_user),
                     metric_service: MetricService = Depends(get_metric_service)):
    try:
        return await metric_service.get_metric(metric_id)

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


@router.delete('/{metric_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_metric(metric_id: int,
                        current_user=Depends(get_current_user),
                        metric_service: MetricService = Depends(get_metric_service)):
    try:
        return await metric_service.delete_metric(metric_id)

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
