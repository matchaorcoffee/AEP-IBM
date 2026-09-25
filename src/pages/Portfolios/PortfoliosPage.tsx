import { Link } from 'react-router-dom'
import styles from './PortfoliosPage.module.scss'
import headerGif from './assets/Header.gif'
import projectsImg from '../Projects/assets/Projects.png'
import { useFadeIn } from '../../hooks/useFadeIn'

const SUB_ITEMS = [
  {
    label: 'WAM',
    path: '/portfolios/wam',
    desc: 'Work & Asset Management solutions',
    category: 'Asset Management',
    video: new URL('./WAM/assets/WAM Header.mp4', import.meta.url).href,
    poster: new URL('./WAM/assets/WAM.png', import.meta.url).href,
  },
  {
    label: 'Energy Delivery',
    path: '/portfolios/energy-delivery',
    desc: 'Reliable energy transmission & distribution',
    category: 'Transmission & Distribution',
    video: new URL('./EnergyDelivery/assets/EnergyDelivery Header.mp4', import.meta.url).href,
    poster: new URL('./EnergyDelivery/assets/EnergyDelivery.png', import.meta.url).href,
  },
  {
    label: 'Grid Operations',
    path: '/portfolios/grid-operations',
    desc: 'Real-time grid monitoring & control',
    category: 'Operations',
    video: new URL('./GridOperations/assets/GridOperations Header.mp4', import.meta.url).href,
    poster: new URL('./GridOperations/assets/GridOperations.png', import.meta.url).href,
  },
  {
    label: 'Generation & Commercial Ops',
    path: '/portfolios/generation-commercial',
    desc: 'Power generation & commercial optimization',
    category: 'Generation',
    video: new URL('./GenerationCommercial/assets/GenerationCommercial Header.mp4', import.meta.url).href,
    poster: new URL('./GenerationCommercial/assets/GenerationCommercial.png', import.meta.url).href,
  },
  {
    label: 'Shared Services',
    path: '/portfolios/shared-services',
    desc: 'Enterprise-wide shared capabilities',
    category: 'Enterprise',
    video: new URL('./SharedServices/assets/SharedServices Header.mp4', import.meta.url).href,
    poster: new URL('./SharedServices/assets/SharedServices.png', import.meta.url).href,
  },
  {
    label: 'ICOE',
    path: '/portfolios/icoe',
    desc: 'Innovation Center of Excellence',
    category: 'Innovation',
    video: new URL('./ICOE/assets/ICOE Header.mp4', import.meta.url).href,
    poster: new URL('./ICOE/assets/ICOE.png', import.meta.url).href,
  },
  {
    label: 'Automation COE',
    path: '/portfolios/automation-coe',
    desc: 'Intelligent automation & RPA initiatives',
    category: 'Automation',
    video: new URL('./AutomationCOE/assets/Automation Header.mp4', import.meta.url).href,
    poster: new URL('./AutomationCOE/assets/AutomationCOE.png', import.meta.url).href,
  },
  {
    label: 'Digital Emerging Technology',
    path: '/portfolios/digital-emerging',
    desc: 'Next-gen digital & emerging tech programs',
    category: 'Emerging Tech',
    video: new URL('./DigitalEmerging/assets/DigitalEmerging Header.mp4', import.meta.url).href,
    poster: new URL('./DigitalEmerging/assets/DigitalEmerging.png', import.meta.url).href,
  },
  {
    label: 'Data Platforms',
    path: '/portfolios/data-platforms',
    desc: 'Data infrastructure & analytics platforms',
    category: 'Data & Analytics',
    video: new URL('./DataPlatforms/assets/DataPlatforms Header.mp4', import.meta.url).href,
    poster: new URL('./DataPlatforms/assets/DataPlatforms.png', import.meta.url).href,
  },
  {
    label: 'Security',
    path: '/portfolios/security',
    desc: 'Cybersecurity & risk management',
    category: 'Cybersecurity',
    video: new URL('./Security/assets/Security Header.mp4', import.meta.url).href,
    poster: new URL('./Security/assets/Security.png', import.meta.url).href,
  },
  {
    label: 'Customer',
    path: '/portfolios/customer',
    desc: 'Customer experience & engagement',
    category: 'Customer Experience',
    video: new URL('./Customer/assets/Customer Header.mp4', import.meta.url).href,
    poster: new URL('./Customer/assets/Customer.png', import.meta.url).href,
  },
]

export default function PortfoliosPage() {
  const { ref: cardsSectionRef } = useFadeIn<HTMLElement>()
  const { ref: projectsSectionRef } = useFadeIn<HTMLElement>()

  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero} role="region" aria-label="Portfolios hero">
        <img src={headerGif} alt="" className={styles.heroImg} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.heroHeading}>Engagements</h1>
          <p className={styles.heroSub}>
            Explore the domains where IBM and AEP collaborate to drive innovation,
            efficiency, and impact across the enterprise.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span>Scroll</span>
          <svg className={styles.scrollChevron} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Cards grid */}
      <section ref={cardsSectionRef} className={`${styles.cardsSection} fade-in`} aria-labelledby="portfolios-heading">
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLabel}>Portfolio Overview</div>
            <h2 id="portfolios-heading" className={styles.sectionTitle}>Portfolios</h2>
            <p className={styles.sectionSub}>
              Select a portfolio to explore its projects, capabilities, and delivery metrics.
            </p>
          </div>
          <div className={styles.grid}>
            {SUB_ITEMS.map(item => (
              <Link key={item.path} to={item.path} className={styles.card}>
                <div className={styles.cardVisual}>
                  <video
                    className={styles.cardVideo}
                    src={item.video}
                    poster={item.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                  />
                  <div className={styles.cardOverlay} aria-hidden="true" />
                </div>
                <div className={styles.cardContent}>
                  {item.category && (
                    <span className={styles.cardCategory}>{item.category}</span>
                  )}
                  <h3 className={styles.cardTitle}>{item.label}</h3>
                  <p className={styles.cardDesc}>{item.desc}</p>
                  <div className={styles.cardCtaWrapper}>
                    <span className={styles.cardCta}>
                      View Portfolio
                      <svg
                        className={styles.cardArrow}
                        viewBox="0 0 16 16" width="14" height="14"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 8h10M9 4l4 4-4 4"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Projects section */}
      <section ref={projectsSectionRef} className={`${styles.projectsSection} fade-in`} aria-labelledby="projects-heading">
        <div className={styles.inner}>
          <div className={styles.projectsSectionHeader}>
            <div className={styles.sectionLabel}>Project Intelligence</div>
            <h2 id="projects-heading" className={styles.sectionTitle}>Projects Hub</h2>
            <p className={styles.sectionSub}>
              A centralized hub for project and resource insights — allocation, distribution,
              workforce trends, and demand forecasts.
            </p>
          </div>

          <div className={styles.projectsPreview}>
            <Link to="/projects" className={styles.projectsHeroThumb}>
              <div className={styles.projectsThumbVisual}>
                <img src={projectsImg} alt="Projects" className={styles.projectsThumbImg} />
                <div className={styles.projectsThumbOverlay} aria-hidden="true" />
              </div>
              <div className={styles.projectsThumbBody}>
                <div className={styles.projectsThumbBadge}>IBM · AEP Projects</div>
                <h3 className={styles.projectsThumbTitle}>Project Visibility &amp; Resource Intelligence</h3>
                <p className={styles.projectsThumbSub}>
                  Explore real-time dashboards, delivery model distributions, onboarding/offboarding metrics, and 30-60-90 day forecasts.
                </p>
                <span className={styles.projectsThumbAction}>
                  Open Projects Dashboard
                  <svg
                    viewBox="0 0 16 16" width="14" height="14"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
