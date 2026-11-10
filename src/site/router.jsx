// Tiny client router (no dependency). Vercel rewrites every path to index.html
// (vercel.json); static files under /public are served before the rewrite.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { runViewTransition } from './motion.js';

const NAV_ORDER = ['/', '/work', '/about'];
/** forward = deeper, or further right in the nav; back = the opposite. */
function direction(from, to) {
  const depth = (p) => (p === '/' ? 0 : p.split('/').length - 1);
  if (depth(to) !== depth(from)) return depth(to) > depth(from) ? 'forward' : 'back';
  const top = (p) => '/' + (p.split('/')[1] ?? '');
  const a = NAV_ORDER.indexOf(top(from)), b = NAV_ORDER.indexOf(top(to));
  if (a !== -1 && b !== -1 && a !== b) return b > a ? 'forward' : 'back';
  return 'forward';
}

const RouterCtx = createContext({ path: '/', navigate: () => {} });

export function RouterProvider({ children }) {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/+$/, '') || '/');
  const pathRef = useRef(path);
  pathRef.current = path;

  // Every route change is a view transition: the old page exits, the new one enters,
  // and elements that share a view-transition-name (header, nav pill, project shots) morph.
  const go = useCallback((next, after) => {
    const from = pathRef.current;
    if (next === from) { after?.(); return; }
    runViewTransition(() => {
      flushSync(() => setPath(next));
      after?.();
    }, { type: 'page', dir: direction(from, next) });
  }, []);

  useEffect(() => {
    const onPop = () => go(window.location.pathname.replace(/\/+$/, '') || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [go]);

  const navigate = useCallback((to, { replace = false } = {}) => {
    const url = new URL(to, window.location.href);
    if (url.origin !== window.location.origin) { window.location.href = to; return; }
    const next = url.pathname.replace(/\/+$/, '') || '/';
    // remember where a case study was opened from, so its back link returns there
    // (case study → next case study keeps the original origin)
    const from = pathRef.current;
    const origin = from.startsWith('/work/') ? (window.history.state?.origin ?? '/work') : from;
    const state = { from, origin };
    if (replace) window.history.replaceState(state, '', url); else window.history.pushState(state, '', url);
    go(next, () => {
      if (url.hash) document.querySelector(url.hash)?.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, [go]);

  return <RouterCtx.Provider value={{ path, navigate }}>{children}</RouterCtx.Provider>;
}

export const useRouter = () => useContext(RouterCtx);

/** <Link to="/work">: client-side navigation for internal paths; plain <a> otherwise. */
export function Link({ to, onClick, children, ...rest }) {
  const { navigate } = useRouter();
  const internal = typeof to === 'string' && to.startsWith('/') && !to.startsWith('//') && !/\.(pdf|png|jpe?g|svg|gif)$/i.test(to);
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (!internal || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || rest.target) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Intercept plain <a href="/..."> clicks anywhere (e.g. pin buttons that set location). */
export function useGlobalLinkInterception() {
  const { navigate } = useRouter();
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.target || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('/') || href.startsWith('//') || /\.(pdf|png|jpe?g|svg|gif)$/i.test(href)) return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);
}
