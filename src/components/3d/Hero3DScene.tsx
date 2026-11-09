import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Central 3D kinetic object (can easily be swapped with your own .glb model via useGLTF)
function CoreGeometry({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const satellitesGroupRef = useRef<THREE.Group>(null);

  const mousePosition = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Smooth mouse lerping
    mousePosition.current.x = THREE.MathUtils.lerp(mousePosition.current.x, state.pointer.x, 0.05);
    mousePosition.current.y = THREE.MathUtils.lerp(mousePosition.current.y, state.pointer.y, 0.05);

    // Rotation of main distorted glossy core
    if (meshRef.current) {
      const speed = isHovered ? 1.6 : 0.8;
      meshRef.current.rotation.x = time * 0.25 * speed + mousePosition.current.y * 0.4;
      meshRef.current.rotation.y = time * 0.35 * speed + mousePosition.current.x * 0.5;
    }

    // Gyroscopic outer rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.4;
      ring1Ref.current.rotation.y = time * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.35;
      ring2Ref.current.rotation.z = time * 0.2;
    }

    // Floating satellites orbit
    if (satellitesGroupRef.current) {
      satellitesGroupRef.current.rotation.y = time * 0.3 + mousePosition.current.x * 0.2;
    }
  });

  return (
    <group>
      {/* Central Distorted Glossy Sphere */}
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh ref={meshRef} castShadow receiveShadow scale={1.55}>
          <icosahedronGeometry args={[1, 16]} />
          <MeshDistortMaterial
            color="#14142B"
            emissive="#2A1659"
            emissiveIntensity={0.35}
            roughness={0.12}
            metalness={0.92}
            clearcoat={1}
            clearcoatRoughness={0.1}
            distort={0.38}
            speed={2.2}
          />
        </mesh>
      </Float>

      {/* Outer Holographic Energy Ring 1 - Electric Violet */}
      <mesh ref={ring1Ref} scale={2.4}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#7C5CFF"
          emissive="#7C5CFF"
          emissiveIntensity={1.8}
          roughness={0.2}
          wireframe
        />
      </mesh>

      {/* Outer Holographic Energy Ring 2 - Cyber Cyan */}
      <mesh ref={ring2Ref} scale={2.75} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={1.5}
          roughness={0.3}
          wireframe
        />
      </mesh>

      {/* Orbiting Tech Satellites */}
      <group ref={satellitesGroupRef}>
        {/* Satellite 1: Violet Octahedron */}
        <mesh position={[2.8, 0.7, 0]} scale={0.22}>
          <octahedronGeometry />
          <meshStandardMaterial
            color="#7C5CFF"
            emissive="#7C5CFF"
            emissiveIntensity={1.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Satellite 2: Cyan Dodecahedron */}
        <mesh position={[-2.6, -0.8, 0.5]} scale={0.18}>
          <dodecahedronGeometry />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={1.1}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        {/* Satellite 3: Soft Amber Prism */}
        <mesh position={[0.6, -2.5, -0.6]} scale={0.16}>
          <tetrahedronGeometry />
          <meshStandardMaterial
            color="#FFB347"
            emissive="#FF8C00"
            emissiveIntensity={0.9}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

// Interactive Scene with Studio Lighting & Camera Parallax
function Scene({ isHovered }: { isHovered: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    // Parallax camera movement
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.9,
      0.04
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.9,
      0.04
    );
    state.camera.lookAt(0, 0, 0);

    // Dynamic light tracking cursor
    if (lightRef.current) {
      lightRef.current.position.x = state.pointer.x * 4;
      lightRef.current.position.y = state.pointer.y * 4;
    }
  });

  return (
    <>
      {/* Studio Lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#FFFFFF" />
      <pointLight
        ref={lightRef}
        position={[0, 0, 4]}
        intensity={2.8}
        color="#7C5CFF"
        distance={10}
      />
      <pointLight position={[-5, -4, -3]} intensity={2.2} color="#00F0FF" />
      <pointLight position={[5, -3, -2]} intensity={1.5} color="#9050FF" />

      {/* The 3D Geometry Core */}
      <CoreGeometry isHovered={isHovered} />
    </>
  );
}

// 3D Canvas Fallback Loader
function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
    </div>
  );
}

export function Hero3DScene({ className = "" }: { className?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`hero-3d-container relative w-full h-full min-h-[460px] md:min-h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(124, 92, 255, 0.16) 0%, rgba(0, 240, 255, 0.06) 45%, transparent 70%)",
        }}
      />

      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
          camera={{ position: [0, 0, 5.8], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          className="w-full h-full"
        >
          <Scene isHovered={isHovered} />
        </Canvas>
      </Suspense>

      {/* Interactive HUD badge */}
      <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full bg-surface-raised/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-muted tracking-wider uppercase pointer-events-none flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Interactive WebGL · 3D Engine
      </div>
    </div>
  );
}

export default Hero3DScene;
