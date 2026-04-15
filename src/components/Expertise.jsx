import { useReveal } from '../hooks/useReveal';
import styles from './Expertise.module.css';

const strengths = [
  {
    title: 'Enterprise UX',
    description:
      'Designing scalable systems for complex organizations — where workflows span roles, regulatory requirements shape interactions, and simplicity is earned, not assumed.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: 'AI-Assisted Product Design',
    description:
      'Making intelligent systems usable and trustworthy. I design interfaces where AI augments human judgment without obscuring it — transparent, controllable, and clinically sound.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93L12 22" />
        <path d="M12 2a4 4 0 0 0-4 4c0 1.95 1.4 3.58 3.25 3.93" />
        <path d="M8.56 13a8 8 0 0 0-2.3 3.5" />
        <path d="M15.44 13a8 8 0 0 1 2.3 3.5" />
      </svg>
    ),
  },
  {
    title: 'Data-Dense Workflows',
    description:
      'Turning information overload into structured decision-making. I design for professionals who need to see everything — and understand it immediately.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
  },
  {
    title: 'Regulated & Technical Systems',
    description:
      'Experienced in healthcare, life science, and compliance-heavy environments. I understand the constraints that shape design in these spaces — and how to design beautifully within them.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Cross-Functional Collaboration',
    description:
      'I bridge product, engineering, clinical, and science stakeholders. I translate between disciplines, facilitate alignment, and keep teams focused on user outcomes.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Turning Ambiguity into Structure',
    description:
      'I thrive in early-stage and undefined problem spaces. From vague briefs to shipped products — I bring frameworks, clarity, and momentum where there was none.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
];

function StrengthCard({ item, index }) {
  const ref = useReveal();

  return (
    <div
      className={`${styles.card} reveal`}
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={styles.iconWrap} aria-hidden="true">
        {item.icon}
      </div>
      <h3 className={styles.cardTitle}>{item.title}</h3>
      <p className={styles.cardDesc}>{item.description}</p>
    </div>
  );
}

export default function Expertise() {
  const headingRef = useReveal();

  return (
    <section className={styles.section} aria-label="Areas of expertise">
      <div className={styles.container}>
        <div className={`${styles.sectionHeader} reveal`} ref={headingRef}>
          <span className={styles.sectionLabel}>Expertise</span>
          <h2 className={styles.sectionTitle}>
            Where I create the most{' '}
            <span className={styles.serif}>impact</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {strengths.map((item, i) => (
            <StrengthCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
