import BrandLogo from "../components/BrandLogo";
import MoodPicker from "../components/MoodPicker";
import SparkleButton from "../components/SparkleButton";
import { Icon } from "../components/icons";

const FEES = [
  { label: "Xem gấp sau 12h đêm", value: "+50k" },
  { label: "Trả thẻ điện thoại", value: "+20k" },
  { label: "HSSV", value: "−50k" },
];

/** 4 việc tiệm làm được — rút từ phần giới thiệu, mỗi mục 1 dòng cho gọn. */
const VALUES = [
  {
    icon: "heartbeat",
    title: "Chữa lành & lời khuyên tâm lý",
    desc: "Gỡ gốc rễ lo âu, bế tắc",
  },
  {
    icon: "time",
    title: "Dự đoán & định hướng tương lai gần",
    desc: "Tình cảm · sự nghiệp · tài chính",
  },
  {
    icon: "crystal",
    title: "Khám phá bản thân toàn diện",
    desc: "Tử vi, chiêm tinh, bản đồ sao, thần số học",
  },
  {
    icon: "home",
    title: "Kiến tạo tương lai bền vững",
    desc: "Phong thủy không gian sống & làm việc",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* ── Giới thiệu ── */}
        <div className="text-center mb-6">
          <div className="mb-4">
            <BrandLogo />
          </div>
          <h1 className="font-display text-2xl md:text-4xl text-mist mb-3">
            Khám phá định mệnh · Chữa lành tâm hồn · Kiến tạo tương lai
          </h1>
          <p className="font-body text-lilac/85 italic max-w-md mx-auto">
            Năng lượng vũ trụ &amp; huyền học cổ xưa — đồng hành cùng bạn.
          </p>
        </div>

        {/* ── Chọn theo nỗi lòng: đưa lên ngay đầu để khách chạm được sớm ── */}
        <section>
          <div className="text-center mb-3">
            <h2 className="font-display text-xl md:text-2xl text-mist">
              Bạn đang mang điều gì trong lòng?
            </h2>
            <p className="font-body text-lilac/75 text-sm mt-1.5">
              Chạm một nỗi lòng để xem trải bài phù hợp.
            </p>
          </div>
          <MoodPicker />
        </section>

        {/* Vạch ngăn: tách vùng "chạm chọn" ở trên với vùng đọc ở dưới */}
        <div className="section-divider my-8" />

        {/* ── Chúng tôi giúp bạn (gọn 1 dòng/mục) ── */}
        <section className="mb-8">
          <h2 className="font-body text-candle-gold/90 text-xs tracking-widest uppercase text-center mb-4">
            ✦ Chúng tôi giúp bạn ✦
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
            {VALUES.map((v) => (
              <div key={v.title} className="flex items-center gap-2.5">
                <span className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-candle-gold/15 border border-candle-gold/40">
                  <Icon name={v.icon} className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[15px] leading-snug text-mist">{v.title}</h3>
                  <p className="font-body text-lilac/70 text-[13px] leading-snug">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Lưu ý phụ phí ── */}
        <section className="mt-8 glow-box bg-candle-gold/5 rounded-2xl p-4">
          <p className="font-body text-candle-gold text-xs tracking-widest uppercase text-center mb-3">
            ✦ Lưu ý ✦
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {FEES.map((f) => (
              <div key={f.label} className="rounded-xl border border-velvet/50 bg-void/40 px-2 py-2.5">
                <p className="font-body text-lilac/80 text-[12px] leading-tight">{f.label}</p>
                <p className="font-display text-candle-gold text-base font-semibold mt-0.5">{f.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="text-center mt-8">
          <p className="font-body text-lilac/80 italic mb-5 max-w-md mx-auto">
            Vẫn phân vân? Nhắn My trước cũng được — không cần chốt gì ngay.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <SparkleButton
              as="link"
              href="/booking"
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 transition-all btn-glow"
            >
              ✨ Đặt lịch ngay
            </SparkleButton>
            <SparkleButton
              as="link"
              href="/contact"
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase border border-velvet text-lilac hover:border-arcane/50 hover:text-mist transition-all"
            >
              Liên hệ tư vấn
            </SparkleButton>
          </div>
        </section>
      </div>
    </main>
  );
}
