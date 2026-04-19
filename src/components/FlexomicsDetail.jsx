import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './FlexomicsDetail.module.css';

function ReadingProgress({ targetRef }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const scroller = el.closest('.page-content') || document.scrollingElement || window;

    const getScroll = () =>
      scroller === window ? window.scrollY : scroller.scrollTop ?? 0;
    const getViewport = () =>
      scroller === window ? window.innerHeight : scroller.clientHeight;

    const update = () => {
      const vh = getViewport();
      const total = el.offsetHeight - vh;
      const scrolled = getScroll();
      const ratio = total > 0 ? scrolled / total : 0;
      setProgress(Math.max(0, Math.min(1, ratio)));
    };
    update();
    const target = scroller === window ? window : scroller;
    target.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      target.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [targetRef]);

  return createPortal(
    <div className={styles.progressBar} aria-hidden="true">
      <div
        className={styles.progressFill}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>,
    document.body
  );
}

function Graphic({ tag, caption, src, alt }) {
  if (src) {
    return (
      <figure className={styles.graphicImage}>
        <img src={src} alt={alt || caption} className={styles.graphicImg} />
        {caption && <figcaption className={styles.graphicImgCaption}>{caption}</figcaption>}
      </figure>
    );
  }
  return (
    <div className={styles.graphic}>
      <div className={styles.graphicTag}>{tag}</div>
      <div className={styles.graphicCaption}>{caption}</div>
    </div>
  );
}

function Quote({ children }) {
  return (
    <div className={styles.quote}>
      <p>{children}</p>
    </div>
  );
}

const takeaways = [
  'Complex products succeed when the product absorbs internal complexity rather than exposing it. The interface surfaces only what helps researchers reason through experiments, not the pipelines driving them.',
  'Advocating for scope restraint under real pressure, and making the reasoning visible to a founding team, is as important as the design work itself.',
  'Architectural decisions determine whether breakthrough technology becomes a usable product or stays an experimental tool. The structure of the platform was the design.',
];

export default function FlexomicsDetail() {
  const articleRef = useRef(null);
  return (
    <>
      <ReadingProgress targetRef={articleRef} />
      <article className={styles.root} ref={articleRef}>
        <section className={styles.hero} aria-label="Flexomics case study hero">
          <div className={styles.heroGrain} aria-hidden="true" />
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                From Three Fragmented Tools to{' '}
                <em>One Research Platform</em>
              </h1>
            </div>
            <div className={styles.heroImageWrap}>
              <img
                src="/flexomics-hero.svg"
                alt="Flexomics research platform"
                className={styles.heroImage}
              />
            </div>
          </div>
        </section>

        <div className={styles.meta}>
          <div className={styles.metaCell}>
            <div className={styles.metaLabel}>Company</div>
            <div className={styles.metaValue}>Flexomics</div>
          </div>
          <div className={styles.metaCell}>
            <div className={styles.metaLabel}>Role</div>
            <div className={styles.metaValue}>Senior Product Designer</div>
          </div>
          <div className={styles.metaCell}>
            <div className={styles.metaLabel}>Timeline</div>
            <div className={styles.metaValue}>12 weeks · MVP</div>
          </div>
          <div className={styles.metaCell}>
            <div className={styles.metaLabel}>Scope</div>
            <div className={styles.metaValue}>End-to-end · 2 workspaces</div>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.phaseLabel}>
          <span className={styles.phaseTag}>Context</span>
        </div>
        <h2 className={styles.sectionHeading}>The Situation</h2>
        <p className={styles.body}>
          When you run single-cell experiments, insights are quietly fragmented across imaging
          tools, sequencing software, and analysis programs. Sometimes representing <span className={styles.highlight}>months of
          scientific work</span> that can't be interpreted without <span className={styles.highlight}>hours of manual reconstruction</span>.
        </p>
        <p className={styles.body}>
          FLXplorer gives researchers one place to see the full experimental picture, so they
          can answer: "What did we find, and what does it mean?"
        </p>
        <p className={styles.body}>
          <span className={styles.highlight}>
            It replaces three disconnected tools with a single unified environment, so scientists
            can move from experiment to insight without reconstructing anything by hand.
          </span>
        </p>

        <hr className={styles.divider} />

        <div className={styles.phaseLabel}>
          <span className={styles.phaseTag}>Discovery · Core Insight</span>
        </div>
        <h2 className={styles.sectionHeading}>Where the complexity was hiding</h2>
        <p className={styles.body}>
          Early conversations with scientists made clear that the problem wasn't the amount of
          data. It was how that data was distributed. Researchers were <span className={styles.highlight}>constantly switching
          contexts</span> between imaging and sequencing systems while trying to <span className={styles.highlight}>hold the relationships
          between datasets in their heads</span>.
        </p>

        <Quote>
          Complexity belongs in the system, not in the researcher's workflow.
        </Quote>

        <p className={styles.body}>
          That principle anchored every design decision that followed. Scientists should be able
          to focus on interpreting biology, not stitching together datasets. The platform needed
          to absorb the internal complexity so researchers didn't have to.
        </p>

        <Graphic
          src="/flexomics-cs/research.png"
          alt="Before and after: three disconnected tools vs. one unified research session"
        />

        <hr className={styles.divider} />

        <div className={styles.phaseLabel}>
          <span className={styles.phaseTag}>Architecture · Platform Design</span>
        </div>
        <h2 className={styles.sectionHeading}>Two workspaces, one dataset</h2>
        <p className={styles.body}>
          To support large datasets without overwhelming users, the platform was organized around
          two primary workspaces aligned with how scientists actually think, not how the data was
          technically structured. Both operated on the same underlying dataset, so discoveries
          made in one context appeared immediately in the other.
        </p>

        <div className={styles.decision}>
          <div className={styles.decisionBody}>
            <div className={styles.decisionHeader}>
              <span className={styles.decisionNum}>Workspace 1</span>
              <span className={styles.decisionDivider} aria-hidden="true">·</span>
              <span className={styles.decisionLabel}>Imaging</span>
            </div>
            <p>
              Where scientists start. Thousands of cells captured under a microscope, explored
              visually to find populations worth investigating. Designed so researchers could do
              that exploration without needing to understand the technical pipelines underneath.
            </p>
          </div>
          <Graphic src="/flexomics-cs/imaging.gif" alt="Imaging workspace in action" />
        </div>

        <div className={styles.decision}>
          <div className={styles.decisionBody}>
            <div className={styles.decisionHeader}>
              <span className={styles.decisionNum}>Workspace 2</span>
              <span className={styles.decisionDivider} aria-hidden="true">·</span>
              <span className={styles.decisionLabel}>Sequencing</span>
            </div>
            <p>
              Where scientists go deeper. The same experiment, seen through genetic data.
              Researchers examine how genes are expressed across large cell populations to
              understand the biological signals driving what they observed in imaging.
            </p>
          </div>
          <Graphic src="/flexomics-cs/sequencing.gif" alt="Sequencing workspace in action" />
        </div>

        <h3 className={styles.subSectionHeading}>
          <span className={styles.subSectionEyebrow}>Cross-Modal Continuity</span>
          One selection, two views
        </h3>
        <p className={styles.body}>
          The most important design decision in the platform was making sure the two workspaces
          never felt like two separate tools. When a scientist identified a cell population in
          imaging, that selection carried over into sequencing automatically. When they
          investigated a genetic signal in sequencing, the corresponding cells were already
          waiting in the imaging view.
        </p>
        <p className={styles.body}>
          The data stayed connected so the researcher didn't have to be the one holding it
          together. Moving between workspaces felt like <span className={styles.highlight}>one continuous line of thinking, not a
          context switch</span>.
        </p>

        <hr className={styles.divider} />

        <div className={styles.phaseLabel}>
          <span className={styles.phaseTag}>Key Decision · Scope Trade-off</span>
        </div>
        <h2 className={styles.sectionHeading}>The hardest cut</h2>
        <p className={styles.body}>
          Midway through development, researchers made clear they wanted the ability to compare
          results across multiple experiments. It was a real scientific need. Implementing it
          within the <span className={styles.highlight}>12-week timeline</span> would have introduced performance problems at the dataset
          sizes Flexomics was working at.
        </p>

        <div className={styles.decisionGrid}>
          <div className={`${styles.decision} ${styles.decisionDimmed}`}>
            <div className={styles.decisionBody}>
              <div className={styles.decisionHeader}>
                <span className={styles.decisionNum}>Option 1</span>
                <span className={styles.decisionDivider} aria-hidden="true">·</span>
                <span className={styles.decisionLabel}>Build it now</span>
              </div>
              <p>
                Support multi-experiment comparison in the MVP. Risk: <span className={styles.highlight}>performance instability</span> under
                real dataset sizes. A platform that <span className={styles.highlight}>broke down under load</span> would have undermined
                everything shipped alongside it.
              </p>
            </div>
          </div>

          <div className={`${styles.decision} ${styles.decisionChosen}`}>
            <div className={styles.decisionBody}>
              <div className={styles.decisionHeader}>
                <span className={styles.decisionNum}>Option 2</span>
                <span className={styles.decisionDivider} aria-hidden="true">·</span>
                <span className={styles.decisionLabel}>Protect the core</span>
                <span className={styles.chosenBadge}>Chosen</span>
              </div>
              <p>
                Focus on making imaging and sequencing exploration <span className={styles.highlight}>reliable at scale</span>. Ship a {' '}
                <span className={styles.highlight}>stable, fast platform</span> researchers could trust, and plan multi-experiment
                comparison for the next phase.
              </p>
            </div>
          </div>
        </div>

        <p className={styles.body}>
          I pushed for Option 2. With a founding team watching every sprint, shipping something
          that broke under real conditions wasn't a viable path. A fast and stable core platform
          would do more for researchers than an unstable one that tried to do everything.
        </p>

        <Graphic
          src="/flexomics-cs/parkinglot.png"
          alt="Parking lot of scope decisions"
        />

        <div className={styles.milestone}>
          <div className={styles.milestoneGlow} aria-hidden="true" />
          <span className={styles.milestoneEyebrow}>
            <span className={styles.milestoneDot} aria-hidden="true" />
            Milestone
          </span>
          <p className={styles.milestoneHeadline}>MVP shipped in 12 weeks.</p>
          <p className={styles.milestoneQuote}>
            Stable at <span className={styles.highlight}>millions of cells</span>. Two workspaces operating on a single dataset. Three
            disconnected tools replaced by <span className={styles.highlight}>one continuous research session</span>.
          </p>
        </div>

        <hr className={styles.divider} />

        <div className={styles.phaseLabel}>
          <span className={styles.phaseTag}>Impact</span>
        </div>
        <h2 className={styles.sectionHeading}>What actually changed</h2>

        <div className={styles.impactGrid}>
          <div className={styles.impactCard}>
            <h3 className={styles.impactHeading}>The defining moment</h3>
            <p>
              A scientist selected one cell in the imaging view and watched its genetic data appear
              instantly. Then did it in reverse — clicked a data point in sequencing and the
              corresponding cell illuminated in the image.
            </p>
            <p>
              <span className={styles.highlight}>Something that previously required hours of cross-referencing across three
              separate systems happened in two clicks.</span>
            </p>
          </div>

          <div className={styles.impactCard}>
            <h3 className={styles.impactHeading}>Operational impact</h3>
            <p>
              FLXplorer <span className={styles.highlight}>replaced three disconnected internal tools</span> and became the primary
              environment for exploring experimental data. Workflows that required stitching
              together multiple systems were consolidated into a <span className={styles.highlight}>single session</span>.
            </p>
          </div>

          <div className={styles.impactCard}>
            <h3 className={styles.impactHeading}>Strategic impact</h3>
            <p>
              FLXplorer became Flexomics' <span className={styles.highlight}>primary differentiator</span>, repositioning the company from
              a <span className={styles.highlight}>hardware provider to an integrated platform</span> for single-cell research. It anchored
              customer conversations, powered demos, and drove internal research workflows.
            </p>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.takeaway}>
          <h3 className={styles.takeawayHeading}>What building from zero taught me</h3>
          <div className={styles.takeawayGrid}>
            {takeaways.map((text, i) => (
              <div key={i} className={styles.tgCell}>
                <div className={styles.tgNum}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.tgText}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
