import styles from './QuickLinks.module.scss'
import { Link } from 'react-router-dom'
import type { QuickLink } from '../../../../models/QuickLink'

interface QuickLinksProps {
  links: QuickLink[]
}

export default function QuickLinks({ links }: QuickLinksProps) {
  return (
    <section className={styles.section} aria-labelledby="quick-links-heading">
      <div className={styles.inner}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLabel}>Navigation</div>
          <h2 id="quick-links-heading" className={styles.sectionTitle}>Quick Access</h2>
        </div>
        <div className={styles.grid}>
          {links.map(item => (
            <Link key={item.id} to={item.path} className={styles.tile}>
              <div className={styles.iconWrapper}>
                <img src={item.icon} alt="" width={24} height={24} />
              </div>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.desc}>{item.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
