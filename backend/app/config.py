from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    BACKEND_HOST = os.getenv("BACKEND_HOST", "localhost")
    BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))
    BACKEND_DEBUG = os.getenv("BACKEND_DEBUG", "True").lower() in ("true", "1", "yes")

    JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    
    
    
    SQLALCHEMY_DATABASE_URI = f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    