import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { IconSun, IconSnowflake, IconMenu2 } from '@tabler/icons-react';
import pinsConfig from '../data/pins.json';
import { useTerrain } from '../summit/useTerrain.js';
import SummitModel from '../summit/SummitModel.jsx';
import DetailCard, { CardBody } from './DetailCard.jsx';
import { STAGE } from '../summit/theme.js';
import { sceneEnvelope, makeScene } from '../summit/scene.js';
import { LINKS } from './stops.js';
import { useSite, ThemeToggle } from '../site/site.jsx';
import { MenuSheet, PrimaryNav } from '../site/SiteHeader.jsx';
import { IconTent, IconFlag } from '@tabler/icons-react';

const LIVE_QUERY = '(pointer: fine) and (min-width: 768px)';

function useMedia(q) {
  const [m, setM] = useState(() => (typeof matchMedia === 'function' ? matchMedia(q).matches : true));
  useEffect(() => {
    const mq = matchMedia(q);
    const h = () => setM(mq.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [q]);
  return m;
}

const hero = {
  name: 'Howdy, I’m Macie!',
  tag: 'Finding the clearest route through hard problems.',
  role: 'Senior Product Designer',
};

/** "Finding the clearest route through hard problems." with the map's route drawn under the phrase. */
function RouteTagline({ small = false }) {
  const route = (
    <span className="home__route-word">
      clearest route
      <span className="home__route" aria-hidden="true"><i className="home__route-ring" /><i className="home__route-trail" /><i className="home__route-dot" /></span>
    </span>
  );
  // phones: a shorter line that fits on one row, with the drawn route under "clearest route"
  if (small) {
    return <p className="home__tagline home__tagline--sm home__tagline--one">Finding the {route} to hard problems.</p>;
  }
  return <p className="home__tagline">I love finding the {route} to the hardest problems.</p>;
}

/* ------------------------------------------------------------------------ */
function DesktopHome({ theme, setTheme }) {
  const terrain = useTerrain(theme, pinsConfig);
  const stops = pinsConfig[theme].stops;
  const [active, setActive] = useState(0); // every visit starts at the Welcome / trailhead stop
  const prev = useRef(undefined);
  const [fitState, setFit] = useState({ k: 1, top: STAGE.y, left: 0 });
  const { k, top, left, dialX, dialY, mapBottom } = fitState;
  const mainRef = useRef(null);
  const headerRef = useRef(null);
  const envelope = useMemo(() => (terrain ? sceneEnvelope(terrain.g, terrain.rings, terrain.pins) : null), [terrain]);

  // Fit the stage: the highest any pin reaches over a full turn stays below the hero
  // text, the dial stays on screen, and the stage stays left of the detail card.
  useLayoutEffect(() => {
    const fit = () => {
      const vw = mainRef.current ? mainRef.current.clientWidth : window.innerWidth;
      const vh = window.innerHeight;
      const headerBottom = headerRef.current ? headerRef.current.getBoundingClientRect().bottom : 270;
      const env = envelope ?? { top: 30, bottom: 690 };
      const clearTop = headerBottom + 18;        // gap under the tagline route
      const span = env.bottom - env.top;         // model height at k = 1
      const freeW = vw - 33 - 420 - 24;         // room left of the card
      const kW = freeW / STAGE.w;
      const kH = (vh - 44 - clearTop) / span;   // 44: room for the hint under the map
      const kk = Math.max(0.5, Math.min(1.1, kW, kH));
      // centre the dial in the free column so the gap is shared on both sides
      const cx = (terrain?.g.render.center[0] ?? 470) - STAGE.x;
      const lft = Math.max(0, freeW / 2 - cx * kk);
      const tp = clearTop - env.top * kk;
      const cy = (terrain?.g.render.center[1] ?? 610) - STAGE.y;
      setFit({ k: kk, top: tp, left: lft, dialX: lft + cx * kk, dialY: tp + cy * kk, mapBottom: tp + env.bottom * kk });
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [envelope, terrain]);

  const select = useCallback((i) => {
    setActive((cur) => { prev.current = cur; return i; });
  }, []);

  // ←/→ step the active stop
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); select(Math.min(stops.length - 1, active + 1)); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); select(Math.max(0, active - 1)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, stops.length, select]);

  // theme crossfade (300 ms)
  const switchTheme = (t) => {
    if (t === theme) return;
    prev.current = undefined; // the new mountain draws in and drops its pin again
    setTheme(t);
  };

  const hint = theme === 'winter' ? 'Start at Mary Jane Base · drag to rotate' : 'Start at the Boulder Field · drag to rotate';
  const place = theme === 'winter' ? 'WINTER PARK' : 'BOULDER, CO · 5,430 FT';

  return (
    <main className="home" ref={mainRef}>
      <header className="home__header" ref={headerRef}>
        <a className="mark" href="/" aria-label="Macie Linne — home"><img src="/avatar.jpg" alt="" width="40" height="40" /></a>
        <p className="home__kicker">{hero.role}</p>
        <h1 className="home__name">{hero.name}</h1>
        <RouteTagline />
      </header>

      <PrimaryNav onTheme={switchTheme} />

      <div>
        {terrain ? (
          <SummitModel
            key={theme}
            terrain={terrain}
            theme={theme}
            activeIndex={active}
            prevActive={prev.current}
            onSelect={select}
            k={k}
            top={top}
            left={left}
          />
        ) : (
          <div className="stage" style={{ width: STAGE.w * k, height: STAGE.h * k, top, left }} aria-busy="true" />
        )}
        {dialX != null && (
          <p className="home__hint home__hint--map" style={{ left: dialX, top: mapBottom + 4 }}>{hint}</p>
        )}
      </div>

      <DetailCard stops={stops} activeIndex={active} onSelect={select} centerY={dialY} badge={place} />


      <footer className="home__footer">
        <a href={LINKS.email}>macieblinne@gmail.com</a>
        <a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={LINKS.resume} target="_blank" rel="noreferrer">Resume</a>
      </footer>

    </main>
  );
}

/* ------------------------------------------------------------------------ */
/** Mobile card: same out → in swap as the desktop card, and a horizontal swipe steps the route. */
function MobileCard({ stops, active, onSelect, badge }) {
  const [shown, setShown] = useState(active);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (active === shown) return undefined;
    setLeaving(true);
    const t = setTimeout(() => { setShown(active); setLeaving(false); }, 360); // = --ml-dur-card-out
    return () => clearTimeout(t);
  }, [active, shown]);
  const step = (d) => onSelect(Math.max(0, Math.min(stops.length - 1, active + d)));
  const touch = useRef(null);
  const onTouchStart = (e) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = (e) => {
    const s = touch.current; touch.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x, dy = t.clientY - s.y;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
  };
  const stop = stops[shown];
  return (
    <div className="m-card" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <article key={stop.id} className={`card${leaving ? ' card--out' : ''}`} aria-live="polite">
        <CardBody badge={badge} stop={stop} index={shown} total={stops.length} onStep={step} compact />
      </article>
    </div>
  );
}

/** The route as a row of pins under the map: the same done / active / ahead states as the mountain. */
function RouteStepper({ stops, active, onSelect }) {
  return (
    <ol className="m-steps" aria-label="Stops on the route" style={{ '--m-steps-n': stops.length }}>
      {stops.map((s, i) => {
        const state = i < active ? 'done' : i === active ? 'active' : 'ahead';
        return (
          <li key={s.id} className={`m-steps__item m-steps__item--${state}${i === active + 1 ? ' m-steps__item--next' : ''}`}>
            <button type="button" className="m-steps__btn" onClick={() => onSelect(i)} aria-current={state === 'active' ? 'step' : undefined} aria-label={`${s.label}, ${s.sub}`}>
              <span className="m-pin" aria-hidden="true">{s.n ? s.n : s.icon === 'flag' ? <IconFlag size={16} stroke={2.2} /> : <IconTent size={16} stroke={2.2} />}</span>
              <span className="m-steps__name">{s.n ? s.label : s.id === 'trailhead' ? 'Welcome' : 'Summit'}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function MobileHome({ theme, setTheme }) {
  const [menu, setMenu] = useState(false);
  const terrain = useTerrain(theme, pinsConfig);
  const stops = pinsConfig[theme].stops;
  const [active, setActive] = useState(0); // start at Welcome
  const prev = useRef(undefined);
  const mapRef = useRef(null);
  const [fit, setFit] = useState(null);
  const envelope = useMemo(() => (terrain ? sceneEnvelope(terrain.g, terrain.rings, terrain.pins) : null), [terrain]);

  // fit the whole dial (plus compass letters) across the panel width
  useLayoutEffect(() => {
    if (!terrain || !envelope) return undefined;
    const dial = makeScene(terrain.g, terrain.rings, terrain.pins, { k: 1 }).dial;
    const place = () => {
      const w = mapRef.current?.clientWidth ?? 358;
      const kk = w / (2 * (dial.rx + 58));
      const padTop = 28; // breathing room above the summit pin
      const dialBottom = dial.cy + dial.ry + 2; // last tick of the dial
      const lft = w / 2 - dial.cx * kk, tp = padTop - envelope.top * kk;
      setFit({ k: kk, left: lft, top: tp, h: tp + dialBottom * kk + 14, viewport: { x: -lft, y: -tp + 4, w } });
    };
    place();
    const ro = new ResizeObserver(place);
    if (mapRef.current) ro.observe(mapRef.current);
    return () => ro.disconnect();
  }, [terrain, envelope]);

  const select = useCallback((i) => {
    setActive((cur) => { prev.current = cur; return i; });
  }, []);
  const switchTheme = (t) => { prev.current = undefined; setTheme(t); };
  const badge = theme === 'winter' ? 'WINTER PARK' : 'BOULDER, CO · 5,430 FT';

  return (
    <main className="m-home">
      <header className="m-header">
        <a className="m-header__brand" href="/"><span className="mark"><img src="/avatar.jpg" alt="" width="40" height="40" /></span>Macie Linne</a>
        <div className="m-header__actions">
          <button type="button" className="m-iconbtn m-iconbtn--theme" aria-label={theme === 'summer' ? 'Switch to winter theme' : 'Switch to summer theme'} onClick={() => switchTheme(theme === 'summer' ? 'winter' : 'summer')}>
            {theme === 'summer' ? <IconSun size={18} stroke={2} /> : <IconSnowflake size={18} stroke={2} />}
          </button>
          <button type="button" className="m-iconbtn" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}><IconMenu2 size={18} stroke={2} /></button>
        </div>
        <MenuSheet open={menu} onClose={() => setMenu(false)} />
      </header>

      <section>
        <p className="home__kicker">{hero.role}</p>
        <h1 className="m-name">{hero.name}</h1>
        <RouteTagline small />
      </section>

      {/* one piece: the live mountain, the route stepper and the stop's card */}
      <section className="m-explore" aria-label="The route">
        <div className="m-map" ref={mapRef} style={fit ? { height: fit.h } : undefined}>
          {terrain && fit ? (
            <SummitModel
              key={theme}
              terrain={terrain}
              theme={theme}
              activeIndex={active}
              prevActive={prev.current}
              onSelect={select}
              k={fit.k}
              top={fit.top}
              left={fit.left}
              viewport={fit.viewport}
            />
          ) : <div className="m-map__loading" aria-busy="true" />}
        </div>
        <p className="m-map__hint" aria-hidden="true">Drag to turn the mountain</p>
        <RouteStepper stops={stops} active={active} onSelect={select} />
        <MobileCard stops={stops} active={active} onSelect={select} badge={badge} />
      </section>

      <footer className="m-footer">
        <a href={LINKS.email}>macieblinne@gmail.com</a>
        <a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={LINKS.resume} target="_blank" rel="noreferrer">Resume</a>
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------------ */
export default function Home() {
  const { theme, setTheme } = useSite();
  const live = useMedia(LIVE_QUERY);
  return live ? <DesktopHome theme={theme} setTheme={setTheme} /> : <MobileHome theme={theme} setTheme={setTheme} />;
}
