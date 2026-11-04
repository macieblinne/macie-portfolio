// Detail-card content per route stop (Figma "Spec — Detail cards" + Concept 09 frames).
export const LINKS = {
  email: 'mailto:macieblinne@gmail.com',
  linkedin: 'https://www.linkedin.com/in/macielinne/',
  resume: 'https://drive.google.com/file/d/18RwrD40HIoAH-8A2pi2zbzpjL-0hyQ6o/view',
  site: 'macielinne.design',
};

export const STOP_CONTENT = {
  trailhead: {
    art: { kind: 'welcome', sticker: 'Welcome!', title: 'Howdy there \u{1F920}' },
    headline: 'Tap a pin!',
    body: 'Each pin is a stop on the climb: two case studies on the way up, and a chance to say hi at the summit.',
    cta: { label: 'Start the journey', action: 'next' },
  },
  flexomics: {
    title: 'Flexomics',
    art: { kind: 'image', src: '/flexomics-ui.png', stickerTl: '0\u21921', stickerBr: 'Life science' },
    headline: 'Hours of cross-referencing, now two clicks',
    impact: 'Turned three disconnected research tools into one platform, shipped in 12 weeks.',
    cta: { label: 'Read the case study', href: '/work/flexomics' },
  },
  accio3d: {
    title: 'Accio3D',
    art: { kind: 'image', src: '/accio-ui.png', stickerTl: '0\u21921', stickerBr: 'AI / Procurement' },
    headline: 'An AI marketplace for parts nobody makes anymore',
    impact: 'Designed the POC the CEO used to close a seed round, then a lean MVP.',
    cta: { label: 'Read the case study', href: '/work/accio3d' },
  },
  summit: {
    title: 'The Summit',
    art: { kind: 'photo', src: '/self.jpg', stickerTl: 'Say hello!' },
    headline: 'You made it. Let\u2019s work together.',
    body: 'Taking something from zero to one, or figuring out where AI belongs in your product? I\u2019d love to hear about it.',
    cta: { label: 'Drop me a line', href: LINKS.email, icon: 'mail' },
  },
};

/** Mobile stepper rows (Figma "Mobile — Summit Model"). */
/** Mobile stepper rows mirror the pin plates: title = name, sub = place · elevation (pins.json). */
export const MOBILE_ROWS = {};
