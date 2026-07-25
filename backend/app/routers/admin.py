from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.auth import create_access_token, verify_password, verify_token
from app.config import ADMIN_USERNAME
from app.crud import (
    create_service,
    delete_booking,
    delete_service,
    get_all_services,
    get_bookings,
    get_service,
    update_booking_status,
    update_service,
)
from app.database import get_db
from app.schemas import (
    AdminLogin,
    BookingOut,
    BookingStatusUpdate,
    ServiceCreate,
    ServiceOut,
    ServiceUpdate,
    TokenOut,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=TokenOut)
def admin_login(body: AdminLogin):
    try:
        valid = verify_password(body.password)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    if body.username != ADMIN_USERNAME or not valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token()
    return TokenOut(access_token=token)


# ---------- Bookings ----------
@router.get("/bookings", response_model=list[BookingOut])
def list_bookings(
    status: str | None = Query(None),
    date_str: str | None = Query(None, alias="date"),
    db: Session = Depends(get_db),
    _=Depends(verify_token),
):
    date_filter = None
    if date_str:
        try:
            date_filter = date.fromisoformat(date_str)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format")
    return get_bookings(db, status_filter=status, date_filter=date_filter)


@router.patch("/bookings/{booking_id}", response_model=BookingOut)
def update_status(
    booking_id: int,
    body: BookingStatusUpdate,
    db: Session = Depends(get_db),
    _=Depends(verify_token),
):
    booking = update_booking_status(db, booking_id, body.status)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.delete("/bookings/{booking_id}", status_code=204)
def remove_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    _=Depends(verify_token),
):
    ok = delete_booking(db, booking_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Booking not found")
    return None


# ---------- Services CRUD ----------
@router.get("/services", response_model=list[ServiceOut])
def list_admin_services(
    db: Session = Depends(get_db),
    _=Depends(verify_token),
):
    return get_all_services(db)


@router.post("/services", response_model=ServiceOut, status_code=201)
def create_admin_service(
    body: ServiceCreate,
    db: Session = Depends(get_db),
    _=Depends(verify_token),
):
    return create_service(db, body.model_dump())


@router.put("/services/{service_id}", response_model=ServiceOut)
def update_admin_service(
    service_id: int,
    body: ServiceUpdate,
    db: Session = Depends(get_db),
    _=Depends(verify_token),
):
    svc = update_service(db, service_id, body.model_dump(exclude_none=True))
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    return svc


@router.delete("/services/{service_id}", status_code=204)
def delete_admin_service(
    service_id: int,
    db: Session = Depends(get_db),
    _=Depends(verify_token),
):
    try:
        ok = delete_service(db, service_id)
    except Exception:
        raise HTTPException(
            status_code=409,
            detail="Cannot delete service with existing bookings. Deactivate it instead.",
        )
    if not ok:
        raise HTTPException(status_code=404, detail="Service not found")
    return None
