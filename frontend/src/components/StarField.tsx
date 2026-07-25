import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  baseAlpha: number;
}

interface Constellation {
  x1: number; y1: number;
  x2: number; y2: number;
  alpha: number;
  dx: number; dy: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationId: number;
    let stars: Star[] = [];
    let constellations: Constellation[] = [];
    let time = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // Init stars — fewer, with phase for math-based twinkle
    const starCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      baseAlpha: Math.random() * 0.5 + 0.3,
    }));

    // Constellations — pick from actual star positions
    constellations = Array.from({ length: 5 }, () => {
      const p1 = stars[Math.floor(Math.random() * stars.length)];
      const p2 = stars[Math.floor(Math.random() * stars.length)];
      return {
        x1: p1.x, y1: p1.y,
        x2: p2.x, y2: p2.y,
        alpha: Math.random() * 0.08 + 0.02,
        dx: (Math.random() - 0.5) * 0.1,
        dy: (Math.random() - 0.5) * 0.1,
      };
    });

    function draw() {
      time += 0.02;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Stars — math-based twinkle, no anime instances
      stars.forEach((s) => {
        const twinkle = prefersReduced
          ? s.baseAlpha
          : s.baseAlpha + Math.sin(time * s.speed + s.phase) * 0.2;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(241, 233, 251, ${Math.max(0.05, Math.min(1, twinkle))})`;
        ctx!.fill();
      });

      // Constellations
      if (!prefersReduced) {
        constellations = constellations.map((c) => ({
          ...c,
          x1: c.x1 + c.dx,
          y1: c.y1 + c.dy,
          x2: c.x2 + c.dx,
          y2: c.y2 + c.dy,
          alpha: Math.min(0.12, Math.max(0.01, c.alpha + (Math.random() - 0.5) * 0.005)),
        }));
      }

      constellations.forEach((c) => {
        ctx!.beginPath();
        ctx!.moveTo(c.x1, c.y1);
        ctx!.lineTo(c.x2, c.y2);
        ctx!.strokeStyle = `rgba(203, 161, 53, ${c.alpha})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      });

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
