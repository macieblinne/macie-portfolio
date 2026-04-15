import { useState } from 'react';
import styles from './Work.module.css';

const projects = [
  {
    id: 'flexomics',
    name: 'Flexomics',
    role: 'Lead Product Designer',
    tag: 'Life Science',
    tagColor: 'aspen',
    // REPLACE: Add your actual project hero image
    image: null,
    detail: {
      headline: 'Designing Flexomics\' First Integrated Research Platform',
      subtitle: 'Giving scientists one place to unify imaging and sequencing data for the first time',
      year: '12 weeks',
      client: 'Flexomics',
      platform: 'Web Application',
      disciplines: ['End-to-end Product Design', 'Platform Architecture', 'Data Interaction Models'],
      hook: 'When you run single-cell experiments, insights are quietly fragmented across imaging tools, sequencing software, and analysis programs. Sometimes representing months of scientific work that can\'t be interpreted without hours of manual reconstruction.\n\nFLXplorer gives researchers one place to see the full experimental picture, so they can answer: "What did we find, and what does it mean?"',
      overview:
        'Flexomics had built breakthrough technology capable of analyzing millions of individual cells in a single experiment. But when researchers finished an experiment, the real struggle began. Three separate tools. Hours of manual work. Piecing together results that should have been connected from the start. There was no integrated solution for this anywhere — not at Flexomics, not in the market.',
      challenge:
        'The real problem wasn\'t the amount of data. It was where it lived. Researchers were constantly switching between tools while trying to hold the entire mental model in their heads. That led to one guiding principle: Complexity belongs in the system, not in the researcher\'s workflow.',
      role:
        'I was the lead product designer on a five-person team. I owned the platform end to end — from the first architecture decision to the final prototype.',
      approach:
        'The platform was built around two workspaces — one for visual exploration of cell imagery, one for examining the genetic data behind what was observed. Both operated on the same underlying dataset. The most important design decision was making sure they never felt like two separate tools. When a scientist identified something in imaging, it carried over into sequencing automatically. The data stayed connected so the researcher didn\'t have to be the one holding it together.',
      hardestCut:
        'Midway through development, researchers wanted multi-experiment comparison. Building it risked breaking performance under real dataset sizes. I pushed for a fast, stable, focused platform over a feature-complete one that couldn\'t handle the data. Multi-experiment comparison shipped in the next iteration.',
      impact:
        'A Flexomics team selected one cell in the imaging view and watched its genetic data appear instantly — no switching tools, no manual lookup. Then clicked a single data point in sequencing and watched the exact corresponding cell illuminate in the image. Something that previously required hours across three systems happened in two clicks. It was the first time those connections had ever existed in one place.',
      outcomes: [
        'Replaced three disconnected internal tools with one unified platform',
        'Became the primary environment for Flexomics scientists',
        'Repositioned the company from a hardware provider to an end-to-end research platform',
        'Anchored every customer conversation, collaborator demo, and internal research review',
      ],
      reflection:
        'Complex products succeed when the product absorbs internal complexity instead of exposing it. Designing FLXplorer wasn\'t just about screens. It was about deciding where complexity should live — and making sure it never landed on the researcher. For early-stage products, that architectural thinking is often the difference between breakthrough technology becoming a usable product or remaining an experimental tool.',
    },
  },
  {
    id: 'blue-owl',
    name: 'Blue Owl',
    role: 'Product Designer',
    tag: 'Health & Wellness',
    tagColor: 'twilight',
    // REPLACE: Add your actual project hero image
    image: null,
    detail: {
      headline: 'Blue Owl',
      subtitle: 'A patient wellness platform bridging clinical rigor and everyday usability',
      year: '2019 — 2021',
      client: 'Blue Owl Health',
      platform: 'iOS, Android, Web',
      disciplines: ['Patient Experience', 'Clinical Workflows', 'Responsive Design', 'Accessibility'],
      overview:
        'Blue Owl is a digital therapeutics platform that synthesizes behavioral health data into actionable, personalized guidance for both patients and their care teams.',
      challenge:
        'Patients were overwhelmed by health data without context. Clinicians needed a tool that could communicate treatment progress without adding to their documentation burden. Engagement with existing tools was critically low.',
      approach:
        'I owned the product design workstream from concept through launch. This included creating patient journey maps across 6 treatment pathways, designing an adaptive dashboard for both patients and providers, and developing a notification framework that balanced engagement with clinical appropriateness — ensuring no alert fatigue while keeping patients on track.',
      outcomes: [
        '3x improvement in patient engagement with treatment plans',
        'Reduced clinician review time per patient by 25%',
        'Launched to pilot cohort of 500 patients on schedule',
        'Achieved WCAG AA accessibility compliance across all surfaces',
      ],
    },
  },
  {
    id: 'accio3d',
    name: 'Accio3D',
    role: 'Lead Product Designer',
    tag: 'Spatial Computing',
    tagColor: 'timber',
    // REPLACE: Add your actual project hero image
    image: null,
    detail: {
      headline: 'Accio3D',
      subtitle: 'Making 3D asset management intuitive for non-technical teams',
      year: '2023 — Present',
      client: 'Accio3D',
      platform: 'Web Application',
      disciplines: ['3D/Spatial UX', 'Enterprise Workflows', 'Collaboration Tools', 'AI-Assisted Search'],
      overview:
        'Accio3D is a 3D asset management platform that helps product, marketing, and engineering teams organize, preview, and collaborate on spatial content — from CAD models to AR-ready assets.',
      challenge:
        'Teams managing 3D assets were scattered across file systems, Slack threads, and version-confused folders. Non-technical stakeholders couldn\'t preview or provide feedback on 3D content without specialized software, creating bottlenecks between design and production.',
      approach:
        'I led design for the core platform experience — a web-based 3D asset library with in-browser preview, annotation, and version control. I designed an AI-powered tagging and search system that let teams find assets by description rather than filename, and built a review workflow that let stakeholders comment directly on 3D models.',
      outcomes: [
        'Reduced asset retrieval time from 15+ minutes to under 30 seconds',
        'Enabled non-technical stakeholders to review 3D assets independently',
        'Shipped AI-powered search with 92% tag accuracy on first release',
        'Adopted by 3 enterprise clients during beta',
      ],
    },
  },
];

function ProjectCard({ project, isActive, onClick }) {
  return (
    <button
      className={`${styles.projectCard} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`View ${project.name} project`}
    >
      {/* Hero image area */}
      <div className={styles.cardImage}>
        {project.image ? (
          <img src={project.image} alt={project.name} className={styles.cardImg} />
        ) : (
          <div className={`${styles.cardPlaceholder} ${styles[project.tagColor]}`}>
            <span className={styles.cardPlaceholderName}>{project.name}</span>
          </div>
        )}
      </div>

      {/* Card info */}
      <div className={styles.cardInfo}>
        <div className={styles.cardMeta}>
          <h3 className={styles.cardName}>{project.name}</h3>
          <span className={`${styles.cardTag} ${styles[project.tagColor]}`}>{project.tag}</span>
        </div>
        <span className={styles.cardRole}>{project.role}</span>
      </div>

      {/* More info pill */}
      <div className={styles.cardAction}>
        <span className={styles.cardActionText}>More info</span>
        <span className={styles.cardActionIcon}>+</span>
      </div>
    </button>
  );
}

function ProjectDetail({ project }) {
  const d = project.detail;

  return (
    <div className={styles.detail} key={project.id}>
      <div className={styles.detailHeader}>
        <h1 className={styles.detailHeadline}>{d.headline}</h1>
        <p className={styles.detailSubtitle}>{d.subtitle}</p>
      </div>

      {/* Meta row */}
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

      {/* Disciplines */}
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
          <h2 className={styles.sectionTitle}>What We Were Up Against</h2>
          <p className={styles.sectionText}>{d.overview}</p>
        </div>

        <div className={styles.detailSection}>
          <h2 className={styles.sectionTitle}>Where the Complexity Was Hiding</h2>
          <p className={styles.sectionText}>{d.challenge}</p>
        </div>

        {d.role && (
          <div className={styles.detailSection}>
            <h2 className={styles.sectionTitle}>My Role</h2>
            <p className={styles.sectionText}>{d.role}</p>
          </div>
        )}

        <div className={styles.detailSection}>
          <h2 className={styles.sectionTitle}>How It Came Together</h2>
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
            <h2 className={styles.sectionTitle}>Two Clicks That Changed Everything</h2>
            <p className={`${styles.sectionText} ${styles.impactText}`}>{d.impact}</p>
          </div>
        )}

        <div className={styles.detailSection}>
          <h2 className={styles.sectionTitle}>What Actually Changed</h2>
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

export default function Work() {
  const [activeId, setActiveId] = useState(projects[0].id);
  const activeProject = projects.find((p) => p.id === activeId);

  return (
    <section className={styles.work} aria-label="Work">
      {/* Left: Project Cards */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarInner}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isActive={project.id === activeId}
              onClick={() => setActiveId(project.id)}
            />
          ))}
        </div>
      </div>

      {/* Right: Detail Panel */}
      <div className={styles.panel}>
        <div className={styles.panelInner}>
          <ProjectDetail project={activeProject} />
        </div>
      </div>
    </section>
  );
}
