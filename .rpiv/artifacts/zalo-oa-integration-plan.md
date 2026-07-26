# Zalo OA Integration Plan

## 1. Tổng quan

Tích hợp **Zalo Official Account (OA)** vào hệ thống đặt lịch Tarot để:
- Gửi tin nhắn xác nhận cho customer khi đặt lịch thành công
- Thông báo cho chủ OA (admin) về lịch mới
- Gửi nhắc lịch sắp tới cho customer
- Xem danh sách lịch sắp tới qua OA

## 2. Kiến trúc

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│  Frontend     │────▶│  FastAPI Backend  │────▶│  PostgreSQL   │
│  (React)      │     │  (tarot-booking)  │     │  (NeonDB)     │
└──────────────┘     └────────┬─────────┘     └───────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │  Zalo OA Module   │
                     │  (new: backend/)  │
                     ├──────────────────┤
                     │ • zalo_client.py  │
                     │ • zalo_router.py  │
                     │ • scheduler       │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │  Zalo API Server  │
                     │  openapi.zalo.me  │
                     └──────────────────┘
```

## 3. Zalo OA API — Các endpoints cần dùng

| Endpoint | Method | Mục đích |
|---|---|---|
| `/v2.0/oa/message` | POST | Gửi tin nhắn text/image tới user |
| `/v2.0/oa/getprofile` | GET | Lấy thông tin user (tên, avatar) |
| `/v2.0/oa/getfollowers` | GET | Lấy danh sách follower |
| Webhook | POST | Nhận sự kiện từ Zalo (khi user nhắn tin, follow) |

### Auth
- **OA Access Token** — lấy từ Zalo Developer Portal, gửi qua header `access_token`
- Token có hạn (mặc định ?), cần refresh định kỳ
- Lưu trong `backend/.env`: `ZALO_OA_ACCESS_TOKEN=...`
- Cần refresh token: dùng `refresh_token` hoặc API Explorer

## 4. Luồng tích hợp chi tiết

### 4.1. Khi customer đặt lịch thành công

**Trigger:** `POST /api/bookings` → thành công (HTTP 201)

```
Booking thành công
    │
    ├──▶ [Gửi ZNS cho customer]
    │     • Template: "Đặt lịch thành công"
    │     • Biến: tên khách, dịch vụ, ngày giờ, mã booking
    │     • Endpoint: POST /v2.0/oa/message
    │     • Dùng phone number → tìm user_id (hoặc gửi ZNS qua phone)
    │
    ├──▶ [Thông báo cho admin/OA]
    │     • Gửi tin nhắn text tới OA owner (user_id của admin)
    │     • Nội dung: "Lịch mới: [Tên] - [Dịch vụ] - [Giờ]"
    │     • Kèm link admin dashboard
    │
    └──▶ [Lưu log gửi tin nhắn]
          • zalo_message_log: booking_id, user_id, status, timestamp
```

### 4.2. Nhắc lịch sắp tới

**Trigger:** Scheduled job (APScheduler / Celery Beat)

```
Mỗi X phút / giờ
    │
    └──▶ Query bookings có:
          • status = confirmed
          • booking_time trong [now + 2h, now + 24h]
          • chưa gửi reminder
    │
    ├──▶ [Gửi ZNS reminder cho customer]
    │     • "Sắp đến giờ xem Tarot! Lịch của bạn lúc [giờ]"
    │     • Kèm dịch vụ, địa chỉ / link
    │
    └──▶ [Gửi thông báo cho admin]
          • "Lịch sắp tới trong 2h: [Tên] - [Dịch vụ]"
```

### 4.3. Admin xem lịch qua OA

**Trigger:** Admin nhắn tin vào OA → Webhook → Backend

```
User nhắn tin vào OA
    │
    ├──▶ Webhook POST /api/zalo/webhook
    │     • Parse nội dung tin nhắn
    │     • Kiểm tra user_id có phải admin không
    │
    ├──▶ Xử lý intent:
    │     • "lịch hôm nay" → query bookings hôm nay → gửi response
    │     • "lịch ngày mai" → query bookings ngày mai → gửi response
    │     • "lịch gần nhất" → upcoming bookings → gửi response
    │
    └──▶ Response: POST /v2.0/oa/message (trả lời tin nhắn)
          • Format danh sách lịch đẹp, dễ đọc
```

## 5. File plan

```
backend/app/
├── zalo/
│   ├── __init__.py
│   ├── client.py          # HTTP client gọi Zalo OA API
│   ├── auth.py            # Token management + refresh
│   ├── templates.py       # ZNS message templates
│   ├── models.py          # DB log model
│   └── schemas.py         # Pydantic models cho Zalo
├── routers/
│   ├── zalo_webhook.py    # Webhook endpoint
│   └── ... (existing)
├── services/
│   └── zalo_notification.py  # Business logic gửi notif
├── scheduler.py           # APScheduler cho reminder
└── main.py                # Register webhook + scheduler
```

## 6. Yêu cầu dependencies

```txt
# Thêm vào requirements.txt
httpx>=0.28.0              # Async HTTP client
apscheduler>=3.10.0        # Scheduled tasks
pydantic>=2.0.0            # (đã có)
```

## 7. Zalo Developer setup

1. Đăng ký Zalo Official Account tại https://oa.zalo.me/
2. Tạo ứng dụng tại https://developers.zalo.me/
3. Kích hoạt quyền **"Gửi tin và thông báo qua OA"**
4. Lấy **OA Access Token** từ API Explorer
5. Cấu hình **Webhook URL** → `https://domain.com/api/zalo/webhook`
6. Tạo ZNS template trên Zalo OA (cho xác nhận đặt lịch + reminder)

## 8. Implementation order

| Phase | Task | Priority |
|---|---|---|
| 1 | `zalo/client.py` — gửi text message + image | P0 |
| 2 | `zalo/auth.py` — quản lý token | P0 |
| 3 | Hook vào `crud.py` — auto gửi notif khi booking thành công | P0 |
| 4 | `zalo/templates.py` — ZNS template cho xác nhận | P1 |
| 5 | `scheduler.py` — reminder job | P1 |
| 6 | `zalo_webhook.py` — xử lý tin nhắn admin | P2 |
| 7 | Admin commands via OA ("lịch hôm nay", "lịch mai") | P2 |

## 9. Edge cases & considerations

- **Token expiry:** OA Token có hạn, cần auto-refresh
- **Rate limit:** Zalo OA giới hạn số tin nhắn/ngày (tùy loại OA)
- **User chưa follow OA:** Không gửi được ZNS → fallback SMS/email?
- **Webhook security:** Verify signature từ Zalo
- **Async:** Dùng httpx async để không block booking request
- **Booking thất bại / refund:** Gửi notif hủy lịch
