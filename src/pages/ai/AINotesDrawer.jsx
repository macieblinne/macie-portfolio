// AI field-notes drawer — "How I use AI in my work".
// Built from Figma "Concept 09 — AI notes drawer (open)" (5367:6857) and
// "AI notes drawer · full scroll" (5401:8028).
// Right-side modal drawer (full-screen sheet below 768px), portalled to <body>.
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconX } from '@tabler/icons-react';
import './ai-notes.css';

const PRINCIPLES = [
  { n: '01', tone: 'orange', title: 'Craft', body: "AI surfaces endless opportunities and outputs. I keep the context, the taste, and decide what's best for users." },
  { n: '02', tone: 'chartreuse', title: 'Adaptability', body: 'AI tools change daily. What stays constant is picking things up fast, integrating without disruption, and letting go when something better arrives.' },
  { n: '03', tone: 'blue', title: 'Transparency', body: "I'm transparent with users and my teams about where AI fits in. It's a design decision always worth naming." },
  { n: '04', tone: 'green', title: 'Awareness', body: "AI doesn't manage stakeholder relationships, empathize with users, or align with teams. A fully present designer is needed for that." },
];

const USES = [
  'Generating multiple UI variations in the time it used to take me to design one',
  'Building out a design system from scratch for short projects',
  "Pressure-testing an idea early, before I've invested too much in the wrong direction",
  'Bridging the gap with engineers by handing off detailed prototypes instead of static specs',
  'Writing and communicating more clearly: briefs, specs, synthesis docs, all of it',
];

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const CLOSE_FALLBACK_MS = 400; // safety net if transitionend never fires

export default function AINotesDrawer({ open, onClose }) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const returnRef = useRef(null);
  const titleId = useId();

  // Mount on open; keep mounted through the close animation, then unmount.
  useEffect(() => {
    if (open) {
      returnRef.current = document.activeElement;
      setMounted(true);
      return undefined;
    }
    setShown(false);
    return undefined;
  }, [open]);

  // Once mounted, flip to the "shown" state on the next frame so the transition runs.
  useEffect(() => {
    if (!mounted || !open) return undefined;
    let raf2;
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [mounted, open]);

  const finishClose = useCallback(() => {
    setMounted(false);
    const el = returnRef.current;
    returnRef.current = null;
    // The opener may have unmounted (e.g. the phone menu item): fall back to the menu button.
    const target = el && el.isConnected && el !== document.body ? el : document.querySelector('button[aria-label="Open menu"]');
    target?.focus?.({ preventScroll: true });
  }, []);

  // Unmount after the slide-out finishes.
  useEffect(() => {
    if (open || !mounted || shown) return undefined;
    const panel = panelRef.current;
    const t = setTimeout(finishClose, CLOSE_FALLBACK_MS);
    const onEnd = (e) => { if (e.target === panel) { clearTimeout(t); finishClose(); } };
    panel?.addEventListener('transitionend', onEnd);
    return () => { clearTimeout(t); panel?.removeEventListener('transitionend', onEnd); };
  }, [open, mounted, shown, finishClose]);

  // While open: focus in, body scroll lock, background inert.
  useEffect(() => {
    if (!mounted || !open) return undefined;
    const { body, documentElement } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    const portalRoot = panelRef.current?.closest('.ai-root');
    const inerted = [...body.children].filter((c) => c !== portalRoot && !c.inert && c.tagName !== 'SCRIPT');
    inerted.forEach((c) => { c.inert = true; });

    closeRef.current?.focus({ preventScroll: true });
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      inerted.forEach((c) => { c.inert = false; });
    };
  }, [mounted, open]);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    if (e.key !== 'Tab') return;
    const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null || n === document.activeElement);
    if (!nodes.length) { e.preventDefault(); return; }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !panelRef.current.contains(active))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) { e.preventDefault(); first.focus(); }
  };

  if (!mounted) return null;

  return createPortal(
    <div className={`ai-root${shown ? ' ai-is-open' : ''}`} onKeyDown={onKeyDown}>
      <div className="ai-scrim" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className="ai-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="ai-head">
          <div className="ai-head__text">
            <p className="ai-eyebrow">AI practices · Field notes</p>
            <h2 id={titleId} className="ai-title">How I use AI in my work</h2>
          </div>
          <button ref={closeRef} type="button" className="ai-close" onClick={onClose} aria-label="Close field notes">
            <IconX size={16} stroke={2} aria-hidden="true" />
          </button>
        </header>

        <div className="ai-body">
          <section className="ai-section" aria-labelledby={`${titleId}-p`}>
            <h3 id={`${titleId}-p`} className="ai-eyebrow">My AI principles</h3>
            <ol className="ai-principles">
              {PRINCIPLES.map((p) => (
                <li key={p.n} className="ai-principle">
                  <span className={`ai-badge ai-badge--${p.tone}`} aria-hidden="true">{p.n}</span>
                  <div className="ai-principle__text">
                    <h4 className="ai-principle__title">{p.title}</h4>
                    <p className="ai-principle__body">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="ai-section" aria-labelledby={`${titleId}-n`}>
            <h3 id={`${titleId}-n`} className="ai-eyebrow">A note from me</h3>
            <div className="ai-note">
              <p className="ai-note__p">
                AI is still a limited technology, but in the right moments it's become a genuinely valuable partner in my
                process. I've been experimenting with it everywhere, from Midjourney for things as personal as my Christmas
                cards to Claude and ChatGPT to help me think and communicate more clearly. I'm dyslexic, and having a tool
                that helps me write with confidence has been quietly life-changing.
              </p>
              <p className="ai-note__lead">Here are a few ways I actually use it:</p>
              <ul className="ai-uses">
                {USES.map((u) => <li key={u} className="ai-use">{u}</li>)}
              </ul>
              <p className="ai-note__p">
                That said, getting my cursor into Figma is still almost always the best way to solve a design problem. The
                tools will continue to change but the reason I design won't.
              </p>
              <p className="ai-signoff">
                <span>With love,</span>
                <span className="ai-signoff__sticker">Mace</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}
