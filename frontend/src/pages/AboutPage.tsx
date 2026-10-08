import { Link } from "react-router-dom";
import CountUp from "../components/CountUp";
import SparkleButton from "../components/SparkleButton";

const VALUES = [
  {
    icon: "🌙",
    title: "Nói thật, không dọa",
    desc: "Bạn sẽ không nghe những lời chung chung hay hù dọa. Chỉ có sự thật dịu dàng — đủ rõ để bạn quyết định.",
  },
  {
    icon: "💜",
    title: "Bạn được lắng nghe",
    desc: "Mỗi buổi xem là một cuộc trò chuyện không phán xét. Cứ kể hết — My ở đây để hiểu, không phải để đánh giá.",
  },
  {
    icon: "✨",
    title: "Ra về nhẹ lòng hơn",
    desc: "Bạn sẽ rời đi với lòng rõ ràng và vững vàng hơn — đủ tự tin bước tiếp mà không cần dựa vào ai.",
  },
];

const FEATURED_PRESS = {
  outlet: "SaoStar",
  date: "01/08/2025",
  title: "Gặp gỡ Phan Than Hieu My: Từ cô gái tự lập đến nữ thần stream",
  excerpt:
    "Câu chuyện từ cô gái tự lập vươn lên thành nữ thần stream được đông đảo khán giả yêu mến.",
  url: "https://www.saostar.vn/sac-mau-cuoc-song/gap-go-phan-than-hieu-my-tu-co-gai-tu-lap-den-nu-than-stream-voi-202508011711237874.html",
  monogram: "S",
  logo: "/images/press/logo-saostar.svg",
};

const PRESS_LINKS = [
  {
    outlet: "Kenh14",
    label: "Bài viết",
    title: "Bỏ sau lưng ánh hào quang livestream, creator đồng hành cùng sao, trao giá trị",
    url: "https://kenh14.vn/bo-sau-lung-anh-hao-quang-livestream-creator-lua-chon-dong-hanh-cung-sao-trao-gia-tri-215260828183745057.chn",
    monogram: "K",
    logo: "/images/press/logo-kenh14.svg",
  },
  {
    outlet: "Pháp Luật Tài Chính & Đầu Tư",
    label: "Bài viết",
    title: "Góc nhìn mới về làm đẹp thông minh cùng Phan Than Hieu My",
    url: "https://phapluattaichinhvadautu.vn/nhan-vat/goc-nhin-moi-ve-lam-dep-thong-minh-cung-phan-than-hieu-my/",
    monogram: "P",
    logo: "/images/press/logo-pltcdt.webp",
  },
  {
    outlet: "Người Nổi Tiếng TV",
    label: "Hồ sơ nhân vật",
    title: "Phan Hiếu My",
    url: "https://nguoinoitieng.tv/nghe-nghiep/kol/phan-hieu-my/bhtx/amp",
    monogram: "N",
    logo: "/images/press/logo-nguoinoitieng.webp",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-body text-candle-gold text-sm tracking-widest uppercase mb-2">
            ✦ Về My ✦
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-mist mb-4">Giới thiệu</h1>
        </div>

        {/* Logo + Founder */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 flex justify-center">
            <img
              src="/logo/logo-192.webp"
              srcSet="/logo/logo-192.webp 192w, /logo/logo-512.webp 512w"
              sizes="(max-width: 768px) 192px, 224px"
              width={192}
              height={225}
              loading="lazy"
              decoding="async"
              alt="Healing With My"
              className="w-48 md:w-56 h-auto drop-shadow-[0_0_16px_rgba(212,168,67,0.3)]"
            />
          </div>
          <h2 className="font-display text-2xl text-mist mb-1">My</h2>
          <p className="font-body text-candle-gold text-sm tracking-wide uppercase mb-6">
            Người lắng nghe bằng Tarot · Tea Leaf
          </p>
          <p className="font-body text-lilac max-w-xl mx-auto leading-relaxed">
            Hơn 10 năm đồng hành cùng Tarot, Tea Leaf, Oracle và Grand Tableau —
            My ở đây không phải để phán xét số phận bạn, mà để cùng bạn nhìn sâu vào lòng mình
            và tìm lại sự bình yên đã lạc mất.
          </p>
        </div>

        {/* Story */}
        <section className="mb-16">
          <h2 className="font-display text-xl md:text-2xl text-mist text-center mb-6">
            Nếu bạn đang đọc những dòng này…
          </h2>
          <div className="bg-velvet/40 border border-velvet rounded-xl p-6 md:p-8 space-y-4 font-body text-lilac leading-relaxed">
            <p>
              Có lẽ bạn đang mang trong lòng một điều khó nói — một mối quan hệ chênh vênh,
              một ngã rẽ sự nghiệp, hay chỉ là cảm giác mông lung chẳng biết mai sẽ ra sao.
              Healing With My có mặt là vì những khoảnh khắc như thế.
            </p>
            <p>
              Ở đây, các lá bài không phải để quyết định thay bạn. Chúng như một tấm gương hiền —
              giúp bạn soi rõ điều trái tim mình thực sự muốn, để rồi can đảm hơn với lựa chọn của chính mình.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="font-display text-xl md:text-2xl text-mist text-center mb-2">
            Điều bạn sẽ cảm nhận ở đây
          </h2>
          <p className="font-body text-lilac/60 italic text-center mb-8">
            Không phải lời khoe khoang — chỉ là lời hứa dịu dàng dành cho bạn.
          </p>
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
              <p className="font-display text-3xl text-candle-gold"><CountUp end={10} suffix="+" /></p>
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

        {/* Press */}
        <section className="mb-16">
          <p className="font-body text-candle-gold text-sm tracking-widest uppercase text-center mb-2">
            ✦ Báo chí ✦
          </p>
          <h2 className="font-display text-xl md:text-2xl text-mist text-center mb-8">
            Báo chí nói về My
          </h2>

          {/* Featured article */}
          <a
            href={FEATURED_PRESS.url}
            target="_blank"
            rel="noreferrer"
            className="group relative block overflow-hidden rounded-2xl border border-candle-gold/30 bg-gradient-to-br from-velvet/80 via-void to-arcane/20 shadow-xl shadow-candle-gold/10 hover:border-candle-gold/60 hover:shadow-candle-gold/20 transition-all duration-300 mb-5"
          >
            <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-candle-gold/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-arcane/25 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-stretch gap-5 p-6 md:p-7">
              <div className="shrink-0 mx-auto sm:mx-0 w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-velvet border border-candle-gold/30 flex items-center justify-center shadow-lg shadow-candle-gold/10 group-hover:scale-105 transition-transform relative overflow-hidden">
                <span className="font-display text-4xl md:text-5xl text-candle-gold">
                  {FEATURED_PRESS.monogram}
                </span>
                <img
                  src={FEATURED_PRESS.logo}
                  alt={FEATURED_PRESS.outlet}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-contain p-3 bg-velvet"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="bg-candle-gold text-void font-display text-xs tracking-widest uppercase px-3 py-1 rounded-full">
                    Nổi bật
                  </span>
                  <span className="font-body text-candle-gold/80 text-sm">
                    {FEATURED_PRESS.outlet} · {FEATURED_PRESS.date}
                  </span>
                </div>
                <h3 className="font-display text-lg md:text-xl text-mist leading-snug mb-2 group-hover:text-candle-gold transition-colors">
                  {FEATURED_PRESS.title}
                </h3>
                <p className="font-body text-lilac/80 text-sm leading-relaxed mb-3">
                  {FEATURED_PRESS.excerpt}
                </p>
                <span className="inline-block font-body text-candle-gold text-sm font-semibold tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                  Đọc bài gốc →
                </span>
              </div>
            </div>
          </a>

          {/* Other articles */}
          <div className="grid gap-3">
            {PRESS_LINKS.map((p) => (
              <a
                key={p.url}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 bg-velvet/40 border border-velvet rounded-xl p-4 hover:border-candle-gold/40 hover:bg-velvet/60 transition-all"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-velvet border border-velvet flex items-center justify-center relative overflow-hidden">
                  <span className="font-display text-xl text-candle-gold">{p.monogram}</span>
                  <img
                    src={p.logo}
                    alt={p.outlet}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain p-1.5 bg-velvet"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-candle-gold/70 text-xs tracking-wider uppercase">
                    {p.outlet} · {p.label}
                  </p>
                  <h3 className="font-body text-mist text-sm md:text-base leading-snug line-clamp-2 group-hover:text-candle-gold transition-colors">
                    {p.title}
                  </h3>
                </div>
                <span className="shrink-0 font-body text-candle-gold text-lg group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="font-display text-xl md:text-2xl text-mist mb-4">
            Khi lòng đã mỏi, đừng đi một mình
          </h2>
          <p className="font-body text-lilac italic mb-6">
            Đặt một buổi xem — để được lắng nghe, được thấu hiểu và nhẹ lòng bước tiếp.
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
