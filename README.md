# Tarot Huyền Bí — Website đặt lịch bói Tarot

Full-stack, self-hosted website đặt lịch hẹn bói Tarot. Xây dựng bằng FastAPI + React + PostgreSQL, đóng gói Docker Compose.

## 🚀 Chạy ngay

### Yêu cầu

- Docker & Docker Compose

### Bước 1: Clone & vào thư mục

```bash
cd tarot-booking
```

### Bước 2: Cấu hình mật khẩu admin

```bash
# Tạo bcrypt hash cho mật khẩu admin
python -c "from passlib.context import CryptContext; p=CryptContext(schemes=['bcrypt']); print(p.hash('mat-khau-cua-ban'))"

# Copy file env và sửa
cp backend/.env.example backend/.env
```

Sửa file `backend/.env`:

| Biến | Mô tả |
|---|---|
| `ADMIN_USERNAME` | Tên đăng nhập admin (mặc định: `admin`) |
| `ADMIN_PASSWORD_HASH` | **Bắt buộc.** Copy hash từ lệnh Python ở trên vào đây |
| `SECRET_KEY` | Khóa bí mật cho JWT — đổi thành chuỗi ngẫu nhiên trong production |
| `CORS_ORIGINS` | Origin được phép CORS (mặc định đã include cổng dev và production) |

> ⚠️ Nếu để `ADMIN_PASSWORD_HASH` rỗng, hệ thống dùng fallback dev: username và password phải giống nhau (không an toàn — chỉ dùng cho dev).

### Bước 3: Khởi động

```bash
docker compose up --build
```

Sau khi build và khởi động (lần đầu có thể mất vài phút):

| Service | URL |
|---|---|
| **Frontend** | [http://localhost:80](http://localhost:80) |
| **Backend API** | [http://localhost:8000](http://localhost:8000) |
| **Admin dashboard** | [http://localhost:80/admin](http://localhost:80/admin) |

### Bước 4: Seed dữ liệu mẫu

Lần đầu chạy, backend tự động seed 4 dịch vụ mẫu vào database. Bạn có thể:

- Xem danh sách dịch vụ qua API: `GET http://localhost:8000/api/services`
- Vào Admin → tab "Dịch vụ" để thêm/sửa/xóa

## 🧭 Hướng dẫn sử dụng

### Trang đặt lịch (public)

1. Mở `http://localhost:80`
2. **Bước 1:** Chọn dịch vụ Tarot
3. **Bước 2:** Chọn ngày và khung giờ trống
4. **Bước 3:** Điền thông tin liên hệ → Xác nhận
5. Nhận mã xác nhận đặt lịch

### Trang quản trị (admin)

1. Vào `http://localhost:80/admin`
2. Đăng nhập với `ADMIN_USERNAME` và mật khẩu đã cấu hình
3. **Tab Lịch hẹn:** Xem, lọc, xác nhận/hủy lịch
4. **Tab Dịch vụ:** Thêm, sửa, ẩn/hiện dịch vụ

## 🔧 Cấu trúc thư mục

```
tarot-booking/
├── docker-compose.yml          # 3 service: postgres + backend + frontend
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py             # FastAPI app & lifespan
│       ├── config.py           # Biến môi trường
│       ├── database.py         # SQLAlchemy engine & session
│       ├── models.py           # ORM models: Service, Booking
│       ├── schemas.py          # Pydantic v2 schemas
│       ├── auth.py             # JWT + bcrypt
│       ├── crud.py             # Business logic & slot availability
│       ├── seed.py             # Seed 4 dịch vụ mẫu
│       └── routers/
│           ├── services.py     # GET /api/services
│           ├── bookings.py     # GET /api/bookings/availability, POST /api/bookings
│           └── admin.py        # Admin endpoints
└── frontend/
    ├── Dockerfile
    ├── nginx.conf              # Serve SPA + proxy /api
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    ├── .env.example
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── styles/index.css    # Tailwind v4 + theme tokens
        ├── api/
        │   ├── client.ts      # API client functions
        │   └── types.ts       # TypeScript interfaces
        ├── components/
        │   ├── StarField.tsx       # Canvas starfield background
        │   ├── MoonStepper.tsx     # 3-step moon phase stepper
        │   ├── ServiceCard.tsx     # Service card with flip animation
        │   ├── Calendar.tsx        # Date picker
        │   ├── TimeSlots.tsx       # Available time slots
        │   ├── BookingForm.tsx     # Customer info form
        │   └── ConfirmationScreen.tsx  # Booking confirmation + sparkles
        └── pages/
            ├── BookingPage.tsx    # Main 3-step booking flow
            ├── AdminLogin.tsx     # Admin login form
            └── AdminDashboard.tsx # Admin dashboard (bookings + services CRUD)
```

## 🔌 API Endpoints

### Public

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/services` | Danh sách dịch vụ đang active |
| GET | `/api/bookings/availability?service_id=&date_str=YYYY-MM-DD` | Khung giờ trống |
| POST | `/api/bookings` | Tạo booking mới |

### Admin (Bearer JWT)

| Method | Path | Mô tả |
|---|---|---|
| POST | `/api/admin/login` | Đăng nhập → nhận token |
| GET | `/api/admin/bookings?status=&date=` | Danh sách booking |
| PATCH | `/api/admin/bookings/{id}` | Cập nhật trạng thái |
| DELETE | `/api/admin/bookings/{id}` | Xóa booking |
| GET | `/api/admin/services` | Danh sách dịch vụ (all) |
| POST | `/api/admin/services` | Thêm dịch vụ |
| PUT | `/api/admin/services/{id}` | Sửa dịch vụ |
| DELETE | `/api/admin/services/{id}` | Xóa dịch vụ |

## 🎨 Design System

- **Màu sắc:** Tím huyền bí (`#0B0712` → `#6E2FD9` → `#C9B6ED`) với điểm nhấn vàng nến (`#CBA135`)
- **Font:** Cinzel Decorative (heading) + Cormorant Garamond (body) — không dùng sans-serif
- **Animation:** Starfield nền canvas, moon-phase stepper, card flip, sparkle khi đặt thành công
- **Responsive:** Tối ưu mobile, tôn trọng `prefers-reduced-motion`

## 🧪 Phát triển local (không Docker)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
# Cần PostgreSQL chạy local, sửa DATABASE_URL trong .env
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📝 Ghi chú

- Không cần thanh toán online — thanh toán trực tiếp khi gặp mặt
- Không gửi email/SMS nhắc lịch (để sẵn hook nếu cần mở rộng)
- Slot availability được kiểm tra 2 lần: lúc load danh sách và lúc submit (race condition guard → HTTP 409)
- Dữ liệu booking và service lưu trong volume Docker `pgdata`
