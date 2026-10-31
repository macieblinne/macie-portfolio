// System — Loading (Figma 5408:8614 summer / 5417:9789 winter).
// Contract: App renders it above everything on the first visit of a session while
// `visible`; when `visible` turns false it fades itself out (App unmounts it 750ms later).
// Motion (Figma motion note): contours stroke-draw in elevation order (1.2 s, ease-out),
// then fill; the pin drops from −120 px with a 2-bounce spring. Reduced motion: fade only.
import { useEffect, useRef, useState } from 'react';
import { useSite } from '../../site/site.jsx';
import SystemTerrain from './SystemTerrain.jsx';
import './system.css';

const DRAW_MS = 2600; // = --ml-dur-contours
const easeOut = (x) => 1 - Math.pow(1 - x, 3);

function reducedMotion() {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
}

export default function LoadingScreen({ visible }) {
  const site = useSite();
  const theme = site?.theme ?? 'summer';
  const [pct, setPct] = useState(() => (reducedMotion() ? 100 : 0));
  const raf = useRef(0);

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const t0 = performance.now();
    const tick = (now) => {
      const p = easeOut(Math.min(1, (now - t0) / DRAW_MS));
      setPct(Math.round(p * 100));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const shown = visible ? pct : 100;

  return (
    <div
      className={`sys-load${visible ? '' : ' is-leaving'}`}
      data-theme={theme}
      role="status"
      aria-live="polite"
      aria-busy={visible}
      aria-label={visible ? 'Loading Macie Linne’s portfolio' : 'Loaded'}
    >
      <div className="sys-load__stage">
        <SystemTerrain mode="draw" viewBox="0 200 940 620" className="sys-load__terrain">
          <g className="sys-load__pin-shadow" transform="translate(492 491)">
            <ellipse rx="11" ry="5" />
          </g>
          <g className="sys-load__pin" transform="translate(492 352)">
            <g className="sys-load__pin-body">
              <circle r="20.5" />
            </g>
          </g>
        </SystemTerrain>
      </div>

      <div className="sys-load__meta">
        <p className="sys-load__title">Drawing the route</p>
        <div className="sys-load__bar" style={{ '--p': shown / 100 }} aria-hidden="true">
          <span className="sys-load__bar-fill" />
          <span className="sys-load__bar-dot" />
        </div>
        <p className="sys-load__caption" aria-hidden="true">Contours 3,400 → 4,280 m · {shown}%</p>
      </div>
    </div>
  );
}
