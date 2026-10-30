# Summit Model — live terrain render pipeline

Target: option 3 — a fully draggable, live-rendered contour mountain on the home page.
This is the same pipeline that produced the Figma mountains, written for the browser.

Files in this folder
- `longs-peak.json` — 60×42 elevation grid (summer / dark theme) + render params
- `mary-jane.json` — 64×48 elevation grid (winter / light theme) + render params
- `pins.json` — stops (lat/lon), labels, route / lift definitions per theme
- `../tokens/tokens.css` — colors, motion durations, pin sizes

---

## 0. Architecture in one paragraph

Load the grid once (≈3 k ints, ~12 KB gz). At startup run marching squares per contour
level → chain segments into closed polylines → Catmull-Rom smooth → cache the result in
**map space** (metres east/north, elevation). That geometry never changes. Per frame you
only apply a 2-D projection (rotate by azimuth φ, squash, lift by elevation) and paint
polygons back-to-front with the ground colour so higher contours occlude lower ones.
Projection of ~25 levels × ~2–6 polygons × ~150 points is cheap; Canvas 2D handles it at
60 fps on a phone. Pins are projected through the same function so they stay seated.

```
grid.json ──► iso(level) ──► chain ──► smooth ──► MAP-SPACE CACHE (once)
                                                         │
          pointer / inertia ──► φ ──► project(φ) ──► paint (every frame)
                                              └──► pins / route / labels (DOM, absolutely positioned)
```

## 1. Data

```ts
type Grid = { cols:number; rows:number; latMin:number; latMax:number;
              lonMin:number; lonMax:number; zMin:number; zMax:number;
              contourStep:number; render: RenderParams; z: string /* csv */ };
const z = Float32Array.from(grid.z.split(',').map(Number));   // row-major, row 0 = south
const Z = (i:number,j:number) => z[j*grid.cols + i];           // i = col (x/east), j = row (y/north)
```

Convert grid indices to metres so the mountain has true proportions:

```ts
const latMid = (grid.latMin+grid.latMax)/2;
const mPerDegLat = 111_320;
const mPerDegLon = 111_320 * Math.cos(latMid*Math.PI/180);
const cellX = (grid.lonMax-grid.lonMin)/(grid.cols-1) * mPerDegLon;  // metres per col
const cellY = (grid.latMax-grid.latMin)/(grid.rows-1) * mPerDegLat;  // metres per row
```

Bilinear sample for seating pins (`zAt`) and for sub-cell smoothing:

```ts
function zAt(lat:number, lon:number){
  const fi = (lon-grid.lonMin)/(grid.lonMax-grid.lonMin)*(grid.cols-1);
  const fj = (lat-grid.latMin)/(grid.latMax-grid.latMin)*(grid.rows-1);
  const i=Math.floor(fi), j=Math.floor(fj), u=fi-i, v=fj-j;
  return (1-u)*(1-v)*Z(i,j) + u*(1-v)*Z(i+1,j) + (1-u)*v*Z(i,j+1) + u*v*Z(i+1,j+1);
}
```

## 2. Contours (run once, off the main thread if you like)

Levels: `for (lvl = zMin; lvl <= zMax; lvl += contourStep)`.

**Marching squares** per level: for each cell (i,j) classify the 4 corners (≥ lvl → 1),
look up the 16-case table, interpolate crossing points along edges
(`t = (lvl - zA)/(zB - zA)`). Resolve saddle cases (5, 10) with the cell centre mean.
Output unordered segments.

**Chain** segments into polylines by matching endpoints (hash on rounded coords).
Open polylines that hit the grid edge get closed along the edge so every level becomes a
fillable ring (this is what lets higher plates occlude lower ones).

**Smooth** each ring with centripetal Catmull-Rom (α = 0.5), 4 sub-samples per segment,
then drop points closer than 0.6 px at the base scale. Store as `Float32Array` of
(xMetres, yMetres) pairs, plus `level`.

**Rim feather** (the fix for the "cut plates" look): compute each ring point's normalised
radius `r` from the grid centre (0 = centre, 1 = grid edge, use an ellipse matching the
grid aspect). Multiply the point's lift and its fill alpha by
`feather(r) = r < 0.72 ? 1 : smoothstep(1, 0.72, r)`. The mountain fades into the dial
instead of ending in a cliff.

Cache result: `{ level, points: Float32Array, feather: Float32Array }[]`, sorted ascending.

## 3. Projection (every frame)

```ts
// params from grid.render
const { squash: SQ, pxPerMeterZ: PXM, pxPerKm, center:[CX,CY] } = grid.render;
const S = pxPerKm/1000;  // px per metre, horizontal
function project(xm:number, ym:number, zm:number, phi:number, lift=1){
  const c=Math.cos(phi), s=Math.sin(phi);
  const xr =  xm*c - ym*s;
  const yr =  xm*s + ym*c;
  return [ CX + xr*S,
           CY + yr*S*SQ - (zm - grid.zMin)*PXM*lift ];
}
```

`phi` is the view azimuth in radians; `grid.render.viewAzimuthDeg` is the Figma default
(180° for Longs = viewed from due north, 135° for Mary Jane). Pointer drag adds to φ.
Scale `S` and `CX/CY` by the viewport (the Figma numbers assume 1440×900 with the mountain
left of the detail card). On the 390 layout the mountain is a static thumbnail — render
once to an offscreen canvas and don't attach drag.

## 4. Paint order & style (Canvas 2D)

For each level ascending:
1. `beginPath`, trace the projected ring, `closePath`.
2. `fill` with the ground colour (`--contour-fill`, graded by level in winter:
   lerp `blue-200 → blue-100` over zMin→zMax).
3. `stroke` with `--contour-stroke` at 1 px (0.45 espresso in winter, 0.30 blue in summer).
4. Multiply global alpha by the ring's mean feather for the outer levels.

Because each higher ring is filled with opaque ground colour, lower contour lines behind
the slope are hidden automatically — that's the pseudo-3D. No depth sort needed beyond
"ascending level". Draw the dial ellipse and ticks underneath, before the terrain.

Pins, stems, route and label plates are **DOM elements** positioned with the same
`project()` output each frame (`transform: translate3d`). They keep real text, focus
rings and tap targets; the canvas stays purely decorative (`aria-hidden`). The route is
one SVG `<path>` overlaying the canvas, rebuilt from projected stop positions, with
`stroke-dasharray` driving the done/ahead split (see tokens: `--ml-dash-route`).

## 5. Interaction

- **Drag**: pointer events on the canvas wrapper. `dφ = dx * 0.006 rad/px`. Track velocity
  over the last 80 ms; on release apply inertia `φ += v; v *= 0.92` until |v| < 1e-4.
  Clamp nothing — free 360° rotation is fine; labels flip to stay left-to-right readable
  when their anchor crosses the vertical centre.
- **Tap a pin**: animate φ toward the azimuth that puts that pin facing the camera
  (`target = baseAzimuth + atan2(pin.y - centre.y, pin.x - centre.x)`), clamped to ±20°
  from the base view so the mountain never shows its back by accident. 600 ms
  `--ml-ease-standard`. Route fill, pin promote/demote and card swap follow the timing
  table in the Figma "Spec — Pin states & transitions" frame (also in tokens.css).
- **Keyboard**: pins are `<button>`s in route order; ←/→ step the active stop; Enter opens
  the case study. Focus ring = `--focus`, 2 px, 4 px offset. Drag is a pointer-only
  flourish; nothing depends on it.
- **Reduced motion**: skip rotation/inertia and contour draw-in; crossfade pins/card
  (200 ms). The `prefers-reduced-motion` block in tokens.css zeroes the durations.
- **Loading**: on first paint animate `stroke-dashoffset` per ring in ascending level
  order over 1.2 s, then fade fills in, then drop the active pin from −120 px with a
  spring. Cache the smoothed geometry in `sessionStorage` so this only costs once.

## 5b. Mobile (< 768 px): static, no interaction

Decision: the live canvas is **desktop/pointer only**. On phones and small tablets:

- Render the mountain **once at build time** to an SVG (run the same pipeline in a Node
  script → `public/terrain/longs-peak.svg`, `mary-jane.svg`, each with pins/route baked at
  the default azimuth and the "01 active" state). ~30–60 KB each, cached forever.
- Show it in the `Mountain thumbnail` card from the mobile design with the "You are here"
  hint. No drag, no inertia, no rotation; nothing listens to touch on it. The stepper
  below is the navigation.
- Gate by `(pointer: fine) and (min-width: 768px)` → mount `TerrainCanvas`; otherwise
  `<img>` the SVG. Hybrid laptops with touch still get the live version via pointer events.
- Theme toggle on mobile just swaps the two SVGs (crossfade 300 ms).

This removes the frame-time degrade path, the touch-scroll conflict, and the worker
requirement for phones. The only mobile cost is one image.

## 6. Performance budget (desktop only)

- Geometry build: ≤ 40 ms on a mid phone (do it in a Web Worker or `requestIdleCallback`;
  show the dial + hint immediately, terrain fades in when ready).
- Per frame: ~25 levels × ≤ 600 points projected and painted. Keep the canvas at
  `devicePixelRatio` capped to 2. Skip painting when φ hasn't changed.
- If `frameTime > 20 ms` for 10 consecutive frames, drop to every-other-level contours
  while dragging, restore on release. Below 360 px wide, render once (static).
- Bundle: no three.js. Canvas 2D + ~300 lines of TypeScript. Grids ~25 KB total gz.

## 7. Theme switch

Both grids are loaded lazily per theme. Switching sun ↔ snowflake crossfades the two
canvases (300 ms) while the pins re-seat through the other grid's `zAt` — their DOM
nodes persist, only positions animate. Winter also draws the three lifts from `pins.json`
(`chairs` style = thin line with 10 px circles every 48 px; `dotted` = `--ml-dash-route`).

## 8. Suggested file layout (Next.js on the existing Vercel project)

```
app/(site)/page.tsx            // home: <SummitModel/> + <DetailCard/>
components/summit/useTerrain.ts   // load grid, build + cache geometry (worker)
components/summit/project.ts      // project(), zAt(), feather()
components/summit/TerrainCanvas.tsx
components/summit/Pins.tsx        // buttons, stems, plates, route <svg>
components/summit/useDial.ts      // drag, inertia, tap-to-face, reduced-motion
public/terrain/longs-peak.json
public/terrain/mary-jane.json
public/terrain/pins.json
styles/tokens.css
```

Everything above is deterministic from the JSON, so the Figma frames and the build will
match — same grids, same params.
