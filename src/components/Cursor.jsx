import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Cursor.module.css';

const CursorContext = createContext({ setLabel: () => {} });

export function CursorProvider({ children }) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [label, setLabel] = useState(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    const lerp = 0.16;
    const animate = () => {
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;
      currentRef.current.x += dx * lerp;
      currentRef.current.y += dy * lerp;
      setPos({ x: currentRef.current.x, y: currentRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <CursorContext.Provider value={{ setLabel }}>
      {children}
      {createPortal(
        <div
          className={`${styles.cursor} ${label ? styles.expanded : ''}`}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
          aria-hidden="true"
        >
          <span className={styles.iconSlot}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
          <div className={styles.labelSlot}>
            <span className={styles.label}>{label || ''}</span>
          </div>
        </div>,
        document.body
      )}
    </CursorContext.Provider>
  );
}

export function useCursorLabel(label) {
  const { setLabel } = useContext(CursorContext);
  return {
    onMouseEnter: () => setLabel(label),
    onMouseLeave: () => setLabel(null),
  };
}
