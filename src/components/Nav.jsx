import { useEffect, useState } from 'react';
import { IconHome, IconBriefcase2, IconUser, IconSparkles } from '@tabler/icons-react';
import styles from './Nav.module.css';

const TABS = [
  { id: null, label: 'Home', Icon: IconHome },
  { id: 'work', label: 'Work', Icon: IconBriefcase2 },
  { id: 'about', label: 'About', Icon: IconUser },
  { id: 'ai', label: 'AI', Icon: IconSparkles },
];

export default function Nav({ onOpenModal, activeModal }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  const rawIndex = TABS.findIndex((t) => t.id === activeModal);
  const activeIndex = rawIndex === -1 ? 0 : rawIndex;

  // Reset collapsed state whenever the active page changes (new page starts at top)
  useEffect(() => {
    setCollapsed(false);
  }, [activeModal]);

  useEffect(() => {
    const getScroller = () =>
      document.querySelector('.page-content') || document.scrollingElement;

    const onScroll = () => {
      const s = getScroller();
      const top = s === window || !s ? window.scrollY : s.scrollTop;
      setCollapsed(top > 80);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    const page = document.querySelector('.page-content');
    page?.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const mo = new MutationObserver(() => {
      const next = document.querySelector('.page-content');
      if (next) next.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      page?.removeEventListener('scroll', onScroll);
      mo.disconnect();
    };
  }, []);

  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <div className={`${styles.pill} ${collapsed ? styles.pillCollapsed : ''}`}>
        <span className={styles.logo} aria-label="Macie Linne">
          <img src="/self.jpg" alt="" className={styles.logoImg} draggable={false} />
        </span>
        <span className={styles.divider} aria-hidden="true" />
        {TABS.map((tab, i) => {
          const Icon = tab.Icon;
          const expanded = !collapsed || hoverIndex === i || activeIndex === i;
          return (
            <button
              key={tab.label}
              className={`${styles.tab} ${activeIndex === i ? styles.active : ''} ${expanded ? styles.tabExpanded : styles.tabCollapsed}`}
              onClick={() => onOpenModal(tab.id)}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              aria-label={tab.label}
            >
              <Icon size={16} stroke={1.75} className={styles.tabIcon} aria-hidden="true" />
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

