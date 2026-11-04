// About — "Basecamp". Figma: "About — Basecamp" (5357:6616) / "· Winter" (5377:7103).
// Theme differences are handled in about.css via [data-theme="winter"]; the only
// content that changes per theme is the contour badge (Longs Peak ↔ Mary Jane).
import { useEffect, useRef, useState } from 'react';
import { IconArrowRight, IconAward, IconCheck, IconCompass, IconCopy, IconDownload, IconExternalLink, IconFlag, IconMountain, IconNotes, IconSparkles, IconTent, IconUser } from '@tabler/icons-react';
import SiteHeader from '../../site/SiteHeader.jsx';
import SiteFooter from '../../site/SiteFooter.jsx';
import { useSite, LINKS } from '../../site/site.jsx';
import './about.css';

const EMAIL = 'macieblinne@gmail.com'; // as written in the Figma frame

const VALUES = [
  { n: '01', title: 'Clarity', body: "Simple solutions, even when the problem isn't." },
  { n: '02', title: 'Tradeoffs', body: 'Balancing user needs, business goals, and product reality.' },
  { n: '03', title: 'Transparency', body: "Users should always know what's happening and why. Design should earn trust." },
  { n: '04', title: 'Systems', body: 'Every design decision has a ripple effect.' },
];

const AI_TOOLS = [
  ['Claude', 'ChatGPT', 'Figma'],
  ['Cursor', 'Vercel'],
];

// Company patches: rendered from Figma at 2× (incl. die-cut edge, tilt and shadow).
// x / y / w / h are the render bounds in the 1344 × 380 "Company stickers" frame.
const BADGES = [
  { id: 'flexomics', name: 'Flexomics', kind: 'Life science', x: 159.5, y: 6, w: 197, h: 222.5 },
  { id: 'aetna', name: 'Aetna', kind: 'Healthcare', x: 321.5, y: 12, w: 207, h: 209 },
  { id: 'roche', name: 'Roche', kind: 'Life science', x: 491.1, y: 15, w: 198, h: 198 },
  { id: 'accelerate', name: 'Accelerate Dx', kind: 'Diagnostics', x: 651.4, y: 1.5, w: 202.5, h: 225 },
  { id: 'akoya', name: 'Akoya', kind: 'Biosciences', x: 814, y: 9.5, w: 201.5, h: 201.5 },
  { id: 'blueowl', name: 'Blue Owl', kind: 'Finance', x: 976.3, y: 8.4, w: 202, h: 205 },
  { id: 'accio3d', name: 'Accio3D', kind: 'AI · Procurement', x: 332.6, y: 196.5, w: 214, h: 195 },
  { id: 'iqvia', name: 'iQVIA', kind: 'Clinical trials', x: 509.1, y: 197, w: 199, h: 194.5 },
  { id: 'zeiss', name: 'ZEISS', kind: 'Life science', x: 673.6, y: 214.9, w: 198, h: 158.5 },
  { id: 'rba', name: 'RBA', kind: 'Supply chain', x: 832.1, y: 190.6, w: 176, h: 204 },
];
// Badges keep their Figma layout, re-anchored to a tighter frame so the wall sits beside the quote.
const STICKERS_DX = 159.5 - 24;
const STICKERS_W = 1344 - 2 * STICKERS_DX;
const STICKERS_H = 380;
const pct = (v, of) => `${((v / of) * 100).toFixed(3)}%`;

const PLAN = {
  summer: { src: '/about/plan-longs-peak.png', label: 'LONGS PEAK · 14,259 FT', alt: 'Topographic plan of Longs Peak' },
  winter: { src: '/about/plan-mary-jane.png', label: 'MARY JANE · 12,060 FT', alt: 'Topographic plan of Mary Jane' },
};

function SectionLabel({ icon, num, children, id }) {
  return (
    <h2 className="ab-label" id={id}>
      <span className="ab-label__disc" aria-hidden="true">{num ? <span className="ab-label__num">{num}</span> : icon}</span>
      <span>{children}</span>
    </h2>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Fallback for browsers without async clipboard access
      const ta = document.createElement('textarea');
      ta.value = EMAIL; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* noop */ }
      ta.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="ab-email">
      <a className="ab-email__addr" href={`mailto:${EMAIL}`}>{EMAIL}</a>
      <button type="button" className="ab-email__copy" onClick={copy} aria-label={copied ? 'Email address copied' : 'Copy email address'}>
        {copied ? <IconCheck size={12} stroke={2.4} aria-hidden="true" /> : <IconCopy size={12} stroke={2} aria-hidden="true" />}
        <span aria-hidden="true">{copied ? 'Copied' : 'Copy'}</span>
      </button>
      <span className="sr-only" aria-live="polite">{copied ? 'Email address copied to clipboard' : ''}</span>
    </div>
  );
}

export default function About() {
  const { theme, openNotes } = useSite();
  const plan = PLAN[theme === 'winter' ? 'winter' : 'summer'];

  return (
    <div className="ab-page">
      <SiteHeader />
      <main className="page ab">
        {/* ---- Hero ------------------------------------------------------ */}
        <section className="ab-hero" aria-labelledby="ab-title">
          <div className="ab-hero__text">
            <p className="ab-hero__meta ab-hero__meta--top">
              <span>🏔️ Boulder, Colorado</span>
              <span className="ab-hero__dot" aria-hidden="true">·</span>
              <span>40°00′54″ N&nbsp;&nbsp;105°16′14″ W</span>
            </p>
            <div className="ab-hero__titlerow">
              <h1 className="ab-hero__title" id="ab-title">About</h1>
              <a className="sticker sticker--chartreuse sticker--tilt-r sticker--link ab-talk" href={LINKS.email}>Let’s talk ↗</a>
            </div>
            <p className="ab-hero__lede">Whether I'm on a 14,000 ft summit or 14 px deep in Figma, I'm reachable from both.</p>
          </div>

          <div className="ab-hero__art">
            <figure className="ab-photo">
              <img className="ab-photo__img" src="/about/husky-appa.jpg" width="720" height="900" alt="Macie's husky Appa bounding along a mountain creek beside a hiker" />
              <figcaption className="ab-photo__cap">My husky (appa) &amp; I</figcaption>
            </figure>
            <div className="ab-plan">
              <img className="ab-plan__img" src={plan.src} width="529" height="530" alt={plan.alt} />
              <p className="ab-plan__label">{plan.label}</p>
            </div>
            <span className="sticker sticker--chartreuse ab-howdy" aria-hidden="true">🤠 Howdy</span>
          </div>
        </section>

        {/* ---- Who I am -------------------------------------------------- */}
        <section className="ab-section" aria-labelledby="ab-who">
          <SectionLabel id="ab-who" icon={<IconUser size={13} stroke={2} />}>Who I am</SectionLabel>
          <div className="ab-card ab-who">
            <p className="ab-who__lead">I'm a Senior Product Designer with 7+ years leading 0→1 design across biotech, finance, manufacturing, and enterprise.</p>
            <p className="ab-who__body">My favorite projects are the ones where I have to learn an entire field before I can design a single screen. So far that’s been single-cell biology, private credit, industrial 3D printing, and more. They all turned out to have the same problem. Way too much information and one very busy person who just needs the right piece of it. Finding that piece is my whole job.</p>
            <div className="ab-who__actions">
              <a className="ab-btn ab-btn--dark" href={LINKS.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <IconExternalLink size={15} stroke={2} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a className="ab-btn ab-btn--outline" href={LINKS.resume} target="_blank" rel="noreferrer">
                Resume <IconDownload size={15} stroke={2} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* ---- Design values -------------------------------------------- */}
        <section className="ab-section" aria-labelledby="ab-values">
          <SectionLabel id="ab-values" icon={<IconCompass size={12} stroke={2} />}>Design values</SectionLabel>
          <ol className="ab-values">
            {VALUES.map((v) => (
              <li key={v.n} className={`ab-card ab-value ab-value--${v.n}`}>
                <span className="ab-value__num" aria-hidden="true">{v.n}</span>
                <h3 className="ab-value__title">{v.title}</h3>
                <p className="ab-value__body">{v.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---- Basecamp log --------------------------------------------- */}
        <section className="ab-section" aria-labelledby="ab-log">
          <SectionLabel id="ab-log" icon={<IconMountain size={11} stroke={2} />}>Beyond the pixels</SectionLabel>
          <div className="ab-log">
            <div className="ab-card ab-log__card">
              <h3 className="ab-log__title">When I'm not designing, I'm usually in the mountains.</h3>
              <p className="ab-log__body">Most weekends I'm trail running, snowboarding or backpacking Colorado's high country, usually with my husky, who has stronger opinions than most stakeholders. It's where I think most clearly.</p>
              <p className="ab-log__body">I mentor junior designers when I can, because that kind of support made a big difference for me early on.</p>
            </div>
            <figure className="ab-kili">
              <img className="ab-kili__img" src="/about/kilimanjaro.jpg" width="1201" height="1600" loading="lazy" alt="Sunrise over a sea of clouds from the snowy summit of Mt. Kilimanjaro" />
              <span className="sticker sticker--chartreuse sticker--tilt-l ab-kili__sticker">💍 Ask me about it</span>
              <figcaption className="ab-kili__plate">
                <span className="ab-kili__title">I got married at the summit of Mt.&nbsp;Kilimanjaro.</span>
                <span className="ab-kili__sub">19,341 ft · yes, really</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---- Field notes (opens the AI drawer) ------------------------ */}
        <section className="ab-section" aria-labelledby="ab-notes">
          <SectionLabel id="ab-notes" icon={<IconSparkles size={12} stroke={2} />}>How I Use AI</SectionLabel>
          <div className="ab-notes">
            <div className="ab-notes__main">
              <h3 className="ab-notes__title"><IconSparkles className="ab-notes__spark" size={28} stroke={1.75} aria-hidden="true" />How I Use AI</h3>
              <p className="ab-notes__body"><span className="ab-notes__prompt" aria-hidden="true">›</span>Notes on how AI shows up in my process and my work<span className="ab-notes__caret" aria-hidden="true" /></p>
              <button type="button" className="ab-btn ab-btn--chartreuse ab-notes__cta" onClick={openNotes} aria-haspopup="dialog">
                Read my notes <IconArrowRight size={16} stroke={2} aria-hidden="true" />
              </button>
            </div>
            <ul className="ab-tools" aria-label="Tools">
              {AI_TOOLS.map((row, i) => (
                <li key={i} className="ab-tools__row">
                  {row.map((t) => <span key={t} className={`ab-tool ab-tool--${t.toLowerCase()}`}>{t}</span>)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- Companies ------------------------------------------------- */}
        <section className="ab-section" aria-labelledby="ab-companies">
          <SectionLabel id="ab-companies" icon={<IconAward size={11} stroke={2} />}>Some companies I'm lucky to work with</SectionLabel>
          <div className="ab-companies">
          <figure className="ab-quote">
            <span className="ab-quote__mark" aria-hidden="true">“</span>
            <blockquote className="ab-quote__text">
              <p>I have had the rare privilege of watching Macie grow from an intern into one of the most well-rounded senior designers I have worked with in over 15 years in the field. I can say without hesitation that she is the designer I trust most when the stakes are highest.</p>
            </blockquote>
            <figcaption className="ab-quote__by">Jade · Former Manager</figcaption>
          </figure>
          <div className="ab-stickers">
            <ul className="ab-stickers__set">
              {BADGES.map((b) => (
                <li
                  key={b.id}
                  className="ab-badge"
                  style={{ '--x': pct(b.x - STICKERS_DX, STICKERS_W), '--y': pct(b.y, STICKERS_H), '--w': pct(b.w, STICKERS_W), '--wpx': b.w }}
                >
                  <img src={`/about/badge-${b.id}.png`} width={b.w * 2} height={b.h * 2} loading="lazy" alt={`${b.name} — ${b.kind}`} />
                </li>
              ))}
            </ul>
          </div>
          </div>
        </section>

        {/* ---- Summit register ------------------------------------------ */}
        <section className="ab-section ab-section--last" aria-labelledby="ab-summit">
          <SectionLabel id="ab-summit" icon={<IconFlag size={11} stroke={2} />}>Summit register · 14,259 ft</SectionLabel>
          <div className="ab-summit">
            <div className="ab-summit__left">
              <span className="ab-summit__flag" aria-hidden="true"><IconFlag size={20} stroke={1.8} /></span>
              <p className="ab-summit__title">Thank you so much for stopping by.</p>
            </div>
            <div className="ab-summit__right">
              <p className="ab-summit__text">I'd love to connect — whether it's to chat about your pain points, a question, or the outdoors. Shoot me an email at:</p>
              <div className="ab-summit__row">
                <CopyEmail />
                <a className="ab-summit__link" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
                <a className="ab-summit__link" href={LINKS.resume} target="_blank" rel="noreferrer">Resume</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
