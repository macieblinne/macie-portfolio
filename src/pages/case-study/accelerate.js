// Accelerate Diagnostics case study. Source: the Accelerate Solution Blueprint (discovery workshop
// boards, personas, architecture map v17) and the designed screens in Figma
// "Personal Development" › Accelerate Case Study (5729:7034).
// Rendered by CaseStudy.jsx; block types are documented there.
// Story strength: systems thinking at instrument scale: three personas, one architecture, 72 views.
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
    { label: 'Timeline', value: '2022 · 72 screens' },
    { label: 'Team', value: 'Design team · Strategist · Accelerate R&D' },
  ],
  sections: [
    {
      type: 'pitch', hook: true, waypoint: '00', label: 'The moment', count: 'Trailhead',
      blocks: [
        { type: 'lead', text: "When a patient has a serious infection, the hospital lab races to find out which antibiotic will work. Accelerate's next instrument could run fifty of those tests at once. The software had to make that feel simple for a lab that's already stretched thin." },
      ],
    },
    {
      type: 'pitch', label: 'Context', title: 'From one test at a time to fifty',
      blocks: [
        { type: 'p', text: "Accelerate's current system ran one test at a time. The new instrument runs up to fifty, and its software had to keep up. I was a product designer on the Catalyst UX team, designing that software with a strategist and Accelerate's team." },
        { type: 'cards', size: 'sm', cards: [
          { tone: 'blue', eyebrow: 'Scale', title: 'Fifty tests at a glance', text: 'Show every test without overwhelming the lab.' },
          { tone: 'blue', eyebrow: 'Simplify', title: 'One app, not two', text: "Bring the engineers' separate repair tool into the same product." },
          { tone: 'blue', eyebrow: 'Brand', title: 'A flagship look', text: 'The screen would help sell the instrument.' },
        ] },
      ],
    },
    {
      type: 'pitch', label: 'The brief', title: 'Three users, five rules for every screen',
      blocks: [
        { type: 'p', text: 'Research gave us three people to design for and five principles to hold every screen to. When a decision got hard, these settled it.' },
        { type: 'cards', size: 'sm', cards: [
          { tone: 'blue', eyebrow: 'Laura · Lab tech', title: 'Runs the tests', text: 'Short-staffed, juggling many tests and nervous about making mistakes on a computer.' },
          { tone: 'blue', eyebrow: 'Travis · Trainer', title: 'Sets it up', text: 'Trains each new lab and wins over staff who see a new system as more work.' },
          { tone: 'blue', eyebrow: 'Sergio · Engineer', title: 'Keeps it running', text: 'Installs and repairs machines, and loses time hunting through a cluttered tool.' },
        ] },
        { type: 'h3', text: 'The principles' },
        { type: 'lessons', items: [
          "Organize the product around the lab's real work.",
          'Polish the screens people use most.',
          'Show only what each screen needs.',
          'Follow how the lab works, not how computers work.',
          "The science can be complex. The interface shouldn't be.",
        ] },
      ],
    },
    {
      type: 'pitch', label: 'Structure', title: 'A map before the screens',
      blocks: [
        { type: 'p', text: 'Fifty tests, three kinds of users and a repair tool moving in could easily become a maze. So before designing screens, we mapped all 72 of them into a few areas named after things a lab already understands.' },
        { type: 'media', wide: true, src: `${A}/architecture.webp`, width: 2458, height: 1429, alt: 'Map of 72 screens organized into areas like Modules, Runs and Results, with the flows between them', sticker: '72 screens, one map', caption: 'Product map' },
        { type: 'fork', options: [
          { label: 'Option 1 · Keep two apps', text: 'Leave repairs in a separate tool. Familiar to engineers, but two products to learn and maintain.' },
          { label: 'Option 2 · One app, two modes', text: 'Engineers sign in and see repair tools; lab techs never do. One product to learn.', chosen: true },
        ] },
      ],
    },
    {
      type: 'break',
      sticker: 'The whole instrument, at a glance',
      image: { src: `${A}/dashboard-5.webp`, alt: 'Dashboard showing five instrument modules, each slot lit green, blue or red by status, with a flag beside the slot that needs attention', width: 1200, height: 675, scale: 1 },
    },
    {
      type: 'pitch', label: 'Dashboard', title: 'Make the screen look like the machine',
      blocks: [
        { type: 'p', text: "The old dashboard gave every test its own card. At fifty tests, that's a wall. The new one draws the instrument the way Laura sees it on the bench, with each slot lit by its status. A flag only appears where she's needed." },
        { type: 'compare', wide: true, items: [
          { tag: 'Before', caption: 'One card per test', src: `${A}/legacy-dashboard.webp`, width: 554, height: 360, alt: 'Old dashboard: a light web page with one card per test' },
          { tag: 'After', caption: 'The instrument, drawn as it sits on the bench', src: `${A}/dashboard.webp`, width: 1200, height: 675, alt: 'New dashboard: instrument modules drawn as hardware, with slots lit by status and flags where attention is needed', after: true },
        ] },
        { type: 'cards', wide: true, size: 'img', cards: [
          { tone: 'blue', eyebrow: 'Tap a module', title: 'Every test in one list', text: 'Status, when results are due, and the one action that makes sense next.', image: { src: `${A}/module-runs.webp`, width: 1200, height: 675, alt: 'A module opened beside the dashboard, listing its tests with status and an action for each', caption: 'Module test list' } },
          { tone: 'blue', eyebrow: 'Tap a flag', title: 'It says what to do', text: 'A missing step shows up with its fix one tap away.', image: { src: `${A}/run-details.webp`, width: 1200, height: 675, alt: 'Test details showing a missing step and a button to fix it', caption: 'Test details' } },
        ] },
        { type: 'h3', text: 'Starting a test' },
        { type: 'p', text: 'Starting a test is mostly scanning. The software fills in the details and finishes by showing exactly where the sample goes.' },
        { type: 'steps', items: ['Scan patient', 'Scan supplies', 'Insert card', 'Confirm'] },
        { type: 'cards', wide: true, size: 'img', cards: [
          { tone: 'blue', eyebrow: 'Scan', title: 'Scan, don’t type', text: "One scan fills in the patient's details.", image: { src: `${A}/newrun-scan.webp`, width: 807, height: 723, alt: 'New test screen: scanning a barcode fills in the patient details', caption: 'Start a test' } },
          { tone: 'blue', eyebrow: 'Insert', title: 'The slot lights up', text: "The screen shows which slot to use, so there's no guessing.", image: { src: `${A}/newrun-insert.webp`, width: 807, height: 723, alt: 'Insert step: the screen highlights module D, slot 8', caption: 'Insert the card' } },
        ] },
      ],
    },
    {
      type: 'milestone',
      title: 'Fifty tests, one screen.',
      text: 'One structure that worked for the lab tech, the trainer and the engineer.',
      stats: [
        { value: '72', label: 'screens mapped' },
        { value: '3', label: 'users' },
        { value: '1', label: 'app' },
      ],
    },
    {
      type: 'pitch', label: 'Repairs', title: 'One product instead of two',
      blocks: [
        { type: 'p', text: 'Engineers repaired machines in a dense, separate desktop tool. We brought those tools into the same product, with the same look and patterns as everything else.' },
        { type: 'compare', wide: true, items: [
          { tag: 'Before', caption: 'A separate desktop tool', src: `${A}/legacy-service.webp`, width: 928, height: 545, alt: 'Old repair tool: a dense desktop app with a long toolbar and grey panels' },
          { tag: 'After', caption: 'Part of the same product', src: `${A}/module-overview.webp`, width: 1200, height: 675, alt: 'New module screen in the same dark interface as the dashboard', after: true },
        ] },
        { type: 'cards', wide: true, size: 'img', cards: [
          { tone: 'blue', eyebrow: 'Calibrations', title: 'Work on several at once', text: 'Engineers can start a calibration on one module and keep working on another.', image: { src: `${A}/module-calibrating.webp`, width: 1200, height: 440, alt: 'Four modules each running a calibration, with time left on each', caption: 'Calibrations' } },
          { tone: 'blue', eyebrow: 'Errors', title: 'Every error has a next step', text: 'Plain-language troubleshooting and a one-tap support request.', image: { src: `${A}/run-error.webp`, width: 1200, height: 675, alt: 'Error details with troubleshooting steps and a Submit Support Request button', caption: 'Error details' } },
        ] },
      ],
    },
    {
      type: 'pitch', label: 'Rules & results', title: 'Expert settings, simple to use',
      blocks: [
        { type: 'p', text: 'Labs can add their own rules for how results are reported. Most found existing rule editors so confusing that they asked Accelerate to write the rules for them.' },
        { type: 'note', label: 'Principle 05', text: "The science can be complex. The interface shouldn't be." },
        { type: 'p', text: 'I designed the rule builder to read like a sentence, with an example beside it, so a lab can see what a rule does before it affects a patient.' },
        { type: 'compare', wide: true, items: [
          { tag: 'Rules', caption: 'Every rule, switchable on or off', src: `${A}/rules-list.webp`, width: 1200, height: 675, alt: 'List of lab rules, each with an on/off switch' },
          { tag: 'Builder', caption: 'Reads like a sentence, with an example', src: `${A}/rule-builder.webp`, width: 1152, height: 779, alt: 'Rule builder laid out as For, If and Then, with an example panel beside it', after: true },
        ] },
        { type: 'p', text: 'Results follow the same idea: the most important information first, on screen and on paper.' },
        { type: 'compare', wide: true, items: [
          { tag: 'Screen', caption: 'Review and approve', src: `${A}/report-screen.webp`, width: 960, height: 1150, alt: 'On-screen results with the patient, the infection and a highlighted warning at the top' },
          { tag: 'Print', caption: 'The same layout on paper', src: `${A}/report-print.webp`, width: 945, height: 960, alt: 'Printed results report with the same layout', after: true },
        ] },
      ],
    },
    {
      type: 'pitch', label: 'Lessons', title: 'What I took away',
      blocks: [
        { type: 'lessons', items: [
          'Map before you design. A clear structure kept 72 screens feeling like one product.',
          'Design for the busiest day. A short-staffed lab needs every screen to say what to do next.',
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
