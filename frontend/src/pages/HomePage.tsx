import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import anime from "animejs";
import FloatingTarotCards from "../components/FloatingTarotCards";
import CountUp from "../components/CountUp";
import SparkleButton from "../components/SparkleButton";

import { getServices } from "../api/client";
import type { Service } from "../api/types";

const TESTIMONIALS = [
  {
    stars: 5,
    text: "My đọc bài rất chính xác, giúp tôi hiểu rõ hơn về mối quan hệ hiện tại. Cảm ơn nhiều!",
    author: "— Nguyễn Thị Lan",
  },
  {
    stars: 5,
    text: "Lần đầu thử Tea Leaf mà bị cuốn hoàn toàn. My giải thích rất chi tiết và tận tâm.",
    author: "— Trần Minh Hoàng",
  },
  {
    stars: 5,
    text: "Combo Tarot + Tea Leaf cực kỳ đáng tiền. Sẽ quay lại lần sau chắc chắn!",
    author: "— Phạm Thu Hà",
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

  // Stagger entry for testimonials
  useEffect(() => {
    const el = document.getElementById("testimonials");
    if (!el) return;
    let done = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done) {
          done = true;
          const items = el.querySelectorAll(".testimonial-item");
          anime({
            targets: items,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(150, { start: 200 }),
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

  return (
    <main className="min-h-screen">
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <FloatingTarotCards count={6} />

        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          {/* Logo */}
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
            ✦ Những gì chúng tôi cung cấp ✦
          </p>
          <h2 className="font-display text-2xl md:text-4xl text-mist text-center mb-12">
            Dịch vụ của chúng tôi
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
            Tại sao chọn chúng tôi?
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

      {/* ─── Testimonials ─── */}
      <motion.section
        className="py-16 md:py-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-4xl text-mist text-center mb-12">
            Khách hàng nói gì?
          </h2>
          <div id="testimonials" className="grid gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-item bg-velvet/40 border border-velvet rounded-xl p-6">
                <div className="text-candle-gold text-sm mb-2">{'★'.repeat(t.stars)}</div>
                <p className="font-body text-lilac italic leading-relaxed mb-3">"{t.text}"</p>
                <p className="font-body text-lilac/50 text-sm">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

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
      <footer className="py-8 text-center">
        <p className="font-logo text-mist tracking-widest text-xs uppercase mb-2">Healing With My</p>
        <p className="font-body text-lilac/40 text-xs">© 2024 - Huyền học · Tâm linh · Kết nối</p>
      </footer>
    </main>
  );
}
