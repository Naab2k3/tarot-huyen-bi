from datetime import date, datetime, time

from pydantic import BaseModel, Field


# ---------- Service ----------
class ServiceOut(BaseModel):
    id: int
    name: str
    description: str
    duration_minutes: int
    price: int
    is_active: bool

    model_config = {"from_attributes": True}


class ServiceCreate(BaseModel):
    name: str
    description: str = ""
    duration_minutes: int
    price: int
    is_active: bool = True


class ServiceUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    duration_minutes: int | None = None
    price: int | None = None
    is_active: bool | None = None


# ---------- Booking ----------
class BookingCreate(BaseModel):
    service_id: int
    date: date
    time: str = Field(..., description="HH:MM format")
    customer_name: str = Field(..., min_length=1, max_length=200)
    customer_phone: str = Field(
        ...,
        min_length=10,
        max_length=15,
        pattern=r"^\+?\d{10,15}$",
        description="Phone number: 10-15 digits, optional leading +",
    )
    customer_email: str | None = None
    note: str | None = None


class BookingOut(BaseModel):
    id: int
    service_id: int
    customer_name: str
    customer_phone: str
    customer_email: str | None
    appointment_date: date
    appointment_time: time
    status: str
    note: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class BookingStatusUpdate(BaseModel):
    status: str = Field(..., pattern=r"^(confirmed|cancelled)$")


# ---------- Admin auth ----------
class AdminLogin(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
