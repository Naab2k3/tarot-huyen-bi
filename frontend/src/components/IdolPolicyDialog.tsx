import { useEffect, useCallback } from "react";

/**
 * Transcribed from public/idols/healingidol.webp so the policy text is
 * actually readable (and searchable) instead of baked into poster pixels.
 */
const TIERS = [
  { kc: "≥250.000 KC", pay: "10.000.000" },
  { kc: "≥500.000 KC", pay: "15.000.000" },
  { kc: "≥750.000 KC", pay: "20.000.000" },
  { kc: "≥1.000.000 KC", pay: "30.000.000" },
];

const NOTES = [
  "Yêu cầu có ngoại hình, đậu casting tài năng (30'), tự tin trước ống kính, chăm chỉ và đam mê với công việc.",
  "Lương cứng không áp KPI doanh thu, chỉ yêu cầu đủ thời gian làm việc 120h/22 ngày và không vi phạm nghiêm trọng nền tảng.",
  "Nếu trong 2 tháng không đạt KPI 100k KC, Công ty sẽ ngưng chi trả lương cứng và thu nhập của các bạn sẽ là 100% Donate + thưởng mốc như hiện tại.",
  "Công ty đưa nick hoặc kiểm soát nick của Idol và chia cho Idol 10% thu nhập từ hoa hồng/quà tặng.",
];

interface Props {
  onClose: () => void;
}

export default function IdolPolicyDialog({ onClose }: Props) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết chế độ lương cứng"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-void border border-arcane/40 rounded-2xl p-6 md:p-8 shadow-2xl shadow-arcane/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-3 right-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-mist/60 hover:text-mist transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="font-body text-candle-gold text-xs md:text-sm tracking-widest uppercase text-center mb-2">
          Áp dụng từ tháng 6/2026
        </p>
        <h3 className="font-display text-2xl md:text-3xl text-mist text-center mb-3">
          Chế độ lương cứng
        </h3>
        <p className="font-body text-lilac/80 text-sm md:text-base italic text-center max-w-lg mx-auto mb-8">
          Dành cho Idol mới muốn thử sức, không ép doanh thu, hợp đồng 1 năm —
          vừa được đào tạo FREE, vừa có lương cứng.
        </p>

        {/* Probation vs post-probation */}
        <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-8">
          <div className="rounded-xl border border-candle-gold/40 bg-candle-gold/10 p-5 text-center">
            <p className="font-body text-candle-gold text-xs tracking-widest uppercase mb-1">
              Tháng thử việc
            </p>
            <p className="font-body text-lilac/70 text-xs mb-3">dưới 150k KC</p>
            <p className="font-body text-lilac/70 text-xs tracking-widest uppercase">Lương cứng</p>
            <p className="font-display text-3xl text-mist">
              6.000.000<span className="text-base text-candle-gold">₫</span>
            </p>
          </div>
          <div className="rounded-xl border border-candle-gold/40 bg-candle-gold/10 p-5 text-center">
            <p className="font-body text-candle-gold text-xs tracking-widest uppercase mb-1">
              Sau thử việc
            </p>
            <p className="font-body text-lilac/70 text-xs mb-3">trên 150k KC</p>
            <p className="font-body text-lilac/70 text-xs tracking-widest uppercase">Lương cứng cơ bản</p>
            <p className="font-display text-3xl text-mist">
              8.000.000<span className="text-base text-candle-gold">₫</span>
            </p>
          </div>
        </div>

        {/* Performance tiers */}
        <h4 className="font-display text-base md:text-lg tracking-wider uppercase text-mist text-center mb-4">
          Điều chỉnh lương theo hiệu suất
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3 mb-8">
          {TIERS.map((t) => (
            <div
              key={t.kc}
              className="rounded-xl border border-velvet bg-velvet/40 px-3 py-4 text-center"
            >
              <p className="font-body text-candle-gold text-sm font-semibold mb-1">{t.kc}</p>
              <p className="font-display text-lg md:text-xl text-mist">{t.pay}₫</p>
            </div>
          ))}
        </div>

        {/* Notes */}
        <h4 className="font-display text-base md:text-lg tracking-wider uppercase text-mist mb-3">
          Lưu ý
        </h4>
        <ul className="space-y-2.5">
          {NOTES.map((n, i) => (
            <li key={i} className="flex items-start gap-3 font-body text-lilac/80 text-sm leading-relaxed">
              <span className="text-candle-gold mt-0.5 shrink-0">✦</span>
              {n}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
