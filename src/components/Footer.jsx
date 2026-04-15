import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <p className={styles.copy}>
          &copy; {year} — Designed & built with intention.
        </p>
        <div className={styles.links}>
          {/* REPLACE: Your actual LinkedIn URL */}
          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            LinkedIn
          </a>
          {/* REPLACE: Your actual email */}
          <a href="mailto:hello@youremail.com" className={styles.link}>
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
