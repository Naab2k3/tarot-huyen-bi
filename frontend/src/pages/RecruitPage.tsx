import { useState } from "react";
import { createIdolApplication } from "../api/client";
import SparkleButton from "../components/SparkleButton";
import Reveal from "../components/Reveal";
import IdolPolicyDialog from "../components/IdolPolicyDialog";

const BENEFITS = [
  {
    icon: "🎭",
    title: "Tóa sáng cùng thương hiệu",
    desc: "Trở thành gương mặt đại diện cho Healing With My, cùng xây dựng cộng đồng huyền học thân thiện.",
  },
  {
    icon: "💰",
    title: "Thu nhập hấp dẫn",
    desc: "Chia sẻ doanh thu theo từng phiên xem bài, kèm chính sách ưu đãi khi đạt KPI tháng.",
  },
  {
    icon: "🌙",
    title: "Hỗ trợ đào tạo",
    desc: "Được đào tạo chuyên sâu về Tarot, Tea Leaf và cách dạy bài trọn vẹn.",
  },
];

const REASONS = [
  "Đam mê huyền học & muốn gắn bó lâu dài",
  "Muốn một công việc tự do, linh hoạt thời gian",
  "Đã có kinh nghiệm xem bài, muốn mở rộng",
  "Muốn học hỏi và trở thành idol xem bài chuyên nghiệp",
];

const SALARY_TIERS = [
  { top: "Thử việc", bottom: "6.000.000₫" },
  { top: "Chính thức", bottom: "8.000.000₫" },
  { top: "Theo hiệu suất", bottom: "tới 30.000.000₫" },
];

const BENEFIT_LIST = [
  "Thu nhập hấp dẫn theo từng phiên xem bài",
  "Được đào tạo chuyên sâu miễn phí",
  "Làm việc tự do, linh hoạt thời gian",
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
  const [policyOpen, setPolicyOpen] = useState(false);

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
    <main className="min-h-screen pt-16 pb-16">
      {/* Hero Banner - Same as HomePage */}
      <Reveal className="py-16 md:py-24" amount={0.2}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border border-arcane/30 bg-gradient-to-br from-velvet/80 via-void to-arcane/20 shadow-2xl shadow-arcane/20">
            <div className="relative max-w-3xl mx-auto px-6 py-12 md:px-12 md:py-16 text-center">
              <span className="inline-block bg-candle-gold text-void font-display text-xs tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg mb-5">
                Đang tuyển
              </span>
              <h1 className="font-display text-3xl md:text-5xl text-mist mb-5 leading-tight">
                Trở thành Idol<br /> xem bài
              </h1>
              <p className="font-body text-lilac italic mb-7 leading-relaxed max-w-md mx-auto">
                Bạn đam mê huyền học, yêu thích Tarot và Tea Leaf? Healing With My đang
                tìm kiếm những gương mặt mới để cùng lan tỏa năng lượng đến cộng đồng.
              </p>

              {/* Salary at a glance */}
              <div className="flex flex-wrap items-stretch justify-center gap-2.5 md:gap-3 mb-8">
                {SALARY_TIERS.map((s) => (
                  <div
                    key={s.top}
                    className="rounded-xl border border-candle-gold/40 bg-candle-gold/10 px-5 py-3 min-w-[140px]"
                  >
                    <p className="font-body text-candle-gold text-xs tracking-widest uppercase">{s.top}</p>
                    <p className="font-display text-lg md:text-xl text-mist">{s.bottom}</p>
                  </div>
                ))}
              </div>

              <ul className="space-y-3 mb-9 text-left max-w-sm mx-auto">
                {BENEFIT_LIST.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-lilac/80 text-sm">
                    <span className="text-candle-gold mt-0.5">✦</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <SparkleButton
                  type="button"
                  onClick={scrollToForm}
                  className="w-full sm:w-auto px-10 py-4 rounded-xl font-display text-sm tracking-widest uppercase bg-candle-gold text-void hover:bg-candle-gold/85 transition-all shadow-lg shadow-candle-gold/25 btn-glow"
                >
                  Ứng tuyển ngay
                </SparkleButton>
                <button
                  onClick={() => setPolicyOpen(true)}
                  className="w-full sm:w-auto px-8 min-h-[52px] rounded-xl font-display text-sm tracking-widest uppercase border border-arcane/50 text-mist hover:border-candle-gold/60 active:scale-[0.98] transition-all"
                >
                  Xem chế độ lương
                </button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Benefits Section */}
      <Reveal className="py-16 md:py-24" delay={100}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="bg-velvet/40 rounded-xl p-5 text-center border border-velvet/50 group hover:border-arcane/40 transition-all duration-300"
              >
                <span className="text-3xl block mb-3">{b.icon}</span>
                <h3 className="font-display text-sm tracking-wider uppercase text-mist mb-2">
                  {b.title}
                </h3>
                <p className="font-body text-lilac/70 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Application Form */}
      <Reveal className="py-16 md:py-24" delay={150}>
        <div id="ung-tuyen" className="max-w-4xl mx-auto px-4">
          <div className="bg-velvet/40 border border-velvet rounded-xl p-6 md:p-8 max-w-2xl mx-auto scroll-mt-28">
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
                {loading ? "Đang gửi..." : "Gởi đơn ứng tuyển"}
              </SparkleButton>
            </form>
          </div>
        </div>
      </Reveal>

      {policyOpen && <IdolPolicyDialog onClose={() => setPolicyOpen(false)} />}
    </main>
  );
}
