import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './AccioDetail.module.css';

function ReadingProgress({ targetRef }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const scroller = el.closest('.page-content') || document.scrollingElement || window;

    const getScroll = () =>
      scroller === window
        ? window.scrollY
        : scroller.scrollTop ?? 0;
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

const timeline = [
  { phase: 'Ph. 1', name: 'Solution Blueprint', desc: 'Defined users, objects, workflows and architecture for the POC' },
  { phase: 'Ph. 1', name: 'POC Design', desc: 'Designed the proof-of-concept that went in front of funders' },
  { phase: 'Ph. 1', name: 'User Validation', desc: 'Core workflow tested with real users across multiple industries' },
  { phase: '★', name: 'Seed funding secured', desc: 'The POC convinced investors. A full MVP was greenlit.', funded: true },
  { phase: 'Ph. 2', name: 'Solution Blueprint', desc: 'Contributed user flows and Phase 1 research context into scope discussions' },
  { phase: 'Ph. 2', name: 'MVP Design', desc: '50 screens across Purchaser App and Supplier App in 13 weeks' },
];

const takeaways = [
  "Knowing what the AI could do was the easy part. The real work was deciding what a buyer needed to see and what they didn't.",
  'Advocating for restraint under pressure and making the reasoning visible to a client is as important as the design work itself.',
  'Working across both phases gave me the chance to see what my own design decisions actually unlocked.',
];

export default function AccioDetail() {
  const articleRef = useRef(null);
  return (
    <>
      <ReadingProgress targetRef={articleRef} />
    <article className={styles.root} ref={articleRef}>
      <section className={styles.hero} aria-label="Accio3D case study hero">
        <div className={styles.heroGrain} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              An AI-Powered Procurement Platform from{' '}
              <em>POC to MVP</em>
            </h1>
          </div>
          <div className={styles.heroImageWrap}>
            <img
              src="/accio-cs/Hero.svg"
              alt="Accio3D product screens"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      <div className={styles.meta}>
        <div className={styles.metaCell}>
          <div className={styles.metaLabel}>Company</div>
          <div className={styles.metaValue}>Accio3D</div>
        </div>
        <div className={styles.metaCell}>
          <div className={styles.metaLabel}>Role</div>
          <div className={styles.metaValue}>Senior Product Designer</div>
        </div>
        <div className={styles.metaCell}>
          <div className={styles.metaLabel}>Phase 1</div>
          <div className={styles.metaValue}>Blueprint + POC</div>
        </div>
        <div className={styles.metaCell}>
          <div className={styles.metaLabel}>Phase 2</div>
          <div className={styles.metaValue}>50 screens · 13 weeks</div>
        </div>
      </div>

      <div className={styles.timeline}>
        {timeline.map((t, i) => (
          <div
            key={i}
            className={`${styles.tlRow} ${t.funded ? styles.tlRowFunded : ''}`}
          >
            <div className={`${styles.tlCell} ${styles.tlPhase}`}>{t.phase}</div>
            <div className={`${styles.tlCell} ${styles.tlName}`}>{t.name}</div>
            <div className={`${styles.tlCell} ${styles.tlDesc}`}>{t.desc}</div>
          </div>
        ))}
      </div>

      <hr className={styles.divider} />

      <div className={styles.phaseLabel}>
        <span className={styles.phaseTag}>Context</span>
      </div>
      <h2 className={styles.sectionHeading}>The Situation</h2>
      <p className={styles.body}>
        Accio3D is a marketplace for end-of-life industrial parts. When a critical component
        fails and the original supplier no longer exists, procurement teams are left searching
        manually: phone calls, spreadsheets, days of coordination. Accio3D replaces that process:
        upload a part, AI assesses the printability of the part and matches qualified suppliers, quotes come
        back, an order gets placed. All in one session.
      </p>

      <hr className={styles.divider} />

      <div className={styles.phaseLabel}>
        <span className={styles.phaseTag}>Phase 1 · Blueprint + POC</span>
      </div>
      <h2 className={styles.sectionHeading}>Making the value visible</h2>
      <p className={styles.body}>
        The POC had one job: show investors something they could follow without explanation. Two
        design decisions carried the most weight.
      </p>

      <div className={styles.decision}>
        <div className={styles.decisionBody}>
          <div className={styles.decisionHeader}>
            <span className={styles.decisionNum}>Decision 1</span>
            <span className={styles.decisionDivider} aria-hidden="true">·</span>
            <span className={styles.decisionLabel}>Printability Assessment</span>
          </div>
          <p>
            I designed the assessment so buyers could see printability status at a glance. The
            path forward still required manual material and equipment input (a friction point
            that became central to how the screen evolved in Phase 2).
          </p>
        </div>
        <Graphic
          src="/accio-cs/Printability.svg"
          alt="Printability Assessment screen"
        />
      </div>

      <div className={styles.decision}>
        <div className={styles.decisionBody}>
          <div className={styles.decisionHeader}>
            <span className={styles.decisionNum}>Decision 2</span>
            <span className={styles.decisionDivider} aria-hidden="true">·</span>
            <span className={styles.decisionLabel}>Supplier Matching</span>
          </div>
          <p>
            I designed the matching view to surface qualified suppliers with the context buyers
            needed to evaluate them immediately: capabilities, geography, lead time, quality
            tier. The decision was to show enough to act on, without requiring any digging.
          </p>
        </div>
        <Graphic
          src="/accio-cs/SupplierMatching.svg"
          alt="Supplier match view"
        />
      </div>

      <div className={styles.phaseLabel}>
        <span className={styles.phaseTag}>Phase 1 · User Validation</span>
      </div>
      <h2 className={styles.sectionHeading}>Testing the workflow with real users</h2>
      <p className={styles.body}>
        Before the seed round closed, the client brought me back to gather user feedback and
        implement changes.{' '}
        <strong style={{ fontStyle: 'italic' }}>
          The most important signal: the core workflow held up. Users followed it and were
          excited about seeing themselves using it.
        </strong>
      </p>
      <p className={styles.body}>
        But one thing was clear. The Printability Assessment required too many manual selections
        and overrides. These were busy people coming for quick answers & not more work. That
        feedback directly shaped Phase 2: we shifted the burden from the user to the system,
        surfacing AI recommendations by default rather than asking buyers to drive them.
      </p>
      <p className={styles.body}>
        When I returned for Phase 2, I wasn't starting from assumptions. I knew exactly what to
        protect and what to fix.
      </p>



      <div className={styles.milestone}>
        <div className={styles.milestoneGlow} aria-hidden="true" />
        <span className={styles.milestoneEyebrow}>
          <span className={styles.milestoneDot} aria-hidden="true" />
          Milestone
        </span>
        <p className={styles.milestoneHeadline}>Seed round closed.</p>
        <p className={styles.milestoneQuote}>
          The technology showed what was possible. The design empowered our stakeholder to sell it.
        </p>
      </div>

      <div className={styles.phaseLabel}>
        <span className={styles.phaseTag}>Phase 2 · Blueprint + MVP</span>
      </div>
      <h2 className={styles.sectionHeading}>From proof to production</h2>
      <p className={styles.body}>
        Working alongside the strategist leading the Blueprint sessions, I contributed user flow
        work and brought firsthand Phase 1 context directly into the scope discussions. The
        result: 50 screens across two applications in 13 weeks.
      </p>

      <Graphic
        src="/accio-cs/SolutionBlueprint.png"
        alt="Solution Blueprint FigJam board"
      />

      <h3 className={styles.subSectionHeading}>
        <span className={styles.subSectionEyebrow}>Part 1 / 3</span>
        The Purchaser App
      </h3>
      <p className={styles.body}>
        I designed the purchaser experience as a single continuous path. Upload a part, review
        the assessment, send requests to suppliers, compare bids, place an order. No tool
        switching. No dead ends.
      </p>

      <Carousel
        slides={[
          { src: '/accio-cs/1.svg', alt: 'Purchaser App screen 1' },
          { src: '/accio-cs/2.svg', alt: 'Purchaser App screen 2' },
          { src: '/accio-cs/3.svg', alt: 'Purchaser App screen 3' },
          { src: '/accio-cs/4.svg', alt: 'Purchaser App screen 4' },
          { src: '/accio-cs/5.svg', alt: 'Purchaser App screen 5' },
        ]}
      />

      <h3 className={styles.subSectionHeading}>
        <span className={styles.subSectionEyebrow}>Part 2 / 3</span>
        The Supplier App
      </h3>
      <p className={styles.body}>
        We kept the supplier portal intentionally lean. Receive RFQs, submit quotes, track
        orders through production. Fast and reliable over feature-complete.
      </p>

      <div className={styles.imageCard}>
        <img
          src="/accio-cs/Supplier.png"
          alt="Supplier App"
          className={styles.imageCardImg}
        />
      </div>

      <h3 className={styles.subSectionHeading}>
        <span className={styles.subSectionEyebrow}>Part 3 / 3</span>
        The hardest call
      </h3>
      <p className={styles.body}>
        There was real pressure to surface AI everywhere. Every screen felt like an opportunity
        to show what the technology could do. The design position I held was the opposite. A
        procurement specialist doesn't need to see the AI working. They need an answer.
      </p>
      <p className={styles.body}>
        That meant deliberate choices about where AI surfaced and how: clearly, in the right
        moments, without explanation. <strong style={{ fontStyle: 'italic' }}>
          The hardest part wasn't designing the AI interfaces. It was making the case for
          restraint when the appetite for more was real.
        </strong>
      </p>

      <Graphic src="/accio-cs/AI.svg" alt="AI surfaced in the workflow" />

      <hr className={styles.divider} />

      <div className={styles.takeaway}>
        <h3 className={styles.takeawayHeading}>What I took away</h3>
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

function Carousel({ slides, caption }) {
  const [active, setActive] = useState(0);
  const count = slides.length;
  const go = (i) => setActive(((i % count) + count) % count);
  return (
    <figure className={styles.carousel}>
      <div className={styles.carouselStage}>
        <img
          src={slides[active].src}
          alt=""
          aria-hidden="true"
          className={styles.carouselSizer}
        />
        {slides.map((s, i) => (
          <img
            key={i}
            src={s.src}
            alt={i === active ? s.alt || '' : ''}
            aria-hidden={i === active ? undefined : true}
            className={`${styles.carouselImage} ${i === active ? styles.carouselImageActive : ''}`}
          />
        ))}
      </div>
      {count > 1 && (
        <div className={styles.carouselThumbs} role="tablist" aria-label="Slides">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active === i}
              className={`${styles.carouselThumb} ${active === i ? styles.carouselThumbActive : ''}`}
              onClick={() => go(i)}
            >
              <img src={s.src} alt="" />
            </button>
          ))}
        </div>
      )}
      {caption && <figcaption className={styles.graphicImgCaption}>{caption}</figcaption>}
    </figure>
  );
}

function PhaseToggle() {
  const [active, setActive] = useState('phase1');
  const phases = {
    phase1: {
      src: '/accio-cs/Printability.svg',
      alt: 'Printability Assessment — Phase 1',
    },
    phase2: {
      src: '/accio-cs/Printability_Phase2.svg',
      alt: 'Printability Assessment — Phase 2',
    },
  };
  return (
    <div className={styles.phaseToggle}>
      <div className={styles.phaseTabs} role="tablist" aria-label="Printability comparison">
        <button
          type="button"
          role="tab"
          aria-selected={active === 'phase1'}
          className={`${styles.phaseTabBtn} ${active === 'phase1' ? styles.phaseTabBtnActive : ''}`}
          onClick={() => setActive('phase1')}
        >
          Phase 1
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={active === 'phase2'}
          className={`${styles.phaseTabBtn} ${active === 'phase2' ? styles.phaseTabBtnActive : ''}`}
          onClick={() => setActive('phase2')}
        >
          Phase 2
        </button>
        <span
          className={styles.phaseTabSlider}
          style={{ transform: `translateX(${active === 'phase2' ? '100%' : '0%'})` }}
          aria-hidden="true"
        />
      </div>
      <figure className={styles.phaseFigure} key={active}>
        <img
          src={phases[active].src}
          alt={phases[active].alt}
          className={styles.graphicImg}
        />
      </figure>
    </div>
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
