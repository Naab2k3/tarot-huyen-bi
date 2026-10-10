from sqlalchemy.orm import Session

from app.models import Service


def seed_services(db: Session) -> None:
    existing = {s.name for s in db.query(Service).all()}

    # Menu chỉ gồm đúng bảng giá mới của tiệm (không seed thêm món nào khác).
    services: list[Service] = []

    # Gói marketing hiển thị ở trang Services (frontend hardcode).
    # Tên phải khớp từng chữ với ServicesPage.tsx để preselect ở trang đặt lịch.
    # Thời lượng là ước lượng — chỉnh lại trong trang Admin nếu cần.
    marketing = [
        # ── Xem theo thời gian ──
        Service(
            name="Xem Online 1 tiếng",
            description="Gọi video 60 phút, Reader dùng mọi loại bài để giải đáp và gỡ rối cùng bạn.",
            duration_minutes=60,
            price=500000,
        ),
        Service(
            name="Xem Online 2 tiếng",
            description="Gọi video 2 tiếng, đi sâu mọi chuyện bạn đang mang trong lòng.",
            duration_minutes=120,
            price=900000,
        ),
        Service(
            name="Xem Offline 1 tiếng",
            description="Gặp trực tiếp tại tiệm trong 60 phút.",
            duration_minutes=60,
            price=800000,
        ),
        Service(
            name="Xem Offline 2 tiếng",
            description="Gặp trực tiếp 2 tiếng, gỡ rối trọn vẹn.",
            duration_minutes=120,
            price=1500000,
        ),
        # ── Tarot ──
        Service(
            name="Tarot cơ bản 1 câu hỏi",
            description="Trải bài Tarot cơ bản, tương ứng với 1 câu hỏi.",
            duration_minutes=30,
            price=200000,
        ),
        Service(
            name="Tarot chuyên sâu 1 chuyện",
            description="Trải bài chuyên sâu 1 chuyện: tình cảm, công việc, học hành, tiền tài…",
            duration_minutes=60,
            price=300000,
        ),
        Service(
            name="Tarot full mọi vấn đề",
            description="Trải bài full mọi vấn đề, không giới hạn câu hỏi — bạn đặt, Reader trả lời.",
            duration_minutes=60,
            price=300000,
        ),
        Service(
            name="Tarot chuyên sâu + tư vấn 30'",
            description="Tarot chuyên sâu gợi ý full câu hỏi + tư vấn trong vòng 30 phút.",
            duration_minutes=30,
            price=350000,
        ),
        Service(
            name="Xem full Tarot",
            description="Xem full Tarot, không giới hạn thời gian, được gợi ý câu hỏi.",
            duration_minutes=90,
            price=450000,
        ),
        # ── Tea Leaf ──
        Service(
            name="Tea Leaf 3 tháng full",
            description="Bài tuần / bài trà mốc thời gian gần — full 3 tháng.",
            duration_minutes=60,
            price=250000,
        ),
        Service(
            name="Tea Leaf 6 tháng 3 vấn đề",
            description="Trải bài Tea Leaf 6 tháng, tập trung 3 vấn đề.",
            duration_minutes=60,
            price=300000,
        ),
        Service(
            name="Tea Leaf 6 tháng full",
            description="Tea Leaf 6 tháng full vấn đề.",
            duration_minutes=60,
            price=400000,
        ),
        Service(
            name="Bài trà full 12 tháng",
            description="Bài trà tổng quan cả năm.",
            duration_minutes=60,
            price=450000,
        ),
        Service(
            name="Tea Leaf 12 tháng full",
            description="Tea Leaf 12 tháng: tài lộc, tiền bạc, hôn nhân, thành công, hạnh phúc, may mắn, học hành, công việc.",
            duration_minutes=90,
            price=500000,
        ),
        # ── Các loại bài khác ──
        Service(
            name="Haletu xin lời khuyên 30'",
            description="Trải bài Haletu + tư vấn tình cảm từ kinh nghiệm và góc nhìn của Reader trong 30 phút.",
            duration_minutes=30,
            price=300000,
        ),
        Service(
            name="Tín hiệu vũ trụ 30'",
            description="Bài tín hiệu vũ trụ / lời khuyên tình cảm và cuộc sống trong 30 phút.",
            duration_minutes=30,
            price=300000,
        ),
        Service(
            name="Lenormand vận mệnh",
            description="Lenormand dự đoán vận mệnh, nhìn lại quá khứ — chuỗi 3–5 lá / 1 câu hỏi.",
            duration_minutes=60,
            price=250000,
        ),
        Service(
            name="Grand Tableau 36 lá",
            description="Lenormand Grand Tableau 36 lá: quá khứ–hiện tại–tương lai xa, 1–2 tiếng, siêu cụ thể.",
            duration_minutes=120,
            price=500000,
        ),
        Service(
            name="Lenormand tổng quan",
            description="Trải tổng quan cho 1 đối tượng / 1 vấn đề trong khoảng thời gian xác định (giá 300–400k tùy độ sâu).",
            duration_minutes=60,
            price=300000,
        ),
        Service(
            name="Oracle kết hợp",
            description="Trải bài kết hợp Oracle (Tarot + Trà), vừa đặt câu hỏi vừa có mốc thời gian cụ thể.",
            duration_minutes=30,
            price=100000,
        ),
        Service(
            name="Bài The Lover",
            description="Chuyên dự báo tình yêu 1–3 tháng tới, tín hiệu vũ trụ và chỉ dẫn tình cảm.",
            duration_minutes=60,
            price=200000,
        ),
        Service(
            name="Bài The Heart 3 lá",
            description="Bài trái tim: lời khuyên và chỉ dẫn tình cảm 3 lá trong 30 phút.",
            duration_minutes=30,
            price=300000,
        ),
        # ── Combo ──
        Service(
            name="Combo Tarot + Tea Leaf 6 tháng",
            description="Trải bài vip combo Tarot + Tea Leaf trong vòng 6 tháng (giới hạn thời gian).",
            duration_minutes=90,
            price=700000,
        ),
        Service(
            name="Combo VIP Full Tarot + Trà 12 tháng",
            description="Combo VIP Full Tarot + Trà trong 12 tháng (tặng bài Haletu hoặc Oracle).",
            duration_minutes=120,
            price=1000000,
        ),
        Service(
            name="Combo Tarot + Lenormand",
            description="Combo được yêu thích nhất: Tarot + Lenormand cho tất cả mọi khúc mắc.",
            duration_minutes=90,
            price=800000,
        ),
        Service(
            name="Combo 1 chuyện all bài",
            description="Mọi loại bài (Haletu, Oracle, Tarot, Tea Leaf, Lenormand…) cho duy nhất 1 chuyện.",
            duration_minutes=90,
            price=650000,
        ),
        Service(
            name="Combo Pro trị liệu",
            description="Full Tarot + full Trà + Haletu + Oracle + Lenormand + tư vấn tình cảm & trị liệu tâm lý (~3 tiếng, thêm giờ +450k/tiếng).",
            duration_minutes=180,
            price=1500000,
        ),
        Service(
            name="Combo HOT toàn diện",
            description="Full mọi loại bài, không giới hạn thời gian, bảo hành xem lại + tư vấn tình cảm miễn phí 1 tháng.",
            duration_minutes=120,
            price=3000000,
        ),
        # ── Dịch vụ khác (đặt lịch được) ──
        Service(
            name="Thần số học",
            description="Luận thần số học, gồm bản PDF 125 trang.",
            duration_minutes=60,
            price=800000,
        ),
        Service(
            name="Bản đồ sao vận hạn",
            description="Luận bản đồ sao vận hạn.",
            duration_minutes=60,
            price=800000,
        ),
        Service(
            name="Bản đồ sao cá nhân",
            description="Luận bản đồ sao cá nhân.",
            duration_minutes=60,
            price=1000000,
        ),
        Service(
            name="Bản đồ sao đôi",
            description="Luận bản đồ sao đôi.",
            duration_minutes=90,
            price=1500000,
        ),
        Service(
            name="Lá số chiêm tinh",
            description="Luận lá số chiêm tinh.",
            duration_minutes=60,
            price=800000,
        ),
        Service(
            name="Tử vi cá nhân",
            description="Luận tử vi cá nhân.",
            duration_minutes=60,
            price=800000,
        ),
        Service(
            name="Tử vi xem đôi",
            description="Lá số tử vi xem đôi.",
            duration_minutes=90,
            price=1500000,
        ),
    ]

    # Menu cũ không còn trong bảng giá mới -> tắt (không xóa cứng để giữ lịch sử).
    # Chỉ chạm tới đúng các tên do seed tạo ra trước đây, không đụng dịch vụ
    # admin tự thêm tay.
    OLD_MARKETING_NAMES = {
        "Tarot - 1 vấn đề",
        "Tarot - 3 vấn đề",
        "Tarot - Full vấn đề",
        "Tarot - 30 phút",
        "Tarot - 1 tiếng",
        "Tea Leaf - 3 tháng full",
        "Tea Leaf - 6 tháng 3 vấn đề",
        "Tea Leaf - 6 tháng full",
        "Tea Leaf - 12 tháng full",
        "Grand Tableau - cơ bản",
        "Grand Tableau - nâng cao",
        "Grand Tableau - VIP",
        "Combo Tarot + Tea Leaf",
        "Combo VIP Full Tarot",
        "Combo VIP đầy đủ",
        "Đá phong thủy",
        "Lá số chiêu tinh",
        "Bản đồ sao",
        "Tử vi",
        # Món xem theo chủ đề cũ (không còn trong bảng giá mới)
        "Người yêu",
        "Tình trạng trong mối quan hệ",
        "Bạn bè",
        "Gia Đình",
        "Tỏ tình / Cầu hôn",
        "Hôn nhân",
        "Tiểu tam",
        "Công việc hiện tại",
        "Tổng quan học tập",
        "Du học",
        "Khám phá bản thân",
    }

    to_add = [s for s in services + marketing if s.name not in existing]
    if to_add:
        db.add_all(to_add)

    for s in db.query(Service).all():
        if s.name in OLD_MARKETING_NAMES and s.name not in {m.name for m in marketing}:
            s.is_active = False
    db.commit()
