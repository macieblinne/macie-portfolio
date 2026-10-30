import { useEffect, useLayoutEffect, useMemo, useRef, useCallback, useState } from 'react';
import { IconTent, IconFlag } from '@tabler/icons-react';
import { makeScene } from './scene.js';
import { paintTerrain } from './paint.js';
import { useDial, prefersReducedMotion } from './useDial.js';
import { STAGE } from './theme.js';
import { DEG } from './project.js';
import { placeLabels } from './labels.js';

const DRAW_IN_MS = 1200;

/**
 * Live, draggable contour mountain. Desktop / fine-pointer only.
 * The canvas is decorative; pins, stems, plates and the route are DOM/SVG.
 */
export default function SummitModel({ terrain, theme, activeIndex, onSelect, k, top, prevActive }) {
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
  const sizesRef = useRef({ plates: [], here: { w: 140, h: 48 } });
  const prevPlacement = useRef({});

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

    // pins: seat at the ground point, stack by depth (nearer = on top)
    const P = scene.projectPins(phi);
    P.forEach((p, i) => {
      const el = stopRefs.current[i];
      if (!el) return;
      el.style.transform = `translate3d(${p.gx}px, ${p.gy}px, 0)`;
      el.style.zIndex = String(1000 + Math.round(p.gy));
      el.style.setProperty('--stem', `${p.stem}px`);
    });

    // labels: collision-aware placement against every label, pin head and stem
    const sizes = sizesRef.current;
    const pinGeo = P.map((p, i) => {
      const r = (i === activeIndex ? 32 : 26); // pin sizes are CSS px (not scaled)
      return { x: p.gx, yc: p.py - r, r, gy: p.gy };
    });
    const labels = [];
    const act = P[activeIndex];
    if (act) labels.push({ key: `p${activeIndex}`, pin: activeIndex, w: sizes.plates[activeIndex]?.w ?? 180, h: sizes.plates[activeIndex]?.h ?? 46, kind: 'plate' });
    P.map((p, i) => i).filter((i) => i !== activeIndex)
      .sort((a, b) => P[b].gy - P[a].gy) // nearer pins claim space first
      .forEach((i) => labels.push({ key: `p${i}`, pin: i, w: sizes.plates[i]?.w ?? 180, h: sizes.plates[i]?.h ?? 46, kind: 'plate' }));
    // the sticker is decoration: it goes last and steps aside if the route is too crowded
    if (act) labels.push({ key: 'here', pin: activeIndex, w: sizes.here.w, h: sizes.here.h, kind: 'sticker' });
    const bounds = { x: 8, y: -60 * k, w: width - 16, h: height + 60 * k };
    const placed = placeLabels(pinGeo, labels, prevPlacement.current, bounds, k, sizes.obstacles ?? []);
    prevPlacement.current = placed;
    P.forEach((p, i) => {
      const plate = plateRefs.current[i];
      const pl = placed[`p${i}`];
      if (!plate || !pl) return;
      plate.classList.toggle('plate--left', pl.side === 'left');
      plate.style.transform = `translate3d(${pl.x - p.gx}px, ${pl.y - p.gy}px, 0)`;
    });
    if (hereRef.current && placed.here) {
      hereRef.current.style.transform = `translate3d(${placed.here.x + 4 - (sizes.here.dx ?? 0)}px, ${placed.here.y + 4 - (sizes.here.dy ?? 0)}px, 0)`;
      hereRef.current.classList.toggle('here--left', placed.here.side === 'left');
      hereRef.current.style.opacity = placed.here.hit > 60 ? '0' : '1';
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

  // measure label boxes (plates keep their size while rotating; re-measure on content/font changes)
  const measure = useCallback(() => {
    const stage = stageRef.current?.getBoundingClientRect();
    const obstacles = [];
    if (stage) {
      const pad = 8;
      document.querySelectorAll('.home__header > *, .card-slot, .nav, .stage__stickers').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width) return;
        obstacles.push({ x: r.left - stage.left - pad, y: r.top - stage.top - pad, w: r.width + 2 * pad, h: r.height + 2 * pad });
      });
    }
    sizesRef.current = {
      obstacles,
      plates: plateRefs.current.map((el) => (el ? { w: el.offsetWidth, h: el.offsetHeight } : null)),
      here: (() => {
        const st = hereRef.current?.firstElementChild;
        if (!st) return { w: 140, h: 48 };
        const r = st.getBoundingClientRect(); // includes the -4° tilt
        const o = hereRef.current.getBoundingClientRect();
        // the tilt pushes the visible box off the element's origin; remember by how much
        return { w: r.width + 8, h: r.height + 8, dx: r.left - o.left, dy: r.top - o.top };
      })(),
    };
  }, []);
  useLayoutEffect(() => { measure(); invalidateRef.current?.(); }, [measure, theme, activeIndex, pins, k]);
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) { measure(); invalidateRef.current?.(); } });
    return () => { alive = false; };
  }, [measure]);

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
      style={{ width, height, top }}
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
