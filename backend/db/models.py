from sqlalchemy import ForeignKey, DateTime, func, ARRAY, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from backend.db.engine import Base, uniq_str, text_t, text_tnn


class Role(Base):
    name: Mapped[uniq_str]


class User(Base):
    username: Mapped[str | None]
    password_hash: Mapped[str]
    email: Mapped[str]
    department: Mapped[text_t]

    employment_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    last_vacation_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_sickness_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    is_participant_corp_activities: Mapped[bool] = mapped_column(Boolean, default=False)
    is_certified: Mapped[bool | None]
    is_trained: Mapped[bool | None]

    role_id: Mapped[int | None] = mapped_column(ForeignKey('roles.id'))
    hr_id: Mapped[int | None] = mapped_column(ForeignKey('users.id'), nullable=True)


class Metric(Base):
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))

    emotional_score: Mapped[float]
    physical_score: Mapped[float]
    workload_score: Mapped[float]
    total_score: Mapped[float]

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),
                                                 server_default=func.now())


class RecommendationGuide(Base):
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))

    title: Mapped[uniq_str]
    summary: Mapped[text_tnn]
    description: Mapped[text_tnn]
    category: Mapped[text_t]
    benefits: Mapped[list[str]] = mapped_column(ARRAY(String))

    is_actual: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class KPI(Base):
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))

    kpi_rate: Mapped[float]
    registered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
