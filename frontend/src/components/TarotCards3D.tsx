"use client";
import React, { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import anime from "animejs";

// Ensure THREE is properly configured for r160+
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

// Card component with 3D mesh and interactions
function TarotCardMesh({ 
  card, 
  radius,
  angle,
  yOffset,
  index,
  hovered,
  setHovered,
  scrollY,
  onFlip,
  flipped
}: {
  card: TarotCard;
  radius: number;
  angle: number;
  yOffset: number;
  index: number;
  hovered: number | null;
  setHovered: (index: number | null) => void;
  scrollY: number;
  onFlip: (index: number) => void;
  flipped: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(flipped ? card.img : "/images/cards/card-back.webp");

  // Calculate position - cards orbit around center point
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Circular position around center (0,0,0)
      const x = Math.cos(angle + scrollY * 0.001) * radius;
      const z = Math.sin(angle + scrollY * 0.001) * radius;
      
      // Add subtle floating animation
      const floatOffset = Math.sin(state.clock.elapsedTime * 0.5 + index * 0.3) * 0.03;
      
      meshRef.current.position.set(x, yOffset + floatOffset, z);
      
      // Cards always face the center
      meshRef.current.lookAt(0, yOffset, 0);
      
      // Hover scale effect
      meshRef.current.scale.set(
        hovered === index ? 1.15 : 1,
        hovered === index ? 1.15 : 1,
        1
      );
    }
  });

  // Handle click to flip card
  const handleClick = (e: any) => {
    e.stopPropagation();
    onFlip(index);
  };

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(index)}
      onPointerOut={() => setHovered(null)}
      onClick={handleClick}
    >
      <planeGeometry args={[0.6, 1, 16, 16]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

// Scroll-based rig
function ScrollRig({ children, scrollY }: { children: React.ReactNode; scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle rotation based on scroll
      groupRef.current.rotation.y = scrollY * 0.0005;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// Animated orbiting rings
function OrbitingRings() {
  const ringRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state, delta) => {
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        // Rotate opposite to cards
        ring.rotation.y -= delta * (0.02 + i * 0.01);
        ring.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.02);
      }
    });
  });

  const rings = useMemo(() => {
    const colors = ['#b8849f80', '#d4a84380', '#dbb5cc80', '#3a204580'];
    return colors.map((color, i) => ({
      radius: 3.5 + i * 1.2,
      color: color,
      width: 0.02 + i * 0.01,
    }));
  }, []);

  return (
    <>
      {rings.map((ring, i) => (
        <mesh
          key={i}
          ref={(el) => (ringRefs.current[i] = el!)}
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[ring.radius - ring.width, ring.radius, 64]} />
          <meshBasicMaterial
            color={ring.color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </>
  );
}

// Tooltip component for card info
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

// Main 3D Tarot Cards Component
interface TarotCards3DProps {
  count?: number;
  cardData?: TarotCard[];
}

export default function TarotCards3D({ count = 6, cardData }: TarotCards3DProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);
  const [tooltip, setTooltip] = useState<{ card: TarotCard; x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize flipped cards state
  useEffect(() => {
    if (cards.length > 0) {
      setFlippedCards(cards.map(() => Math.random() > 0.5));
    }
  }, [cards.length]);

  // Load card data
  useEffect(() => {
    if (cardData && cardData.length > 0) {
      setCards(cardData.slice(0, count));
    } else {
      fetch("/data/tarot-cards.json")
        .then((r) => r.json())
        .then((data: TarotCard[]) => {
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setCards(shuffled.slice(0, count));
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

  // Handle double click to swap card
  const handleDoubleClick = useCallback((index: number) => {
    if (cardData && cardData.length > count) {
      // Swap with a random card from the deck
      const availableCards = cardData.filter(c => 
        !cards.some(cc => cc.id === c.id)
      );
      if (availableCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        setCards(prev => {
          const newCards = [...prev];
          newCards[index] = availableCards[randomIndex];
          return newCards;
        });
      }
    }
  }, [cards, cardData, count]);

  // Track mouse position for tooltip
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Show tooltip when hovering over card
  useEffect(() => {
    if (hovered !== null && cards[hovered]) {
      setTooltip({ card: cards[hovered], x: mousePos.x, y: mousePos.y });
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
        }}
        ref={canvasRef}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
        />
        <directionalLight
          position={[-10, -10, -5]}
          intensity={0.5}
        />
        <pointLight position={[0, 0, 0]} intensity={0.3} color="#d4a843" />

        {/* Orbiting rings in background */}
        <OrbitingRings />

        {/* Scroll rig with cards orbiting around center */}
        <ScrollRig scrollY={scrollY}>
          {cards.map((card, i) => {
            const angle = (i / count) * Math.PI * 2;
            const radius = 3.5 + Math.sin(i * 0.5) * 0.3;
            const yOffset = (i % 2 === 0 ? 0.3 : -0.3) * (1 - i * 0.05);
            
            return (
              <TarotCardMesh
                key={card.id}
                card={card}
                radius={radius}
                angle={angle}
                yOffset={yOffset}
                index={i}
                hovered={hovered}
                setHovered={setHovered}
                scrollY={scrollY}
                onFlip={handleFlip}
                flipped={flippedCards[i]}
              />
            );
          })}
        </ScrollRig>

        {/* Environment */}
        <Environment preset="city" />
      </Canvas>
      
      {/* Tooltip overlay */}
      {tooltip && (
        <CardTooltip card={tooltip.card} position={{ x: tooltip.x, y: tooltip.y }} />
      )}
    </>
  );
}

// Export for use in pages
