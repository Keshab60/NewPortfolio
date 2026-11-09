import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleField({ count = 800 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const targetPointer = useRef({ x: 0, y: 0 });

  // Generate random positions with depth
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const violet = new THREE.Color("#7C5CFF");
    const cyan = new THREE.Color("#00F0FF");
    const white = new THREE.Color("#FFFFFF");

    for (let i = 0; i < count; i++) {
      // Cylindrical/spherical spread
      const radius = 6 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 24;

      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Color variation between violet, cyan and soft white
      const rand = Math.random();
      const c = rand < 0.5 ? violet : rand < 0.85 ? cyan : white;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Smooth mouse lerp
    targetPointer.current.x = THREE.MathUtils.lerp(targetPointer.current.x, state.pointer.x * 0.3, 0.04);
    targetPointer.current.y = THREE.MathUtils.lerp(targetPointer.current.y, state.pointer.y * 0.3, 0.04);

    // Continuous slow cosmic rotation
    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x = targetPointer.current.y * 0.2;
    pointsRef.current.rotation.z = targetPointer.current.x * 0.15;

    // Subtle breathing pulse
    const elapsed = state.clock.getElapsedTime();
    pointsRef.current.position.y = Math.sin(elapsed * 0.4) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.45}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function Background3D() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.75,
      }}
    >
      <Canvas
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop="always"
      >
        <ParticleField count={isMobile ? 320 : 800} />
      </Canvas>
    </div>
  );
}
export default Background3D;
