import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { Link } from "react-router-dom";
import anime from "animejs";
import Reveal from "../components/Reveal";
import GalaxyTarotSystem from "../components/GalaxyTarotSystem";
import CountUp from "../components/CountUp";
import SparkleButton from "../components/SparkleButton";
import Footer from "../components/Footer";
import FeedbackLightbox from "../components/FeedbackLightbox";

import { getServices } from "../api/client";
import type { Service } from "../api/types";

// Import tarot card data
import tarotCardsData from "../../public/data/tarot-cards.json";

const FEEDBACKS = [
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_1.webp`,
    full: `/images/feedbacks/fb_1.webp`,
    stars: 5,
    customerName: "N.T.",
    service: "Tarot",
    comment: "Dịch vụ tuyệt vời! Tôi đã tìm được hướng đi rõ ràng cho cuộc sống.",
    date: "19/09/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_2.webp`,
    full: `/images/feedbacks/fb_2.webp`,
    stars: 5,
    customerName: "T.V.",
    service: "Tea Leaf",
    comment: "Chân thành và chính xác. Cảm ơn đã giúp tôi hiểu rõ hơn về bản thân.",
    date: "20/09/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_3.webp`,
    full: `/images/feedbacks/fb_3.webp`,
    stars: 5,
    customerName: "L.P.",
    service: "Bài Oracle",
    comment: "Rất hài lòng với kết quả. Những lời tư vấn rất hữu ích.",
    date: "21/09/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_4.webp`,
    full: `/images/feedbacks/fb_4.webp`,
    stars: 5,
    customerName: "P.N.",
    service: "Combo",
    comment: "Tuyệt hảo! Tôi đã có thể đưa ra quyết định quan trọng nhờ bài xem.",
    date: "22/09/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_5.webp`,
    full: `/images/feedbacks/fb_5.webp`,
    stars: 5,
    customerName: "B.Đ.",
    service: "Tarot",
    comment: "Cảm ơn rất nhiều! Dịch vụ chuyên nghiệp và tận tâm.",
    date: "23/09/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_6.webp`,
    full: `/images/feedbacks/fb_6.webp`,
    stars: 5,
    customerName: "Đ.M.",
    service: "Tea Leaf",
    comment: "Quá bất ngờ với độ chính xác. Đúng những gì tôi đang thắc mắc.",
    date: "24/09/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_7.webp`,
    full: `/images/feedbacks/fb_7.webp`,
    stars: 5,
    customerName: "H.H.",
    service: "Bài Oracle",
    comment: "Rất cảm kích! Những lời khuyên đã giúp tôi vượt qua khó khăn.",
    date: "25/09/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_8.webp`,
    full: `/images/feedbacks/fb_8.webp`,
    stars: 5,
    customerName: "V.T.",
    service: "Combo",
    comment: "Dịch vụ chất lượng cao. Tôi sẽ giới thiệu cho bạn bè.",
    date: "26/09/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_9.webp`,
    full: `/images/feedbacks/fb_9.webp`,
    stars: 5,
    customerName: "Đ.L.",
    service: "Tarot",
    comment: "Cảm thấy an tâm hơn rất nhiều sau buổi tư vấn.",
    date: "27/09/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_10.webp`,
    full: `/images/feedbacks/fb_10.webp`,
    stars: 5,
    customerName: "Đ.H.",
    service: "Tea Leaf",
    comment: "Rất ấn tượng với kiến thức sâu rộng của chuyên gia.",
    date: "28/09/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_11.webp`,
    full: `/images/feedbacks/fb_11.webp`,
    stars: 5,
    customerName: "L.A.",
    service: "Bài Oracle",
    comment: "Đây là lần xem bài hay nhất tôi từng trải nghiệm.",
    date: "29/09/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_12.webp`,
    full: `/images/feedbacks/fb_12.webp`,
    stars: 5,
    customerName: "N.M.",
    service: "Combo",
    comment: "Cảm ơn đã mang đến cho tôi sự rõ ràng và bình an.",
    date: "30/09/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_13.webp`,
    full: `/images/feedbacks/fb_13.webp`,
    stars: 5,
    customerName: "T.P.",
    service: "Tarot",
    comment: "Quá xứng đáng với số tiền bỏ ra. Kết quả vượt mong đợi.",
    date: "01/10/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_14.webp`,
    full: `/images/feedbacks/fb_14.webp`,
    stars: 5,
    customerName: "L.Đ.",
    service: "Tea Leaf",
    comment: "Rất hài lòng! Tôi sẽ quay lại vào lần sau.",
    date: "02/10/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_15.webp`,
    full: `/images/feedbacks/fb_15.webp`,
    stars: 5,
    customerName: "P.Q.",
    service: "Bài Oracle",
    comment: "Dịch vụ nhanh chóng và hiệu quả. Không phải chờ đợi lâu.",
    date: "03/10/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_16.webp`,
    full: `/images/feedbacks/fb_16.webp`,
    stars: 5,
    customerName: "B.T.",
    service: "Combo",
    comment: "Cảm thấy được lắng nghe và thấu hiểu sâu sắc.",
    date: "04/10/2026",
  },
  {
    type: "image" as const,
    src: `/images/feedbacks/thumbs/fb_17.webp`,
    full: `/images/feedbacks/fb_17.webp`,
    stars: 5,
    customerName: "N.Y.",
    service: "Tarot",
    comment: "Những lời tiên đoán rất chính xác. Tôi ngạc nhiên lắm!",
    date: "05/10/2026",
  },
];

const WHY_US = [
  { icon: "💜", title: "Được lắng nghe", desc: "Không phán xét, không vội vàng. Bạn có thể nói hết những điều giữ trong lòng bấy lâu" },
  { icon: "🔮", title: "Nhìn rõ lòng mình", desc: "Không chỉ đoán tương lai — bạn ra về với hướng đi rõ ràng và lòng nhẹ hơn" },
  { icon: "🔒", title: "Riêng tư tuyệt đối", desc: "Mọi tâm sự chỉ ở lại trong buổi xem đó. Nơi an toàn để bạn dám mở lòng" },
  { icon: "🤝", title: "Đồng hành khi cần", desc: "Những lúc chênh vênh nhất, bạn không phải chờ một mình — phản hồi trong 24 giờ" },
];

const SERVICE_CATEGORIES = [
  { icon: "⏳", name: "Xem theo thời gian", desc: "1–2 tiếng dùng mọi loại bài để gỡ hết thắc mắc — online từ 500k, offline từ 800k", about: "Cận kề, lắng nghe tâm sự và cùng bạn giải quyết vấn đề trong 1–2 tiếng. Có cả online lẫn gặp trực tiếp.", link: "/services" },
  { icon: "🃏", name: "Tarot", desc: "Từ 1 câu hỏi duy nhất tới full mọi vấn đề — chỉ từ 200k", about: "Trải bài cơ bản, chuyên sâu 1 chuyện, full không giới hạn câu hỏi. Hợp nhất khi lòng đang rối và cần câu trả lời ngay.", link: "/services" },
  { icon: "🍃", name: "Tea Leaf", desc: "Lá trà thì thầm về 3 tháng tới cả năm — từ 250k", about: "Bài tuần, 6 tháng, full 12 tháng tài lộc tình duyên. Hợp khi bạn muốn nhìn xa để chuẩn bị lòng.", link: "/services" },
  { icon: "🎴", name: "Bài khác", desc: "Haletu, Oracle từ 100k, Lenormand, The Lover, The Heart", about: "Mỗi bộ bài một thế mạnh: lời khuyên, vận mệnh, tình yêu 1–3 tháng tới. Vào bảng giá để chọn đúng bài.", link: "/services" },
  { icon: "💫", name: "Combo", desc: "Đi sâu một lần bằng nhiều loại bài — từ 650k, HOT nhất 3tr", about: "Tarot + Trà + Lenormand + trị liệu tâm lý, có bảo hành xem lại. Hợp khi lòng mang quá nhiều điều.", link: "/services" },
  { icon: "🔮", name: "Dịch vụ khác", desc: "Thần số học, bản đồ sao, tử vi đôi, đá phong thủy", about: "Những mảnh ghép giúp bạn hiểu mình hơn mỗi ngày — và cả khóa dạy xem Tarot nếu bạn muốn học.", link: "/services" },
];

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [lightboxItem, setLightboxItem] = useState<typeof FEEDBACKS[number] | null>(null);
  const cardsRevealed = useRef(false);

  useEffect(() => {
    getServices().then(setServices).catch((e) => console.warn("getServices failed:", e.message));
  }, []);

  // Stagger entry for service cards
  // NOTE: threshold phải là 0 — container cao hơn viewport trên mobile
  // nên threshold > 0 (vd 0.2) có thể không bao giờ đạt được.
  useEffect(() => {
    const el = document.getElementById("service-cards");
    if (!el || cardsRevealed.current) return;

    const reveal = () => {
      if (cardsRevealed.current) return;
      cardsRevealed.current = true;
      const items = el.querySelectorAll(".service-card-item");
      try {
        anime({
          targets: items,
          opacity: [0, 1],
          translateY: [30, 0],
          delay: anime.stagger(120, { start: 200 }),
          duration: 600,
          easing: "easeOutCubic",
          complete: () => {
            (items as unknown as HTMLElement[]).forEach((it) => {
              (it as HTMLElement).style.opacity = "1";
              (it as HTMLElement).style.transform = "none";
            });
          },
        });
      } catch {
        (items as unknown as HTMLElement[]).forEach((it) => {
          (it as HTMLElement).style.opacity = "1";
          (it as HTMLElement).style.transform = "none";
        });
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
          clearTimeout(fallback);
        }
      },
      { threshold: 0, rootMargin: "0px 0px 100px 0px" }
    );
    observer.observe(el);
    // Fallback: nếu observer không bao giờ fire (trình duyệt cũ / lỗi),
    // vẫn hiện cards sau 2.5s thay vì kẹt ở opacity-0.
    const fallback = setTimeout(() => {
      reveal();
      observer.disconnect();
    }, 2500);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  // Stagger entry for feedback cards
  // FIX mobile không hiển thị: trước đây dùng threshold 0.15 trên cả
  // container #feedback-cards. Trên mobile grid 1 cột cao ~8500px,
  // viewport ~700px nên tỉ lệ hiển thị tối đa chỉ ~8% < 15% → observer
  // không bao giờ fire → tất cả .feedback-card kẹt ở opacity-0.
  // Dùng threshold 0 (chỉ cần 1px lọt vào viewport là reveal) + fallback timer.
  useEffect(() => {
    const el = document.getElementById("feedback-cards");
    if (!el) return;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      const items = el.querySelectorAll(".feedback-card");
      try {
        anime({
          targets: items,
          opacity: [0, 1],
          translateY: [24, 0],
          delay: anime.stagger(100, { start: 100 }),
          duration: 600,
          easing: "easeOutCubic",
          complete: () => {
            (items as unknown as HTMLElement[]).forEach((it) => {
              (it as HTMLElement).style.opacity = "1";
              (it as HTMLElement).style.transform = "none";
            });
          },
        });
      } catch {
        (items as unknown as HTMLElement[]).forEach((it) => {
          (it as HTMLElement).style.opacity = "1";
          (it as HTMLElement).style.transform = "none";
        });
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
          clearTimeout(fallback);
        }
      },
      { threshold: 0, rootMargin: "0px 0px 100px 0px" }
    );
    observer.observe(el);
    // Fallback: đảm bảo không bao giờ kẹt ở opacity-0 trên mobile.
    const fallback = setTimeout(() => {
      reveal();
      observer.disconnect();
    }, 2500);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <main className="min-h-screen">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[100dvh] flex overflow-hidden pt-16">
        <Suspense fallback={null}>
          <GalaxyTarotSystem count={36} cardData={tarotCardsData as any} />
        </Suspense>

        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto m-auto py-10">
          {/* Brand logo */}
          <img
            src="/logo/logo-192.webp"
            srcSet="/logo/logo-192.webp 192w, /logo/logo-512.webp 512w"
            sizes="(max-width: 768px) 192px, 240px"
            width={192}
            height={225}
            alt="Tarot Tea Leaf"
            loading="eager"
            decoding="async"
            className="w-48 md:w-60 h-auto mx-auto mb-6 drop-shadow-[0_0_16px_rgba(212,168,67,0.3)]"
          />

          <p className="font-logo text-mist tracking-widest uppercase text-base md:text-lg mb-4 opacity-90">
            Reader · Healer · Coaching
          </p>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-mist mb-4 leading-tight">
            Tarot<br />Tea Leaf
          </h1>

          <p className="font-body text-lilac text-xl md:text-2xl italic mb-8 leading-relaxed">
            Có những điều chẳng biết tỏ cùng ai — hãy để Tarot, Tea Leaf lắng nghe và vỗ về bạn.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SparkleButton
              as="link"
              href="/booking"
              className="w-full sm:w-auto max-w-[320px] px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 transition-all shadow-lg shadow-arcane/25 btn-glow"
            >
              ✨ Đặt lịch xem bài
            </SparkleButton>
            <SparkleButton
              as="link"
              href="/services"
              className="w-full sm:w-auto max-w-[320px] px-8 py-3 rounded-xl font-display text-sm tracking-widest uppercase border border-velvet text-lilac hover:border-arcane/50 hover:text-mist transition-all"
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
          <div className="grid grid-cols-3 gap-3 sm:gap-8 text-center">
            <div>
              <p className="font-display text-3xl md:text-4xl text-candle-gold">
                <CountUp end={500} suffix="+" />
              </p>
              <p className="font-body text-lilac/90 text-sm sm:text-base tracking-wide mt-1">Khách hàng</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl text-candle-gold">
                <CountUp end={5} suffix="★" />
              </p>
              <p className="font-body text-lilac/90 text-sm sm:text-base tracking-wide mt-1">Đánh giá</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl text-candle-gold">
                <CountUp end={10} suffix="+" />
              </p>
              <p className="font-body text-lilac/90 text-sm sm:text-base tracking-wide mt-1">Năm kinh nghiệm</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ─── Đào tạo ─── */}
      <Reveal className="py-16 md:py-24" amount={0.2}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border border-arcane/30 bg-gradient-to-br from-velvet/80 via-void to-arcane/20 shadow-2xl shadow-arcane/20">
            <div className="relative max-w-3xl mx-auto px-6 py-12 md:px-12 md:py-16 text-center">
              <span className="inline-block bg-candle-gold text-void font-display text-xs tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg mb-5">
                Đào tạo
              </span>
              <h2 className="font-display text-3xl md:text-5xl text-mist mb-5 leading-tight">
                Học Tarot &amp; chữa lành
                <br />
                cùng My
              </h2>
              <p className="font-body text-lilac italic mb-7 leading-relaxed max-w-md mx-auto">
                Từ người mới hoàn toàn tới Reader chuyên nghiệp — và sâu hơn nữa là hành trình
                tái sinh chính mình.
              </p>

              {/* 3 khóa học tóm tắt */}
              <div className="flex flex-wrap items-stretch justify-center gap-2.5 md:gap-3 mb-8">
                {[
                  { top: "Cơ bản Tarot", bottom: "5.000.000₫" },
                  { top: "Nâng cao", bottom: "10.000.000₫" },
                  { top: "Tái Sinh (ưu đãi)", bottom: "10.000.000₫" },
                ].map((s) => (
                  <div
                    key={s.top}
                    className="rounded-xl border border-candle-gold/40 bg-candle-gold/10 px-5 py-3 min-w-[140px]"
                  >
                    <p className="font-body text-candle-gold text-xs tracking-widest uppercase">{s.top}</p>
                    <p className="font-display text-2xl md:text-2xl font-bold text-candle-gold drop-shadow-[0_0_12px_rgba(212,168,67,0.35)]">{s.bottom}</p>
                  </div>
                ))}
              </div>

              <ul className="space-y-3 mb-9 text-left max-w-sm mx-auto">
                {[
                  "Lộ trình rõ ràng từ cơ bản tới chuyên nghiệp",
                  "Học đi đôi với thực hành và chữa lành bản thân",
                  "Được My đồng hành và tư vấn lộ trình phù hợp",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-lilac/90 text-sm">
                    <span className="text-candle-gold mt-0.5">✦</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <SparkleButton
                  as="link"
                  href="/recruit"
                  className="w-full sm:w-auto px-10 py-4 rounded-xl font-display text-sm tracking-widest uppercase bg-candle-gold text-void hover:bg-candle-gold/85 transition-all shadow-lg shadow-candle-gold/25 btn-glow"
                >
                  Xem các khóa học
                </SparkleButton>
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
            ✦ Bạn đang tìm câu trả lời cho điều gì? ✦
          </p>
          <h2 className="font-display text-2xl md:text-4xl text-mist text-center mb-3">
            Tìm một nơi để lòng được nhẹ hơn
          </h2>
          <p className="font-body text-lilac/70 italic text-center mb-12 max-w-xl mx-auto">
            Tình cảm, sự nghiệp hay những ngã rẽ không tên — luôn có một trải bài dành cho điều bạn đang mang trong lòng.
          </p>

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
                <p className="font-body text-lilac/60 text-sm leading-relaxed mt-3 pt-3 border-t border-velvet/50">
                  <span className="text-candle-gold/80 text-xs tracking-widest uppercase block mb-1">Loại bài này là gì?</span>
                  {cat.about}
                </p>
                <span className="inline-block mt-4 font-body text-candle-gold text-sm font-semibold tracking-wider uppercase opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  Xem bảng giá →
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
          <p className="font-body text-candle-gold text-sm tracking-widest uppercase text-center mb-2">
            ✦ Nơi bạn được là chính mình ✦
          </p>
          <h2 className="font-display text-2xl md:text-4xl text-mist text-center mb-3">
            Vì sao nhiều người tìm đến My?
          </h2>
          <p className="font-body text-lilac/70 italic text-center mb-12 max-w-xl mx-auto">
            Không phải để nghe phán xét đúng sai — mà để được hiểu, được gỡ rối và bước tiếp nhẹ nhàng hơn.
          </p>
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

          <div id="feedback-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {FEEDBACKS.map((fb, i) => (
              <button
                key={i}
                onClick={() => setLightboxItem(fb)}
                className="feedback-card opacity-0 text-left w-full group cursor-pointer"
                aria-label={`Xem phản hồi từ ${fb.customerName} - ${fb.service}`}
              >
                <div className="relative bg-velvet/30 border border-velvet/60 rounded-2xl overflow-hidden hover:border-arcane/40 hover:bg-velvet/50 transition-all duration-300 shadow-lg shadow-velvet/20 group-hover:shadow-xl group-hover:shadow-arcane/20">
                  
                  <div className="aspect-[4/5] w-full">
                    <img
                      src={fb.src}
                      alt={`Feedback từ ${fb.customerName}`}
                      loading={i < 4 ? "eager" : "lazy"}
                      decoding="async"
                      width={480}
                      height={600}
                      onError={(e) => {
                        const el = e.currentTarget;
                        const step = el.dataset.fbkFallback || "0";
                        if (step === "0" && fb.full !== fb.src) {
                          // thumbs webp -> full webp
                          el.dataset.fbkFallback = "1";
                          el.src = fb.full;
                        } else if (step <= "1") {
                          // webp -> jpg (phòng bản build thiếu webp / máy cũ)
                          el.dataset.fbkFallback = "2";
                          el.src = fb.src.replace(/\.webp$/, ".jpg");
                        } else {
                          el.dataset.fbkFallback = "3";
                          el.src = fb.full.replace(/\.webp$/, ".jpg");
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/40 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-xs">🔍</span>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-t from-velvet/80 to-transparent border-t border-velvet/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-candle-gold text-xs font-medium truncate max-w-[60%]">
                        {fb.customerName}
                      </span>
                      <span className="text-lilac/90 text-xs truncate max-w-[40%]">
                        {fb.service}
                      </span>
                    </div>
                    <p className="text-lilac/90 text-xs line-clamp-2 mb-1.5">
                      {fb.comment}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-candle-gold text-xs tracking-wider">
                        {'★'.repeat(fb.stars)}
                      </div>
                      <span className="text-lilac/90 text-xs">
                        {fb.date}
                      </span>
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
          item={{ ...lightboxItem, src: lightboxItem.full }}
          onClose={() => setLightboxItem(null)}
        />
      )}

      {/* ─── CTA ─── */}
      <Reveal className="py-16 md:py-24" delay={150}>
        <div className="text-center px-4">
          <h2 className="font-display text-2xl md:text-4xl text-mist mb-4">
            Đêm nay, đừng ôm nỗi lo một mình
          </h2>
          <p className="font-body text-lilac italic mb-8 max-w-md mx-auto">
            Đặt một buổi xem — để có người lắng nghe, để lòng được sáng rõ và bình yên trở lại.
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

      {/* ─── Câu chuyện của My ─── */}
      <Reveal className="py-16 md:py-24" amount={0.15}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="font-body text-candle-gold text-sm tracking-widest uppercase text-center mb-2">
            ✦ Câu chuyện của My ✦
          </p>
          <h2 className="font-display text-2xl md:text-4xl text-mist text-center mb-3 leading-tight">
            Cô gái từng vỡ vụn,<br />nay là nơi bình yên của hàng trăm người
          </h2>
          <p className="font-body text-lilac/70 italic text-center mb-10 max-w-xl mx-auto">
            Nếu bạn thấy mình trong những dòng này — thì buổi xem này là dành cho bạn.
          </p>

          <div className="bg-velvet/40 border border-velvet rounded-2xl p-6 md:p-10 space-y-5 font-body text-lilac leading-relaxed">
            <p>
              My đã từng mở một quán cà phê tổ hợp giải trí cho giới trẻ ở Hà Nội —
              mang theo cả thanh xuân và niềm tin rằng chỉ cần hết mình thì giấc mơ nào
              cũng thành. Rồi nó thất bại. Sạch trơn.
            </p>
            <p>
              Sau lần kiệt sức đó, My rơi vào trầm cảm và lui về ở ẩn suốt một năm.
              Một năm không muốn gặp ai, không muốn bắt đầu lại điều gì.
            </p>
            <p>
              My đã từng không hạnh phúc. Đã từng cho đi rất nhiều, yêu hết mình
              rồi đau đến nghẹt thở. Đã từng bị phản bội, bị lừa dối bởi chính
              những người mình tin nhất.
            </p>
            <p>
              My đã từng béo, từng xấu, từng bị bạo lực học đường, từng bị tẩy chay
              và kỳ thị chỉ vì mình khác biệt. Đã từng soi gương mà không nhận ra
              người trong đó là ai.
            </p>
            <p className="font-display text-lg md:text-xl text-mist leading-relaxed">
              Vậy làm sao My vượt qua — để trở thành cô gái luôn tràn trề năng lượng
              mà hôm nay ai cũng muốn ở cạnh?
            </p>
            <p>
              Không có phép màu nào cả. Chỉ là một ngày, My học cách ngồi lại và ôm lấy
              chính mình — ôm cả những mảnh vỡ, những vết thương, những phiên bản
              từng bị chê cười. My học Tarot, học Tea Leaf, học chữa lành — không phải
              để đoán số phận, mà để hiểu lòng người, bắt đầu từ lòng mình.
            </p>
            <p className="text-candle-gold/90">
              Và hôm nay, My ở đây — để làm cho bạn điều mà năm đó My từng ước có ai đó
              làm cho mình: lắng nghe, không phán xét, và cùng bạn tìm lại ánh sáng.
            </p>
          </div>

          {/* Video — Chemie Coffee, nơi giấc mơ bắt đầu */}
          <div className="mt-8">
            <p className="font-body text-candle-gold/80 text-xs tracking-widest uppercase text-center mb-3">
              Xem thêm — Chemie Coffee, nơi giấc mơ bắt đầu
            </p>
            <div className="relative overflow-hidden rounded-2xl border border-arcane/30 shadow-xl shadow-arcane/20">
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/4UwqrUl5wP8"
                  title="Chemie Coffee — Tổ hợp Cà Phê Boardgame 24/7 tại Hà Nội"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/about"
              className="font-body text-lilac hover:text-mist underline underline-offset-4 decoration-arcane/30 transition-all"
            >
              Hiểu thêm về My →
            </Link>
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
