"use client";
import React, { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Environment, useTexture, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Ensure THREE is properly configured
if (typeof THREE.ColorManagement !== 'undefined') {
  THREE.ColorManagement.enabled = true;
}

// Card data type
interface TarotCard {
  id: string;
  name: string;
  nameVi: string;
  img: string;
  arcana: string;
  suit: string | null;
  meaning: string;
}

// Custom shader material for galaxy particles
const GalaxyParticleMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#d4a843') },
    uSize: { value: 0.05 },
    uTexture: { value: null },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uSize;
    attribute float aScale;
    attribute float aOffset;
    attribute vec3 aColor;
    
    varying vec3 vColor;
    
    void main() {
      vColor = aColor;
      
      // Spiral galaxy motion
      float angle = aOffset + uTime * 0.2;
      float radius = aScale * 2.0;
      
      vec3 pos = position;
      pos.x = cos(angle) * radius;
      pos.z = sin(angle) * radius;
      pos.y = sin(uTime * 0.3 + aOffset) * 0.1;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = uSize * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying vec3 vColor;
    
    void main() {
      // Circular point
      float dist = length(gl_PointCoord.xy - vec2(0.5));
      if (dist > 0.5) discard;
      
      // Glow effect
      float alpha = smoothstep(0.5, 0.2, dist);
      
      gl_FragColor = vec4(vColor, alpha * 0.8);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

// Galaxy Stars Component using Points
function GalaxyStars({ count = 5000 }) {
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const offsets = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    const armColors = [
      new THREE.Color('#b8849f'),
      new THREE.Color('#d4a843'),
      new THREE.Color('#dbb5cc'),
      new THREE.Color('#3a2045'),
    ];
    
    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * 4);
      const armColor = armColors[armIndex];
      
      // Spiral galaxy parameters (Logarithmic spiral)
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.5) * 8; // Square root for denser center
      const armAngle = armIndex * (Math.PI / 2);
      
      const x = Math.cos(angle + armAngle) * radius;
      const y = (Math.random() - 0.5) * 0.5;
      const z = Math.sin(angle + armAngle) * radius;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      scales[i] = 0.1 + Math.random() * 0.3;
      offsets[i] = Math.random() * Math.PI * 2;
      
      colors[i * 3] = armColor.r;
      colors[i * 3 + 1] = armColor.g;
      colors[i * 3 + 2] = armColor.b;
    }
    
    return { positions, scales, offsets, colors };
  }, [count]);

  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(GalaxyParticleMaterial);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
    
    if (particlesRef.current) {
      // Slow rotation of entire galaxy
      particlesRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={particlesPosition.positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          array={particlesPosition.scales}
          count={count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-offset"
          array={particlesPosition.offsets}
          count={count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          array={particlesPosition.colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <primitive object={materialRef.current} attach="material" />
    </points>
  );
}

// Tarot Card Mesh with instancing for performance
function TarotCardInstance({
  card,
  position,
  rotation,
  scale,
  index,
  hovered,
  setHovered,
  flipped,
  onFlip,
  mouseX,
  mouseY
}: {
  card: TarotCard;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  index: number;
  hovered: number | null;
  setHovered: (index: number | null) => void;
  flipped: boolean;
  onFlip: (index: number) => void;
  mouseX: number;
  mouseY: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(flipped ? card.img : "/images/cards/m00.webp");

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Apply mouse-based parallax
      const parallaxX = mouseX * 0.01;
      const parallaxY = mouseY * 0.01;
      
      meshRef.current.position.set(
        position[0] + parallaxX,
        position[1] + parallaxY + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.02,
        position[2]
      );
      
      meshRef.current.rotation.set(
        rotation[0],
        rotation[1] + state.clock.elapsedTime * 0.02,
        rotation[2]
      );
      
      // Hover scale
      meshRef.current.scale.set(
        scale * (hovered === index ? 1.2 : 1),
        scale * (hovered === index ? 1.2 : 1),
        scale
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(index)}
      onPointerOut={() => setHovered(null)}
      onClick={(e) => {
        e.stopPropagation();
        onFlip(index);
      }}
    >
      <planeGeometry args={[0.6, 1, 16, 16]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.3}
        metalness={0.1}
        emissive={hovered === index ? '#d4a843' : '#000'}
        emissiveIntensity={hovered === index ? 0.3 : 0}
      />
    </mesh>
  );
}

// Scroll and mouse interaction rig
function GalaxyRig({
  children,
  scrollY,
  scrollVelocity,
  mouseX,
  mouseY
}: {
  children: React.ReactNode;
  scrollY: number;
  scrollVelocity: number;
  mouseX: number;
  mouseY: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotate galaxy based on scroll velocity
      groupRef.current.rotation.y += delta * (scrollVelocity * 0.002 + 0.05);
      
      // Mouse-based camera movement (orbit)
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX * 0.1, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseY * 0.05, 0.05);
      camera.lookAt(0, 0, 0);
      
      // Scroll-based zoom
      const zoomFactor = 8 - scrollY * 0.01;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, zoomFactor, 0.1);
      camera.updateProjectionMatrix();
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// Tooltip component
function CardTooltip({ card, position }: { card: TarotCard; position: { x: number; y: number } }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
        background: 'rgba(26, 16, 40, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(212, 168, 67, 0.3)',
        borderRadius: '12px',
        padding: '12px 16px',
        minWidth: '200px',
        fontFamily: '"Playfair Display", serif',
        fontSize: '14px',
        color: '#d4a843',
        zIndex: 100,
        pointerEvents: 'none',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{card.name}</div>
      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '12px', color: '#dbb5cc' }}>
        {card.meaning}
      </div>
      <div style={{ fontSize: '10px', color: '#b8849f', marginTop: '4px' }}>
        {card.arcana} Arcana {card.suit && `• ${card.suit}`}
      </div>
    </div>
  );
}

// Main Galaxy Tarot System Component
interface GalaxyTarotSystemProps {
  count?: number;
  cardData?: TarotCard[];
  starCount?: number;
}

export default function GalaxyTarotSystem({
  count = 6,
  cardData,
  starCount = 5000
}: GalaxyTarotSystemProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);
  const [tooltip, setTooltip] = useState<{ card: TarotCard; x: number; y: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lastScrollY, setLastScrollY] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  // Track scroll and mouse
  useEffect(() => {
    let lastY = 0;
    let lastT = Date.now();
    
    const handleScroll = () => {
      const now = Date.now();
      const currentY = window.scrollY;
      
      const deltaY = currentY - lastY;
      const deltaT = now - lastT;
      const velocity = deltaT > 0 ? deltaY / deltaT : 0;
      
      setScrollY(currentY);
      setScrollVelocity(velocity);
      setLastScrollY(currentY);
      setLastTime(now);
      
      lastY = currentY;
      lastT = now;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to [-1, 1] range
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    handleScroll();
    handleMouseMove({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 } as MouseEvent);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Initialize cards
  useEffect(() => {
    if (cardData && cardData.length > 0) {
      setCards(cardData.slice(0, count));
      setFlippedCards(cardData.slice(0, count).map(() => Math.random() > 0.5));
    } else {
      fetch("/data/tarot-cards.json")
        .then((r) => r.json())
        .then((data: TarotCard[]) => {
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          const selected = shuffled.slice(0, count);
          setCards(selected);
          setFlippedCards(selected.map(() => Math.random() > 0.5));
        })
        .catch(() => {
          const fallback: TarotCard[] = [];
          for (let i = 0; i < 22; i++) {
            const id = `m${i.toString().padStart(2, "0")}`;
            fallback.push({
              id,
              name: `Major ${i}`,
              nameVi: `Major ${i}`,
              img: `/images/cards/${id}.webp`,
              arcana: "Major",
              suit: null,
              meaning: "",
            });
          }
          setCards(fallback.slice(0, count));
          setFlippedCards(fallback.slice(0, count).map(() => Math.random() > 0.5));
        });
    }
  }, [count, cardData]);

  // Handle card flip
  const handleFlip = useCallback((index: number) => {
    setFlippedCards(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  }, []);

  // Show tooltip
  useEffect(() => {
    if (hovered !== null && cards[hovered]) {
      setTooltip({ card: cards[hovered], x: mousePos.x * window.innerWidth / 2 + window.innerWidth / 2, y: -mousePos.y * window.innerHeight / 2 + window.innerHeight / 2 });
    } else {
      setTooltip(null);
    }
  }, [hovered, mousePos, cards]);

  if (cards.length === 0) return null;

  return (
    <>
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.3} />
        
        {/* Directional lights for cards */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
        />
        <directionalLight
          position={[-10, -10, -5]}
          intensity={0.5}
        />
        
        {/* Point light at center */}
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#d4a843" />
        
        {/* Galaxy stars background */}
        <GalaxyStars count={starCount} />
        
        {/* Galaxy rig with cards */}
        <GalaxyRig
          scrollY={scrollY}
          scrollVelocity={scrollVelocity}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
        >
          {cards.map((card, i) => {
            // Position cards in spiral pattern
            const angle = (i / count) * Math.PI * 2;
            const radius = 2.5 + Math.sin(i * 0.5) * 0.5;
            const yOffset = (i % 2 === 0 ? 0.2 : -0.2) * (1 - i * 0.05);
            
            return (
              <TarotCardInstance
                key={card.id}
                card={card}
                position={[Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius]}
                rotation={[0.1, -angle + Math.PI / 2, 0]}
                scale={0.8 + i * 0.05}
                index={i}
                hovered={hovered}
                setHovered={setHovered}
                flipped={flippedCards[i]}
                onFlip={handleFlip}
                mouseX={mousePos.x}
                mouseY={mousePos.y}
              />
            );
          })}
        </GalaxyRig>
      </Canvas>
      
      {/* Tooltip overlay */}
      {tooltip && (
        <CardTooltip card={tooltip.card} position={{ x: tooltip.x, y: tooltip.y }} />
      )}
    </>
  );
}
