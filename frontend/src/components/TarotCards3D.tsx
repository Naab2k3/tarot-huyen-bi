"use client";
import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";

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

// Card component with 3D mesh
function TarotCardMesh({ 
  card, 
  position,
  rotation,
  index,
  hovered,
  setHovered 
}: {
  card: TarotCard;
  position: [number, number, number];
  rotation: [number, number, number];
  index: number;
  hovered: number | null;
  setHovered: (index: number | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(card.img);

  // Hover effect
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(
        hovered === index ? 1.1 : 1,
        hovered === index ? 1.1 : 1,
        1
      );
    }
  }, [hovered, index]);

  // Floating animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      const offset = index * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + offset) * 0.02;
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.3 + offset) * 0.05;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(index)}
      onPointerOut={() => setHovered(null)}
      onClick={() => window.open(`/?card=${card.id}`, '_blank')}
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

// Animated rings (vòng cung màu)
function AnimatedRings() {
  const ringRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state, delta) => {
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.y += delta * (0.05 + i * 0.02);
      }
    });
  });

  const rings = useMemo(() => {
    const colors = ['#b8849f', '#d4a843', '#dbb5cc', '#3a2045'];
    return colors.map((color, i) => ({
      radius: 2.5 + i * 1.5,
      color: color,
      width: 0.03 + i * 0.02,
      position: [0, 0, 0] as [number, number, number],
    }));
  }, []);

  return (
    <>
      {rings.map((ring, i) => (
        <mesh
          key={i}
          ref={(el) => (ringRefs.current[i] = el!)}
          position={ring.position}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[ring.radius, ring.radius + ring.width, 64]} />
          <meshBasicMaterial
            color={ring.color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.3 + i * 0.15}
          />
        </mesh>
      ))}
    </>
  );
}

// Scroll velocity rig
function ScrollRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const velocity = useRef(0);
  const { camera } = useThree();

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      velocity.current += e.deltaY * 0.0005;
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Apply damping
      velocity.current *= 0.92;
      
      // Rotate based on scroll velocity
      groupRef.current.rotation.y += delta * 0.1 + velocity.current;
      
      // Subtle zoom effect
      const zoomFactor = 1 + Math.abs(velocity.current) * 0.1;
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, zoomFactor, 0.1);
      camera.updateProjectionMatrix();
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// Main 3D Tarot Cards Component
interface TarotCards3DProps {
  count?: number;
  cardData?: TarotCard[];
}

export default function TarotCards3D({ count = 6, cardData }: TarotCards3DProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [cards, setCards] = React.useState<TarotCard[]>([]);

  // Load card data
  React.useEffect(() => {
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
          // Fallback data
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

  // Card positions in 3D space
  const cardPositions = useMemo(() => {
    const positions: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
    }> = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3.5;
      const yOffset = (i % 2 === 0 ? 0.5 : -0.5) * (i * 0.1);

      positions.push({
        position: [
          Math.cos(angle) * radius,
          yOffset,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        rotation: [0, -angle + Math.PI / 2, 0] as [number, number, number],
      });
    }

    return positions;
  }, [count]);

  if (cards.length === 0) return null;

  return (
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
      <pointLight position={[0, 0, 0]} intensity={0.3} />

      {/* Animated background rings */}
      <AnimatedRings />

      {/* Scroll rig with cards */}
      <ScrollRig>
        {cards.map((card, i) => (
          <TarotCardMesh
            key={card.id}
            card={card}
            position={cardPositions[i].position}
            rotation={cardPositions[i].rotation}
            index={i}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </ScrollRig>

      {/* Environment */}
      <Environment preset="city" />
    </Canvas>
  );
}
