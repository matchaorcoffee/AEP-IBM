import styles from './TagChip.module.scss'

interface TagChipProps {
  label: string
  variant?: 'default' | 'blue' | 'purple' | 'green' | 'red'
}

export default function TagChip({ label, variant = 'default' }: TagChipProps) {
  return (
    <span className={`${styles.chip} ${styles[variant]}`}>
      {label}
    </span>
  )
}
