from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.controllers.user import router as user_router
from backend.controllers.role import router as role_router
from backend.controllers.metric import router as metric_router
from backend.controllers.recommendationguide import router as guide_router
from backend.controllers.kpi import router as kpi_router

app = FastAPI()
app.include_router(user_router)
app.include_router(role_router)
app.include_router(metric_router)
app.include_router(guide_router)
app.include_router(kpi_router)

origins = [
    settings.frontend_host,                 # e.g. http://localhost:3000
    "http://localhost:3000",              # явное значение для дев-сервера
    "https://it-academy-is.space",
    "https://www.it-academy-is.space",
    "https://academus-pobeda.ru",
    "https://www.academus-pobeda.ru",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == '__main__':
    import uvicorn

    if settings.port:
        uvicorn.run(app, host=settings.host, port=settings.port)
    else:
        uvicorn.run(app, host=settings.host)
