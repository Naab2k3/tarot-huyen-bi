import { Link } from "react-router-dom";
import CountUp from "../components/CountUp";
import SparkleButton from "../components/SparkleButton";

const VALUES = [
  {
    icon: "🌙",
    title: "Chân thực",
    desc: "Tôi đọc bài với trái tim thành thật, không phóng đại, không che giấu.",
  },
  {
    icon: "💜",
    title: "Đồng cảm",
    desc: "Mỗi buổi xem là một cuộc trò chuyện. Tôi lắng nghe và thấu hiểu câu chuyện của bạn.",
  },
  {
    icon: "✨",
    title: "Trao quyền",
    desc: "Bài đọc giúp bạn tự tin hơn với lựa chọn của mình, không phụ thuộc vào tôi.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-body text-candle-gold text-sm tracking-widest uppercase mb-2">
            ✦ Về tôi ✦
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-mist mb-4">Giới thiệu</h1>
        </div>

        {/* Logo + Founder */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 flex justify-center">
            <img
              src="/images/logo-md.png"
              alt="Healing With My"
              className="w-32 md:w-40 h-auto"
            />
          </div>
          <h2 className="font-display text-2xl text-mist mb-1">My</h2>
          <p className="font-body text-candle-gold text-sm tracking-wide uppercase mb-6">
            Tarot Reader · Tea Leaf Artist
          </p>
          <p className="font-body text-lilac max-w-xl mx-auto leading-relaxed">
            Với hơn 3 năm nghiên cứu và thực hành Tarot, Tea Leaf, Oracle cùng Grand Tableau,
            tôi kết hợp trực giác và kiến thức huyền học để mang đến những bài đọc sâu sắc và ý nghĩa.
          </p>
        </div>

        {/* Story */}
        <section className="mb-16">
          <h2 className="font-display text-xl md:text-2xl text-mist text-center mb-6">
            Câu chuyện của tôi
          </h2>
          <div className="bg-velvet/40 border border-velvet rounded-xl p-6 md:p-8 space-y-4 font-body text-lilac leading-relaxed">
            <p>
              Healing With My ra đời từ niềm đam mê sâu sắc với huyền học và mong muốn kết nối con người
              với năng lượng vũ trụ. Tôi tin rằng mỗi người đều mang trong mình một hành trình độc đáo,
              và các lá bài chỉ là chiếc gương phản chiếu con đường đó.
            </p>
            <p>
              Tôi không tiên đoán số phận. Tôi giúp bạn hiểu rõ năng lượng hiện tại và đưa ra quyết định
              sáng suốt hơn cho tương lai của chính mình.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="font-display text-xl md:text-2xl text-mist text-center mb-8">
            Cách tôi làm việc
          </h2>
          <div className="grid gap-5">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-velvet/40 border border-velvet rounded-xl p-6 flex items-start gap-4 hover:border-arcane/30 transition-colors"
              >
                <span className="text-3xl shrink-0">{v.icon}</span>
                <div>
                  <h3 className="font-display text-base tracking-wider uppercase text-mist mb-1">{v.title}</h3>
                  <p className="font-body text-lilac/70">{v.desc}</p>
                </div>
              </div>
            ))}
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
            Sẵn sàng khám phá?
          </h2>
          <p className="font-body text-lilac italic mb-6">
            Đặt lịch xem bài ngay hôm nay và để năng lượng vũ trụ dẫn đường cho bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SparkleButton
              as="link"
              href="/booking"
              className="px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 transition-all shadow-lg shadow-arcane/25 btn-glow"
            >
              ✨ Đặt lịch ngay
            </SparkleButton>
            <Link
              to="/services"
              className="px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase border border-velvet text-lilac hover:border-arcane/50 hover:text-mist transition-all"
            >
              Khám phá dịch vụ
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
