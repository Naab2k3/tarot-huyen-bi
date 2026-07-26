from typing import Any

from pydantic import BaseModel


class ZaloMessageRequest(BaseModel):
    recipient: dict[str, str]
    message: dict[str, Any]


class ZaloMessageResponse(BaseModel):
    error: int
    message: str
    data: dict[str, Any] | None = None


class ZaloProfileResponse(BaseModel):
    error: int
    message: str
    data: dict[str, Any] | None = None


class ZaloWebhookEvent(BaseModel):
    """Incoming event from Zalo OA webhook.

    Zalo POST JSON body:
    https://developers.zalo.me/docs/official-account/v2/webhook
    """

    event_name: str = ""
    app_id: int | None = None
    user_id: str = ""
    sender: dict[str, Any] = {}
    message: dict[str, Any] = {}
    timestamp: int | None = None
    event_id: str = ""
