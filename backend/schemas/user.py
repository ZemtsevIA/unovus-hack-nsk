from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    email: str
    password: str


class UserRegister(UserBase):
    username: str | None = None
    password_confirm: str


class UserGet(BaseModel):
    id: int
    email: str
    username: str | None = None
    department: str | None = None
    role_id: int | None = None
    hr_id: int | None = None

    employment_at: datetime | None = None
    last_vacation_at: datetime | None = None
    last_sickness_at: datetime | None = None

    is_participant_corp_activities: bool = False
    is_certified: bool | None = None
    is_trained: bool | None = None

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    email: str | None = None
    username: str | None = None
    department: str | None = None
    role_id: int | None = None
    hr_id: int | None = None

    employment_at: datetime | None = None
    last_vacation_at: datetime | None = None
    last_sickness_at: datetime | None = None

    is_participant_corp_activities: bool = False
    is_certified: bool | None = None
    is_trained: bool | None = None

    model_config = ConfigDict(from_attributes=True)
