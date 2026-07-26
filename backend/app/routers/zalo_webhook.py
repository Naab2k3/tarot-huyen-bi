"""Webhook endpoint cho Zalo OA — nhận sự kiện và xử lý."""

import hashlib
import hmac
import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.config import ZALO_OA_SECRET_KEY, ZALO_OA_APP_ID
from app.database import get_db
from app.models import Booking
from app.zalo.client import get_zalo_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/zalo", tags=["zalo"])


def verify_signature(payload: bytes, signature: str | None) -> bool:
    """Xác thực webhook signature từ Zalo.

    Zalo dùng HMAC-SHA256 với secret_key của app.
    """
    if not signature or not ZALO_OA_SECRET_KEY:
        # Không có secret key → bỏ qua verify (dev mode)
        return True
    expected = hmac.new(
        ZALO_OA_SECRET_KEY.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


def parse_user_id_from_event(event: dict) -> str | None:
    """Trích xuất user_id từ event webhook."""
    # Các location khác nhau của user_id
    if event.get("sender"):
        return event["sender"].get("id")
    if event.get("user_id"):
        return event["user_id"]
    return None


def parse_message_text(event: dict) -> str | None:
    """Trích xuất nội dung text từ event."""
    msg = event.get("message", {})
    return msg.get("text") or None


def format_bookings_list(bookings: list[Booking], title: str) -> str:
    """Format danh sách booking thành text gửi Zalo."""
    if not bookings:
        return f"📭 *{title}*\n\nKhông có lịch nào."

    lines = [f"📋 *{title}* ({len(bookings)} lịch):\n"]
    for b in bookings:
        service_name = b.service.name if b.service else f"DV#{b.service_id}"
        lines.append(
            f"• #{b.id} — {b.customer_name}\n"
            f"  {b.appointment_date.strftime('%d/%m')} "
            f"{b.appointment_time.strftime('%H:%M')}\n"
            f"  {service_name} [{b.status}]\n"
        )
    return "\n".join(lines)


@router.post("/webhook")
async def zalo_webhook(request: Request, db: Session = Depends(get_db)):
    """Nhận sự kiện từ Zalo OA.

    Zalo gửi POST với JSON body khi có:
    - User nhắn tin vào OA
    - User follow OA
    - Các sự kiện khác
    """
    # Verify signature
    payload = await request.body()
    sig = request.headers.get("x-zalo-signature") or request.headers.get("signature")
    if not verify_signature(payload, sig):
        logger.warning("Zalo webhook: invalid signature")
        raise HTTPException(status_code=403, detail="Invalid signature")

    try:
        event = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    event_name = event.get("event_name", "")
    user_id = parse_user_id_from_event(event)

    logger.debug("Zalo webhook event: %s user=%s", event_name, user_id)

    if event_name in ("user_send_text", "user_send_image", "user_send_sticker", "message"):
        return await handle_user_message(event, user_id, db)

    # user_follow → có thể lưu user_id để gửi notif sau
    if event_name == "follow":
        logger.info("Zalo: user %s followed the OA", user_id)

    # Trả về success để Zalo biết đã nhận
    return {"error": 0, "message": "OK"}


async def handle_user_message(event: dict, user_id: str | None, db: Session):
    """Xử lý khi user nhắn tin vào OA.

    Hỗ trợ các lệnh text từ admin:
    - "lịch hôm nay", "lịch ngày mai", "lịch gần nhất"
    - "help" — hướng dẫn
    """
    if not user_id:
        return {"error": 0, "message": "OK"}

    text = parse_message_text(event)
    if not text:
        return {"error": 0, "message": "OK"}

    text = text.lower().strip()

    # Kiểm tra nếu user là owner (admin)
    client = get_zalo_client()
    owner_id = client.get_owner_user_id()
    is_admin = owner_id and user_id == owner_id

    commands = {
        "help": "Xem hướng dẫn",
        "lịch hôm nay": "today",
        "lịch ngày mai": "tomorrow",
        "lịch gần nhất": "upcoming",
        "lịch gần đây": "upcoming",
        "lịch chờ xác nhận": "pending",
        "lịch hôm qua": "yesterday",
    }

    intent = None
    for keyword, action in commands.items():
        if text == keyword or text.startswith(keyword):
            intent = action
            break

    if not intent:
        if is_admin:
            await client.send_text(
                user_id,
                "📌 *Hướng dẫn:*\n\n"
                "• `lịch hôm nay` — Xem lịch hôm nay\n"
                "• `lịch ngày mai` — Xem lịch ngày mai\n"
                "• `lịch gần nhất` — Lịch sắp tới\n"
                "• `lịch chờ xác nhận` — Lịch pending\n"
                "• `help` — Hướng dẫn này",
            )
        return {"error": 0, "message": "OK"}

    # Chỉ admin mới được xem lịch
    if not is_admin:
        logger.info("Zalo: non-admin user %s tried to access bookings", user_id)
        return {"error": 0, "message": "OK"}

    from datetime import date, datetime, timedelta

    today = date.today()

    if intent == "today":
        bookings = (
            db.query(Booking)
            .filter(Booking.appointment_date == today)
            .order_by(Booking.appointment_time)
            .all()
        )
        reply = format_bookings_list(bookings, "Lịch hôm nay")
        await client.send_text(user_id, reply)

    elif intent == "tomorrow":
        tomorrow = today + timedelta(days=1)
        bookings = (
            db.query(Booking)
            .filter(Booking.appointment_date == tomorrow)
            .order_by(Booking.appointment_time)
            .all()
        )
        reply = format_bookings_list(bookings, "Lịch ngày mai")
        await client.send_text(user_id, reply)

    elif intent == "upcoming":
        now = datetime.now()
        bookings = (
            db.query(Booking)
            .filter(
                Booking.appointment_date >= now.date(),
                Booking.status != "cancelled",
            )
            .order_by(Booking.appointment_date, Booking.appointment_time)
            .limit(10)
            .all()
        )
        reply = format_bookings_list(bookings, "Lịch sắp tới")
        await client.send_text(user_id, reply)

    elif intent == "pending":
        bookings = (
            db.query(Booking)
            .filter(Booking.status == "pending")
            .order_by(Booking.appointment_date, Booking.appointment_time)
            .all()
        )
        reply = format_bookings_list(bookings, "Lịch chờ xác nhận")
        await client.send_text(user_id, reply)

    elif intent == "yesterday":
        yesterday = today - timedelta(days=1)
        bookings = (
            db.query(Booking)
            .filter(Booking.appointment_date == yesterday)
            .order_by(Booking.appointment_time)
            .all()
        )
        reply = format_bookings_list(bookings, "Lịch hôm qua")
        await client.send_text(user_id, reply)

    return {"error": 0, "message": "OK"}


@router.get("/webhook")
async def verify_webhook(request: Request):
    """Zalo gửi GET để verify webhook URL.

    Trả về echo đúng challenge param.
    """
    # Zalo thường gửi querystring: ?challenge=xxx
    challenge = request.query_params.get("challenge")
    if challenge:
        return int(challenge)

    # Một số phiên bản dùng 'echostr'
    echostr = request.query_params.get("echostr")
    if echostr:
        return echostr

    return {"error": 0, "message": "OK"}
