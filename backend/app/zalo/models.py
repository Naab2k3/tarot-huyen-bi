"""SQLAlchemy model cho Zalo message log."""

from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database import Base


class ZaloMessageLog(Base):
    """Ghi log mỗi lần gửi tin nhắn Zalo.

    Dùng để:
    - Audit: ai gửi, khi nào, thành công không
    - Tránh gửi reminder trùng
    """

    __tablename__ = "zalo_message_log"

    id = Column(Integer, primary_key=True)
    booking_id = Column(Integer, nullable=True, index=True)
    message_type = Column(String(50), nullable=False)  # "booking_confirmation", "reminder", "admin_notify"
    recipient_user_id = Column(String(100), nullable=True)
    recipient_phone = Column(String(20), nullable=True)
    template_id = Column(String(100), nullable=True)
    status = Column(String(20), nullable=False, default="sent")  # "sent", "failed"
    error_message = Column(Text, nullable=True)
    zalo_message_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.now)
