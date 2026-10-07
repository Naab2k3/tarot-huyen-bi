"use client";
import React, { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
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

// Galaxy Stars Component - scattered stars background
function GalaxyStars({ count = 3000 }) {
  const starsRef = useRef<THREE.Points>(null);
  
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    
    const armColors = [
      new THREE.Color('#b8849f'),
      new THREE.Color('#d4a843'),
      new THREE.Color('#dbb5cc'),
      new THREE.Color('#3a2045'),
    ];
    
    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * 4);
      const armColor = armColors[armIndex];
      
      // Scatter stars in a wide area (horizontal galaxy)
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 15;
      
      positions.push(x, y, z);
      colors.push(armColor.r, armColor.g, armColor.b);
      sizes.push(0.05 + Math.random() * 0.1);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    return geometry;
  }, [count]);

  useFrame((state, delta) => {
    if (starsRef.current) {
      // Stars rotate slowly from left to right (clockwise when viewed from above)
      starsRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Tarot Card Mesh - floating above galaxy image
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
  globalRotation
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
  globalRotation: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(flipped ? card.img : "/images/cards/m00.webp");

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Apply global rotation (left to right, like a clock)
      const totalRotation = globalRotation + index * 0.1;
      
      // Floating animation
      const floatOffset = Math.sin(state.clock.elapsedTime * 0.5 + index * 0.3) * 0.03;
      
      meshRef.current.position.set(
        position[0] + floatOffset * 0.5,
        position[1] + floatOffset,
        position[2]
      );
      
      meshRef.current.rotation.set(
        rotation[0],
        totalRotation,
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
  starCount = 3000
}: GalaxyTarotSystemProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);
  const [tooltip, setTooltip] = useState<{ card: TarotCard; x: number; y: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [globalRotation, setGlobalRotation] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  // Track scroll and calculate rotation
  useEffect(() => {
    let lastY = 0;
    let lastT = Date.now();
    let accumulatedRotation = 0;
    
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
      
      // Accumulate rotation based on scroll velocity
      // Scroll down = rotate clockwise (left to right)
      if (Math.abs(deltaY) > 0) {
        accumulatedRotation += deltaY * 0.002;
        setGlobalRotation(accumulatedRotation);
      }
      
      lastY = currentY;
      lastT = now;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
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
      setTooltip({ 
        card: cards[hovered], 
        x: mousePos.x, 
        y: mousePos.y 
      });
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
        <ambientLight intensity={0.4} />
        
        {/* Directional lights */}
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
        
        {/* Galaxy stars background - scattered in 3D space */}
        <GalaxyStars count={starCount} />
        
        {/* Cards positioned above the galaxy, rotating left to right */}
        <group rotation={[0, globalRotation, 0]}>
          {cards.map((card, i) => {
            // Position cards in a horizontal circle above the galaxy
            const angle = (i / count) * Math.PI * 2;
            const radius = 3.5;
            const yOffset = 0.5; // Cards float above the galaxy plane
            
            return (
              <TarotCardInstance
                key={card.id}
                card={card}
                position={[
                  Math.cos(angle) * radius,
                  yOffset + (i % 2 === 0 ? 0.2 : -0.2),
                  Math.sin(angle) * radius
                ]}
                rotation={[0.1, 0, 0]}
                scale={0.8 + i * 0.05}
                index={i}
                hovered={hovered}
                setHovered={setHovered}
                flipped={flippedCards[i]}
                onFlip={handleFlip}
                globalRotation={globalRotation}
              />
            );
          })}
        </group>
      </Canvas>
      
      {/* Tooltip overlay */}
      {tooltip && (
        <CardTooltip card={tooltip.card} position={{ x: tooltip.x, y: tooltip.y }} />
      )}
    </>
  );
}
