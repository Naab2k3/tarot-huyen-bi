"""APScheduler — reminder check cho booking sắp tới."""

import logging
from datetime import date, datetime, timedelta

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session

from app.config import ZALO_SCHEDULER_ENABLED, ZALO_REMINDER_HOURS_BEFORE
from app.database import SessionLocal
from app.models import Booking, BookingStatus
from app.zalo.client import get_zalo_client
from app.zalo.models import ZaloMessageLog

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


def start_scheduler():
    """Khởi động scheduler nếu Zalo OA được cấu hình."""
    if not ZALO_SCHEDULER_ENABLED:
        logger.info("Zalo reminder scheduler disabled (ZALO_SCHEDULER_ENABLED=0)")
        return

    # Kiểm tra mỗi 15 phút
    scheduler.add_job(
        check_upcoming_bookings,
        trigger="interval",
        minutes=15,
        id="zalo_reminder_check",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Zalo reminder scheduler started (check every 15 min)")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("Zalo reminder scheduler stopped")


async def check_upcoming_bookings():
    """Kiểm tra booking sắp tới và gửi reminder nếu cần.

    Chạy mỗi 15 phút, gửi reminder cho booking có:
    - status = confirmed
    - appointment trong [now + hours_before, now + hours_before + 15min]
    - chưa gửi reminder
    """
    client = get_zalo_client()
    if not client.enabled:
        return

    now = datetime.now()
    target_start = now + timedelta(hours=ZALO_REMINDER_HOURS_BEFORE)
    target_end = target_start + timedelta(minutes=15)

    db: Session | None = None
    try:
        db = SessionLocal()

        # Tìm booking cần reminder
        bookings = (
            db.query(Booking)
            .filter(
                Booking.status == BookingStatus.confirmed,
                Booking.appointment_date >= now.date(),
                Booking.appointment_date <= target_end.date(),
            )
            .all()
        )

        for booking in bookings:
            booking_dt = datetime.combine(booking.appointment_date, booking.appointment_time)

            # Check thời gian
            if not (target_start <= booking_dt <= target_end):
                continue

            # Check đã gửi reminder chưa
            already_sent = (
                db.query(ZaloMessageLog)
                .filter(
                    ZaloMessageLog.booking_id == booking.id,
                    ZaloMessageLog.message_type == "reminder",
                )
                .first()
            )
            if already_sent:
                continue

            # Gửi reminder tới admin trước (để admin biết)
            owner_id = client.get_owner_user_id()
            if owner_id:
                service_name = booking.service.name if booking.service else f"DV#{booking.service_id}"
                admin_text = (
                    f"⏰ *Nhắc lịch: {booking.customer_name}*\n"
                    f"Dịch vụ: {service_name}\n"
                    f"Giờ: {booking.appointment_time.strftime('%H:%M')} "
                    f"({booking.appointment_date.strftime('%d/%m')})"
                )
                await client.send_text(owner_id, admin_text)

            # Log reminder sent (dù gửi tới customer sau khi có user_id)
            zalo_log = ZaloMessageLog(
                booking_id=booking.id,
                message_type="reminder",
                status="sent",
                recipient_phone=booking.customer_phone,
            )
            db.add(zalo_log)
            db.commit()

            logger.info(
                "Reminder processed for booking #%d (%s %s)",
                booking.id,
                booking.customer_name,
                booking.appointment_time,
            )

    except Exception as e:
        logger.error("Error in reminder check: %s", e)
    finally:
        if db:
            db.close()
