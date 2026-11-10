import type { ReactNode } from "react";

interface MockupBaseProps {
  image?: string;
  className?: string;
}

interface BrowserMockupProps extends MockupBaseProps {
  url?: string;
  type?: "finance" | "store" | "generic";
  accentColor?: string;
}

interface PhoneMockupProps extends MockupBaseProps {
  title?: string;
}

interface CodeMockupProps extends MockupBaseProps {
  endpoint?: string;
  method?: string;
}

/**
 * Reusable Browser Window Mockup
 * Renders realistic window chrome with address bar and simulated fake UI.
 * Accepts optional `image` prop for future real screenshots.
 */
export function BrowserMockup({
  image,
  url = "app.local",
  type = "finance",
  className = "",
}: BrowserMockupProps) {
  if (image) {
    return (
      <div className={`mockup-window mockup-browser ${className}`}>
        <div className="mockup-chrome">
          <div className="mockup-dots">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
          <div className="mockup-address-bar">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>{url}</span>
          </div>
        </div>
        <div className="mockup-screen">
          <img src={image} alt={url} className="mockup-img" />
        </div>
      </div>
    );
  }

  return (
    <div className={`mockup-window mockup-browser mockup-theme--${type} ${className}`}>
      <div className="mockup-chrome">
        <div className="mockup-dots">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>
        <div className="mockup-address-bar">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>{url}</span>
        </div>
        <div className="mockup-chrome-actions">
          <span className="mini-pill">Live preview</span>
        </div>
      </div>

      <div className="mockup-screen">
        {type === "finance" ? (
          <div className="mockup-app-finance">
            {/* Sidebar */}
            <aside className="mockup-sidebar">
              <div className="mockup-sidebar-logo">
                <div className="mockup-brand-mark" />
                <span>App</span>
              </div>
              <nav className="mockup-nav-items">
                <span className="mockup-nav-item active">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                  Overview
                </span>
                <span className="mockup-nav-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  Activity
                </span>
                <span className="mockup-nav-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M6 8h.01M10 8h.01" />
                  </svg>
                  Modules
                </span>
              </nav>
              <div className="mockup-sidebar-footer">
                <span className="user-dot" />
                <span>Active User</span>
              </div>
            </aside>

            {/* Main Area */}
            <main className="mockup-main">
              <header className="mockup-app-header">
                <div>
                  <small>SYSTEM OVERVIEW</small>
                  <h4>Dashboard Terminal</h4>
                </div>
                <div className="mockup-header-badges">
                  <span className="badge badge--success">● Synced</span>
                  <span className="badge badge--neutral">Live State</span>
                </div>
              </header>

              {/* Stat Cards */}
              <div className="mockup-stat-row">
                <div className="mockup-stat-card">
                  <span>Interface</span>
                  <strong>Screens</strong>
                  <span className="trend trend--up">Interactive</span>
                </div>
                <div className="mockup-stat-card">
                  <span>API Integration</span>
                  <strong>REST</strong>
                  <span className="trend trend--up">Connected</span>
                </div>
                <div className="mockup-stat-card">
                  <span>Architecture</span>
                  <strong>Modular</strong>
                  <span className="trend trend--neutral">Optimized</span>
                </div>
              </div>

              {/* Chart Panel */}
              <div className="mockup-chart-card">
                <div className="chart-header">
                  <span>Activity Curve</span>
                  <div className="chart-pills">
                    <span className="pill active">Realtime</span>
                    <span className="pill">History</span>
                  </div>
                </div>
                <div className="chart-area">
                  <svg viewBox="0 0 460 120" className="chart-svg" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="mockupAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                        <stop offset="90%" stopColor="var(--accent)" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d="M 0,95 Q 40,85 80,72 T 160,50 T 240,60 T 320,30 T 400,22 L 460,15 L 460,120 L 0,120 Z"
                      fill="url(#mockupAreaGradient)"
                    />
                    {/* Line stroke */}
                    <path
                      d="M 0,95 Q 40,85 80,72 T 160,50 T 240,60 T 320,30 T 400,22 L 460,15"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2.5"
                    />
                    {/* Trend points */}
                    <circle cx="160" cy="50" r="3.5" fill="var(--surface-raised)" stroke="var(--accent)" strokeWidth="2" />
                    <circle cx="320" cy="30" r="3.5" fill="var(--surface-raised)" stroke="var(--accent)" strokeWidth="2" />
                    <circle cx="460" cy="15" r="4" fill="var(--accent)" />
                  </svg>
                </div>
              </div>

              {/* Table Rows */}
              <div className="mockup-table">
                <div className="table-row table-head">
                  <span>Module</span>
                  <span>Layer</span>
                  <span>Protocol</span>
                  <span>Status</span>
                </div>
                <div className="table-row">
                  <span className="asset-name"><i className="asset-icon" /> Client App</span>
                  <span>UI / Screens</span>
                  <span>TypeScript</span>
                  <span className="pill-tag pill-tag--green">Deployed</span>
                </div>
                <div className="table-row">
                  <span className="asset-name"><i className="asset-icon asset-icon--debt" /> Data Services</span>
                  <span>API Layer</span>
                  <span>REST</span>
                  <span className="pill-tag pill-tag--blue">Connected</span>
                </div>
              </div>
            </main>
          </div>
        ) : (
          /* Store UI (Restaurant App / Full-stack) */
          <div className="mockup-app-store">
            <header className="mockup-store-header">
              <span className="store-title">RESTAURANT APP</span>
              <div className="store-nav">
                <span>Menu</span>
                <span className="active">Dishes</span>
                <span>Cart</span>
              </div>
              <span className="store-cart">Cart (2)</span>
            </header>
            <div className="store-hero">
              <div className="store-featured-card">
                <div className="object-art">
                  <div className="sculpture-shape" />
                </div>
                <div className="object-info">
                  <small>MERN STACK</small>
                  <h3>Chef&apos;s Special</h3>
                  <p>Fresh ingredients, role-based order workflow and online payments.</p>
                  <div className="object-footer">
                    <strong>Featured</strong>
                    <span className="btn-pill">Order Now</span>
                  </div>
                </div>
              </div>
              <div className="store-mini-cards">
                <div className="store-mini-card">
                  <div className="mini-thumb thumb-one" />
                  <span>Special Menu</span>
                  <strong>Ready</strong>
                </div>
                <div className="store-mini-card">
                  <div className="mini-thumb thumb-two" />
                  <span>Cart Review</span>
                  <strong>Online</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Reusable Mobile Phone Mockup
 * Renders phone device chassis, island, status bar, and responsive app UI.
 */
export function PhoneMockup({
  image,
  title = "Mobile App",
  className = "",
}: PhoneMockupProps) {
  if (image) {
    return (
      <div className={`mockup-device mockup-phone ${className}`}>
        <div className="phone-chassis">
          <div className="phone-island" />
          <div className="phone-screen">
            <img src={image} alt={title} className="mockup-img" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mockup-device mockup-phone ${className}`}>
      <div className="phone-chassis">
        {/* Dynamic Island / Speaker */}
        <div className="phone-island">
          <span className="island-camera" />
        </div>

        <div className="phone-screen">
          {/* Status Bar */}
          <div className="phone-status-bar">
            <span>9:41</span>
            <div className="status-icons">
              <svg width="12" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/>
              </svg>
              <span className="battery-icon" />
            </div>
          </div>

          {/* App Header */}
          <div className="phone-app-header">
            <div>
              <small>MOBILE APP</small>
              <h4>{title}</h4>
            </div>
            <div className="phone-menu-btn">
              <span /><span />
            </div>
          </div>

          {/* Featured Architecture Card */}
          <div className="phone-feature-card">
            <div className="arch-visual">
              <div className="arch-sky" />
              <div className="arch-building">
                <div className="building-slab slab--top" />
                <div className="building-glass" />
                <div className="building-slab slab--mid" />
                <div className="building-supports">
                  <i /><i /><i /><i />
                </div>
              </div>
              <span className="arch-tag">PRODUCTION</span>
            </div>
            <div className="arch-body">
              <h5>{title}</h5>
              <p>Cross-platform mobile application with fluid screens and REST API integration.</p>
              <div className="arch-specs">
                <span>Screens</span>
                <span>TypeScript</span>
                <span className="spec-stat">Native</span>
              </div>
            </div>
          </div>

          {/* Next Teaser Card */}
          <div className="phone-sub-card">
            <div className="sub-thumb" />
            <div>
              <strong>Interface Module</strong>
              <small>React Native</small>
            </div>
            <span className="arrow-chip">→</span>
          </div>

          {/* Bottom Tab Bar */}
          <div className="phone-tab-bar">
            <span className="tab active">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
            </span>
            <span className="tab">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
              </svg>
            </span>
            <span className="tab">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable Code / Terminal Mockup
 * Renders developer client / terminal window with syntax highlighting and latency stats.
 */
export function CodeMockup({
  image,
  endpoint = "/api/chat",
  method = "POST",
  className = "",
}: CodeMockupProps) {
  if (image) {
    return (
      <div className={`mockup-window mockup-code ${className}`}>
        <div className="mockup-chrome">
          <div className="mockup-dots">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
          <span className="mockup-file-tab">socket-service.ts</span>
        </div>
        <div className="mockup-screen">
          <img src={image} alt="Code preview" className="mockup-img" />
        </div>
      </div>
    );
  }

  return (
    <div className={`mockup-window mockup-code ${className}`}>
      {/* Chrome header */}
      <div className="mockup-chrome">
        <div className="mockup-dots">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>
        <div className="code-tabs">
          <span className="code-tab active">
            <span className="tab-method">{method}</span>
            <span className="tab-path">{endpoint}</span>
          </span>
          <span className="code-tab">
            <span className="tab-file">events.ts</span>
          </span>
        </div>
        <div className="code-pill-status">
          <span className="status-dot-pulse" />
          <span>200 OK</span>
        </div>
      </div>

      <div className="mockup-screen code-split-view">
        {/* Request Pane */}
        <div className="code-pane">
          <div className="pane-header">
            <small>REQUEST PAYLOAD</small>
            <span>application/json</span>
          </div>
          <pre className="code-snippet">
            <code>
              <span className="hl-bracket">{"{"}</span>
              {"\n"}  <span className="hl-key">&quot;event&quot;</span>: <span className="hl-str">&quot;message.sent&quot;</span>,
              {"\n"}  <span className="hl-key">&quot;room&quot;</span>: <span className="hl-str">&quot;chat_room_01&quot;</span>,
              {"\n"}  <span className="hl-key">&quot;payload&quot;</span>: <span className="hl-bracket">{"{"}</span>
              {"\n"}    <span className="hl-key">&quot;content&quot;</span>: <span className="hl-str">&quot;Hello world&quot;</span>,
              {"\n"}    <span className="hl-key">&quot;senderId&quot;</span>: <span className="hl-str">&quot;user_89f0a&quot;</span>
              {"\n"}  <span className="hl-bracket">{"}"}</span>,
              {"\n"}  <span className="hl-key">&quot;timestamp&quot;</span>: <span className="hl-str">&quot;now&quot;</span>
              {"\n"}<span className="hl-bracket">{"}"}</span>
            </code>
          </pre>
        </div>

        {/* Live Response Pane */}
        <div className="code-pane code-pane--response">
          <div className="pane-header">
            <small>SOCKET TELEMETRY</small>
            <span className="uptime-pill">Connected</span>
          </div>
          <pre className="code-snippet">
            <code>
              <span className="hl-comment">// Real-time Socket.IO event dispatch</span>
              {"\n"}<span className="hl-bracket">{"{"}</span>
              {"\n"}  <span className="hl-key">&quot;status&quot;</span>: <span className="hl-str">&quot;DELIVERED&quot;</span>,
              {"\n"}  <span className="hl-key">&quot;transport&quot;</span>: <span className="hl-str">&quot;websocket&quot;</span>,
              {"\n"}  <span className="hl-key">&quot;activeRooms&quot;</span>: <span className="hl-num">1</span>,
              {"\n"}  <span className="hl-key">&quot;broadcast&quot;</span>: <span className="hl-bool">true</span>
              {"\n"}<span className="hl-bracket">{"}"}</span>
            </code>
          </pre>

          {/* Terminal telemetry footer */}
          <div className="telemetry-bar">
            <div>
              <span>TRANSPORT</span>
              <strong>WebSocket</strong>
            </div>
            <div>
              <span>STATUS</span>
              <strong>Connected</strong>
            </div>
            <div>
              <span>EVENT</span>
              <strong>Realtime</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Dispatcher component matching each project to its tailored mockup
 */
export function ProjectMockupDispatcher({
  projectArt,
  category,
  image,
  className = "",
}: {
  projectArt: string;
  category: string;
  image?: string;
  className?: string;
}) {
  if (category === "Mobile" || projectArt === "cedar" || projectArt === "north") {
    return (
      <PhoneMockup
        title={projectArt === "cedar" ? "Aumbram" : "Wallely"}
        image={image}
        className={className}
      />
    );
  }

  if (projectArt === "relay") {
    return (
      <CodeMockup
        endpoint="/api/chat"
        method="POST"
        image={image}
        className={className}
      />
    );
  }

  // Restaurant App (MERN) / Full-stack
  return (
    <BrowserMockup
      type="store"
      url="restaurant-app.onrender.com"
      image={image}
      className={className}
    />
  );
}
