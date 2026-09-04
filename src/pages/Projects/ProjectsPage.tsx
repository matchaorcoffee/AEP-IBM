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
    description: 'In days\n\nThis chart offers a comprehensive view of fulfillment times and lead times by projects, empowering leadership to make informed decisions regarding project management and resource allocation.',
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

const LAST_UPDATE = 'Last update 01/20/2026'

export default function ProjectsPage() {
  return (
    <div className={styles.page} id="top">

      {/* Hero image */}
      <img src={projectsImg} alt="Projects" className={styles.image} />

      {/* Navigation links */}
      <nav className={styles.navBar}>
        {sections.map(s => (
          <button key={s.id} className={styles.navLink} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}>{s.label}</button>
        ))}
      </nav>

      {/* Sections */}
      <div className={styles.sections}>
        {sections.map(s => (
          <section key={s.id} id={s.id} className={styles.section}>
            <div className={`${styles.row} ${s.chartSide === 'left' ? styles.rowReverse : ''}`}>

              {/* Text side */}
              <div className={styles.textSide}>
                <h2 className={styles.sectionTitle}>{s.label}</h2>
                {s.description.split('\n\n').map((para, i) => (
                  <p key={i} className={i === 0 && s.id === 'avg-fulfillment' ? styles.subLabel : styles.sectionDesc}>{para}</p>
                ))}
                <p className={styles.lastUpdate}>{LAST_UPDATE}</p>
                <button className={styles.backToTop} onClick={() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })}>Back to top</button>
              </div>

              {/* Chart placeholder */}
              <div className={styles.chartSide}>
                <div className={styles.chartPlaceholder}>Chart</div>
              </div>

            </div>
          </section>
        ))}
      </div>

    </div>
  )
}
