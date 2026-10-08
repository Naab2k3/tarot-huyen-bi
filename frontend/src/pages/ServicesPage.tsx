import { Link } from "react-router-dom";
import SparkleButton from "../components/SparkleButton";

const CATEGORIES = [
  {
    icon: "🃏",
    name: "Tarot",
    desc: "Dành cho những đêm bạn trăn trở: người ấy có còn thương mình? Nên ở lại hay bước tiếp? 78 lá bài sẽ cùng bạn soi rõ từng ngổn ngang.",
    items: [
      { name: "Tarot - 1 vấn đề", price: "200.000đ" },
      { name: "Tarot - 3 vấn đề", price: "350.000đ" },
      { name: "Tarot - Full vấn đề", price: "500.000đ" },
      { name: "Tarot - 30 phút", price: "500.000đ" },
      { name: "Tarot - 1 tiếng", price: "900.000đ" },
    ],
  },
  {
    icon: "🍃",
    name: "Tea Leaf",
    desc: "Như ngồi lại bên một tách trà ấm — những biểu tượng lá trà thì thầm với bạn về 3 tháng, 6 tháng, 12 tháng sắp tới.",
    items: [
      { name: "Tea Leaf - 3 tháng full", price: "250.000đ" },
      { name: "Tea Leaf - 6 tháng 3 vấn đề", price: "300.000đ" },
      { name: "Tea Leaf - 6 tháng full", price: "400.000đ" },
      { name: "Tea Leaf - 12 tháng full", price: "450.000đ" },
    ],
  },
  {
    icon: "🎴",
    name: "Grand Tableau",
    desc: "Khi bạn cần nhìn toàn cảnh cuộc đời mình — tình cảm, công việc, gia đình — tất cả hiện ra trong một trải bài sâu 36 lá.",
    items: [
      { name: "Grand Tableau - cơ bản", price: "350.000đ" },
      { name: "Grand Tableau - nâng cao", price: "500.000đ" },
      { name: "Grand Tableau - VIP", price: "1.200.000đ" },
    ],
  },
  {
    icon: "💫",
    name: "Combo ưu đãi",
    desc: "Dành cho lúc lòng mang quá nhiều điều — tình cảm rối, sự nghiệp mông lung. Một lần đi sâu, để lòng được gỡ hết nút thắt.",
    items: [
      { name: "Combo Tarot + Tea Leaf", price: "800.000đ" },
      { name: "Combo VIP Full Tarot", price: "1.000.000đ" },
      { name: "Combo VIP đầy đủ", price: "1.500.000đ" },
    ],
  },
  {
    icon: "🔮",
    name: "Dịch vụ khác",
    desc: "Bản đồ sao, tử vi, đá phong thủy… — những mảnh ghép nhỏ giúp bạn hiểu mình hơn và vững vàng hơn mỗi ngày.",
    items: [
      { name: "Đá phong thủy", price: "200.000đ" },
      { name: "Bản đồ sao", price: "300.000đ - 600.000đ" },
      { name: "Lá số chiêu tinh", price: "500.000đ" },
      { name: "Tử vi", price: "500.000đ - 1.500.000đ" },
    ],
  },
];

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
            <section key={cat.name} className="relative overflow-hidden bg-gradient-to-br from-velvet/70 via-velvet/35 to-arcane/10 border border-arcane/30 rounded-2xl p-6 md:p-8 shadow-lg shadow-arcane/10 hover:border-candle-gold/50 hover:shadow-xl hover:shadow-candle-gold/15 transition-all duration-300 group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-candle-gold/70 to-transparent" />
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-candle-gold/15 border border-candle-gold/30 shadow-lg shadow-candle-gold/10">{cat.icon}</span>
                <div>
                  <h2 className="font-display text-xl md:text-2xl tracking-wider uppercase text-mist">{cat.name}</h2>
                  <p className="font-body text-lilac/80 text-base mt-1 leading-relaxed">{cat.desc}</p>
                </div>
              </div>

              <div className="grid gap-2.5">
                {cat.items.map((item) => (
                  <Link
                    key={item.name}
                    to={`/booking?service=${encodeURIComponent(item.name)}`}
                    title="Đặt lịch dịch vụ này"
                    className="flex justify-between items-center gap-3 py-2.5 px-3 -mx-3 border-b border-velvet/40 last:border-0 rounded-lg hover:bg-velvet/30 transition-all group/item"
                  >
                    <span className="font-body text-mist text-base font-medium group-hover/item:text-candle-gold transition-colors">{item.name}</span>
                    <span className="font-display text-candle-gold text-base font-semibold tracking-wide whitespace-nowrap bg-candle-gold/15 border border-candle-gold/40 px-3.5 py-1 rounded-full">{item.price}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <section className="text-center mt-12 bg-arcane/10 border border-arcane/20 rounded-xl p-8">
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
