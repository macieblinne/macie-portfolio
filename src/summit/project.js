// Summit Model — 2-D projection (pure). See doc/RENDER-PIPELINE.md §3.
//
// Convention: map space is metres east (x) / north (y) of the grid centre.
// With phi = viewAzimuthDeg, 180° shows the mountain from due north
// (north edge nearest the viewer = bottom of screen), 135° from the north-east.

export const DEG = Math.PI / 180;

/** Create a projector for a grid + an on-screen scale factor k (1 = Figma 1440 layout). */
export function makeProjector(g, k = 1, origin = [0, 0]) {
  const { squash: SQ, pxPerMeterZ: PXM, pxPerKm, center } = g.render;
  const S = pxPerKm / 1000;
  const CX = (center[0] - origin[0]) * k;
  const CY = (center[1] - origin[1]) * k;
  const zMin = g.zMin;
  return {
    k, CX, CY, S: S * k, SQ, PXM: PXM * k,
    project(xm, ym, zm, phi, lift = 1) {
      const c = Math.cos(phi), s = Math.sin(phi);
      const xr = xm * c + ym * s;
      const yr = xm * s - ym * c;
      return [CX + xr * S * k, CY + yr * S * k * SQ - (zm - zMin) * PXM * k * lift];
    },
    /** Azimuth (rad) that brings a map point to the front of the dial. */
    facing(xm, ym) {
      return Math.atan2(ym, xm) + Math.PI / 2;
    },
  };
}

/** Clamp phi to within ±clampRad of base (shortest-arc aware). */
export function clampAzimuth(phi, base, clampRad) {
  let d = phi - base;
  d = Math.atan2(Math.sin(d), Math.cos(d));
  d = Math.max(-clampRad, Math.min(clampRad, d));
  return base + d;
}

/** Dial geometry in design px for a projector (ellipse matching the grid at ground level). */
export function dialGeometry(g, proj) {
  const rx = (g.widthM / 2) * proj.S * 1.04;
  const ry = rx * proj.SQ;
  return { cx: proj.CX, cy: proj.CY, rx, ry };
}
