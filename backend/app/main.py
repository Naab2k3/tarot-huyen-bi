import os
from contextlib import asynccontextmanager
from pathlib import Path

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.config import ADMIN_PASSWORD_HASH, CORS_ORIGINS, SECRET_KEY
from app.database import Base, SessionLocal, engine
from app.routers import admin, bookings, services
from app.seed import seed_services

FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"

logger = logging.getLogger(__name__)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup checks
    if not ADMIN_PASSWORD_HASH:
        logger.warning(
            "ADMIN_PASSWORD_HASH is empty! Admin login will fail until you set it. "
            "See backend/.env.example for instructions."
        )
    if SECRET_KEY == "dev-secret-change-in-production":
        logger.warning(
            "SECRET_KEY is set to the default value! Change it in production. "
            "See backend/.env.example"
        )

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_services(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Tarot Booking API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(services.router)
app.include_router(bookings.router)
app.include_router(admin.router)

# ── Serve frontend static files (skip on Vercel — handled by CDN) ──
ON_VERCEL = os.environ.get("VERCEL", "") == "1"

if FRONTEND_DIST.exists() and not ON_VERCEL:
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str):
        # Only block true /api/* paths — everything else is SPA
        if full_path.startswith("api/"):
            from fastapi.responses import JSONResponse
            return JSONResponse({"detail": "Not Found"}, status_code=404)
        file_path = FRONTEND_DIST / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(FRONTEND_DIST / "index.html"))

    logger.info("Frontend static files mounted from %s", FRONTEND_DIST)
else:
    logger.warning("Frontend dist not found at %s — run 'npm run build' in frontend/", FRONTEND_DIST)
