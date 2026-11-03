import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { STOP_CONTENT, LINKS } from './stops.js';
import { vt } from '../site/motion.js';

/** Image-led art: a clean full-bleed picture (or the ice-blue welcome panel) with at most two stickers. */
function Art({ art, title, slug }) {
  return (
    <div className="card__art" data-kind={art.kind} style={art.kind === 'image' ? vt('shot', slug) : undefined}>
      {art.kind === 'image' && <img className="card__art-img" src={art.src} alt={`${title} product UI`} />}
      {art.kind === 'photo' && <img className="card__art-img card__art-img--photo" src={art.src} alt="Macie on a hike" />}
      {art.kind === 'welcome' && <p className="card__howdy">{art.title}</p>}
      {(art.sticker || art.stickerTl) && <span className="sticker sticker--chartreuse sticker--tilt-l card__art-sticker-tl">{art.sticker || art.stickerTl}</span>}
      {art.stickerBr && <span className="sticker sticker--tilt-r card__art-sticker-br">{art.stickerBr}</span>}
      {art.stickerTr && <span className="sticker sticker--tilt-r card__art-sticker-tr">{art.stickerTr}</span>}
    </div>
  );
}

/** "Stop 01" / "Trailhead" / "Summit" — the first half of the you-are-here line. */
function stopLabel(stop) {
  if (stop.n) return `Stop ${stop.n}`;
  return stop.id === 'trailhead' ? 'Trailhead' : 'Summit';
}

/**
 * Image-led card (Figma "Detail card · C · Image-led"):
 * art → you-are-here line → headline → impact / sentence → one button + arrows.
 */
export function CardBody({ stop, index, total, onStep, compact = false, badge }) {
  const c = STOP_CONTENT[stop.id];
  const cta = c.cta;
  const label = stopLabel(stop);
  const place = stop.sub.startsWith(label) ? stop.sub.slice(label.length).replace(/^\s*·\s*/, '') : stop.sub;
  const ctaInner = <>{cta.label}<IconArrowRight size={16} stroke={2.2} aria-hidden="true" /></>;
  const ctaEl = cta.href
    ? <a className={compact ? 'm-cta' : 'card__cta'} href={cta.href}>{ctaInner}</a>
    : <button type="button" className={compact ? 'm-cta' : 'card__cta'} onClick={() => onStep(1)}>{ctaInner}</button>;
  return (
    <>
      <Art
        // trailhead/summit stickers name the place on the current theme's route
        art={stop.id === 'trailhead' && badge ? { ...c.art, stickerTr: badge } : stop.n || !c.art.stickerBr ? c.art : { ...c.art, stickerBr: stop.sub }}
        title={c.title}
        slug={stop.id}
      />
      <div className="card__body">
        <p className="card__here-line"><i aria-hidden="true" /><span className="sr-only">You are here: </span>{label} · {place}</p>
        <h2 className="card__headline">{c.headline}</h2>
        {c.impact && (
          <div className="card__impact">
            <span className="card__label">Impact</span>
            <p className="card__text">{c.impact}</p>
          </div>
        )}
        {c.body && <p className="card__text">{c.body}</p>}
        <div className="card__foot">
          {ctaEl}
          {!compact && (
            <div className="card__pager">
              <button type="button" className="card__pager-btn" onClick={() => onStep(-1)} disabled={index === 0} aria-label="Previous stop"><IconArrowLeft size={16} stroke={2} /></button>
              <button type="button" className="card__pager-btn" onClick={() => onStep(1)} disabled={index === total - 1} aria-label={`Next stop (${index + 1} of ${total})`}><IconArrowRight size={16} stroke={2} /></button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/** Desktop detail card: out 360 ms, in 640 ms with a staggered content cascade (motion.css). */
export default function DetailCard({ stops, activeIndex, onSelect, children, centerY, badge }) {
  // centre the card on the map's dial; clamp below the nav and above the stickers
  const slotRef = useRef(null);
  const [top, setTop] = useState(null);
  useLayoutEffect(() => {
    const el = slotRef.current;
    if (!el || centerY == null) return undefined;
    const place = () => {
      const h = el.offsetHeight;
      setTop(Math.round(Math.max(110, Math.min(centerY - h / 2, window.innerHeight - h - 110))));
    };
    place();
    const ro = new ResizeObserver(place); ro.observe(el);
    window.addEventListener('resize', place);
    return () => { ro.disconnect(); window.removeEventListener('resize', place); };
  }, [centerY]);
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
    <div className="card-slot" ref={slotRef} style={top != null ? { top } : undefined}>
      <article key={stop.id} className={`card${leaving ? ' card--out' : ''}`} aria-live="polite">
        <CardBody stop={stop} index={shown} total={stops.length} onStep={onStep} badge={badge} />
      </article>
      {children}
    </div>
  );
}
