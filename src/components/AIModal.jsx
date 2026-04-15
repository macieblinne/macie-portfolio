import { IconQuote, IconSparkles } from '@tabler/icons-react';
import styles from './AIModal.module.css';

function CardTitle({ icon, children }) {
  return (
    <span className={styles.cardTitle}>
      <span className={styles.cardIcon} aria-hidden="true">{icon}</span>
      {children}
    </span>
  );
}

const principles = [
  {
    num: '01',
    title: 'Craft',
    body: "AI surfaces endless opportunities and outputs. I keep the context, the taste, and decide what's best for users. Bridging the two is a new form of craft.",
  },
  {
    num: '02',
    title: 'Adaptability',
    body: 'AI tools change daily. What stays constant is picking things up fast, integrating without disruption, and letting go when something better arrives.',
  },
  {
    num: '03',
    title: 'Transparency',
    body: "I'm transparent with users and my teams about where AI fits in. It's a design decision always worth naming.",
  },
  {
    num: '04',
    title: 'Awareness',
    body: "AI doesn't manage stakeholder relationships, empathize with users, or align with teams. A fully present designer is needed for that.",
  },
];

const toolPhases = [
  {
    phase: 'Think',
    tools: [
      { name: 'Claude', use: 'Research, analysis, design critique', logo: '/logos/ai/claude.png', accent: '#D97757' },
      { name: 'ChatGPT', use: 'Flows, edge cases, ideation', logo: '/logos/ai/chatgpt.png', accent: '#10A37F' },
    ],
  },
  {
    phase: 'Make',
    tools: [
      { name: 'Figma Make', use: 'Fast UI concepts', logo: '/logos/ai/figma.png', accent: '#A259FF' },
      { name: 'Midjourney', use: 'Moodboards, visual storytelling', logo: '/logos/ai/midjourney.png', accent: '#D4A838' },
    ],
  },
  {
    phase: 'Ship',
    tools: [
      { name: 'Cursor', use: 'Coded prototypes, handoff', logo: '/logos/ai/cursor.png', accent: '#475569' },
      { name: 'Vercel', use: 'Fast stakeholder deploys', logo: '/logos/ai/vercel.png', accent: '#0C447C' },
    ],
  },
];

export default function AIModal() {
  return (
    <div className={styles.ai}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageEyebrow}>AI</h1>
      </header>

      <section className={styles.bento} aria-label="AI in my design practice">

        {/* Hero */}
        <div className={`${styles.tile} ${styles.heroTile}`}>
          <div className={styles.heroGrain} aria-hidden="true" />
          <div className={styles.heroOrbA} aria-hidden="true" />
          <div className={styles.heroOrbB} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p className={`${styles.tileLabel} ${styles.heroLabel}`}>
              <span className={styles.heroDot} aria-hidden="true" />
              AI Practices
            </p>
            <h2 className={styles.heroHeading}>
              How I Use AI in My Work
            </h2>
          </div>
        </div>

        {/* Principles */}
        <div className={`${styles.tile} ${styles.principlesCard}`}>
          <CardTitle icon={<IconSparkles size={18} stroke={1.75} />}>AI Principles</CardTitle>
          <div className={styles.principlesGrid}>
            {principles.map((p) => (
              <div key={p.num} className={styles.principleItem}>
                <p className={styles.principleNum} aria-hidden="true">{p.num}</p>
                <h3 className={styles.principleTitle}>{p.title}</h3>
                <p className={styles.principleBody}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className={`${styles.tile} ${styles.toolsTile}`}>
          <CardTitle icon={<IconSparkles size={18} stroke={1.75} />}>Tools</CardTitle>
          <div className={styles.toolPhases}>
            {toolPhases.map((group) => (
              <div key={group.phase} className={styles.toolPhase}>
                <p className={styles.toolPhaseLabel}>{group.phase}</p>
                <div className={styles.toolGrid}>
                  {group.tools.map((t) => (
                    <div
                      key={t.name}
                      className={styles.toolCard}
                      style={{ '--tool-accent': t.accent }}
                    >
                      <span
                        className={styles.toolLogo}
                        data-tool={t.name}
                        aria-hidden="true"
                      >
                        {t.logo ? (
                          <img src={t.logo} alt="" />
                        ) : (
                          <span className={styles.toolLogoFallback}>{t.name[0]}</span>
                        )}
                      </span>
                      <div className={styles.toolMeta}>
                        <p className={styles.toolName}>{t.name}</p>
                        <p className={styles.toolUse}>{t.use}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Letter */}
        <div className={`${styles.tile} ${styles.letterTile}`}>
          <CardTitle icon={<IconQuote size={18} stroke={1.75} />}>A Note From Me</CardTitle>
          <div className={styles.letterBody}>
            <p>
              AI is still a limited technology, but in the right moments it's become a
              genuinely valuable partner in my process. I've been experimenting with it
              everywhere, from Midjourney for things as personal as my Christmas cards to
              Claude and ChatGPT to help me think and communicate more clearly. I'm dyslexic,
              and having a tool that helps me write with confidence has been quietly
              life-changing.
            </p>
            <p>Here are a few ways I actually use it:</p>
            <ul className={styles.letterList}>
              <li>Generating multiple UI variations in the time it used to take me to design one</li>
              <li>Building out a design system from scratch for short projects</li>
              <li>Pressure-testing an idea early, before I've invested too much in the wrong direction</li>
              <li>Bridging the gap with engineers by handing off detailed prototypes instead of static specs</li>
              <li>Writing and communicating more clearly: briefs, specs, synthesis docs, all of it</li>
            </ul>
            <p>
              That said, getting my cursor into Figma is still almost always the best way to
              solve a design problem. The tools will continue to change but the reason I design
              won't.
            </p>
          </div>
          <p className={styles.letterSignoff}>
            With love,
            <span className={styles.letterName}>Mace</span>
          </p>
        </div>

      </section>
    </div>
  );
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
