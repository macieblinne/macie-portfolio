// Theme constants that the canvas / SVG renderers need as literal values
// (canvas can't read CSS custom properties cheaply per frame). Mirrors tokens.css.
export const THEMES = {
  summer: {
    bg: '#231915',
    ground: '#2A1E19',
    contourFillLo: '#2A1E19',
    contourFillHi: '#2A1E19',
    contourStroke: 'rgba(185,214,227,0.30)',
    dialRing: 'rgba(124,148,97,0.75)',   // green (compass) — map contours unchanged
    dialTick: 'rgba(124,148,97,0.6)',
    dialFill: 'rgba(42,30,25,0.6)',
    compass: '#7C9461',   // green-700 lifted for contrast on the dark ground
    routeDone: '#C9CC52',
    routeAhead: '#FFFFFF',
    pinDoneBg: '#FFFFFF', pinDoneFg: '#35321F', pinDoneStem: '#C9CC52',
    pinActiveBg: '#C9CC52', pinActiveFg: '#35321F', pinActiveStem: '#FFFFFF',
    pinAheadBg: '#2F211C', pinAheadFg: '#FFFFFF', pinAheadStem: '#FFFFFF',
    pinRing: '#FFFFFF',
    liftLine: 'rgba(255,255,255,0.6)',
  },
  winter: {
    bg: '#B9D6E3',
    ground: '#EAF2F6',
    contourFillLo: '#CFE0E9',
    contourFillHi: '#EAF2F6',
    contourStroke: 'rgba(47,33,28,0.45)',
    dialRing: 'rgba(60,79,44,0.85)',   // --ml-green-700
    dialTick: 'rgba(60,79,44,0.65)',
    dialFill: 'rgba(234,242,246,0.7)',
    compass: '#3C4F2C',   // --ml-green-700
    routeDone: '#C9CC52',
    routeAhead: '#2F211C',
    pinDoneBg: '#FFFFFF', pinDoneFg: '#35321F', pinDoneStem: '#C9CC52',
    pinActiveBg: '#C9CC52', pinActiveFg: '#35321F', pinActiveStem: '#2F211C',
    pinAheadBg: '#2F211C', pinAheadFg: '#FFFFFF', pinAheadStem: '#2F211C',
    pinRing: '#FFFFFF',
    liftLine: 'rgba(47,33,28,0.7)',
  },
};

export function lerpColor(a, b, t) {
  const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/** Stem lengths (design px) per stop id, from the Figma frame. */
export const STEM = { trailhead: 90, flexomics: 100, accio3d: 120, accelerate: 135, summit: 150 };

/** Stage: the slice of the 1440×900 Figma frame that holds the mountain. */
export const STAGE = { x: 0, y: 180, w: 1000, h: 720 };
