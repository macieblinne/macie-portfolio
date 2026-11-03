import { useEffect, useLayoutEffect, useMemo, useRef, useCallback, useState } from 'react';
import { IconTent, IconFlag } from '@tabler/icons-react';
import { makeScene } from './scene.js';
import { paintTerrain } from './paint.js';
import { useDial, prefersReducedMotion } from './useDial.js';
import { STAGE } from './theme.js';
import { DEG } from './project.js';
import { placeLabels } from './labels.js';
import { placeCompass } from './compass.js';
import { useRouter } from '../site/router.jsx';

const DRAW_IN_MS = 2600; // = --ml-dur-contours
const GLIDE_MS = 900;     // = --ml-dur-route

/**
 * Live, draggable contour mountain. Desktop / fine-pointer only.
 * The canvas is decorative; pins, stems, plates and the route are DOM/SVG.
 */
export default function SummitModel({ terrain, theme, activeIndex, onSelect, k, top, left = 0, prevActive }) {
  const { navigate } = useRouter();
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const routeDoneRef = useRef(null);
  const routeAheadRef = useRef(null);
  const routeFreshRef = useRef(null);
  const freshRef = useRef(null);
  const [freshKey, setFreshKey] = useState(0);
  const glideRef = useRef(null);
  const lastOffRef = useRef({ dx: 36, dy: 0 });
  const renderedRef = useRef(null);
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
  // pins shrink with the mountain on short screens, but never below 72% (tap halo keeps 44px)
  const pinK = Math.min(1, Math.max(0.72, k / 0.85));
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
    const holding = 'loading' in document.documentElement.dataset; // loading screen still up
    if (!startRef.current && !holding) startRef.current = t0;
    if (holding) invalidateRef.current?.();
    const drawIn = holding ? 0 : reduced ? 1 : Math.min(1, (t0 - startRef.current) / DRAW_IN_MS);
        const rings = scene.projectRings(phi);
    paintTerrain(ctx, scene, phi, theme, { dpr, width, height, drawIn, everyOther: everyOther.current, rings });
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

    const sizes = sizesRef.current;

    // compass letters: walk outward from the rim until clear of terrain, pins and page UI
    const pinHeads = P.map((p, i) => { const r = (i === activeIndex ? 32 : 26) * pinK; return { x: p.gx - r, y: p.py - 2 * r, w: 2 * r, h: 2 * r }; });
    const letters = placeCompass(
      scene.compass(phi), scene.dial, rings,
      [...(sizes.obstacles ?? []), ...pinHeads],
      { x: 4, y: 4, w: width - 8, h: height - 8 }, k,
    );
    letters.forEach((c, i) => {
      const el = compassRefs.current[i];
      if (!el) return;
      el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
      el.classList.toggle('compass--hidden', !c.visible);
    });

    // labels: collision-aware placement against every label, pin head, stem and compass letter
    const pinGeo = P.map((p, i) => {
      const r = (i === activeIndex ? 32 : 26) * pinK;
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
    const placed = placeLabels(pinGeo, labels, prevPlacement.current, bounds, k, [...(sizes.obstacles ?? []), ...letters.filter((c) => c.visible).map((c) => c.box)]);
    prevPlacement.current = placed;
    P.forEach((p, i) => {
      const plate = plateRefs.current[i];
      const pl = placed[`p${i}`];
      if (!plate || !pl) return;
      plate.classList.toggle('plate--left', pl.side === 'left');
      // crowded (small screens): a label with no clear space waits for hover/focus; the active one always shows
      plate.classList.toggle('plate--tucked', pl.hit > (i === activeIndex ? 400 : 60));
      plate.style.transform = `translate3d(${pl.x - p.gx}px, ${pl.y - p.gy}px, 0)`;
    });
    if (hereRef.current && placed.here) {
      // offset of the sticker from its pin; a glide blends from the previous pin + its offset,
      // both re-projected every frame, so the sticker stays seated while the dial turns
      const a = P[activeIndex];
      const off = { dx: placed.here.x - a.gx, dy: placed.here.y - a.py };
      // the solver may flip the sticker to the pin's other side mid-turn: blend that too
      const last = lastOffRef.current;
      if (renderedRef.current && Math.hypot(off.dx - last.dx, off.dy - last.dy) > 24 && !prefersReducedMotion()) {
        const g0 = glideRef.current;
        const left = g0 ? (g0.dur ?? GLIDE_MS) - (performance.now() - g0.t0) : 0;
        glideRef.current = { from: activeIndex, off: { dx: renderedRef.current.x - a.gx, dy: renderedRef.current.y - a.py }, t0: performance.now(), dur: Math.max(380, left) };
      }
      let hx = placed.here.x, hy = placed.here.y;
      const gl = glideRef.current;
      if (gl && P[gl.from]) {
        const t = Math.min(1, (performance.now() - gl.t0) / (gl.dur ?? GLIDE_MS));
        const e = 1 - Math.pow(1 - t, 4);
        const fx = P[gl.from].gx + gl.off.dx, fy = P[gl.from].py + gl.off.dy;
        hx = fx + (hx - fx) * e; hy = fy + (hy - fy) * e;
        if (t < 1) invalidateRef.current?.(); else glideRef.current = null;
      }
      lastOffRef.current = off;
      renderedRef.current = { x: hx, y: hy };
      hereRef.current.style.transform = `translate3d(${hx + 4 - (sizes.here.dx ?? 0)}px, ${hy + 4 - (sizes.here.dy ?? 0)}px, 0)`;
      hereRef.current.classList.toggle('here--left', placed.here.side === 'left');
      hereRef.current.classList.toggle('here--hidden', placed.here.hit > 60);
    }
    // route
    const seg = (a, b) => `M${a.gx} ${a.gy}L${b.gx} ${b.gy}`;
    let done = '', ahead = '';
    // fresh = { from, to, dir } — the segments animating right now (forward draws, back retracts)
    const fresh = freshRef.current;
    const inFresh = (i) => fresh && i >= fresh.from && i < fresh.to;
    let freshD = '';
    for (let i = 0; i < P.length - 1; i++) {
      if (inFresh(i)) freshD += seg(P[i], P[i + 1]);
      if (activeIndex > i) { if (!inFresh(i)) done += seg(P[i], P[i + 1]); }
      else ahead += seg(P[i], P[i + 1]); // when retracting, the dotted line shows underneath
    }
    // forward draw runs start → end; retract runs end → start, so walk the path backwards
    if (fresh?.dir === 'back') {
      freshD = '';
      for (let i = fresh.to - 1; i >= fresh.from; i--) freshD += seg(P[i + 1], P[i]);
    }
    routeFreshRef.current?.setAttribute('d', freshD || 'M0 0');
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

    // perf degrade: every-other level while slow
    const ft = performance.now() - t0;
    if (ft > 20) { if (++slowFrames.current >= 10) everyOther.current = true; }
    else { slowFrames.current = 0; if (everyOther.current && stageRef.current && !stageRef.current.classList.contains('stage--dragging')) everyOther.current = false; }
  }, [scene, theme, width, height, activeIndex, lifts, k, loaded, pinK]);

  const invalidateRef = useRef(null);
  const { phi: phiRef, faceTo, invalidate } = useDial({ baseAzimuth, onFrame, elementRef: stageRef });
  const phiNow = () => phiRef.current;
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

  // advancing along the route: the completed segment draws on, "You are here" glides over
  useEffect(() => {
    if (prevActive === undefined || prevActive === activeIndex) return undefined;
    const reduced = prefersReducedMotion();
    if (!reduced) {
      const r = renderedRef.current, P0 = scene.projectPins(phiNow());
      const from = P0[activeIndex];
      glideRef.current = r && from
        ? { from: activeIndex, off: { dx: r.x - from.gx, dy: r.y - from.py }, t0: performance.now(), relFrom: prevActive }
        : { from: prevActive, off: lastOffRef.current, t0: performance.now() };
      // seat the start on the previous pin so it travels with the dial while the new stop is chosen
      if (r && P0[prevActive]) glideRef.current = { from: prevActive, off: { dx: r.x - P0[prevActive].gx, dy: r.y - P0[prevActive].py }, t0: performance.now() };
    }
    // every segment between the two stops animates: draws forward, or retracts when going back
    const forward = activeIndex > prevActive;
    freshRef.current = reduced ? null : { from: Math.min(prevActive, activeIndex), to: Math.max(prevActive, activeIndex), dir: forward ? 'fwd' : 'back' };
    setFreshKey((n) => n + 1);
    invalidateRef.current?.();
    const t = setTimeout(() => { freshRef.current = null; invalidateRef.current?.(); }, 1150);
    return () => { clearTimeout(t); freshRef.current = null; };
  }, [activeIndex, prevActive, scene]);

  // face the active pin on change
  useEffect(() => {
    const p = pins[activeIndex];
    if (p && prevActive !== undefined && prevActive !== activeIndex) faceTo(scene.proj.facing(p.xm, p.ym));
  }, [activeIndex, pins, scene, faceTo, prevActive]);

  const handlePin = (i) => {
    const p = pins[i];
    if (i === activeIndex && p.href) { navigate(p.href); return; }
    onSelect(i);
  };

  return (
    <div
      ref={stageRef}
      className={`stage${loaded ? '' : ' stage--loading'}`}
      style={{ width, height, top, left, '--pin-k': pinK }}
      data-theme-stage={theme}
    >
      <canvas ref={canvasRef} className="stage__canvas" style={{ width, height }} aria-hidden="true" />
      <div className="stage__overlay">
        <svg className="stage__route" aria-hidden="true">
          <g ref={liftsRef} />
          <path ref={routeAheadRef} className="route-ahead" d="M0 0" />
          <path ref={routeDoneRef} className="route-done" d="M0 0" />
          {freshKey > 0 && <path key={freshKey} ref={routeFreshRef} className={`route-fresh${freshRef.current?.dir === 'back' ? ' route-fresh--back' : ''}`} pathLength="1" d="M0 0" />}
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
                className="plate"
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
