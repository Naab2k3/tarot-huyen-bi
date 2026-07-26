import sys
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

root = Path(__file__).resolve().parent.parent
logger.info("Root: %s", root)

sys.path.insert(0, str(root / "backend"))

from dotenv import load_dotenv
load_dotenv()

from app.config import DATABASE_URL, ADMIN_PASSWORD_HASH, SECRET_KEY
from app.database import Base, SessionLocal, engine
from app.routers import admin, bookings, services
from app.seed import seed_services
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(title="Tarot Booking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(services.router)
app.include_router(bookings.router)
app.include_router(admin.router)

# Create tables & seed on cold start
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    seed_services(db)
finally:
    db.close()

# Serve frontend static files
FRONTEND_DIST = root / "frontend" / "dist"
dist_exists = FRONTEND_DIST.exists()
logger.info("FRONTEND_DIST: %s, exists: %s", FRONTEND_DIST, dist_exists)

if dist_exists:
    assets_dir = FRONTEND_DIST / "assets"
    logger.info("Assets dir: %s, exists: %s", assets_dir, assets_dir.exists())
    logger.info("index.html exists: %s", (FRONTEND_DIST / "index.html").exists())

    app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            from fastapi.responses import JSONResponse
            return JSONResponse({"detail": "Not Found"}, status_code=404)
        file_path = FRONTEND_DIST / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(FRONTEND_DIST / "index.html"))
else:
    logger.warning("FRONTEND_DIST not found at %s", FRONTEND_DIST)
    @app.get("/{full_path:path}", include_in_schema=False)
    async def not_found(full_path: str):
        from fastapi.responses import JSONResponse
        return JSONResponse({"detail": "Not Found"}, status_code=404)
