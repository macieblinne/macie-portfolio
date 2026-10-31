// Motion system helpers: view transitions (pages + theme) and scroll reveals.
// Patterns: View Transitions API for route changes and shared-element morphs
// (Chrome/Edge/Safari 18+/Firefox 144+, graceful no-op elsewhere), circular
// theme reveal from the pointer, IntersectionObserver reveals with sibling stagger.
// Everything collapses to instant/opacity-only under prefers-reduced-motion.
import { useLayoutEffect } from 'react';

export const reducedMotion = () => {
  try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};

// remember the last pointer position so a theme switch can grow from the click
let lastPointer = null;
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', (e) => { lastPointer = { x: e.clientX, y: e.clientY, t: performance.now() }; }, { capture: true, passive: true });
}

let running = null;

/**
 * Run a DOM update inside a view transition.
 * @param {() => void} update  must apply the change synchronously (flushSync)
 * @param {{ type: 'page'|'theme', dir?: 'forward'|'back' }} opts
 */
export function runViewTransition(update, { type = 'page', dir = 'forward' } = {}) {
  const root = document.documentElement;
  if (!document.startViewTransition || reducedMotion() && type === 'theme') { update(); return null; }
  running?.skipTransition?.();
  root.dataset.vt = type;
  root.dataset.vtDir = dir;
  let vt;
  try {
    vt = document.startViewTransition(update);
  } catch {
    delete root.dataset.vt; delete root.dataset.vtDir; update(); return null;
  }
  running = vt;
  if (type === 'theme') {
    vt.ready.then(() => {
      const p = lastPointer && performance.now() - lastPointer.t < 1500
        ? lastPointer
        : { x: innerWidth - 60, y: 60 };
      const r = Math.hypot(Math.max(p.x, innerWidth - p.x), Math.max(p.y, innerHeight - p.y));
      const dur = parseFloat(getComputedStyle(root).getPropertyValue('--ml-dur-theme')) || 1100;
      root.animate(
        { clipPath: [`circle(0px at ${p.x}px ${p.y}px)`, `circle(${r}px at ${p.x}px ${p.y}px)`] },
        { duration: dur, easing: 'cubic-bezier(.2, 0, 0, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => {});
  }
  vt.finished.finally(() => {
    if (running === vt) { running = null; delete root.dataset.vt; delete root.dataset.vtDir; }
  });
  return vt;
}

/* ------------------------------------------------------------------------ */
/* Scroll reveals                                                            */
/* ------------------------------------------------------------------------ */

// What reveals on each page. Siblings in the same parent stagger by --ml-stagger.
const REVEAL = [
  // inner-page titles
  '.wk-title', '.cs-crumbs', '.cs-hero h1', '.cs-shot--hero', '.ab-hero > *',
  // work index bands
  '.wk-band .wk-route', '.wk-band .wk-client', '.wk-band .wk-headline', '.wk-band .wk-meta',
  '.wk-band .wk-impact', '.wk-band .wk-cta', '.wk-band .wk-soon', '.wk-band .wk-shot',
  // case studies
  '.cs-stat', '.cs-waypoint', '.cs-pitch h2', '.cs-p', '.cs-quote', '.cs-lead', '.cs-card', '.cs-option',
  '.cs-media', '.cs-shot--break', '.cs-milestone', '.cs-lesson', '.cs-next',
  // about
  '.ab-label', '.ab-who', '.ab-value', '.ab-log', '.ab-kili', '.ab-notes', '.ab-badge', '.ab-summit',
  // 404
  '.sys-404 > *',
].join(',');

/** Tag reveal targets on the current page and animate them in as they enter the viewport. */
export function useScrollReveal(key) {
  // layout effect: classes land before the view transition snapshots the new page,
  // so revealed items start hidden and cascade in while the page slides in
  useLayoutEffect(() => {
    if (reducedMotion()) return undefined;
    const els = [...document.querySelectorAll(REVEAL)].filter((el) =>
      !el.closest('[data-no-reveal]') &&
      // elements that morph across routes (shots, titles) must stay visible for the morph
      !(el.style.viewTransitionName || el.querySelector('[style*="view-transition-name"]')));
    if (!els.length || !('IntersectionObserver' in window)) return undefined;

    // stagger index among revealed siblings
    const counts = new Map();
    for (const el of els) {
      const i = counts.get(el.parentElement) ?? 0;
      counts.set(el.parentElement, i + 1);
      el.style.setProperty('--rv-i', String(Math.min(i, 6)));
      // elements that already use `translate` for layout fade + de-blur only
      const cs = getComputedStyle(el);
      el.classList.add('rv', cs.translate && cs.translate !== 'none' ? 'rv--fade' : 'rv--rise');
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        el.classList.add('rv-in');
        io.unobserve(el);
        // hand the element back to its own styles once the reveal has played
        const done = (ev) => {
          if (ev && ev.target !== el) return;
          el.removeEventListener('transitionend', done);
          el.classList.remove('rv', 'rv--fade', 'rv--rise', 'rv-in');
          el.style.removeProperty('--rv-i');
        };
        el.addEventListener('transitionend', done);
        setTimeout(done, 2400);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    // wait one frame so above-the-fold items start hidden, then animate in
    const raf = requestAnimationFrame(() => els.forEach((el) => io.observe(el)));
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      els.forEach((el) => el.classList.remove('rv', 'rv--fade', 'rv--rise', 'rv-in'));
    };
  }, [key]);
}

/** Inline style that pairs an element across routes (e.g. project shot on /work ↔ case-study hero). */
export const vt = (kind, slug) => (slug ? { viewTransitionName: `${kind}-${slug}`, viewTransitionClass: kind } : undefined);
