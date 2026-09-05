import styles from './QuickLinks.module.scss'
import { Link } from 'react-router-dom'

const LINKS = [
  {
    id: 'ql1',
    label: 'Portfolios',
    path: '/portfolios',
    description: 'Browse partner portfolios',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    id: 'ql2',
    label: 'Projects',
    path: '/projects',
    description: 'View active projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    id: 'ql3',
    label: 'IBM Holidays',
    path: '/ibm-holidays',
    description: 'IBM holiday calendar',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'ql4',
    label: 'Partnership',
    path: '/partnership',
    description: 'Partnership programme details',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'ql5',
    label: 'IBM FNCs',
    path: '/ibm-cics',
    description: 'Client Innovation Centers',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    id: 'ql6',
    label: 'Search',
    path: '/search',
    description: 'Search all resources',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
]

export default function QuickLinks() {
  return (
    <section className={styles.section} aria-labelledby="quick-links-heading">
      <div className={styles.inner}>
        <div className={styles.sectionHeader}>
          <h2 id="quick-links-heading" className={styles.sectionTitle}>Quick Access</h2>
          <p className={styles.sectionSub}>Jump to any section of the portal</p>
        </div>
        <div className={styles.grid}>
          {LINKS.map(item => (
            <Link key={item.id} to={item.path} className={styles.tile}>
              <div className={styles.iconWrapper}>{item.icon}</div>
              <div className={styles.tileBody}>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.desc}>{item.description}</span>
              </div>
              <svg className={styles.arrow} viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
