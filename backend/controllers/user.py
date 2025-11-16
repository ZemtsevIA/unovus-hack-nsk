from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from backend.schemas.user import UserGet, UserRegister, UserUpdate
from backend.schemas.token import TokenPair

from backend.services.user import UserService, get_user_service, get_current_user
from backend.services.security import create_access_token, get_email_from_refresh

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserGet)
async def register(
        user_data: UserRegister,
        service: UserService = Depends(get_user_service)
):
    try:
        return await service.create_user(user_data)

    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=str(error))

    except AttributeError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=str(error))

    except Exception as error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=str(error))


@router.post("/login", response_model=TokenPair)
async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        service: UserService = Depends(get_user_service)
):
    try:
        return await service.login_user(form_data.username, form_data.password)

    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=str(error))

    except AttributeError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=str(error))

    except Exception as error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=str(error))


@router.post("/refresh", response_model=TokenPair)
async def refresh_tokens(
        refresh_token: str,
        service: UserService = Depends(get_user_service)
):
    user = await service.get_user_by_email(await get_email_from_refresh(refresh_token))

    return TokenPair(
        access_token=await create_access_token(data={"sub": user.email}),
        refresh_token=refresh_token,
        token_type="bearer"
    )


@router.get("/", response_model=list[UserGet])
async def get_all_users(
        current_user: UserGet = Depends(get_current_user),
        service: UserService = Depends(get_user_service)
):
    """Получить всех пользователей (требуется аутентификация)"""
    try:
        return await service.get_all()
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.get("/me", response_model=UserGet)
async def get_current_user_info(
        current_user: UserGet = Depends(get_current_user)
):
    """Получить информацию о текущем пользователе"""
    return current_user


@router.get("/{user_id}", response_model=UserGet)
async def get_user_by_id(
        user_id: int,
        current_user: UserGet = Depends(get_current_user),
        service: UserService = Depends(get_user_service)
):
    """Получить пользователя по ID (требуется аутентификация)"""
    try:
        return await service.get_user_by_id(user_id)
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


@router.put("/{user_id}", response_model=UserGet)
async def update_user(
        user_id: int,
        user_data: UserUpdate,
        current_user: UserGet = Depends(get_current_user),
        service: UserService = Depends(get_user_service)
):
    """Обновить пользователя по ID (требуется аутентификация)"""
    try:
        # Проверяем, что пользователь обновляет только свой профиль
        if current_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only update your own profile"
            )

        return await service.update_user(user_id, user_data)
    except HTTPException:
        raise
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
        user_id: int,
        current_user: UserGet = Depends(get_current_user),
        service: UserService = Depends(get_user_service)
):
    """Удалить пользователя по ID (требуется аутентификация)"""
    try:
        # Проверяем, что пользователь удаляет только свой профиль
        if current_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only delete your own profile"
            )

        await service.delete_user(user_id)
        return None
    except HTTPException:
        raise
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )

@router.get("/hr/employees", response_model=list[UserGet])
async def get_my_employees(
        current_hr: UserGet = Depends(get_current_user),
        service: UserService = Depends(get_user_service)
):
    """Получить всех сотрудников текущего HR"""
    try:
        return await service.get_employees_by_hr(current_hr.id)
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.get("/{user_id}/hr", response_model=UserGet)
async def get_user_hr(
        user_id: int,
        current_user: UserGet = Depends(get_current_user),
        service: UserService = Depends(get_user_service)
):
    """Получить HR пользователя"""
    try:
        hr = await service.get_hr_by_employee(user_id)
        if not hr:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="HR not found for this user"
            )
        return hr
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.post("/hr/employees", status_code=status.HTTP_200_OK)
async def assign_employees_to_hr(
        employee_ids: list[int],
        current_hr: UserGet = Depends(get_current_user),
        service: UserService = Depends(get_user_service)
):
    """Назначить сотрудников текущему HR"""
    try:
        await service.assign_employees_to_hr(current_hr.id, employee_ids)
        return {"message": "Employees assigned successfully"}
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.post("/hr/employees/by_email", status_code=status.HTTP_200_OK)
async def assign_employee_to_hr_by_email(email: str,
                                         service: UserService = Depends(get_user_service),
                                         current_hr: UserGet = Depends(get_current_user)):
    email_user = await service.get_user_by_email(email)
    if not email_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Email not found for this user")
    try:
        await service.assign_employees_to_hr(current_hr.id, [email_user.id])
        return {"message": "Employee assigned successfully"}
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.delete("/hr/employees", status_code=status.HTTP_200_OK)
async def unassign_employees_from_hr(
        employee_ids: list[int],
        current_hr: UserGet = Depends(get_current_user),
        service: UserService = Depends(get_user_service)
):
    """Убрать привязку сотрудников от HR"""
    try:
        await service.unassign_employees_from_hr(employee_ids)
        return {"message": "Employees unassigned successfully"}
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )