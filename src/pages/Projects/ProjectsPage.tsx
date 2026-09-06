import styles from './ProjectsPage.module.scss'
import projectsImg from './assets/Projects.png'

const sections = [
  {
    id: 'resources-by-project',
    label: 'Resources by Project',
    description: 'This chart shows visualization on how many people we have assigned by project. This helps leadership to get insights of what projects we have and make projection of what is coming next in terms of resources.',
    chartSide: 'right',
  },
  {
    id: 'onshore-offshore',
    label: 'Onshore and Offshore Distribution',
    description: 'This chart shows visualization on how people are distributed between onshore and offshore locations. This helps leadership to get insights to better manage resource distribution and financials.',
    chartSide: 'left',
  },
  {
    id: 'proactive-count',
    label: 'Proactive Count of Resource by Projects (as of date)',
    description: 'This chart provides a visual representation of the number of people being onboarded within different projects, with a focus on proactive resource allocation for anticipated future demands. It offers insights into which projects are actively onboarding more personnel and supports leadership in understanding onboarding trends for strategic planning.',
    chartSide: 'right',
  },
  {
    id: 'resource-churn',
    label: 'Resource Churn By Reason (last 3 months)',
    description: 'This chart offers a visual representation of resource churn within different projects, categorized by specific reasons for resource departure. This chart serves as a valuable tool for leadership to understand the causes and patterns of resource churn.',
    chartSide: 'left',
  },
  {
    id: 'avg-fulfillment',
    label: 'Average Fulfillment Time (last 6 months)',
    description: 'This chart offers a comprehensive view of fulfillment times and lead times by projects, empowering leadership to make informed decisions regarding project management and resource allocation.',
    subLabel: 'In days',
    chartSide: 'right',
  },
  {
    id: 'monthly-onboarding',
    label: 'Monthly Onboarding of Resources (last 3 months)',
    description: 'This chart will give visualization on how resource is increasing month by month. This can help leadership to get some insights and make some projections of what is coming next in terms of resource count.',
    chartSide: 'left',
  },
  {
    id: 'monthly-offboarding',
    label: 'Monthly Offboarding of Resources (last 3 months)',
    description: 'This chart shows the resource offboarding activities happened for the past months over the different projects. Data will help leadership to know and plan accordingly based on the reduction of resource count in each projects.',
    chartSide: 'right',
  },
  {
    id: 'monthly-resource-count',
    label: 'Monthly Resource Count (last 3 months)',
    description: 'This chart shows visualization on how resource count is changing month by month. This helps leadership to get insights and make some projections of what is coming next in terms of resource count.',
    chartSide: 'left',
  },
  {
    id: 'demand-management',
    label: 'Demand Management 30-60-90 day Forecast',
    description: 'This chart will give visualization on how demand is distributed between 30-60-90 day forecast. This can help leadership to get some insights and make some projections of what is coming next in terms of demand.',
    chartSide: 'right',
  },
]

const HIGHLIGHTS = [
  {
    id: 'allocation',
    title: 'Project Allocation',
    description: 'Structured visibility into how resources are distributed across active projects and portfolios.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 3v18"/>
      </svg>
    ),
    gradient: 'teal',
  },
  {
    id: 'distribution',
    title: 'Onshore & Offshore',
    description: 'Clear breakdown of resource distribution between onshore and offshore locations for better financial planning.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    gradient: 'lavender',
  },
  {
    id: 'movements',
    title: 'Resource Movements',
    description: 'Track onboarding, offboarding, and churn across projects to understand workforce dynamics over time.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M17 1l4 4-4 4"/>
        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <path d="M7 23l-4-4 4-4"/>
        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
    gradient: 'sky',
  },
  {
    id: 'fulfillment',
    title: 'Fulfillment Performance',
    description: 'Monitor average fulfillment and lead times per project to drive more efficient resourcing decisions.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    gradient: 'mint',
  },
  {
    id: 'trends',
    title: 'Workforce Trends',
    description: 'Month-by-month resource count trends give leadership the context needed for strategic workforce planning.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    gradient: 'orange',
  },
  {
    id: 'demand',
    title: 'Demand Forecasts',
    description: 'Forward-looking 30-60-90 day demand forecasts support proactive headcount planning and pipeline management.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    gradient: 'rose',
  },
]

const LAST_UPDATE = 'Last update 01/20/2026'

export default function ProjectsPage() {
  return (
    <div className={styles.page} id="top">

      {/* ── Hero — image with overlay, badge, heading, sub ────────────── */}
      <div className={styles.hero} role="region" aria-label="Projects">
        <img src={projectsImg} alt="Projects" className={styles.heroImg} />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.heroHeading}>Projects</h1>
          <p className={styles.heroSub}>
            A centralized hub for project and resource insights, enabling structured visibility
            into project allocation, onshore and offshore distribution, resource movements,
            fulfillment performance, workforce trends, and forward-looking demand forecasts.
          </p>
        </div>
      </div>

      {/* ── Welcome / intro section ───────────────────────────────────── */}
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <div className={styles.introLabel}>Resource Intelligence</div>
          <h2 className={styles.introHeading}>Project &amp; Resource Visibility</h2>
          <p className={styles.introSub}>
            Empowering leadership with the data-driven insights needed to manage resources,
            optimise project allocations, and plan ahead with confidence.
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>9</span>
              <span className={styles.statLabel}>Chart Views</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>30–90</span>
              <span className={styles.statLabel}>Day Forecast</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>100+</span>
              <span className={styles.statLabel}>Active Resources</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Highlights — icon card grid ───────────────────────────────── */}
      <section className={styles.highlights} aria-labelledby="highlights-heading">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLabel}>What's Inside</div>
          <h2 id="highlights-heading" className={styles.sectionTitle}>Dashboard Highlights</h2>
          <p className={styles.sectionBody}>
            Each view is designed to surface a specific lens on project and workforce data,
            giving leadership clear, actionable intelligence at a glance.
          </p>
        </div>
        <div className={styles.highlightCards}>
          {HIGHLIGHTS.map((h) => (
            <div key={h.id} className={styles.highlightCard}>
              <div className={`${styles.highlightIcon} ${styles[h.gradient]}`}>{h.icon}</div>
              <h3 className={styles.highlightTitle}>{h.title}</h3>
              <p className={styles.highlightBody}>{h.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sticky pill nav ───────────────────────────────────────────── */}
      <nav className={styles.navBar} aria-label="Jump to section">
        {sections.map(s => (
          <button
            key={s.id}
            className={styles.navLink}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* ── Chart sections ────────────────────────────────────────────── */}
      <div className={styles.sections}>
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className={`${styles.section} ${i % 2 !== 0 ? styles.sectionAlt : ''}`}
          >
            <div className={styles.sectionsInner}>
              <div className={`${styles.row} ${s.chartSide === 'left' ? styles.rowReverse : ''}`}>

                {/* Text side */}
                <div className={styles.textSide}>
                  <div className={styles.sectionLabelPill}>Chart Insight</div>
                  <h2 className={styles.sectionTitle}>{s.label}</h2>
                  {'subLabel' in s && s.subLabel && (
                    <p className={styles.subLabel}>{s.subLabel}</p>
                  )}
                  <p className={styles.sectionDesc}>{s.description}</p>
                  <p className={styles.lastUpdate}>{LAST_UPDATE}</p>
                  <button
                    className={styles.backToTop}
                    onClick={() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    ↑ Back to top
                  </button>
                </div>

                {/* Chart placeholder */}
                <div className={styles.chartSide}>
                  <div className={styles.chartPlaceholder}>Chart</div>
                </div>

              </div>
            </div>
          </section>
        ))}
      </div>

    </div>
  )
}
