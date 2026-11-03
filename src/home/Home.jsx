import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { IconSun, IconSnowflake, IconMenu2 } from '@tabler/icons-react';
import pinsConfig from '../data/pins.json';
import { useTerrain } from '../summit/useTerrain.js';
import SummitModel from '../summit/SummitModel.jsx';
import DetailCard, { CardBody } from './DetailCard.jsx';
import { STAGE } from '../summit/theme.js';
import { sceneEnvelope } from '../summit/scene.js';
import { LINKS, MOBILE_ROWS } from './stops.js';
import { useSite, ThemeToggle } from '../site/site.jsx';
import { MenuSheet, PrimaryNav } from '../site/SiteHeader.jsx';
import { IconTent, IconFlag, IconChevronRight } from '@tabler/icons-react';

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
  tag: 'Curious about everything & intentional about what I create',
  meta: 'Product Designer · 7+ years building 0→1 · Healthcare, Biotech, Enterprise',
};

/* ------------------------------------------------------------------------ */
function DesktopHome({ theme, setTheme }) {
  const terrain = useTerrain(theme, pinsConfig);
  const stops = pinsConfig[theme].stops;
  const [active, setActive] = useState(1); // "01 active" is the resting state in Figma
  const prev = useRef(undefined);
  const [fitState, setFit] = useState({ k: 1, top: STAGE.y, left: 0 });
  const { k, top, left } = fitState;
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
      const clearTop = headerBottom + 14;        // gap under the hint line
      const span = env.bottom - env.top;         // model height at k = 1
      const freeW = vw - 33 - 420 - 24;         // room left of the card
      const kW = freeW / STAGE.w;
      const kH = (vh - 16 - clearTop) / span;
      const kk = Math.max(0.5, Math.min(1.1, kW, kH));
      // centre the dial in the free column so the gap is shared on both sides
      const cx = (terrain?.g.render.center[0] ?? 470) - STAGE.x;
      const lft = Math.max(0, freeW / 2 - cx * kk);
      setFit({ k: kk, top: clearTop - env.top * kk, left: lft });
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

  const hint = theme === 'winter' ? 'Start at the base · drag to rotate' : 'Start at the trailhead · drag to rotate';
  const place = theme === 'winter' ? 'WINTER PARK' : 'BOULDER, CO · 5,430 FT';

  return (
    <main className="home" ref={mainRef}>
      <header className="home__header" ref={headerRef}>
        <a className="mark" href="/" aria-label="Macie Linne — home">ML</a>
        <h1 className="home__name">{hero.name}</h1>
        <p className="home__tag">{hero.tag}</p>
        <p className="home__meta">{hero.meta}</p>
        <p className="home__hint">{hint}</p>
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
        <div className="stage__stickers" style={{ position: 'absolute', top: 'auto', bottom: 28 }}>
          <span className="sticker sticker--tilt-l">{place}</span>
          <span className="sticker sticker--chartreuse sticker--tilt-r">0→1 SPECIALIST</span>
        </div>
      </div>

      <DetailCard stops={stops} activeIndex={active} onSelect={select}>
        <footer className="home__footer">
          <a href={LINKS.email}>{theme === 'winter' ? 'macie@macielinne.design' : LINKS.site}</a>
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={LINKS.resume}>Resume</a>
        </footer>
      </DetailCard>

    </main>
  );
}

/* ------------------------------------------------------------------------ */
function MobileHome({ theme, setTheme }) {
  const [menu, setMenu] = useState(false);
  const stops = pinsConfig[theme].stops;
  const [active, setActive] = useState(1);
  const [svg, setSvg] = useState({});
  const file = pinsConfig[theme].terrain.replace('.json', '.svg');

  useEffect(() => {
    if (svg[file]) return;
    fetch(`/terrain/${file}`).then((r) => r.text()).then((t) => setSvg((s) => ({ ...s, [file]: t })));
  }, [file, svg]);

  const row = (s) => MOBILE_ROWS[s.id] ?? { title: s.label, sub: s.sub };
  const activeStop = stops[active];

  return (
    <main className="m-home">
      <header className="m-header">
        <a className="m-header__brand" href="/"><span className="mark">ML</span>Macie Linne</a>
        <div className="m-header__actions">
          <button type="button" className="m-iconbtn m-iconbtn--theme" aria-label={theme === 'summer' ? 'Switch to winter theme' : 'Switch to summer theme'} onClick={() => setTheme(theme === 'summer' ? 'winter' : 'summer')}>
            {theme === 'summer' ? <IconSun size={18} stroke={2} /> : <IconSnowflake size={18} stroke={2} />}
          </button>
          <button type="button" className="m-iconbtn" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}><IconMenu2 size={18} stroke={2} /></button>
        </div>
        <MenuSheet open={menu} onClose={() => setMenu(false)} />
      </header>

      <section>
        <h1 className="m-name">{hero.name}</h1>
        <p className="m-tag">{hero.tag}</p>
        <p className="m-meta">{hero.meta}</p>
      </section>

      <figure className="m-thumb" aria-label="Contour map of the route">
        {Object.entries(svg).map(([f, markup]) => (
          <div key={f} className="m-thumb__img" style={{ opacity: f === file ? 1 : 0 }} dangerouslySetInnerHTML={{ __html: markup }} />
        ))}
        <figcaption className="m-thumb__plate">
          <span className="plate"><span className="plate__title">You are here</span><span>·</span><span className="plate__title">{STOP_LABEL(activeStop)}</span></span>
        </figcaption>
      </figure>

      <section className="m-route" aria-label="The route">
        <span className="eyebrow m-route__label">The route</span>
        {stops.map((s, i) => {
          const state = i < active ? 'done' : i === active ? 'active' : 'ahead';
          const r = row(s);
          return (
            <div key={s.id} className={`m-stop m-stop--${state}`}>
              <div className="m-stop__rail">
                <span className="m-pin" aria-hidden="true">{s.n ? s.n : s.icon === 'flag' ? <IconFlag size={16} stroke={2.2} /> : <IconTent size={16} stroke={2.2} />}</span>
              </div>
              <button type="button" className="m-stop__row" aria-expanded={state === 'active'} onClick={() => setActive(i)}>
                <span>{r.title}<small>{r.sub}</small></span>
                <IconChevronRight size={18} stroke={2} />
              </button>
              {state === 'active' && (
                <div className="m-stop__card">
                  <article className="card">
                    <CardBody stop={s} index={i} total={stops.length} onStep={(d) => setActive(Math.max(0, Math.min(stops.length - 1, i + d)))} compact />
                  </article>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <div className="m-stickers">
        <span className="sticker sticker--tilt-l">{theme === 'winter' ? 'WINTER PARK' : 'BOULDER, CO · 5,430 FT'}</span>
        <span className="sticker sticker--chartreuse sticker--tilt-r">0→1 SPECIALIST</span>
      </div>

      <footer className="m-footer">
        <a href={LINKS.email}>macie@macielinne.design</a>
        <a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={LINKS.resume}>Resume</a>
      </footer>
    </main>
  );
}

function STOP_LABEL(s) {
  const n = s.n ? `${s.n} ` : '';
  const place = s.sub.split('·')[0].trim();
  return `${n}${s.n ? place : s.label.split('·')[0].trim()}`;
}

/* ------------------------------------------------------------------------ */
export default function Home() {
  const { theme, setTheme } = useSite();
  const live = useMedia(LIVE_QUERY);
  return live ? <DesktopHome theme={theme} setTheme={setTheme} /> : <MobileHome theme={theme} setTheme={setTheme} />;
}
