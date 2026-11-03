// Canvas 2D painter (browser only). Dial + ticks underneath, then rings ascending.
import { themeColours, lerpColor } from './scene.js';

export function paintTerrain(ctx, scene, phi, theme, { dpr = 1, width, height, drawIn = 1, everyOther = false, rings: pre } = {}) {
  const c = themeColours(theme);
  const k = scene.k;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  // dial
  const d = scene.dial;
  ctx.beginPath();
  ctx.ellipse(d.cx, d.cy, d.rx, d.ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = c.dialFill; ctx.fill();
  ctx.lineWidth = 1.5 * k; ctx.strokeStyle = c.dialRing; ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(d.cx, d.cy, d.rx - 8 * k, d.ry - 4 * k, 0, 0, Math.PI * 2);
  ctx.lineWidth = 1 * k; ctx.globalAlpha = 0.5; ctx.stroke(); ctx.globalAlpha = 1;
  // ticks (rotate with the view so the dial reads as a compass rose)
  ctx.strokeStyle = c.dialTick; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2 + phi;
    const major = i % 6 === 0;
    const len = (major ? 14 : 7) * k;
    const x0 = d.cx + Math.cos(a) * (d.rx + 10 * k), y0 = d.cy + Math.sin(a) * (d.ry + 10 * k);
    const x1 = d.cx + Math.cos(a) * (d.rx + 10 * k + len), y1 = d.cy + Math.sin(a) * (d.ry + 10 * k + len * 0.6);
    ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
  }
  ctx.stroke();

  // rings
  const rings = pre ?? scene.projectRings(phi);
  ctx.lineJoin = 'round';
  ctx.lineWidth = 1;
  const n = rings.length;
  const upto = Math.ceil(n * drawIn);
  for (let r = 0; r < upto; r++) {
    if (everyOther && r % 2 === 1 && r !== n - 1) continue;
    const ring = rings[r];
    const xy = ring.xy;
    ctx.beginPath();
    ctx.moveTo(xy[0], xy[1]);
    for (let i = 2; i < xy.length; i += 2) ctx.lineTo(xy[i], xy[i + 1]);
    ctx.closePath();
    ctx.globalAlpha = ring.alpha;
    ctx.fillStyle = theme === 'winter' ? lerpColor(c.contourFillLo, c.contourFillHi, ring.t) : c.contourFillLo;
    ctx.fill();
    ctx.strokeStyle = c.contourStroke;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
