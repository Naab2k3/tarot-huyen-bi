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
        relative text-left p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer
        bg-velvet/60 bg-[radial-gradient(ellipse_at_top_right,_rgba(110,47,217,0.04),transparent_50%)]
        ${selected
          ? "border-arcane bg-arcane/15 shadow-lg shadow-arcane/25"
          : "border-velvet hover:border-candle-gold/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-candle-gold/8"
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

      <h3 className="font-display text-lg tracking-wider uppercase text-mist mb-2 relative">
        {service.name}
      </h3>
      <p className="font-body text-lilac text-sm leading-relaxed mb-4 relative">
        {service.description}
      </p>
      <div className="flex justify-between items-center relative">
        <span className="font-body text-candle-gold font-semibold tracking-wide">
          {service.duration_minutes} phút
        </span>
        <span className="font-display text-arcane text-lg">
          {service.price.toLocaleString("vi-VN")}₫
        </span>
      </div>
    </button>
  );
}
