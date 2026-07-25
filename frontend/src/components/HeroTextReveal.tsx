import { useEffect, useRef } from "react";
import anime from "animejs";

interface HeroTextRevealProps {
  children: string;
  className?: string;
  tag?: "h1" | "h2" | "p" | "span";
}

export default function HeroTextReveal({
  children,
  className = "",
  tag: Tag = "h1",
}: HeroTextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Wrap each word in a span
    const words = children.split(" ");
    el.innerHTML = words
      .map(
        (word, i) =>
          `<span class="inline-block" style="opacity:0;transform:translateY(1.2rem);" data-index="${i}">${word}&nbsp;</span>`
      )
      .join("");

    const spans = el.querySelectorAll("span[data-index]");

    anime({
      targets: spans,
      opacity: [0, 1],
      translateY: ["1.2rem", "0rem"],
      delay: anime.stagger(80, { from: "center", start: 200 }),
      duration: 800,
      easing: "easeOutCubic",
    });

    return () => {
      // Restore original text on cleanup
      el.textContent = children;
    };
  }, [children]);

  return (
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
