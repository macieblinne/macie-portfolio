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
    { label: 'Timeline', value: '2022 · 72-view system' },
    { label: 'Team', value: 'Design team · Strategist · Accelerate R&D' },
  ],
  sections: [
    {
      type: 'pitch', hook: true, waypoint: '00', label: 'The moment', count: 'Trailhead',
      blocks: [
        { type: 'lead', text: "In a hospital microbiology lab, every hour without a susceptibility result is an hour a patient with a bloodstream infection may be on the wrong antibiotic. Accelerate's next instrument could run fifty of those tests at once. The software had to keep up without asking more of an already overworked lab." },
      ],
    },
    {
      type: 'pitch', label: 'Context', title: 'From one test at a time to fifty',
      blocks: [
        { type: 'p', text: "Accelerate's Pheno system ran one test per module. Its next-generation instrument (code-named Opus during the project) runs up to ten per module, across up to five modules on a single host. The interface built for Pheno couldn't stretch that far, and engineers serviced the hardware through a separate desktop app that looked nothing like the rest of the product." },
        { type: 'p', text: 'I was a product designer on the Catalyst UX team. Our strategist led discovery with Accelerate’s product and R&D teams; I designed the software that came out of it, from the operating dashboard to the rules builder.' },
        { type: 'cards', size: 'sm', cards: [
          { tone: 'blue', eyebrow: 'Scale', title: '10 runs × 5 modules', text: 'Show every run on every module in a way a lab tech can read at a glance.' },
          { tone: 'blue', eyebrow: 'Consolidate', title: 'One app, not two', text: 'Fold the desktop service portal into the same web interface the lab uses.' },
          { tone: 'blue', eyebrow: 'Brand', title: 'A flagship look', text: 'The dashboard would sell the instrument, so marketing cared how it felt.' },
        ] },
      ],
    },
    {
      type: 'pitch', label: 'The brief', title: 'Three users, five rules for every screen',
      blocks: [
        { type: 'p', text: 'Discovery gave the team two things to design against: three people who would stand in front of the instrument, and five principles every screen had to answer to. When a design decision got hard, these settled it.' },
        { type: 'cards', size: 'sm', cards: [
          { tone: 'blue', eyebrow: 'Laura · Lab technician', title: 'Monitor and load', text: 'Understaffed and juggling ten tests at once. Afraid of messing something up on the computer; would rather call an expert than troubleshoot.' },
          { tone: 'blue', eyebrow: 'Travis · Application specialist', title: 'Train and verify', text: 'Travels to each hospital to set the system up and win over skeptical staff who see it as one more job to do.' },
          { tone: 'blue', eyebrow: 'Sergio · Field service engineer', title: 'Install and fix', text: "Bounces through dozens of tabs to set up a machine, and can't find a module's history of failures or calibrations." },
        ] },
        { type: 'h3', text: 'The principles' },
        { type: 'lessons', items: [
          'Give the lab work areas it already understands: Orders, Operating, Runs and Results.',
          'Optimize the places where 80% of users spend 80% of their time.',
          'Simplify. Each view gets only the navigation, controls and resources its work needs.',
          'Follow clinical processes, not operating-system conventions.',
          "The content may require expertise to understand. The interface shouldn't.",
        ] },
      ],
    },
    {
      type: 'pitch', label: 'Architecture', title: 'Seventy-two views, one map',
      blocks: [
        { type: 'p', text: 'With fifty runs, three roles and every service tool moving into one product, the risk was a maze. Principle 01 set the structure: six work areas named after things a lab already understands, from Settings and Modules to Runs and Results. Seventy-two views went into scope, and every one had a place on the map before it had a screen.' },
        { type: 'media', wide: true, src: `${A}/architecture.webp`, width: 2458, height: 1429, alt: 'Architecture map v17: 72 views organized into Global, Settings, Modules, Operating, Runs, Results and Orders, with flows between them', sticker: '72 views in scope', caption: 'Architecture map · v17' },
        { type: 'note', label: 'Rule of thumb', text: 'The dashboard shows what is happening in the machine right now. Everything it produces lives in Results.' },
        { type: 'fork', options: [
          { label: 'Option 1 · Keep the service app', text: 'Leave hardware service in its own desktop tool. Familiar to engineers, but two products to learn, maintain and keep in sync.' },
          { label: 'Option 2 · Service as a mode', text: 'Move every service tool into the same interface, shown to Sergio when he signs in and hidden from Laura. One product, one set of patterns.', chosen: true },
        ] },
      ],
    },
    {
      type: 'break',
      sticker: 'Operating · every module, every bay, at a glance',
      image: { src: `${A}/dashboard-5.webp`, alt: 'Operating dashboard with five modules: bays glow green for complete, blue for running and red for errors, with a flag beside the bay that needs attention', width: 1200, height: 675, scale: 1 },
    },
    {
      type: 'pitch', label: 'Operating', title: 'Make the screen look like the machine',
      blocks: [
        { type: 'p', text: "Pheno's dashboard gave each run its own card. At fifty runs, that becomes a scrolling wall. So the dashboard draws each module the way Laura sees it on the bench, with its ten bays lit by state. A flag appears only beside a bay that needs her, and tapping a module opens its runs. Laura spends most of her day on this screen, so following principle 02, it got the most care." },
        { type: 'compare', wide: true, items: [
          { tag: 'Before', caption: 'One card per run', src: `${A}/legacy-dashboard.webp`, width: 554, height: 360, alt: 'Legacy Pheno dashboard: a light web page with one card per run showing analyzing, completed and error states' },
          { tag: 'After', caption: 'Modules and bays, the way they sit on the bench', src: `${A}/dashboard.webp`, width: 1200, height: 675, alt: 'New operating dashboard: modules drawn as hardware with bays lit by run state and flags beside bays that need attention', after: true },
        ] },
        { type: 'cards', wide: true, size: 'img', cards: [
          { tone: 'blue', eyebrow: 'Tap a module', title: 'Every run in one table', text: 'Bay, patient, organism, when results are due and a single action per row: abort if it’s running, eject if it’s done.', image: { src: `${A}/module-runs.webp`, width: 1200, height: 675, alt: 'Module B opened beside the dashboard: a table of its runs with status, results time and an abort or eject action per bay', caption: 'Module run list' } },
          { tone: 'blue', eyebrow: 'Tap a bay', title: 'The flag says what to do', text: 'A finished run that is missing its organism ID shows exactly that, with the fix one tap away instead of buried in a log.', image: { src: `${A}/run-details.webp`, width: 1200, height: 675, alt: 'Run details for bay 3: complete, but organism ID required, with an Enter ID button', caption: 'Run details · ID required' } },
        ] },
        { type: 'h3', text: 'Loading a run' },
        { type: 'p', text: 'Starting a run is a scanning job. Each step fills itself from a barcode, falls back to manual entry if a scan fails, and ends by telling Laura exactly where the card goes.' },
        { type: 'steps', items: ['Run info', 'Broth lot', 'Card', 'Insert', 'Organism ID', 'Done'] },
        { type: 'cards', wide: true, size: 'img', cards: [
          { tone: 'blue', eyebrow: 'Step 1', title: 'Scan, don’t type', text: 'Accession number, MRN, patient and physician come from one scan. Patient and QC runs share the same flow.', image: { src: `${A}/newrun-scan.webp`, width: 807, height: 723, alt: 'New run step 1: scan the accession barcode to fill accession number, MRN, patient name and physician', caption: 'New run · Enter run information' } },
          { tone: 'blue', eyebrow: 'Step 4', title: 'The bay lights up', text: 'The system picks an open bay and shows it: Module D, bay 8, highlighted on a drawing of the module.', image: { src: `${A}/newrun-insert.webp`, width: 807, height: 723, alt: 'New run step 4: insert the card into Module D, bay 8, highlighted on a drawing of the module', caption: 'New run · Insert the card' } },
        ] },
      ],
    },
    {
      type: 'milestone',
      title: 'Fifty bays, one system.',
      text: 'Ten runs per module, five modules per host. One architecture held from Laura’s dashboard to Sergio’s motor controls.',
      stats: [
        { value: '72', label: 'views in scope' },
        { value: '3', label: 'personas' },
        { value: '6', label: 'work areas' },
      ],
    },
    {
      type: 'pitch', label: 'Service', title: 'The service portal, folded in',
      blocks: [
        { type: 'p', text: "Sergio's tools lived in a dense desktop app built on Windows conventions: rows of tabs, grey panels and status he couldn't read at a glance. Following principle 04, they became the Modules work area, built from the same components as everything else and organized around one module at a time." },
        { type: 'compare', wide: true, items: [
          { tag: 'Before', caption: 'Separate desktop service app', src: `${A}/legacy-service.webp`, width: 928, height: 545, alt: 'Legacy service portal: a dense desktop app with a long icon toolbar, a motor table and grey configuration panels' },
          { tag: 'After', caption: 'Modules work area in the same product', src: `${A}/module-overview.webp`, width: 1200, height: 675, alt: 'New module overview: module details at the top, with mode, badge and serial controls, in the same dark interface as the dashboard', after: true },
        ] },
        { type: 'cards', wide: true, size: 'img', cards: [
          { tone: 'blue', eyebrow: 'Calibrations', title: 'Start one, move to the next', text: 'Sergio told us he wanted to start a calibration on one module and keep working on another. Every module shows its live calibration step and time left, side by side.', image: { src: `${A}/module-calibrating.webp`, width: 1200, height: 440, alt: 'Module list with four modules each running a calibration, showing the current step and time left with an abort action', caption: 'Modules · running calibrations' } },
          { tone: 'blue', eyebrow: 'Errors', title: 'Every error ends in a next step', text: 'Errors carry plain troubleshooting and a contact, and lead straight to a support request with the run’s logs attached.', image: { src: `${A}/run-error.webp`, width: 1200, height: 675, alt: 'Run error for Module D, bay 3: error, troubleshooting and contact details, with a Submit Support Request button', caption: 'Run error' } },
        ] },
      ],
    },
    {
      type: 'pitch', label: 'Rules & results', title: 'Rules a lab can trust before they touch a result',
      blocks: [
        { type: 'p', text: "Every instrument ships with around two hundred factory rules that keep results in line with FDA or CLSI standards. Most labs add one or two of their own, and most of those labs asked Accelerate to write them, because rule editors tend to read backwards and lean on acronyms. Their one request: let me try a rule while I'm building it." },
        { type: 'note', label: 'Principle 05', text: "The content may require expertise. The interface shouldn't." },
        { type: 'p', text: 'I designed the rule builder to read as a sentence (For this organism, if these conditions, then this action) with a worked example beside it, so a lab could check what a rule means before it ever changed a patient result.' },
        { type: 'compare', wide: true, items: [
          { tag: 'Rules', caption: 'Custom and factory rules, each switchable', src: `${A}/rules-list.webp`, width: 1200, height: 675, alt: 'Rules list for blood culture: custom rules with enable toggles and edit, factory rules with view details' },
          { tag: 'Builder', caption: 'For · If · Then, with an example beside it', src: `${A}/rule-builder.webp`, width: 1152, height: 779, alt: 'Rule builder: For Pseudomonas aeruginosa, if antibiotic is meropenem and interpretation is resistant, then suppress the tobramycin result, with an example panel', after: true },
        ] },
        { type: 'p', text: 'Results got the same treatment. What a clinician needs first sits at the top: patient, organism and resistance phenotype, with each rule’s note beside the drug it changed instead of in a footnote. The printed report and the on-screen review share one layout.' },
        { type: 'compare', wide: true, items: [
          { tag: 'Screen', caption: 'Review, approve or reject', src: `${A}/report-screen.webp`, width: 960, height: 1150, alt: 'On-screen susceptibility results: patient, organism, an orange MRS phenotype banner, antimicrobials with MIC and interpretation, and rule notes' },
          { tag: 'Print', caption: 'The same layout on paper', src: `${A}/report-print.webp`, width: 945, height: 960, alt: 'Printed susceptibility report with the same structure: patient header, organism, resistance phenotype, results table and notes', after: true },
        ] },
      ],
    },
    {
      type: 'pitch', label: 'Lessons', title: 'What I took away',
      blocks: [
        { type: 'lessons', items: [
          'Draw the map before the screens. Seventy-two views stayed coherent because every one had a place on it first.',
          'Design for the person on their busiest day. Laura is short-staffed and doesn’t want to troubleshoot, so every state on the screen had to say what to do next.',
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
