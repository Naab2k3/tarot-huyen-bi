import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import anime from "animejs";
import { Icon } from "./icons";

/**
 * "Tìm một nơi để lòng được nhẹ hơn" — thay 6 ô dịch vụ cũ bằng 3 ô lật thẻ.
 *
 * Luồng: 3 ô (Tư vấn · Huyền học · Đào tạo) → lật thẻ ra các nhánh
 * (vd Huyền học → Khám phá bản thân / Dự đoán tương lai / …) → bấm nhánh
 * thì các dịch vụ chi tiết hiện ra ở khung bên dưới.
 *
 * `service` phải khớp từng chữ với tên service trong DB (backend/app/seed.py)
 * để trang đặt lịch preselect được — thiếu thì dùng `to` hoặc để trống (→ /contact).
 */

type JourneyItem = {
  label: string;
  note?: string;
  price: string;
  /** Tên khớp đúng service trong DB → /booking?service=<tên> */
  service?: string;
  /** Đích khác (vd khóa học) */
  to?: string;
};

type JourneyBranch = {
  icon: string;
  name: string;
  hint: string;
  items: JourneyItem[];
  footer?: string;
};

type JourneyBox = {
  id: string;
  /** icon trong components/icons.tsx */
  icon: string;
  title: string;
  desc: string;
  /** tên các nhánh — hiện sẵn ở mặt trước để khách biết bên trong có gì */
  preview: string[];
  branches: JourneyBranch[];
};

const JOURNEY: JourneyBox[] = [
  {
    id: "tu-van",
    icon: "heart",
    title: "Tư vấn tâm lý · Tình cảm",
    desc: "Ngồi lại cùng Reader 1–2 tiếng. Mọi loại bài đều có thể được dùng — miễn là bạn được nhẹ lòng.",
    preview: ["Online", "Offline", "Trọn 1–2 tiếng"],
    branches: [
      {
        icon: "💬",
        name: "Online",
        hint: "Gọi video, ở đâu cũng được",
        items: [
          {
            label: "Xem Online 1 tiếng",
            note: "Gọi video 60 phút, hỏi đáp trực tiếp",
            price: "500k /tiếng",
            service: "Xem Online 1 tiếng",
          },
          {
            label: "Xem Online 2 tiếng",
            note: "Gọi video 2 tiếng, đi sâu mọi chuyện",
            price: "900k /2 tiếng",
            service: "Xem Online 2 tiếng",
          },
        ],
      },
      {
        icon: "🏠",
        name: "Offline",
        hint: "Gặp trực tiếp tại tiệm",
        items: [
          {
            label: "Xem Offline 1 tiếng",
            note: "Gặp trực tiếp tại tiệm trong 60 phút",
            price: "800k /tiếng",
            service: "Xem Offline 1 tiếng",
          },
          {
            label: "Xem Offline 2 tiếng",
            note: "Gặp trực tiếp, gỡ rối trọn vẹn",
            price: "1tr5 /2 tiếng",
            service: "Xem Offline 2 tiếng",
          },
        ],
      },
    ],
  },
  {
    id: "huyen-hoc",
    icon: "moon",
    title: "Huyền học · Tâm linh",
    desc: "Bốn lối vào: hiểu chính mình, nhìn về phía trước, xin một lời khuyên — hoặc xem hai người hợp nhau đến đâu.",
    preview: ["Khám phá bản thân", "Dự đoán tương lai", "Lời khuyên", "Xem đôi"],
    branches: [
      {
        icon: "🔍",
        name: "Khám phá bản thân",
        hint: "Hiểu mình trước tiên",
        items: [
          {
            label: "Tarot",
            note: "Trải bài để soi rõ chính mình, từ 1 câu hỏi tới full mọi vấn đề",
            price: "200.000",
            service: "Tarot cơ bản 1 câu hỏi",
          },
          {
            label: "Bản đồ sao cá nhân",
            note: "Lá số chiêm tinh chi tiết về bạn",
            price: "1.000.000",
            service: "Bản đồ sao cá nhân",
          },
          {
            label: "Tử Vi cá nhân",
            note: "Lá số tử vi trọn đời",
            price: "800.000",
            service: "Tử vi cá nhân",
          },
          {
            label: "Thần số học tiềm năng",
            note: "Tặng bản thần số học 125 trang",
            price: "800.000",
            service: "Thần số học",
          },
        ],
      },
      {
        icon: "⏳",
        name: "Dự đoán tương lai",
        hint: "Vài tuần tới cả năm",
        items: [
          {
            label: "Tea Leaf",
            note: "Lá trà thì thầm chuyện tuần này tới 12 tháng",
            price: "250.000",
            service: "Tea Leaf 3 tháng full",
          },
          {
            label: "Oracle",
            note: "Mốc thời gian chính xác cho câu hỏi của bạn",
            price: "300.000",
            service: "Tín hiệu vũ trụ 30'",
          },
          {
            label: "Lenormand",
            note: "Kể trọn một câu chuyện quá khứ – hiện tại – tương lai",
            price: "250.000",
            service: "Lenormand vận mệnh",
          },
          {
            label: "Kinh Dịch",
            note: "Gieo quẻ cho đúng việc bạn đang hỏi",
            price: "Liên hệ",
          },
          {
            label: "The Lover",
            note: "Tình duyên 1–3 tháng tới",
            price: "200.000",
            service: "Bài The Lover",
          },
          {
            label: "Tử Vi vận hạn",
            note: "Vận hạn theo năm của bạn",
            price: "Liên hệ",
          },
          {
            label: "Bản đồ sao vận hạn",
            note: "Thời điểm thuận – nghịch trong thời gian tới",
            price: "800.000",
            service: "Bản đồ sao vận hạn",
          },
          {
            label: "Thần số học",
            note: "Mốc đường đời, chu kỳ cuộc đời",
            price: "800.000",
            service: "Thần số học",
          },
          {
            label: "Tarot",
            note: "Cho khoảng thời gian ngắn — trả lời ngay điều đang bận lòng",
            price: "200.000",
            service: "Tarot cơ bản 1 câu hỏi",
          },
        ],
      },
      {
        icon: "🕯️",
        name: "Lời khuyên",
        hint: "Chỉ nói bạn nên làm gì",
        items: [
          {
            label: "Haletu",
            note: "Lời khuyên cho tình cảm và cuộc sống, 30 phút",
            price: "300.000",
            service: "Haletu xin lời khuyên 30'",
          },
          {
            label: "The Heart",
            note: "Chỉ dẫn tình cảm trong 30 phút",
            price: "300.000",
            service: "Bài The Heart 3 lá",
          },
          {
            label: "Tarot",
            note: "Lời khuyên chuẩn nhất khi lòng đã mỏi",
            price: "300.000",
            service: "Tarot chuyên sâu 1 chuyện",
          },
        ],
      },
      {
        icon: "💞",
        name: "Xem đôi",
        hint: "Hợp nhau đến đâu",
        items: [
          {
            label: "Bản đồ sao đôi",
            note: "Soi độ hoà hợp giữa hai lá số",
            price: "1.500.000",
            service: "Bản đồ sao đôi",
          },
          {
            label: "Tử Vi đôi",
            note: "Đánh giá mức độ phù hợp",
            price: "1.500.000",
            service: "Tử vi xem đôi",
          },
          {
            label: "Tarot đôi",
            note: "Trải bài cho cả hai người",
            price: "Liên hệ",
          },
        ],
      },
    ],
  },
  {
    id: "khoa-hoc",
    icon: "book",
    title: "Đào tạo",
    desc: "Từ người chưa biết gì về Tarot, tới Reader chuyên nghiệp — và một khóa để chữa lành chính mình.",
    preview: ["Cơ bản", "Nâng cao", "Tái sinh"],
    branches: [
      {
        icon: "📘",
        name: "Cơ bản",
        hint: "Bắt đầu từ con số 0",
        items: [
          {
            label: "Khóa Cơ bản Tarot",
            note: "2 chương: làm quen & kết nối với Tarot, đi sâu 78 lá ẩn chính – ẩn phụ",
            price: "5.000.000",
            to: "/recruit",
          },
        ],
        footer: "Đăng ký để My tư vấn lộ trình phù hợp.",
      },
      {
        icon: "📗",
        name: "Nâng cao",
        hint: "Đọc bài như một Reader",
        items: [
          {
            label: "Khóa Nâng cao",
            note: "3 chương: nhớ nhanh cả bộ bài, trở thành Reader chuyên nghiệp, kiếm tiền từ Tarot",
            price: "10.000.000",
            to: "/recruit",
          },
        ],
        footer: "Đăng ký để My tư vấn lộ trình phù hợp.",
      },
      {
        icon: "🌱",
        name: "Tái sinh",
        hint: "Chữa lành tổn thương",
        items: [
          {
            label: "Khóa Tái Sinh",
            note: "4 phần: khái niệm, chữa lành tổn thương, người nam châm, thực hành thở & thiền",
            price: "10.000.000",
            to: "/recruit",
          },
        ],
        footer: "Giai đoạn thử nghiệm — ưu đãi từ 15.000.000₫.",
      },
    ],
  },
];

function itemHref(item: JourneyItem): string {
  if (item.to) return item.to;
  if (item.service) return `/booking?service=${encodeURIComponent(item.service)}`;
  return "/contact";
}

function itemCta(item: JourneyItem): string {
  if (item.to && item.to.startsWith("/recruit")) return "Xem chi tiết khóa học";
  if (item.to) return "Xem chi tiết";
  if (item.service) return "Đặt lịch dịch vụ này";
  return "Liên hệ để My tư vấn";
}

export default function ServiceJourney() {
  const [openBox, setOpenBox] = useState<string | null>(null);
  const [picked, setPicked] = useState<{ boxId: string; branch: string } | null>(null);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const revealed = useRef(false);

  // Stagger entry cho 3 ô thẻ.
  // NOTE: threshold phải là 0 — container cao hơn viewport trên mobile nên
  // threshold > 0 có thể không bao giờ đạt được.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const reveal = () => {
      if (revealed.current) return;
      revealed.current = true;
      const items = el.querySelectorAll<HTMLElement>(".journey-card");
      const settle = () =>
        items.forEach((it) => {
          it.style.opacity = "1";
          it.style.transform = "none";
        });
      try {
        anime({
          targets: items,
          opacity: [0, 1],
          translateY: [30, 0],
          delay: anime.stagger(140, { start: 150 }),
          duration: 600,
          easing: "easeOutCubic",
          complete: settle,
        });
      } catch {
        settle();
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
    // Fallback: observer không fire (trình duyệt cũ / lỗi) thì vẫn hiện thẻ.
    const fallback = setTimeout(() => {
      reveal();
      observer.disconnect();
    }, 2500);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  // Danh sách dịch vụ hiện ngay trong thẻ, chỗ vừa bấm — không cần khung riêng.
  const openCard = (box: JourneyBox) => {
    if (openBox === box.id) {
      setOpenBox(null);
      setPicked(null);
      return;
    }
    setOpenBox(box.id);
    setPicked(null);
  };

  const activeBox = JOURNEY.find((b) => b.id === picked?.boxId) ?? null;
  const activeBranch =
    activeBox?.branches.find((br) => br.name === picked?.branch) ?? null;

  return (
    <>
      <div
        ref={gridRef}
        id="service-cards"
        className="grid grid-cols-1 items-start gap-5 md:grid-cols-3"
      >
        {JOURNEY.map((box) => {
          const flipped = openBox === box.id;
          const isPickedHere = flipped && picked?.boxId === box.id;
          return (
            <div
              key={box.id}
              className={`journey-card flip-card opacity-0 ${flipped ? "is-open" : ""}`}
              data-flipped={flipped}
            >
              <div className="flip-card-inner h-full min-h-[200px] md:h-[440px] md:min-h-[440px]">
                {/* ── Mặt trước ── */}
                <button
                  type="button"
                  onClick={() => openCard(box)}
                  aria-expanded={flipped}
                  aria-hidden={flipped}
                  tabIndex={flipped ? -1 : undefined}
                  className={`flip-face tap-card relative group flex flex-col w-full h-full overflow-hidden text-left rounded-2xl p-4 md:p-6 ${
                    flipped ? "pointer-events-none" : ""
                  }`}
                >
                  <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-candle-gold/80 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                  {/* Mặt trước: icon → tiêu đề → mô tả → chip xem trước.
                      Mỗi khối có chiều cao cố định (min-h) nên 3 thẻ thẳng hàng
                      với nhau từng dòng, nhìn cân đối thay vì lệch nhau. */}
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-2xl bg-candle-gold/20 border-2 border-candle-gold/60 shadow-lg shadow-candle-gold/20 text-candle-gold group-hover:scale-110 group-hover:bg-candle-gold/35 group-hover:border-candle-gold transition-all">
                      <Icon name={box.icon} className="w-5 h-5 md:w-7 md:h-7" />
                    </span>
                    <h3 className="font-display text-lg md:text-xl tracking-wider text-mist mt-3 md:mt-4 mb-1.5 md:mb-2 min-h-[3.5rem] group-hover:text-candle-gold transition-colors">
                      {box.title}
                    </h3>
                    <p className="font-body text-lilac/85 text-sm md:text-base leading-snug md:leading-relaxed line-clamp-2 min-h-[2.4rem] md:line-clamp-3 md:min-h-[4.9rem]">
                      {box.desc}
                    </p>
                    {/* Chip xem trước: ẩn ở mobile (<sm) và ở md (3 cột hẹp nên
                        chip rớt dòng lộn xộn) — hiện lại từ lg khi thẻ đủ rộng */}
                    <div className="hidden sm:flex md:hidden lg:flex flex-wrap items-start content-start gap-1.5 mt-4 sm:min-h-[3.7rem] lg:min-h-[3.7rem]">
                      {box.preview.map((p) => (
                        <span
                          key={p}
                          className="font-body text-[12px] leading-none tracking-wide text-lilac/75 border border-arcane/30 bg-arcane/10 rounded-full px-2.5 py-1.5"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
                {/* ── Mặt sau: chọn lối vào, rồi danh sách dịch vụ hiện ngay trong thẻ ── */}
                <div
                  aria-hidden={!flipped}
                  className={`flip-face flip-face--back relative overflow-hidden flex flex-col h-full bg-gradient-to-br from-arcane/30 via-velvet/70 to-void/80 border-2 rounded-2xl p-4 md:p-5 ${
                    flipped ? "" : "pointer-events-none"
                  }`}
                >
                  <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-candle-gold/80 to-transparent opacity-70" />
                  <div className="flex items-center justify-between gap-2 mb-2 md:mb-3">
                    <span className="font-body text-candle-gold text-[11px] md:text-xs tracking-widest uppercase">
                      {box.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenBox(null);
                        setPicked(null);
                      }}
                      aria-label="Úp thẻ lại"
                      tabIndex={flipped ? undefined : -1}
                      className="shrink-0 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full border border-velvet text-lilac/80 hover:border-candle-gold hover:text-candle-gold hover:bg-candle-gold/15 transition-colors"
                    >
                      <span aria-hidden className="text-xs leading-none">
                        ↺
                      </span>
                    </button>
                  </div>

                  {isPickedHere && activeBranch ? (
                    /* ── Đã chọn một lối: danh sách dịch vụ ── */
                    <div
                      key={activeBranch.name}
                      className="animate-fade-in flex flex-1 flex-col min-h-0"
                    >
                      <button
                        type="button"
                        onClick={() => setPicked(null)}
                        tabIndex={flipped ? undefined : -1}
                        className="self-start font-body text-lilac/70 hover:text-candle-gold text-sm transition-colors"
                      >
                        ← Chọn lối khác
                      </button>
                      <h4 className="font-display text-lg md:text-xl text-mist mt-2">
                        <span aria-hidden className="mr-1.5">
                          {activeBranch.icon}
                        </span>
                        {activeBranch.name}
                      </h4>
                      <p className="font-body text-lilac/70 text-sm italic mb-3">
                        {activeBranch.hint}
                      </p>

                      <div className="journey-scroll flex-1 min-h-0 space-y-2 md:overflow-y-auto md:pr-1">
                        {activeBranch.items.map((item) => (
                          <Link
                            key={`${item.label}-${item.price}`}
                            to={itemHref(item)}
                            title={itemCta(item)}
                            tabIndex={flipped ? undefined : -1}
                            className="tap-row group/item block rounded-xl border border-velvet/60 bg-void/40 px-3 py-2 hover:border-candle-gold/60 hover:bg-velvet/40 transition-all"
                          >
                            <span className="flex items-baseline justify-between gap-2">
                              <span className="font-body text-mist text-[15px] font-medium group-hover/item:text-candle-gold transition-colors">
                                {item.label}
                              </span>
                              <span className="font-display text-candle-gold text-[13px] font-semibold tracking-wide whitespace-nowrap shrink-0">
                                {item.price}
                              </span>
                            </span>
                            {item.note && (
                              <span className="block font-body text-lilac/60 text-[13px] leading-snug mt-0.5">
                                {item.note}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>

                      {activeBranch.footer && (
                        <p className="font-body text-lilac/70 text-[13px] mt-3">
                          {activeBranch.footer}
                        </p>
                      )}
                    </div>
                  ) : (
                    /* ── Chưa chọn: danh sách các lối vào ── */
                    <div className="journey-scroll flex-1 min-h-0 flex flex-col md:overflow-y-auto md:pr-1">
                      {/* my-auto: dư chỗ thì canh giữa, hết chỗ thì xếp từ trên xuống */}
                      <div className="my-auto">
                        <p className="font-body text-lilac/70 text-[13px] md:text-sm italic mb-2 md:mb-3">
                          Bạn muốn đi lối nào?
                        </p>
                        {/* Mobile: 2 cột, chỉ tên lối (bỏ hint) cho gọn; từ md trở lên: 1 cột như cũ */}
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
                          {box.branches.map((br) => (
                            <button
                              key={br.name}
                              type="button"
                              onClick={() => setPicked({ boxId: box.id, branch: br.name })}
                              tabIndex={flipped ? undefined : -1}
                              className="tap-row w-full h-12 md:h-auto md:min-h-[64px] flex items-center gap-2 md:gap-3 text-left px-2 md:px-3 md:py-2.5 rounded-xl border border-velvet/60 bg-void/40"
                            >
                              <span
                                aria-hidden
                                className="shrink-0 text-base md:text-lg leading-none w-5 md:w-6 text-center"
                              >
                                {br.icon}
                              </span>
                              <span className="min-w-0 flex-1 flex flex-wrap items-baseline gap-x-2">
                                <span className="font-body text-[13px] md:text-[15px] font-medium leading-tight md:leading-normal text-mist line-clamp-2">
                                  {br.name}
                                </span>
                                <span className="hidden md:inline font-body text-lilac/60 text-[13px] leading-snug">
                                  {br.hint}
                                </span>
                              </span>
                              <span
                                aria-hidden
                                className="hidden md:inline shrink-0 text-sm text-lilac/50"
                              >
                                →
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
