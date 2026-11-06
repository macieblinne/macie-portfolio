// Accio3D case study — copy from Figma "Work — Case study · Accio3D · v2 (story rewrite)" (5624:11452).
// Rendered by CaseStudy.jsx; block types are documented there.
// Story strength: AI product design — the AI does the upfront work, the buyer validates.

const A = '/case-study/accio';

const accio3d = {
  slug: 'accio3d',
  name: 'Accio3D',
  title: 'An AI marketplace for parts nobody makes anymore',
  titleWidth: 700,
  titleTop: 176,
  titleSize: 72,
  heroTone: 'cocoa', // matches the Accio3D band on the Work page
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
    { label: 'Timeline', value: '2 phases · POC → MVP design' },
    { label: 'Team', value: 'PM · Strategist · Developers · Client' },
  ],
  sections: [
    {
      type: 'pitch', hook: true, waypoint: '00', label: 'The moment', count: 'Trailhead',
      blocks: [
        { type: 'lead', text: 'When a critical industrial part fails and its maker no longer exists, procurement teams start from zero: phone calls, spreadsheets and days of coordination while equipment sits idle.' },
      ],
    },
    {
      type: 'pitch', label: 'The problem', title: 'Days of phone calls, replaced by one session',
      blocks: [
        { type: 'p', text: 'Accio3D lets a buyer upload a part, have AI check whether it can be 3D printed, get matched with qualified suppliers and place an order, all in one session.' },
        { type: 'p', text: "I was the designer across two phases: a proof of concept the CEO used to raise the seed round, then the MVP. I designed both sides of the marketplace, the purchaser app and the supplier app, working with a project manager, a strategist, a team of developers and the stakeholders." },
        { type: 'h3', text: 'Both sides of the marketplace' },
        { type: 'personas', compact: true, aspect: '217 / 135', people: [
          { name: 'Peter', role: 'Procurement specialist', side: 'Buyer side', photo: `${A}/persona-peter.webp`, goal: 'Find a maker for a part nobody produces anymore, fast.', tasks: ['Uploading parts', 'Comparing quotes', 'Placing orders'] },
          { name: 'Clara', role: 'Component engineer', side: 'Buyer side', photo: `${A}/persona-clara.webp`, goal: 'Make sure a printed part meets spec before it ships.', tasks: ['Reviewing specs', 'Approving samples', 'Updating drawings'] },
          { name: 'Tony', role: 'Technical sales, 3D shop', side: 'Supplier side', supplier: true, photo: `${A}/persona-tony.webp`, goal: 'Win the jobs his printers can make.', tasks: ['Reviewing RFQs', 'Submitting quotes', 'Shipping parts'] },
        ] },
      ],
    },
    {
      type: 'pitch', label: 'Phase 1 · Sell the idea', title: 'A demo investors could follow without a pitch',
      blocks: [
        { type: 'p', text: "The POC was a tool for the CEO: something she could put in front of investors and stakeholders and let the product make the case. My test for every screen: if she had to explain it, it wasn't done." },
        { type: 'note', label: 'Goal', text: 'Empower the CEO with a demo that sells itself.' },
        { type: 'p', text: 'I focused it on the two questions every buyer asks first.' },
        { type: 'cards', cards: [
          { tone: 'blue', eyebrow: 'Question 1 · Printability assessment', title: 'Can it be printed?', text: 'Status at a glance. Buyers still picked materials and equipment by hand, which testing would flag.' },
          { tone: 'blue', eyebrow: 'Question 2 · Supplier matching', title: 'Who can make it?', text: 'Qualified suppliers with capabilities, location, lead time and quality tier: enough to act on without digging.' },
        ] },
      ],
    },
    {
      type: 'break',
      sticker: 'Dashboard · one place to ask the AI directly',
      image: { src: `${A}/dashboard.webp`, alt: 'Accio3D dashboard: the assistant greets the buyer with suggested prompts, beside a global supplier map and recent notifications', width: 1440, height: 1080, scale: 1 },
    },
    {
      type: 'pitch', label: 'Phase 1 · Watch them use it', title: "Users trusted the flow. They didn't want to do the AI's job.",
      sticker: { photo: `${A}/persona-peter.webp`, label: 'Peter · Buyer' },
      blocks: [
        { type: 'p', text: "Before the seed round closed, I walked procurement specialists like Peter through the POC and watched where they stalled. The core workflow held: they followed it without help. But three things kept coming up. The printability step asked for too many manual selections. The next step in the workflow wasn't obvious. And most didn't realize the assistant was something they could talk to." },
        { type: 'note', label: 'What we heard', text: 'Buyers came for a quick answer, not more work.' },
        { type: 'p', text: 'Together, those became the principle behind everything that followed:' },
        { type: 'note', label: 'Principle', text: 'The AI does the upfront work. The buyer validates.' },
        { type: 'compare', wide: true, items: [
          { tag: 'Before', caption: 'Buyers configured every option', src: `${A}/printability-poc.webp`, width: 1440, height: 1080, alt: 'POC printability screen: the buyer reviews printability and picks material and equipment from a long list by hand' },
          { tag: 'After', caption: 'AI recommends, buyer confirms', src: `${A}/step1-printability.webp`, width: 1440, height: 1080, alt: 'MVP printability step: the AI’s printability score and recommended material, technology and equipment arrive pre-selected for the buyer to confirm', after: true },
        ] },
      ],
    },
    {
      type: 'pitch', label: 'Where AI belongs', title: "Where the AI shows up, and where it doesn't",
      blocks: [
        { type: 'p', text: "The pressure was to make the product entirely AI-forward, with the model on display on every screen. I held to the principle instead: a procurement specialist doesn't need to watch the model work. They need its work done, ready to check." },
        { type: 'fork', options: [
          { label: 'Option 1 · AI everywhere', text: 'Confidence scores, reasoning panels and live matching on every screen. Impressive in a demo, noise for a buyer.' },
          { label: 'Option 2 · AI works, buyer validates', text: 'The AI does the upfront work (assessing printability, recommending materials, matching suppliers) and the buyer reviews, adjusts and approves.', chosen: true },
        ] },
        { type: 'p', text: "The same split shaped the MVP: printability checks based on a part's specs shipped first, while analysis of its 3D shape, which needed training data that didn't exist yet, became a separate research track." },
      ],
    },
    {
      type: 'milestone',
      title: 'Seed round closed.',
      text: 'The demo did its job: the CEO could walk investors through it without a pitch deck. The MVP was greenlit.',
      stats: [
        { value: '2', label: 'phases' },
        { value: '2', label: 'apps' },
        { value: '71→46', label: 'MVP views' },
      ],
    },
    {
      type: 'pitch', label: 'Phase 2 · Cut to fit', title: 'From full roadmap to lean MVP',
      blocks: [
        { type: 'p', text: 'Phase 2 started with a three-day Solution Blueprint with the client. Our strategist led the sessions; I built the workflow and screen flow maps. We roadmapped the entire platform first: every role on both sides of the marketplace, from onboarding and sourcing to ordering and fulfillment.' },
        { type: 'p', text: 'Then we cut to fit the budget and timeline. With priorities ranked Money > Features > Time, the MVP got one job: a buyer could order a part from start to finish across the purchaser and supplier apps. Everything else moved to the roadmap, and 71 planned views became 46.' },
        { type: 'note', label: 'MVP goal', text: 'Order one part, end to end, across both apps.' },
      ],
    },
    {
      type: 'pitch', label: 'Phase 2 · Both sides', title: 'One path from part to order',
      sticker: { photo: `${A}/persona-tony.webp`, label: 'Tony · Supplier' },
      blocks: [
        { type: 'p', text: "In the POC, buyers weren't always sure what came next. In the MVP, the purchaser app shows the whole path as five steps on every screen, so a buyer always knows where a part stands." },
        { type: 'p', text: 'On the other side, Tony works through a steady stream of quote requests in the supplier app: reviewing each part, sending quotes back to the buyer and tracking his orders. The light-mode screens are his view.' },
        { type: 'steps', items: ['Assess printability', 'Set requirements', 'Match a supplier', 'Compare quotes', 'Order'] },
        { type: 'cards', wide: true, size: 'img', cards: [
          { tone: 'blue', eyebrow: 'Every step', title: 'AI drafts, buyer approves', text: 'Each step opens with the AI’s work already done, like “I found 5 suppliers and recommend PrintForge Labs.” The buyer approves it, or overrides it with feedback when they disagree (“we don’t agree that it’s printable”), and every manual change is logged for the team to see.', image: { src: `${A}/step3-match.webp`, width: 1440, height: 1080, alt: 'Match supplier step: the assistant recommends PrintForge Labs from five matched suppliers, with ratings, metrics and certifications to check', caption: 'Step 3 · Match a supplier' } },
          { tone: 'blue', eyebrow: 'Dashboards', title: 'An assistant that speaks first', text: 'Testers missed that the assistant was a chat, so dashboards open with it talking: a greeting, what needs attention today, and “take me to” shortcuts into the work.', image: { src: `${A}/supplier-dashboard.webp`, width: 1440, height: 1080, alt: 'Supplier dashboard: the assistant greets the supplier and suggests prompts beside win rate, revenue and job status', caption: 'Supplier dashboard' } },
        ] },
        { type: 'p', text: 'I designed the MVP across both apps, then the client took it in-house for development.' },
      ],
    },
    {
      type: 'pitch', label: 'What I learned', title: 'What I took away',
      blocks: [
        { type: 'lessons', items: [
          "The AI is only as useful as the moment it shows up in. Deciding where it didn't belong was most of the design work.",
          "Design both sides of a marketplace together. Peter only gets a fast answer if Tony can quote quickly, so the supplier app mattered as much as the buyer's.",
        ] },
      ],
    },
  ],
  next: {
    eyebrow: 'Next route · 03 The Narrows',
    title: 'One interface for fifty tests running at once',
    ghost: '03',
    cta: 'Continue on',
    to: '/work/accelerate',
  },
};

export default accio3d;
