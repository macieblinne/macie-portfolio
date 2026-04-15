import { useReveal } from '../hooks/useReveal';
import styles from './About.module.css';

export default function About() {
  const ref = useReveal();

  return (
    <section id="about" className={styles.section} aria-label="About">
      <div className={styles.container}>
        <div className={`${styles.bento} reveal`} ref={ref}>

          {/* Intro — headline + lead paragraph */}
          <div className={`${styles.tile} ${styles.intro}`}>
            <span className={styles.sectionLabel}>About</span>
            <h2 className={styles.title}>
              Bringing strategic depth to{' '}
              <span className={styles.serif}>every interface</span>
            </h2>
            <p className={styles.lead}>
              I'm a senior product designer who works at the intersection of strategy
              and execution. My focus is on medical, life science, and wellness
              products — the kind of tools where getting the design right directly
              affects patient outcomes, research quality, and clinical confidence.
            </p>
          </div>

          {/* Photo */}
          <div className={`${styles.tile} ${styles.photo}`}>
            <div className={styles.photoInner}>
              <span className={styles.photoInitials}>MC</span>
            </div>
          </div>

          {/* Approach */}
          <div className={`${styles.tile} ${styles.approach}`}>
            <span className={styles.tileLabel}>Approach</span>
            <p>
              I specialize in translating complexity into clarity. Whether it's a
              genomic analysis platform, a patient-facing wellness tool, or an
              AI-augmented clinical workflow, I design systems that respect the
              intelligence of their users while reducing the cognitive burden they carry.
            </p>
          </div>

          {/* Collaboration */}
          <div className={`${styles.tile} ${styles.collab}`}>
            <span className={styles.tileLabel}>Collaboration</span>
            <p>
              Grounded in cross-functional work with engineering, product, clinical,
              and science teams — bringing structure to ambiguity when the problem
              space is complex and the stakes are high.
            </p>
          </div>

          {/* Qualities */}
          <div className={`${styles.tile} ${styles.quality}`}>
            <span className={styles.qualityTitle}>Strategic Thinking</span>
            <span className={styles.qualityDesc}>
              Connecting business goals to user needs through research-informed design decisions.
            </span>
          </div>
          <div className={`${styles.tile} ${styles.quality}`}>
            <span className={styles.qualityTitle}>Systems Design</span>
            <span className={styles.qualityDesc}>
              Building scalable, consistent design systems for complex product ecosystems.
            </span>
          </div>
          <div className={`${styles.tile} ${styles.quality}`}>
            <span className={styles.qualityTitle}>Human-Centered Craft</span>
            <span className={styles.qualityDesc}>
              Grounding every interaction in empathy, accessibility, and real-world use.
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
