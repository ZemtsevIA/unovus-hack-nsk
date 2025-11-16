# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Копируем зависимости из подпроекта backend
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Копируем alembic.ini и весь backend-пакет внутрь контейнера
COPY alembic.ini ./alembic.ini
COPY backend ./backend

EXPOSE 8000

# Запускаем FastAPI-приложение как backend.main:app
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
