import sys
from pathlib import Path

# Backend path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from dotenv import load_dotenv
load_dotenv()

# Import the full app (API + frontend serving via main.py)
from app.main import app
