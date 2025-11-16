from fastapi import APIRouter, Depends, HTTPException, status

from backend.schemas.kpi import KPIGet, KPIBase, KPIMedianResponse

from backend.services.kpi import KPIService, get_kpi_service
from backend.services.user import get_current_user

router = APIRouter(prefix="/kpis", tags=["kpis"])


@router.post('/', response_model=KPIGet)
async def create_kpi(data: KPIBase,
                        current_user=Depends(get_current_user),
                        kpi_service: KPIService = Depends(get_kpi_service)):
    try:
        return await kpi_service.create_kpi(data)

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.get('/', response_model=list[KPIGet])
async def get_kpis(current_user=Depends(get_current_user),
                      kpi_service: KPIService = Depends(get_kpi_service)):
    return await kpi_service.get_all()


@router.get('/by_user/{user_id}', response_model=list[KPIGet])
async def get_kpis_by_user(user_id: int,
                              current_user=Depends(get_current_user),
                              kpi_service: KPIService = Depends(get_kpi_service)):
    return await kpi_service.get_kpis_by_user(user_id)


@router.get('/{id}', response_model=KPIGet)
async def get_kpi(kpi_id: int,
                     current_user=Depends(get_current_user),
                     kpi_service: KPIService = Depends(get_kpi_service)):
    try:
        return await kpi_service.get_kpi(kpi_id)

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


@router.get('/{hr_id}/{department}/median', response_model=list[KPIMedianResponse])
async def get_kpi_median_by_department(
    hr_id: int,
    department: str,
    current_user=Depends(get_current_user),
    kpi_service: KPIService = Depends(get_kpi_service)
):
    try:
        return await kpi_service.get_kpi_median_by_department(hr_id, department)
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_kpi(kpi_id: int,
                        current_user=Depends(get_current_user),
                        kpi_service: KPIService = Depends(get_kpi_service)):
    try:
        return await kpi_service.delete_kpi(kpi_id)

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
