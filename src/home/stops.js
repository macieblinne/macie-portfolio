// Detail-card content per route stop (Figma "Spec — Detail cards" + Concept 09 frames).
export const LINKS = {
  email: 'mailto:macie@macielinne.design',
  linkedin: 'https://www.linkedin.com/in/macielinne/',
  resume: '/resume.pdf',
  site: 'macielinne.design',
};

export const STOP_CONTENT = {
  trailhead: {
    badge: 'TH',
    title: 'Trailhead',
    art: { kind: 'welcome', stickerTl: 'WELCOME', stickerBr: 'BOULDER FIELD · 12,760 FT' },
    headline: 'Welcome to the route.',
    meta: ['Senior product designer', 'Boulder, CO · Let’s talk'],
    block: {
      label: 'How to hike it',
      text: 'Two stops, then the summit. Tap a pin to open it; the route turns orange behind you. Drag the mountain to look around, or use ← → to step through.',
    },
    cta: { label: 'Start the route', action: 'next' },
    next: 'Next: 01 Keyhole',
  },
  flexomics: {
    badge: '01',
    title: 'Flexomics',
    art: { kind: 'image', src: '/flexomics-ui.png', stickerTl: '0→1', stickerBr: 'LIFE SCIENCE' },
    headline: 'From three fragmented tools to one research platform',
    meta: ['Lead product designer', '2024 — 2025'],
    block: {
      label: 'Impact',
      text: 'Replaced hours of manual data reconstruction with one continuous research workflow, delivered in 12 weeks.',
    },
    cta: { label: 'Read the case study', href: '/work/flexomics' },
    next: 'Next: 02 The Trough',
  },
  accio3d: {
    badge: '02',
    title: 'Accio3D',
    art: { kind: 'image', src: '/accio-ui.png', stickerTl: '0→1', stickerBr: 'MANUFACTURING' },
    headline: 'Making 3D asset management intuitive for non-technical teams',
    meta: ['Lead product designer', '2023 — present'],
    block: {
      label: 'Impact',
      text: 'Cut asset retrieval from 15+ minutes to under 30 seconds, and let non-technical teams review 3D work on their own.',
    },
    cta: { label: 'Read the case study', href: '/work/accio3d' },
    next: 'Next: Summit',
  },
  summit: {
    badge: 'S',
    title: 'The Summit',
    art: { kind: 'photo', src: '/self.jpg', stickerTl: 'SAY HELLO!', stickerBr: 'SUMMIT · 14,259 FT' },
    headline: 'You made it. Let’s work together.',
    meta: null,
    list: {
      label: 'Good reasons to reach out',
      items: [
        'You’re taking something from zero to one and want a designer in the room early',
        'You’re deciding where AI belongs in your product, and where it doesn’t',
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
