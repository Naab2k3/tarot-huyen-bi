/**
 * Bảng giá dùng chung cho `/services` và bước chọn dịch vụ ở `/booking`.
 *
 * `name` của mỗi mục phải khớp **từng chữ** với tên service trong DB
 * (backend/app/seed.py) để `/booking?service=<tên>` preselect được.
 * Mục nào không có trong DB thì để `link` (contact / courses).
 */

export type CatalogLinkType = "booking" | "contact" | "courses";

export type CatalogItem = {
  name: string;
  detail?: string;
  /** Giá hiển thị ở /services (ở /booking lấy giá thật từ DB) */
  price: string;
  /** Mặc định: "booking" → /booking?service=<name> */
  link?: CatalogLinkType;
};

export type CatalogCategory = {
  id: string;
  icon: string;
  name: string;
  desc: string;
  items: CatalogItem[];
};

export const CATEGORIES: CatalogCategory[] = [
  {
    id: "thoi-gian",
    icon: "⏳",
    name: "Xem theo thời gian",
    desc: "Trò chuyện chuyên sâu 1–2 tiếng với Reader, dùng mọi loại bài để gỡ hết thắc mắc.",
    items: [
      { name: "Xem Online 1 tiếng", detail: "Gọi video, hỏi đáp trực tiếp", price: "500k /tiếng" },
      { name: "Xem Online 2 tiếng", detail: "Gọi video, đi sâu mọi chuyện", price: "900k /2 tiếng" },
      { name: "Xem Offline 1 tiếng", detail: "Gặp trực tiếp tại tiệm", price: "800k /tiếng" },
      { name: "Xem Offline 2 tiếng", detail: "Gặp trực tiếp, gỡ rối trọn vẹn", price: "1tr5 /2 tiếng" },
    ],
  },
  {
    id: "tarot",
    icon: "🃏",
    name: "Tarot",
    desc: "Từ 1 câu hỏi duy nhất tới full mọi vấn đề không giới hạn — mỗi kiểu một giá.",
    items: [
      { name: "Tarot cơ bản 1 câu hỏi", detail: "Trải bài cơ bản, tương ứng 1 câu hỏi", price: "200.000" },
      { name: "Tarot chuyên sâu 1 chuyện", detail: "Tình cảm, công việc, học hành, tiền tài…", price: "300.000" },
      { name: "Tarot full mọi vấn đề", detail: "Full mọi vấn đề, không gợi ý câu hỏi", price: "300.000" },
      { name: "Tarot chuyên sâu + tư vấn 30'", detail: "Gợi ý full câu hỏi + tư vấn trong 30 phút", price: "350.000" },
      { name: "Xem full Tarot", detail: "Không giới hạn thời gian, được gợi ý câu hỏi", price: "450.000" },
    ],
  },
  {
    id: "tra",
    icon: "🍃",
    name: "Tea Leaf",
    desc: "Lá trà thì thầm về những tháng sắp tới — từ 3 tháng tới cả năm.",
    items: [
      { name: "Tea Leaf 3 tháng full", detail: "Bài tuần / bài trà mốc thời gian gần", price: "250.000" },
      { name: "Tea Leaf 6 tháng 3 vấn đề", detail: "Trải bài 6 tháng, tập trung 3 vấn đề", price: "300.000" },
      { name: "Tea Leaf 6 tháng full", detail: "Full vấn đề trong 6 tháng", price: "400.000" },
      { name: "Bài trà full 12 tháng", detail: "Bài trà full 12 tháng / 3 vấn đề — tổng quan cả năm", price: "450.000" },
      { name: "Tea Leaf 12 tháng full", detail: "Tình cảm, tiền bạc, hôn nhân, thành công, hạnh phúc, may mắn, học hành, công việc", price: "500.000" },
    ],
  },
  {
    id: "bai-khac",
    icon: "🎴",
    name: "Các loại bài khác",
    desc: "Haletu, Oracle, Lenormand, The Lover, The Heart — mỗi bộ bài một thế mạnh riêng.",
    items: [
      { name: "Haletu xin lời khuyên 30'", detail: "Kèm tư vấn tình cảm từ kinh nghiệm & góc nhìn của Reader", price: "300.000" },
      { name: "Tín hiệu vũ trụ 30'", detail: "Lời khuyên tình cảm / cuộc sống trong 30 phút", price: "300.000" },
      { name: "Lenormand vận mệnh", detail: "Dự đoán vận mệnh, tiên đoán tương lai & nhìn lại quá khứ — chuỗi 3–5 lá / 1 câu hỏi", price: "250.000" },
      { name: "Grand Tableau 36 lá", detail: "Kể trọn câu chuyện quá khứ–hiện tại–tương lai xa, 1–2 tiếng", price: "500.000" },
      { name: "Lenormand tổng quan", detail: "Trải tổng quan 1 đối tượng / vụ việc cụ thể: 300.000 – 400.000 VNĐ", price: "300.000 – 400.000" },
      { name: "Oracle kết hợp", detail: "Kết hợp Tarot + Trà, vừa đặt câu hỏi vừa có mốc thời gian", price: "100.000 /câu hỏi" },
      { name: "Bài The Lover", detail: "Dự báo tình yêu 1–3 tháng tới, tín hiệu & chỉ dẫn tình cảm", price: "200.000" },
      { name: "Bài The Heart 3 lá", detail: "Lời khuyên & chỉ dẫn tình cảm trong 30 phút", price: "300.000" },
    ],
  },
  {
    id: "combo",
    icon: "💫",
    name: "Combo",
    desc: "Đi sâu một lần bằng nhiều loại bài — tiết kiệm hơn mà thấu hơn.",
    items: [
      { name: "Combo Tarot + Tea Leaf 6 tháng", detail: "Trải bài vip, không giới hạn thời gian", price: "700.000" },
      { name: "Combo VIP Full Tarot + Trà 12 tháng", detail: "Tặng bài Haletu hoặc Oracle", price: "1.000.000" },
      { name: "Combo Tarot + Lenormand", detail: "Được yêu thích nhất — cho tất cả mọi khúc mắc", price: "800.000" },
      { name: "Combo 1 chuyện all bài", detail: "Haletu, Oracle, Tarot, Tea Leaf, Lenormand… cho duy nhất 1 chuyện", price: "650.000" },
      { name: "Combo Pro trị liệu", detail: "Full Tarot + full Trà + Haletu + Oracle + Lenormand + tư vấn tình cảm & trị liệu tâm lý (~3 tiếng, thêm giờ +450k)", price: "1.500.000" },
      { name: "Combo HOT toàn diện", detail: "Full toàn bộ + theo dõi chữa lành tâm hồn: xem không giới hạn thời gian, bảo hành xem lại & tư vấn miễn phí trong 1 tháng", price: "3.000.000" },
      { name: "Dịch vụ tâm linh đặc biệt", detail: "Người thứ 3, spell, pháp luật… — giá inbox tùy từng vấn đề", price: "LIÊN HỆ", link: "contact" },
    ],
  },
  {
    id: "dich-vu-khac",
    icon: "🔮",
    name: "Dịch vụ khác",
    desc: "Thần số học, bản đồ sao, tử vi — những mảnh ghép giúp bạn hiểu mình hơn.",
    items: [
      { name: "Thần số học", detail: "Tặng bản thần số học (PDF 125 trang)", price: "800.000" },
      { name: "Bản đồ sao vận hạn", price: "800.000" },
      { name: "Bản đồ sao cá nhân", price: "1.000.000" },
      { name: "Bản đồ sao đôi", price: "1.500.000" },
      { name: "Lá số chiêm tinh", price: "800.000" },
      { name: "Tử vi cá nhân", price: "800.000" },
      { name: "Tử vi xem đôi", price: "1.500.000" },
      { name: "Đá phong thủy", detail: "Đá, trang sức stone…", price: "LIÊN HỆ", link: "contact" },
      { name: "Dạy xem Tarot", detail: "Khóa cơ bản 5tr · Khóa nâng cao 10tr", price: "Xem khóa học", link: "courses" },
    ],
  },
];

/**
 * "Chọn theo nỗi lòng" ở /services — 4 lối vào không cần gõ gì.
 *
 * Dữ liệu cố ý để đúng hình dạng mà phần AI sau này sẽ trả về:
 * `{ reason, picks: [tên service] }` → cùng một UI render gợi ý, chỉ đổi
 * nguồn dữ liệu (xem ghi chú trong components/MoodPicker.tsx).
 */
export type Mood = {
  id: string;
  icon: string;
  question: string;
  hint: string;
  /** Tên trải bài gợi ý — khớp tên trong CATEGORIES/DB */
  picks: string[];
};

/**
 * Mỗi trải bài chỉ nằm ở **một** thẻ (không lặp giữa các thẻ) — khách mở lần
 * lượt mà thấy lại đúng danh sách cũ sẽ tưởng bị lặp, mất tin.
 */
export const MOODS: Mood[] = [
  {
    id: "tinh-cam",
    icon: "heart-crack",
    question: "Người ấy có còn thương mình?",
    hint: "Crush mập mờ · người yêu xa cách · người cũ chưa quên",
    picks: ["Bài The Lover", "Bài The Heart 3 lá", "Haletu xin lời khuyên 30'"],
  },
  {
    id: "cong-viec",
    icon: "briefcase",
    question: "Công việc · tiền bạc đang bế tắc?",
    hint: "Nhảy việc hay ở lại · thi cử · kinh doanh · tiền tài",
    picks: ["Tarot chuyên sâu 1 chuyện", "Combo 1 chuyện all bài", "Xem Online 1 tiếng"],
  },
  {
    id: "tuong-lai",
    icon: "moon",
    question: "Sắp tới có gì thay đổi?",
    hint: "Vài tuần tới cả năm — mốc thời gian rõ ràng",
    picks: ["Tea Leaf 3 tháng full", "Lenormand vận mệnh", "Tín hiệu vũ trụ 30'"],
  },
  {
    id: "chinh-minh",
    icon: "sparkles",
    question: "Muốn hiểu chính mình hơn",
    hint: "Không biết mình muốn gì · mệt mà chẳng rõ vì sao",
    picks: ["Tarot cơ bản 1 câu hỏi", "Thần số học", "Bản đồ sao cá nhân"],
  },
];

/** Lấy mục trong bảng giá theo tên (để hiện giá/chi tiết ở thẻ gợi ý). */
export function findItem(name: string): CatalogItem | undefined {
  for (const c of CATEGORIES) {
    const hit = c.items.find((i) => i.name === name);
    if (hit) return hit;
  }
  return undefined;
}

export function itemHref(item: CatalogItem): string {
  if (item.link === "contact") return "/contact";
  if (item.link === "courses") return "/recruit";
  return `/booking?service=${encodeURIComponent(item.name)}`;
}

export function itemCta(item: CatalogItem): string {
  if (item.link === "contact") return "Liên hệ để được tư vấn";
  if (item.link === "courses") return "Xem các khóa học";
  return "Đặt lịch dịch vụ này";
}

/** Bỏ dấu để tìm "tinh duyen" ra "tình duyên". */
export function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}
