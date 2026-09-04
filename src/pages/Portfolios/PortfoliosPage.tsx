import { Link } from 'react-router-dom'
import styles from './PortfoliosPage.module.scss'
import portfolioImg from './assets/Portfolio.png'

const SUB_ITEMS = [
  { label: 'WAM',                         path: '/portfolios/wam' },
  { label: 'Energy Delivery',             path: '/portfolios/energy-delivery' },
  { label: 'Grid Operations',             path: '/portfolios/grid-operations' },
  { label: 'Generation & Commercial Ops', path: '/portfolios/generation-commercial' },
  { label: 'Shared Services',             path: '/portfolios/shared-services' },
  { label: 'ICOE',                        path: '/portfolios/icoe' },
  { label: 'Automation COE',              path: '/portfolios/automation-coe' },
  { label: 'Digital Emerging Technology', path: '/portfolios/digital-emerging' },
  { label: 'Data Platforms',              path: '/portfolios/data-platforms' },
  { label: 'Security',                    path: '/portfolios/security' },
  { label: 'Customer',                    path: '/portfolios/customer' },
]

export default function PortfoliosPage() {
  return (
    <div className={styles.page}>

      {/* Full-width hero image */}
      <div className={styles.heroBanner}>
        <img src={portfolioImg} alt="Portfolio" className={styles.heroImg} />
      </div>

      {/* Centered title */}
      <section className={styles.titleSection}>
        <h1 className={styles.pageTitle}>Portfolio</h1>
      </section>

      {/* Sub-item nav links */}
      <nav className={styles.navBar}>
        {SUB_ITEMS.map(item => (
          <Link key={item.path} to={item.path} className={styles.navLink}>
            {item.label}
          </Link>
        ))}
      </nav>

    </div>
  )
}
