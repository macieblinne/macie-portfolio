// Detail-card content per route stop (Figma "Spec — Detail cards" + Concept 09 frames).
export const LINKS = {
  email: 'mailto:macieblinne@gmail.com',
  linkedin: 'https://www.linkedin.com/in/macielinne/',
  resume: '/resume.pdf',
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
    headline: 'From three fragmented tools to one research platform',
    impact: 'Replaced hours of manual data reconstruction with one continuous research workflow.',
    cta: { label: 'Read the case study', href: '/work/flexomics' },
  },
  accio3d: {
    title: 'Accio3D',
    art: { kind: 'image', src: '/accio-ui.png', stickerTl: '0\u21921', stickerBr: 'AI / Procurement' },
    headline: 'An AI-powered procurement platform from POC to MVP',
    impact: 'Closed a seed round with the POC, then shipped a 50-screen MVP in 13 weeks.',
    cta: { label: 'Read the case study', href: '/work/accio3d' },
  },
  summit: {
    title: 'The Summit',
    art: { kind: 'photo', src: '/self.jpg', stickerTl: 'Say hello!' },
    headline: 'You made it. Let\u2019s work together.',
    body: 'Taking something from zero to one, or figuring out where AI belongs in your product? I\u2019d love to hear about it.',
    cta: { label: 'Start a conversation', href: LINKS.email },
  },
};

/** Mobile stepper rows (Figma "Mobile — Summit Model"). */
/** Mobile stepper rows mirror the pin plates: title = name, sub = place · elevation (pins.json). */
export const MOBILE_ROWS = {};
