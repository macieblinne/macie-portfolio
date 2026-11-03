// Label placement for the Summit Model (pure).
// Greedy candidate search: every plate tries right/left of its pin at a few
// vertical offsets; candidates are scored by overlap with already-placed labels,
// every pin head and stem, and the stage bounds. A hysteresis term keeps a label
// on the side it used last frame so rotating doesn't make labels flicker.

function overlap(a, b) {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

function outside(r, bounds) {
  const inside = overlap(r, bounds);
  return r.w * r.h - inside;
}

const OFFSETS = [0, -1, 1, -2, 2, -3, 3, -4, 4, -5];
const OVERLAP_W = 60; // any real overlap outweighs every layout preference

/**
 * @param {Array<{x:number, yc:number, r:number, gy:number, stem:number}>} pins
 *        pin head centre (x, yc) + radius r; stem runs from yc+r down to gy.
 * @param {Array<{pin:number, w:number, h:number, kind:'plate'|'sticker'}>} labels
 *        in priority order (placed first wins).
 * @param {object} prev  map label key → previous candidate { side, off }
 * @param {{x,y,w,h}} bounds  allowed area
 * @param {number} k   stage scale
 * @param {Array<{x,y,w,h}>} obstacles  stage-space rects labels must avoid
 * @returns {Record<string,{x:number,y:number,side:'left'|'right',off:number}>}
 */
export function placeLabels(pins, labels, prev, bounds, k = 1, obstacles = []) {
  const placed = [...obstacles]; // fixed page furniture (hero text, card) counts as already placed
  const out = {};
  const gap = 12 * k;

  const heads = pins.map((p) => ({ x: p.x - p.r - 4 * k, y: p.yc - p.r - 4 * k, w: 2 * p.r + 8 * k, h: 2 * p.r + 8 * k }));
  const stems = pins.map((p) => ({ x: p.x - 3 * k, y: p.yc + p.r, w: 6 * k, h: Math.max(0, p.gy - p.yc - p.r) }));

  for (const L of labels) {
    const p = pins[L.pin];
    const step = L.h * 0.6;
    let best = null;
    for (const side of ['right', 'left', 'above']) {
      if (side === 'above' && L.kind === 'sticker') continue;
      for (const o of OFFSETS) {
        let x, y;
        if (side === 'above') {
          // centred over the pin head, stepping sideways instead of vertically
          x = p.x - L.w / 2 + o * L.w * 0.35;
          y = p.yc - p.r - gap * 0.5 - L.h;
        } else if (L.kind === 'sticker') {
          // hangs off the lower edge of the active pin, like the Figma frame
          x = side === 'right' ? p.x + p.r * 0.6 : p.x - p.r * 0.6 - L.w;
          y = p.yc + p.r * 0.35 + o * step;
        } else {
          x = side === 'right' ? p.x + p.r + gap : p.x - p.r - gap - L.w;
          y = p.yc - L.h / 2 + o * step;
        }
        const r = { x, y, w: L.w, h: L.h };
        let hit = 0;
        const rr = { x: r.x - 4, y: r.y - 4, w: r.w + 8, h: r.h + 8 }; // keep 4px of air between labels
        for (const q of placed) hit += overlap(rr, q);
        heads.forEach((h, i) => { if (!(L.kind === 'sticker' && i === L.pin)) hit += overlap(r, h); });
        stems.forEach((s, i) => { if (i !== L.pin) hit += overlap(r, s) * 0.4; });
        hit += outside(r, bounds) * 1.5;
        let score = hit * OVERLAP_W;
        score += Math.abs(o) * step * 12;                    // stay level with the pin
        if (side === 'left') score += 120;                   // Figma default: labels to the right
        if (side === 'above') score += 900;                  // last resort before overlapping
        const pv = prev[L.key];
        if (pv && (pv.side !== side || pv.off !== o)) score += pv.side !== side ? 2600 : 900; // hysteresis: ties only
        if (!best || score < best.score) best = { score, x, y, side, off: o, r, hit };
      }
    }
    placed.push(best.r);
    out[L.key] = { x: best.x, y: best.y, side: best.side, off: best.off, hit: best.hit };
  }
  return out;
}
