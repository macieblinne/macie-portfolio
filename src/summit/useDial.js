import { useEffect, useRef, useCallback } from 'react';
import { clampAzimuth, DEG } from './project.js';

const RAD_PER_PX = -0.006; // negative: the front of the mountain follows the pointer
const FRICTION = 0.92;
const STOP_V = 1e-4;
const MAX_V = 0.05;
const ROTATE_MS = 1100; // = --ml-dur-rotate
const CLAMP = 20 * DEG;
const easeStandard = (t) => { // cubic-bezier(.65,0,.35,1) approximation
  const c = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; return c(t);
};

export function prefersReducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Owns the view azimuth φ (radians) in a ref and drives a rAF loop.
 * `onFrame(phi)` is called whenever φ changed (or `invalidate()` was called).
 */
export function useDial({ baseAzimuth, onFrame, elementRef }) {
  const phi = useRef(baseAzimuth);
  const base = useRef(baseAzimuth);
  const vel = useRef(0);
  const dirty = useRef(true);
  const raf = useRef(0);
  const anim = useRef(null); // { from, to, t0 }
  const samples = useRef([]);
  const dragging = useRef(false);
  const frameCb = useRef(onFrame);
  frameCb.current = onFrame;

  // reset when the base azimuth changes (theme switch)
  useEffect(() => { base.current = baseAzimuth; phi.current = baseAzimuth; vel.current = 0; anim.current = null; dirty.current = true; }, [baseAzimuth]);

  const invalidate = useCallback(() => { dirty.current = true; }, []);

  // rAF loop
  useEffect(() => {
    let last = performance.now();
    const tick = (now) => {
      raf.current = requestAnimationFrame(tick);
      if (anim.current) {
        const a = anim.current;
        const t = Math.min(1, (now - a.t0) / a.dur);
        phi.current = a.from + (a.to - a.from) * easeStandard(t);
        dirty.current = true;
        if (t >= 1) anim.current = null;
      } else if (!dragging.current && Math.abs(vel.current) > STOP_V) {
        const dt = Math.min(2, (now - last) / 16.67);
        phi.current += vel.current * dt;
        vel.current *= Math.pow(FRICTION, dt);
        dirty.current = true;
      }
      last = now;
      if (dirty.current) { dirty.current = false; frameCb.current?.(phi.current); }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  // pointer drag
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    let lastX = 0;
    const down = (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (e.target?.closest?.('.pin')) return; // let the button take the click
      if (prefersReducedMotion()) return;
      dragging.current = true; anim.current = null; vel.current = 0;
      lastX = e.clientX; samples.current = [[performance.now(), 0]];
      el.setPointerCapture?.(e.pointerId);
      el.classList.add('stage--dragging');
    };
    const move = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX; lastX = e.clientX;
      const d = dx * RAD_PER_PX;
      phi.current += d; dirty.current = true;
      const now = performance.now();
      samples.current.push([now, d]);
      samples.current = samples.current.filter(([t]) => now - t <= 80);
    };
    const up = () => {
      if (!dragging.current) return;
      dragging.current = false;
      el.classList.remove('stage--dragging');
      const s = samples.current;
      if (s.length >= 2) {
        const span = Math.max(16, s[s.length - 1][0] - s[0][0]);
        const sum = s.reduce((a, [, d]) => a + d, 0);
        const v = (sum / span) * 16.67; // rad per frame
        vel.current = Math.max(-MAX_V, Math.min(MAX_V, v));
      }
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('lostpointercapture', up);
    };
  }, [elementRef]);

  /** Rotate so a map point faces the camera, clamped ±20° from the base view. */
  const faceTo = useCallback((facingAzimuth) => {
    if (prefersReducedMotion()) return;
    let target = clampAzimuth(facingAzimuth, base.current, CLAMP);
    // shortest arc from the current phi
    const cur = phi.current;
    let d = target - cur; d = Math.atan2(Math.sin(d), Math.cos(d));
    target = cur + d;
    vel.current = 0;
    anim.current = { from: cur, to: target, t0: performance.now(), dur: ROTATE_MS };
  }, []);

  return { phi, faceTo, invalidate };
}
