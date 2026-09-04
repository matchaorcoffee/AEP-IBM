import styles from './SharedServicesPage.module.scss'
import sharedServicesHero from './assets/SharedServices.png'
import ibmImg from './assets/IBM.jpg'

const videos = import.meta.glob('./assets/*.{mp4,webm,mov}', { eager: true, query: '?url', import: 'default' })

const LAST_UPDATE = 'Last update 03/20/2026'

const sections = [
  {
    id: 'geographic-distribution',
    label: 'Geographic Distribution',
    description: 'This chart shows visualization on how many people we have assigned by country. This helps leadership to get insights and make some projection of what is coming next in terms of resources.',
    subLabel: null,
    chartSide: 'right',
  },
  {
    id: 'core-flex-distribution',
    label: 'Core-Flex Distribution',
    description: 'This chart shows visualization on how people are distributed between Core and Flex. This helps leadership to get insights and make some projections of what is coming next in terms of core and flex resources.',
    subLabel: null,
    chartSide: 'left',
  },
  {
    id: 'resource-churn',
    label: 'Resource Churn (last 3 months)',
    description: 'This chart shows visualization on the progress for people churn in the past 3 months. This helps leadership to get insights of what portfolios we have more churn and make some projection of what is coming next.',
    subLabel: null,
    chartSide: 'right',
  },
  {
    id: 'monthly-onboarding',
    label: 'Monthly Onboarding of Resources (last 3 months)',
    description: 'This chart shows visualization on how resource is increasing month by month. This helps leadership to get insights and make some projections of what is coming next in terms of resource count.',
    subLabel: null,
    chartSide: 'left',
  },
  {
    id: 'monthly-offboarding',
    label: 'Monthly Offboarding of Resources (last 3 months)',
    description: 'This chart shows the resource offboarding activities happened for the past three months. Data will help leadership to know and plan accordingly based on the reduction of resource count per month.',
    subLabel: null,
    chartSide: 'right',
  },
  {
    id: 'demand-management',
    label: 'Demand Management',
    description: 'This chart shows visualization on how demand is distributed between 30-60-90 day forecast. This helps leadership to get insights and make some projections of what is coming next in terms of demand.',
    subLabel: null,
    chartSide: 'left',
  },
  {
    id: 'highlights',
    label: 'Highlights',
    description: null,
    subLabel: null,
    chartSide: null,
  },
]

const NICHE_SKILLS = [
  'PeopleSoft Finance',
  'Workday',
]

export default function SharedServicesPage() {
  const videoFiles = Object.values(videos) as string[]

  return (
    <div className={styles.page} id="top">

      {/* Hero image */}
      <div className={styles.hero}>
        <img src={sharedServicesHero} alt="Shared Services" className={styles.heroImg} />
      </div>

      {/* Centered title */}
      <div className={styles.titleBlock}>
        <h1 className={styles.pageTitle}>Shared Services Information</h1>
      </div>

      {/* Nav links */}
      <nav className={styles.navBar}>
        {sections.map(s => (
          <button key={s.id} className={styles.navLink} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}>{s.label}</button>
        ))}
      </nav>

      {/* Sections */}
      <div className={styles.sections}>
        {sections.map(s => s.id === 'highlights' ? (

          /* ── Highlights section ── */
          <section key={s.id} id={s.id} className={styles.section}>
            <div className={styles.highlightsHeader}>
              <h2 className={styles.highlightsTitle}>Highlights</h2>
              <button className={styles.backToTop} onClick={() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })}>Back to top</button>
            </div>

            <div className={styles.highlightsGrid}>

              {/* Left — dark red: Main challenges + IBM image */}
              <div className={styles.hlCardRed}>
                <div className={styles.hlCardContent}>
                  <h3 className={styles.hlCardTitle}>Main challenges</h3>
                  <p className={styles.hlCardText}>
                    Limited resource availability from specific locations and securing Workday resources and specialized skills;
                  </p>
                </div>
                <img src={ibmImg} alt="IBM" className={styles.hlCardImg} />
              </div>

              {/* Center — light grey: Niche Skills */}
              <div className={styles.hlCardGrey}>
                <h3 className={styles.hlCardTitleDark}>Niche Skills</h3>
                <ul className={styles.nicheList}>
                  {NICHE_SKILLS.map((skill, i) => (
                    <li key={i} className={styles.nicheItem}>{skill}</li>
                  ))}
                </ul>
              </div>

              {/* Right — dark red: Mitigation */}
              <div className={styles.hlCardRed}>
                <div className={styles.hlCardContent}>
                  <h3 className={styles.hlCardTitle}>Mitigation</h3>
                  <p className={styles.hlCardText}>Optimizing resource allocation by prioritizing critical tasks and cross-training opportunities.</p>
                  <hr className={styles.hlDivider} />
                  <p className={styles.hlCardText}>Invest in upskiling existing team members.</p>
                  <hr className={styles.hlDivider} />
                  <p className={styles.hlCardText}>Explore a hybrid model of onshore-offshore resource allocation to balance expertise.</p>
                </div>
              </div>

            </div>
          </section>

        ) : (

          /* ── Regular chart section ── */
          <section key={s.id} id={s.id} className={styles.section}>
            <div className={`${styles.row} ${s.chartSide === 'left' ? styles.rowReverse : ''}`}>
              <div className={styles.textSide}>
                <h2 className={styles.sectionTitle}>{s.label}</h2>
                {s.subLabel && <p className={styles.subLabel}>{s.subLabel}</p>}
                <p className={styles.sectionDesc}>{s.description}</p>
                <p className={styles.lastUpdate}>{LAST_UPDATE}</p>
                <button className={styles.backToTop} onClick={() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })}>Back to top</button>
              </div>
              <div className={styles.chartSide}>
                <div className={styles.chartPlaceholder}>Chart</div>
              </div>
            </div>
          </section>

        ))}
      </div>

      {/* Remaining video assets */}
      {videoFiles.length > 0 && (
        <div className={styles.content}>
          {videoFiles.map((src, i) => (
            <video key={i} src={src} controls className={styles.video} />
          ))}
        </div>
      )}

    </div>
  )
}
