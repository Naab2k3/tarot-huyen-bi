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

    to_add = [s for s in services if s.name not in existing]
    if to_add:
        db.add_all(to_add)
        db.commit()
