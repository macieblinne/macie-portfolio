// Site-wide state: theme (summer/winter) and the AI field-notes drawer.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
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

  const setTheme = useCallback((t) => setThemeState(t === 'winter' ? 'winter' : 'summer'), []);
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

export function ThemeToggle({ theme, setTheme }) {
  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      <button type="button" className="theme-toggle__btn" aria-pressed={theme === 'summer'} aria-label="Summer (dark) theme" onClick={() => setTheme('summer')}><IconSun size={14} stroke={2.2} /></button>
      <button type="button" className="theme-toggle__btn" aria-pressed={theme === 'winter'} aria-label="Winter (light) theme" onClick={() => setTheme('winter')}><IconSnowflake size={14} stroke={2.2} /></button>
    </div>
  );
}

export const LINKS = {
  email: 'mailto:macie@macielinne.design',
  emailLabel: 'macie@macielinne.design',
  linkedin: 'https://www.linkedin.com/in/macielinne/',
  resume: '/resume.pdf',
  site: 'macielinne.design',
};
