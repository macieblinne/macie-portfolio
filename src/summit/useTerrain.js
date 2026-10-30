import { useEffect, useState } from 'react';
import { parseGrid, buildContours } from './contours.js';
import { seatPins } from './scene.js';

const CACHE_VERSION = 'v3';
const memo = new Map();

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return arr.map((r) => ({
      level: r.l, area: r.a, meanFeather: r.m,
      points: Float32Array.from(r.p), feather: Float32Array.from(r.f),
    }));
  } catch { return null; }
}
function writeCache(key, rings) {
  try {
    const slim = rings.map((r) => ({
      l: r.level, a: r.area, m: r.meanFeather,
      p: Array.from(r.points, (v) => Math.round(v * 10) / 10),
      f: Array.from(r.feather, (v) => Math.round(v * 1000) / 1000),
    }));
    sessionStorage.setItem(key, JSON.stringify(slim));
  } catch { /* quota or private mode — fine */ }
}

/**
 * Loads a terrain grid + pins for a theme, builds (or restores) the contour cache.
 * Returns { g, rings, pins, lifts, ready }.
 */
export function useTerrain(theme, pinsConfig) {
  const [state, setState] = useState(() => memo.get(theme) ?? null);

  useEffect(() => {
    let cancelled = false;
    if (memo.has(theme)) { setState(memo.get(theme)); return; }
    const cfg = pinsConfig[theme];
    (async () => {
      const res = await fetch(`/terrain/${cfg.terrain}`);
      const grid = await res.json();
      const g = parseGrid(grid);
      const key = `summit:${CACHE_VERSION}:${cfg.terrain}`;
      const build = () => {
        if (cancelled) return;
        let rings = readCache(key);
        if (!rings) { rings = buildContours(g); writeCache(key, rings); }
        const pins = seatPins(g, cfg.stops);
        const value = { g, rings, pins, lifts: cfg.lifts ?? [], ready: true };
        memo.set(theme, value);
        setState(value);
      };
      if ('requestIdleCallback' in window) requestIdleCallback(build, { timeout: 300 });
      else setTimeout(build, 0);
    })();
    return () => { cancelled = true; };
  }, [theme, pinsConfig]);

  return state;
}
