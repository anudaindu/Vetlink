import logging

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
    handlers=[logging.FileHandler("backend-server.log"), logging.StreamHandler()],
)

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import Config
from app.exceptions.exception_handlers import app_exception_handler, AppException
from app.routers.auth_router import router as auth_router
from app.routers.user_router import router as user_router
from app.routers.pet_owner_profile_router import router as pet_owner_profile_router
from app.routers.vet_profile_router import router as vet_profile_router
from app.routers.pet_router import router as pet_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing the backend...")
    logger.info("Backend will run on %s:%s", Config.BACKEND_HOST, Config.BACKEND_PORT)
    # Tables are managed by Alembic: run `uv run alembic upgrade head`
    yield
    logger.info("Shutting down the backend...")


app = FastAPI(title="Vetlink Backend", lifespan=lifespan,version="1.0.0", description="Backend for Vetlink application")
app.add_exception_handler(AppException, app_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type"],
)


app.include_router(auth_router)
app.include_router(user_router)
app.include_router(pet_owner_profile_router)
app.include_router(vet_profile_router)
app.include_router(pet_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=Config.BACKEND_HOST,
        port=Config.BACKEND_PORT,
        reload=Config.BACKEND_DEBUG,
        log_level="info",
    )
