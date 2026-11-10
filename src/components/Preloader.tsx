import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 15;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(onComplete, 250);
          }, 150);
          return 100;
        }
        return next;
      });
    }, 35);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 bg-[#06060A] text-white"
        >
          <div className="flex flex-col items-center text-center max-w-sm w-full">
            <span className="text-xs font-mono tracking-widest text-muted uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              KESHAB GOUDA · PORTFOLIO
            </span>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative mt-2 border border-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="w-full flex items-center justify-between mt-3 text-[10px] font-mono text-muted/70">
              <span>INITIALIZING</span>
              <span>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Preloader;
