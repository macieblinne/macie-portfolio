// Longs Peak contour model (north view) for the system screens — Loading + 404.
// Path data is pre-projected by the src/summit pipeline (see terrainData.js);
// colours come from theme tokens in system.css, so it follows summer/winter.
import { RINGS, LEVELS } from './terrainData.js';

// Figma "Dial inner" / "Dial ring" (frame coords): centre 470,606
const DIAL = { cx: 470, cy: 606, rx: 430, ry: 200, irx: 421.4, iry: 196 };
const SPAN = LEVELS[1] - LEVELS[0] || 1;

/**
 * @param {'draw'|'static'} mode  draw = stroke-draw in elevation order, then fill (loading)
 * @param {string} viewBox        crop of the 1440×900 design frame
 */
export default function SystemTerrain({ mode = 'static', viewBox, className = '', children }) {
  const draw = mode === 'draw';
  return (
    <svg className={`sys-terrain sys-terrain--${mode} ${className}`} viewBox={viewBox} aria-hidden="true" focusable="false">
      <ellipse className="sys-terrain__dial-inner" cx={DIAL.cx} cy={DIAL.cy} rx={DIAL.irx} ry={DIAL.iry} />
      <ellipse className="sys-terrain__dial-ring" cx={DIAL.cx} cy={DIAL.cy} rx={DIAL.rx} ry={DIAL.ry} />
      {draw && (
        <g className="sys-terrain__ghost">
          {RINGS.map(([d], i) => <path key={i} d={d} />)}
        </g>
      )}
      <g className="sys-terrain__rings">
        {RINGS.map(([d, level, t], i) => (
          <path
            key={i}
            d={d}
            pathLength={draw ? 1 : undefined}
            className={level % 200 === 0 ? 'is-index' : undefined}
            style={{ '--t': t, '--o': (level - LEVELS[0]) / SPAN }}
          />
        ))}
      </g>
      {children}
    </svg>
  );
}
