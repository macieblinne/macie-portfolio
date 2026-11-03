// Compass letter placement (pure). Each letter starts just outside the dial rim in
// its direction and walks outward until its box is clear of the terrain silhouette
// (projected contour rings), the pins and the page furniture. A letter that can't
// find clear space within reach is hidden rather than drawn over something.

function pointInPoly(x, y, xy) {
  let inside = false;
  for (let i = 0, j = xy.length - 2; i < xy.length; j = i, i += 2) {
    const xi = xy[i], yi = xy[i + 1], xj = xy[j], yj = xy[j + 1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function boundsOf(xy) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < xy.length; i += 2) {
    const x = xy[i], y = xy[i + 1];
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return { x0, y0, x1, y1 };
}

const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

/**
 * @param anchors  [{ label, ux, uy }] unit direction of each letter on the dial ellipse
 * @param dial     { cx, cy, rx, ry }
 * @param rings    projected rings [{ xy: Float32Array, alpha }]
 * @param obstacles stage-space rects [{ x, y, w, h }]
 * @param bounds   stage rect letters must stay inside
 * @returns [{ label, x, y, box, visible }] x/y = letter centre, box = its stage rect
 */
export function placeCompass(anchors, dial, rings, obstacles, bounds, k = 1, size = { w: 40, h: 34 }) {
  const solid = [];
  for (const r of rings) if (r.alpha > 0.2) solid.push({ xy: r.xy, b: boundsOf(r.xy) });
  const onTerrain = (x, y) => {
    for (const s of solid) {
      if (x < s.b.x0 || x > s.b.x1 || y < s.b.y0 || y > s.b.y1) continue;
      if (pointInPoly(x, y, s.xy)) return true;
    }
    return false;
  };
  const { w, h } = size;
  const out = [];
  for (const a of anchors) {
    let placed = null;
    for (let d = 26 * k; d <= 240 * k; d += 6 * k) {
      const x = dial.cx + a.ux * (dial.rx + d);
      const y = dial.cy + a.uy * (dial.ry + d * (dial.ry / dial.rx) * 1.6);
      const box = { x: x - w / 2, y: y - h / 2, w, h };
      if (box.x < bounds.x || box.y < bounds.y || box.x + w > bounds.x + bounds.w || box.y + h > bounds.y + bounds.h) break;
      if (obstacles.some((o) => hit(box, o)) || out.some((o) => o.visible && hit(box, o.box))) continue;
      const pts = [[x, y], [box.x + 3, box.y + 3], [box.x + w - 3, box.y + 3], [box.x + 3, box.y + h - 3], [box.x + w - 3, box.y + h - 3]];
      if (pts.some(([px, py]) => onTerrain(px, py))) continue;
      placed = { label: a.label, x, y, box, visible: true };
      break;
    }
    out.push(placed ?? { label: a.label, x: dial.cx + a.ux * (dial.rx + 26 * k), y: dial.cy + a.uy * (dial.ry + 26 * k), visible: false });
  }
  return out;
}
