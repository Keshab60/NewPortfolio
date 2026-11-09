import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { BrowserMockup, ProjectMockupDispatcher } from "./components/ProjectMockups";
import { HeroCardStack } from "./components/HeroCardStack";
import { CountUp } from "./components/CountUp";
import { Hero3DScene } from "./components/3d/Hero3DScene";
import { Background3D } from "./components/3d/Background3D";
import { Skills3DGalaxy } from "./components/3d/Skills3DGalaxy";
import { Project3DTiltCard, type ProjectItem } from "./components/Project3DTiltCard";
import { Preloader } from "./components/Preloader";
import { CustomCursor } from "./components/CustomCursor";
import { useLenis } from "./hooks/useLenis";

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
  { n: "01", title: "Cedar Finance", type: "Product design & development", category: "Web", metric: "42% faster workflows", description: "A focused financial dashboard that turns complex portfolio data into clear decisions.", tags: ["React 19", "TypeScript", "Node.js"], art: "cedar", featured: true },
  { n: "02", title: "Northline Studio", type: "3D Digital experience", category: "Mobile", metric: "2.4× engagement", description: "An architectural spatial experience with real-time WebGL rendering and zero scroll-lag.", tags: ["Next.js", "Three.js", "Framer Motion"], art: "north", featured: false },
  { n: "03", title: "Relay API", type: "Backend systems", category: "API", metric: "99.99% uptime", description: "A resilient event infrastructure processing millions of messages without friction.", tags: ["Go", "PostgreSQL", "Redis"], art: "relay", featured: false },
  { n: "04", title: "Form & Field", type: "E-commerce & Spatial", category: "Open Source", metric: "38% faster load", description: "A calm, tactile storefront for a contemporary furniture collection with 3D product previews.", tags: ["React", "Stripe", "Prisma"], art: "field", featured: true },
];

function ProjectCard({ project, onPreview }: { project: typeof projects[number]; onPreview: () => void }) {
  return <article className={`project-card reveal ${project.featured ? "project-card--wide" : ""}`}>
    <button className={`project-art art--${project.art}`} onClick={onPreview} aria-label={`Quick preview ${project.title}`}>
      <div className="project-art-canvas">
        <ProjectMockupDispatcher projectArt={project.art} category={project.category} />
      </div>
      <span className="art-label">{project.n} / Selected work</span>
      <span className="project-metric">{project.metric}</span>
      <span className="preview-cta">Quick preview <Icon name="arrow" size={15} /></span>
    </button>
    <div className="project-meta">
      <div><Eyebrow>{project.type}</Eyebrow><h3>{project.title}</h3><p>{project.description}</p></div>
      <div className="tag-row">{project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>
      <div className="project-links"><a href="#case-study">Live demo <Icon name="arrow" size={15} /></a><a href="#github">GitHub <Icon name="arrow" size={15} /></a></div>
    </div>
  </article>;
}

function Nav({ dark, setDark, onCommand, onLogo }: { dark: boolean; setDark: (value: boolean) => void; onCommand: () => void; onLogo: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [["Work", "#work"], ["Skills", "#skills"], ["About", "#about"], ["Services", "#services"], ["Contact", "#contact"]];

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
      <div className="modal-body"><div><Eyebrow>{project.type}</Eyebrow><h2>{project.title}</h2><p>{project.description}</p></div><strong>{project.metric}</strong></div>
      <div className="modal-actions"><Button href="#case-study" onClick={onClose}>View case study <Icon name="arrow" size={16} /></Button><Button href="#" variant="ghost">GitHub</Button></div>
    </div>
  </div>;
}

const commandItems = [
  ["Work", "#work", "Selected products and mockups"],
  ["Case study", "#case-study", "Cedar Finance architecture deep dive"],
  ["Skills Galaxy", "#skills", "Interactive 3D constellation & technical mastery"],
  ["About", "#about", "Bio, story beats & interactive terminal"],
  ["Services", "#services", "Web, API, and performance audits"],
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

function Cursor() {
  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".custom-cursor");
    const move = (event: MouseEvent) => {
      if (!cursor) return;
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      cursor.classList.toggle("is-hovering", !!(event.target as HTMLElement).closest("a,button,input,textarea"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div className="custom-cursor" />;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(true);
  const [heroMode, setHeroMode] = useState<"3d" | "cards">("3d");
  const [copied, setCopied] = useState(false);
  const [quote, setQuote] = useState(0);
  const [quotePaused, setQuotePaused] = useState(false);
  const [filter, setFilter] = useState("All");
  const [preview, setPreview] = useState<typeof projects[number] | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [word, setWord] = useState(0);
  const [projectType, setProjectType] = useState("Website");
  const [sent, setSent] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [eggClicks, setEggClicks] = useState(0);
  const [egg, setEgg] = useState(false);

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
    const timer = window.setInterval(() => setWord(current => (current + 1) % 3), 2200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (quotePaused) return;
    const timer = window.setInterval(() => setQuote(current => (current + 1) % 2), 5500);
    return () => window.clearInterval(timer);
  }, [quotePaused]);

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
  const words = ["fast", "accessible", "scalable"];
  const quotes = [
    { text: "Keshab brought uncommon clarity to a technically demanding product. He thinks beyond the screen and ships with care.", name: "Ananya Rao", role: "Founder, Cedar Labs" },
    { text: "A rare combination of strong visual judgment and deep engineering skill. The work was fast, considered, and dependable.", name: "Marcus Lee", role: "Product Lead, Northline" },
  ];

  return <div id="top" className="site relative">
    {loading && <Preloader onComplete={() => setLoading(false)} />}
    <CustomCursor />
    <Background3D />
    <Nav dark={dark} setDark={setDark} onCommand={() => setCommandOpen(true)} onLogo={logoClick} />
    {commandOpen && <CommandPalette onClose={() => setCommandOpen(false)} />}
    {preview && <ProjectModal project={preview} onClose={() => setPreview(null)} />}
    {egg && <div className="toast easter-toast"><strong>You found the quiet corner.</strong><span>Craft rewards curiosity. +100 XP</span></div>}
    {sent && <div className="toast success-toast"><strong>Message ready.</strong><span>Thanks—I'll be in touch within 24 hours.</span></div>}

    <main>
      <section className="hero section">
        <div className="hero-kicker reveal"><span className="status-dot" /> Available for select projects <span>2025</span></div>
        <div className="hero-grid">
          <div className="hero-content reveal">
            <div className="hero-title">
              <Eyebrow>Full-stack developer &amp; Creative Technologist</Eyebrow>
              <h1>Keshab<br /><em>Gouda.</em></h1>
            </div>
            <div className="hero-copy">
              <span className="mono-note">&lt;craft /&gt;</span>
              <h2>I build <span className="rotating-word">{words[word]}</span><br />3D web apps that feel alive.</h2>
              <p>Frontend finesse meets 3D WebGL immersion and backend reliability. Partnering with ambitious teams to create award-level digital experiences that perform effortlessly at scale.</p>
              <div className="button-row">
                <Button href="#work" variant="primary">View 3D work <Icon name="arrow" size={17} /></Button>
                <Button href="#contact" variant="secondary">Book a call</Button>
              </div>
              <div className="social-row"><a href="#github"><Icon name="github" size={17} /> GitHub</a><a href="#"><Icon name="linkedin" size={17} /> LinkedIn</a></div>
            </div>
          </div>
          <div className="hero-visual reveal relative">
            <div className="w-full h-full relative min-h-[460px] md:min-h-[520px] flex items-center justify-center">
              {heroMode === "3d" ? (
                <Hero3DScene />
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
          <div><strong><CountUp value={6} pad={2} /></strong><span>Years experience</span></div>
          <div><strong><CountUp value={48} /></strong><span>Projects shipped</span></div>
          <div><strong><CountUp value={16} /></strong><span>Technologies</span></div>
        </div>
        <div className="code-fragment code-fragment--one">const quality = details.map(care);</div>
        <div className="code-fragment code-fragment--two">status: shipping</div>
        <div className="hero-scroll"><span>Scroll to explore</span><i /></div>
      </section>

      <section id="work" className="section projects">
        <SectionHeading label="01 / Selected projects" title="Work with purpose." intro="A selection of digital products and 3D spatial experiences shaped from first principles—balancing aesthetics, interactive depth, and high performance." />
        <div className="filter-tabs" role="tablist" aria-label="Filter projects">{["All", "Web", "Mobile", "API", "Open Source"].map(item => <button role="tab" aria-selected={filter === item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
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
        <Skills3DGalaxy />
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

      <section id="github" className="github-section section">
        <SectionHeading label="03 / Open source" title="Building in the open." intro="Small tools, experiments, and contributions to the software I use every day." />
        <div className="github-layout">
          <div className="contribution-card reveal">
            <div className="contribution-head"><span><Icon name="github" size={19} /> 1,284 contributions</span><Eyebrow>Last 12 months</Eyebrow></div>
            <div className="contribution-grid">{Array.from({ length: 154 }, (_, i) => <i key={i} className={`level-${(i * 7 + i % 5) % 5}`} />)}</div>
            <div className="contribution-foot"><span>Less</span><i className="level-0" /><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" /><span>More</span></div>
          </div>
          <div className="repo-list reveal">
            {[["tiny-cache", "A tiny, typed LRU cache for Node and the browser.", "TypeScript", "482"], ["a11y-lint", "Opinionated accessibility checks for modern React.", "JavaScript", "219"], ["go-queue", "Reliable background jobs without the ceremony.", "Go", "163"]].map(repo => <a className="repo-card" href="#" key={repo[0]}><div><h3>{repo[0]}</h3><p>{repo[1]}</p><span><i /> {repo[2]} &nbsp; ☆ {repo[3]}</span></div><Icon name="arrow" size={18} /></a>)}
            <Button href="#" variant="secondary">View GitHub profile <Icon name="arrow" size={16} /></Button>
          </div>
        </div>
      </section>

      <section className="activity section">
        <SectionHeading label="04 / Now & next" title="Always in motion." intro="A live window into what I’m building, learning, and sharing right now." />
        <div className="activity-grid">
          <article className="building-card reveal"><div className="building-top"><span className="status-dot" /><Eyebrow>Currently building</Eyebrow></div><h3>Trace — a calmer way to monitor production systems.</h3><p>Open-source observability for small product teams. Private beta ships this month.</p><div className="progress-label"><span>Beta progress</span><strong>78%</strong></div><div className="progress-track"><i /></div><div className="building-tags"><span className="tag">Go</span><span className="tag">React</span><span className="tag">ClickHouse</span></div></article>
          <div className="notes-grid">
            {[["Designing APIs for humans", "7 min read", "Engineering"], ["The quiet power of good defaults", "5 min read", "Product"], ["Making React feel instant", "9 min read", "Performance"]].map((note, index) => <a href="#" className="note-card reveal" key={note[0]}><span>0{index + 1}</span><div><Eyebrow>{note[2]} · {note[1]}</Eyebrow><h3>{note[0]}</h3></div><Icon name="arrow" size={17} /></a>)}
          </div>
        </div>
      </section>

      <section id="about" className="about section theme-inverted">
        <div className="about-grid">
          <div className="portrait reveal"><span>KG</span><div>Based in Odisha<br />Working worldwide</div></div>
          <div className="about-copy reveal"><Eyebrow>04 / About me</Eyebrow><h2>Engineer by trade.<br /><em>Curious by nature.</em></h2><p>I&apos;m Keshab, a full-stack developer who cares deeply about the details people notice—and the infrastructure they don&apos;t. I enjoy turning fuzzy ideas into thoughtful, durable products.</p><p>When I&apos;m not writing code, you&apos;ll find me reading about design, photographing quiet corners of the city, or hunting for excellent coffee.</p><a className="text-link" href="#contact">More about my approach <Icon name="arrow" size={16} /></a></div>
        </div>
        <div className="story-beats reveal"><div><span>01</span><strong>Curiosity first</strong><p>I started by taking interfaces apart to understand why they felt right.</p></div><div><span>02</span><strong>Systems followed</strong><p>That curiosity grew into a craft spanning pixels, APIs, and architecture.</p></div><div><span>03</span><strong>People always</strong><p>Today I build tools that help people move with more confidence.</p></div></div>
        <TerminalCard />
        <div className="timeline reveal">
          <div><Eyebrow>Experience</Eyebrow></div>
          {[["2023—Now", "Senior Full-stack Developer", "Independent / Remote"], ["2021—2023", "Software Engineer", "Product Studio"], ["2019—2021", "Frontend Developer", "Digital Agency"], ["2015—2019", "B.Tech, Computer Science", "Technical University"]].map(item => <div className="timeline-row" key={item[0]}><span>{item[0]}</span><strong>{item[1]}</strong><small>{item[2]}</small></div>)}
        </div>
      </section>

      <section id="services" className="services section">
        <SectionHeading label="05 / Services" title="How I can help." />
        <div className="service-grid">
          {[
            ["code", "01", "Web development", "Responsive, accessible interfaces with thoughtful motion and meticulous attention to detail."],
            ["server", "02", "API & backend", "Reliable APIs, considered data models, and systems built to scale without unnecessary complexity."],
            ["speed", "03", "Performance", "Audits and focused improvements that make existing products faster, clearer, and easier to maintain."],
          ].map(service => <article className="service-card reveal" key={service[2]}><div><Icon name={service[0] as IconName} size={25} /><Eyebrow>{service[1]}</Eyebrow></div><h3>{service[2]}</h3><p>{service[3]}</p><a href="#contact">Start a conversation <Icon name="arrow" size={15} /></a></article>)}
        </div>
        <div className="process reveal"><div className="process-title"><Eyebrow>How I work</Eyebrow><h3>From ambiguity to a confident launch.</h3></div>{[["01", "Discover", "Align on goals and the problem worth solving."], ["02", "Design", "Shape flows, systems, and a clear direction."], ["03", "Build", "Ship in focused, testable increments."], ["04", "Launch", "Measure, refine, and hand over with care."]].map(step => <div className="process-step" key={step[0]}><span>{step[0]}</span><i /><strong>{step[1]}</strong><p>{step[2]}</p></div>)}</div>
      </section>

      <section className="testimonials section reveal" onMouseEnter={() => setQuotePaused(true)} onMouseLeave={() => setQuotePaused(false)}>
        <div className="logo-strip"><span>CEDAR</span><span>NORTHLINE</span><span>FORM&FIELD</span><span>RELAY</span></div>
        <div className="quote-mark">“</div>
        <blockquote>{quotes[quote].text}</blockquote>
        <div className="quote-footer"><div><strong>{quotes[quote].name}</strong><span>{quotes[quote].role}</span></div><div className="quote-nav"><button aria-label="Previous testimonial" onClick={() => setQuote((quote + quotes.length - 1) % quotes.length)}>←</button><span>{quote + 1} / {quotes.length}</span><button aria-label="Next testimonial" onClick={() => setQuote((quote + 1) % quotes.length)}>→</button></div></div>
      </section>

      <section id="contact" className="contact section">
        <div className="contact-intro reveal"><Eyebrow>06 / Contact</Eyebrow><h2>Have a project<br />in mind? <em>Let&apos;s talk.</em></h2><p>I&apos;m currently available for select freelance projects and long-term collaborations.</p><button className="copy-email" onClick={() => { navigator.clipboard?.writeText("hello@keshab.dev"); setEmailCopied(true); window.setTimeout(() => setEmailCopied(false), 2200); }}><Icon name="mail" size={18} /> hello@keshab.dev <span>{emailCopied ? "Copied!" : "Copy"}</span></button><span className="availability"><i /> Open to work · replies within 24 hours</span><Button href="#" variant="secondary">Book a 30-minute call <Icon name="arrow" size={16} /></Button></div>
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
      <div className="footer-links"><div><Eyebrow>Navigate</Eyebrow><a href="#work">Work</a><a href="#about">About</a><a href="#services">Services</a></div><div><Eyebrow>Connect</Eyebrow><a href="#">GitHub</a><a href="#">LinkedIn</a><a href="mailto:hello@keshab.dev">Email</a></div></div>
      <div className="footer-bottom"><span>© 2025 Keshab Gouda</span><span>Built with care in Odisha</span><a href="#top">Back to top ↑</a></div>
    </footer>
  </div>;
}

export default App;
