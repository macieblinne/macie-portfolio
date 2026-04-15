import { useState, useEffect, useRef } from 'react';
import { IconMoodSmileBeam, IconPlane, IconPaw, IconMountain, IconSeeding, IconSeedingFilled } from '@tabler/icons-react';
import { useCursorLabel } from './Cursor';
import styles from './Hero.module.css';

function LiveTime() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Denver',
    })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Denver',
        })
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className={styles.locationTime}>{time}</span>;
}

const photoTabs = [
  { id: 'dashboard', icon: IconMoodSmileBeam, photos: ['/self.jpg'], caption: 'Designing from Boulder' },
  { id: 'mountain', icon: IconMountain, photos: Array.from({ length: 9 }, (_, i) => `/photos/mountain/${i + 1}.jpg`), caption: 'Exploring Colorado trails' },
  { id: 'paw', icon: IconPaw, photos: Array.from({ length: 6 }, (_, i) => `/photos/paw/${i + 1}.jpg`), caption: 'Hiking with my husky' },
  { id: 'plane', icon: IconPlane, photos: Array.from({ length: 6 }, (_, i) => `/photos/plane/${i + 1}.jpg`), caption: 'Travel & new places' },
];

export function PhotoCard({
  className = '',
  showLocation = true,
  hideFirstTab = false,
  persistentControls = false,
}) {
  const tabs = hideFirstTab ? photoTabs.slice(1) : photoTabs;
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [photoIndex, setPhotoIndex] = useState(0);

  const tab = tabs.find((t) => t.id === activeTab);
  const currentPhoto = tab.photos[photoIndex % tab.photos.length];

  const randomIndex = (length, exclude) => {
    if (length <= 1) return 0;
    let next;
    do {
      next = Math.floor(Math.random() * length);
    } while (next === exclude);
    return next;
  };

  const handleTabClick = (id) => {
    const nextTab = photoTabs.find((t) => t.id === id);
    setActiveTab(id);
    setPhotoIndex(randomIndex(nextTab.photos.length));
  };

  const handlePhotoClick = () => {
    if (tab.photos.length > 1) {
      setPhotoIndex((prev) => randomIndex(tab.photos.length, prev));
    }
  };

  const handleNav = (e) => {
    e.stopPropagation();
    if (tab.photos.length > 1) {
      setPhotoIndex((prev) => randomIndex(tab.photos.length, prev));
    }
  };

  return (
    <div
      className={`${styles.card} ${styles.photoCard} ${styles.entrance} ${persistentControls ? styles.photoCardPersistent : ''} ${className}`}
      style={{ '--delay': '80ms' }}
    >
      <div
        className={styles.photoStack}
        onClick={handlePhotoClick}
        style={{ cursor: tab.photos.length > 1 ? 'pointer' : 'default' }}
      >
        {tabs.map((t) =>
          t.photos.map((src, i) => (
            <img
              key={`${t.id}-${i}`}
              src={src}
              alt=""
              className={`${styles.photo} ${activeTab === t.id && i === photoIndex % t.photos.length ? styles.photoActive : ''}`}
              loading="lazy"
              draggable={false}
            />
          ))
        )}
      </div>
      {tab.photos.length > 1 && (
        <>
          <button
            className={`${styles.photoNav} ${styles.photoNavLeft}`}
            onClick={handleNav}
            aria-label="Previous photo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className={`${styles.photoNav} ${styles.photoNavRight}`}
            onClick={handleNav}
            aria-label="Next photo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
      {showLocation && (
        <div className={styles.photoOverlay} onClick={(e) => e.stopPropagation()}>
          <span className={styles.locationDot} aria-hidden="true" />
          <span className={styles.locationText}>🏔️ Boulder, Colorado</span>
          <LiveTime />
        </div>
      )}
      {tab.photos.length > 1 && (
        <div className={styles.photoDots}>
          {tab.photos.map((_, i) => (
            <span
              key={i}
              className={`${styles.photoDot} ${i === photoIndex % tab.photos.length ? styles.photoDotActive : ''}`}
            />
          ))}
        </div>
      )}
      <div className={styles.photoBar} style={{ '--active-index': tabs.findIndex((t) => t.id === activeTab) }} onClick={(e) => e.stopPropagation()}>
        <span className={styles.photoBarSlider} />
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              className={`${styles.photoBarItem} ${activeTab === t.id ? styles.photoBarItemActive : ''}`}
              onClick={(e) => { e.stopPropagation(); handleTabClick(t.id); }}
              aria-label={t.id}
            >
              <Icon size={16} strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProjectCard({ className, wrapperClassName, onClick, delay, impact, children }) {
  const handlers = useCursorLabel('View Case Study');

  return (
    <div className={`${wrapperClassName} ${styles.projectWrapper}`} style={{ '--delay': delay }}>
      <button
        className={`${className} ${styles.entrance}`}
        onClick={onClick}
        {...handlers}
      >
        {children}
      </button>
      <button
        className={styles.projectArrowBtn}
        onClick={onClick}
        aria-label="View case study"
      >
        <IconSeeding size={18} strokeWidth={1.75} className={styles.flowerOutline} />
        <IconSeedingFilled size={18} className={styles.flowerFilled} />
      </button>
      {impact && (
        <div className={styles.projectImpact}>
          <span className={styles.impactLabel}>Impact</span>
          <span className={styles.impactText}>{impact}</span>
        </div>
      )}
    </div>
  );
}

const AI_TOOLS = [
  {
    id: 'claude',
    short: 'Cl',
    name: 'Claude',
    role: 'Thinking partner',
    accent: '#D97757',
    flow: [
      { phase: 'Discovery', action: 'Synthesize user interviews', type: 'ux' },
      { phase: 'Analysis', action: 'Pattern-match across research', type: 'ai' },
      { phase: 'Spec', action: 'Draft PRDs & handoff docs', type: 'ai' },
      { phase: 'Review', action: 'Heuristic walkthrough', type: 'ux' },
    ],
  },
  {
    id: 'cursor',
    short: 'Cu',
    name: 'Cursor',
    role: 'Prototype builder',
    accent: '#1F2937',
    flow: [
      { phase: 'Wireframe', action: 'Map flows in Figma', type: 'ux' },
      { phase: 'Prototype', action: 'Build in React + CSS', type: 'ai' },
      { phase: 'Iterate', action: 'Refine from user feedback', type: 'ux' },
      { phase: 'Ship', action: 'Figma → production code', type: 'ai' },
    ],
  },
  {
    id: 'gpt',
    short: 'GPT',
    name: 'ChatGPT',
    role: 'Quick research',
    accent: '#10A37F',
    flow: [
      { phase: 'Kickoff', action: 'Stakeholder prep & agendas', type: 'ux' },
      { phase: 'Explore', action: 'Domain & competitor research', type: 'ai' },
      { phase: 'Name', action: 'Labels, microcopy, taglines', type: 'ai' },
      { phase: 'Present', action: 'Structure the design rationale', type: 'ux' },
    ],
  },
  {
    id: 'figma',
    short: 'Fi',
    name: 'Figma AI',
    role: 'Design accelerator',
    accent: '#A259FF',
    flow: [
      { phase: 'Explore', action: 'Sketch layout options', type: 'ux' },
      { phase: 'Generate', action: 'Auto-layout suggestions', type: 'ai' },
      { phase: 'Polish', action: 'Content & image fills', type: 'ai' },
      { phase: 'System', action: 'Build component variants', type: 'ux' },
    ],
  },
];

const AI_TOOL_LOGOS = [
  { name: 'Claude',     phase: 'Think', role: 'Research, document analysis, design critique, finding patterns in complexity', logo: '/logos/ai/claude.png',     chipLogo: '/logos/ai/claude-solid.png',     accent: '#D97757' },
  { name: 'ChatGPT',    phase: 'Think', role: 'Mapping flows and edge cases, clarifying product requirements, quick ideation', logo: '/logos/ai/chatgpt.png',    chipLogo: '/logos/ai/chatgpt-solid.png',    accent: '#10A37F' },
  { name: 'Figma',      phase: 'Make',  role: 'Making fast UI concepts',                                                     logo: '/logos/ai/figma.png',      chipLogo: '/logos/ai/figma-solid.png',      accent: '#A259FF' },
  { name: 'Midjourney', phase: 'Make',  role: 'Visual storytelling, moodboards',                                             logo: '/logos/ai/midjourney.png', chipLogo: '/logos/ai/midjourney-solid.png', accent: '#6B8FA8' },
  { name: 'Cursor',     phase: 'Ship',  role: 'Component generation, coded prototypes, engineering handoff',                  logo: '/logos/ai/cursor.png',     chipLogo: '/logos/ai/cursor-solid.png',     accent: '#1F2937' },
  { name: 'Vercel',     phase: 'Ship',  role: 'Deploying prototypes fast for real stakeholder testing',                       logo: '/logos/ai/vercel.png',     chipLogo: '/logos/ai/vercel-solid.png',     accent: '#0C447C' },
];

const DRAG_BLOCKS = [
  { id: 'drag',       label: 'Drag me!', tone: 'accent', kind: 'block', w: 120, h: 64 },
  { id: 'claude',     label: 'Claude',     tone: 'peach',  kind: 'block', w: 96, h: 96 },
  { id: 'chatgpt',    label: 'ChatGPT',    tone: 'mint',   kind: 'block', w: 96, h: 96 },
  { id: 'figma',      label: 'Figma',      tone: 'violet', kind: 'block', w: 96, h: 96 },
  { id: 'midjourney', label: 'Midjourney', tone: 'slate',  kind: 'block', w: 96, h: 96 },
  { id: 'cursor',     label: 'Cursor',     tone: 'ink',    kind: 'block', w: 96, h: 96 },
  { id: 'vercel',     label: 'Vercel',     tone: 'indigo', kind: 'block', w: 96, h: 96 },
  { id: 'ball',       emoji: '🔮', kind: 'emoji', size: 68, w: 68, h: 68 },
  { id: 'sparkles',   emoji: '✨', kind: 'emoji', size: 72, w: 72, h: 72 },
];

function AIToolsCard({ onOpenModal }) {
  const [bodyState, setBodyState] = useState([]);
  const spaceRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup = null;

    (async () => {
      const Matter = (await import('matter-js')).default;
      if (cancelled || !spaceRef.current) return;

      const { Engine, World, Bodies, Body, Runner, Mouse, MouseConstraint } = Matter;
      const space = spaceRef.current;

      const waitForLayout = () =>
        new Promise((resolve) => {
          const check = () => {
            const r = space.getBoundingClientRect();
            if (r.width > 80 && r.height > 160) resolve(r);
            else requestAnimationFrame(check);
          };
          requestAnimationFrame(check);
        });
      const rect = await waitForLayout();
      if (cancelled) return;
      const W = rect.width;
      const H = rect.height;

      const engine = Engine.create({ gravity: { x: 0, y: 0.9 } });

      const wallOpts = { isStatic: true, restitution: 0.05, friction: 0.6 };
      const walls = [
        Bodies.rectangle(W / 2, H + 30, W + 200, 60, wallOpts),
        Bodies.rectangle(-30, H / 2, 60, H + 200, wallOpts),
        Bodies.rectangle(W + 30, H / 2, 60, H + 200, wallOpts),
      ];
      World.add(engine.world, walls);

      const bodies = DRAG_BLOCKS.map((b, i) => {
        const padX = b.w / 2 + 8;
        const usable = Math.max(1, W - padX * 2);
        // Alternate x positions so the two emojis don't stack on top of each other
        const xRatio =
          b.id === 'ball' ? 0.25 :
          b.id === 'sparkles' ? 0.8 :
          (i + 0.5) / DRAG_BLOCKS.length;
        const startX = padX + usable * xRatio;
        const startY = -80 - i * 110;
        const body = Bodies.rectangle(startX, startY, b.w, b.h, {
          chamfer: { radius: 18 },
          restitution: 0.18,
          friction: 0.5,
          frictionAir: 0.025,
          density: 0.0025,
          angle: ((Math.random() - 0.5) * Math.PI) / 4,
          label: b.id,
        });
        body.angularVelocity = (Math.random() - 0.5) * 0.04;
        return body;
      });
      World.add(engine.world, bodies);

      const mouse = Mouse.create(space);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.18,
          damping: 0.4,
          render: { visible: false },
        },
      });
      World.add(engine.world, mouseConstraint);

      let raf;
      const tick = () => {
        setBodyState(
          bodies.map((b) => ({ x: b.position.x, y: b.position.y, angle: b.angle })),
        );
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      const runner = Runner.create();
      Runner.run(runner, engine);

      const onResize = () => {
        const r = space.getBoundingClientRect();
        Body.setPosition(walls[0], { x: r.width / 2, y: r.height + 30 });
        Body.setPosition(walls[1], { x: -30, y: r.height / 2 });
        Body.setPosition(walls[2], { x: r.width + 30, y: r.height / 2 });
      };
      window.addEventListener('resize', onResize);

      cleanup = () => {
        cancelAnimationFrame(raf);
        Runner.stop(runner);
        Engine.clear(engine);
        World.clear(engine.world, false);
        window.removeEventListener('resize', onResize);
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      className={`${styles.card} ${styles.navCard} ${styles.aiCard} ${styles.entrance}`}
      style={{ '--delay': '440ms' }}
    >
      <div className={styles.aiToolsHeader}>
        <h3 className={styles.aiToolsTitle}>My AI Stack</h3>
        <button
          type="button"
          className={styles.aiToolsCta}
          onClick={() => onOpenModal('ai')}
        >
          See how I use them
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      </div>

      <div ref={spaceRef} className={styles.aiStackStage} aria-hidden="true">
        {DRAG_BLOCKS.map((b, i) => {
          const s = bodyState[i];
          const transform = s
            ? `translate3d(${Math.round(s.x - b.w / 2)}px, ${Math.round(s.y - b.h / 2)}px, 0) rotate(${s.angle.toFixed(4)}rad)`
            : 'translate3d(-400px, -400px, 0)';
          if (b.kind === 'emoji') {
            return (
              <span
                key={b.id}
                className={styles.aiStackEmoji}
                style={{
                  width: b.w,
                  height: b.h,
                  fontSize: b.size,
                  transform,
                }}
              >
                {b.emoji}
              </span>
            );
          }
          return (
            <span
              key={b.id}
              className={`${styles.aiStackBlock} ${styles[`aiStackTone_${b.tone}`]} ${b.id === 'drag' ? styles.aiStackBlockDrag : ''}`}
              style={{
                width: b.w,
                height: b.h,
                transform,
              }}
            >
              <span className={styles.aiStackBlockLabel}>{b.label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function AIStackCard() {
  const [activeId, setActiveId] = useState('claude');
  const activeTool = AI_TOOLS.find((t) => t.id === activeId) || AI_TOOLS[0];

  return (
    <div
      className={`${styles.card} ${styles.navCard} ${styles.aiCard} ${styles.entrance}`}
      style={{ '--delay': '440ms', '--ai-accent': activeTool.accent }}
    >
      <div className={styles.aiHeader}>
        <span className={styles.aiEyebrow}>My AI Stack</span>
        <div className={styles.aiToolRow}>
          <span className={styles.aiToolName}>{activeTool.name}</span>
          <span className={styles.aiToolRole}>{activeTool.role}</span>
        </div>
      </div>

      <div className={styles.aiFlow} key={activeTool.id}>
        {activeTool.flow.map((step, i) => (
          <div key={step.phase} className={`${styles.aiFlowStep} ${step.type === 'ai' ? styles.aiFlowStepAi : ''}`}>
            <div className={styles.aiFlowTrack}>
              <span
                className={styles.aiFlowDot}
                style={{ background: step.type === 'ai' ? activeTool.accent : 'var(--color-text-tertiary)' }}
              />
              {i < activeTool.flow.length - 1 && <span className={styles.aiFlowLine} />}
            </div>
            <div className={styles.aiFlowContent}>
              <div className={styles.aiFlowHeader}>
                <span className={styles.aiFlowPhase}>{step.phase}</span>
                <span className={`${styles.aiFlowBadge} ${step.type === 'ai' ? styles.aiFlowBadgeAi : ''}`}>
                  {step.type === 'ai' ? 'AI' : 'UX'}
                </span>
              </div>
              <span className={styles.aiFlowAction}>{step.action}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.aiDock}>
        {AI_TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={`${styles.aiDockIcon} ${tool.id === activeId ? styles.aiDockIconActive : ''}`}
            style={{ '--tool-accent': tool.accent }}
            onClick={() => setActiveId(tool.id)}
            aria-label={tool.name}
            aria-pressed={tool.id === activeId}
          >
            {tool.short}
          </button>
        ))}
      </div>
    </div>
  );
}

function CursorButton({ className, onClick, delay, label, children }) {
  const handlers = useCursorLabel(label);
  return (
    <button
      className={className}
      style={{ '--delay': delay }}
      onClick={onClick}
      {...handlers}
    >
      {children}
    </button>
  );
}

function CornerArrow() {
  return (
    <span className={styles.cornerArrow} aria-hidden="true">
      <span className={styles.cornerArrowText}>View</span>
      <span className={styles.cornerArrowIconWrap}>
        <svg className={styles.cornerArrowIconOut} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
        <svg className={styles.cornerArrowIconIn} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </span>
    </span>
  );
}

export default function Hero({ onOpenModal, onOpenProject }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  return (
    <section className={`${styles.bento} ${loaded ? styles.loaded : ''}`} aria-label="Homepage">

      {/* Row 1: Intro (large) | Photo | Connect */}
      <div className={`${styles.card} ${styles.introCard} ${styles.entrance}`} style={{ '--delay': '0ms' }}>
        <div className={styles.introCardGrain} aria-hidden="true" />
        <h1 className={styles.greeting}>
          <span className={`${styles.name} ${styles.nameReveal}`}>Macie Linne</span>
        </h1>
        <p className={`${styles.role} ${styles.textReveal}`} style={{ '--text-delay': '400ms' }}>product designer</p>
        <p className={`${styles.company} ${styles.textReveal}`} style={{ '--text-delay': '500ms' }}>Designing human-first, AI-powered experiences that help people make confident decisions.</p>
      </div>

      <PhotoCard />

      <div className={`${styles.linkedinWrapper} ${styles.entrance}`} style={{ '--delay': '140ms' }}>
      <a
        href="https://www.linkedin.com/in/macielinne/"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.card} ${styles.linkedinCard}`}
        aria-label="View LinkedIn profile"
      >
        <div className={styles.linkedinDefault}>
          <span className={styles.connectDot} aria-hidden="true" />
          <span className={styles.connectText}>Let's connect</span>
          <svg className={styles.connectArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
        <div className={styles.linkedinHover}>
          <div className={styles.linkedinHoverLeft}>
            <svg className={styles.linkedinIcon} width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className={styles.linkedinHandle}>@macielinne</span>
          </div>
          <span className={styles.openToWorkBadge}>Open to Work</span>
        </div>
      </a>
      </div>


      {/* Row 3-4: Project cards with custom cursor */}
      <ProjectCard
        wrapperClassName={styles.projectCard1}
        className={`${styles.card} ${styles.navCard} ${styles.projectFull}`}
        delay="240ms"
        impact="Replaced three disconnected internal tools with one unified platform"
        onClick={() => onOpenProject('flexomics')}
      >
        <img src="/flexomics-hero.svg" alt="Flexomics" className={styles.projectHeroImg} />
        <div className={styles.glassTags}>
          <span className={styles.glassTag}>0→1</span>
        </div>
        <div className={styles.fullContent}>
          <span className={styles.fullTitle}>From Three Fragmented Tools to One Research Platform</span>
        </div>
      </ProjectCard>

<ProjectCard
        wrapperClassName={styles.projectCard3}
        className={`${styles.card} ${styles.navCard} ${styles.projectFull}`}
        delay="320ms"
        impact="Closed a seed round with the POC, then shipped a 50-screen MVP in 13 weeks."
        onClick={() => onOpenProject('accio3d')}
      >
        <img src="/accio-hero.svg" alt="Accio3D" className={styles.projectHeroImg} />
        <div className={styles.glassTags}>
          <span className={styles.glassTag}>AI-Native</span>
        </div>
        <div className={styles.fullContent}>
          <span className={styles.fullTitle}>An AI-Powered Procurement Platform from POC to MVP</span>
        </div>
      </ProjectCard>

      {/* AI — mini tools card, opens AI modal */}
      <AIToolsCard onOpenModal={onOpenModal} />

    </section>
  );
}
