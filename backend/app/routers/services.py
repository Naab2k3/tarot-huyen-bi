from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.crud import get_active_services
from app.database import get_db
from app.schemas import ServiceOut

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("", response_model=list[ServiceOut])
def list_services(db: Session = Depends(get_db)):
    return get_active_services(db)
