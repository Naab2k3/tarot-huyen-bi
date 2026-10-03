import { Link, useLocation } from "react-router-dom";

const HIDDEN_PREFIXES = ["/booking", "/phone", "/admin"];

/**
 * Sticky bottom booking bar, mobile only. Always visible instead of
 * scroll-triggered: a booking site wants the conversion action one thumb
 * tap away, and it removes the scroll listener entirely. Hidden where it
 * would be redundant (booking flow itself) or wrong (admin).
 */
export default function FloatingCTA() {
  const loc = useLocation();

  if (HIDDEN_PREFIXES.some((p) => loc.pathname.startsWith(p))) return null;

  return (
    <>
      {/* Spacer so page bottom content is never covered by the fixed bar */}
      <div aria-hidden="true" className="h-[68px] md:hidden" />
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-void/90 backdrop-blur-md border-t border-velvet/40 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3 max-w-2xl mx-auto">
          <img
            src="/logo/logo-128.webp"
            width={128}
            height={150}
            decoding="async"
            alt="Healing With My"
            className="h-10 w-auto drop-shadow-[0_0_4px_rgba(212,168,67,0.3)]"
          />
          <Link
            to="/booking"
            className="flex-1 max-w-[240px] text-center px-6 min-h-[44px] flex items-center justify-center rounded-xl font-display text-sm tracking-widest uppercase bg-arcane text-mist active:scale-[0.98] transition-all shadow-lg shadow-arcane/25"
          >
            Đặt lịch
          </Link>
        </div>
      </div>
    </>
  );
}
