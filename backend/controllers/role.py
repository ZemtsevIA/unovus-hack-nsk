from fastapi import APIRouter, Depends, HTTPException, status

from backend.schemas.role import RoleGet, RoleBase

from backend.services.role import RoleService, get_role_service
from backend.services.user import get_current_user

router = APIRouter(prefix="/roles", tags=["roles"])


@router.post('/', response_model=RoleGet)
async def create_role(data: RoleBase,
                      current_user=Depends(get_current_user),
                      role_service: RoleService = Depends(get_role_service)):
    try:
        return await role_service.create_role(data)

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.get('/', response_model=list[RoleGet])
async def get_roles(role_service: RoleService = Depends(get_role_service)):
    return await role_service.get_all()


@router.get('/{role_id}', response_model=RoleGet)
async def get_role(role_id: int,
                   current_user=Depends(get_current_user),
                   role_service: RoleService = Depends(get_role_service)):
    try:
        return await role_service.get_role(role_id)

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


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_role(role_id: int,
                      current_user=Depends(get_current_user),
                      role_service: RoleService = Depends(get_role_service)):
    try:
        return await role_service.delete_role(role_id)

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
