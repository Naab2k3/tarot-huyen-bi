from sqlalchemy.orm import Session

from app.models import Service


def seed_services(db: Session) -> None:
    if db.query(Service).count() > 0:
        return

    services = [
        Service(
            name="Bói tình duyên",
            description="Khám phá tương lai chuyện tình cảm của bạn qua những lá bài Tarot. Luận giải sâu sắc về các mối quan hệ, cảm xúc và những điều sắp đến.",
            duration_minutes=60,
            price=300000,
        ),
        Service(
            name="Bói sự nghiệp & tài chính",
            description="Nhìn thấu con đường sự nghiệp và vận tài chính của bạn. Bài Tarot sẽ chỉ ra những cơ hội, thách thức và thời điểm thích hợp để hành động.",
            duration_minutes=60,
            price=300000,
        ),
        Service(
            name="Trải bài tổng quan cuộc sống",
            description="Một phiên trải bài toàn diện, soi chiếu mọi khía cạnh của cuộc sống: tình yêu, công việc, tài chính và tinh thần. Giúp bạn có cái nhìn tổng thể về hành trình phía trước.",
            duration_minutes=90,
            price=450000,
        ),
        Service(
            name="Giải bài chuyên sâu (theo yêu cầu)",
            description="Bạn có một câu hỏi cụ thể hoặc một vấn đề đang day dứt? Hãy mang đến và người đọc bài sẽ cùng bạn đi sâu vào trải bài chuyên biệt, giải đáp mọi thắc mắc.",
            duration_minutes=120,
            price=600000,
        ),
    ]
    db.add_all(services)
    db.commit()
