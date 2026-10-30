import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { IconTent, IconFlag } from '@tabler/icons-react';
import { makeScene } from './scene.js';
import { paintTerrain } from './paint.js';
import { useDial, prefersReducedMotion } from './useDial.js';
import { STAGE } from './theme.js';
import { DEG } from './project.js';

const DRAW_IN_MS = 1200;

/**
 * Live, draggable contour mountain. Desktop / fine-pointer only.
 * The canvas is decorative; pins, stems, plates and the route are DOM/SVG.
 */
export default function SummitModel({ terrain, theme, activeIndex, onSelect, k, prevActive }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const routeDoneRef = useRef(null);
  const routeAheadRef = useRef(null);
  const liftsRef = useRef(null);
  const stopRefs = useRef([]);
  const plateRefs = useRef([]);
  const hereRef = useRef(null);
  const compassRefs = useRef([]);
  const startRef = useRef(0);
  const slowFrames = useRef(0);
  const everyOther = useRef(false);
  const [loaded, setLoaded] = useState(false);

  const width = STAGE.w * k, height = STAGE.h * k;
  const { g, rings, pins, lifts } = terrain;
  const scene = useMemo(() => makeScene(g, rings, pins, { k, origin: [STAGE.x, STAGE.y] }), [g, rings, pins, k]);
  const baseAzimuth = g.render.viewAzimuthDeg * DEG;

  // --- per-frame paint + DOM placement ------------------------------------
  const onFrame = useCallback((phi) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const t0 = performance.now();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(width * dpr)) {
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    }
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    if (!startRef.current) startRef.current = t0;
    const drawIn = reduced ? 1 : Math.min(1, (t0 - startRef.current) / DRAW_IN_MS);
    paintTerrain(ctx, scene, phi, theme, { dpr, width, height, drawIn, everyOther: everyOther.current });
    if (drawIn < 1) invalidateRef.current?.();
    else if (!loaded) setLoaded(true);

    // pins + label plates (plates de-collide vertically on each side)
    const P = scene.projectPins(phi);
    const cx = scene.dial.cx, rx = scene.dial.rx;
    const placed = { left: [], right: [] };
    const order = P.map((p, i) => i).sort((a, b) => P[a].py - P[b].py); // top-most first
    const xs = P.map((p) => p.gx).sort((a, b) => a - b);
    const plateY = {};
    for (const i of order) {
      const p = P[i];
      // label goes left when the pin is well left of centre, or is the left-most of a crowded group
      const crowded = p.gx === xs[0] && xs.length > 1 && xs[1] - xs[0] < 100 * k;
      const left = p.gx < cx - rx * 0.3 || (crowded && p.gx < cx + 40 * k);
      const pinR = (i === activeIndex ? 32 : 26) * k;
      let y = p.py - 2 * pinR + 7 * k; // plate top = pin top + 7 (py is the pin's bottom)
      const side = placed[left ? 'left' : 'right'];
      for (const prevY of side) if (Math.abs(prevY - y) < 48 * k) y = prevY - 48 * k; // push upward
      side.push(y);
      plateY[i] = { y, left, pinR };
    }
    P.forEach((p, i) => {
      const el = stopRefs.current[i];
      if (!el) return;
      el.style.transform = `translate3d(${p.gx}px, ${p.gy}px, 0)`;
      el.style.setProperty('--stem', `${p.stem}px`);
      const plate = plateRefs.current[i];
      if (plate) {
        const { y, left, pinR } = plateY[i];
        plate.classList.toggle('plate--left', left);
        const off = pinR + 12 * k;
        plate.style.transform = `translate3d(${left ? -off : off}px, ${y - p.gy}px, 0)`;
      }
    });
    const act = P[activeIndex];
    if (hereRef.current && act) {
      const pinR = 32 * k;
      hereRef.current.style.transform = `translate3d(${act.gx + pinR - 4 * k}px, ${act.gy - act.stem + 8 * k}px, 0)`;
    }
    // route
    const seg = (a, b) => `M${a.gx} ${a.gy}L${b.gx} ${b.gy}`;
    let done = '', ahead = '';
    for (let i = 0; i < P.length - 1; i++) (activeIndex > i ? (done += seg(P[i], P[i + 1])) : (ahead += seg(P[i], P[i + 1])));
    routeDoneRef.current?.setAttribute('d', done || 'M0 0');
    routeAheadRef.current?.setAttribute('d', ahead || 'M0 0');
    // lifts (winter)
    if (liftsRef.current) {
      const byId = Object.fromEntries(P.map((p) => [p.id, p]));
      let html = '';
      for (const l of lifts) {
        const a = byId[l.from], b = byId[l.to];
        if (!a || !b) continue;
        if (l.style === 'chairs') {
          html += `<line class="lift-line" x1="${a.gx}" y1="${a.gy}" x2="${b.gx}" y2="${b.gy}"/>`;
          const len = Math.hypot(b.gx - a.gx, b.gy - a.gy);
          for (let t = 24 * k; t < len; t += 48 * k) {
            const u = t / len;
            html += `<circle class="lift-chair" cx="${a.gx + (b.gx - a.gx) * u}" cy="${a.gy + (b.gy - a.gy) * u}" r="${5 * k}"/>`;
          }
        } else html += `<line class="lift-dotted" x1="${a.gx}" y1="${a.gy}" x2="${b.gx}" y2="${b.gy}"/>`;
      }
      liftsRef.current.innerHTML = html;
    }
    // compass letters
    scene.compass(phi).forEach((c, i) => {
      const el = compassRefs.current[i];
      if (el) el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
    });

    // perf degrade: every-other level while slow
    const ft = performance.now() - t0;
    if (ft > 20) { if (++slowFrames.current >= 10) everyOther.current = true; }
    else { slowFrames.current = 0; if (everyOther.current && stageRef.current && !stageRef.current.classList.contains('stage--dragging')) everyOther.current = false; }
  }, [scene, theme, width, height, activeIndex, lifts, k, loaded]);

  const invalidateRef = useRef(null);
  const { faceTo, invalidate } = useDial({ baseAzimuth, onFrame, elementRef: stageRef });
  invalidateRef.current = invalidate;

  // repaint when inputs change
  useEffect(() => { invalidate(); }, [activeIndex, theme, scene, invalidate]);
  useEffect(() => { startRef.current = 0; setLoaded(false); }, [theme, scene]);

  // face the active pin on change
  useEffect(() => {
    const p = pins[activeIndex];
    if (p && prevActive !== undefined && prevActive !== activeIndex) faceTo(scene.proj.facing(p.xm, p.ym));
  }, [activeIndex, pins, scene, faceTo, prevActive]);

  const handlePin = (i) => {
    const p = pins[i];
    if (i === activeIndex && p.href) { window.location.href = p.href; return; }
    onSelect(i);
  };

  return (
    <div
      ref={stageRef}
      className={`stage${loaded ? '' : ' stage--loading'}`}
      style={{ width, height, top: STAGE.y * k }}
      data-theme-stage={theme}
    >
      <canvas ref={canvasRef} className="stage__canvas" style={{ width, height }} aria-hidden="true" />
      <div className="stage__overlay">
        <svg className="stage__route" aria-hidden="true">
          <g ref={liftsRef} />
          <path ref={routeAheadRef} className="route-ahead" d="M0 0" />
          <path ref={routeDoneRef} className="route-done" d="M0 0" />
        </svg>
        {['N', 'E', 'S', 'W'].map((l, i) => (
          <span key={l} ref={(el) => (compassRefs.current[i] = el)} className="compass" aria-hidden="true">{l}</span>
        ))}
        {pins.map((p, i) => {
          const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'ahead';
          const promote = state === 'active' && prevActive !== undefined && prevActive !== i;
          const drop = state === 'active' && prevActive === undefined;
          return (
            <div
              key={p.id}
              ref={(el) => (stopRefs.current[i] = el)}
              className={`stop stop--${state}${promote ? ' stop--promote' : ''}${drop && loaded ? ' stop--drop' : ''}`}
            >
              <span className="stop__stem" style={{ height: 'var(--stem)' }} />
              <span className="stop__ground" />
              <button
                type="button"
                className="pin"
                style={{ bottom: 'var(--stem)' }}
                onClick={() => handlePin(i)}
                aria-current={state === 'active' ? 'step' : undefined}
                aria-label={`${p.label} — ${p.sub}${state === 'active' && p.href ? '. Press Enter to open the case study' : ''}`}
              >
                {p.n ? p.n : p.icon === 'flag' ? <IconFlag size={22} stroke={2} /> : <IconTent size={22} stroke={2} />}
              </button>
              <div
                ref={(el) => (plateRefs.current[i] = el)}
                className={`plate${p.id === 'trailhead' ? ' plate--accent' : ''}`}
                aria-hidden="true"
              >
                <span className="plate__title">{p.label}</span>
                <span className="plate__sub">{p.sub}</span>
              </div>
            </div>
          );
        })}
        <div ref={hereRef} className="here" aria-hidden="true">
          <span className="sticker sticker--orange">YOU ARE HERE</span>
        </div>
      </div>
    </div>
  );
}
