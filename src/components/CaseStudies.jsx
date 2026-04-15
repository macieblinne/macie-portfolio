import { useReveal } from '../hooks/useReveal';
import styles from './CaseStudies.module.css';

const studies = [
  {
    id: 'flexomics',
    title: 'Flexomics',
    domain: 'Life Science / Genomics',
    summary:
      'Redesigned a genomic data platform used by research scientists to analyze multi-omic datasets, reducing time-to-insight and making complex biological data navigable for non-bioinformaticians.',
    challenge:
      'Scientists were drowning in fragmented tools and unintuitive interfaces that obscured their data. Analysis workflows that should have taken minutes were taking hours.',
    contribution:
      'Led end-to-end product design from discovery through delivery. Conducted stakeholder interviews, mapped existing workflows, defined an information architecture for dense datasets, and designed an AI-assisted query system that surfaced relevant patterns.',
    outcome:
      'Reduced average analysis workflow time by 40%. Increased self-serve usage among non-technical researchers. Established a scalable design system for the platform.',
    tags: ['Enterprise UX', 'Data Visualization', 'AI Integration', 'Design System'],
    // REPLACE: Add your actual case study image path
    image: null,
    // REPLACE: Link to full case study page when ready
    href: '#',
    color: 'rose',
  },
  {
    id: 'blue-owl',
    title: 'Blue Owl',
    domain: 'Health & Wellness / Digital Therapeutics',
    summary:
      'Designed a patient-facing wellness platform that synthesizes behavioral health data into actionable, personalized guidance — bridging the gap between clinical rigor and everyday usability.',
    challenge:
      'Patients were overwhelmed by health data without context. Clinicians needed a tool that could communicate treatment progress without adding to their documentation burden.',
    contribution:
      'Owned the product design workstream from concept through launch. Created patient journey maps, designed an adaptive dashboard for both patients and providers, and developed a notification framework that balanced engagement with clinical appropriateness.',
    outcome:
      'Achieved 3x improvement in patient engagement with treatment plans. Reduced clinician review time per patient by 25%. Launched to pilot cohort on schedule.',
    tags: ['Patient Experience', 'Clinical Workflows', 'Responsive Design', 'Accessibility'],
    // REPLACE: Add your actual case study image path
    image: null,
    // REPLACE: Link to full case study page when ready
    href: '#',
    color: 'plum',
  },
];

function CaseStudyCard({ study, index }) {
  const ref = useReveal();

  return (
    <article
      className={`${styles.card} ${styles[study.color]} reveal`}
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Image Area */}
      <div className={styles.imageArea}>
        {study.image ? (
          <img src={study.image} alt={`${study.title} project preview`} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            {/* REPLACE: Add project screenshot or hero image */}
            <span className={styles.placeholderText}>{study.title}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.domain}>{study.domain}</span>
        </div>

        <h3 className={styles.title}>{study.title}</h3>
        <p className={styles.summary}>{study.summary}</p>

        <div className={styles.details}>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Challenge</span>
            <p className={styles.detailText}>{study.challenge}</p>
          </div>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Contribution</span>
            <p className={styles.detailText}>{study.contribution}</p>
          </div>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Outcome</span>
            <p className={styles.detailText}>{study.outcome}</p>
          </div>
        </div>

        <div className={styles.tags}>
          {study.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <a href={study.href} className={styles.cta}>
          View case study
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </article>
  );
}

export default function CaseStudies() {
  const headingRef = useReveal();

  return (
    <section id="work" className={styles.section} aria-label="Selected work">
      <div className={styles.container}>
        <div className={`${styles.sectionHeader} reveal`} ref={headingRef}>
          <span className={styles.sectionLabel}>Selected Work</span>
          <h2 className={styles.sectionTitle}>
            Designing for complexity,{' '}
            <span className={styles.serif}>delivering clarity</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {studies.map((study, i) => (
            <CaseStudyCard key={study.id} study={study} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
