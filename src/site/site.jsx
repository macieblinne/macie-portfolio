// Site-wide state: theme (summer/winter) and the AI field-notes drawer.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { runViewTransition } from './motion.js';
import { IconSun, IconSnowflake } from '@tabler/icons-react';

const THEME_KEY = 'ml:theme';
const SiteCtx = createContext(null);

export function SiteProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) === 'winter' ? 'winter' : 'summer'; } catch { return 'summer'; }
  });
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* noop */ }
  }, [theme]);

  // summer ↔ winter: the new theme grows out of the click point as a circle (view transition)
  const setTheme = useCallback((t) => {
    const next = t === 'winter' ? 'winter' : 'summer';
    if (next === document.documentElement.getAttribute('data-theme')) return;
    runViewTransition(() => {
      flushSync(() => setThemeState(next));
      document.documentElement.setAttribute('data-theme', next); // snapshot must see the new theme
    }, { type: 'theme' });
  }, []);
  const openNotes = useCallback(() => setNotesOpen(true), []);
  const closeNotes = useCallback(() => setNotesOpen(false), []);

  return (
    <SiteCtx.Provider value={{ theme, setTheme, notesOpen, openNotes, closeNotes }}>
      {children}
    </SiteCtx.Provider>
  );
}

/** { theme, setTheme, notesOpen, openNotes, closeNotes } */
export const useSite = () => useContext(SiteCtx);

export function ThemeToggle({ theme, setTheme, className = '' }) {
  return (
    <div className={`theme-toggle ${className}`.trim()} role="group" aria-label="Theme" data-active={theme}>
      <button type="button" className="theme-toggle__btn" aria-pressed={theme === 'summer'} aria-label="Summer (dark) theme" onClick={() => setTheme('summer')}><IconSun size={14} stroke={2.2} /></button>
      <button type="button" className="theme-toggle__btn" aria-pressed={theme === 'winter'} aria-label="Winter (light) theme" onClick={() => setTheme('winter')}><IconSnowflake size={14} stroke={2.2} /></button>
    </div>
  );
}

export const LINKS = {
  email: 'mailto:macieblinne@gmail.com',
  emailLabel: 'macieblinne@gmail.com',
  linkedin: 'https://www.linkedin.com/in/macielinne/',
  resume: 'https://drive.google.com/file/d/1nHpTH34iXJP_N6cSz1H2vp-CtGrWzPjW/view?usp=sharing',
  site: 'macielinne.design',
};
