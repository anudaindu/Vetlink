import logging

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
    handlers=[logging.FileHandler("backend-server.log"), logging.StreamHandler()],
)

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import Config
from app.database.connection import init_db
from app.exceptions.exception_handlers import app_exception_handler, AppException
from app.routers.auth_router import router as auth_router
from app.routers.user_router import router as user_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing the backend...")
    logger.info("Backend will run on %s:%s", Config.BACKEND_HOST, Config.BACKEND_PORT)
    init_db()
    logger.info("Database ready.")
    yield
    logger.info("Shutting down the backend...")


app = FastAPI(title="Vetlink Backend", lifespan=lifespan,version="1.0.0", description="Backend for Vetlink application")
app.add_exception_handler(AppException, app_exception_handler)


app.include_router(auth_router)
app.include_router(user_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=Config.BACKEND_HOST,
        port=Config.BACKEND_PORT,
        reload=Config.BACKEND_DEBUG,
        log_level="info",
    )
