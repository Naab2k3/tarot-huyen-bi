import { useMemo, useState } from "react";
import type { Service } from "../api/types";

interface Props {
  services: Service[];
  selectedId: number | null;
  onSelect: (service: Service) => void;
}

/** Match without diacritics so "tinh duyen" finds "tình duyên". */
function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

/**
 * Compact searchable picker. BookingPage step 0 used to render every service
 * as a full card (name + whole description + price) — a 56-card wall on
 * mobile. This shows one row per service with the price visible, filters as
 * you type, and mirrors the row pattern ServicesPage already uses.
 */
export default function ServicePicker({ services, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return services;
    return services.filter((s) => fold(s.name).includes(q));
  }, [services, query]);

  return (
    <div>
      {/* Search — sticky below the fixed navbar */}
      <div className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-void/90 backdrop-blur-md">
        <div className="relative max-w-md mx-auto">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lilac/50 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm dịch vụ… (vd: tình duyên)"
            aria-label="Tìm dịch vụ"
            className="w-full bg-velvet/60 border border-velvet rounded-xl pl-11 pr-10 py-3 font-body text-mist placeholder-lilac/40 focus:outline-none focus:border-arcane transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Xóa tìm kiếm"
              className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-lilac/60 hover:text-mist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-center font-body text-lilac/50 text-sm mt-2" role="status">
          {filtered.length === services.length
            ? `${services.length} dịch vụ`
            : `${filtered.length} kết quả`}
        </p>
      </div>

      {/* Rows */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 max-w-md mx-auto">
          <p className="font-display text-lg text-mist mb-2">Không tìm thấy dịch vụ phù hợp</p>
          <p className="font-body text-lilac/70 text-sm">
            Thử từ khóa khác, hoặc nhắn trực tiếp để được tư vấn.
          </p>
        </div>
      ) : (
        <div className="grid gap-2.5 md:grid-cols-2 md:gap-3">
          {filtered.map((s) => {
            const isSelected = s.id === selectedId;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s)}
                aria-pressed={isSelected}
                className={`
                  flex items-center gap-3 text-left px-4 py-3 rounded-xl border transition-all
                  min-h-[60px]
                  ${isSelected
                    ? "border-candle-gold bg-arcane/15 shadow-lg shadow-candle-gold/15"
                    : "border-velvet/60 bg-velvet/40 hover:border-arcane/50 active:scale-[0.99]"
                  }
                  focus-visible:outline-2 focus-visible:outline-candle-gold focus-visible:outline-offset-2
                `}
              >
                <span className="flex-1 min-w-0">
                  <span className="block font-body font-medium text-mist truncate">
                    {s.name}
                  </span>
                  <span className="block font-body text-lilac/60 text-sm mt-0.5">
                    {s.duration_minutes} phút
                  </span>
                </span>
                <span className="font-display text-candle-gold font-semibold whitespace-nowrap">
                  {s.price.toLocaleString("vi-VN")}₫
                </span>
                <svg
                  className={`w-5 h-5 shrink-0 transition-colors ${isSelected ? "text-candle-gold" : "text-lilac/40"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
