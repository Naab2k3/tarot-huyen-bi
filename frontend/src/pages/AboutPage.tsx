import { Link } from "react-router-dom";
import CountUp from "../components/CountUp";
import SparkleButton from "../components/SparkleButton";

const VALUES = [
  {
    icon: "🌙",
    title: "Chân thực",
    desc: "Chúng tôi đọc bài với trái tim thành thật, không phóng đại, không che giấu.",
  },
  {
    icon: "💜",
    title: "Đồng cảm",
    desc: "Mỗi buổi xem là một cuộc trò chuyện. Chúng tôi lắng nghe và thấu hiểu bạn.",
  },
  {
    icon: "✨",
    title: "Trao quyền",
    desc: "Bài đọc giúp bạn tự tin hơn với lựa chọn của mình, không phụ thuộc.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-body text-candle-gold text-sm tracking-widest uppercase mb-2">
            ✦ Về chúng tôi ✦
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-mist mb-4">Giới thiệu</h1>
        </div>

        {/* Hero image area — placeholder for the brand visual */}
        <div className="w-40 h-40 mx-auto mb-10 rounded-full bg-velvet/60 border border-velvet flex items-center justify-center">
          <span className="font-logo text-candle-gold text-xs tracking-widest uppercase text-center leading-relaxed">
            Healing<br />With<br />My
          </span>
        </div>

        {/* Story */}
        <section className="mb-16">
          <h2 className="font-display text-xl md:text-2xl text-mist mb-4">
            Câu chuyện của Healing With My
          </h2>
          <div className="space-y-4 font-body text-lilac leading-relaxed">
            <p>
              Healing With My ra đời từ niềm đam mê sâu sắc với huyền học và mong muốn kết nối con người với năng lượng vũ trụ.
              Chúng tôi tin rằng mỗi người đều mang trong mình một hành trình độc đáo, và các lá bài chỉ là chiếc gương phản chiếu con đường đó.
            </p>
            <p>
              Với hơn <strong className="text-mist">3 năm kinh nghiệm</strong> trong lĩnh vực Tarot, Tea Leaf và các phương pháp huyền học,
              chúng tôi đã đồng hành cùng hơn <strong className="text-mist">500 khách hàng</strong> tìm kiếm sự rõ ràng trong tình cảm,
              sự nghiệp và cuộc sống.
            </p>
            <p className="italic text-mist">
              Chúng tôi không tiên đoán số phận. Chúng tôi giúp bạn hiểu rõ năng lượng hiện tại và đưa ra quyết định sáng suốt hơn
              cho tương lai của chính mình.
            </p>
          </div>
        </section>

        {/* Core values */}
        <section className="mb-16">
          <h2 className="font-display text-xl md:text-2xl text-mist text-center mb-8">
            Giá trị cốt lõi
          </h2>
          <div className="grid gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-velvet/40 border border-velvet rounded-xl p-6 flex items-start gap-4">
                <span className="text-3xl shrink-0">{v.icon}</span>
                <div>
                  <h3 className="font-display text-base tracking-wider uppercase text-mist mb-1">{v.title}</h3>
                  <p className="font-body text-lilac/70">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Meet My */}
        <section className="mb-16">
          <h2 className="font-display text-xl md:text-2xl text-mist text-center mb-8">
            Người sáng lập
          </h2>
          <div className="bg-velvet/40 border border-velvet rounded-xl p-6 md:p-8 text-center max-w-lg mx-auto">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-arcane/20 border border-arcane/30 flex items-center justify-center">
              <span className="font-logo text-candle-gold text-sm">My</span>
            </div>
            <h3 className="font-display text-lg text-mist mb-1">My</h3>
            <p className="font-body text-candle-gold text-sm tracking-wide uppercase mb-3">Tarot Reader · Tea Leaf Artist</p>
            <p className="font-body text-lilac/70 text-sm leading-relaxed">
              Với hơn 3 năm nghiên cứu và thực hành Tarot, Tea Leaf, Oracle cùng Grand Tableau.
              My kết hợp trực giác và kiến thức huyền học để mang đến những bài đọc sâu sắc và ý nghĩa.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-3 gap-6 text-center bg-velvet/40 border border-velvet rounded-xl p-8">
            <div>
              <p className="font-display text-3xl text-candle-gold"><CountUp end={3} suffix="+" /></p>
              <p className="font-body text-lilac/60 text-sm">năm kinh nghiệm</p>
            </div>
            <div>
              <p className="font-display text-3xl text-candle-gold"><CountUp end={500} suffix="+" /></p>
              <p className="font-body text-lilac/60 text-sm">khách hàng</p>
            </div>
            <div>
              <p className="font-display text-3xl text-candle-gold"><CountUp end={5} suffix="★" /></p>
              <p className="font-body text-lilac/60 text-sm">đánh giá</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="font-display text-xl md:text-2xl text-mist mb-4">
            Bắt đầu hành trình của bạn
          </h2>
          <p className="font-body text-lilac italic mb-6">
            Đặt lịch xem bài ngay hôm nay và khám phá những gì năng lượng vũ trụ muốn nói với bạn.
          </p>
          <SparkleButton
            as="link"
            href="/booking"
            className="inline-block px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 transition-all shadow-lg shadow-arcane/25 btn-glow"
          >
            ✨ Đặt lịch ngay
          </SparkleButton>
        </section>
      </div>
    </main>
  );
}
