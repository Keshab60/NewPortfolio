import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ProjectMockupDispatcher } from "./ProjectMockups";

export interface ProjectItem {
  n: string;
  title: string;
  type: string;
  category: string;
  metric: string;
  description: string;
  tags: string[];
  art: string;
  featured?: boolean;
  liveUrl?: string;
  githubUrl?: string;
}

export function Project3DTiltCard({
  project,
  onPreview,
}: {
  project: ProjectItem;
  onPreview: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Framer Motion values for 60/120fps smooth tilt without Chrome lag
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 180, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [0, 1], [-12, 12]);
  const glareX = useTransform(smoothX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [0, 1], ["0%", "100%"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`project-3d-card relative group ${
        project.featured ? "col-span-1 lg:col-span-2" : "col-span-1"
      }`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full rounded-2xl p-4 md:p-6 bg-gradient-to-b from-[#141424]/90 to-[#0B0B14]/95 border border-white/10 hover:border-accent/40 shadow-xl transition-shadow duration-300 relative overflow-hidden backdrop-blur-md"
      >
        {/* Dynamic Light Sheen / Glare */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) =>
                `radial-gradient(circle 320px at ${x} ${y}, rgba(124, 92, 255, 0.18), transparent 70%)`
            ),
          }}
        />

        {/* Project Visual Stage with 3D Depth */}
        <div
          onClick={onPreview}
          className={`project-art art--${project.art} cursor-pointer rounded-xl overflow-hidden relative border border-white/5 ${
            project.featured ? "h-[360px] md:h-[460px]" : "h-[320px] md:h-[380px]"
          }`}
          style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        >
          {/* Mockup Canvas */}
          <div className="absolute inset-4 md:inset-8 flex items-center justify-center">
            <ProjectMockupDispatcher projectArt={project.art} category={project.category} />
          </div>

          {/* 3D Floating Badges */}
          <div
            className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-white/90 border border-white/10"
            style={{ transform: "translateZ(45px)" }}
          >
            {project.n} / {project.category}
          </div>

          <div
            className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md text-[11px] font-mono text-accent border border-accent/40"
            style={{ transform: "translateZ(45px)" }}
          >
            {project.metric}
          </div>

          {/* Quick Preview Hover Trigger */}
          <div
            className="absolute bottom-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-mono font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
            style={{ transform: "translateZ(50px)" }}
          >
            Quick Preview <span>→</span>
          </div>
        </div>

        {/* Project Metadata & Links */}
        <div
          className="mt-5 flex flex-col md:flex-row md:items-end justify-between gap-4"
          style={{ transform: "translateZ(25px)" }}
        >
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-accent">
              {project.type}
            </span>
            <h3 className="text-xl md:text-2xl font-bold font-display text-text-primary mt-1">
              {project.title}
            </h3>
            <p className="text-sm text-text-muted mt-1.5 max-w-lg leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <button
                type="button"
                onClick={onPreview}
                className="text-accent hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                Inspect Case Study <span>↗</span>
              </button>
              <a
                href={project.githubUrl || "#github"}
                className="text-text-muted hover:text-white transition-colors flex items-center gap-1"
              >
                GitHub <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default Project3DTiltCard;
