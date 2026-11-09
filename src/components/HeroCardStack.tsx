import { useState, useRef, useEffect, useCallback } from "react";

export function HeroCardStack({ dark = false }: { dark?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({
    rotX: 0,
    rotY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });
  const [scrollTilt, setScrollTilt] = useState(0);

  // Smooth mouse move handler that calculates tilt angle & light highlight position
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    // Rotation degrees: up to ~14 degrees
    const rotY = (x - 0.5) * 26;
    const rotX = (0.5 - y) * 20;

    setCoords({
      rotX,
      rotY,
      glareX: Math.round(x * 100),
      glareY: Math.round(y * 100),
      isHovered: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCoords(prev => ({ ...prev, rotX: 0, rotY: 0, isHovered: false }));
  }, []);

  // Touch scroll listener: tilt on scroll for mobile
  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const tilt = Math.max(-10, Math.min(10, (scrollY - 100) * 0.04));
      setScrollTilt(tilt);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const effectiveRotX = coords.isHovered ? coords.rotX : scrollTilt;
  const effectiveRotY = coords.isHovered ? coords.rotY : 0;

  return (
    <div
      ref={containerRef}
      className={`hero-3d-stage ${coords.isHovered ? "is-hovered" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--glare-x": `${coords.glareX}%`,
          "--glare-y": `${coords.glareY}%`,
        } as React.CSSProperties
      }
      aria-label="Interactive 3D developer stack"
    >
      <div
        className="hero-3d-scene"
        style={{
          transform: `rotateX(${effectiveRotX}deg) rotateY(${effectiveRotY}deg)`,
        }}
      >
        {/* Dynamic 3D lighting shadow layer that shifts inversely to cursor */}
        <div
          className="hero-3d-shadow"
          style={{
            transform: `translate3d(${-effectiveRotY * 1.8}px, ${26 + Math.abs(effectiveRotX)}px, -70px)`,
          }}
        />

        {/* Back Layer (translateZ -32px): Syntax-highlighted code snippet */}
        <div className="hero-stack-layer layer-code">
          <div className="card-mini-chrome">
            <div className="card-mini-dots">
              <span className="dot dot--red" />
              <span className="dot dot--yellow" />
              <span className="dot dot--green" />
            </div>
            <span className="card-mini-filename">keshab.config.ts</span>
            <span className="card-mini-tag">TS</span>
          </div>
          <pre className="hero-code-snippet">
            <code>
              <span className="hl-key">export const</span> developer = {"{"}
              {"\n"}  name: <span className="hl-str">&quot;Keshab Gouda&quot;</span>,
              {"\n"}  role: <span className="hl-str">&quot;Full-Stack Engineer&quot;</span>,
              {"\n"}  stack: [<span className="hl-str">&quot;React 19&quot;</span>, <span className="hl-str">&quot;TypeScript&quot;</span>, <span className="hl-str">&quot;Go&quot;</span>],
              {"\n"}  mindset: <span className="hl-str">&quot;Craft meets scale&quot;</span>,
              {"\n"}  shipping: <span className="hl-bool">true</span>,
              {"\n"}{"}"};
            </code>
          </pre>
          {/* Specular glare sheen tracking cursor */}
          <div className="card-glare-overlay" />
        </div>

        {/* Foreground Layer (translateZ +36px): Cedar Finance dashboard */}
        <div className="hero-stack-layer layer-preview">
          <div className="card-mini-chrome">
            <div className="card-mini-dots">
              <span className="dot dot--red" />
              <span className="dot dot--yellow" />
              <span className="dot dot--green" />
            </div>
            <div className="card-mini-url">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>cedar.finance</span>
            </div>
            <span className="mini-tag-badge">PROD</span>
          </div>

          <div className="preview-mini-body">
            <div className="preview-mini-header">
              <div>
                <small>FEATURED SYSTEM</small>
                <strong>Cedar Finance</strong>
              </div>
              <span className="preview-val-pill">₹84.2L</span>
            </div>

            <div className="preview-mini-stats">
              <div className="mini-stat">
                <span>WORKFLOW GAIN</span>
                <strong>+42% faster</strong>
              </div>
              <div className="mini-stat">
                <span>LATENCY P99</span>
                <strong>12 ms</strong>
              </div>
            </div>

            {/* Mini SVG Sparkline Chart */}
            <div className="preview-mini-chart">
              <svg viewBox="0 0 280 65" className="sparkline-svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="heroSparkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,55 Q 35,48 70,36 T 140,25 T 210,18 T 280,8 L 280,65 L 0,65 Z"
                  fill="url(#heroSparkGradient)"
                />
                <path
                  d="M 0,55 Q 35,48 70,36 T 140,25 T 210,18 T 280,8"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.2"
                />
                <circle cx="140" cy="25" r="3" fill="var(--surface-raised)" stroke="var(--accent)" strokeWidth="2" />
                <circle cx="280" cy="8" r="3.5" fill="var(--accent)" />
              </svg>
            </div>

            <div className="preview-mini-footer">
              <span className="live-pulse-dot" />
              <span>Interactive telemetry active</span>
              <span className="mini-uptime">99.99%</span>
            </div>
          </div>
          {/* Specular glare sheen tracking cursor */}
          <div className="card-glare-overlay" />
        </div>

        {/* 3D Floating Token 1: Sage Code Orbit (translateZ +70px) */}
        <div className="hero-3d-floating-token token--sage">
          <code>&lt;/&gt;</code>
        </div>

        {/* 3D Floating Token 2: Telemetry Pill (translateZ +65px) */}
        <div className="hero-3d-floating-token token--sand">
          <span className="token-dot" />
          <span>v2.5</span>
        </div>

        {/* Floating Status Badge: Open to work (translateZ +85px) */}
        <div className="hero-stack-badge">
          <span className="glow-dot" />
          <div className="badge-text">
            <strong>Open to work</strong>
            <small>Available for select 2025 projects</small>
          </div>
        </div>
      </div>
    </div>
  );
}
