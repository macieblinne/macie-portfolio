// Accio3D case study — copy from Figma "Work — Case study · Accio3D · Alt" (5406:7911).
// Rendered by CaseStudy.jsx; block types are documented there.
import { LINKS } from '../../site/site.jsx';

const accio3d = {
  slug: 'accio3d',
  name: 'Accio3D',
  title: 'An AI-powered procurement platform from POC to MVP',
  titleWidth: 640,
  titleTop: 176,
  titleSize: 72,
  hero: {
    image: { src: '/accio-cs/Hero.svg', alt: 'Accio3D dashboard: an AI assistant prompt, a global supplier map and recent quote notifications', width: 1440, height: 1080, scale: 1 },
    stickers: [
      { label: 'Accio3D', tone: 'white', rotate: 6, x: -6, y: 350 },
      { label: 'AI-native', tone: 'chartreuse', rotate: -4, x: 131, y: 322 },
    ],
  },
  meta: [
    { label: 'Company', value: 'Accio3D' },
    { label: 'Role', value: 'Senior Product Designer' },
    { label: 'Timeline', value: '2 phases · 13-week MVP' },
    { label: 'Scope', value: 'Blueprint · POC · 50 screens' },
  ],
  sections: [
    {
      type: 'pitch', label: 'Context', title: 'The situation', minHeight: 272,
      blocks: [
        { type: 'p', text: 'Accio3D is a marketplace for end-of-life industrial parts. When a critical component fails and the original supplier no longer exists, procurement teams are left searching manually: phone calls, spreadsheets, days of coordination.' },
        { type: 'p', text: 'Accio3D replaces that process: upload a part, AI assesses the printability of the part and matches qualified suppliers, quotes come back, an order gets placed. All in one session.' },
      ],
    },
    {
      type: 'pitch', label: 'Phase 1 · Blueprint + POC', title: 'Making the value visible', minHeight: 400,
      blocks: [
        { type: 'p', text: 'The POC had one job: show investors something they could follow without explanation. Two design decisions carried the most weight.' },
        { type: 'cards', cards: [
          { tone: 'blue', eyebrow: 'Decision 1', title: 'Printability assessment', text: 'Buyers see printability status at a glance. The path forward still required manual material and equipment input — a friction point that became central to how the screen evolved in Phase 2.' },
          { tone: 'dark', eyebrow: 'Decision 2', title: 'Supplier matching', text: 'Qualified suppliers surfaced with the context buyers need to evaluate them immediately: capabilities, geography, lead time, quality tier. Enough to act on, without any digging.' },
        ] },
      ],
    },
    {
      type: 'break',
      sticker: 'Printability assessment · recommendations by default',
      image: { src: '/accio-cs/Hero.svg', alt: 'Accio3D dashboard with AI recommendations surfaced by default', width: 1440, height: 1080, scale: 1 },
    },
    {
      type: 'pitch', label: 'Phase 1 · User validation', title: 'Testing the workflow with real users',
      blocks: [
        { type: 'p', text: 'Before the seed round closed, the client brought me back to gather user feedback and implement changes. The most important signal: the core workflow held up. Users followed it and were excited about seeing themselves using it. But one thing was clear. The Printability Assessment required too many manual selections and overrides. These were busy people coming for quick answers, not more work.' },
        { type: 'quote', text: '“Shift the burden from the user to the system.”' },
        { type: 'p', text: "That feedback directly shaped Phase 2: AI recommendations surfaced by default rather than asking buyers to drive them. When I returned for Phase 2, I wasn't starting from assumptions. I knew exactly what to protect and what to fix." },
      ],
    },
    {
      type: 'milestone',
      title: 'Seed round closed.',
      text: 'The technology showed what was possible. The design empowered our stakeholder to sell it. A full MVP was greenlit.',
      stats: [
        { value: '1', label: 'POC' },
        { value: '13', label: 'weeks' },
        { value: '50', label: 'screens' },
        { value: '2', label: 'apps' },
      ],
    },
    {
      type: 'pitch', label: 'Phase 2 · Blueprint + MVP', title: 'From proof to production', minHeight: 400,
      blocks: [
        { type: 'p', text: 'Working alongside the strategist leading the Blueprint sessions, I contributed user flow work and brought firsthand Phase 1 context directly into the scope discussions. The result: 50 screens across two applications in 13 weeks.' },
        { type: 'cards', cards: [
          { tone: 'blue', eyebrow: 'App 1', title: 'The Purchaser App', text: 'A single continuous path. Upload a part, review the assessment, send requests to suppliers, compare bids, place an order. No tool switching. No dead ends.' },
          { tone: 'dark', eyebrow: 'App 2', title: 'The Supplier App', text: 'Kept intentionally lean. Receive RFQs, submit quotes, track orders through production. Fast and reliable over feature-complete.' },
        ] },
      ],
    },
    {
      type: 'pitch', label: 'Key decision · restraint', title: 'The hardest call', minHeight: 605,
      blocks: [
        { type: 'p', text: "There was real pressure to surface AI everywhere. Every screen felt like an opportunity to show what the technology could do. The design position I held was the opposite. A procurement specialist doesn't need to see the AI working. They need an answer." },
        { type: 'fork', options: [
          { label: 'Option 1 · AI everywhere', text: 'Put the model on every screen: confidence scores, reasoning panels, live matching. Impressive in a demo; noise for a buyer who came for an answer.' },
          { label: 'Option 2 · Show the answer', text: 'Surface AI clearly, in the right moments, without explanation. Recommendations by default; the machinery stays backstage.', chosen: true },
        ] },
        { type: 'p', text: "That meant deliberate choices about where AI surfaced and how. The hardest part wasn't designing the AI interfaces. It was making the case for restraint when the appetite for more was real." },
      ],
    },
    {
      type: 'pitch', label: 'Lessons', title: 'What I took away', minHeight: 389,
      blocks: [
        { type: 'lessons', items: [
          "Knowing what the AI could do was the easy part. The real work was deciding what a buyer needed to see and what they didn't.",
          'Advocating for restraint under pressure and making the reasoning visible to a client is as important as the design work itself.',
          'Working across both phases gave me the chance to see what my own design decisions actually unlocked.',
        ] },
      ],
    },
  ],
  next: {
    eyebrow: "Next route · Summit · Let's work together",
    title: "You made it. Let's talk.",
    ghost: 'S',
    cta: 'Continue on',
    to: LINKS.email,
  },
};

export default accio3d;
