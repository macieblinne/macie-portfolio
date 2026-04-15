import styles from './DetailPanel.module.css';

/* ---- Flexomics Content ---- */
function FlexomicsPanel() {
  return (
    <>
      <div className={styles.header}>
        <span className={styles.domain}>Life Science / Genomics</span>
        <h1 className={styles.headline}>Designing Flexomics' First Integrated Research Platform</h1>
        <p className={styles.subtitle}>Giving scientists one place to unify imaging and sequencing data for the first time</p>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}><span className={styles.metaLabel}>Timeline</span><span className={styles.metaValue}>12 weeks</span></div>
        <div className={styles.metaItem}><span className={styles.metaLabel}>Company</span><span className={styles.metaValue}>Flexomics</span></div>
        <div className={styles.metaItem}><span className={styles.metaLabel}>Role</span><span className={styles.metaValue}>Lead Product Designer</span></div>
      </div>

      <div className={styles.tags}>
        {['End-to-end Product Design', 'Platform Architecture', 'Data Interaction Models'].map(t => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>

      <hr className={styles.divider} />

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>The Hook</h2>
        <p className={styles.body}>When you run single-cell experiments, insights are quietly fragmented across imaging tools, sequencing software, and analysis programs. Sometimes representing months of scientific work that can't be interpreted without hours of manual reconstruction.</p>
        <p className={styles.body}>FLXplorer gives researchers one place to see the full experimental picture, so they can answer: "What did we find, and what does it mean?"</p>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>What We Were Up Against</h2>
        <p className={styles.body}>Flexomics had built breakthrough technology capable of analyzing millions of individual cells in a single experiment. But when researchers finished an experiment, the real struggle began. Three separate tools. Hours of manual work. Piecing together results that should have been connected from the start. There was no integrated solution for this anywhere — not at Flexomics, not in the market.</p>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Where the Complexity Was Hiding</h2>
        <p className={styles.body}>The real problem wasn't the amount of data. It was where it lived. Researchers were constantly switching between tools while trying to hold the entire mental model in their heads. That led to one guiding principle: Complexity belongs in the system, not in the researcher's workflow.</p>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>My Role</h2>
        <p className={styles.body}>I was the lead product designer on a five-person team. I owned the platform end to end — from the first architecture decision to the final prototype.</p>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>How It Came Together</h2>
        <p className={styles.body}>The platform was built around two workspaces — one for visual exploration of cell imagery, one for examining the genetic data behind what was observed. Both operated on the same underlying dataset. The most important design decision was making sure they never felt like two separate tools. When a scientist identified something in imaging, it carried over into sequencing automatically.</p>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>The Hardest Cut</h2>
        <p className={styles.body}>Midway through development, researchers wanted multi-experiment comparison. Building it risked breaking performance under real dataset sizes. I pushed for a fast, stable, focused platform over a feature-complete one that couldn't handle the data. Multi-experiment comparison shipped in the next iteration.</p>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Two Clicks That Changed Everything</h2>
        <p className={styles.bodyHighlight}>A Flexomics team selected one cell in the imaging view and watched its genetic data appear instantly — no switching tools, no manual lookup. Then clicked a single data point in sequencing and watched the exact corresponding cell illuminate in the image. Something that previously required hours across three systems happened in two clicks.</p>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>What Actually Changed</h2>
        <ul className={styles.outcomeList}>
          <li className={styles.outcomeItem}>Replaced three disconnected internal tools with one unified platform</li>
          <li className={styles.outcomeItem}>Became the primary environment for Flexomics scientists</li>
          <li className={styles.outcomeItem}>Repositioned the company from a hardware provider to an end-to-end research platform</li>
          <li className={styles.outcomeItem}>Anchored every customer conversation, collaborator demo, and internal research review</li>
        </ul>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Reflection</h2>
        <p className={styles.bodyReflection}>Complex products succeed when the product absorbs internal complexity instead of exposing it. Designing FLXplorer wasn't just about screens. It was about deciding where complexity should live — and making sure it never landed on the researcher.</p>
      </section>
    </>
  );
}

/* ---- About Content ---- */
function AboutPanel() {
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.headline}>About</h1>
        <p className={styles.subtitle}>Strategy, craft, and cross-functional collaboration.</p>
      </div>

      <hr className={styles.divider} />

      <section className={styles.contentSection}>
        <p className={styles.body}>I'm a senior product designer who works at the intersection of strategy and execution. My focus is on medical, life science, and wellness products — the kind of tools where getting the design right directly affects patient outcomes, research quality, and clinical confidence.</p>
        <p className={styles.body}>I specialize in translating complexity into clarity. Whether it's a genomic analysis platform, a patient-facing wellness tool, or an AI-augmented clinical workflow, I design systems that respect the intelligence of their users while reducing the cognitive burden they carry.</p>
        <p className={styles.body}>My approach is grounded in cross-functional collaboration — working closely with engineering, product, clinical, and science teams to ensure that design decisions are both technically sound and human-centered. I bring structure to ambiguity, and I'm most effective when the problem space is complex and the stakes are high.</p>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>How I Think</h2>
        <div className={styles.qualityGrid}>
          <div className={styles.quality}><span className={styles.qualityTitle}>Strategic Thinking</span><span className={styles.qualityDesc}>Connecting business goals to user needs through research-informed design decisions.</span></div>
          <div className={styles.quality}><span className={styles.qualityTitle}>Systems Design</span><span className={styles.qualityDesc}>Building scalable, consistent design systems for complex product ecosystems.</span></div>
          <div className={styles.quality}><span className={styles.qualityTitle}>Human-Centered Craft</span><span className={styles.qualityDesc}>Grounding every interaction in empathy, accessibility, and real-world use.</span></div>
        </div>
      </section>
    </>
  );
}

/* ---- AI Content ---- */
function AIPanel() {
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.headline}>AI & Design</h1>
        <p className={styles.subtitle}>Designing with intelligence, not just interfaces.</p>
      </div>

      <hr className={styles.divider} />

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>My Approach</h2>
        <p className={styles.body}>AI is reshaping how people interact with complex information. I design AI-powered products that augment human decision-making — not replace it. The goal is always clarity: helping users understand what the system knows, how confident it is, and what they should do next.</p>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Principles</h2>
        <div className={styles.qualityGrid}>
          <div className={styles.quality}><span className={styles.qualityTitle}>Transparency</span><span className={styles.qualityDesc}>Users should always understand why the system is showing them what it's showing.</span></div>
          <div className={styles.quality}><span className={styles.qualityTitle}>Control</span><span className={styles.qualityDesc}>AI assists, humans decide. Every automated action should be reviewable and overridable.</span></div>
          <div className={styles.quality}><span className={styles.qualityTitle}>Appropriate Confidence</span><span className={styles.qualityDesc}>Communicating uncertainty honestly rather than projecting false precision.</span></div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Where I've Applied This</h2>
        <p className={styles.body}>At Flexomics, I designed an AI-assisted query system that surfaced relevant biological patterns without requiring query language fluency. The key was making the AI's reasoning visible — scientists could see why results were surfaced and adjust the parameters to refine them.</p>
        <p className={styles.body}>I believe the best AI products feel like a knowledgeable colleague — helpful, honest about what they don't know, and never in the way.</p>
      </section>
    </>
  );
}

const panels = {
  flexomics: FlexomicsPanel,
  about: AboutPanel,
  ai: AIPanel,
};

export default function DetailPanel({ panelId, onClose }) {
  const PanelContent = panels[panelId];

  if (!PanelContent) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span className={styles.closeBtnLabel}>Close</span>
        </button>
      </div>
      <div className={styles.panelBody}>
        <PanelContent />
      </div>
    </div>
  );
}
