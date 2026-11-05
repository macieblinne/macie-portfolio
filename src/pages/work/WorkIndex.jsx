// Work index (/work). Built from Figma "Work — Index · Alt" (5382:7911, summer) and
// "Work — Index · Winter" (5406:13834). Three full-bleed project bands over contour lines.
import { IconArrowRight, IconLock } from '@tabler/icons-react';
import { vt } from '../../site/motion.js';
import SiteHeader from '../../site/SiteHeader.jsx';
import SiteFooter from '../../site/SiteFooter.jsx';
import { Link } from '../../site/router.jsx';
import './work.css';

const PROJECTS = [
  {
    id: '01',
    tone: 'sky',
    side: 'left',
    client: 'Flexomics',
    headline: 'Hours of cross-referencing, now two clicks',
    meta: ['Lead product designer', '12 weeks · MVP', '0→1 platform'],
    impact: 'Turned three disconnected research tools into one platform, stable at 1M+ cells and shipped in 12 weeks.',
    route: 'The Keyhole · 13,160 ft',
    sticker: 'Life science',
    to: '/work/flexomics',
    shot: { src: '/flexomics-hero.svg', w: 1711, h: 1106, alt: 'Flexomics imaging workspace: a well-plate scan with the UMAP and pinned-wells panel' },
  },
  {
    id: '02',
    tone: 'cocoa',
    side: 'right',
    client: 'Accio3D',
    headline: 'An AI marketplace for parts nobody makes anymore',
    meta: ['Senior product designer', '2 phases · POC → MVP', 'AI product design'],
    impact: 'Designed the POC the CEO used to close a seed round, then a lean MVP to order a part end to end.',
    route: 'The Trough · 13,500 ft',
    sticker: 'AI / Procurement',
    to: '/work/accio3d',
    shot: { src: '/accio-hero.svg', w: 1742, h: 1305, alt: 'Accio3D dashboard: AI assistant prompts, global suppliers map and recent notifications' },
  },
  {
    id: '03',
    tone: 'pine',
    side: 'left',
    client: 'Accelerate Diagnostics',
    headline: 'One interface for fifty tests running at once',
    meta: ['Product designer', 'Clinical diagnostics', '72-view system'],
    impact: 'Mapped a 72-view system for a next-generation lab instrument and folded its separate service app into the same product.',
    route: 'The Narrows · 13,900 ft',
    sticker: 'Clinical lab',
    to: '/work/accelerate',
    shot: { src: '/case-study/accelerate/dashboard.webp', w: 1200, h: 675, alt: 'Accelerate operating dashboard: instrument modules drawn as hardware with bays lit by run state' },
  },
];

function Meta({ items }) {
  return (
    <p className="wk-meta">
      {items.map((m, i) => (
        <span key={m} className="wk-meta__item">
          {i > 0 && <i className="wk-meta__dot" aria-hidden="true" />}
          {m}
        </span>
      ))}
    </p>
  );
}

function Band({ p }) {
  const headingId = `wk-band-${p.id}`;
  return (
    <section className={`wk-band wk-band--${p.tone} wk-band--${p.side}`} aria-labelledby={headingId}>
      <div className="wk-band__contours" aria-hidden="true" style={{ '--wk-contour': `url(/work/contour-${p.id}.png)` }} />
      <span className="wk-band__ghost" aria-hidden="true">{p.id}</span>

      <div className="wk-band__inner">
        <div className="wk-route" aria-hidden="true">
          <span className="wk-route__label">{p.route}</span>
          <span className="wk-route__dot" />
        </div>

        <div className="wk-band__media">
          {p.soon ? (
            <div className="wk-shot wk-shot--placeholder">
              <IconLock className="wk-shot__lock" size={40} stroke={1.75} aria-hidden="true" />
              <span className="wk-shot__status">In progress</span>
            </div>
          ) : (
            <>
              <Link to={p.to} className="wk-shot" tabIndex={-1} aria-hidden="true" style={vt('shot', p.to.split('/').pop())}>
                <img src={p.shot.src} width={p.shot.w} height={p.shot.h} alt="" loading={p.id === '01' ? 'eager' : 'lazy'} decoding="async" />
              </Link>
              <span className="sticker sticker--chartreuse wk-sticker">{p.sticker}</span>
            </>
          )}
        </div>

        <div className="wk-band__copy">
          <div className="wk-client">
            <span className="wk-client__num">{p.id}</span>
            <span className="wk-client__name">{p.client}</span>
          </div>
          <h2 id={headingId} className="wk-headline">{p.headline}</h2>
          <Meta items={p.meta} />
          <div className="wk-impact">
            <span className="wk-impact__label">Impact</span>
            <p className="wk-impact__text">{p.impact}</p>
          </div>
          {p.soon ? (
            <span className="wk-soon">
              <IconLock size={14} stroke={2} aria-hidden="true" />
              Case study coming soon
            </span>
          ) : (
            <Link to={p.to} className="wk-cta" aria-label={`Read the case study: ${p.client}`}>
              Read the case study
              <IconArrowRight size={16} stroke={2} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default function WorkIndex() {
  return (
    <div className="wk-page">
      <SiteHeader />
      <main className="page wk-main">
        <h1 className="wk-title">
          <span className="wk-title__line">Selected</span>
          <span className="wk-title__line wk-title__accent">work</span>
        </h1>
        {PROJECTS.map((p) => <Band key={p.id} p={p} />)}
      </main>
      <SiteFooter />
    </div>
  );
}
