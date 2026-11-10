// Case-study page (/work/flexomics, /work/accio3d) — built from Figma
// "Work — Case study · Flexomics · Alt" (5383:8227) and "· Accio3D · Alt" (5406:7911).
// One component, two data files. Section types: pitch | break | milestone.
// Section types also include 'principles-band'. A pitch may carry a persona `sticker` ({ photo, label }).
// Pitch block types: p | quote | lead | h3 | note | cards | fork | media | compare | steps | lessons | personas | principles | principle.
// A pitch with `hook: true` is an unnumbered opener (custom waypoint/label/count, no title).
// A break may carry an `annotation` (ring, box, dotted path, labels) in image-pixel coordinates.
import { Fragment, useEffect, useRef } from 'react';
import { vt } from '../../site/motion.js';
import { IconArrowLeft, IconArrowRight, IconCheck, IconDna, IconFlag, IconMapPinFilled, IconMicroscope, IconX } from '@tabler/icons-react';
import SiteHeader from '../../site/SiteHeader.jsx';
import { Link } from '../../site/router.jsx';
import flexomics from './flexomics.js';
import accio3d from './accio3d.js';
import accelerate from './accelerate.js';
import Lightbox, { Zoomable } from './Lightbox.jsx';
import './case-study.css';

const STUDIES = { flexomics, accio3d, accelerate };
const CARD_ICONS = { microscope: IconMicroscope, dna: IconDna };
const pad2 = (n) => String(n).padStart(2, '0');

function Sticker({ tone = 'white', rotate = 0, className = '', style, children }) {
  return (
    <span className={`cs-sticker cs-sticker--${tone} ${className}`} style={{ '--cs-rot': `${rotate}deg`, ...style }}>
      {children}
    </span>
  );
}

function Shot({ image, className = '', eager = false, children }) {
  return (
    <div className={`cs-shot ${className}`}>
      {children}
      <img
        className="cs-shot__img"
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        style={{ '--cs-shot-scale': image.scale ?? 1 }}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
}

function Hero({ study, slug }) {
  return (
    <div className="cs-hero">
      <span className="cs-contour cs-contour--hero" aria-hidden="true" />
      <div className="cs-hero__body">
        <nav className="cs-crumbs" aria-label="Breadcrumb">
          {(() => {
            // opened from the home map → back to Home; otherwise (Work tab, direct link) → Work
            const home = typeof window !== 'undefined' && window.history.state?.origin === '/';
            return <Link to={home ? '/' : '/work'} className="cs-crumbs__back"><IconArrowLeft size={14} stroke={2} aria-hidden="true" />{home ? 'Home' : 'Work'}</Link>;
          })()}
          <span className="cs-crumbs__sep" aria-hidden="true">/</span>
          <span aria-current="page">{study.name}</span>
        </nav>
        <h1 className="cs-hero__title" style={{ '--cs-title-w': `${study.titleWidth}px`, '--cs-title-size': `${study.titleSize ?? 84}px`, '--cs-title-top': `${(study.titleTop ?? 186) - 140 - 18}px` }}>
          {study.title}
        </h1>
      </div>
      <div className="cs-hero__media" style={vt('shot', slug)}>
        <Shot image={study.hero.image} className="cs-shot--hero" eager />
        {study.hero.stickers.map((s) => (
          <Sticker key={s.label} tone={s.tone} rotate={s.rotate} className="cs-hero__sticker" style={{ '--cs-x': `${s.x}px`, '--cs-y': `${s.y}px` }}>
            {s.label}
          </Sticker>
        ))}
      </div>
    </div>
  );
}

/** Reading time: ~220 wpm over every visible string, plus ~10s per screenshot or recording. */
function readMinutes(study) {
  const words = [];
  let shots = 0;
  const READ = new Set(['text', 'title', 'caption', 'label', 'eyebrow', 'sticker']);
  const walk = (v, key) => {
    if (typeof v === 'string') { if (READ.has(key)) words.push(...v.split(/\s+/)); return; }
    if (Array.isArray(v)) { v.forEach((x) => walk(x, key === 'items' ? 'text' : key)); return; }
    if (v && typeof v === 'object') { if (v.src || v.video) shots += 1; Object.entries(v).forEach(([k, x]) => walk(x, k)); }
  };
  walk(study.sections);
  return Math.max(1, Math.round(words.filter(Boolean).length / 220 + shots / 6));
}

/** Thin bar pinned to the top of the viewport that fills as you read. */
function ReadingProgress() {
  const fill = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fill.current) fill.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return <div className="cs-progress" aria-hidden="true"><div ref={fill} className="cs-progress__fill" /></div>;
}

function MetaStrip({ items }) {
  return (
    <dl className="cs-meta" style={{ '--cs-meta-n': items.length }}>
      {items.map((m) => (
        <div key={m.label} className="cs-meta__item">
          <dt>{m.label}</dt>
          <dd>{m.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Cards({ cards, size, layout }) {
  return (
    <div className={`cs-cards${size === 'sm' ? ' cs-cards--sm' : ''}${size === 'img' ? ' cs-cards--img' : ''}${layout?.startsWith('rows') ? ' cs-cards--rows' : ''}${layout === 'rows-tall' ? ' cs-cards--tall' : ''}`}>
      {cards.map((c) => (
        <div key={c.title} className={`cs-card cs-card--${c.tone}`}>
          {c.image && (
            <Zoomable src={c.image.src} full={c.image.full} alt={c.image.alt} caption={c.image.caption ?? c.title} className="cs-card__shot">
              <img src={c.image.src} alt={c.image.alt} width={c.image.width} height={c.image.height} loading="lazy" decoding="async" />
            </Zoomable>
          )}
          <div className="cs-card__body">
            {c.eyebrow && <p className="cs-card__eyebrow">{c.eyebrow}</p>}
            {c.icon
              ? (() => { const I = CARD_ICONS[c.icon]; return <h3 className="cs-card__title cs-card__title--icon"><span className="cs-card__icon" aria-hidden="true"><I size={22} stroke={1.75} /></span>{c.title}</h3>; })()
              : <h3 className="cs-card__title">{c.title}</h3>}
            <p className="cs-card__text">{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Fork({ options }) {
  return (
    <div className="cs-fork">
      <svg className="cs-fork__paths" viewBox="0 0 774 130" preserveAspectRatio="none" aria-hidden="true">
        <path className="cs-fork__ahead" d="M387 58 C 330 66, 220 78, 193.5 130" />
        <path className="cs-fork__done" d="M387 0 V 42 C 387 70, 420 74, 500 84 C 556 91, 580 104, 580 130" />
      </svg>
      <span className="cs-fork__here">You are here</span>
      <ul className="cs-fork__options">
        {options.map((o) => (
          <li key={o.label} className={`cs-option${o.chosen ? ' cs-option--chosen' : ''}`}>
            <div className="cs-option__head">
              <p className="cs-option__label">{o.label}</p>
              {o.chosen
                ? <span className="cs-option__chip"><IconCheck size={11} stroke={2.5} aria-hidden="true" />Chosen</span>
                : <span className="cs-option__x"><IconX size={12} stroke={2} aria-hidden="true" /><span className="sr-only">Not chosen</span></span>}
            </div>
            <p className="cs-option__text">{o.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Screen recording: muted looping video that only plays while on screen.
 *  Reduced motion → poster frame with controls, nothing autoplays. */
function Recording({ block }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { v.controls = true; return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
    }, { rootMargin: '200px 0px' });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={block.video}
      poster={block.poster}
      width={block.width}
      height={block.height}
      muted
      loop
      playsInline
      preload="none"
      aria-label={block.alt}
    />
  );
}

function Media({ block }) {
  return (
    <figure className="cs-media">
      <div className="cs-media__frame" style={{ aspectRatio: `${block.width} / ${block.height}` }}>
        {block.video
          ? <Recording block={block} />
          : (
            <Zoomable src={block.src} full={block.full} alt={block.alt} caption={block.caption}>
              <img src={block.src} alt={block.alt} width={block.width} height={block.height} loading="lazy" decoding="async" />
            </Zoomable>
          )}
        {block.sticker && <Sticker tone="chartreuse" rotate={3} className="cs-media__sticker">{block.sticker}</Sticker>}
      </div>
      <figcaption className="cs-media__caption">{block.caption}</figcaption>
    </figure>
  );
}

/** Before / after pair of still screens; the "after" card gets the chartreuse treatment. */
function Compare({ items, wide }) {
  return (
    <div className={`cs-compare${wide ? ' cs-compare--wide' : ''}`}>
      {items.map((it) => (
        <figure key={it.tag} className={`cs-compare__item${it.after ? ' cs-compare__item--after' : ''}`}>
          <Zoomable src={it.src} full={it.full} alt={it.alt} caption={`${it.tag} · ${it.caption}`}>
            <img src={it.src} alt={it.alt} width={it.width} height={it.height} loading="lazy" decoding="async" />
          </Zoomable>
          <figcaption>
            <span className="cs-compare__tag">{it.tag}</span>
            <span className="cs-compare__caption">{it.caption}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Field note: a principle or something we heard, set in mono on a pale-green card. */
function Note({ label, text }) {
  return (
    <aside className="cs-note">
      <p className="cs-note__label">{label}</p>
      <p className="cs-note__text">{text}</p>
    </aside>
  );
}

/** Route-style stepper: numbered waypoints on a dotted line (mirrors a product's step tracker). */
function Steps({ items }) {
  return (
    <ol className="cs-steps" style={{ '--cs-steps': items.length }}>
      {items.map((t, i) => (
        <li key={t} className="cs-steps__item">
          <span className="cs-steps__dot" aria-hidden="true">{pad2(i + 1)}</span>
          <span className="cs-steps__label">{t}</span>
        </li>
      ))}
    </ol>
  );
}

function Lessons({ items }) {
  return (
    <ol className="cs-lessons">
      {items.map((text, i) => (
        <li key={i} className="cs-lesson">
          <span className="cs-lesson__n" aria-hidden="true">{pad2(i + 1)}</span>
          <p>{text}</p>
        </li>
      ))}
    </ol>
  );
}

function Personas({ people, compact, aspect }) {
  return (
    <ul className={`cs-personas${compact ? ' cs-personas--compact' : ''}`} style={{ '--cs-personas-n': people.length, '--cs-photo-ar': aspect }}>
      {people.map((p) => (
        <li key={p.name} className="cs-persona">
          <img className="cs-persona__photo" src={p.photo} alt="" loading="lazy" decoding="async" />
          <div className="cs-persona__id">
            <h4 className="cs-persona__name">{p.name}</h4>
            <p className="cs-persona__role">{p.role}</p>
            {p.side && <p className={`cs-persona__side${p.supplier ? ' cs-persona__side--alt' : ''}`}>{p.side}</p>}
          </div>
          <div className="cs-persona__group">
            <p className="cs-persona__label">Goal</p>
            <p className="cs-persona__goal">{p.goal}</p>
          </div>
          <div className="cs-persona__group">
            <p className="cs-persona__label">Key tasks</p>
            <ul className="cs-persona__chips">{p.tasks.map((d) => <li key={d}>{d}</li>)}</ul>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Polaroid of the persona a section is about, pinned to the pitch's top-right corner. */
function PersonaSticker({ sticker }) {
  return (
    <figure className="cs-polaroid" aria-hidden="true">
      <img src={sticker.photo} alt="" loading="lazy" decoding="async" />
      <figcaption>{sticker.label}</figcaption>
    </figure>
  );
}

function Principles({ items }) {
  return (
    <ol className="cs-principles">
      {items.map((it, i) => (
        <li key={i} className="cs-principle">
          <span className="cs-principle__n" aria-hidden="true">{pad2(i + 1)}</span>
          <p>{it.title ?? it}</p>
          {it.text && <p className="cs-principle__d">{it.text}</p>}
        </li>
      ))}
    </ol>
  );
}

function Block({ block }) {
  switch (block.type) {
    case 'p': return <p className="cs-p">{block.text}</p>;
    case 'quote': return <blockquote className="cs-quote"><p>{block.text}</p></blockquote>;
    case 'lead': return <p className="cs-lead">{block.text}</p>;
    case 'h3': return <h3 className="cs-subhead">{block.text}</h3>;
    case 'note': return <Note label={block.label} text={block.text} />;
    case 'compare': return <Compare items={block.items} wide={block.wide} />;
    case 'steps': return <Steps items={block.items} />;
    case 'cards': return <Cards cards={block.cards} size={block.size} layout={block.layout} />;
    case 'fork': return <Fork options={block.options} />;
    case 'media': return <Media block={block} />;
    case 'lessons': return <Lessons items={block.items} />;
    case 'personas': return <Personas people={block.people} compact={block.compact} aspect={block.aspect} />;
    case 'principles': return <Principles items={block.items} />;
    case 'principle': return (
      <p className="cs-principle-tag">
        <span className="cs-principle__n" aria-hidden="true">{block.n}</span>
        <span><span className="cs-principle-tag__k">Principle {block.n}</span> {block.text}</span>
      </p>
    );
    default: return null;
  }
}

/** Split a pitch's blocks into column runs and full-width (wide) blocks, keeping order. */
function segments(blocks) {
  const out = [{ blocks: [] }];
  for (const b of blocks) {
    if (b.wide) { out.push({ wide: b }, { blocks: [] }); } else out[out.length - 1].blocks.push(b);
  }
  return out.filter((seg, i) => seg.wide || seg.blocks.length || i === 0);
}

function Pitch({ section, n, total, last }) {
  const id = `cs-wp-${section.hook ? section.waypoint : pad2(n)}`;
  return (
    <section className={`cs-pitch${section.sticker ? ' cs-pitch--sticker' : ''}${section.hook ? ' cs-pitch--hook' : ''}${last ? ' cs-pitch--last' : ''}`} {...(section.title ? { 'aria-labelledby': id } : { 'aria-label': section.label })}>
      <div className="cs-pitch__rail" aria-hidden="true" />
      {last && <span className="cs-pitch__end" aria-hidden="true"><IconMapPinFilled size={24} /></span>}
      <header className="cs-pitch__aside">
        <span className="cs-waypoint" aria-hidden="true">{section.hook ? section.waypoint : pad2(n)}</span>
        <p className="cs-pitch__label">{section.label}</p>
        <p className="cs-pitch__count">{section.hook ? section.count : `Waypoint ${pad2(n)} / ${pad2(total)}`}</p>
      </header>
      {segments(section.blocks).map((seg, si) => (seg.wide
        ? <div key={si} className="cs-pitch__wide"><Block block={seg.wide} /></div>
        : (
          <div
            key={si}
            className="cs-pitch__body"
            style={{ '--cs-gap': section.gap ? `${section.gap}px` : undefined, '--cs-min-h': si === 0 && section.minHeight ? `${section.minHeight}px` : undefined }}
          >
            {si === 0 && section.sticker && <PersonaSticker sticker={section.sticker} />}
            {si === 0 && section.title && <h2 id={id} className="cs-pitch__title">{section.title}</h2>}
            {seg.blocks.map((b, i) => <Block key={i} block={b} />)}
          </div>
        )))}
    </section>
  );
}

/** Overlay drawn in the screenshot's own pixel space, so it stays glued to the UI as the shot scales. */
function Annotation({ a, image }) {
  const { width: W, height: H } = image;
  return (
    <div className="cs-annot" style={{ '--cs-shot-scale': image.scale ?? 1, aspectRatio: `${W} / ${H}` }} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <path className="cs-annot__route" d={a.path} />
        <circle className="cs-annot__line" cx={a.ring.cx} cy={a.ring.cy} r={a.ring.r} />
        <rect className="cs-annot__line" x={a.box.x} y={a.box.y} width={a.box.w} height={a.box.h} rx={a.box.r} />
        <circle className="cs-annot__dot" cx={a.dot.cx} cy={a.dot.cy} r="9" />
      </svg>
      {a.labels.map((l) => (
        <span key={l.text} className="cs-annot__label" style={{ left: `${(l.x / W) * 100}%`, top: `${(l.y / H) * 100}%` }}>{l.text}</span>
      ))}
    </div>
  );
}

function ImageBreak({ section }) {
  return (
    <div className="cs-break">
      <span className="cs-contour cs-contour--break" aria-hidden="true" />
      <Zoomable src={section.image.src} full={section.image.full} alt={section.image.alt} caption={section.sticker} className="cs-zoom--break">
        <Shot image={section.image} className="cs-shot--break">
          {section.annotation && <Annotation a={section.annotation} image={section.image} />}
        </Shot>
      </Zoomable>
      <Sticker tone="chartreuse" rotate={1} className="cs-break__sticker">{section.sticker}</Sticker>
    </div>
  );
}

function Milestone({ section }) {
  return (
    <section className="cs-milestone" aria-labelledby="cs-milestone-title">
      <span className="cs-contour cs-contour--milestone" aria-hidden="true" />
      <div className="cs-milestone__main">
        <span className="cs-milestone__icon" aria-hidden="true"><IconFlag size={22} stroke={2} /></span>
        <div>
          <p className="cs-milestone__eyebrow">Milestone</p>
          <h2 id="cs-milestone-title" className="cs-milestone__title">{section.title}</h2>
          <p className="cs-milestone__text">{section.text}</p>
        </div>
      </div>
      <ul className="cs-stats">
        {section.stats.map((s) => (
          <li key={s.label} className="cs-stat">
            <span className="cs-stat__value">{s.value}</span>
            <span className="cs-stat__label">{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Espresso band of glass cards: the principles every screen was held to. */
function PrinciplesBand({ section }) {
  return (
    <section className="cs-milestone cs-pband" aria-labelledby="cs-pband-title">
      <span className="cs-contour cs-contour--milestone" aria-hidden="true" />
      <div className="cs-pband__head">
        <p className="cs-milestone__eyebrow">{section.eyebrow ?? 'The principles'}</p>
        <h2 id="cs-pband-title" className="cs-milestone__title cs-pband__heading">{section.title}</h2>
        {section.text && <p className="cs-pband__sub">{section.text}</p>}
      </div>
      <ol className="cs-pband__list">
        {section.items.map((it, i) => (
          <li key={it.title} className="cs-pband__card">
            <div className="cs-pband__top">
              <span className="cs-principle__n" aria-hidden="true">{pad2(i + 1)}</span>
              <h3 className="cs-pband__title">{it.title}</h3>
            </div>
            <p className="cs-pband__text">{it.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function NextRoute({ next }) {
  return (
    <section className="cs-next" aria-labelledby="cs-next-title">
      <span className="cs-next__ghost" aria-hidden="true">{next.ghost}</span>
      <p className="cs-next__eyebrow">{next.eyebrow}</p>
      <h2 id="cs-next-title" className="cs-next__title">{next.title}</h2>
      <Link to={next.to} className="cs-next__cta">
        {next.cta}<IconArrowRight size={16} stroke={2} aria-hidden="true" />
      </Link>
    </section>
  );
}

export default function CaseStudy({ slug }) {
  const study = STUDIES[slug];
  if (!study) return null;
  const total = study.sections.filter((s) => s.type === 'pitch' && !s.hook).length;
  let n = 0;
  // Consecutive pitches share one "run" (48px in/out padding → 96px between bands).
  const groups = [];
  for (const s of study.sections) {
    const last = groups[groups.length - 1];
    if (s.type === 'pitch' && last?.type === 'run') last.items.push(s);
    else groups.push(s.type === 'pitch' ? { type: 'run', items: [s] } : s);
  }
  return (
    <div className="cs" data-study={study.slug} data-hero={study.heroTone ?? 'sky'}>
      <ReadingProgress />
      <div className="cs-top"><SiteHeader /></div>
      <main className="cs-main">
        <Hero study={study} slug={slug} />
        <MetaStrip items={[{ label: 'Read time', value: `${readMinutes(study)} min` }, ...study.meta]} />
        {groups.map((g, i) => (
          <Fragment key={i}>
            {g.type === 'run' && (
              <div className="cs-run">
                {g.items.map((s) => { if (!s.hook) n += 1; return <Pitch key={s.title ?? s.label} section={s} n={n} total={total} last={!s.hook && n === total} />; })}
              </div>
            )}
            {g.type === 'break' && <ImageBreak section={g} />}
            {g.type === 'milestone' && <Milestone section={g} />}
            {g.type === 'principles-band' && <PrinciplesBand section={g} />}
          </Fragment>
        ))}
        <NextRoute next={study.next} />
      </main>
      <Lightbox />
    </div>
  );
}
