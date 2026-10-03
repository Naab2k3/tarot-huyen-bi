import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import anime from "animejs";
import Reveal from "../components/Reveal";
import FloatingTarotCards from "../components/FloatingTarotCards";
import CountUp from "../components/CountUp";
import SparkleButton from "../components/SparkleButton";
import Footer from "../components/Footer";
import FeedbackLightbox from "../components/FeedbackLightbox";

import { getServices } from "../api/client";
import type { Service } from "../api/types";

const FEEDBACKS = Array.from({ length: 17 }, (_, i) => ({
  type: "image" as const,
  src: `/images/feedbacks/fb_${i + 1}.jpg`,
  stars: 5,
}));

const WHY_US = [
  { icon: "🔮", title: "Chính xác", desc: "Phán đoán sâu sắc, chính xác từ kinh nghiệm thực tiễn" },
  { icon: "💜", title: "Tận tâm", desc: "Lắng nghe, thấu hiểu từng câu hỏi của bạn" },
  { icon: "🔒", title: "Bảo mật", desc: "Thông tin cá nhân hoàn toàn được bảo mật tuyệt đối" },
  { icon: "⚡", title: "Nhanh chóng", desc: "Phản hồi trong vòng 24 giờ, đặt lịch linh hoạt" },
];

const SERVICE_CATEGORIES = [
  { icon: "🃏", name: "Tarot", desc: "Giải mã năng lượng qua 78 lá bài Tarot huyền bí", link: "/booking" },
  { icon: "🍃", name: "Tea Leaf", desc: "Xem bói qua lá trà — nghệ thuật cổ xưa phương Đông", link: "/booking" },
  { icon: "🎴", name: "Bài Oracle", desc: "Lenormand, Oracle, Grand Tableau và nhiều hơn nữa", link: "/booking" },
  { icon: "💫", name: "Combo", desc: "Kết hợp nhiều phương pháp — tiết kiệm hơn, sâu hơn", link: "/booking" },
];

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [lightboxItem, setLightboxItem] = useState<typeof FEEDBACKS[number] | null>(null);
  const cardsRevealed = useRef(false);

  useEffect(() => {
    getServices().then(setServices).catch((e) => console.warn("getServices failed:", e.message));
  }, []);

  // Stagger entry for service cards
  useEffect(() => {
    const el = document.getElementById("service-cards");
    if (!el || cardsRevealed.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !cardsRevealed.current) {
          cardsRevealed.current = true;
          const items = el.querySelectorAll(".service-card-item");
          anime({
            targets: items,
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(120, { start: 200 }),
            duration: 600,
            easing: "easeOutCubic",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Stagger entry for feedback cards
  useEffect(() => {
    const el = document.getElementById("feedback-cards");
    if (!el) return;
    let done = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done) {
          done = true;
          const items = el.querySelectorAll(".feedback-card");
          anime({
            targets: items,
            opacity: [0, 1],
            translateY: [24, 0],
            delay: anime.stagger(100, { start: 100 }),
            duration: 600,
            easing: "easeOutCubic",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen">
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <FloatingTarotCards count={6} />

        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          {/* Brand logo */}
          <img
            src="/logo/logo-192.webp"
            srcSet="/logo/logo-192.webp 192w, /logo/logo-512.webp 512w"
            sizes="(max-width: 768px) 192px, 240px"
            width={192}
            height={225}
            alt="Healing With My"
            fetchPriority="high"
            decoding="async"
            className="w-48 md:w-60 h-auto mx-auto mb-6 drop-shadow-[0_0_16px_rgba(212,168,67,0.3)]"
          />

          <p className="font-logo text-mist tracking-widest uppercase text-base md:text-lg mb-4 opacity-90">
            Huyền học · Tâm linh · Kết nối
          </p>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-mist mb-4 leading-tight">
            Healing<br />With My
          </h1>

          <p className="font-body text-lilac text-xl md:text-2xl italic mb-8 leading-relaxed">
            Nơi năng lượng vũ trụ gặp gỡ tâm hồn bạn qua Tarot, Tea Leaf và những bí ẩn huyền học.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SparkleButton
              as="link"
              href="/booking"
              className="px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 transition-all shadow-lg shadow-arcane/25 btn-glow"
            >
              ✨ Đặt lịch xem bài
            </SparkleButton>
            <SparkleButton
              as="link"
              href="/services"
              className="px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase border border-velvet text-lilac hover:border-arcane/50 hover:text-mist transition-all"
            >
              Khám phá dịch vụ
            </SparkleButton>
          </div>
        </div>


      </section>

      {/* ─── Section divider ─── */}
      <div className="section-divider my-4" />

      {/* ─── Stats ─── */}
      <Reveal className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-display text-3xl md:text-4xl text-candle-gold">
                <CountUp end={500} suffix="+" />
              </p>
              <p className="font-body text-lilac/70 text-base tracking-wide mt-1">Khách hàng</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl text-candle-gold">
                <CountUp end={5} suffix="★" />
              </p>
              <p className="font-body text-lilac/70 text-base tracking-wide mt-1">Đánh giá</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl text-candle-gold">
                <CountUp end={3} suffix="+" />
              </p>
              <p className="font-body text-lilac/70 text-base tracking-wide mt-1">Năm kinh nghiệm</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ─── Tuyển dụng idol ─── */}
      <Reveal className="py-16 md:py-24" amount={0.2}>
        <div className="max-w-6xl mx-auto px-4">
          {/* Prominent banner */}
          <div className="relative overflow-hidden rounded-3xl border border-arcane/30 bg-gradient-to-br from-velvet/80 via-void to-arcane/20 shadow-2xl shadow-arcane/20">
            {/* Decorative glows */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-arcane/25 blur-3xl animate-glow-pulse" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-candle-gold/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,132,159,0.15),transparent_60%)]" />

            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_3fr] min-h-[560px]">
              {/* Image — full-height rectangular */}
              <div className="relative min-h-[320px] md:min-h-full">
                <img
                  src="/idols/healingidol.jpg"
                  alt="Tuyển dụng Idol xem bài"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-void/20 md:to-void/60" />
                {/* Badge */}
                <span className="absolute top-5 left-5 bg-candle-gold text-void font-display text-xs tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg">
                  Đang tuyển
                </span>
              </div>

              {/* Content */}
              <div className="flex items-center px-6 py-12 md:px-12 md:py-16">
                <div className="text-center md:text-left">
                  <p className="font-body text-candle-gold text-sm tracking-widest uppercase mb-3">
                    ✦ Tuyển dụng ✦
                  </p>
                  <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-mist mb-5 leading-tight">
                    Trở thành Idol<br /> xem bài
                  </h2>
                  <p className="font-body text-lilac italic mb-7 leading-relaxed max-w-md mx-auto md:mx-0">
                    Bạn đam mê huyền học, yêu thích Tarot và Tea Leaf? Healing With My đang
                    tìm kiếm những gương mặt mới để cùng lan tỏa năng lượng đến cộng đồng.
                  </p>

                  <ul className="space-y-3 mb-9 text-left max-w-sm mx-auto md:mx-0">
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
                    as="link"
                    href="/recruit"
                    className="px-10 py-4 rounded-xl font-display text-sm tracking-widest uppercase bg-candle-gold text-void hover:bg-candle-gold/85 transition-all shadow-lg shadow-candle-gold/25 btn-glow"
                  >
                    Ứng tuyển ngay
                  </SparkleButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ─── Section divider ─── */}
      <div className="section-divider my-4" />

      {/* ─── Services overview ─── */}
      <Reveal className="py-16 md:py-24" delay={100}>
        <div className="max-w-4xl mx-auto px-4">
          <p className="font-body text-candle-gold text-sm tracking-widest uppercase text-center mb-2">
            ✦ Những gì tôi cung cấp ✦
          </p>
          <h2 className="font-display text-2xl md:text-4xl text-mist text-center mb-12">
            Dịch vụ của tôi
          </h2>

          <div
            id="service-cards"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {SERVICE_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={cat.link}
                className="service-card-item group relative overflow-hidden bg-gradient-to-br from-velvet/70 via-velvet/40 to-arcane/15 border border-arcane/30 rounded-2xl p-6 md:p-7 hover:border-candle-gold/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-candle-gold/15 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-candle-gold/70 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="text-4xl block mb-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-candle-gold/15 border border-candle-gold/30 shadow-lg shadow-candle-gold/10 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h3 className="font-display text-xl tracking-wider text-mist mb-2 group-hover:text-candle-gold transition-colors">
                  {cat.name}
                </h3>
                <p className="font-body text-lilac/85 text-base leading-relaxed">{cat.desc}</p>
                <span className="inline-block mt-4 font-body text-candle-gold text-sm font-semibold tracking-wider uppercase opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  Đặt lịch ngay →
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/services"
              className="font-body text-lilac hover:text-mist underline underline-offset-4 decoration-arcane/30 transition-all"
            >
              Xem tất cả dịch vụ →
            </Link>
          </div>
        </div>
      </Reveal>

      {/* ─── Section divider ─── */}
      <div className="section-divider my-4" />

      {/* ─── Why us ─── */}
      <Reveal className="py-16 md:py-24" delay={200}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-4xl text-mist text-center mb-12">
            Tại sao chọn tôi?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {WHY_US.map((w) => (
              <div key={w.title} className="text-center">
                <span className="text-3xl block mb-3">{w.icon}</span>
                <h3 className="font-display text-sm tracking-wider uppercase text-mist mb-1">{w.title}</h3>
                <p className="font-body text-lilac/75 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ─── Section divider ─── */}
      <div className="section-divider my-4" />

      {/* ─── Feedback ─── */}
      <Reveal className="py-16 md:py-24" delay={100}>
        <div className="max-w-5xl mx-auto px-4">
          <p className="font-body text-candle-gold text-sm tracking-widest uppercase text-center mb-2">
            ✦ Phản hồi từ khách hàng ✦
          </p>
          <h2 className="font-display text-2xl md:text-4xl text-mist text-center mb-12">
            Khách hàng nói gì?
          </h2>

          <div id="feedback-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEEDBACKS.map((fb, i) => (
              <button
                key={i}
                onClick={() => setLightboxItem(fb)}
                className="feedback-card opacity-0 text-left w-full group"
              >
                <div className="relative bg-velvet/30 border border-velvet/60 rounded-2xl overflow-hidden hover:border-arcane/30 hover:bg-velvet/50 transition-all duration-300">
                  <div className="aspect-[4/3] w-full">
                    <img
                      src={fb.src}
                      alt={`Feedback ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>

                  {/* Bottom info */}
                  <div className="p-3 flex items-center justify-center border-t border-velvet/50">
                    <div className="text-candle-gold text-xs tracking-wider">
                      {'★'.repeat(fb.stars)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {lightboxItem && (
        <FeedbackLightbox
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
        />
      )}

      {/* ─── CTA ─── */}
      <Reveal className="py-16 md:py-24" delay={150}>
        <div className="text-center px-4">
          <h2 className="font-display text-2xl md:text-4xl text-mist mb-4">
            Sẵn sàng khám phá tương lai?
          </h2>
          <p className="font-body text-lilac italic mb-8 max-w-md mx-auto">
            Đặt lịch ngay hôm nay và để năng lượng vũ trụ dẫn đường cho bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SparkleButton
              as="link"
              href="/booking"
              className="px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 transition-all shadow-lg shadow-arcane/25 btn-glow"
            >
              ✨ Đặt lịch ngay
            </SparkleButton>
            <SparkleButton
              as="link"
              href="/services"
              className="px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase border border-velvet text-lilac hover:border-arcane/50 hover:text-mist transition-all"
            >
              Xem bảng giá
            </SparkleButton>
          </div>
        </div>
      </Reveal>

      {/* ─── Section divider ─── */}
      <div className="section-divider my-4" />

      {/* Footer */}
      <Footer />
    </main>
  );
}
