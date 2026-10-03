import enum
from datetime import date, datetime, time

from sqlalchemy import Enum, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"


class ApplicationStatus(str, enum.Enum):
    pending = "pending"
    contacted = "contacted"
    accepted = "accepted"
    rejected = "rejected"


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    duration_minutes: Mapped[int] = mapped_column(nullable=False)
    price: Mapped[int] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, index=True)

    bookings: Mapped[list["Booking"]] = relationship(back_populates="service")


class Booking(Base):
    __tablename__ = "bookings"
    # Hot path: availability lookup filters on appointment_date + status, and
    # runs on every booking page load and again as the create-time race guard.
    __table_args__ = (
        Index("ix_bookings_date_status", "appointment_date", "status"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    service_id: Mapped[int] = mapped_column(ForeignKey("services.id"), nullable=False)
    customer_name: Mapped[str] = mapped_column(String(200), nullable=False)
    customer_phone: Mapped[str] = mapped_column(String(20), nullable=False)
    customer_email: Mapped[str] = mapped_column(String(200), nullable=True)
    appointment_date: Mapped[date] = mapped_column(nullable=False)
    appointment_time: Mapped[time] = mapped_column(nullable=False)
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="booking_status"),
        default=BookingStatus.pending,
        nullable=False,
    )
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now, index=True)

    service: Mapped["Service"] = relationship(back_populates="bookings")


class IdolApplication(Base):
    __tablename__ = "idol_applications"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(200), nullable=True)
    social_link: Mapped[str] = mapped_column(String(500), nullable=True)
    reason: Mapped[str] = mapped_column(Text, nullable=False, default="")
    experience: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, name="application_status"),
        default=ApplicationStatus.pending,
        nullable=False,
    )
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now, index=True)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(200), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now, index=True)
