"use client";
import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface TarotCard {
  id: string;
  name: string;
  nameVi: string;
  img: string;
  arcana: string;
  suit: string | null;
  meaning: string;
}

/* Shared mutable orbit state — refs only, never React state (no re-render storm) */
interface OrbitState {
  rotation: number;
  velocity: number; // scroll-added momentum, decays every frame
  mouseX: number;
  mouseY: number;
  baseSpeed: number;
}

/* ── Spiral galaxy starfield: 3 arms, gold core → violet edge ── */
function GalaxyStars({ count = 4500, orbit }: { count?: number; orbit: React.MutableRefObject<OrbitState> }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const inner = new THREE.Color("#e8c46a");
    const mid = new THREE.Color("#b8849f");
    const outer = new THREE.Color("#5b3a7a");
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const arm = i % 3;
      const r = Math.pow(Math.random(), 0.65) * 7; // denser core
      const spin = r * 0.55; // spiral twist
      const armAngle = (arm / 3) * Math.PI * 2;
      // gaussian-ish spread, flattened disk (y thin)
      const rx = (Math.random() + Math.random() + Math.random() - 1.5) * 0.45 * (0.3 + r * 0.22);
      const ry = (Math.random() + Math.random() + Math.random() - 1.5) * 0.22 * (0.3 + r * 0.12);
      const rz = (Math.random() + Math.random() + Math.random() - 1.5) * 0.45 * (0.3 + r * 0.22);
      const a = armAngle + spin;
      pos[i * 3] = Math.cos(a) * r + rx;
      pos[i * 3 + 1] = ry * 0.9;
      pos[i * 3 + 2] = Math.sin(a) * r + rz;
      const t = Math.min(1, r / 7);
      if (t < 0.45) tmp.copy(inner).lerp(mid, t / 0.45);
      else tmp.copy(mid).lerp(outer, (t - 0.45) / 0.55);
      // a few bright white-gold stars
      if (Math.random() > 0.965) tmp.lerp(new THREE.Color("#fff6dd"), 0.7);
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [count]);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    if (ref.current) ref.current.rotation.y += d * 0.03; // slow star drift
    if (matRef.current) matRef.current.opacity = 0.75 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1; // twinkle
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        ref={matRef}
        size={0.055}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Warm core glow sprite (canvas-generated radial texture, no asset needed) ── */
function CoreGlow() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(232,196,106,0.85)");
    g.addColorStop(0.35, "rgba(184,132,159,0.32)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    return t;
  }, []);
  return (
    <sprite scale={[7, 7, 1]}>
      <spriteMaterial map={tex} transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.55} />
    </sprite>
  );
}

/* ── One orbiting card: revolves around center (like ArtCraft debris), lies near-flat ── */
function OrbitCard({
  card,
  seed,
  orbit,
  hovered,
  setHovered,
  flipped,
  onFlip,
}: {
  card: TarotCard;
  seed: number;
  orbit: React.MutableRefObject<OrbitState>;
  hovered: string | null;
  setHovered: (id: string | null) => void;
  flipped: boolean;
  onFlip: () => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const rnd = useMemo(() => {
    let s = seed * 1000 + 7;
    const f = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    return { radius: 2.4 + f() * 3.1, angle: f() * Math.PI * 2, y: 0.35 + f() * 1.15, tilt: (f() - 0.5) * 0.5, scale: 0.62 + f() * 0.34, phase: f() * Math.PI * 2 };
  }, [seed]);

  const [frontTex, backTex] = useTexture([card.img, "/images/cards/m00.webp"]);
  const pop = useRef(1); // flip pop animation 1 → 0.6 → 1

  useFrame((state, rawDelta) => {
    const m = mesh.current;
    if (!m) return;
    const d = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    // Kepler-ish: inner orbits faster
    const speed = orbit.current.baseSpeed * (3.1 / rnd.radius) + orbit.current.velocity * (3.1 / rnd.radius);
    const a = rnd.angle + orbit.current.rotation * (3.1 / rnd.radius);
    const bob = Math.sin(t * 0.7 + rnd.phase) * 0.12;
    const isHover = hovered === card.id;
    const lift = isHover ? 0.55 : 0;
    m.position.set(Math.cos(a) * rnd.radius, rnd.y + bob + lift, Math.sin(a) * rnd.radius * 0.62);
    // lie near-flat like cards scattered on a galaxy plane, yaw tangent to orbit
    m.rotation.set(-Math.PI / 2 + 0.42 + rnd.tilt * 0.4, 0, -a - Math.PI / 2);
    const target = rnd.scale * (isHover ? 1.35 : 1) * pop.current;
    m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, target, 1 - Math.exp(-10 * d)));
    void speed;
  });

  useEffect(() => {
    // pop on flip
    pop.current = 0.55;
    const id = requestAnimationFrame(() => {
      pop.current = 1;
    });
    return () => cancelAnimationFrame(id);
  }, [flipped]);

  const isHover = hovered === card.id;
  return (
    <mesh
      ref={mesh}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(card.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(null);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onFlip();
      }}
    >
      <planeGeometry args={[0.72, 1.2]} />
      <meshStandardMaterial
        map={flipped ? frontTex : backTex}
        side={THREE.DoubleSide}
        roughness={0.35}
        metalness={0.15}
        emissive={isHover ? "#d4a843" : "#000000"}
        emissiveIntensity={isHover ? 0.35 : 0}
      />
    </mesh>
  );
}

/* ── Camera rig: mouse parallax + scroll dolly, all lerped ── */
function CameraRig({ orbit }: { orbit: React.MutableRefObject<OrbitState> }) {
  const { camera } = useThree();
  useFrame((_, rawDelta) => {
    const d = Math.min(rawDelta, 0.05);
    const k = 1 - Math.exp(-3 * d);
    const tx = orbit.current.mouseX * 1.1;
    const ty = 5.1 + orbit.current.mouseY * 0.5;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, k);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, k);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.4, k);
    camera.lookAt(0, 0.4, 0);
    // scroll momentum decay
    orbit.current.velocity *= Math.exp(-2.2 * d);
    orbit.current.rotation += (orbit.current.baseSpeed + orbit.current.velocity) * d;
  });
  return null;
}

export default function GalaxyTarotSystem({
  count = 14,
  cardData,
  starCount = 4500,
}: {
  count?: number;
  cardData?: TarotCard[];
  starCount?: number;
}) {
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  const orbit = useRef<OrbitState>({
    rotation: 0,
    velocity: 0,
    mouseX: 0,
    mouseY: 0,
    baseSpeed: 0.12, // slow ArtCraft-like drift, left → right
  });

  // mouse + scroll feed refs only (zero re-renders)
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) orbit.current.baseSpeed = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (!reduced) orbit.current.velocity = THREE.MathUtils.clamp(orbit.current.velocity + dy * 0.00012, -0.6, 0.6);
    };
    const onMouse = (e: MouseEvent) => {
      orbit.current.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      orbit.current.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  useEffect(() => {
    if (cardData?.length) {
      const picked = [...cardData].sort(() => Math.random() - 0.5).slice(0, count);
      setCards(picked);
      setFlipped(picked.map(() => Math.random() > 0.45));
    } else {
      fetch("/data/tarot-cards.json")
        .then((r) => r.json())
        .then((data: TarotCard[]) => {
          const picked = [...data].sort(() => Math.random() - 0.5).slice(0, count);
          setCards(picked);
          setFlipped(picked.map(() => Math.random() > 0.45));
        })
        .catch(() => setCards([]));
    }
  }, [count, cardData]);

  const hoveredCard = hovered ? cards.find((c) => c.id === hovered) ?? null : null;

  return (
    <>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 5.1, 7.4], fov: 55, near: 0.1, far: 100 }}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#0d0812", 9, 20]} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[6, 8, 4]} intensity={1.15} />
        <directionalLight position={[-6, 3, -4]} intensity={0.4} color="#b8849f" />
        <pointLight position={[0, 1.5, 0]} intensity={12} distance={12} color="#d4a843" />
        <CameraRig orbit={orbit} />
        <GalaxyStars count={starCount} orbit={orbit} />
        <CoreGlow />
        {cards.map((card, i) => (
          <OrbitCard
            key={card.id}
            card={card}
            seed={i + 1}
            orbit={orbit}
            hovered={hovered}
            setHovered={setHovered}
            flipped={flipped[i] ?? true}
            onFlip={() => setFlipped((p) => p.map((f, idx) => (idx === i ? !f : f)))}
          />
        ))}
      </Canvas>

      {/* vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 55%, rgba(13,8,18,0.55) 100%)",
        }}
      />
      {/* hovered card HUD pill — ArtCraft-style minimal label */}
      {hoveredCard && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 28,
            transform: "translateX(-50%)",
            zIndex: 2,
            pointerEvents: "none",
            background: "rgba(13,8,18,0.85)",
            border: "1px solid rgba(212,168,67,0.35)",
            borderRadius: 10,
            padding: "8px 18px",
            textAlign: "center",
            fontFamily: '"Playfair Display", serif',
            color: "#d4a843",
            fontSize: 14,
            whiteSpace: "nowrap",
          }}
        >
          {hoveredCard.nameVi || hoveredCard.name}
          <span style={{ display: "block", fontSize: 11, color: "#b8849f", fontFamily: '"Cormorant Garamond", serif' }}>
            {hoveredCard.meaning} · click để lật
          </span>
        </div>
      )}
    </>
  );
}
