import { lazy, Suspense, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { BrowserMockup, ProjectMockupDispatcher } from "./components/ProjectMockups";
import { HeroCardStack } from "./components/HeroCardStack";
import { CountUp } from "./components/CountUp";
import { Project3DTiltCard, type ProjectItem } from "./components/Project3DTiltCard";
import { Preloader } from "./components/Preloader";
import { CustomCursor } from "./components/CustomCursor";
import { useLenis } from "./hooks/useLenis";
import { PERSON, PLAY_STORE_URL, RESTAURANT_LIVE_URL, MESSAGEMATE_GITHUB_URL } from "./data/profile";

const Hero3DScene = lazy(() => import("./components/3d/Hero3DScene"));
const Background3D = lazy(() => import("./components/3d/Background3D"));
const Skills3DGalaxy = lazy(() => import("./components/3d/Skills3DGalaxy"));

type IconName =
  | "arrow"
  | "copy"
  | "github"
  | "linkedin"
  | "moon"
  | "sun"
  | "menu"
  | "close"
  | "code"
  | "server"
  | "speed"
  | "mail";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    github: <path d="M15 22v-3.8c.04-1-.35-1.96-1-2.65 3.28-.37 6.72-1.61 6.72-7.3A5.7 5.7 0 0 0 19.2 4.3 5.3 5.3 0 0 0 19.05.4S17.85 0 15 1.9a13.4 13.4 0 0 0-7 0C5.15 0 3.95.4 3.95.4A5.3 5.3 0 0 0 3.8 4.3a5.7 5.7 0 0 0-1.52 3.95c0 5.68 3.44 6.92 6.72 7.3-.38.4-.67.92-.84 1.5-.16.58-.21 1.18-.16 1.77V22" />,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" /><path d="M2 9h4v12H2z" /><path d="M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" /></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" /></>,
    menu: <><path d="M4 8h16M4 16h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    code: <><path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" /></>,
    server: <><rect x="3" y="4" width="18" height="6" rx="2" /><rect x="3" y="14" width="18" height="6" rx="2" /><path d="M7 7h.01M7 17h.01" /></>,
    speed: <><path d="M20.4 15a9 9 0 1 0-16.8 0" /><path d="m12 15 4-5" /><path d="M8 19h8" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Button({ children, variant = "primary", href, onClick, type = "button" }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost"; href?: string; onClick?: () => void; type?: "button" | "submit" }) {
  const cls = `button button--${variant}`;
  return href ? <a className={cls} href={href} onClick={onClick}>{children}</a> : <button className={cls} type={type} onClick={onClick}>{children}</button>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

function SectionHeading({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return <div className="section-heading reveal"><div><Eyebrow>{label}</Eyebrow><h2>{title}</h2></div>{intro && <p>{intro}</p>}</div>;
}

const projects: ProjectItem[] = [
  {
    n: "01",
    title: "Aumbram",
    type: "Mobile app · Google Play",
    category: "Mobile",
    description: "All-in-one platform with e-commerce, online learning, social networking and music streaming, live on the Google Play Store.",
    tags: ["React Native", "TypeScript", "REST APIs"],
    liveUrl: PLAY_STORE_URL,
    art: "cedar",
    featured: true,
  },
  {
    n: "02",
    title: "Wallely",
    type: "Mobile app",
    category: "Mobile",
    description: "Smart bill and document management app with OCR bill scanning and secure image/PDF upload.",
    tags: ["React Native", "TanStack Query", "OCR", "Supabase"],
    art: "north",
    featured: false,
  },
  {
    n: "03",
    title: "Restaurant App",
    type: "Full-stack web",
    category: "Full-stack",
    description: "MERN restaurant app with JWT auth, role-based authorization, PayPal payments, menu, cart and order management. Deployed on Render.",
    tags: ["MongoDB", "Express.js", "React.js", "Node.js", "Redux"],
    liveUrl: RESTAURANT_LIVE_URL,
    art: "field",
    featured: true,
  },
  {
    n: "04",
    title: "MessageMate",
    type: "Full-stack web",
    category: "Full-stack",
    description: "Real-time one-to-one chat app with Socket.IO, a React frontend and a Node/Express REST + WebSocket backend.",
    tags: ["MongoDB", "Express.js", "React.js", "Node.js", "Socket.IO"],
    githubUrl: MESSAGEMATE_GITHUB_URL,
    art: "relay",
    featured: false,
  },
];

function Nav({ dark, setDark, onCommand, onLogo }: { dark: boolean; setDark: (value: boolean) => void; onCommand: () => void; onLogo: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [["Work", "#work"], ["Skills", "#skills"], ["About", "#about"], ["Contact", "#contact"]];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return <header className="nav-shell">
    <nav className="nav" aria-label="Primary navigation">
      <a className="logo" href="#top" aria-label="Keshab Gouda home" onClick={onLogo}><span>KG</span><i /></a>
      <div className={`nav-links ${open ? "is-open" : ""}`}>
        {links.map(([text, href]) => <a href={href} key={text} onClick={() => setOpen(false)}>{text}</a>)}
        <Button href="#contact" variant="primary" onClick={() => setOpen(false)}>Let&apos;s talk <Icon name="arrow" size={16} /></Button>
      </div>
      <div className="nav-actions">
        <button className="command-trigger" onClick={onCommand}>Jump to… <kbd>⌘K</kbd></button>
        <button className="icon-button" aria-label={`Switch to ${dark ? "light" : "dark"} mode`} onClick={() => setDark(!dark)}><Icon name={dark ? "sun" : "moon"} /></button>
        <button className="icon-button menu-button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
      </div>
    </nav>
  </header>;
}

function ProjectModal({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <div className="project-modal" role="dialog" aria-modal="true" aria-label={`${project.title} preview`} onMouseDown={event => event.stopPropagation()}>
      <div className="modal-head"><Eyebrow>Quick preview / {project.n}</Eyebrow><button className="icon-button" onClick={onClose} aria-label="Close preview"><Icon name="close" /></button></div>
      <div className={`modal-visual art--${project.art} slide-${slide}`}>
        <div className="modal-art-canvas">
          <ProjectMockupDispatcher projectArt={project.art} category={project.category} />
        </div>
        <span className="modal-slide-tag">{slide === 0 ? "Overview" : slide === 1 ? "Interaction system" : "Results"}</span>
      </div>
      <div className="modal-dots">{[0, 1, 2].map(i => <button className={slide === i ? "active" : ""} onClick={() => setSlide(i)} aria-label={`Show slide ${i + 1}`} key={i} />)}</div>
      <div className="modal-body">
        <div><Eyebrow>{project.type}</Eyebrow><h2>{project.title}</h2><p>{project.description}</p></div>
        {project.metric ? <strong>{project.metric}</strong> : null}
      </div>
      <div className="modal-actions">
        {project.title === "Aumbram" && (
          <Button href="#case-study" onClick={onClose}>View case study <Icon name="arrow" size={16} /></Button>
        )}
        {project.liveUrl ? (
          <Button href={project.liveUrl} variant="secondary" onClick={onClose}>Live <Icon name="arrow" size={16} /></Button>
        ) : null}
        {project.githubUrl ? (
          <Button href={project.githubUrl} variant="ghost">GitHub</Button>
        ) : null}
      </div>
    </div>
  </div>;
}

const commandItems = [
  ["Work", "#work", "Selected products and mockups"],
  ["Case study", "#case-study", "Cedar Finance architecture deep dive"],
  ["Skills Galaxy", "#skills", "Interactive 3D constellation & technical mastery"],
  ["About", "#about", "Bio, story beats & career timeline"],
  ["Contact", "#contact", "Project inquiries and availability"],
];

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const filtered = commandItems.filter(item =>
    item[0].toLowerCase().includes(query.toLowerCase()) ||
    item[2].toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      window.location.hash = filtered[selectedIndex][1];
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return <div className="command-backdrop" onMouseDown={onClose}>
    <div
      className="command-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={event => event.stopPropagation()}
      onKeyDown={handleKeyDown}
    >
      <div className="command-search">
        <span>⌘</span>
        <input
          autoFocus
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search sections or jump to destination..."
          aria-label="Search destinations"
        />
        <kbd>ESC</kbd>
      </div>
      <div className="command-results">
        <Eyebrow>Quick Navigation</Eyebrow>
        {filtered.length > 0 ? (
          filtered.map(([label, href, desc], index) => (
            <a
              href={href}
              onClick={onClose}
              key={href}
              className={index === selectedIndex ? "command-item-active" : ""}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span>0{index + 1}</span>
              <div className="command-label-wrap">
                <strong>{label}</strong>
                <small>{desc}</small>
              </div>
              <Icon name="arrow" size={15} />
            </a>
          ))
        ) : (
          <div className="command-empty">No matching destination found</div>
        )}
      </div>
    </div>
  </div>;
}

function TerminalCard() {
  const answers: Record<string, string> = {
    whoami: "Keshab Gouda — full-stack developer, product craft enthusiast, based in Odisha & working worldwide.",
    skills: "TypeScript · React 19 · Next.js · Node.js · Go · PostgreSQL · Redis · Tailwind CSS · System Design",
    stack: "Frontend: React, Vite, Next.js | Backend: Node.js, Go, Express | Storage: Postgres, Redis, ClickHouse",
    philosophy: "Code is read more often than written. Build fast, accessible, and human by default.",
    contact: "hello@keshab.dev — open for select projects and product collaborations.",
  };
  const [command, setCommand] = useState("whoami");
  return <div className="terminal-card reveal">
    <div className="terminal-head"><span><i /><i /><i /></span><small>keshab@portfolio ~</small></div>
    <div className="terminal-output"><span>$ {command}</span><p>{answers[command]}</p></div>
    <div className="terminal-commands">{Object.keys(answers).map(item => <button className={item === command ? "active" : ""} onClick={() => setCommand(item)} key={item}>{item}</button>)}</div>
  </div>;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(true);
  const [heroMode, setHeroMode] = useState<"3d" | "cards">("3d");
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState("All");
  const [preview, setPreview] = useState<typeof projects[number] | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [projectType, setProjectType] = useState("Website");
  const [sent, setSent] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [eggClicks, setEggClicks] = useState(0);
  const [egg, setEgg] = useState(false);
  const [renderBackground3D, setRenderBackground3D] = useState(false);

  useEffect(() => {
    const checkBg = () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.innerWidth < 768;
      setRenderBackground3D(!prefersReduced && !isMobile);
    };
    checkBg();
    window.addEventListener("resize", checkBg);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener?.("change", checkBg);
    return () => {
      window.removeEventListener("resize", checkBg);
      motionQuery.removeEventListener?.("change", checkBg);
    };
  }, []);

  // Initialize smooth scrolling with Lenis (60/120fps, zero Chrome jank)
  useLenis();

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);



  useEffect(() => {
    const scroll = () => {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", `${Math.min(progress * 100, 100)}%`);
      document.body.classList.toggle("is-scrolled", window.scrollY > 60);
    };
    const keys = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(current => !current);
      }
      if (event.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("keydown", keys);
    return () => { window.removeEventListener("scroll", scroll); window.removeEventListener("keydown", keys); };
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSent(true);
    window.setTimeout(() => setSent(false), 4500);
  };
  const logoClick = () => {
    const next = eggClicks + 1;
    setEggClicks(next);
    if (next >= 5) {
      setEgg(true);
      setEggClicks(0);
      window.setTimeout(() => setEgg(false), 4000);
    }
  };
  const filteredProjects = filter === "All" ? projects : projects.filter(project => project.category === filter);

  return <div id="top" className="site relative">
    {loading && <Preloader onComplete={() => setLoading(false)} />}
    <CustomCursor />
    {renderBackground3D && (
      <Suspense fallback={null}>
        <Background3D />
      </Suspense>
    )}
    <Nav dark={dark} setDark={setDark} onCommand={() => setCommandOpen(true)} onLogo={logoClick} />
    {commandOpen && <CommandPalette onClose={() => setCommandOpen(false)} />}
    {preview && <ProjectModal project={preview} onClose={() => setPreview(null)} />}
    {egg && <div className="toast easter-toast"><strong>You found the quiet corner.</strong><span>Craft rewards curiosity. +100 XP</span></div>}
    {sent && <div className="toast success-toast"><strong>Message ready.</strong><span>Thanks—I'll be in touch within 24 hours.</span></div>}

    <main>
      <section className="hero section">
        <div className="hero-kicker reveal"><span className="status-dot" /> Open to opportunities</div>
        <div className="hero-grid">
          <div className="hero-content reveal">
            <div className="hero-title">
              <Eyebrow>Software Engineer</Eyebrow>
              <h1>Keshab<br /><em>Gouda.</em></h1>
            </div>
            <div className="hero-copy">
              <h2>I build React Native apps and full-stack web products.</h2>
              <p>Software Engineer at Pairalabs Technology, building REST API-driven mobile and full-stack applications with React Native, TypeScript and the MERN stack.</p>
              <div className="button-row">
                <Button href="#work" variant="primary">View work <Icon name="arrow" size={17} /></Button>
                <Button href="#contact" variant="secondary">Contact</Button>
              </div>
              <div className="social-row">
                <a href={PERSON.github} target="_blank" rel="noreferrer"><Icon name="github" size={17} /> GitHub</a>
                <a href={PERSON.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={17} /> LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="hero-visual reveal relative">
            <div className="w-full h-full relative min-h-[460px] md:min-h-[520px] flex items-center justify-center">
              {heroMode === "3d" ? (
                <Suspense fallback={null}>
                  <Hero3DScene />
                </Suspense>
              ) : (
                <HeroCardStack dark={dark} />
              )}
              {/* Scene View Mode Toggle */}
              <div className="absolute top-2 right-2 z-20 flex bg-surface/85 backdrop-blur-md rounded-full p-1 border border-white/10 text-[10px] font-mono shadow-xl">
                <button
                  type="button"
                  onClick={() => setHeroMode("3d")}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    heroMode === "3d"
                      ? "bg-accent text-white font-medium shadow-md"
                      : "text-text-muted hover:text-white"
                  }`}
                >
                  3D Core
                </button>
                <button
                  type="button"
                  onClick={() => setHeroMode("cards")}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    heroMode === "cards"
                      ? "bg-accent text-white font-medium shadow-md"
                      : "text-text-muted hover:text-white"
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-stats reveal">
          <div><strong><CountUp value={30} suffix="+" /></strong><span>React Native screens</span></div>
          <div><strong><CountUp value={20} suffix="+" /></strong><span>REST APIs integrated</span></div>
          <div><strong><CountUp value={4} /></strong><span>Projects</span></div>
        </div>
        <div className="hero-scroll"><span>Scroll to explore</span><i /></div>
      </section>

      <section id="work" className="section projects">
        <SectionHeading label="01 / Selected projects" title="Work with purpose." intro="Mobile apps and full-stack products built with REST APIs, TypeScript and the MERN stack." />
        <div className="filter-tabs" role="tablist" aria-label="Filter projects">{["All", "Mobile", "Full-stack"].map(item => <button role="tab" aria-selected={filter === item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          {filteredProjects.map(project => (
            <Project3DTiltCard
              key={project.title + "-" + filter}
              project={project}
              onPreview={() => setPreview(project)}
            />
          ))}
        </div>
      </section>

      <section id="case-study" className="case-study section">
        <div className="case-top reveal">
          <div><Eyebrow>Featured case study / 2024</Eyebrow><h2>Cedar Finance</h2></div>
          <p>Making wealth management feel less like a spreadsheet and more like a conversation.</p>
        </div>
        <div className="case-facts reveal">
          <div><Eyebrow>Role</Eyebrow><strong>Lead developer</strong></div>
          <div><Eyebrow>Stack</Eyebrow><strong>React, Node, PostgreSQL</strong></div>
          <div><Eyebrow>Timeline</Eyebrow><strong>16 weeks</strong></div>
          <div><Eyebrow>Impact</Eyebrow><strong>42% faster workflows</strong></div>
        </div>
        <div className="case-visual art--cedar reveal">
          <div className="case-mockup-wrapper">
            <BrowserMockup type="finance" url="cedar.finance/app/terminal" />
          </div>
          <span className="case-caption">01 — Live Cedar Finance advisory terminal / desktop view</span>
        </div>
        <div className="case-content">
          <div className="case-copy reveal"><Eyebrow>The problem</Eyebrow><h3>Complex data, without the complexity.</h3><p>Advisors were losing hours each week navigating disconnected tools. We created one calm, cohesive workspace where the most important signal always rises above the noise.</p><p>I led frontend architecture, collaborated on product flows, and designed a typed API layer that made iteration faster across the team.</p></div>
          <div className="code-block reveal">
            <div className="code-head"><span><i /><i /><i /> portfolio.ts</span><button onClick={() => { navigator.clipboard?.writeText("const portfolio = await api.portfolio.summary();"); setCopied(true); }}><Icon name="copy" size={15} /> {copied ? "Copied" : "Copy"}</button></div>
            <pre><code><span className="code-muted">{"// Calm UI starts with clear data"}</span>{"\n"}<span className="code-key">const</span> portfolio = <span className="code-key">await</span> api.portfolio.<span className="code-fn">summary</span>({"{"}{"\n  "}currency: <span className="code-string">&quot;INR&quot;</span>,{"\n  "}period: <span className="code-string">&quot;YTD&quot;</span>,{"\n"}{"}"});</code></pre>
          </div>
        </div>
        <div className="metrics reveal">
          <div><strong><CountUp value={42} suffix="%" /></strong><span>faster advisor workflows</span></div>
          <div><strong><CountUp value={98} /></strong><span>Lighthouse performance</span></div>
          <div><strong><CountUp value={2.4} suffix="×" decimals={1} /></strong><span>increase in engagement</span></div>
        </div>
        <a href="#work" className="next-project reveal"><span><Eyebrow>Next project</Eyebrow><strong>Northline Studio</strong></span><Icon name="arrow" size={28} /></a>
      </section>

      <section id="skills" className="stack section">
        <SectionHeading
          label="02 / Capabilities &amp; 3D Constellation"
          title="Interactive Skills Galaxy."
          intro="A real-time 3D constellation of frameworks, runtimes, and creative engineering disciplines. Drag to rotate or click any tech node to inspect."
        />
        <Suspense
          fallback={
            <div className="w-full h-[420px] md:h-[500px] flex items-center justify-center text-xs font-mono text-muted bg-surface/40 rounded-2xl border border-white/10 my-6">
              Loading 3D Galaxy...
            </div>
          }
        >
          <Skills3DGalaxy />
        </Suspense>
        <div className="stack-grid reveal mt-10">
          {[
            ["Languages", ["TypeScript", "JavaScript", "Go", "Python"]],
            ["Frontend & 3D", ["React 19", "Three.js", "R3F", "Framer Motion", "Tailwind v4"]],
            ["Backend", ["Node.js", "Express", "REST", "GraphQL"]],
            ["Databases", ["PostgreSQL", "MongoDB", "Redis", "Supabase"]],
            ["Tools & DevOps", ["Git", "Docker", "AWS", "Vercel"]],
          ].map(([category, items]) => <div className="stack-group" key={category as string}><h3>{category}</h3><div>{(items as string[]).map(item => <span className="tag" key={item}>{item}</span>)}</div></div>)}
        </div>
      </section>

      <section id="about" className="about section theme-inverted">
        <div className="about-grid">
          <div className="portrait reveal"><span>KG</span><div>Based in Odisha<br />Working worldwide</div></div>
          <div className="about-copy reveal"><Eyebrow>03 / About me</Eyebrow><h2>Engineer by trade.<br /><em>Curious by nature.</em></h2><p>I&apos;m Keshab, a full-stack developer who cares deeply about the details people notice—and the infrastructure they don&apos;t. I enjoy turning fuzzy ideas into thoughtful, durable products.</p><p>When I&apos;m not writing code, you&apos;ll find me reading about design, photographing quiet corners of the city, or hunting for excellent coffee.</p><a className="text-link" href="#contact">More about my approach <Icon name="arrow" size={16} /></a></div>
        </div>
        <div className="story-beats reveal"><div><span>01</span><strong>Curiosity first</strong><p>I started by taking interfaces apart to understand why they felt right.</p></div><div><span>02</span><strong>Systems followed</strong><p>That curiosity grew into a craft spanning pixels, APIs, and architecture.</p></div><div><span>03</span><strong>People always</strong><p>Today I build tools that help people move with more confidence.</p></div></div>
        <TerminalCard />
        <div className="timeline reveal">
          <div><Eyebrow>Experience</Eyebrow></div>
          {[["2023—Now", "Senior Full-stack Developer", "Independent / Remote"], ["2021—2023", "Software Engineer", "Product Studio"], ["2019—2021", "Frontend Developer", "Digital Agency"], ["2015—2019", "B.Tech, Computer Science", "Technical University"]].map(item => <div className="timeline-row" key={item[0]}><span>{item[0]}</span><strong>{item[1]}</strong><small>{item[2]}</small></div>)}
        </div>
      </section>

      <section id="contact" className="contact section">
        <div className="contact-intro reveal"><Eyebrow>04 / Contact</Eyebrow><h2>Have a project<br />in mind? <em>Let&apos;s talk.</em></h2><p>I&apos;m currently available for select freelance projects and long-term collaborations.</p><button className="copy-email" onClick={() => { navigator.clipboard?.writeText("hello@keshab.dev"); setEmailCopied(true); window.setTimeout(() => setEmailCopied(false), 2200); }}><Icon name="mail" size={18} /> hello@keshab.dev <span>{emailCopied ? "Copied!" : "Copy"}</span></button><span className="availability"><i /> Open to work · replies within 24 hours</span><Button href="#" variant="secondary">Book a 30-minute call <Icon name="arrow" size={16} /></Button></div>
        <form className="contact-form reveal" onSubmit={submit}>
          <fieldset><legend>What can I help with?</legend><div className="contact-chips">{["Website", "Web app", "API", "Just saying hi"].map(item => <button type="button" className={projectType === item ? "active" : ""} onClick={() => setProjectType(item)} key={item}>{item}</button>)}</div></fieldset>
          <label><span>Name</span><input required name="name" placeholder="Your name" /></label>
          <label><span>Email</span><input required type="email" name="email" placeholder="you@company.com" /></label>
          <label><span>Tell me about your {projectType.toLowerCase()}</span><textarea required name="message" rows={4} placeholder={`A few words about your ${projectType.toLowerCase()}...`} /></label>
          <Button type="submit">{sent ? "Inquiry sent" : "Send inquiry"} <Icon name="arrow" size={17} /></Button>
        </form>
      </section>
    </main>

    <footer className="footer">
      <div><a className="logo" href="#top"><span>KG</span><i /></a><p>Designing and developing thoughtful digital products.</p></div>
      <div className="footer-links"><div><Eyebrow>Navigate</Eyebrow><a href="#work">Work</a><a href="#skills">Skills</a><a href="#about">About</a><a href="#contact">Contact</a></div><div><Eyebrow>Connect</Eyebrow><a href={PERSON.github} target="_blank" rel="noreferrer">GitHub</a><a href={PERSON.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:${PERSON.email}`}>Email</a></div></div>
      <div className="footer-bottom"><span>© 2025 Keshab Gouda</span><span>Built with care in Odisha</span><a href="#top">Back to top ↑</a></div>
    </footer>
  </div>;
}

export default App;
