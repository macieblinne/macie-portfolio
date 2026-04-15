import { useRef, useState } from 'react';
import {
  IconBriefcase2,
  IconDiamond,
  IconTopologyRing3,
  IconMountain,
  IconHeart,
  IconMoodWink2,
  IconArrowUpRight,
  IconSparkles,
  IconScale,
  IconEye,
  IconAffiliate,
} from '@tabler/icons-react';
import { PhotoCard } from './Hero';
import styles from './AboutModal.module.css';

function EmailWithCopy({ email }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className={styles.thankEmailRow}>
      <span className={styles.thankEmailText}>{email}</span>
      <button
        type="button"
        className={styles.thankCopyBtn}
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : 'Copy email to clipboard'}
      >
        {copied ? 'Copied!' : 'Copy to clipboard'}
      </button>
    </div>
  );
}

function CardTitle({ icon, emoji, children }) {
  return (
    <span className={styles.cardLabel}>
      <span className={styles.cardIcon} aria-hidden="true">
        {emoji ?? icon}
      </span>
      {children}
    </span>
  );
}

const companies = [
  { name: 'Flexomics', industry: 'Life Science', bg: '#0075A5' },
  { name: 'Aetna', industry: 'Healthcare', bg: '#7D2E8C' },
  { name: 'Roche', industry: 'Life Science', bg: '#0066CC' },
  { name: 'Accelerate Diagnostics', industry: 'Diagnostics', bg: '#004379' },
  { name: 'Akoya Biosciences', industry: 'Life Science', bg: '#49D4F2', bgHover: '#1E8FA8' },
  { name: 'Blue Owl', industry: 'Finance', bg: '#00244F' },
  { name: 'Accio3D', industry: 'AI/Procurement', bg: '#7A0A68' },
  { name: 'iQVIA', industry: 'Clinical Trials', bg: '#299FFD' },
  { name: 'ZEISS', industry: 'Life Science', bg: '#0072CE' },
  { name: 'RBA', industry: 'Supply Chain', bg: '#002C5F' },
];

const values = [
  { title: 'Clarity', desc: "Simple solutions, even when the problem isn't.", Icon: IconSparkles },
  { title: 'Tradeoffs', desc: 'Balancing user needs, business goals, and product reality.', Icon: IconScale },
  { title: 'Transparency', desc: "Users should always know what's happening and WHY. Design should earn transparency.", Icon: IconEye },
  { title: 'Systems', desc: 'Every design decision has a ripple effect.', Icon: IconAffiliate },
];

const toolbox = [
  { name: 'Figma', initial: 'F', bg: '#A259FF' },
  { name: 'Claude', initial: 'C', bg: '#D97757' },
  { name: 'Cursor', initial: 'Cu', bg: '#1F2937' },
  { name: 'Notion', initial: 'N', bg: '#000000' },
  { name: 'Linear', initial: 'L', bg: '#5E6AD2' },
  { name: 'Framer', initial: 'F', bg: '#0055FF' },
];

const timeline = [
  { role: 'Senior Product Designer', company: 'Unosquare', date: 'Jul 2024 — Present', description: 'Leading product design for enterprise clients in health, science, and AI-powered platforms.' },
  { role: 'Product Designer', company: 'Unosquare', note: 'acquired Catalyst UX', date: 'Sep 2022 — Jul 2024', description: 'Designed end-to-end product experiences for complex B2B and clinical workflows.' },
  { role: 'Product Designer', company: 'Catalyst UX', date: 'Feb 2021 — Sep 2022', description: 'Owned design workstreams across multiple client engagements in health and life science.' },
  { role: 'Junior Product Designer', company: 'Catalyst UX', date: 'May 2019 — Dec 2019', description: 'Built foundational UX skills through hands-on client projects and mentorship.' },
];

export default function AboutModal() {
  const introRef = useRef(null);
  const rafRef = useRef(0);

  const handleIntroMove = (e) => {
    const el = introRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const nx = (px - 0.5) * 2;
    const ny = (py - 0.5) * 2;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty('--orb-x', nx.toFixed(3));
      el.style.setProperty('--orb-y', ny.toFixed(3));
      el.style.setProperty('--mx', (px * 100).toFixed(2) + '%');
      el.style.setProperty('--my', (py * 100).toFixed(2) + '%');
      el.style.setProperty('--active', '1');
    });
  };

  const handleIntroLeave = () => {
    const el = introRef.current;
    if (!el) return;
    el.style.setProperty('--orb-x', '0');
    el.style.setProperty('--orb-y', '0');
    el.style.setProperty('--active', '0');
  };

  return (
    <div className={styles.about}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageEyebrow}>About</h1>
      </header>
      <div className={styles.bento}>

        {/* Row 1: Intro — full width */}
        <div
          ref={introRef}
          onMouseMove={handleIntroMove}
          onMouseLeave={handleIntroLeave}
          className={`${styles.card} ${styles.introCard}`}
        >
          <div className={styles.introSpotlight} aria-hidden="true" />
          <div className={styles.introGrain} aria-hidden="true" />
          <div className={styles.introContent}>
            <h1 className={styles.headline}>Howdy, I'm Macie!</h1>
            <p className={styles.tagline}>
              Whether I'm on a 14,000ft summit or 14px deep in Figma, I'm reachable from both.
            </p>
          </div>
        </div>

        {/* Row 2: Profile card (image + bio) + Description */}
        <div className={`${styles.card} ${styles.imageCard}`}>
          <img src="/about1.jpg" alt="Macie in the mountains with her husky" className={styles.imageCardImg} />
          <div className={styles.imageLocation}>
            <span className={styles.imageLocationDot} aria-hidden="true" />
            <span className={styles.imageLocationText}>🏔️ Boulder, Colorado</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.aboutCard}`}>
          <CardTitle emoji="🤠">Who I am</CardTitle>
          <div className={styles.blurbs}>
            <p className={styles.blurb}>
              I'm a Senior Product Designer with 7+ years leading 0→1 design across biotech,
              finance, and advanced manufacturing, the kind of environments where clarity isn't
              a nice-to-have, it's the difference between a confident decision and a missed one.
            </p>
            <p className={styles.blurb}>
              I do my best work when the problem is still fuzzy and the stakes are real. I like
              getting into messy systems, making sense of them, and turning complexity into
              something people can actually use. I also lean on AI throughout my process to
              explore ideas faster, pressure-test solutions, and help teams build with more
              confidence.
            </p>
          </div>
          <div className={styles.aboutActions}>
            <a
              href="https://www.linkedin.com/in/macielinne/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionBtn} ${styles.actionPrimary}`}
            >
              LinkedIn
              <IconArrowUpRight size={16} stroke={2} aria-hidden="true" />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionBtn} ${styles.actionSecondary}`}
            >
              Resume
              <IconArrowUpRight size={16} stroke={2} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={`${styles.card} ${styles.valuesCard}`}>
          <CardTitle icon={<IconDiamond size={22} stroke={1.75} />}>Design Values</CardTitle>
          <div className={styles.valuesGrid}>
            {values.map((v, i) => (
              <div key={v.title} className={styles.valueItem}>
                <p className={styles.valueIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 5: Beyond the Pixels — full width */}
        <div className={`${styles.card} ${styles.passionsCard}`}>
          <div className={styles.passionsGrid}>
            <div className={styles.passionsMain}>
              <CardTitle icon={<IconMountain size={22} stroke={1.75} />}>Beyond the Pixels</CardTitle>
              <div className={styles.passionsContent}>
                <p className={styles.blurb}>
                  When I'm not designing, I'm usually in the mountains. I spend every weekend trail
                  running, snowboarding, and backpacking through Colorado's high country. It's my reset
                  button and where I think most clearly. Most of those miles are shared with my husky,
                  who has stronger opinions than most stakeholders I've worked with.
                </p>
                <p className={`${styles.blurb} ${styles.askMe}`}>
                  <span className={styles.askMeLabel}>Ask me about</span>
                  <span className={styles.askMeBody}>
                    Getting married at the summit of Mt. Kilimanjaro
                    <IconMoodWink2 size={18} stroke={1.75} className={styles.askMeIcon} aria-hidden="true" />
                  </span>
                </p>
                <p className={styles.blurb}>
                  I also care about making design more accessible as a career path. I mentor junior
                  designers when I can because that kind of support made a big difference for me early on.
                </p>
              </div>
            </div>
            <div className={styles.passionsPhoto}>
              <PhotoCard
                className={styles.passionsPhotoCard}
                showLocation={false}
                hideFirstTab
                persistentControls
              />
            </div>
          </div>
        </div>

        {/* Row 6: Companies worked with */}
        <div className={`${styles.card} ${styles.companiesCard}`}>
          <CardTitle icon={<IconHeart size={22} stroke={1.75} />}>Some Companies I'm Lucky to Work With</CardTitle>
          <ul className={styles.companiesList}>
            {companies.map((company) => (
              <li
                key={company.name}
                className={styles.companyRow}
                style={{
                  '--brand': company.bg,
                  '--brand-hover': company.bgHover || company.bg,
                }}
              >
                <span className={styles.companyName}>{company.name}</span>
                <span
                  className={styles.companyIndustry}
                  aria-label={`Industry: ${company.industry}`}
                >
                  {company.industry}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Row 7: Thank You */}
        <div className={`${styles.card} ${styles.thankCard}`}>
          <div className={styles.thankGrain} aria-hidden="true" />
          <div className={styles.thankContent}>
            <span className={styles.thankEyebrow}>Open to Work</span>
            <h2 className={styles.thankHeadline}>Thank you so much for stopping by.</h2>
            <p className={styles.thankSubtitle}>
              I'd love to connect — whether it's to chat about your pain points, a question, or the outdoors. Shoot me an email at:
            </p>
            <EmailWithCopy email="macieblinne@gmail.com" />

          </div>
        </div>

      </div>
    </div>
  );
}
