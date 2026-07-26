"""Zalo OA API client — gửi tin nhắn, lấy profile, quản lý token."""

import logging
from datetime import datetime, timedelta
from typing import Any

import httpx

from app.config import (
    ZALO_OA_ACCESS_TOKEN,
    ZALO_OA_REFRESH_TOKEN,
    ZALO_OA_APP_ID,
    ZALO_OA_SECRET_KEY,
    ZALO_OA_OWNER_USER_ID,
)

logger = logging.getLogger(__name__)

BASE_URL = "https://openapi.zalo.me/v2.0"


class ZaloOAClient:
    """HTTP client cho Zalo Official Account API.

    - Tự động disable nếu thiếu access_token
    - Dùng httpx.AsyncClient (non-blocking)
    - Có thể refresh token khi hết hạn
    """

    def __init__(self):
        self._token: str | None = ZALO_OA_ACCESS_TOKEN
        self._refresh_token: str | None = ZALO_OA_REFRESH_TOKEN
        self._app_id: str | None = ZALO_OA_APP_ID
        self._secret_key: str | None = ZALO_OA_SECRET_KEY
        self._owner_user_id: str | None = ZALO_OA_OWNER_USER_ID
        self._token_expires_at: datetime | None = None
        self._client: httpx.AsyncClient | None = None
        self.enabled: bool = bool(self._token)

        if not self.enabled:
            logger.info(
                "Zalo OA client disabled — set ZALO_OA_ACCESS_TOKEN in .env"
            )

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(base_url=BASE_URL, timeout=15.0)
        return self._client

    async def close(self):
        if self._client:
            await self._client.aclose()
            self._client = None

    # ── Token management ──

    async def ensure_token(self) -> str | None:
        """Trả về access token, tự refresh nếu cần."""
        if self._token is None:
            return None

        # Nếu token sắp hết hạn (còn <5 phút) và có refresh_token, refresh
        if (
            self._refresh_token
            and self._token_expires_at
            and datetime.now() >= self._token_expires_at - timedelta(minutes=5)
        ):
            await self._refresh_access_token()

        return self._token

    async def _refresh_access_token(self):
        """Gọi API refresh token."""
        if not self._refresh_token or not self._app_id or not self._secret_key:
            logger.warning("Cannot refresh Zalo OA token — missing refresh_token/app_id/secret_key")
            return

        try:
            client = await self._get_client()
            resp = await client.post(
                "https://oauth.zaloapp.com/v4/oa/access_token",
                data={
                    "refresh_token": self._refresh_token,
                    "app_id": self._app_id,
                    "grant_type": "refresh_token",
                },
            )
            data = resp.json()
            if data.get("error") == 0:
                self._token = data["access_token"]
                # expires_in unit: seconds
                self._token_expires_at = datetime.now() + timedelta(
                    seconds=data.get("expires_in", 86400)
                )
                logger.info("Zalo OA token refreshed successfully")
            else:
                logger.error("Failed to refresh Zalo OA token: %s", data.get("message"))
        except Exception as e:
            logger.error("Exception refreshing Zalo OA token: %s", e)

    # ── API calls ──

    async def send_text(
        self, user_id: str, text: str, *, quote_message_id: str | None = None
    ) -> dict[str, Any]:
        """Gửi tin nhắn text tới 1 user."""
        token = await self.ensure_token()
        if not token:
            return {"error": -1, "message": "Zalo OA not configured"}

        body: dict = {
            "recipient": {"user_id": user_id},
            "message": {"text": text},
        }
        if quote_message_id:
            body["message"]["quote_message_id"] = quote_message_id

        return await self._post("/oa/message", body)

    async def send_template(
        self, user_id: str, template_id: str, template_data: dict[str, str]
    ) -> dict[str, Any]:
        """Gửi Zalo Notification Service (ZNS) template message.

        Cần template đã được tạo trước trên Zalo OA.
        """
        token = await self.ensure_token()
        if not token:
            return {"error": -1, "message": "Zalo OA not configured"}

        body = {
            "recipient": {"user_id": user_id},
            "template_id": template_id,
            "template_data": template_data,
        }
        return await self._post("/oa/template", body)

    async def get_user_profile(self, user_id: str) -> dict[str, Any]:
        """Lấy thông tin user (tên, avatar)."""
        token = await self.ensure_token()
        if not token:
            return {"error": -1, "message": "Zalo OA not configured"}

        data = {"user_id": user_id}
        return await self._get("/oa/getprofile", data)

    async def get_followers(
        self, offset: int = 0, count: int = 50, tag: str | None = None
    ) -> dict[str, Any]:
        """Lấy danh sách follower."""
        token = await self.ensure_token()
        if not token:
            return {"error": -1, "message": "Zalo OA not configured"}

        data: dict = {"offset": offset, "count": count}
        if tag:
            data["tag_name"] = tag
        return await self._get("/oa/getfollowers", data)

    # ── Admin notification helpers ──

    async def notify_owner(self, text: str) -> dict[str, Any]:
        """Gửi thông báo tới chủ OA (admin)."""
        if not self._owner_user_id:
            logger.warning("ZALO_OA_OWNER_USER_ID not set, cannot notify owner")
            return {"error": -1, "message": "Owner user ID not configured"}
        return await self.send_text(self._owner_user_id, text)

    def get_owner_user_id(self) -> str | None:
        return self._owner_user_id

    # ── Internal HTTP ──

    async def _post(self, path: str, body: dict) -> dict[str, Any]:
        token = self._token
        if not token:
            return {"error": -1, "message": "No token"}
        client = await self._get_client()
        try:
            resp = await client.post(
                path,
                json=body,
                headers={"access_token": token, "Content-Type": "application/json"},
            )
            return resp.json()
        except Exception as e:
            logger.error("Zalo OA POST %s failed: %s", path, e)
            return {"error": -1, "message": str(e)}

    async def _get(self, path: str, params: dict) -> dict[str, Any]:
        token = self._token
        if not token:
            return {"error": -1, "message": "No token"}
        client = await self._get_client()
        try:
            resp = await client.get(
                path,
                params={"data": params},
                headers={"access_token": token},
            )
            return resp.json()
        except Exception as e:
            logger.error("Zalo OA GET %s failed: %s", path, e)
            return {"error": -1, "message": str(e)}


# ── Singleton ──
_zalo_client: ZaloOAClient | None = None


def get_zalo_client() -> ZaloOAClient:
    global _zalo_client
    if _zalo_client is None:
        _zalo_client = ZaloOAClient()
    return _zalo_client


async def close_zalo_client():
    global _zalo_client
    if _zalo_client:
        await _zalo_client.close()
        _zalo_client = None
