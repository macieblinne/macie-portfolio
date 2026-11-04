// Flexomics case study — copy from Figma "Work — Case study · Flexomics · v2 (story rewrite)" (5610:6807).
// Rendered by CaseStudy.jsx; block types are documented there.
// Story strength: systems thinking — structuring a 0→1 platform.

const flexomics = {
  slug: 'flexomics',
  name: 'Flexomics',
  title: 'Hours of cross-referencing, now two clicks',
  titleWidth: 690,
  hero: {
    image: { src: '/case-study/flexomics-hero.webp', alt: 'FLXplorer imaging workspace: a well plate image with a UMAP plot and pinned wells in the side panel', width: 1711, height: 1106, scale: 1.0315 },
    stickers: [
      { label: 'FLXplorer', tone: 'white', rotate: 6, x: -7, y: 350 },
      { label: '0→1', tone: 'chartreuse', rotate: -4, x: 131, y: 318 },
    ],
  },
  meta: [
    { label: 'Company', value: 'Flexomics' },
    { label: 'Role', value: 'Lead Product Designer' },
    { label: 'Timeline', value: '12 weeks · MVP' },
    { label: 'Team', value: 'Strategist · Developer · Founders' },
  ],
  sections: [
    {
      type: 'pitch', hook: true, waypoint: '00', label: 'The moment', count: 'Trailhead',
      blocks: [
        { type: 'lead', text: 'A scientist clicked one cell in a microscope image, and its genetic profile appeared beside it. She clicked a point in the sequencing data, and the matching cells lit up in the image. Before FLXplorer, that round trip took hours across three tools.' },
      ],
    },
    {
      type: 'pitch', label: 'Context', title: 'One experiment, split across three tools',
      blocks: [
        { type: 'p', text: 'Single-cell experiments produce two kinds of evidence: images of cells and the genetic data behind them. At Flexomics they lived in three disconnected tools, so researchers rebuilt the connections by hand before they could ask what an experiment meant.' },
        { type: 'p', text: 'I was the lead designer on FLXplorer, a 0→1 platform that puts the whole experiment in one place, working with a strategist, a developer and the founding team over 12 weeks.' },
      ],
    },
    {
      type: 'pitch', label: 'Discovery', title: 'From the microscope to the spreadsheet',
      blocks: [
        { type: 'p', text: "We spent time in the lab while scientists walked us through real experiments: the slide under the microscope, the output on screen, and then the layers of spreadsheets they kept just to match well IDs between imaging and sequencing. Data volume wasn't the bottleneck. Keeping that mapping straight by hand was." },
        { type: 'note', label: 'Principle', text: "Complexity belongs in the system, not in the researcher's workflow." },
        { type: 'p', text: 'That became the rule for every decision that followed.' },
      ],
    },
    {
      type: 'pitch', label: 'Architecture', title: 'Built around how scientists think, not how data is stored',
      blocks: [
        { type: 'p', text: 'I split the platform into two workspaces that mirror the research process, both reading from one shared dataset.' },
        { type: 'cards', cards: [
          { tone: 'blue', eyebrow: 'Workspace 1 · Start wide', title: 'Imaging', text: 'Explore thousands of cells visually and find the populations worth a closer look.' },
          { tone: 'dark', eyebrow: 'Workspace 2 · Go deep', title: 'Sequencing', text: 'See the same cells through gene expression, across the whole population.' },
        ] },
      ],
    },
    {
      type: 'break',
      sticker: 'Imaging ↔ Sequencing · one selection, two views',
      image: { src: '/case-study/flexomics-hero.webp', alt: 'FLXplorer: a selected well on the plate image, with that same well’s UMAP in the side panel', width: 1711, height: 1106, scale: 1 },
      // Coordinates are in image pixels (1711 × 1106).
      annotation: {
        ring: { cx: 772, cy: 465, r: 46 },
        box: { x: 1366, y: 283, w: 330, h: 388, r: 24 },
        path: 'M 820 452 C 980 380, 1180 540, 1362 470',
        dot: { cx: 1362, cy: 470 },
        labels: [
          { text: 'Imaging · selected well', x: 650, y: 540 },
          { text: 'Sequencing · same well', x: 1020, y: 560 },
        ],
      },
    },
    {
      type: 'pitch', label: 'Cross-modal continuity', title: 'One selection, two views', gap: 24,
      blocks: [
        { type: 'p', text: "The two workspaces only work if they never feel like two tools. Select a population in imaging and it's already selected in sequencing. Find a gene signal in sequencing and its cells light up in the image." },
        { type: 'p', text: 'Moving between them is one line of thinking, not a context switch.' },
        { type: 'media', wide: true, video: '/case-study/video/imaging.mp4', poster: '/case-study/video/imaging-poster.jpg', width: 1600, height: 1032, sticker: 'GIF · AUTOPLAY', caption: 'Select a well, pin it, then compare more', alt: 'Screen recording: selecting a well on the plate shows its UMAP in the side panel; the scientist pins it, then selects and pins more wells' },
        { type: 'h3', text: 'The first version lost the map' },
        { type: 'p', text: "Our first design opened a cell's data in an overlay on top of the image. It covered the rest of the microscopy view, so scientists lost their place in the experiment. We moved the data into a full side panel instead: the image stays in view while you dig into a cell." },
        { type: 'compare', wide: true, items: [
          { tag: 'Before', caption: 'Overlay covered the plate', src: '/case-study/flexomics-imaging-v1.webp', full: '/case-study/flexomics-imaging-v1-full.webp', width: 1200, height: 776, alt: 'First version: a well’s volcano plot opens in an overlay on top of the microscopy image, hiding the plate around it' },
          { tag: 'After', caption: 'Full panel keeps the image in view', src: '/case-study/flexomics-imaging-v2.webp', full: '/case-study/flexomics-imaging-v2-full.webp', width: 1200, height: 776, alt: 'Shipped version: the well’s UMAP sits in a side panel while the full plate image stays visible', after: true },
        ] },
      ],
    },
    {
      type: 'pitch', label: 'Key decision', title: 'The feature I cut',
      blocks: [
        { type: 'p', text: "Midway through, researchers asked to compare results across experiments. The need was real, but at Flexomics' dataset sizes it would have made the platform unstable inside 12 weeks." },
        { type: 'fork', options: [
          { label: 'Option 1 · Build it now', text: 'Ship comparison in the MVP and risk a platform that breaks under real data.' },
          { label: 'Option 2 · Protect the core', text: 'Make imaging and sequencing fast and reliable at scale. Plan comparison for the next phase.', chosen: true },
        ] },
        { type: 'p', text: 'I made the case to the founders for protecting the core: a platform researchers could trust would do more than one that tried to do everything. Multi-experiment comparison is now on the roadmap, built on a foundation that can handle it.' },
      ],
    },
    {
      type: 'milestone',
      title: 'MVP shipped in 12 weeks.',
      text: 'Stable at 1M+ cells. One dataset, two workspaces, no manual reconstruction.',
      stats: [
        { value: '12', label: 'weeks' },
        { value: '3→1', label: 'tools' },
        { value: '2', label: 'workspaces' },
        { value: '1M+', label: 'cells' },
      ],
    },
    {
      type: 'pitch', label: 'Impact', title: 'From hardware company to research platform', gap: 24,
      blocks: [
        { type: 'p', text: 'Hours of cross-referencing across three systems became two clicks.' },
        { type: 'cards', size: 'sm', cards: [
          { tone: 'blue', title: 'Operational impact', text: 'Three internal tools retired. FLXplorer became the main environment for exploring experiments: one session instead of three systems.' },
          { tone: 'soft', title: 'Strategic impact', text: 'It changed what Flexomics sells: from a hardware provider to an integrated single-cell platform, and the product the team demos to customers.' },
        ] },
        { type: 'media', wide: true, video: '/case-study/video/sequencing.mp4', poster: '/case-study/video/sequencing-poster.jpg', width: 2370, height: 1528, sticker: 'GIF · AUTOPLAY', caption: 'Cell → gene → cells, round trip', alt: 'Screen recording: a data point picked in sequencing highlights the corresponding cells back in the imaging view' },
      ],
    },
    {
      type: 'pitch', label: 'Lessons', title: 'What building from zero taught me',
      blocks: [
        { type: 'lessons', items: [
          'Organize around how people think, not how the data is stored. Two workspaces that mirror the research process did more than any single screen could.',
          "Experts don't need simpler tools, they need fewer handoffs. Scientists were comfortable with complex data; what slowed them down was carrying it between three tools.",
        ] },
      ],
    },
  ],
  next: {
    eyebrow: 'Next route · 02 The Trough',
    title: 'An AI marketplace for parts nobody makes anymore',
    ghost: '02',
    cta: 'Continue on',
    to: '/work/accio3d',
  },
};

export default flexomics;
