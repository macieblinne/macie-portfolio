import { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

export default function Modal({ onClose, children }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    // Focus trap: focus the modal on mount
    overlayRef.current?.focus();
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span className={styles.closeBtnText}>ESC</span>
        </button>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
