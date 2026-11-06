import { useEffect, useState } from 'react';
import Home from './home/Home.jsx';
import WorkIndex from './pages/work/WorkIndex.jsx';
import CaseStudy from './pages/case-study/CaseStudy.jsx';
import About from './pages/about/About.jsx';
import NotFound from './pages/system/NotFound.jsx';
import LoadingScreen from './pages/system/LoadingScreen.jsx';
import AINotesDrawer from './pages/ai/AINotesDrawer.jsx';
import { RouterProvider, useRouter, useGlobalLinkInterception } from './site/router.jsx';
import { SiteProvider, useSite } from './site/site.jsx';
import { useScrollReveal } from './site/motion.js';

const TITLES = {
  '/': 'Macie Linne — Product Designer',
  '/work': 'Selected work — Macie Linne',
  '/work/flexomics': 'Flexomics case study — Macie Linne',
  '/work/accio3d': 'Accio3D case study — Macie Linne',
  '/work/accelerate': 'Accelerate Diagnostics case study — Macie Linne',
  '/about': 'About — Macie Linne',
};

function Routes() {
  const { path } = useRouter();
  useGlobalLinkInterception();
  useScrollReveal(path);
  useEffect(() => { document.title = TITLES[path] ?? 'Off route — Macie Linne'; }, [path]);
  if (path === '/') return <Home />;
  if (path === '/work') return <WorkIndex />;
  if (path === '/work/flexomics') return <CaseStudy slug="flexomics" />;
  if (path === '/work/accio3d') return <CaseStudy slug="accio3d" />;
  if (path === '/work/accelerate') return <CaseStudy slug="accelerate" />;
  if (path === '/about') return <About />;
  return <NotFound />;
}

function Shell() {
  const { notesOpen, closeNotes } = useSite();
  // Loading screen: first visit of the session only, until fonts are ready — held long enough
  // for the full choreography (contours draw 2.6 s, pin lands ≈2.65 s, fill settles ≈3.2 s)
  const [loading, setLoading] = useState(() => { try { return !sessionStorage.getItem('ml:loaded'); } catch { return false; } });
  const [mounted, setMounted] = useState(loading);
  useEffect(() => {
    if (!loading) return;
    const t0 = performance.now();
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      setTimeout(() => { setLoading(false); try { sessionStorage.setItem('ml:loaded', '1'); } catch { /* noop */ } }, Math.max(0, 2400 - (performance.now() - t0)));
    });
  }, [loading]);
  // pages hold their entrance choreography while the loading screen is up (motion.css)
  useEffect(() => {
    const root = document.documentElement;
    if (loading) root.dataset.loading = ''; else delete root.dataset.loading;
  }, [loading]);
  useEffect(() => { if (!loading && mounted) { const t = setTimeout(() => setMounted(false), 750); return () => clearTimeout(t); } }, [loading, mounted]);
  return (
    <>
      <Routes />
      <AINotesDrawer open={notesOpen} onClose={closeNotes} />
      {mounted && <LoadingScreen visible={loading} />}
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <SiteProvider>
        <Shell />
      </SiteProvider>
    </RouterProvider>
  );
}
