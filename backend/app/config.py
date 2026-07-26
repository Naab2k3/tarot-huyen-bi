import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://tarot_user:tarot_pass@localhost:5432/tarot_db",
)
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH", "")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-in-production")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:80").split(",")

# ── Zalo OA ──
ZALO_OA_ACCESS_TOKEN = os.getenv("ZALO_OA_ACCESS_TOKEN", "")
ZALO_OA_REFRESH_TOKEN = os.getenv("ZALO_OA_REFRESH_TOKEN", "")
ZALO_OA_APP_ID = os.getenv("ZALO_OA_APP_ID", "")
ZALO_OA_SECRET_KEY = os.getenv("ZALO_OA_SECRET_KEY", "")
# User ID của admin/chủ OA — để gửi thông báo lịch mới, nhắc lịch
ZALO_OA_OWNER_USER_ID = os.getenv("ZALO_OA_OWNER_USER_ID", "")

# ── Zalo Scheduler ──
ZALO_SCHEDULER_ENABLED = os.getenv("ZALO_SCHEDULER_ENABLED", "1") == "1"
ZALO_REMINDER_HOURS_BEFORE = int(os.getenv("ZALO_REMINDER_HOURS_BEFORE", "2"))

WORK_START = 9  # 09:00
WORK_END = 20   # 20:00
SLOT_INTERVAL = 30  # minutes
