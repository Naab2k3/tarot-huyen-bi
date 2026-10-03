import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  className?: string;
  /** ms — stagger, matches the previous `transition.delay` */
  delay?: number;
  /** 0..1 — fraction of the section that must be visible before revealing */
  amount?: number;
  children: ReactNode;
};

/**
 * Fade-up-on-scroll reveal. Replaces `motion.section` whileInView wrappers —
 * same behaviour, ~41 kB gzip less on the critical path.
 */
export default function Reveal({
  className,
  delay = 0,
  amount = 0.3,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: amount }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount, shown]);

  return (
    <section
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(30px)",
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </section>
  );
}