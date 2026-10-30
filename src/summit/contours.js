// Summit Model — terrain geometry pipeline (pure, runs in Node and the browser).
// grid.json → marching squares per level → chained rings → Catmull-Rom smooth
// → rim feather → MAP-SPACE cache. See doc/RENDER-PIPELINE.md §1–2.

const M_PER_DEG_LAT = 111_320;

/** Parse a grid JSON into typed data + metre conversions. */
export function parseGrid(grid) {
  const z = Float32Array.from(grid.z.split(',').map(Number));
  const latMid = (grid.latMin + grid.latMax) / 2;
  const lonMid = (grid.lonMin + grid.lonMax) / 2;
  const mPerDegLon = M_PER_DEG_LAT * Math.cos((latMid * Math.PI) / 180);
  const cellX = ((grid.lonMax - grid.lonMin) / (grid.cols - 1)) * mPerDegLon;
  const cellY = ((grid.latMax - grid.latMin) / (grid.rows - 1)) * M_PER_DEG_LAT;
  const widthM = cellX * (grid.cols - 1);
  const heightM = cellY * (grid.rows - 1);
  return {
    ...grid,
    z,
    latMid,
    lonMid,
    mPerDegLon,
    mPerDegLat: M_PER_DEG_LAT,
    cellX,
    cellY,
    widthM,
    heightM,
    Z: (i, j) => z[j * grid.cols + i],
  };
}

/** Map-space (metres east/north of grid centre) for a lat/lon. */
export function toMap(g, lat, lon) {
  return [(lon - g.lonMid) * g.mPerDegLon, (lat - g.latMid) * g.mPerDegLat];
}

/** Bilinear elevation sample. */
export function zAt(g, lat, lon) {
  const fi = ((lon - g.lonMin) / (g.lonMax - g.lonMin)) * (g.cols - 1);
  const fj = ((lat - g.latMin) / (g.latMax - g.latMin)) * (g.rows - 1);
  const i = Math.max(0, Math.min(g.cols - 2, Math.floor(fi)));
  const j = Math.max(0, Math.min(g.rows - 2, Math.floor(fj)));
  const u = Math.max(0, Math.min(1, fi - i));
  const v = Math.max(0, Math.min(1, fj - j));
  return (
    (1 - u) * (1 - v) * g.Z(i, j) +
    u * (1 - v) * g.Z(i + 1, j) +
    (1 - u) * v * g.Z(i, j + 1) +
    u * v * g.Z(i + 1, j + 1)
  );
}

function smoothstep(e0, e1, x) {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/** Rim feather: 1 inside r<lo, fades to 0 at r=hi. */
export function feather(r, lo = 0.72, hi = 1.0) {
  return r < lo ? 1 : smoothstep(hi, lo, r);
}

// ---------------------------------------------------------------------------
// Marching squares on a padded grid. Padding with a value below every level
// guarantees every iso-line is a closed ring (the spec's "close along the edge").
// ---------------------------------------------------------------------------

// Edge ids: 0 = bottom (a→b), 1 = right (b→c), 2 = top (c→d), 3 = left (d→a)
// Corners: a=(i,j) b=(i+1,j) c=(i+1,j+1) d=(i,j+1); bit order a b c d.
const CASES = [
  [], // 0
  [[2, 3]], // 1  d
  [[1, 2]], // 2  c
  [[1, 3]], // 3  c d
  [[0, 1]], // 4  b
  null, // 5  b d (saddle)
  [[0, 2]], // 6  b c
  [[0, 3]], // 7  b c d
  [[0, 3]], // 8  a
  [[0, 2]], // 9  a d
  null, // 10 a c (saddle)
  [[0, 1]], // 11 a c d
  [[1, 3]], // 12 a b
  [[1, 2]], // 13 a b d
  [[2, 3]], // 14 a b c
  [], // 15
];

function isoSegments(vals, cols, rows, lvl) {
  const segs = []; // [x0,y0,x1,y1] in padded-cell units
  const V = (i, j) => vals[j * cols + i];
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = V(i, j), b = V(i + 1, j), c = V(i + 1, j + 1), d = V(i, j + 1);
      const idx = (a >= lvl ? 8 : 0) | (b >= lvl ? 4 : 0) | (c >= lvl ? 2 : 0) | (d >= lvl ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const pt = (e) => {
        switch (e) {
          case 0: return [i + (lvl - a) / (b - a), j];
          case 1: return [i + 1, j + (lvl - b) / (c - b)];
          case 2: return [i + (lvl - d) / (c - d), j + 1];
          default: return [i, j + (lvl - a) / (d - a)];
        }
      };
      let pairs = CASES[idx];
      if (pairs === null) {
        const centre = (a + b + c + d) / 4 >= lvl;
        if (idx === 5) pairs = centre ? [[0, 1], [2, 3]] : [[0, 3], [1, 2]];
        else pairs = centre ? [[0, 3], [1, 2]] : [[0, 1], [2, 3]];
      }
      for (const [e0, e1] of pairs) {
        const p = pt(e0), q = pt(e1);
        segs.push(p[0], p[1], q[0], q[1]);
      }
    }
  }
  return segs;
}

function key(x, y) {
  return `${Math.round(x * 1e4)}|${Math.round(y * 1e4)}`;
}

/** Chain unordered segments into closed polylines. */
function chain(segs) {
  const n = segs.length / 4;
  const ends = new Map(); // key → list of [segIndex, endSide]
  const add = (k, v) => { const l = ends.get(k); if (l) l.push(v); else ends.set(k, [v]); };
  for (let s = 0; s < n; s++) {
    add(key(segs[s * 4], segs[s * 4 + 1]), [s, 0]);
    add(key(segs[s * 4 + 2], segs[s * 4 + 3]), [s, 1]);
  }
  const used = new Uint8Array(n);
  const rings = [];
  for (let s0 = 0; s0 < n; s0++) {
    if (used[s0]) continue;
    used[s0] = 1;
    const pts = [segs[s0 * 4], segs[s0 * 4 + 1], segs[s0 * 4 + 2], segs[s0 * 4 + 3]];
    let cx = pts[2], cy = pts[3];
    // walk forward
    for (;;) {
      const cands = ends.get(key(cx, cy));
      let next = null;
      if (cands) for (const [s, side] of cands) if (!used[s]) { next = [s, side]; break; }
      if (!next) break;
      const [s, side] = next;
      used[s] = 1;
      const ox = side === 0 ? segs[s * 4 + 2] : segs[s * 4];
      const oy = side === 0 ? segs[s * 4 + 3] : segs[s * 4 + 1];
      pts.push(ox, oy);
      cx = ox; cy = oy;
    }
    if (pts.length >= 8) rings.push(pts);
  }
  return rings;
}

/** Closed centripetal Catmull-Rom (α=0.5), `sub` samples per segment. */
function catmullRomClosed(pts, sub = 4) {
  const n = pts.length / 2;
  if (n < 3) return pts.slice();
  const P = (k) => { const i = ((k % n) + n) % n; return [pts[i * 2], pts[i * 2 + 1]]; };
  const out = [];
  const alpha = 0.5;
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const d = (a, b) => Math.max(1e-3, Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), alpha));
    const t0 = 0, t1 = t0 + d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3);
    for (let s = 0; s < sub; s++) {
      const t = t1 + ((t2 - t1) * s) / sub;
      const lerp = (a, b, ta, tb) => {
        const w = (t - ta) / (tb - ta);
        return [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w];
      };
      const A1 = lerp(p0, p1, t0, t1), A2 = lerp(p1, p2, t1, t2), A3 = lerp(p2, p3, t2, t3);
      const B1 = lerp(A1, A2, t0, t2), B2 = lerp(A2, A3, t1, t3);
      const C = lerp(B1, B2, t1, t2);
      out.push(C[0], C[1]);
    }
  }
  return out;
}

function decimate(pts, minDist) {
  const out = [pts[0], pts[1]];
  for (let i = 2; i < pts.length; i += 2) {
    const lx = out[out.length - 2], ly = out[out.length - 1];
    if (Math.hypot(pts[i] - lx, pts[i + 1] - ly) >= minDist) out.push(pts[i], pts[i + 1]);
  }
  return out;
}

/** Sutherland–Hodgman clip of a (possibly concave) ring against a convex polygon. */
function clipConvex(pts, clip) {
  let out = pts;
  const cn = clip.length / 2;
  for (let e = 0; e < cn; e++) {
    const ax = clip[e * 2], ay = clip[e * 2 + 1];
    const bx = clip[((e + 1) % cn) * 2], by = clip[((e + 1) % cn) * 2 + 1];
    const inside = (x, y) => (bx - ax) * (y - ay) - (by - ay) * (x - ax) >= 0;
    const input = out;
    out = [];
    const n = input.length / 2;
    if (n === 0) break;
    for (let i = 0; i < n; i++) {
      const cx = input[i * 2], cy = input[i * 2 + 1];
      const px = input[((i + n - 1) % n) * 2], py = input[((i + n - 1) % n) * 2 + 1];
      const ci = inside(cx, cy), pi = inside(px, py);
      if (ci) {
        if (!pi) {
          const t = ((ax - px) * (by - ay) - (ay - py) * (bx - ax)) /
            ((cx - px) * (by - ay) - (cy - py) * (bx - ax));
          out.push(px + (cx - px) * t, py + (cy - py) * t);
        }
        out.push(cx, cy);
      } else if (pi) {
        const t = ((ax - px) * (by - ay) - (ay - py) * (bx - ax)) /
          ((cx - px) * (by - ay) - (cy - py) * (bx - ax));
        out.push(px + (cx - px) * t, py + (cy - py) * t);
      }
    }
  }
  return out;
}

function ellipsePoly(rx, ry, n = 72) {
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    p.push(Math.cos(a) * rx, Math.sin(a) * ry);
  }
  return p;
}

function polyArea(pts) {
  let a = 0;
  const n = pts.length / 2;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    a += pts[i * 2] * pts[j * 2 + 1] - pts[j * 2] * pts[i * 2 + 1];
  }
  return a / 2;
}

/**
 * Build the map-space contour cache.
 * @returns {{level:number, points:Float32Array, feather:Float32Array, meanFeather:number, area:number}[]}
 */
export function buildContours(g, opts = {}) {
  const { everyOther = false } = opts;
  const pcols = g.cols + 2, prows = g.rows + 2;
  const padVal = g.zMin - 1e3;
  const vals = new Float32Array(pcols * prows).fill(padVal);
  for (let j = 0; j < g.rows; j++)
    for (let i = 0; i < g.cols; i++) vals[(j + 1) * pcols + (i + 1)] = g.Z(i, j);

  const S = (g.render.pxPerKm / 1000); // px per metre at base scale
  const minDistM = 0.6 / S;
  const [lo, hi] = g.render.rimFeather || [0.72, 1.0];
  const rx = g.widthM / 2, ry = g.heightM / 2;
  // Footprint clip: the dial disc in map space (slightly inside the grid rectangle).
  const clipPoly = ellipsePoly(rx * (opts.clipScale ?? 0.98), ry * (opts.clipScale ?? 0.98));

  const rings = [];
  const step = g.contourStep * (everyOther ? 2 : 1);
  for (let lvl = g.zMin; lvl <= g.zMax; lvl += step) {
    const segs = isoSegments(vals, pcols, prows, lvl);
    for (const raw of chain(segs)) {
      // padded-cell units → metres (centre origin). Padded index k → grid index k-1.
      const m = new Array(raw.length);
      for (let i = 0; i < raw.length; i += 2) {
        m[i] = ((raw[i] - 1) * g.cellX) - rx;
        m[i + 1] = ((raw[i + 1] - 1) * g.cellY) - ry;
      }
      // clamp to the real grid rectangle (padding ring sits half a cell outside)
      for (let i = 0; i < m.length; i += 2) {
        m[i] = Math.max(-rx, Math.min(rx, m[i]));
        m[i + 1] = Math.max(-ry, Math.min(ry, m[i + 1]));
      }
      const dd = [];
      for (let i = 0; i < m.length; i += 2) {
        const n = dd.length;
        if (n === 0 || Math.hypot(m[i] - dd[n - 2], m[i + 1] - dd[n - 1]) > 1e-6) dd.push(m[i], m[i + 1]);
      }
      if (dd.length >= 4 && Math.hypot(dd[0] - dd[dd.length - 2], dd[1] - dd[dd.length - 1]) <= 1e-6) dd.length -= 2;
      if (dd.length < 6) continue;
      let pts = catmullRomClosed(dd, 4);
      pts = clipConvex(pts, clipPoly);
      if (pts.length < 6) continue;
      pts = decimate(pts, minDistM);
      if (pts.length < 6) continue;
      const area = Math.abs(polyArea(pts));
      const f = new Float32Array(pts.length / 2);
      let sum = 0;
      for (let i = 0; i < f.length; i++) {
        const r = Math.hypot(pts[i * 2] / rx, pts[i * 2 + 1] / ry);
        f[i] = feather(r, lo, hi);
        sum += f[i];
      }
      rings.push({
        level: lvl,
        points: Float32Array.from(pts),
        feather: f,
        meanFeather: sum / f.length,
        area,
      });
    }
  }
  rings.sort((a, b) => a.level - b.level || b.area - a.area);
  return rings;
}
