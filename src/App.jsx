import { useState, useEffect, useCallback, useRef } from 'react';
import { IconHeart } from '@tabler/icons-react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import WorkModal from './components/WorkModal';
import AboutModal from './components/AboutModal';
import AIModal from './components/AIModal';
import DesignSystem from './components/DesignSystem';
import { CursorProvider } from './components/Cursor';

const pages = {
  work: WorkModal,
  about: AboutModal,
  ai: AIModal,
  ds: DesignSystem,
};

const EXIT_MS = 420;
const ENTER_MS = 680;

export default function App() {
  const [activePage, setActivePage] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [exitingPage, setExitingPage] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [navTarget, setNavTarget] = useState(null);
  const [projectOpen, setProjectOpen] = useState(false);
  const [initialProjectId, setInitialProjectId] = useState(null);
  const [projectOrigin, setProjectOrigin] = useState(null); // 'home' | 'work'
  const pageRef = useRef(null);

  const openPage = useCallback((id) => {
    if (transitioning) return;
    if (activePage === id) return;

    // Close (Home button or close)
    if (!id) {
      if (!activePage) return;
      setTransitioning(true);
      setNavTarget(null);
      setExitingPage(activePage);
      setActivePage(null);
      setTimeout(() => {
        setExitingPage(null);
        setTransitioning(false);
      }, EXIT_MS);
      return;
    }

    // Switch between pages
    if (activePage) {
      setTransitioning(true);
      setNavTarget(id);
      setIsSwitching(true);
      setExitingPage(activePage);
      setActivePage(null);
      setTimeout(() => {
        setExitingPage(null);
        setActivePage(id);
        pageRef.current?.scrollTo(0, 0);
      }, EXIT_MS);
      setTimeout(() => {
        setIsSwitching(false);
        setTransitioning(false);
      }, EXIT_MS + ENTER_MS);
      return;
    }

    // Open from home
    setTransitioning(true);
    setNavTarget(id);
    setActivePage(id);
    setTimeout(() => {
      pageRef.current?.scrollTo(0, 0);
      setTransitioning(false);
    }, ENTER_MS);
  }, [transitioning, activePage]);

  const closePage = useCallback(() => openPage(null), [openPage]);

  const openProject = useCallback((projectId) => {
    setProjectOrigin('home');
    setInitialProjectId(projectId);
    openPage('work');
  }, [openPage]);

  const handleProjectClose = useCallback(() => {
    if (projectOrigin === 'home') {
      setProjectOrigin(null);
      setInitialProjectId(null);
      setProjectOpen(false);
      closePage();
    } else {
      window.dispatchEvent(new Event('closeProject'));
    }
  }, [projectOrigin, closePage]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && activePage) closePage(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePage, activePage]);

  // Hash-based access to the DS page (visit /#ds)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'ds') {
        setActivePage('ds');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activePage ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activePage]);

  const PageContent = activePage ? pages[activePage] : null;
  const isOpen = !!activePage;
  const homeHidden = isOpen || isSwitching;

  return (
    <CursorProvider>
      <a href="#main" className="skip-link">Skip to main content</a>

      {/* Home layer — recedes when page opens */}
      <div className={`page-home ${homeHidden ? 'page-home-exit' : ''}`}>
        <main id="main">
          <Hero onOpenModal={openPage} onOpenProject={openProject} />
        </main>
        <footer className="page-footer" aria-label="Site footer">
          <IconHeart size={14} stroke={1.75} className="page-footer-heart" aria-hidden="true" />
          <span className="page-footer-text">Built with love and Cursor. In that order.</span>
        </footer>
      </div>

      {/* Content layer — swipes up from bottom */}
      {(activePage || exitingPage) && (() => {
        const shownId = activePage || exitingPage;
        const Shown = pages[shownId];
        return (
          <div
            key={shownId}
            className={`page-content ${exitingPage ? 'page-content-exit' : 'page-content-enter'}`}
            ref={pageRef}
          >
            {Shown && <Shown onProjectOpenChange={setProjectOpen} initialProjectId={initialProjectId} />}
            {!projectOpen && (
              <footer className="page-footer" aria-label="Site footer">
                <IconHeart size={14} stroke={1.75} className="page-footer-heart" aria-hidden="true" />
                <span className="page-footer-text">Built with love and Cursor. In that order.</span>
              </footer>
            )}
          </div>
        );
      })()}

      {projectOpen ? (
        <button
          className="project-close-btn"
          onClick={handleProjectClose}
          aria-label="Close project"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ) : (
        <Nav onOpenModal={openPage} activeModal={navTarget ?? activePage} />
      )}
    </CursorProvider>
  );
}
