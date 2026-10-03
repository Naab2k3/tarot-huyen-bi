from sqlalchemy.orm import Session

from app.models import Service


def seed_services(db: Session) -> None:
    existing = {s.name for s in db.query(Service).all()}

    services = [
        Service(
            name="Người yêu",
            description="Người yêu hiện tại có thật lòng với mình không?\nNgười ấy đang nghĩ gì về mình?\nMối quan hệ này có đi đến đâu?\nCó ai khác xen vào giữa hai đứa không?\nNgười yêu cũ có còn nhớ mình không?",
            duration_minutes=30,
            price=70000,
        ),
        Service(
            name="Tình trạng trong mối quan hệ",
            description="Tụi mình đang ở đâu trong mối quan hệ này?\nAnh ấy / cô ấy có coi mình là người quan trọng không?\nMối quan hệ này có đang đi đúng hướng không?\nCó nên tiếp tục hay dừng lại?\nĐối phương có đang giấu mình điều gì không?",
            duration_minutes=30,
            price=70000,
        ),
        Service(
            name="Bạn bè",
            description="Người bạn đó có thật sự coi mình là bạn thân không?\nCó nên tin tưởng người bạn này?\nTình bạn này có tan vỡ không?\nCó đang bị lợi dụng trong tình bạn không?\nNên hòa đồng với nhóm bạn mới hay không?",
            duration_minutes=30,
            price=70000,
        ),
        Service(
            name="Gia Đình",
            description="Gia đình mình có thực sự hiểu mình không?\nNên làm gì để cải thiện mối quan hệ với bố mẹ?\nCó nên nghe theo lời khuyên của gia đình không?\nMâu thuẫn trong gia đình có được giải quyết không?\nTương lai gia đình mình sẽ thế nào?",
            duration_minutes=30,
            price=70000,
        ),
        Service(
            name="Tỏ tình / Cầu hôn",
            description="Có nên tỏ tình với người ấy không?\nTỏ tình vào thời điểm này có thích hợp không?\nĐối phương có đáp lại tình cảm của mình không?\n Cầu hôn bây giờ có thành công không?\nKết quả của việc tỏ tình sẽ ra sao?",
            duration_minutes=30,
            price=70000,
        ),
        Service(
            name="Hôn nhân",
            description="Đây có phải là người bạn đời của mình không?\nHôn nhân của mình có hạnh phúc không?\nNên cưới vào thời gian nào là tốt nhất?\nĐối phương có phải là người chung thủy không?\nCuộc sống hôn nhân tương lai sẽ thế nào?",
            duration_minutes=30,
            price=70000,
        ),
        Service(
            name="Tiểu tam",
            description="Người ấy có đang có người thứ ba không?\nĐối phương đang giấu mình chuyện gì?\nNgười thứ ba là ai?\nMình có nên đối chất hay im lặng?\nTình cảm này có cứu vãn được không?",
            duration_minutes=30,
            price=70000,
        ),
        Service(
            name="Công việc hiện tại",
            description="Công việc hiện tại có phù hợp với mình không?\nCó nên tiếp tục gắn bó với công việc này không?\nSắp tới có thay đổi gì trong công việc không?\nĐồng nghiệp / sếp có quý mình không?\nCó cơ hội thăng tiến không?",
            duration_minutes=30,
            price=70000,
        ),
        Service(
            name="Tổng quan học tập",
            description="Ngành học này có phù hợp với mình không?\nKỳ thi này mình có đạt kết quả tốt không?\nNên tiếp tục học lên hay đi làm?\nCó nên đổi ngành / trường không?\nHọc tập của mình sẽ ra sao trong thời gian tới?",
            duration_minutes=30,
            price=70000,
        ),
        Service(
            name="Du học",
            description="Có nên đi du học không?\nDu học ở đâu là phù hợp với mình?\nDu học ngành gì thì tốt?\nĐi du học có gặp khó khăn gì không?\nKết quả của việc du học sẽ thế nào?",
            duration_minutes=30,
            price=70000,
        ),
        Service(
            name="Khám phá bản thân",
            description="Mình thực sự muốn gì trong cuộc sống này?\nĐiểm mạnh và điểm yếu của mình là gì?\nMình đang đi đúng hướng chưa?\nNên thay đổi điều gì ở bản thân?\nSứ mệnh của mình ở kiếp này là gì?",
            duration_minutes=30,
            price=70000,
        ),
    ]

    # Gói marketing hiển thị ở trang Services (frontend hardcode).
    # Thời lượng là ước lượng — chỉnh lại trong trang Admin nếu cần.
    marketing = [
        Service(
            name="Tarot - 1 vấn đề",
            description="Trải bài Tarot tập trung giải đáp 1 vấn đề bạn quan tâm nhất.",
            duration_minutes=30,
            price=200000,
        ),
        Service(
            name="Tarot - 3 vấn đề",
            description="Trải bài Tarot giải đáp 3 vấn đề trong cuộc sống của bạn.",
            duration_minutes=60,
            price=350000,
        ),
        Service(
            name="Tarot - Full vấn đề",
            description="Trải bài Tarot toàn diện, không giới hạn số vấn đề.",
            duration_minutes=60,
            price=500000,
        ),
        Service(
            name="Tarot - 30 phút",
            description="Buổi xem Tarot 30 phút, hỏi đáp trực tiếp cùng Reader.",
            duration_minutes=30,
            price=500000,
        ),
        Service(
            name="Tarot - 1 tiếng",
            description="Buổi xem Tarot 60 phút, đào sâu mọi khía cạnh bạn quan tâm.",
            duration_minutes=60,
            price=900000,
        ),
        Service(
            name="Tea Leaf - 3 tháng full",
            description="Xem bói lá trà tổng quan vận trình 3 tháng tới.",
            duration_minutes=60,
            price=250000,
        ),
        Service(
            name="Tea Leaf - 6 tháng 3 vấn đề",
            description="Xem bói lá trà 3 vấn đề trong vận trình 6 tháng tới.",
            duration_minutes=60,
            price=300000,
        ),
        Service(
            name="Tea Leaf - 6 tháng full",
            description="Xem bói lá trà toàn diện vận trình 6 tháng tới.",
            duration_minutes=60,
            price=400000,
        ),
        Service(
            name="Tea Leaf - 12 tháng full",
            description="Xem bói lá trà tổng quan cả năm, định hướng dài hạn.",
            duration_minutes=60,
            price=450000,
        ),
        Service(
            name="Grand Tableau - cơ bản",
            description="Trải bài Grand Tableau 36 lá ở mức cơ bản, cái nhìn tổng quan.",
            duration_minutes=60,
            price=350000,
        ),
        Service(
            name="Grand Tableau - nâng cao",
            description="Trải bài Grand Tableau chuyên sâu từng khía cạnh cuộc sống.",
            duration_minutes=90,
            price=500000,
        ),
        Service(
            name="Grand Tableau - VIP",
            description="Trải bài Grand Tableau VIP, phân tích chi tiết và đồng hành.",
            duration_minutes=120,
            price=1200000,
        ),
        Service(
            name="Combo Tarot + Tea Leaf",
            description="Kết hợp Tarot và Tea Leaf, góc nhìn đa chiều, tiết kiệm hơn.",
            duration_minutes=90,
            price=800000,
        ),
        Service(
            name="Combo VIP Full Tarot",
            description="Combo VIP xem full Tarot mọi vấn đề trong một buổi.",
            duration_minutes=90,
            price=1000000,
        ),
        Service(
            name="Combo VIP đầy đủ",
            description="Combo VIP đầy đủ mọi phương pháp, bức tranh toàn diện nhất.",
            duration_minutes=120,
            price=1500000,
        ),
        Service(
            name="Đá phong thủy",
            description="Tư vấn đá phong thủy hợp mệnh, thu hút năng lượng tốt.",
            duration_minutes=30,
            price=200000,
        ),
        Service(
            name="Lá số chiêu tinh",
            description="Luận lá số chiêu tinh, khám phá bản đồ năng lượng cá nhân.",
            duration_minutes=60,
            price=500000,
        ),
        Service(
            name="Bản đồ sao",
            description="Luận bản đồ sao cá nhân, định hướng tính cách và vận trình.",
            duration_minutes=60,
            price=300000,
        ),
        Service(
            name="Tử vi",
            description="Luận tử vi trọn đời, tổng quan vận hạn và định hướng.",
            duration_minutes=60,
            price=500000,
        ),
    ]

    to_add = [s for s in services + marketing if s.name not in existing]
    if to_add:
        db.add_all(to_add)
        db.commit()
