// Detail-card content per route stop (Figma "Spec — Detail cards" + Concept 09 frames).
export const LINKS = {
  email: 'mailto:macieblinne@gmail.com',
  linkedin: 'https://www.linkedin.com/in/macielinne/',
  resume: '/resume.pdf',
  site: 'macielinne.design',
};

export const STOP_CONTENT = {
  trailhead: {
    title: 'Welcome',
    tag: 'Start here',
    art: { kind: 'welcome', stickerTl: 'WELCOME', stickerBr: 'BOULDER FIELD · 12,760 FT' },
    headline: 'Welcome to the route.',
    meta: ['Senior product designer', 'Boulder, CO'],
    steps: {
      label: 'How to hike it',
      items: [
        'Two stops, then the summit. Tap a pin to open one.',
        'The route turns orange behind you as you go.',
        'Drag the mountain to look around, or use ← → to step through.',
      ],
    },
    cta: { label: 'Start the route', action: 'next' },
    next: null,
  },
  flexomics: {
    title: 'Flexomics',
    tag: 'Life science',
    art: { kind: 'image', src: '/flexomics-ui.png', stickerTl: '0→1', stickerBr: 'LIFE SCIENCE' },
    headline: 'From three fragmented tools to one research platform',
    meta: ['Lead product designer', '2024 — 2025'],
    impact: {
      stats: [
        { value: '12', label: 'weeks to MVP' },
        { value: '3→1', label: 'tools unified' },
        { value: '1M+', label: 'cells per run' },
      ],
      text: 'Replaced hours of manual data reconstruction with one continuous research workflow, delivered in 12 weeks.',
    },
    cta: { label: 'Read the case study', href: '/work/flexomics' },
    next: '02 Accio3D',
  },
  accio3d: {
    title: 'Accio3D',
    tag: 'AI · Procurement',
    art: { kind: 'image', src: '/accio-ui.png', stickerTl: '0→1', stickerBr: 'AI / PROCUREMENT' },
    headline: 'An AI-powered procurement platform from POC to MVP',
    meta: ['Founding designer', '13 weeks · MVP'],
    impact: {
      stats: [
        { value: '13', label: 'weeks to MVP' },
        { value: '50', label: 'screens shipped' },
        { value: '2', label: 'apps' },
      ],
      text: 'Closed a seed round with the POC, then shipped a 50-screen MVP in 13 weeks.',
    },
    cta: { label: 'Read the case study', href: '/work/accio3d' },
    next: 'Summit',
  },
  summit: {
    title: 'The Summit',
    tag: 'Let\u2019s work together',
    art: { kind: 'photo', src: '/self.jpg', stickerTl: 'SAY HELLO!', stickerBr: 'SUMMIT · 14,259 FT' },
    headline: 'You made it. Let\u2019s work together.',
    meta: null,
    list: {
      label: 'Good reasons to reach out',
      items: [
        'You\u2019re taking something from zero to one and want a designer in the room early',
        'You\u2019re deciding where AI belongs in your product, and where it doesn\u2019t',
        'You just want to talk shop: prototypes, design systems, or trail running',
      ],
    },
    cta: { label: 'Start a conversation', href: LINKS.email },
    next: 'links',
  },
};

/** Mobile stepper rows (Figma "Mobile — Summit Model"). */
/** Mobile stepper rows mirror the pin plates: title = name, sub = place · elevation (pins.json). */
export const MOBILE_ROWS = {};
