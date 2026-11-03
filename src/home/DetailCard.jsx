import { useEffect, useState } from 'react';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { STOP_CONTENT, LINKS } from './stops.js';
import { vt } from '../site/motion.js';

function ContourMotif() {
  // faint wavy contour lines behind the art (route motif)
  return (
    <svg className="card__art-contours" viewBox="0 0 388 200" preserveAspectRatio="none" aria-hidden="true">
      {[150, 170, 190].map((y, i) => (
        <path key={y} d={`M-10 ${y} C 60 ${y - 14}, 120 ${y + 10}, 200 ${y - 6} S 340 ${y + 8}, 400 ${y - 4}`}
          fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={i === 1 ? 2 : 1.2} />
      ))}
    </svg>
  );
}

function Art({ art, title, slug }) {
  return (
    <div className="card__art" data-kind={art.kind} style={art.kind === 'image' ? vt('shot', slug) : undefined}>
      {art.kind === 'image' && <img className="card__art-img" src={art.src} alt={`${title} product UI`} />}
      {art.kind === 'photo' && (
        <>
          <img className="card__art-photo" src={art.src} alt="Macie on a summit" />
          <ContourMotif />
        </>
      )}
      {art.kind === 'welcome' && (
        <div className="card__art-welcome">
          <ContourMotif />
          <span className="emoji" role="img" aria-label="cowboy hat face">🤠</span>
          <span className="howdy">Howdy, I'm Macie.</span>
        </div>
      )}
      {art.kind === 'image' && <ContourMotif />}
      {art.stickerTl && <span className="sticker sticker--chartreuse sticker--tilt-l card__art-sticker-tl">{art.stickerTl}</span>}
      {art.stickerBr && <span className="sticker sticker--tilt-r card__art-sticker-br">{art.stickerBr}</span>}
    </div>
  );
}

/** "Stop 01" / "Trailhead" / "Summit" — the first half of the you-are-here line. */
function stopLabel(stop) {
  if (stop.n) return `Stop ${stop.n}`;
  return stop.id === 'trailhead' ? 'Trailhead' : 'Summit';
}

/**
 * Card hierarchy, top to bottom:
 *  1. where you are  — you-are-here bar: stop · place · elevation, route progress, pager
 *  2. the project    — name + tag, the headline (dominant), role/dates as quiet meta
 *  3. the impact     — divider, scannable stats, then the sentence at reading size
 *  4. what to do     — one primary action, a quieter "next" link
 */
export function CardBody({ stop, index, total, onStep, compact = false }) {
  const c = STOP_CONTENT[stop.id];
  const cta = c.cta;
  const ctaInner = <>{cta.label}<IconArrowRight size={compact ? 18 : 16} stroke={2.2} aria-hidden="true" /></>;
  const ctaEl = cta.href
    ? <a className={compact ? 'm-cta' : 'card__cta'} href={cta.href}>{ctaInner}</a>
    : <button type="button" className={compact ? 'm-cta' : 'card__cta'} onClick={() => onStep(1)}>{ctaInner}</button>;

  return (
    <>
      {!compact && (
        <div className="card__here">
          <div className="card__where">
            <span className="card__here-label"><i className="card__here-dot" aria-hidden="true" />You are here</span>
            <span className="card__here-place">
              <b>{stopLabel(stop)}</b>
              <span aria-hidden="true"> · </span>
              {/* "Summit · 14,259 ft" already starts with the label — don't say it twice */}
              {stop.sub.startsWith(stopLabel(stop)) ? stop.sub.slice(stopLabel(stop).length).replace(/^\s*·\s*/, '') : stop.sub}
            </span>
          </div>
          <div className="card__pager">
            <span className="card__progress" role="img" aria-label={`Stop ${index + 1} of ${total}`}>
              {Array.from({ length: total }, (_, i) => (
                <i key={i} className={i < index ? 'is-done' : i === index ? 'is-here' : ''} />
              ))}
            </span>
            <button type="button" className="card__pager-btn" onClick={() => onStep(-1)} disabled={index === 0} aria-label="Previous stop"><IconArrowLeft size={15} stroke={2.2} /></button>
            <button type="button" className="card__pager-btn" onClick={() => onStep(1)} disabled={index === total - 1} aria-label="Next stop"><IconArrowRight size={15} stroke={2.2} /></button>
          </div>
        </div>
      )}
      <Art
        // trailhead/summit stickers name the place on the current theme's route
        art={stop.n ? c.art : { ...c.art, stickerBr: stop.sub.toUpperCase() }}
        title={c.title}
        slug={stop.id}
      />
      <div className="card__body">
        <header className="card__project">
          <p className="card__name">
            <span>{c.title}</span>
            {c.tag && <span className="card__tag">{c.tag}</span>}
          </p>
          <h2 className="card__headline">{c.headline}</h2>
        </header>

        {c.impact && (
          <section className="card__impact" aria-label="Impact">
            <span className="eyebrow card__eyebrow">Impact</span>
            <dl className="card__stats">
              {c.impact.stats.map((st) => (
                <div key={st.label} className="card__stat"><dt>{st.label}</dt><dd>{st.value}</dd></div>
              ))}
            </dl>
            <p className="card__impact-text">{c.impact.text}</p>
          </section>
        )}
        {c.steps && (
          <section className="card__impact" aria-label={c.steps.label}>
            <span className="eyebrow card__eyebrow">{c.steps.label}</span>
            <ol className="card__steps">
              {c.steps.items.map((t, i) => <li key={t}><span aria-hidden="true">{i + 1}</span>{t}</li>)}
            </ol>
          </section>
        )}
        {c.list && (
          <section className="card__impact" aria-label={c.list.label}>
            <span className="eyebrow card__eyebrow">{c.list.label}</span>
            <ul className="card__list">
              {c.list.items.map((t) => <li key={t}><IconCheck size={14} stroke={3} aria-hidden="true" />{t}</li>)}
            </ul>
          </section>
        )}

        <div className="card__foot">
          {ctaEl}
          {!compact && c.next === 'links' && (
            <span className="card__next"><a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={LINKS.resume}>Resume ↓</a></span>
          )}
          {!compact && c.next && c.next !== 'links' && (
            <button type="button" className="card__next card__next--step" onClick={() => onStep(1)}>
              <span>Next</span> {c.next}<IconArrowRight size={14} stroke={2.2} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/** Desktop detail card: out 360 ms, in 640 ms with a staggered content cascade (motion.css). */
export default function DetailCard({ stops, activeIndex, onSelect, children }) {
  const [shown, setShown] = useState(activeIndex);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (activeIndex === shown) return;
    setLeaving(true);
    const t = setTimeout(() => { setShown(activeIndex); setLeaving(false); }, 360); // = --ml-dur-card-out
    return () => clearTimeout(t);
  }, [activeIndex, shown]);

  const onStep = (d) => onSelect(Math.max(0, Math.min(stops.length - 1, activeIndex + d)));
  const stop = stops[shown];
  return (
    <div className="card-slot">
      <article key={stop.id} className={`card${leaving ? ' card--out' : ''}`} aria-live="polite">
        <CardBody stop={stop} index={shown} total={stops.length} onStep={onStep} />
      </article>
      {children}
    </div>
  );
}
