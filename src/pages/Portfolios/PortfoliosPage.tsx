import { Link } from 'react-router-dom'
import styles from './PortfoliosPage.module.scss'
import portfolioImg from './assets/Portfolio.png'

const SUB_ITEMS = [
  {
    label: 'WAM',
    path: '/portfolios/wam',
    desc: 'Work & Asset Management solutions',
    img: new URL('./WAM/assets/WAM.png', import.meta.url).href,
  },
  {
    label: 'Energy Delivery',
    path: '/portfolios/energy-delivery',
    desc: 'Reliable energy transmission & distribution',
    img: new URL('./EnergyDelivery/assets/EnergyDelivery.png', import.meta.url).href,
  },
  {
    label: 'Grid Operations',
    path: '/portfolios/grid-operations',
    desc: 'Real-time grid monitoring & control',
    img: new URL('./GridOperations/assets/GridOperations.png', import.meta.url).href,
  },
  {
    label: 'Generation & Commercial Ops',
    path: '/portfolios/generation-commercial',
    desc: 'Power generation & commercial optimization',
    img: new URL('./GenerationCommercial/assets/GenerationCommercial.png', import.meta.url).href,
  },
  {
    label: 'Shared Services',
    path: '/portfolios/shared-services',
    desc: 'Enterprise-wide shared capabilities',
    img: new URL('./SharedServices/assets/SharedServices.png', import.meta.url).href,
  },
  {
    label: 'ICOE',
    path: '/portfolios/icoe',
    desc: 'Innovation Center of Excellence',
    img: new URL('./ICOE/assets/ICOE.png', import.meta.url).href,
  },
  {
    label: 'Automation COE',
    path: '/portfolios/automation-coe',
    desc: 'Intelligent automation & RPA initiatives',
    img: new URL('./AutomationCOE/assets/AutomationCOE.png', import.meta.url).href,
  },
  {
    label: 'Digital Emerging Technology',
    path: '/portfolios/digital-emerging',
    desc: 'Next-gen digital & emerging tech programs',
    img: new URL('./DigitalEmerging/assets/DigitalEmerging.png', import.meta.url).href,
  },
  {
    label: 'Data Platforms',
    path: '/portfolios/data-platforms',
    desc: 'Data infrastructure & analytics platforms',
    img: new URL('./DataPlatforms/assets/DataPlatforms.png', import.meta.url).href,
  },
  {
    label: 'Security',
    path: '/portfolios/security',
    desc: 'Cybersecurity & risk management',
    img: new URL('./Security/assets/Security.png', import.meta.url).href,
  },
  {
    label: 'Customer',
    path: '/portfolios/customer',
    desc: 'Customer experience & engagement',
    img: new URL('./Customer/assets/Customer.png', import.meta.url).href,
  },
]

export default function PortfoliosPage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <img src={portfolioImg} alt="" className={styles.heroImg} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.heroHeading}>Portfolio Areas</h1>
          <p className={styles.heroSub}>
            Explore the domains where IBM and AEP collaborate to drive innovation,
            efficiency, and impact across the enterprise.
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <section className={styles.cardsSection} aria-labelledby="portfolios-heading">
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <h2 id="portfolios-heading" className={styles.sectionTitle}>All Portfolios</h2>
            <p className={styles.sectionSub}>Select a portfolio to explore its projects and initiatives</p>
          </div>
          <div className={styles.grid}>
            {SUB_ITEMS.map(item => (
                <Link key={item.path} to={item.path} className={styles.card}>
                  <div className={styles.cardImg}>
                    <img src={item.img} alt={item.label} />
                  </div>
                  <div className={styles.cardOverlay} aria-hidden="true" />
                  <div className={styles.cardBody}>
                    <span className={styles.cardLabel}>{item.label}</span>
                    <span className={styles.cardDesc}>{item.desc}</span>
                  </div>
                  <svg className={styles.cardArrow} viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </Link>
              ))}
          </div>
        </div>
      </section>

    </div>
  )
}
