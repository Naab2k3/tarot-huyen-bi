import { Link } from "react-router-dom";
import SparkleButton from "../components/SparkleButton";

type ItemLink =
  | { type: "booking" }
  | { type: "contact" }
  | { type: "courses" };

type ServiceItem = {
  /** Tên phải khớp từng chữ với seed DB để preselect ở trang đặt lịch */
  name: string;
  detail?: string;
  price: string;
  link: ItemLink;
};

type Category = {
  icon: string;
  name: string;
  desc: string;
  items: ServiceItem[];
};

// Nội dung theo đúng 5 bảng giá của tiệm.
const CATEGORIES: Category[] = [
  {
    icon: "⏳",
    name: "Xem theo thời gian",
    desc: "Trong 1–2 tiếng, Reader dùng tất cả các loại bài để giải đáp hết thắc mắc của bạn — cận kề, lắng nghe tâm sự và cùng bạn giải quyết vấn đề.",
    items: [
      { name: "Xem Online 1 tiếng", detail: "Gọi video, hỏi đáp trực tiếp", price: "500k /tiếng", link: { type: "booking" } },
      { name: "Xem Online 2 tiếng", detail: "Gọi video, đi sâu mọi chuyện", price: "900k /2 tiếng", link: { type: "booking" } },
      { name: "Xem Offline 1 tiếng", detail: "Gặp trực tiếp tại tiệm", price: "800k /tiếng", link: { type: "booking" } },
      { name: "Xem Offline 2 tiếng", detail: "Gặp trực tiếp, gỡ rối trọn vẹn", price: "1tr5 /2 tiếng", link: { type: "booking" } },
    ],
  },
  {
    icon: "🃏",
    name: "Tarot",
    desc: "Xem theo từng loại trải bài Tarot — từ 1 câu hỏi duy nhất tới full mọi vấn đề không giới hạn.",
    items: [
      { name: "Tarot cơ bản 1 câu hỏi", detail: "Trải bài cơ bản, tương ứng 1 câu hỏi", price: "200.000", link: { type: "booking" } },
      { name: "Tarot chuyên sâu 1 chuyện", detail: "Tình cảm, công việc, học hành, tiền tài…", price: "300.000", link: { type: "booking" } },
      { name: "Tarot full mọi vấn đề", detail: "Không giới hạn câu hỏi — bạn đặt, Reader trả lời", price: "300.000", link: { type: "booking" } },
      { name: "Tarot chuyên sâu + tư vấn 30'", detail: "Gợi ý full câu hỏi + tư vấn trong 30 phút", price: "350.000", link: { type: "booking" } },
      { name: "Xem full Tarot", detail: "Không giới hạn thời gian, được gợi ý câu hỏi", price: "450.000 /người", link: { type: "booking" } },
    ],
  },
  {
    icon: "🍃",
    name: "Tea Leaf",
    desc: "Như ngồi lại bên một tách trà ấm — lá trà thì thầm với bạn về những tháng sắp tới, từ 3 tháng tới cả năm.",
    items: [
      { name: "Tea Leaf 3 tháng full", detail: "Bài tuần / bài trà mốc thời gian gần", price: "250.000", link: { type: "booking" } },
      { name: "Tea Leaf 6 tháng 3 vấn đề", detail: "Trải bài 6 tháng, tập trung 3 vấn đề", price: "300.000", link: { type: "booking" } },
      { name: "Tea Leaf 6 tháng full", detail: "Full vấn đề trong 6 tháng", price: "400.000", link: { type: "booking" } },
      { name: "Bài trà full 12 tháng", detail: "Tổng quan cả năm", price: "450.000", link: { type: "booking" } },
      { name: "Tea Leaf 12 tháng full", detail: "Tài lộc, tiền bạc, hôn nhân, thành công, hạnh phúc, may mắn, học hành, công việc", price: "500.000", link: { type: "booking" } },
    ],
  },
  {
    icon: "🎴",
    name: "Các loại bài khác",
    desc: "Haletu, Oracle, Lenormand, The Lover, The Heart — mỗi bộ bài một thế mạnh riêng cho từng nỗi lòng.",
    items: [
      { name: "Haletu xin lời khuyên 30'", detail: "Kèm tư vấn tình cảm từ kinh nghiệm & góc nhìn của Reader", price: "300.000", link: { type: "booking" } },
      { name: "Tín hiệu vũ trụ 30'", detail: "Lời khuyên tình cảm / cuộc sống trong 30 phút", price: "300.000", link: { type: "booking" } },
      { name: "Lenormand vận mệnh", detail: "Dự đoán vận mệnh, nhìn lại quá khứ — chuỗi 3–5 lá / 1 câu hỏi", price: "250.000", link: { type: "booking" } },
      { name: "Grand Tableau 36 lá", detail: "Kể trọn câu chuyện quá khứ–hiện tại–tương lai xa, 1–2 tiếng, siêu cụ thể", price: "500.000", link: { type: "booking" } },
      { name: "Lenormand tổng quan", detail: "Cho 1 đối tượng / 1 vấn đề trong khoảng thời gian xác định", price: "300k–400k", link: { type: "booking" } },
      { name: "Oracle kết hợp", detail: "Kết hợp Tarot + Trà, vừa đặt câu hỏi vừa có mốc thời gian", price: "100.000 /câu hỏi", link: { type: "booking" } },
      { name: "Bài The Lover", detail: "Dự báo tình yêu 1–3 tháng tới, tín hiệu & chỉ dẫn tình cảm", price: "200.000", link: { type: "booking" } },
      { name: "Bài The Heart 3 lá", detail: "Lời khuyên & chỉ dẫn tình cảm trong 30 phút", price: "300.000", link: { type: "booking" } },
    ],
  },
  {
    icon: "💫",
    name: "Combo",
    desc: "Dành cho lúc lòng mang quá nhiều điều — đi sâu một lần bằng nhiều loại bài, tiết kiệm hơn mà thấu hơn.",
    items: [
      { name: "Combo Tarot + Tea Leaf 6 tháng", detail: "Trải bài vip, giới hạn thời gian", price: "700.000", link: { type: "booking" } },
      { name: "Combo VIP Full Tarot + Trà 12 tháng", detail: "Tặng bài Haletu hoặc Oracle", price: "1.000.000", link: { type: "booking" } },
      { name: "Combo Tarot + Lenormand", detail: "Được yêu thích nhất — cho tất cả mọi khúc mắc", price: "800.000", link: { type: "booking" } },
      { name: "Combo 1 chuyện all bài", detail: "Haletu, Oracle, Tarot, Tea Leaf, Lenormand… cho duy nhất 1 chuyện: tình yêu, công việc, tiền bạc, gia đình…", price: "650.000", link: { type: "booking" } },
      { name: "Combo Pro trị liệu", detail: "Full Tarot + full Trà + Haletu + Oracle + Lenormand + tư vấn tình cảm & trị liệu tâm lý (~3 tiếng, thêm giờ +450k/tiếng)", price: "1.500.000", link: { type: "booking" } },
      { name: "Combo HOT toàn diện", detail: "Full mọi loại bài, không giới hạn thời gian, bảo hành xem lại + tư vấn tình cảm miễn phí 1 tháng", price: "3.000.000", link: { type: "booking" } },
      { name: "Vấn đề đặc biệt", detail: "Người thứ 3, spell và chuyện khó nói — giá liên hệ tùy vấn đề", price: "LIÊN HỆ", link: { type: "contact" } },
    ],
  },
  {
    icon: "🔮",
    name: "Dịch vụ khác",
    desc: "Thần số học, bản đồ sao, tử vi — những mảnh ghép giúp bạn hiểu mình hơn và vững vàng hơn mỗi ngày.",
    items: [
      { name: "Thần số học", detail: "Gồm bản PDF 125 trang", price: "800.000", link: { type: "booking" } },
      { name: "Bản đồ sao vận hạn", price: "800.000", link: { type: "booking" } },
      { name: "Bản đồ sao cá nhân", price: "1.000.000", link: { type: "booking" } },
      { name: "Bản đồ sao đôi", price: "1.500.000", link: { type: "booking" } },
      { name: "Lá số chiêm tinh", price: "800.000", link: { type: "booking" } },
      { name: "Tử vi cá nhân", price: "800.000", link: { type: "booking" } },
      { name: "Tử vi xem đôi", price: "1.500.000", link: { type: "booking" } },
      { name: "Đá phong thủy", detail: "Đá, trang sức stone…", price: "LIÊN HỆ", link: { type: "contact" } },
      { name: "Dạy xem Tarot", detail: "Khóa cơ bản 5tr · Khóa nâng cao 10tr", price: "Xem khóa học", link: { type: "courses" } },
    ],
  },
];

function itemHref(item: ServiceItem): string {
  switch (item.link.type) {
    case "contact":
      return "/contact";
    case "courses":
      return "/recruit";
    default:
      return `/booking?service=${encodeURIComponent(item.name)}`;
  }
}

function itemCta(item: ServiceItem): string {
  switch (item.link.type) {
    case "contact":
      return "Liên hệ để được tư vấn";
    case "courses":
      return "Xem các khóa học";
    default:
      return "Đặt lịch dịch vụ này";
  }
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-body text-candle-gold text-sm tracking-widest uppercase mb-2">
            ✦ Điều gì đang nặng trong lòng bạn? ✦
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-mist mb-4">Chọn một nơi để trút lòng</h1>
          <p className="font-body text-lilac italic max-w-xl mx-auto">
            Mỗi trải bài là một cuộc trò chuyện riêng tư — không phán xét, chỉ có lắng nghe và gỡ rối cùng bạn.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {CATEGORIES.map((cat) => (
            <section key={cat.name} className="relative overflow-hidden bg-gradient-to-br from-velvet/70 via-velvet/35 to-arcane/10 border border-arcane/30 rounded-2xl p-4 md:p-8 shadow-lg shadow-arcane/10 hover:border-candle-gold/50 hover:shadow-xl hover:shadow-candle-gold/15 transition-all duration-300 group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-candle-gold/70 to-transparent" />
              <div className="flex items-start gap-3 md:gap-4 mb-5 md:mb-6">
                <span className="text-3xl md:text-4xl w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center rounded-2xl bg-candle-gold/15 border border-candle-gold/30 shadow-lg shadow-candle-gold/10">{cat.icon}</span>
                <div>
                  <h2 className="font-display text-xl md:text-2xl tracking-wider uppercase text-mist">{cat.name}</h2>
                  <p className="font-body text-lilac/80 text-base mt-1 leading-relaxed">{cat.desc}</p>
                </div>
              </div>

              <div className="grid gap-2.5">
                {cat.items.map((item) => (
                  <Link
                    key={item.name}
                    to={itemHref(item)}
                    title={itemCta(item)}
                    className="flex justify-between items-center gap-3 py-2.5 px-3 -mx-3 border-b border-velvet/40 last:border-0 rounded-lg hover:bg-velvet/30 transition-all group/item"
                  >
                    <span className="min-w-0">
                      <span className="block font-body text-mist text-base font-medium group-hover/item:text-candle-gold transition-colors">{item.name}</span>
                      {item.detail && (
                        <span className="block font-body text-lilac/60 text-sm mt-0.5 leading-snug">{item.detail}</span>
                      )}
                    </span>
                    <span className="font-display text-candle-gold text-sm md:text-base font-semibold tracking-wide whitespace-nowrap bg-candle-gold/15 border border-candle-gold/40 px-3 py-1 md:px-3.5 rounded-full shrink-0">{item.price}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Lưu ý phụ phí */}
        <section className="mt-10 border border-candle-gold/30 bg-candle-gold/5 rounded-2xl p-6 md:p-8">
          <h2 className="font-display text-lg md:text-xl tracking-widest uppercase text-candle-gold text-center mb-4">
            ✦ Lưu ý ✦
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-velvet/50 bg-void/40 px-4 py-3">
              <p className="font-body text-mist text-sm">Xem gấp sau 12h đêm</p>
              <p className="font-display text-candle-gold text-lg font-semibold">+50k</p>
            </div>
            <div className="rounded-xl border border-velvet/50 bg-void/40 px-4 py-3">
              <p className="font-body text-mist text-sm">Trả thẻ điện thoại</p>
              <p className="font-display text-candle-gold text-lg font-semibold">+20k</p>
            </div>
            <div className="rounded-xl border border-velvet/50 bg-void/40 px-4 py-3">
              <p className="font-body text-mist text-sm">HSSV</p>
              <p className="font-display text-candle-gold text-lg font-semibold">−50k</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mt-12 bg-arcane/10 border border-arcane/20 rounded-xl p-6 md:p-8">
          <h2 className="font-display text-xl md:text-2xl text-mist mb-3">
            Lòng đang rối, chưa biết chọn gì?
          </h2>
          <p className="font-body text-lilac italic mb-6">
            Cứ nhắn cho My — kể điều bạn đang mang, My sẽ giúp bạn chọn trải bài ôm ấp đúng nỗi lòng đó.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SparkleButton
              as="link"
              href="/booking"
              className="px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 transition-all btn-glow"
            >
              ✨ Đặt lịch ngay
            </SparkleButton>
            <SparkleButton
              as="link"
              href="/contact"
              className="px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase border border-velvet text-lilac hover:border-arcane/50 hover:text-mist transition-all"
            >
              Liên hệ tư vấn
            </SparkleButton>
          </div>
        </section>
      </div>
    </main>
  );
}
