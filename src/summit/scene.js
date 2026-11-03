// Scene assembly shared by the Canvas painter and the SVG renderer (pure).
import { makeProjector, dialGeometry, DEG } from './project.js';
import { toMap, zAt } from './contours.js';
import { THEMES, lerpColor, STEM, STAGE } from './theme.js';

/** Seat the pins on the terrain: map coords + elevation. */
export function seatPins(g, stops) {
  return stops.map((s) => {
    const [xm, ym] = toMap(g, s.lat, s.lon);
    return { ...s, xm, ym, zm: zAt(g, s.lat, s.lon) };
  });
}

/**
 * Build a projected scene at azimuth phi.
 * @param g parsed grid, rings cached contours, pins seated stops, k scale, origin stage origin
 */
export function makeScene(g, rings, pins, { k = 1, origin = [STAGE.x, STAGE.y] } = {}) {
  const proj = makeProjector(g, k, origin);
  const dial = dialGeometry(g, proj);
  const zRange = g.zMax - g.zMin || 1;

  function projectRings(phi) {
    const out = new Array(rings.length);
    for (let r = 0; r < rings.length; r++) {
      const ring = rings[r];
      const n = ring.points.length / 2;
      const xy = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) {
        const [x, y] = proj.project(ring.points[i * 2], ring.points[i * 2 + 1], ring.level, phi, ring.feather[i]);
        xy[i * 2] = x; xy[i * 2 + 1] = y;
      }
      out[r] = { xy, level: ring.level, alpha: ring.meanFeather, t: (ring.level - g.zMin) / zRange };
    }
    return out;
  }

  function projectPins(phi) {
    return pins.map((p) => {
      const [gx, gy] = proj.project(p.xm, p.ym, p.zm, phi, 1);
      const stem = (STEM[p.id] ?? 100) * k;
      return { ...p, gx, gy, stem, px: gx, py: gy - stem };
    });
  }

  /** Compass letter anchors on the dial for azimuth phi. */
  function compass(phi) {
    const R = 1;
    const dirs = [['N', 0, R], ['E', R, 0], ['S', 0, -R], ['W', -R, 0]];
    return dirs.map(([l, x, y]) => {
      const c = Math.cos(phi), s = Math.sin(phi);
      const xr = x * c + y * s, yr = x * s - y * c;
      return { label: l, ux: xr, uy: yr, x: dial.cx + xr * (dial.rx + 52 * k), y: dial.cy + yr * (dial.ry + 56 * k) };
    });
  }

  return { proj, dial, projectRings, projectPins, compass, k };
}

export function themeColours(theme) { return THEMES[theme]; }
export { lerpColor, DEG };

/**
 * Vertical extent of the model over a full 360° turn, in stage px at k=1:
 * top = highest pin-head edge any pin reaches, bottom = lowest dial tick.
 */
export function sceneEnvelope(g, rings, pins) {
  const sc = makeScene(g, rings, pins, { k: 1 });
  let top = Infinity;
  for (let a = 0; a < 360; a += 5) {
    for (const p of sc.projectPins(a * DEG)) top = Math.min(top, p.py - 64);
  }
  const bottom = sc.dial.cy + sc.dial.ry + 56 + 16; // compass letter below the rim
  return { top, bottom };
}
