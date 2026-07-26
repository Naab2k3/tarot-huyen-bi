import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-void/90 backdrop-blur-md border-t border-velvet/40 py-3 px-4 md:hidden">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <img
          src="/images/logo-sm.png"
          alt="Healing With My"
          className="h-8 w-auto drop-shadow-[0_0_4px_rgba(212,168,67,0.2)]"
        />
        <Link
          to="/booking"
          className="px-6 py-2 rounded-lg font-display text-sm tracking-widest uppercase bg-arcane text-mist hover:bg-arcane/80 transition-all"
        >
          ✨ Đặt lịch
        </Link>
      </div>
    </div>
  );
}
