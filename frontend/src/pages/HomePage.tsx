import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import anime from "animejs";
import FloatingTarotCards from "../components/FloatingTarotCards";
import CountUp from "../components/CountUp";
import SparkleButton from "../components/SparkleButton";
import Footer from "../components/Footer";
import FeedbackLightbox from "../components/FeedbackLightbox";

import { getServices } from "../api/client";
import type { Service } from "../api/types";

const PLATFORM_COLORS: Record<string, string> = {
  Messenger: "from-blue-500 to-blue-700",
  Zalo: "from-sky-500 to-cyan-600",
  Instagram: "from-fuchsia-500 to-rose-600",
  TikTok: "from-gray-900 to-gray-700",
  Facebook: "from-blue-600 to-blue-800",
};

const PLATFORM_ICONS: Record<string, string> = {
  Messenger: "💬",
  Zalo: "💙",
  Instagram: "📸",
  TikTok: "🎵",
  Facebook: "👍",
};

const FEEDBACKS = [
  {
    type: "image" as const,
    src: "",
    stars: 5,
    text: "My đọc bài rất chính xác, giúp tôi hiểu rõ hơn về mối quan hệ hiện tại. Cảm ơn nhiều!",
    author: "Nguyễn Thị Lan",
    platform: "Messenger",
  },
  {
    type: "image" as const,
    src: "",
    stars: 5,
    text: "Lần đầu thử Tea Leaf mà bị cuốn hoàn toàn. My giải thích rất chi tiết và tận tâm.",
    author: "Trần Minh Hoàng",
    platform: "Zalo",
  },
  {
    type: "video" as const,
    src: "",
    videoSrc: "",
    stars: 5,
    text: "Combo Tarot + Tea Leaf cực kỳ đáng tiền. Sẽ quay lại lần sau chắc chắn!",
    author: "Phạm Thu Hà",
    platform: "TikTok",
  },
  {
    type: "image" as const,
    src: "",
    stars: 5,
    text: "Bài Tarot của My cực kỳ chính xác, đã giúp mình có quyết định đúng đắn trong công việc.",
    author: "Lê Thanh Tùng",
    platform: "Instagram",
  },
  {
    type: "image" as const,
    src: "",
    stars: 5,
    text: "Rất may mắn khi biết đến My. Tea Leaf reading thực sự thay đổi góc nhìn của mình.",
    author: "Hoàng Thảo Vy",
    platform: "Facebook",
  },
  {
    type: "video" as const,
    src: "",
    videoSrc: "",
    stars: 5,
    text: "Mình đã xem nhiều nơi nhưng đây là lần đầu cảm thấy được kết nối thực sự. Cảm ơn My rất nhiều!",
    author: "Đặng Minh Quân",
    platform: "TikTok",
  },
];

const WHY_US = [
  { icon: "🔮", title: "Chính xác", desc: "Phán đoán sâu sắc, chính xác từ kinh nghiệm thực tiễn" },
  { icon: "💜", title: "Tận tâm", desc: "Lắng nghe, thấu hiểu từng câu hỏi của bạn" },
  { icon: "🔒", title: "Bảo mật", desc: "Thông tin cá nhân hoàn toàn được bảo mật tuyệt đối" },
  { icon: "⚡", title: "Nhanh chóng", desc: "Phản hồi trong vòng 24 giờ, đặt lịch linh hoạt" },
];

const SERVICE_CATEGORIES = [
  { icon: "🃏", name: "Tarot", desc: "Giải mã năng lượng qua 78 lá bài Tarot huyền bí", link: "/services" },
  { icon: "🍃", name: "Tea Leaf", desc: "Xem bói qua lá trà — nghệ thuật cổ xưa phương Đông", link: "/services" },
  { icon: "🎴", name: "Bài Oracle", desc: "Lenormand, Oracle, Grand Tableau và nhiều hơn nữa", link: "/services" },
  { icon: "💫", name: "Combo", desc: "Kết hợp nhiều phương pháp — tiết kiệm hơn, sâu hơn", link: "/services" },
];

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [lightboxItem, setLightboxItem] = useState<typeof FEEDBACKS[number] | null>(null);
  const cardsRevealed = useRef(false);

  useEffect(() => {
    getServices().then(setServices).catch(() => {});
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
            src="/images/logo-lg.png"
            alt="Healing With My"
            className="w-28 md:w-36 h-auto mx-auto mb-6"
          />

          <p className="font-logo text-mist tracking-widest uppercase text-sm md:text-base mb-4 opacity-70">
            Huyền học · Tâm linh · Kết nối
          </p>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-mist mb-4 leading-tight">
            Healing<br />With My
          </h1>

          <p className="font-body text-lilac text-lg md:text-xl italic mb-8 leading-relaxed">
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
      <motion.section
        className="py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-display text-3xl md:text-4xl text-candle-gold">
                <CountUp end={500} suffix="+" />
              </p>
              <p className="font-body text-lilac/60 text-sm tracking-wide mt-1">Khách hàng</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl text-candle-gold">
                <CountUp end={5} suffix="★" />
              </p>
              <p className="font-body text-lilac/60 text-sm tracking-wide mt-1">Đánh giá</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl text-candle-gold">
                <CountUp end={3} suffix="+" />
              </p>
              <p className="font-body text-lilac/60 text-sm tracking-wide mt-1">Năm kinh nghiệm</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── Services overview ─── */}
      <motion.section
        className="py-16 md:py-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
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
                className="service-card-item bg-velvet/40 border border-velvet rounded-xl p-6 hover:border-arcane/30 hover:bg-velvet/60 transition-all group"
              >
                <span className="text-3xl block mb-3">{cat.icon}</span>
                <h3 className="font-display text-lg tracking-wider text-mist mb-1 group-hover:text-arcane transition-colors">
                  {cat.name}
                </h3>
                <p className="font-body text-lilac/70 text-sm">{cat.desc}</p>
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
      </motion.section>

      {/* ─── Section divider ─── */}
      <div className="section-divider my-4" />

      {/* ─── Why us ─── */}
      <motion.section
        className="py-16 md:py-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-4xl text-mist text-center mb-12">
            Tại sao chọn tôi?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {WHY_US.map((w) => (
              <div key={w.title} className="text-center">
                <span className="text-3xl block mb-3">{w.icon}</span>
                <h3 className="font-display text-sm tracking-wider uppercase text-mist mb-1">{w.title}</h3>
                <p className="font-body text-lilac/60 text-xs leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── Section divider ─── */}
      <div className="section-divider my-4" />

      {/* ─── Feedback ─── */}
      <motion.section
        className="py-16 md:py-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
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
                  {/* Platform badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-mist text-[11px] font-body tracking-wide">
                    <span>{PLATFORM_ICONS[fb.platform]}</span>
                    <span>{fb.platform}</span>
                  </div>

                  {/* Content */}
                  {fb.type === "video" && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-arcane/40 group-hover:scale-110 transition-all duration-300">
                      <svg className="w-6 h-6 text-mist ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}

                  <div className="aspect-[4/3] w-full">
                    {fb.src ? (
                      <img
                        src={fb.src}
                        alt={`Feedback from ${fb.author}`}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${PLATFORM_COLORS[fb.platform] || "from-velvet to-void"} flex flex-col justify-end p-5`}
                      >
                        <div className="backdrop-blur-[2px]">
                          <div className="bg-white/10 backdrop-blur-md rounded-2xl rounded-bl-sm px-4 py-3 mb-2 inline-block max-w-[90%]">
                            <p className="font-body text-mist text-sm leading-relaxed">
                              "{fb.text}"
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-mist text-xs font-bold">
                              {fb.author.charAt(0)}
                            </div>
                            <p className="font-body text-white/70 text-xs">{fb.author}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom info */}
                  <div className="p-3 flex items-center justify-between border-t border-velvet/50">
                    <div className="flex items-center gap-2">
                      <div className="text-candle-gold text-xs tracking-wider">
                        {'★'.repeat(fb.stars)}
                      </div>
                    </div>
                    <span className="font-body text-lilac/40 text-[11px]">
                      {fb.type === "video" ? "📹 Video" : "📷 Ảnh"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {lightboxItem && (
        <FeedbackLightbox
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
        />
      )}

      {/* ─── Section divider ─── */}
      <div className="section-divider my-4" />

      {/* ─── CTA ─── */}
      <motion.section
        className="py-16 md:py-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
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
      </motion.section>

      {/* ─── Section divider ─── */}
      <div className="section-divider my-4" />

      {/* Footer */}
      <Footer />
    </main>
  );
}
