"use client";
import React, { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";

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
  angle,
  distance,
  index,
  hovered,
  setHovered,
  flipped
}: {
  card: TarotCard;
  angle: number;
  distance: number;
  index: number;
  hovered: number | null;
  setHovered: (index: number | null) => void;
  flipped: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(flipped ? card.img : "/images/cards/m00.webp");

  // Position card in fan layout
  useFrame((state, delta) => {
    if (meshRef.current) {
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      
      // Add subtle floating animation
      const floatOffset = Math.sin(state.clock.elapsedTime * 0.5 + index * 0.3) * 0.02;
      
      meshRef.current.position.set(x, floatOffset, z);
      
      // Cards face slightly upward for better visibility
      meshRef.current.rotation.set(0.1, -angle + Math.PI / 2, 0);
      
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
    // Single click: flip
    // For double click, we'll handle it in the parent
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

// Fan layout rig - cards spread like a fan from bottom-left
function FanRig({ children, fanAngle }: { children: React.ReactNode[]; fanAngle: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slight rotation based on mouse position for parallax
      groupRef.current.rotation.y = state.mouse.x * 0.1;
      groupRef.current.rotation.x = state.mouse.y * 0.05;
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
        ring.rotation.y -= delta * (0.02 + i * 0.01);
        ring.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.02);
      }
    });
  });

  const rings = useMemo(() => {
    const colors = ['#b8849f', '#d4a843', '#dbb5cc', '#3a2045'];
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
            color={ring.color.replace('80', '')}
            side={THREE.DoubleSide}
            transparent
            opacity={0.3}
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
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);
  const [tooltip, setTooltip] = useState<{ card: TarotCard; x: number; y: number } | null>(null);
  const [fanAngle, setFanAngle] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Track scroll to control fan angle
  useEffect(() => {
    const handleScroll = () => {
      // Calculate fan angle based on scroll position
      const scrollY = window.scrollY;
      // At top: fan closed (0), as we scroll down: fan opens (up to PI/2)
      const normalizedScroll = Math.min(scrollY / 500, 1);
      setFanAngle(normalizedScroll * Math.PI / 2);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize
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

  // Handle card interactions
  const handleCardClick = useCallback((index: number) => {
    const now = Date.now();
    
    // Double click detection (swap card)
    if (now - lastClickTime < 300) {
      if (cardData && cardData.length > count) {
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
    }
    setLastClickTime(now);
    
    // Single click: flip
    setFlippedCards(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  }, [lastClickTime, cards, cardData, count]);

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

        {/* Fan layout - cards spread from bottom-left like a fan */}
        <FanRig fanAngle={fanAngle}>
          {cards.map((card, i) => {
            // Fan spread: each card at a different angle
            const cardAngle = -Math.PI / 4 + (i / (count - 1)) * fanAngle;
            const distance = 2.5 + i * 0.3;
            
            return (
              <TarotCardMesh
                key={card.id}
                card={card}
                angle={cardAngle}
                distance={distance}
                index={i}
                hovered={hovered}
                setHovered={setHovered}
                flipped={flippedCards[i]}
              />
            );
          })}
        </FanRig>

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
