import { useState } from "react";
import { createIdolApplication } from "../api/client";
import SparkleButton from "../components/SparkleButton";

const BENEFITS = [
  {
    icon: "🎤",
    title: "Tỏa sáng cùng thương hiệu",
    desc: "Trở thành gương mặt đại diện cho Healing With My, cùng xây dựng cộng đồng huyền học thân thuộc.",
  },
  {
    icon: "💖",
    title: "Thu nhập hấp dẫn",
    desc: "Chia sẻ doanh thu theo từng phiên xem bài, kèm chính sách ưu đãi khi đạt KPI tháng.",
  },
  {
    icon: "🌙",
    title: "Hỗ trợ đào tạo",
    desc: "Được đào tạo chuyên sâu về Tarot, Tea Leaf và cách dẫn dắt một buổi đọc bài trọn vẹn.",
  },
];

const REASONS = [
  "Đam mê huyền học & muốn gắn bó lâu dài",
  "Muốn một công việc tự do, linh hoạt thời gian",
  "Đã có kinh nghiệm xem bài, muốn mở rộng",
  "Muốn học hỏi và trở thành idol xem bài chuyên nghiệp",
];

export default function RecruitPage() {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    social_link: "",
    reason: "",
    experience: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function scrollToForm() {
    document.getElementById("ung-tuyen")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createIdolApplication({
        full_name: form.full_name.trim(),
        phone: form.phone.replace(/[\s.\-()]/g, ""),
        email: form.email.trim() || null,
        social_link: form.social_link.trim() || null,
        reason: form.reason,
        experience: form.experience || null,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-md w-full text-center animate-fade-in">
          <span className="text-5xl block mb-6">✨</span>
          <h1 className="font-display text-3xl text-mist mb-4">Cảm ơn bạn đã ứng tuyển!</h1>
          <p className="font-body text-lilac italic mb-8">
            Đơn của bạn đã được ghi nhận. Tôi sẽ liên hệ trong thời gian sớm nhất.
          </p>
          <SparkleButton
            as="link"
            href="/"
            className="px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 transition-all btn-glow"
          >
            Về trang chủ
          </SparkleButton>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      {/* ── Banner (đồng bộ với banner tuyển dụng ở Home) ── */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="relative overflow-hidden rounded-3xl border border-arcane/30 bg-gradient-to-br from-velvet/80 via-void to-arcane/20 shadow-2xl shadow-arcane/20">
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-arcane/25 blur-3xl animate-glow-pulse" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-candle-gold/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,132,159,0.15),transparent_60%)]" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
            {/* Image — full-height rectangular */}
            <div className="relative min-h-[280px] md:min-h-full">
              <img
                src="/idols/healingidol.jpg"
                alt="Tuyển dụng Idol xem bài"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-void/20 md:to-void/60" />
              {/* Badge */}
              <span className="absolute top-5 left-5 bg-candle-gold text-void font-display text-xs tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg">
                Đang tuyển
              </span>
            </div>

            {/* Content */}
            <div className="flex items-center px-6 py-10 md:px-12 md:py-14">
              <div className="text-center md:text-left">
                <p className="font-body text-candle-gold text-sm tracking-widest uppercase mb-3">
                  ✦ Tuyển dụng ✦
                </p>
                <h1 className="font-display text-3xl md:text-5xl text-mist mb-4 leading-tight">
                  Trở thành Idol<br />xem bài
                </h1>
                <p className="font-body text-lilac italic mb-6 leading-relaxed max-w-md mx-auto md:mx-0">
                  Healing With My đang tìm kiếm những người đam mê huyền học, yêu thích Tarot
                  và muốn biến đam mê thành công việc. Nếu bạn có duyên với những lá bài, hãy
                  cùng tôi lan tỏa năng lượng tốt đẹp đến cộng đồng.
                </p>

                <ul className="space-y-2.5 mb-8 text-left max-w-sm mx-auto md:mx-0">
                  {[
                    "Thu nhập hấp dẫn theo từng phiên xem bài",
                    "Được đào tạo chuyên sâu miễn phí",
                    "Làm việc tự do, linh hoạt thời gian",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 font-body text-lilac/80 text-sm">
                      <span className="text-candle-gold mt-0.5">✦</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <SparkleButton
                  type="button"
                  onClick={scrollToForm}
                  className="px-10 py-4 rounded-xl font-display text-sm tracking-widest uppercase bg-candle-gold text-void hover:bg-candle-gold/85 transition-all shadow-lg shadow-candle-gold/25 btn-glow"
                >
                  Ứng tuyển ngay
                </SparkleButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">

        {/* ── Benefits ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-velvet/40 rounded-xl p-5 text-center border border-velvet/50"
            >
              <span className="text-3xl block mb-3">{b.icon}</span>
              <h3 className="font-display text-sm tracking-wider uppercase text-mist mb-2">
                {b.title}
              </h3>
              <p className="font-body text-lilac/70 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Application form ── */}
        <div id="ung-tuyen" className="bg-velvet/40 border border-velvet rounded-xl p-6 md:p-8 max-w-2xl mx-auto scroll-mt-28">
          <h2 className="font-display text-lg tracking-wider uppercase text-mist text-center mb-6">
            Đăng ký ứng tuyển
          </h2>

          {error && (
            <p className="text-center font-body text-red-400 italic mb-4" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-lilac text-sm mb-1">
                Họ và tên <span className="text-candle-gold">*</span>
              </label>
              <input
                type="text"
                required
                value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  className="w-full bg-void border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors"
                  placeholder="Nhập họ và tên"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-body text-lilac text-sm mb-1">
                  Số điện thoại <span className="text-candle-gold">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full bg-void border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block font-body text-lilac text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full bg-void border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors"
                  placeholder="Nhập địa chỉ email"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-lilac text-sm mb-1">
                Facebook / Zalo / Tiktok <span className="text-lilac/40">(không bắt buộc)</span>
              </label>
              <input
                type="text"
                value={form.social_link}
                onChange={(e) => update("social_link", e.target.value)}
                className="w-full bg-void border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors"
                placeholder="Nhập link Facebook / Zalo / TikTok"
              />
            </div>

            <div>
              <label className="block font-body text-lilac text-sm mb-1">
                Vì sao bạn muốn trở thành idol? <span className="text-candle-gold">*</span>
              </label>
              <select
                required
                value={form.reason}
                onChange={(e) => update("reason", e.target.value)}
                className="w-full bg-void border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors"
              >
                <option value="" disabled>
                  Chọn lý do phù hợp với bạn
                </option>
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-body text-lilac text-sm mb-1">
                Kinh nghiệm xem bài <span className="text-lilac/40">(không bắt buộc)</span>
              </label>
              <textarea
                value={form.experience}
                onChange={(e) => update("experience", e.target.value)}
                rows={3}
                className="w-full bg-void border border-velvet rounded-lg px-4 py-2.5 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors resize-none"
                placeholder="Nhập kinh nghiệm xem bài"
              />
            </div>

            <SparkleButton
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 transition-all btn-glow disabled:opacity-60"
            >
              {loading ? "Đang gửi..." : "Gửi đơn ứng tuyển"}
            </SparkleButton>
          </form>
        </div>
      </div>
    </main>
  );
}
