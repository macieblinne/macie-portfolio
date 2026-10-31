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

const TITLES = {
  '/': 'Macie Linne — Product Designer',
  '/work': 'Selected work — Macie Linne',
  '/work/flexomics': 'Flexomics case study — Macie Linne',
  '/work/accio3d': 'Accio3D case study — Macie Linne',
  '/about': 'About — Macie Linne',
};

function Routes() {
  const { path } = useRouter();
  useGlobalLinkInterception();
  useEffect(() => { document.title = TITLES[path] ?? 'Off route — Macie Linne'; }, [path]);
  if (path === '/') return <Home />;
  if (path === '/work') return <WorkIndex />;
  if (path === '/work/flexomics') return <CaseStudy slug="flexomics" />;
  if (path === '/work/accio3d') return <CaseStudy slug="accio3d" />;
  if (path === '/about') return <About />;
  return <NotFound />;
}

function Shell() {
  const { notesOpen, closeNotes } = useSite();
  // Loading screen: first visit of the session only, until fonts are ready (min 900ms so it reads)
  const [loading, setLoading] = useState(() => { try { return !sessionStorage.getItem('ml:loaded'); } catch { return false; } });
  const [mounted, setMounted] = useState(loading);
  useEffect(() => {
    if (!loading) return;
    const t0 = performance.now();
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      setTimeout(() => { setLoading(false); try { sessionStorage.setItem('ml:loaded', '1'); } catch { /* noop */ } }, Math.max(0, 900 - (performance.now() - t0)));
    });
  }, [loading]);
  useEffect(() => { if (!loading && mounted) { const t = setTimeout(() => setMounted(false), 400); return () => clearTimeout(t); } }, [loading, mounted]);
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
