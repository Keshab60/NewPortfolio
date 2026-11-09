import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for fluid motion without Chrome lag
  const springConfig = { damping: 28, stiffness: 350, mass: 0.35 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable custom cursor on mobile / touchscreens
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest(
        'button, a, input, textarea, [role="button"], [role="tab"], .project-art, .command-trigger'
      );
      setIsHovering(isInteractive);
    };

    const mouseDown = () => setIsClicking(true);
    const mouseUp = () => setIsClicking(false);
    const mouseLeave = () => setIsVisible(false);
    const mouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    document.addEventListener("mouseleave", mouseLeave);
    document.addEventListener("mouseenter", mouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("mouseleave", mouseLeave);
      document.removeEventListener("mouseenter", mouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer Follower Ring */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 48 : 26,
          height: isHovering ? 48 : 26,
          scale: isClicking ? 0.8 : 1,
          borderColor: isHovering ? "rgba(124, 92, 255, 0.9)" : "rgba(255, 255, 255, 0.4)",
          backgroundColor: isHovering ? "rgba(124, 92, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="rounded-full border backdrop-blur-[1px] fixed top-0 left-0"
      />

      {/* Inner Pin Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 1.6 : isHovering ? 0.4 : 1,
          backgroundColor: isHovering ? "#00F0FF" : "#7C5CFF",
        }}
        transition={{ duration: 0.15 }}
        className="w-1.5 h-1.5 rounded-full fixed top-0 left-0 shadow-[0_0_8px_#7C5CFF]"
      />
    </div>
  );
}

export default CustomCursor;
