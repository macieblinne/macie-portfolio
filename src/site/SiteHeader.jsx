// Inner-page header (Work, About, case studies, 404): ML mark + name on the left,
// nav pill + theme toggle on the right. Below 768px it collapses to theme + menu
// buttons and a menu sheet (same pattern as the home page's mobile header).
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IconMenu2, IconX, IconSun, IconSnowflake } from '@tabler/icons-react';
import { Link, useRouter } from './router.jsx';
import { useSite, ThemeToggle, LINKS } from './site.jsx';

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
];

export function isCurrent(path, to) {
  return to === '/' ? path === '/' : path === to || path.startsWith(to + '/');
}

/** Full-screen menu sheet for phones; shared by the home page's mobile header. */
export function MenuSheet({ open, onClose }) {
  const { path } = useRouter();
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="menu-sheet" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="menu-sheet__top">
        <Link to="/" className="site-header__brand" onClick={onClose}><span className="mark">ML</span>Macie Linne</Link>
        <button type="button" className="m-iconbtn" aria-label="Close menu" onClick={onClose} autoFocus><IconX size={18} stroke={2} /></button>
      </div>
      <nav className="menu-sheet__nav" aria-label="Primary">
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} onClick={onClose} aria-current={isCurrent(path, n.to) ? 'page' : undefined}>{n.label}</Link>
        ))}
      </nav>
      <div className="menu-sheet__foot">
        <a href={LINKS.email}>{LINKS.emailLabel}</a>
        <a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={LINKS.resume}>Resume</a>
      </div>
    </div>
  );
}

/**
 * Primary nav pill (home + inner pages). The active tab's background is a separate
 * indicator under the labels, so on route change it slides (view transition
 * `nav-pill`) while each label stays put and just changes colour.
 */
export function PrimaryNav({ className = '', onTheme }) {
  const { path } = useRouter();
  const { theme, setTheme } = useSite();
  const navRef = useRef(null);
  const [pill, setPill] = useState(null);
  useLayoutEffect(() => {
    const measure = () => {
      const a = navRef.current?.querySelector('.nav__item[aria-current="page"]');
      setPill(a ? { left: a.offsetLeft, top: a.offsetTop, width: a.offsetWidth, height: a.offsetHeight } : null);
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [path]);
  return (
    <nav ref={navRef} className={`nav ${className}`} aria-label="Primary">
      {pill && <span className="nav__pill" aria-hidden="true" style={pill} />}
      {NAV.map((n) => (
        <Link
          key={n.to}
          className="nav__item"
          to={n.to}
          aria-current={isCurrent(path, n.to) ? 'page' : undefined}
          style={{ viewTransitionName: `nav-${n.label.toLowerCase()}` }}
        >
          {n.label}
        </Link>
      ))}
      <ThemeToggle theme={theme} setTheme={onTheme ?? setTheme} />
    </nav>
  );
}

export default function SiteHeader() {
  const { theme, setTheme } = useSite();
  const [menu, setMenu] = useState(false);
  return (
    <header className="site-header">
      <Link to="/" className="site-header__brand" aria-label="Macie Linne — home"><span className="mark">ML</span>Macie Linne</Link>
      <PrimaryNav className="nav--inline" />
      <div className="site-header__mobile">
        <button type="button" className="m-iconbtn m-iconbtn--theme" aria-label={theme === 'summer' ? 'Switch to winter theme' : 'Switch to summer theme'} onClick={() => setTheme(theme === 'summer' ? 'winter' : 'summer')}>
          {theme === 'summer' ? <IconSun size={18} stroke={2} /> : <IconSnowflake size={18} stroke={2} />}
        </button>
        <button type="button" className="m-iconbtn" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}><IconMenu2 size={18} stroke={2} /></button>
      </div>
      <MenuSheet open={menu} onClose={() => setMenu(false)} />
    </header>
  );
}
