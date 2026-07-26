"""Business logic gửi thông báo Zalo khi booking thay đổi."""

import logging

from sqlalchemy.orm import Session

from app.models import Booking
from app.zalo.client import ZaloOAClient
from app.zalo.models import ZaloMessageLog

logger = logging.getLogger(__name__)


def _log_message(
    db: Session,
    booking_id: int,
    msg_type: str,
    status: str,
    recipient_user_id: str | None = None,
    recipient_phone: str | None = None,
    error_message: str | None = None,
    zalo_message_id: str | None = None,
):
    log = ZaloMessageLog(
        booking_id=booking_id,
        message_type=msg_type,
        status=status,
        recipient_user_id=recipient_user_id,
        recipient_phone=recipient_phone,
        error_message=error_message,
        zalo_message_id=zalo_message_id,
    )
    db.add(log)
    db.commit()
    return log


async def notify_booking_confirmation(
    client: ZaloOAClient,
    db: Session,
    booking: Booking,
    user_zalo_id: str | None = None,
):
    """Gửi xác nhận đặt lịch tới customer qua Zalo.

    Cần user_zalo_id (có được khi customer follow OA).
    Nếu không có, bỏ qua (log warning).
    """
    if not client.enabled or not user_zalo_id:
        if not user_zalo_id:
            logger.info(
                "Booking #%d: customer not linked to Zalo OA, skip confirmation",
                booking.id,
            )
        return

    service_name = booking.service.name if booking.service else f"#{booking.service_id}"
    text = (
        f"🔮 *Xác nhận đặt lịch Tarot Huyền Bí*\n\n"
        f"Xin chào {booking.customer_name},\n\n"
        f"Lịch hẹn của bạn đã được ghi nhận:\n"
        f"• Dịch vụ: {service_name}\n"
        f"• Ngày: {booking.appointment_date.strftime('%d/%m/%Y')}\n"
        f"• Giờ: {booking.appointment_time.strftime('%H:%M')}\n"
        f"• Mã đặt lịch: #{booking.id}\n\n"
        f"Vui lòng đến đúng giờ. Xin cảm ơn! 💫"
    )

    result = await client.send_text(user_zalo_id, text)
    if result.get("error") == 0:
        _log_message(
            db=db,
            booking_id=booking.id,
            msg_type="booking_confirmation",
            status="sent",
            recipient_user_id=user_zalo_id,
            recipient_phone=booking.customer_phone,
            zalo_message_id=result.get("data", {}).get("message_id"),
        )
        logger.info("Booking #%d: confirmation sent via Zalo", booking.id)
    else:
        _log_message(
            db=db,
            booking_id=booking.id,
            msg_type="booking_confirmation",
            status="failed",
            recipient_user_id=user_zalo_id,
            recipient_phone=booking.customer_phone,
            error_message=result.get("message"),
        )
        logger.warning("Booking #%d: failed to send Zalo confirmation: %s", booking.id, result.get("message"))


async def notify_admin_new_booking(
    client: ZaloOAClient, db: Session | None, booking: Booking
):
    """Thông báo cho admin (chủ OA) khi có lịch mới."""
    if not client.enabled:
        return

    owner_id = client.get_owner_user_id()
    if not owner_id:
        return

    service_name = booking.service.name if booking.service else f"#{booking.service_id}"
    text = (
        f"📅 *Lịch đặt mới*\n\n"
        f"Khách hàng: {booking.customer_name}\n"
        f"SĐT: {booking.customer_phone}\n"
        f"Dịch vụ: {service_name}\n"
        f"Ngày: {booking.appointment_date.strftime('%d/%m/%Y')}\n"
        f"Giờ: {booking.appointment_time.strftime('%H:%M')}\n"
        f"Ghi chú: {booking.note or '(không có)'}\n\n"
        f"Quản lý: /admin"
    )

    result = await client.send_text(owner_id, text)
    if result.get("error") == 0:
        _log_message(
            db=db,
            booking_id=booking.id,
            msg_type="admin_notify",
            status="sent",
            recipient_user_id=owner_id,
            zalo_message_id=result.get("data", {}).get("message_id"),
        )
        logger.info("Booking #%d: admin notified via Zalo", booking.id)
    else:
        _log_message(
            db=db,
            booking_id=booking.id,
            msg_type="admin_notify",
            status="failed",
            recipient_user_id=owner_id,
            error_message=result.get("message"),
        )
        logger.warning("Booking #%d: failed to notify admin: %s", booking.id, result.get("message"))


async def send_reminder(
    client: ZaloOAClient, db: Session, booking: Booking, user_zalo_id: str
):
    """Gửi nhắc lịch sắp tới cho customer."""
    if not client.enabled:
        return

    service_name = booking.service.name if booking.service else f"#{booking.service_id}"
    text = (
        f"⏰ *Nhắc lịch Tarot*\n\n"
        f"Xin chào {booking.customer_name},\n\n"
        f"Lịch xem Tarot của bạn sắp diễn ra:\n"
        f"• Dịch vụ: {service_name}\n"
        f"• Ngày: {booking.appointment_date.strftime('%d/%m/%Y')}\n"
        f"• Giờ: {booking.appointment_time.strftime('%H:%M')}\n\n"
        f"Hãy đến đúng giờ nhé! 🌟"
    )

    result = await client.send_text(user_zalo_id, text)
    if result.get("error") == 0:
        _log_message(
            db=db,
            booking_id=booking.id,
            msg_type="reminder",
            status="sent",
            recipient_user_id=user_zalo_id,
            zalo_message_id=result.get("data", {}).get("message_id"),
        )
    else:
        _log_message(
            db=db,
            booking_id=booking.id,
            msg_type="reminder",
            status="failed",
            recipient_user_id=user_zalo_id,
            error_message=result.get("message"),
        )
