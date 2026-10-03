import { useEffect, useRef } from "react";
import anime from "animejs";
import type { Service } from "../api/types";

interface Props {
  service: Service;
  selected: boolean;
  onSelect: () => void;
}

export default function ServiceCard({ service, selected, onSelect }: Props) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected && cardRef.current) {
      anime({
        targets: cardRef.current,
        scaleX: [0.95, 1],
        scaleY: [0.95, 1],
        opacity: [0.6, 1],
        duration: 400,
        easing: "easeOutBack",
      });
    }
  }, [selected]);

  return (
    <button
      ref={cardRef}
      onClick={onSelect}
      className={`
        relative text-left p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
        bg-gradient-to-br from-velvet/70 via-velvet/50 to-arcane/10
        ${selected
          ? "border-candle-gold bg-arcane/15 shadow-xl shadow-candle-gold/20 -translate-y-1"
          : "border-arcane/30 hover:border-candle-gold/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-candle-gold/15"
        }
        focus-visible:outline-2 focus-visible:outline-candle-gold focus-visible:outline-offset-2
      `}
      aria-pressed={selected}
    >
      {/* Subtle glow overlay on hover */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none
          bg-[radial-gradient(ellipse_at_center,_rgba(203,161,53,0.06),transparent_70%)]
          group-hover:opacity-100"
      />

      <h3 className="font-display text-xl tracking-wider uppercase text-mist mb-2 relative">
        {service.name}
      </h3>
      <p className="font-body text-lilac/85 text-base leading-relaxed mb-4 relative whitespace-pre-line">
        {service.description}
      </p>
      <div className="flex justify-between items-center relative">
        <span className="font-body text-mist/90 font-medium tracking-wide bg-velvet/60 border border-velvet px-3 py-1 rounded-full text-sm">
          ⏱ {service.duration_minutes} phút
        </span>
        <span className="font-display text-candle-gold font-semibold text-xl">
          {service.price.toLocaleString("vi-VN")}₫
        </span>
      </div>
    </button>
  );
}
