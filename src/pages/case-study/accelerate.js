// Accelerate Diagnostics case study. Source: the Accelerate Solution Blueprint (discovery workshop
// boards, personas, architecture map v17) and the designed screens in Figma
// "Personal Development" › Accelerate Case Study (5729:7034).
// Rendered by CaseStudy.jsx; block types are documented there.
// Story strength: principle-driven decisions at instrument scale: five principles, one blueprint, 72 screens.
import { LINKS } from '../../site/site.jsx';

const A = '/case-study/accelerate';

const accelerate = {
  slug: 'accelerate',
  name: 'Accelerate Diagnostics',
  title: 'One interface for fifty tests running at once',
  titleWidth: 720,
  titleTop: 176,
  titleSize: 72,
  heroTone: 'field', // pale field-note green with ink text (11:1)
  hero: {
    image: { src: `${A}/dashboard.webp`, alt: 'Operating dashboard: four instrument modules drawn as hardware, each bay lit by run state, with warning and error flags beside the bays that need attention', width: 1200, height: 675, scale: 1 },
    stickers: [
      { label: 'Accelerate', tone: 'white', rotate: 6, x: -6, y: 350 },
      { label: 'Clinical lab', tone: 'chartreuse', rotate: -4, x: 140, y: 322 },
    ],
  },
  meta: [
    { label: 'Company', value: 'Accelerate Diagnostics' },
    { label: 'Role', value: 'Product Designer' },
    { label: 'Scope', value: '72 screens' },
    { label: 'Team', value: 'Design team · Strategist · Accelerate R&D' },
  ],
  sections: [
    {
      type: 'pitch', hook: true, waypoint: '00', label: 'The moment', count: 'Trailhead',
      blocks: [
        { type: 'lead', text: "When a patient has a serious infection, the hospital lab races to find out which antibiotic will work. Accelerate's next instrument could run fifty of those tests at once. The software had to make that feel simple for a lab that's already stretched pretty thin." },
      ],
    },
    {
      type: 'pitch', label: 'The challenge', title: 'A new instrument, a new interface',
      blocks: [
        { type: 'p', text: "Accelerate's current system ran one test per module, and its engineers repaired machines in a separate desktop tool. The new instrument needed one interface for everyone who touches it. I was the product designer on the Catalyst UX team, working with a strategist and the Accelerate team to design it, from the lab tech's dashboard to the engineers' repair tools." },
      ],
    },
    {
      type: 'pitch', label: 'The users', title: 'Who it’s for',
      blocks: [
        { type: 'p', text: "Research with Accelerate's team defined the people who would use the instrument every day. Two of them shaped most of the screens in this story." },
        { type: 'personas', people: [
          { name: 'Laura', role: 'Lab tech', photo: `${A}/persona-laura.webp`, goal: 'Get every test done on time, and get it right.', tasks: ['Watching test status', 'Loading samples', 'Reviewing results'] },
          { name: 'Sergio', role: 'Field Service Engineer', photo: `${A}/persona-sergio.webp`, goal: 'Fix machines quickly so the lab never waits.', tasks: ['Installing systems', 'Calibrating', 'Fixing errors'] },
        ] },
        { type: 'p', text: 'We also designed for Travis, the application specialist who sets up and trains each new lab.' },
      ],
    },
    {
      type: 'principles-band',
      title: 'Five principles for every screen.',
      text: 'Every screen was held to these. When a design decision got hard, they settled it.',
      items: [
        { title: 'Specific work areas', text: 'Like rooms in a house: each area has one job and the tools to do it.' },
        { title: 'Optimize the key work areas', text: 'The dashboard, where 80% of users spend 80% of their time.' },
        { title: 'Clinical processes first', text: "Flows follow the lab's real steps, not software conventions." },
        { title: 'Simplify', text: 'Each person sees only the tools their job needs, nothing more.' },
        { title: 'Expert content, simple interface', text: 'Elegant and consumer-grade, even when the subject takes expertise.' },
      ],
    },
    {
      type: 'pitch', label: 'The blueprint', title: 'A blueprint before the screens',
      blocks: [
        { type: 'principle', n: '01', text: 'Specific work areas' },
        { type: 'p', text: "Fifty tests, three kinds of users and a repair tool moving in could easily become a maze. So before designing screens, we drew up a blueprint, the way you'd plan a house. Each work area is a room with one purpose, like Runs or Results, and holds only the tools that task needs. All 72 screens had a room before they had a design." },
        { type: 'media', wide: true, src: `${A}/architecture.webp`, width: 2458, height: 1429, alt: 'Blueprint of 72 screens organized into work areas like Modules, Runs and Results, with the flows between them', caption: 'The blueprint · 72 screens' },
      ],
    },
    {
      type: 'break',
      sticker: 'Readable from across the room',
      image: { src: `${A}/dashboard-5.webp`, alt: 'Dashboard showing five instrument modules, each slot lit green, blue or red by status, with a flag beside the slot that needs attention', width: 1200, height: 675, scale: 1 },
    },
    {
      type: 'pitch', label: 'At a glance', title: 'Make the screen look like the machine',
      sticker: { photo: `${A}/persona-laura.webp`, label: 'Laura · Lab tech' },
      blocks: [
        { type: 'principle', n: '02', text: 'Optimize the key work areas' },
        { type: 'p', text: 'The old dashboard gave every test its own card. With fifty tests running at once, Laura would have to scroll through fifty cards to find the one that needed her. Every test is a patient waiting on the right antibiotic, and Laura is usually across the room running other tests. She needed to spot a problem from a distance, the moment it happens.' },
        { type: 'p', text: "The instrument's own slots light up to show their status, so I designed the dashboard to mirror them. Each slot on screen matches the one on the bench, and a bright flag appears only where she's needed." },
        { type: 'compare', wide: true, items: [
          { tag: 'Before', caption: 'One card per test', src: `${A}/legacy-dashboard.webp`, width: 554, height: 360, alt: 'Old dashboard: a light web page with one card per test' },
          { tag: 'After', caption: 'The instrument, drawn as it sits on the bench', src: `${A}/dashboard.webp`, width: 1200, height: 675, alt: 'New dashboard: instrument modules drawn as hardware, with slots lit by status and flags where attention is needed', after: true },
        ] },
        { type: 'cards', wide: true, size: 'img', layout: 'rows', cards: [
          { tone: 'blue', eyebrow: 'Tap a module', title: 'Every test in one list', text: 'Status, when results are due, and the one action that makes sense next.', image: { src: `${A}/module-runs.webp`, width: 1200, height: 675, alt: 'A module opened beside the dashboard, listing its tests with status and an action for each', caption: 'Module test list' } },
          { tone: 'blue', eyebrow: 'Tap a flag', title: 'It says what to do', text: 'A missing step shows up with its fix one tap away.', image: { src: `${A}/run-details.webp`, width: 1200, height: 675, alt: 'Test details showing a missing step and a button to fix it', caption: 'Test details' } },
        ] },
        { type: 'h3', text: 'Starting a test' },
        { type: 'principle', n: '03', text: 'Clinical processes first' },
        { type: 'p', text: 'Starting a test follows the steps techs already take at the bench: scan the patient, the broth lot and the test card, insert the card, then choose the organism. The software fills in the details from each scan and shows exactly which slot the card goes in.' },
        { type: 'steps', items: ['Scan patient', 'Scan broth lot', 'Scan card', 'Insert card', 'Choose organism', 'Done'] },
        { type: 'cards', wide: true, size: 'img', layout: 'rows-tall', cards: [
          { tone: 'blue', eyebrow: 'Scan', title: 'Scan, don’t type', text: "One scan fills in the patient's details.", image: { src: `${A}/newrun-scan.webp`, width: 807, height: 723, alt: 'New test screen: scanning a barcode fills in the patient details', caption: 'Start a test' } },
          { tone: 'blue', eyebrow: 'Insert', title: 'The slot lights up', text: "The slot lights up on the screen and on the instrument at the same time, so there's no guessing where the card goes.", image: { src: `${A}/newrun-insert.webp`, width: 807, height: 723, alt: 'Insert step: the screen highlights module D, slot 8', caption: 'Insert the card' } },
        ] },
      ],
    },
    {
      type: 'pitch', label: 'One app, not two', title: 'One product instead of two',
      sticker: { photo: `${A}/persona-sergio.webp`, label: 'Sergio · engineer' },
      blocks: [
        { type: 'principle', n: '04', text: 'Simplify' },
        { type: 'p', text: "Sergio and the other field engineers repaired machines in a dense, separate desktop tool full of tabs and panels they rarely needed. I brought only the tools they use into the same product, with the same look as everything else. Engineers see repair tools when they sign in; lab techs never do, so everyone's screens stay simple." },
        { type: 'compare', wide: true, items: [
          { tag: 'Before', caption: 'Calibrations in the old desktop tool', src: `${A}/calibrations-before.webp`, width: 1354, height: 630, alt: 'Old desktop tool: a dense grid of calibrations with a long toolbar of tabs and a grey side panel' },
          { tag: 'After', caption: 'Calibrations in the new Modules area', src: `${A}/calibrations-after.webp`, width: 1440, height: 810, alt: 'New Modules area: a list of calibrations for Module A with the selected calibration’s results beside it', after: true },
        ] },
        { type: 'cards', wide: true, size: 'img', layout: 'rows', cards: [
          { tone: 'blue', eyebrow: 'Modules', title: 'One module, one place', text: 'Errors, calibrations, hardware and sensors for each module live together, instead of spread across dozens of tabs.', image: { src: `${A}/module-overview.webp`, width: 1200, height: 675, alt: 'Module overview: a side menu of errors, calibrations, hardware, bays, imager and sensors beside the module’s details', caption: 'Module overview' } },
          { tone: 'blue', eyebrow: 'Errors', title: 'Every error has a next step', text: 'Plain-language troubleshooting and a one-tap support request.', image: { src: `${A}/run-error.webp`, width: 1200, height: 675, alt: 'Error details with troubleshooting steps and a Submit Support Request button', caption: 'Error details' } },
        ] },
      ],
    },
    {
      type: 'pitch', label: 'Expert made simple', title: 'Expert rules, consumer-grade feel',
      blocks: [
        { type: 'principle', n: '05', text: 'Expert content, simple interface' },
        { type: 'p', text: "Nobody likes working in a rules engine, and they're not much fun to design either. Labs can set their own rules for how results are reported, but most found existing editors so confusing they asked Accelerate to write the rules for them. This one had to be simple enough for a lab to do it themselves." },
        { type: 'p', text: 'I designed the rule builder to read like a sentence, with an example beside it, so a lab can see what a rule does before it affects a patient.' },
        { type: 'cards', wide: true, size: 'img', layout: 'rows', cards: [
          { tone: 'blue', eyebrow: 'Rules', title: 'Every rule in one place', text: 'Each lab rule can be switched on or off without touching the rest.', image: { src: `${A}/rules-list.webp`, width: 1200, height: 675, alt: 'List of lab rules, each with an on/off switch', caption: 'Rules list' } },
          { tone: 'blue', eyebrow: 'Builder', title: 'Reads like a sentence', text: 'Each rule is written as “For… If… Then…”, like a sentence, with an example beside it showing what it will do.', image: { src: `${A}/rule-builder.webp`, width: 1152, height: 779, alt: 'Rule builder laid out as For, If and Then, with an example panel beside it', caption: 'Rule builder' } },
        ] },
      ],
    },
    {
      type: 'milestone',
      title: 'Designed, built and shipped.',
      text: 'The instrument shipped with this software: one blueprint for the lab tech, the specialist and the engineer.',
      stats: [
        { value: '72', label: 'screens designed' },
        { value: '3', label: 'users' },
        { value: '1', label: 'app' },
      ],
    },
    {
      type: 'pitch', label: 'What I learned', title: 'What I took away',
      blocks: [
        { type: 'lessons', items: [
          'Agree on the rules before the debates start. With five shared principles, hard calls came down to what Laura and Sergio needed, not whose opinion won.',
          'Design for the moment that matters. When a patient is waiting, the screen has to tell Laura what needs her, even from across the room.',
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

export default accelerate;
