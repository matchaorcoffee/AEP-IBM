import styles from './SectionHeader.module.scss'
import { Link } from 'react-router-dom'
import iconArrowRight from '../../../assets/icons/icon-arrow-right.svg'

interface SectionHeaderProps {
  title: string
  viewAllPath?: string
  viewAllLabel?: string
}

export default function SectionHeader({ title, viewAllPath, viewAllLabel = 'View all' }: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {viewAllPath && (
        <Link to={viewAllPath} className={styles.viewAll}>
          {viewAllLabel}
          <img src={iconArrowRight} alt="" width={16} height={16} />
        </Link>
      )}
    </div>
  )
}
