import { useEffect, useState } from 'react';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { STOP_CONTENT, LINKS } from './stops.js';

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

function Art({ art, title }) {
  return (
    <div className="card__art" data-kind={art.kind}>
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

export function CardBody({ stop, index, total, onStep, compact = false }) {
  const c = STOP_CONTENT[stop.id];
  const cta = c.cta;
  const ctaInner = (
    <>
      {cta.label}
      {compact ? <IconArrowRight size={18} stroke={2} /> : <span className="card__cta-arrow"><IconArrowRight size={15} stroke={2} /></span>}
    </>
  );
  const ctaEl = cta.href
    ? <a className={compact ? 'm-cta' : 'card__cta'} href={cta.href}>{ctaInner}</a>
    : <button type="button" className={compact ? 'm-cta' : 'card__cta'} onClick={() => onStep(1)}>{ctaInner}</button>;

  return (
    <>
      {!compact && (
        <div className="card__head">
          <div className="card__id">
            <span className="card__badge">{c.badge}</span>
            <span className="card__title">{c.title}</span>
          </div>
          <div className="card__pager">
            <button type="button" className="card__pager-btn" onClick={() => onStep(-1)} disabled={index === 0} aria-label="Previous stop"><IconArrowLeft size={15} stroke={2.2} /></button>
            <button type="button" className="card__pager-btn" onClick={() => onStep(1)} disabled={index === total - 1} aria-label="Next stop"><IconArrowRight size={15} stroke={2.2} /></button>
            <span className="card__count">{index + 1} / {total}</span>
          </div>
        </div>
      )}
      <Art art={c.art} title={c.title} />
      <div className="card__body">
        <div>
          <h2 className="card__headline">{c.headline}</h2>
          {c.meta && (
            <div className="card__meta">
              <b>{c.meta[0]}</b><i aria-hidden="true" /><span>{c.meta[1]}</span>
            </div>
          )}
        </div>
        {c.block && (
          <div className="card__block">
            <span className="eyebrow">{c.block.label}</span>
            <p className="card__block-text">{c.block.text}</p>
          </div>
        )}
        {c.list && (
          <div className="card__block">
            <span className="eyebrow">{c.list.label}</span>
            <ul className="card__list">
              {c.list.items.map((t) => <li key={t}><IconCheck size={20} stroke={3} />{t}</li>)}
            </ul>
          </div>
        )}
        <div className="card__foot">
          {ctaEl}
          {!compact && (c.next === 'links'
            ? <span className="card__next"><a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> · <a href={LINKS.resume}>Resume ↓</a></span>
            : <span className="card__next">{c.next}</span>)}
        </div>
      </div>
    </>
  );
}

/** Desktop detail card with the Figma out/in transition (200 ms out, 300 ms in). */
export default function DetailCard({ stops, activeIndex, onSelect, children }) {
  const [shown, setShown] = useState(activeIndex);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (activeIndex === shown) return;
    setLeaving(true);
    const t = setTimeout(() => { setShown(activeIndex); setLeaving(false); }, 200);
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
