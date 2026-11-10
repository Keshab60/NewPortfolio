import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface SkillNode {
  name: string;
  category: "frontend" | "backend" | "creative3d" | "cloud";
  level: string;
  desc: string;
  color: string;
}

const SKILLS_DATA: SkillNode[] = [
  { name: "React 19", category: "frontend", level: "98%", desc: "Server Components, hooks, concurrent UI", color: "#00F0FF" },
  { name: "TypeScript", category: "frontend", level: "96%", desc: "Type-level architecture, strict safety", color: "#3178C6" },
  { name: "Three.js / R3F", category: "creative3d", level: "94%", desc: "Shaders, physics, WebGL optimization", color: "#7C5CFF" },
  { name: "Next.js", category: "frontend", level: "92%", desc: "App router, SSR, Edge rendering", color: "#FFFFFF" },
  { name: "Node.js", category: "backend", level: "93%", desc: "Async I/O, event loops, high concurrency", color: "#339933" },
  { name: "Go (Golang)", category: "backend", level: "88%", desc: "Microservices, goroutines, distributed tools", color: "#00ADD8" },
  { name: "Tailwind CSS v4", category: "frontend", level: "99%", desc: "Fluid layouts, design tokens, micro-interactions", color: "#38BDF8" },
  { name: "PostgreSQL", category: "backend", level: "90%", desc: "Relational queries, indexes, migrations", color: "#4169E1" },
  { name: "Redis", category: "backend", level: "89%", desc: "In-memory caching, pub/sub, rate limiters", color: "#DC382D" },
  { name: "Docker", category: "cloud", level: "87%", desc: "Containerization, staging pipelines", color: "#2496ED" },
  { name: "GraphQL", category: "backend", level: "86%", desc: "Schema stitching, Apollo, subscriptions", color: "#E10098" },
  { name: "Framer Motion", category: "creative3d", level: "95%", desc: "Spring physics, layout animations, gestures", color: "#FF0055" },
];

function OrbitingSkill({
  skill,
  position,
  active,
  onSelect,
}: {
  skill: SkillNode;
  position: [number, number, number];
  active: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Subtle node pulsation
    const scale = active ? 1.4 : hovered ? 1.25 : 1 + Math.sin(time * 2 + position[0]) * 0.08;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial
          color={hovered || active ? "#FFFFFF" : skill.color}
          emissive={skill.color}
          emissiveIntensity={active ? 2.5 : hovered ? 2 : 1.2}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

function GalaxyCluster({
  skills,
  activeSkill,
  setActiveSkill,
}: {
  skills: SkillNode[];
  activeSkill: SkillNode | null;
  setActiveSkill: (s: SkillNode) => void;
}) {
  const clusterGroup = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Calculate Fibonacci / Spherical distribution with generous spacing
  const nodePositions = useMemo(() => {
    const radius = 3.6;
    return skills.map((_, index) => {
      const phi = Math.acos(-1 + (2 * index) / skills.length);
      const theta = Math.sqrt(skills.length * Math.PI) * phi;
      return [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi) * 0.72,
        radius * Math.cos(phi),
      ] as [number, number, number];
    });
  }, [skills]);

  useFrame((state, delta) => {
    if (!clusterGroup.current) return;

    // Smooth cursor drag / hover tilt
    targetRotation.current.y += delta * 0.18;
    targetRotation.current.x = THREE.MathUtils.lerp(
      targetRotation.current.x,
      state.pointer.y * 0.4,
      0.04
    );

    clusterGroup.current.rotation.y = targetRotation.current.y + state.pointer.x * 0.5;
    clusterGroup.current.rotation.x = targetRotation.current.x;
  });

  return (
    <group ref={clusterGroup}>
      {/* Central Quantum Orb */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh scale={0.75}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#7C5CFF"
            emissive="#7C5CFF"
            emissiveIntensity={1.8}
            wireframe
          />
        </mesh>
      </Float>

      {/* Orbit Rings */}
      <mesh rotation={[Math.PI / 4, 0, 0]} scale={3.4}>
        <torusGeometry args={[1, 0.006, 16, 80]} />
        <meshBasicMaterial color="#7C5CFF" transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[-Math.PI / 4, 0, 0]} scale={3.4}>
        <torusGeometry args={[1, 0.006, 16, 80]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.25} />
      </mesh>

      {/* Orbiting Skill Nodes */}
      {skills.map((skill, index) => (
        <OrbitingSkill
          key={skill.name}
          skill={skill}
          position={nodePositions[index]}
          active={activeSkill?.name === skill.name}
          onSelect={() => setActiveSkill(skill)}
        />
      ))}
    </group>
  );
}

export function Skills3DGalaxy() {
  const [activeSkill, setActiveSkill] = useState<SkillNode>(SKILLS_DATA[0]);

  return (
    <div className="w-full relative flex flex-col lg:flex-row items-center gap-8 py-6">
      {/* 3D Canvas Viewport */}
      <div className="w-full lg:w-3/5 h-[420px] md:h-[500px] relative rounded-2xl overflow-hidden border border-white/10 bg-surface/40 backdrop-blur-md">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center text-xs font-mono text-muted">
              Loading 3D Galaxy...
            </div>
          }
        >
          <Canvas
            dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
            camera={{ position: [0, 0, 7.0], fov: 46 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={1.1} />
            <pointLight position={[5, 5, 5]} intensity={2.5} color="#7C5CFF" />
            <pointLight position={[-5, -5, -3]} intensity={2.2} color="#00F0FF" />
            <GalaxyCluster
              skills={SKILLS_DATA}
              activeSkill={activeSkill}
              setActiveSkill={setActiveSkill}
            />
          </Canvas>
        </Suspense>

        <div className="absolute top-4 left-4 z-20 text-[11px] font-mono text-muted/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-none flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          Click or hover any node to inspect
        </div>
      </div>

      {/* Selected Skill Detail HUD */}
      <div className="w-full lg:w-2/5 p-6 rounded-2xl bg-surface-raised/70 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
            Tech Node Inspector
          </span>
          <span
            className="px-2.5 py-0.5 rounded-full text-[11px] font-mono"
            style={{
              backgroundColor: `${activeSkill.color}22`,
              color: activeSkill.color,
              border: `1px solid ${activeSkill.color}55`,
            }}
          >
            {activeSkill.category}
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: activeSkill.color }}
            />
            {activeSkill.name}
          </h3>
          <p className="text-sm text-text-muted mt-2 leading-relaxed">
            {activeSkill.desc}
          </p>
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-text-muted">Mastery Index</span>
            <span className="text-accent font-semibold">{activeSkill.level}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: activeSkill.level,
                background: `linear-gradient(90deg, ${activeSkill.color}, #7C5CFF)`,
              }}
            />
          </div>
        </div>

        {/* Quick select buttons */}
        <div className="pt-2">
          <span className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
            Quick Select
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SKILLS_DATA.map((s) => (
              <button
                key={s.name}
                onClick={() => setActiveSkill(s)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                  activeSkill.name === s.name
                    ? "bg-accent text-white"
                    : "bg-surface hover:bg-white/10 text-text-muted hover:text-text-primary"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skills3DGalaxy;
