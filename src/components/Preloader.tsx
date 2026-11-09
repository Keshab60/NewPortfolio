import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING 3D ENGINE...");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const statuses = [
      { at: 20, text: "WARMING UP WEBGL BUFFERS..." },
      { at: 45, text: "CALIBRATING STUDIO LIGHTING..." },
      { at: 75, text: "GENERATING KINETIC MESHES..." },
      { at: 95, text: "EXPERIENCE READY." },
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= 100) {
          clearInterval(timer);
          setStatusText("EXPERIENCE READY.");
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(onComplete, 600);
          }, 300);
          return 100;
        }

        const match = statuses.find((s) => s.at <= next);
        if (match) setStatusText(match.text);

        return next;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40, filter: "blur(12px)" }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between p-8 md:p-14 bg-[#06060A] text-white"
        >
          {/* Top Brand Tag */}
          <div className="flex items-center justify-between text-xs font-mono text-muted tracking-wider">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              KESHAB GOUDA · PORTFOLIO
            </span>
            <span>SYSTEM v2.5.0</span>
          </div>

          {/* Center Digital Progress Counter */}
          <div className="max-w-xl mx-auto w-full flex flex-col items-start">
            <div className="text-6xl md:text-8xl font-bold font-mono tracking-tighter text-white flex items-baseline">
              <span>{String(progress).padStart(3, "0")}</span>
              <span className="text-2xl md:text-3xl text-accent font-light ml-2">%</span>
            </div>

            {/* Glowing holographic progress bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden relative border border-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #7C5CFF, #00F0FF)",
                  boxShadow: "0 0 20px #7C5CFF",
                }}
              />
            </div>

            <div className="w-full flex items-center justify-between mt-4 text-xs font-mono text-muted">
              <span className="flex items-center gap-2">
                <span className="inline-block w-1 h-3 bg-cyan-400 animate-pulse" />
                {statusText}
              </span>
              <span>{progress}/100</span>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="flex items-center justify-between text-[11px] font-mono text-muted/70">
            <span>AWARDS EDITION · THREE.JS + R3F</span>
            <span>PREPARING HARDWARE ACCELERATION</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Preloader;
