// Tiny client router (no dependency). Vercel rewrites every path to index.html
// (vercel.json); static files under /public are served before the rewrite.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const RouterCtx = createContext({ path: '/', navigate: () => {} });

export function RouterProvider({ children }) {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/+$/, '') || '/');

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname.replace(/\/+$/, '') || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    const url = new URL(to, window.location.href);
    if (url.origin !== window.location.origin) { window.location.href = to; return; }
    const next = url.pathname.replace(/\/+$/, '') || '/';
    if (replace) window.history.replaceState({}, '', url); else window.history.pushState({}, '', url);
    setPath(next);
    if (url.hash) requestAnimationFrame(() => document.querySelector(url.hash)?.scrollIntoView());
    else window.scrollTo(0, 0);
  }, []);

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
