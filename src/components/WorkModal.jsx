import { useState, useEffect } from 'react';
import AccioDetail from './AccioDetail';
import FlexomicsDetail from './FlexomicsDetail';
import styles from './WorkModal.module.css';

const projects = [
  {
    id: 'flexomics',
    name: 'Flexomics',
    role: 'Lead Product Designer',
    tag: 'Life Science',
    badge: '0→1',
    year: '2021 — 2023',
    metric: '12 weeks',
    tags: ['Life Science', 'Research Platform', 'B2B SaaS'],
    thumb: '/flexomics-ui.png',
    hoverBg: '/flexhoverbg.svg',
    logo: '/logos/flex_logo.png',
    logoBg: '#0075A5',
    detail: {
      headline: 'From Three Fragmented Tools to One Research Platform',
      subtitle: '',
      year: '12 weeks',
      client: 'Flexomics',
      platform: 'Web Application',
      disciplines: ['End-to-end Product Design', 'Platform Architecture', 'Data Interaction Models'],
      hook: 'When you run single-cell experiments, insights are quietly fragmented across imaging tools, sequencing software, and analysis programs. Sometimes representing months of scientific work that can\'t be interpreted without hours of manual reconstruction.\n\nFLXplorer gives researchers one place to see the full experimental picture, so they can answer: "What did we find, and what does it mean?"',
      overview: 'Flexomics had built breakthrough technology capable of analyzing millions of individual cells in a single experiment. But when researchers finished an experiment, the real struggle began. Three separate tools. Hours of manual work. Piecing together results that should have been connected from the start. There was no integrated solution for this anywhere — not at Flexomics, not in the market.',
      challenge: 'The real problem wasn\'t the amount of data. It was where it lived. Researchers were constantly switching between tools while trying to hold the entire mental model in their heads. That led to one guiding principle: Complexity belongs in the system, not in the researcher\'s workflow.',
      role: 'I was the lead product designer on a five-person team. I owned the platform end to end — from the first architecture decision to the final prototype.',
      approach: 'The platform was built around two workspaces — one for visual exploration of cell imagery, one for examining the genetic data behind what was observed. Both operated on the same underlying dataset. The most important design decision was making sure they never felt like two separate tools. When a scientist identified something in imaging, it carried over into sequencing automatically.',
      hardestCut: 'Midway through development, researchers wanted multi-experiment comparison. Building it risked breaking performance under real dataset sizes. I pushed for a fast, stable, focused platform over a feature-complete one that couldn\'t handle the data. Multi-experiment comparison shipped in the next iteration.',
      impact: 'A Flexomics team selected one cell in the imaging view and watched its genetic data appear instantly — no switching tools, no manual lookup. Then clicked a single data point in sequencing and watched the exact corresponding cell illuminate in the image. Something that previously required hours across three systems happened in two clicks.',
      outcomes: [
        'Replaced three disconnected internal tools with one unified platform',
        'Became the primary environment for Flexomics scientists',
        'Repositioned the company from a hardware provider to an end-to-end research platform',
        'Anchored every customer conversation, collaborator demo, and internal research review',
      ],
      reflection: 'Complex products succeed when the product absorbs internal complexity instead of exposing it. Designing FLXplorer wasn\'t just about screens. It was about deciding where complexity should live — and making sure it never landed on the researcher.',
    },
  },
  {
    id: 'accio3d',
    name: 'Accio3D',
    role: 'Lead Product Designer',
    tag: 'AI/Procurement',
    badge: 'AI-Native',
    year: '2023 — Present',
    metric: 'Ongoing',
    tags: ['Spatial Computing', '3D/AR', 'Enterprise'],
    thumb: '/accio-hero.svg',
    hoverBg: '/a3hoverbg.svg',
    logo: '/logos/accio_logo.png',
    logoBg: '#7A0A68',
    impact: 'Closed a seed round with the POC, then shipped a 50-screen MVP in 13 weeks.',
    detail: {
      headline: 'An AI-Powered Procurement Platform from POC to MVP',
      subtitle: '',
      year: '2023 — Present',
      client: 'Accio3D',
      platform: 'Web Application',
      disciplines: ['3D/Spatial UX', 'Enterprise Workflows', 'Collaboration Tools', 'AI-Assisted Search'],
      overview: 'Accio3D is a 3D asset management platform that helps product, marketing, and engineering teams organize, preview, and collaborate on spatial content — from CAD models to AR-ready assets.',
      challenge: 'Teams managing 3D assets were scattered across file systems, Slack threads, and version-confused folders. Non-technical stakeholders couldn\'t preview or provide feedback on 3D content without specialized software.',
      approach: 'I led design for the core platform experience — a web-based 3D asset library with in-browser preview, annotation, and version control. I designed an AI-powered tagging and search system that let teams find assets by description rather than filename.',
      outcomes: [
        'Reduced asset retrieval time from 15+ minutes to under 30 seconds',
        'Enabled non-technical stakeholders to review 3D assets independently',
        'Shipped AI-powered search with 92% tag accuracy on first release',
        'Adopted by 3 enterprise clients during beta',
      ],
    },
  },
  {
    id: 'blue-owl',
    name: 'Blue Owl',
    role: 'Product Designer',
    tag: 'Fintech',
    badge: 'End-to-End',
    year: '2019 — 2021',
    metric: '2 years',
    tags: ['Health Tech', 'Digital Therapeutics', 'B2C'],
    thumb: '/blueowl-funds.svg',
    hoverBg: '/bohoverbg.svg',
    logo: '/logos/blueowl_logo.png',
    logoBg: '#00244F',
    impact: null,
    cta: 'Coming Soon',
    disabled: true,
    detail: {
      headline: 'Building A Single Source of Truth for Blue Owl\'s Investment Team',
      subtitle: '',
      year: '2019 — 2021',
      client: 'Blue Owl Health',
      platform: 'iOS, Android, Web',
      disciplines: ['Patient Experience', 'Clinical Workflows', 'Responsive Design', 'Accessibility'],
      overview: 'Blue Owl is a digital therapeutics platform that synthesizes behavioral health data into actionable, personalized guidance for both patients and their care teams.',
      challenge: 'Patients were overwhelmed by health data without context. Clinicians needed a tool that could communicate treatment progress without adding to their documentation burden. Engagement with existing tools was critically low.',
      approach: 'I owned the product design workstream from concept through launch. This included creating patient journey maps across 6 treatment pathways, designing an adaptive dashboard for both patients and providers, and developing a notification framework that balanced engagement with clinical appropriateness — ensuring no alert fatigue while keeping patients on track.',
      outcomes: [
        '3x improvement in patient engagement with treatment plans',
        'Reduced clinician review time per patient by 25%',
        'Launched to pilot cohort of 500 patients on schedule',
        'Achieved WCAG AA accessibility compliance across all surfaces',
      ],
    },
  },
];

function BentoCard({ project, index, onClick }) {
  const d = project.detail;
  const impact =
    project.impact === null
      ? null
      : project.impact ?? d.outcomes?.[0];
  const ctaText = project.cta ?? 'View Case Study';
  const showArrow = !project.cta;
  return (
    <button
      className={`${styles.bentoCard} ${project.disabled ? styles.bentoCardDisabled : ''}`}
      onClick={project.disabled ? undefined : onClick}
      disabled={project.disabled}
      aria-disabled={project.disabled || undefined}
      style={{ '--card-delay': `${index * 80}ms` }}
    >
      <div className={styles.bentoLeft}>
        <div className={styles.bentoTop}>
          {/* Identity row: brand pill + meta tags */}
          <div className={styles.bentoMeta}>
            <div
              className={styles.bentoLogoPill}
              style={project.logoBg ? { background: project.logoBg } : undefined}
            >
              {project.logo ? (
                <img src={project.logo} alt="" className={styles.bentoLogoImg} aria-hidden="true" />
              ) : (
                <span className={styles.bentoLogoInitial} aria-hidden="true">{project.name[0]}</span>
              )}
              <span className={styles.bentoCompany}>{project.name}</span>
            </div>
            <div className={styles.bentoBadges}>
              {project.badge && <span className={styles.bentoCategory}>{project.badge}</span>}
              <span className={styles.bentoCategory}>{project.tag}</span>
            </div>
          </div>

          {/* Story: headline + subtitle */}
          <div className={styles.bentoStory}>
            <h3 className={styles.bentoHeadline}>{d.headline}</h3>
            {d.subtitle && <p className={styles.bentoSubtitle}>{d.subtitle}</p>}
          </div>
        </div>

        <div className={styles.bentoBottom}>
          {/* Impact: highlighted proof point */}
          {impact && (
            <div
              className={styles.bentoImpact}
              style={project.logoBg ? { '--impact-accent': project.logoBg } : undefined}
            >
              <span className={styles.bentoImpactLabel}>Impact</span>
              <p className={styles.bentoImpactText}>{impact}</p>
            </div>
          )}

          <span className={styles.bentoCta}>
            {ctaText}
            {showArrow && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </span>
        </div>
      </div>

      <div className={styles.bentoRight}>
        {project.thumb ? (
          <img src={project.thumb} alt={project.name} className={styles.bentoImg} />
        ) : (
          <div className={styles.bentoPlaceholder}>
            <span>{project.name[0]}</span>
          </div>
        )}
      </div>
    </button>
  );
}

function ProjectDetail({ project }) {
  const d = project.detail;

  return (
    <div className={styles.detail} key={project.id}>
      {/* Header */}
      <div className={styles.detailHeader}>
        <span className={styles.detailTag}>{project.tag}</span>
        <h1 className={styles.detailHeadline}>{d.headline}</h1>
        <p className={styles.detailSubtitle}>{d.subtitle}</p>
      </div>

      {/* Meta */}
      <div className={styles.detailMeta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Timeline</span>
          <span className={styles.metaValue}>{d.year}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Company</span>
          <span className={styles.metaValue}>{d.client}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Platform</span>
          <span className={styles.metaValue}>{d.platform}</span>
        </div>
      </div>

      <div className={styles.disciplines}>
        {d.disciplines.map((tag) => (
          <span key={tag} className={styles.disciplineTag}>{tag}</span>
        ))}
      </div>

      <hr className={styles.divider} />

      {/* Sections */}
      <div className={styles.detailSections}>
        {d.hook && (
          <div className={styles.detailSection}>
            <h2 className={styles.sectionTitle}>The Hook</h2>
            {d.hook.split('\n\n').map((p, i) => (
              <p key={i} className={styles.sectionText}>{p}</p>
            ))}
          </div>
        )}

        <div className={styles.detailSection}>
          <h2 className={styles.sectionTitle}>{d.hook ? 'What We Were Up Against' : 'Overview'}</h2>
          <p className={styles.sectionText}>{d.overview}</p>
        </div>

        <div className={styles.detailSection}>
          <h2 className={styles.sectionTitle}>{d.hook ? 'Where the Complexity Was Hiding' : 'Challenge'}</h2>
          <p className={styles.sectionText}>{d.challenge}</p>
        </div>

        {d.role && (
          <div className={styles.detailSection}>
            <h2 className={styles.sectionTitle}>My Role</h2>
            <p className={styles.sectionText}>{d.role}</p>
          </div>
        )}

        <div className={styles.detailSection}>
          <h2 className={styles.sectionTitle}>{d.hook ? 'How It Came Together' : 'Approach'}</h2>
          <p className={styles.sectionText}>{d.approach}</p>
        </div>

        {d.hardestCut && (
          <div className={styles.detailSection}>
            <h2 className={styles.sectionTitle}>The Hardest Cut</h2>
            <p className={styles.sectionText}>{d.hardestCut}</p>
          </div>
        )}

        {d.impact && (
          <div className={styles.detailSection}>
            <h2 className={styles.sectionTitle}>The Moment</h2>
            <p className={`${styles.sectionText} ${styles.impactText}`}>{d.impact}</p>
          </div>
        )}

        <div className={styles.detailSection}>
          <h2 className={styles.sectionTitle}>Outcomes</h2>
          <ul className={styles.outcomeList}>
            {d.outcomes.map((item) => (
              <li key={item} className={styles.outcomeItem}>{item}</li>
            ))}
          </ul>
        </div>

        {d.reflection && (
          <div className={styles.detailSection}>
            <h2 className={styles.sectionTitle}>Reflection</h2>
            <p className={`${styles.sectionText} ${styles.reflectionText}`}>{d.reflection}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkModal({ onProjectOpenChange, initialProjectId }) {
  const [activeId, setActiveId] = useState(initialProjectId ?? null);
  const activeProject = projects.find((p) => p.id === activeId);

  useEffect(() => {
    onProjectOpenChange?.(!!activeId);
    // Always scroll to top when a project detail opens or returns to list
    const scroller = document.querySelector('.page-content');
    if (scroller) scroller.scrollTo(0, 0);
    else window.scrollTo(0, 0);
  }, [activeId, onProjectOpenChange]);

  useEffect(() => {
    const onClose = () => setActiveId(null);
    window.addEventListener('closeProject', onClose);
    return () => window.removeEventListener('closeProject', onClose);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && activeId) {
        e.stopPropagation();
        setActiveId(null);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [activeId]);

  if (activeProject) {
    const isWide = activeProject.id === 'accio3d' || activeProject.id === 'flexomics';
    return (
      <>
        <div className={styles.detailScrim} onClick={() => setActiveId(null)} />
        <section
          className={`${styles.workDetail} ${styles.workDetailSheet} ${isWide ? styles.workDetailWide : ''}`}
          aria-label="Project detail"
        >
          <div className={`${styles.detailWrap} ${isWide ? styles.detailWrapFull : ''}`}>
            {activeProject.id === 'accio3d' ? (
              <AccioDetail />
            ) : activeProject.id === 'flexomics' ? (
              <FlexomicsDetail />
            ) : (
              <ProjectDetail project={activeProject} />
            )}
          </div>
        </section>
      </>
    );
  }

  return (
    <section className={styles.workList} aria-label="Work">
      <div className={styles.workListInner}>
        <header className={styles.workListHeader}>
          <h1 className={styles.workListEyebrow}>Selected Work</h1>
        </header>

        <div className={styles.bentoGrid}>
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={styles.bentoProject}
              style={project.hoverBg ? { '--project-bg': `url(${project.hoverBg})` } : undefined}
            >
              <BentoCard
                project={project}
                index={i}
                onClick={() => setActiveId(project.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
