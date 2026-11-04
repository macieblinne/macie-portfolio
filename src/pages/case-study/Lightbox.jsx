// Click-to-expand for case-study screenshots.
// Any element with data-zoom-src inside the case study is part of one gallery, in page order.
// <Zoomable> renders the trigger; <Lightbox> is the full-screen viewer (Esc closes, ←/→ step).
import { useCallback, useEffect, useRef, useState } from 'react';
import { IconArrowsMaximize, IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';

const OPEN = 'cs:zoom-open';

/** Wraps a screenshot in a button that opens it in the lightbox. */
export function Zoomable({ src, full, alt, caption, className = '', children }) {
  const open = (e) => {
    const all = [...document.querySelectorAll('[data-zoom-src]')];
    window.dispatchEvent(new CustomEvent(OPEN, { detail: { index: all.indexOf(e.currentTarget), trigger: e.currentTarget } }));
  };
  return (
    <button
      type="button"
      className={`cs-zoom ${className}`}
      data-zoom-src={full ?? src}
      data-zoom-alt={alt}
      data-zoom-caption={caption ?? ''}
      onClick={open}
      aria-label={`Expand image: ${caption || alt}`}
    >
      {children}
      <span className="cs-zoom__badge" aria-hidden="true"><IconArrowsMaximize size={16} stroke={2} /></span>
    </button>
  );
}

export default function Lightbox() {
  const [state, setState] = useState(null); // { index, items, trigger }
  const closeRef = useRef(null);

  useEffect(() => {
    const onOpen = (e) => {
      const items = [...document.querySelectorAll('[data-zoom-src]')].map((el) => ({
        src: el.dataset.zoomSrc, alt: el.dataset.zoomAlt, caption: el.dataset.zoomCaption,
      }));
      setState({ index: Math.max(0, e.detail.index), items, trigger: e.detail.trigger });
    };
    window.addEventListener(OPEN, onOpen);
    return () => window.removeEventListener(OPEN, onOpen);
  }, []);

  const close = useCallback(() => {
    setState((s) => { s?.trigger?.focus?.({ preventScroll: true }); return null; });
  }, []);
  const step = useCallback((d) => {
    setState((s) => s && { ...s, index: (s.index + d + s.items.length) % s.items.length });
  }, []);

  useEffect(() => {
    if (!state) return undefined;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { root.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [state !== null, close, step]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!state) return null;
  const item = state.items[state.index];
  const many = state.items.length > 1;
  return (
    <div className="cs-lb" role="dialog" aria-modal="true" aria-label="Expanded image" onClick={close}>
      <figure className="cs-lb__figure" onClick={(e) => e.stopPropagation()}>
        <img key={item.src} className="cs-lb__img" src={item.src} alt={item.alt} />
        <figcaption className="cs-lb__caption">
          {item.caption && <span>{item.caption}</span>}
          {many && <span className="cs-lb__count">{state.index + 1} / {state.items.length}</span>}
        </figcaption>
      </figure>
      <button ref={closeRef} type="button" className="cs-lb__btn cs-lb__close" onClick={close} aria-label="Close">
        <IconX size={20} stroke={2} aria-hidden="true" />
      </button>
      {many && (
        <>
          <button type="button" className="cs-lb__btn cs-lb__prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous image">
            <IconChevronLeft size={22} stroke={2} aria-hidden="true" />
          </button>
          <button type="button" className="cs-lb__btn cs-lb__next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next image">
            <IconChevronRight size={22} stroke={2} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
