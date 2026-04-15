import { useEffect, useRef, useState } from 'react';
import styles from './DesignSystem.module.css';

const colors = {
  'Background': [
    { name: 'bg', var: '--color-bg', label: 'Page Background' },
    { name: 'bg-alt', var: '--color-bg-alt', label: 'Alt Background' },
    { name: 'bg-card', var: '--color-bg-card', label: 'Card' },
    { name: 'bg-card-hover', var: '--color-bg-card-hover', label: 'Card Hover' },
    { name: 'bg-elevated', var: '--color-bg-elevated', label: 'Elevated' },
  ],
  'Text': [
    { name: 'text-primary', var: '--color-text-primary', label: 'Primary' },
    { name: 'text-secondary', var: '--color-text-secondary', label: 'Secondary' },
    { name: 'text-tertiary', var: '--color-text-tertiary', label: 'Tertiary' },
    { name: 'text-inverse', var: '--color-text-inverse', label: 'Inverse' },
  ],
  'Accent': [
    { name: 'accent', var: '--color-accent', label: 'Gold' },
    { name: 'accent-hover', var: '--color-accent-hover', label: 'Gold Hover' },
    { name: 'accent-soft', var: '--color-accent-soft', label: 'Gold Soft' },
    { name: 'accent-clay', var: '--color-accent-clay', label: 'Evergreen' },
    { name: 'accent-plum', var: '--color-accent-plum', label: 'Forest Mid' },
    { name: 'accent-berry', var: '--color-accent-berry', label: 'Forest Dark' },
    { name: 'accent-stone', var: '--color-accent-stone', label: 'Sage' },
  ],
  'Surface & Functional': [
    { name: 'surface', var: '--color-surface', label: 'Surface' },
    { name: 'surface-hover', var: '--color-surface-hover', label: 'Surface Hover' },
    { name: 'success', var: '--color-success', label: 'Success' },
    { name: 'tag-bg', var: '--color-tag-bg', label: 'Tag BG' },
    { name: 'tag-text', var: '--color-tag-text', label: 'Tag Text' },
  ],
};

const typeScale = [
  { name: 'text-5xl', size: '4rem', weight: '700', sample: 'Macie Linne' },
  { name: 'text-4xl', size: '3.25rem', weight: '700', sample: 'Heading XL' },
  { name: 'text-3xl', size: '2.5rem', weight: '700', sample: 'Heading Large' },
  { name: 'text-2xl', size: '2rem', weight: '700', sample: 'Heading Medium' },
  { name: 'text-xl', size: '1.5rem', weight: '600', sample: 'Heading Small' },
  { name: 'text-lg', size: '1.25rem', weight: '500', sample: 'Body Large' },
  { name: 'text-base', size: '1rem', weight: '400', sample: 'Body text used for paragraphs and descriptions across the site.' },
  { name: 'text-sm', size: '0.875rem', weight: '400', sample: 'Small text for captions and metadata' },
  { name: 'text-xs', size: '0.75rem', weight: '500', sample: 'LABELS AND BADGES' },
];

const fonts = [
  { family: 'Geist', var: '--font-sans', usage: 'Primary sans — headings, body, UI' },
  { family: 'Geist Mono', var: '--font-mono', usage: 'Mono — dates, role labels, numerical values' },
  { family: 'Space Mono', var: '--font-serif', usage: 'Serif accent — case study headlines (Work page)' },
];

const spacingScale = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

const radiusScale = [
  { name: 'sm', val: '8px' },
  { name: 'md', val: '12px' },
  { name: 'lg', val: '18px' },
  { name: 'xl', val: '24px' },
  { name: '2xl', val: '32px' },
  { name: 'card', val: '28px' },
  { name: 'full', val: '9999px' },
];

const shadows = [
  { name: 'sm', var: '--shadow-sm' },
  { name: 'md', var: '--shadow-md' },
  { name: 'lg', var: '--shadow-lg' },
  { name: 'xl', var: '--shadow-xl' },
  { name: 'glow', var: '--shadow-glow' },
];

function rgbToHex(rgb) {
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return rgb;
  const [r, g, b] = match.map(Number);
  const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function ColorSwatch({ color }) {
  const swatchRef = useRef(null);
  const [hex, setHex] = useState('');

  useEffect(() => {
    if (!swatchRef.current) return;
    const computed = getComputedStyle(swatchRef.current).backgroundColor;
    setHex(rgbToHex(computed));
  }, [color.var]);

  return (
    <div className={styles.swatch}>
      <div
        ref={swatchRef}
        className={styles.swatchColor}
        style={{ background: `var(${color.var})` }}
      />
      <div className={styles.swatchInfo}>
        <span className={styles.swatchName}>{color.label}</span>
        <code className={styles.swatchVar}>{color.var}</code>
        {hex && <code className={styles.swatchHex}>{hex}</code>}
      </div>
    </div>
  );
}

export default function DesignSystem() {
  return (
    <div className={styles.ds}>
      <div className={styles.inner}>

        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Design System</h1>
          <p className={styles.pageDesc}>Tokens, typography, and components used across the portfolio.</p>
        </header>

        {/* ========== COLORS ========== */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Color Palette</h2>
          {Object.entries(colors).map(([group, swatches]) => (
            <div key={group} className={styles.colorGroup}>
              <h3 className={styles.groupLabel}>{group}</h3>
              <div className={styles.swatchGrid}>
                {swatches.map((c) => <ColorSwatch key={c.name} color={c} />)}
              </div>
            </div>
          ))}
        </section>

        {/* ========== TYPOGRAPHY ========== */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Typography</h2>

          <div className={styles.fontFamilies}>
            {fonts.map((f) => (
              <div key={f.family} className={styles.fontCard}>
                <span className={styles.fontSample} style={{ fontFamily: `var(${f.var})` }}>
                  Aa Bb Cc 123
                </span>
                <span className={styles.fontName}>{f.family}</span>
                <span className={styles.fontUsage}>{f.usage}</span>
              </div>
            ))}
          </div>

          <h3 className={styles.groupLabel}>Type Scale</h3>
          <div className={styles.typeScale}>
            {typeScale.map((t) => (
              <div key={t.name} className={styles.typeRow}>
                <div className={styles.typeMeta}>
                  <code className={styles.typeToken}>{t.name}</code>
                  <span className={styles.typeSize}>{t.size} / {t.weight}</span>
                </div>
                <p className={styles.typeSample} style={{ fontSize: t.size, fontWeight: t.weight }}>
                  {t.sample}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========== SPACING ========== */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Spacing</h2>
          <div className={styles.spacingGrid}>
            {spacingScale.map((n) => (
              <div key={n} className={styles.spacingItem}>
                <div className={styles.spacingBar} style={{ width: `var(--space-${n})` }} />
                <code className={styles.spacingLabel}>--space-{n}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ========== RADIUS ========== */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Border Radius</h2>
          <div className={styles.radiusGrid}>
            {radiusScale.map((r) => (
              <div key={r.name} className={styles.radiusItem}>
                <div className={styles.radiusBox} style={{ borderRadius: r.val }} />
                <code className={styles.radiusLabel}>{r.name}</code>
                <span className={styles.radiusVal}>{r.val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ========== SHADOWS ========== */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Shadows</h2>
          <div className={styles.shadowGrid}>
            {shadows.map((s) => (
              <div key={s.name} className={styles.shadowItem}>
                <div className={styles.shadowBox} style={{ boxShadow: `var(${s.var})` }} />
                <code className={styles.shadowLabel}>{s.name}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ========== COMPONENTS ========== */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Components</h2>

          {/* Badges */}
          <h3 className={styles.groupLabel}>Badges</h3>
          <div className={styles.componentRow}>
            <span className={styles.badge}>Case Study</span>
            <span className={styles.badge}>Featured</span>
            <span className={styles.badge}>Experience</span>
          </div>

          {/* Buttons / CTAs */}
          <h3 className={styles.groupLabel}>CTAs</h3>
          <div className={styles.componentRow}>
            <span className={styles.ctaPrimary}>
              Read case study
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
            <span className={styles.ctaSecondary}>
              View project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </div>

          {/* Cards */}
          <h3 className={styles.groupLabel}>Cards</h3>
          <div className={styles.cardRow}>
            <div className={styles.demoCard}>
              <span className={styles.demoCardLabel}>Default</span>
              <span className={styles.demoCardBody}>White fill, rounded corners, soft shadow</span>
            </div>
            <div className={`${styles.demoCard} ${styles.demoCardHover}`}>
              <span className={styles.demoCardLabel}>Hover</span>
              <span className={styles.demoCardBody}>Warm cream fill, lifted shadow</span>
            </div>
            <div className={styles.demoCardDark}>
              <span className={styles.demoCardLabel} style={{ color: 'rgba(255,255,255,0.5)' }}>Gradient</span>
              <span className={styles.demoCardBody} style={{ color: 'rgba(255,255,255,0.9)' }}>Alpine twilight mesh gradient</span>
            </div>
          </div>

          {/* Tags */}
          <h3 className={styles.groupLabel}>Tags</h3>
          <div className={styles.componentRow}>
            <span className={styles.tag}>Life Science</span>
            <span className={styles.tag}>Health & Wellness</span>
            <span className={styles.tag}>Spatial Computing</span>
            <span className={styles.tag}>Enterprise UX</span>
          </div>

          {/* Domain Labels */}
          <h3 className={styles.groupLabel}>Domain Labels (Mono)</h3>
          <div className={styles.componentRow}>
            <span className={styles.domainLabel}>Life Science / Genomics</span>
            <span className={styles.domainLabel}>Health & Wellness</span>
            <span className={styles.domainLabel}>Spatial Computing</span>
          </div>
        </section>

      </div>
    </div>
  );
}
