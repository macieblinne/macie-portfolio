#!/usr/bin/env node
// Renders the mobile mountain thumbnails once at build time with the same
// pipeline the browser uses. Output: public/terrain/{longs-peak,mary-jane}.svg
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseGrid, buildContours } from '../src/summit/contours.js';
import { seatPins } from '../src/summit/scene.js';
import { renderSvg } from '../src/summit/renderSvg.js';
import { STAGE } from '../src/summit/theme.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public', 'terrain');
const pinsAll = JSON.parse(fs.readFileSync(path.join(dir, 'pins.json'), 'utf8'));

const argTheme = process.argv[2]; // optional: only one theme
for (const theme of ['summer', 'winter']) {
  if (argTheme && argTheme !== theme) continue;
  const cfg = pinsAll[theme];
  const grid = JSON.parse(fs.readFileSync(path.join(dir, cfg.terrain), 'utf8'));
  const g = parseGrid(grid);
  const rings = buildContours(g);
  const pins = seatPins(g, cfg.stops);
  const svg = renderSvg({
    g, rings, pins, theme,
    activeIndex: 0, // the page opens at Welcome
    lifts: cfg.lifts ?? [],
    k: 1,
    origin: [STAGE.x, STAGE.y],
    width: STAGE.w, height: STAGE.h,
    simplify: 3,
    crop: [30, 20, 940, 660], // tighter framing for the 390 thumbnail card
  });
  const out = path.join(dir, cfg.terrain.replace('.json', '.svg'));
  fs.writeFileSync(out, svg);
  console.log(`${path.relative(root, out)}  ${(svg.length / 1024).toFixed(0)} KB  ${rings.length} rings`);
}
