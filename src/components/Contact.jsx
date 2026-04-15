import { useReveal } from '../hooks/useReveal';
import styles from './Contact.module.css';

export default function Contact() {
  const ref = useReveal();

  return (
    <section id="contact" className={styles.section} aria-label="Contact">
      <div className={styles.container}>
        <div className={`${styles.card} reveal`} ref={ref}>
          <div className={styles.content}>
            <span className={styles.sectionLabel}>Let's connect</span>
            <h2 className={styles.title}>
              Interested in working{' '}
              <span className={styles.serif}>together?</span>
            </h2>
            <p className={styles.description}>
              I'm currently exploring senior product design roles in medical,
              life science, and wellness spaces. If you're building something
              meaningful in these areas, I'd welcome the conversation.
            </p>

            <div className={styles.ctas}>
              {/* REPLACE: Your actual email */}
              <a href="mailto:hello@youremail.com" className={styles.primaryCta}>
                Send me an email
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              {/* REPLACE: Your actual LinkedIn URL */}
              <a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryCta}
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Email</span>
              {/* REPLACE: Your actual email */}
              <a href="mailto:hello@youremail.com" className={styles.detailValue}>
                hello@youremail.com
              </a>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>LinkedIn</span>
              {/* REPLACE: Your actual LinkedIn */}
              <a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.detailValue}
              >
                /in/yourprofile
              </a>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Location</span>
              {/* REPLACE: Your location */}
              <span className={styles.detailValue}>United States</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
