// Static SVG renderer (pure) — used at build time for the mobile thumbnail.
import { makeScene, themeColours, lerpColor } from './scene.js';
import { STAGE } from './theme.js';
import { DEG } from './project.js';

const ICON = {
  tent: 'M11 14l4 6h6l-9 -16l-9 16h6l4 -6',
  flag: 'M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1 -7 0a5 5 0 0 0 -7 0v-9zM5 21v-7',
};

function fmt(n) { return Math.round(n * 10) / 10; }

function ringPath(xy, simplify = 0) {
  let d = `M${fmt(xy[0])} ${fmt(xy[1])}`;
  let lx = xy[0], ly = xy[1];
  for (let i = 2; i < xy.length; i += 2) {
    if (simplify && Math.hypot(xy[i] - lx, xy[i + 1] - ly) < simplify) continue;
    d += `L${fmt(xy[i])} ${fmt(xy[i + 1])}`;
    lx = xy[i]; ly = xy[i + 1];
  }
  return d + 'Z';
}

function dialTicks(dial, c) {
  let s = '';
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const major = i % 6 === 0;
    const len = major ? 14 : 7;
    const x0 = dial.cx + Math.cos(a) * (dial.rx + 10), y0 = dial.cy + Math.sin(a) * (dial.ry + 10);
    const x1 = dial.cx + Math.cos(a) * (dial.rx + 10 + len), y1 = dial.cy + Math.sin(a) * (dial.ry + 10 + len * 0.6);
    s += `<line x1="${fmt(x0)}" y1="${fmt(y0)}" x2="${fmt(x1)}" y2="${fmt(y1)}" stroke="${c.dialTick}" stroke-width="1"/>`;
  }
  return s;
}

/**
 * @param {object} o  { g, rings, pins, theme, activeIndex, lifts, phiDeg, k, width, height, origin, compass }
 */
export function renderSvg(o) {
  const { g, rings, pins, theme, activeIndex = 1, lifts = [], compass = false } = o;
  const k = o.k ?? 1;
  const origin = o.origin ?? [STAGE.x, STAGE.y];
  const W = o.width ?? STAGE.w * k, H = o.height ?? STAGE.h * k;
  const c = themeColours(theme);
  const phi = ((o.phiDeg ?? g.render.viewAzimuthDeg) * DEG);
  const scene = makeScene(g, rings, pins, { k, origin });
  const R = scene.projectRings(phi);
  const P = scene.projectPins(phi);
  const d = scene.dial;

  const vb = o.crop ?? [0, 0, W, H];
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(fmt).join(' ')}" width="${fmt(vb[2])}" height="${fmt(vb[3])}" font-family="'Unbounded', system-ui, sans-serif">`;
  // dial
  s += `<ellipse cx="${fmt(d.cx)}" cy="${fmt(d.cy)}" rx="${fmt(d.rx)}" ry="${fmt(d.ry)}" fill="${c.dialFill}" stroke="${c.dialRing}" stroke-width="${1.5 * k}"/>`;
  s += `<ellipse cx="${fmt(d.cx)}" cy="${fmt(d.cy)}" rx="${fmt(d.rx - 8 * k)}" ry="${fmt(d.ry - 4 * k)}" fill="none" stroke="${c.dialRing}" stroke-width="${k}" opacity="0.5"/>`;
  s += dialTicks(d, c);
  // terrain (clipped to the dial, like the Figma frames)
  s += `<g stroke-width="${k}" stroke-linejoin="round">`;
  for (const r of R) {
    const fill = theme === 'winter' ? lerpColor(c.contourFillLo, c.contourFillHi, r.t) : c.contourFillLo;
    s += `<path d="${ringPath(r.xy, o.simplify ?? 0)}" fill="${fill}" stroke="${c.contourStroke}" opacity="${fmt(r.alpha)}"/>`;
  }
  s += '</g>';
  // lifts (winter)
  const byId = Object.fromEntries(P.map((p) => [p.id, p]));
  for (const l of lifts) {
    const a = byId[l.from], b = byId[l.to];
    if (!a || !b) continue;
    if (l.style === 'chairs') {
      s += `<line x1="${fmt(a.gx)}" y1="${fmt(a.gy)}" x2="${fmt(b.gx)}" y2="${fmt(b.gy)}" stroke="${c.liftLine}" stroke-width="${1.5 * k}"/>`;
      const len = Math.hypot(b.gx - a.gx, b.gy - a.gy);
      for (let t = 24 * k; t < len; t += 48 * k) {
        const u = t / len;
        s += `<circle cx="${fmt(a.gx + (b.gx - a.gx) * u)}" cy="${fmt(a.gy + (b.gy - a.gy) * u)}" r="${5 * k}" fill="none" stroke="${c.liftLine}" stroke-width="${1.5 * k}"/>`;
      }
    } else {
      s += `<line x1="${fmt(a.gx)}" y1="${fmt(a.gy)}" x2="${fmt(b.gx)}" y2="${fmt(b.gy)}" stroke="${c.liftLine}" stroke-width="${2 * k}" stroke-dasharray="0.1 ${8 * k}" stroke-linecap="round"/>`;
    }
  }
  // route
  for (let i = 0; i < P.length - 1; i++) {
    const a = P[i], b = P[i + 1];
    const done = activeIndex > i;
    if (done) s += `<line x1="${fmt(a.gx)}" y1="${fmt(a.gy)}" x2="${fmt(b.gx)}" y2="${fmt(b.gy)}" stroke="${c.routeDone}" stroke-width="${3.5 * k}" stroke-linecap="round"/>`;
    else s += `<line x1="${fmt(a.gx)}" y1="${fmt(a.gy)}" x2="${fmt(b.gx)}" y2="${fmt(b.gy)}" stroke="${c.routeAhead}" stroke-width="${3 * k}" stroke-dasharray="0.1 ${9 * k}" stroke-linecap="round"/>`;
  }
  // pins
  P.forEach((p, i) => {
    const state = i < activeIndex ? 'Done' : i === activeIndex ? 'Active' : 'Ahead';
    const bg = c[`pin${state}Bg`], fg = c[`pin${state}Fg`], stem = c[`pin${state}Stem`];
    const size = (state === 'Active' ? 64 : 52) * k * (o.pinScale ?? 1);
    const ring = (state === 'Active' ? 4 : 2.5) * k;
    s += `<line x1="${fmt(p.gx)}" y1="${fmt(p.gy)}" x2="${fmt(p.px)}" y2="${fmt(p.py)}" stroke="${stem}" stroke-width="${3 * k}" stroke-linecap="round"/>`;
    s += `<ellipse cx="${fmt(p.gx)}" cy="${fmt(p.gy)}" rx="${8 * k}" ry="${4.5 * k}" fill="${c.ground}" stroke="${stem}" stroke-width="${2 * k}"/>`;
    s += `<circle cx="${fmt(p.px)}" cy="${fmt(p.py)}" r="${fmt(size / 2)}" fill="${bg}" stroke="${c.pinRing}" stroke-width="${ring}"/>`;
    if (p.n) {
      s += `<text x="${fmt(p.px)}" y="${fmt(p.py)}" text-anchor="middle" dominant-baseline="central" font-weight="800" font-size="${fmt(size * 0.36)}" fill="${fg}">${p.n}</text>`;
    } else if (p.icon && ICON[p.icon]) {
      const is = size * 0.42;
      s += `<g transform="translate(${fmt(p.px - is / 2)} ${fmt(p.py - is / 2)}) scale(${fmt(is / 24)})"><path d="${ICON[p.icon]}" fill="none" stroke="${fg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    }
  });
  if (compass) {
    for (const l of scene.compass(phi)) {
      s += `<text x="${fmt(l.x)}" y="${fmt(l.y)}" text-anchor="middle" dominant-baseline="central" font-weight="800" font-size="${26 * k}" fill="${c.compass}">${l.label}</text>`;
    }
  }
  return s + '</svg>';
}
