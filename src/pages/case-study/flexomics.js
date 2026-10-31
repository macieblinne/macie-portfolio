// Flexomics case study — copy from Figma "Work — Case study · Flexomics · Alt" (5383:8227).
// Rendered by CaseStudy.jsx; block types are documented there.

const flexomics = {
  slug: 'flexomics',
  name: 'Flexomics',
  title: 'From three fragmented tools to one research platform',
  titleWidth: 774,
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
    { label: 'Scope', value: 'End-to-end · 2 workspaces' },
  ],
  sections: [
    {
      type: 'pitch', label: 'Context', title: 'The situation',
      blocks: [
        { type: 'p', text: "When you run single-cell experiments, insights are quietly fragmented across imaging tools, sequencing software, and analysis programs. Sometimes representing months of scientific work that can't be interpreted without hours of manual reconstruction." },
        { type: 'p', text: 'FLXplorer gives researchers one place to see the full experimental picture, so they can answer: “What did we find, and what does it mean?” It replaces three disconnected tools with a single unified environment, so scientists can move from experiment to insight without reconstructing anything by hand.' },
      ],
    },
    {
      type: 'pitch', label: 'Discovery', title: 'Where the complexity was hiding',
      blocks: [
        { type: 'p', text: "Early conversations with scientists made clear that the problem wasn't the amount of data. It was how that data was distributed. Researchers were constantly switching contexts between imaging and sequencing systems while trying to hold the relationships between datasets in their heads." },
        { type: 'quote', text: '“Complexity belongs in the system, not in the researcher\'s workflow.”' },
        { type: 'p', text: "That principle anchored every design decision that followed. Scientists should be able to focus on interpreting biology, not stitching together datasets. The platform needed to absorb the internal complexity so researchers didn't have to." },
      ],
    },
    {
      type: 'pitch', label: 'Architecture', title: 'Two workspaces, one dataset',
      blocks: [
        { type: 'p', text: 'To support large datasets without overwhelming users, the platform was organized around two primary workspaces aligned with how scientists actually think, not how the data was technically structured. Both operated on the same underlying dataset, so discoveries made in one context appeared immediately in the other.' },
        { type: 'cards', cards: [
          { tone: 'blue', eyebrow: 'Workspace 1', title: 'Imaging', text: 'Where scientists start. Thousands of cells captured under a microscope, explored visually to find populations worth investigating.' },
          { tone: 'dark', eyebrow: 'Workspace 2', title: 'Sequencing', text: 'Where scientists go deeper. The same experiment, seen through genetic data — how genes are expressed across large cell populations.' },
        ] },
      ],
    },
    {
      type: 'break',
      sticker: 'Imaging ↔ Sequencing · one selection, two views',
      image: { src: '/case-study/flexomics-hero.webp', alt: 'FLXplorer: a selected well in the imaging view, with its UMAP in the side panel', width: 1711, height: 1106, scale: 1.0315 },
    },
    {
      type: 'pitch', label: 'Cross-modal continuity', title: 'One selection, two views', gap: 24,
      blocks: [
        { type: 'p', text: 'The most important design decision in the platform was making sure the two workspaces never felt like two separate tools. When a scientist identified a cell population in imaging, that selection carried over into sequencing automatically. When they investigated a genetic signal in sequencing, the corresponding cells were already waiting in the imaging view.' },
        { type: 'p', text: "The data stayed connected so the researcher didn't have to be the one holding it together. Moving between workspaces felt like one continuous line of thinking, not a context switch." },
        { type: 'media', video: '/case-study/video/imaging.mp4', poster: '/case-study/video/imaging-poster.jpg', width: 2370, height: 1528, sticker: 'GIF · AUTOPLAY', caption: 'Selection carrying from imaging into sequencing', alt: 'Screen recording: a cell population selected in the imaging workspace is carried over into sequencing' },
      ],
    },
    {
      type: 'pitch', label: 'Key decision', title: 'The hardest cut',
      blocks: [
        { type: 'p', text: 'Midway through development, researchers made clear they wanted the ability to compare results across multiple experiments. It was a real scientific need. Implementing it within the 12-week timeline would have introduced performance problems at the dataset sizes Flexomics was working at.' },
        { type: 'fork', options: [
          { label: 'Option 1 · Build it now', text: 'Support multi-experiment comparison in the MVP. Risk: performance instability under real dataset sizes. A platform that broke down under load would have undermined everything shipped alongside it.' },
          { label: 'Option 2 · Protect the core', text: 'Focus on making imaging and sequencing exploration reliable at scale. Ship a stable, fast platform researchers could trust, and plan multi-experiment comparison for the next phase.', chosen: true },
        ] },
        { type: 'p', text: "I pushed for Option 2. With a founding team watching every sprint, shipping something that broke under real conditions wasn't a viable path. A fast and stable core platform would do more for researchers than an unstable one that tried to do everything." },
      ],
    },
    {
      type: 'milestone',
      title: 'MVP shipped in 12 weeks.',
      text: 'Stable at millions of cells. Two workspaces operating on a single dataset. Three disconnected tools replaced by one continuous research session.',
      stats: [
        { value: '12', label: 'weeks' },
        { value: '3→1', label: 'tools' },
        { value: '2', label: 'workspaces' },
        { value: '1M+', label: 'cells' },
      ],
    },
    {
      type: 'pitch', label: 'Impact', title: 'What actually changed', gap: 24,
      blocks: [
        { type: 'lead', text: 'A scientist selected one cell in the imaging view and watched its genetic data appear instantly. Then did it in reverse — clicked a data point in sequencing and the corresponding cell illuminated in the image.' },
        { type: 'p', text: 'Something that previously required hours of cross-referencing across three separate systems happened in two clicks.' },
        { type: 'cards', size: 'sm', cards: [
          { tone: 'blue', title: 'Operational impact', text: 'FLXplorer replaced three disconnected internal tools and became the primary environment for exploring experimental data. Workflows that required stitching together multiple systems were consolidated into a single session.' },
          { tone: 'soft', title: 'Strategic impact', text: "FLXplorer became Flexomics' primary differentiator, repositioning the company from a hardware provider to an integrated platform for single-cell research. It anchored customer conversations, powered demos, and drove internal research workflows." },
        ] },
        { type: 'media', video: '/case-study/video/sequencing.mp4', poster: '/case-study/video/sequencing-poster.jpg', width: 2370, height: 1528, sticker: 'GIF · AUTOPLAY', caption: 'Cell → gene → cells, round trip', alt: 'Screen recording: a data point picked in sequencing highlights the corresponding cells back in the imaging view' },
      ],
    },
    {
      type: 'pitch', label: 'Lessons', title: 'What building from zero taught me',
      blocks: [
        { type: 'lessons', items: [
          'Complex products succeed when the product absorbs internal complexity rather than exposing it. The interface surfaces only what helps researchers reason through experiments, not the pipelines driving them.',
          'Advocating for scope restraint under real pressure, and making the reasoning visible to a founding team, is as important as the design work itself.',
          'Architectural decisions determine whether breakthrough technology becomes a usable product or stays an experimental tool. The structure of the platform was the design.',
        ] },
      ],
    },
  ],
  next: {
    eyebrow: 'Next route · 02 The Trough',
    title: 'An AI-powered procurement platform from POC to MVP',
    ghost: '02',
    cta: 'Continue on',
    to: '/work/accio3d',
  },
};

export default flexomics;
