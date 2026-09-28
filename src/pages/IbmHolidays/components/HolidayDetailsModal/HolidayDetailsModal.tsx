import React from 'react'
import styles from './HolidayDetailsModal.module.scss'
import type { Holiday } from '../../../../models/Holiday'

interface HolidayDetailsModalProps {
  holiday: Holiday | null
  onClose: () => void
}

export default function HolidayDetailsModal({
  holiday,
  onClose,
}: HolidayDetailsModalProps) {
  if (!holiday) return null

  const formatDateFull = (isoStr: string) => {
    try {
      const [year, month, day] = isoStr.split('-').map(Number)
      const d = new Date(year, month - 1, day)
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return holiday.date
    }
  }

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close holiday details"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.header}>
          <div className={styles.flagBadge}>
            <span className={styles.flagEmoji}>{holiday.flag}</span>
            <span className={styles.countryLabel}>{holiday.countryName}</span>
          </div>
          {holiday.type && (
            <span className={styles.typeBadge}>{holiday.type}</span>
          )}
        </div>

        <h3 id="modal-title" className={styles.title}>
          {holiday.name}
        </h3>

        <div className={styles.dateBlock}>
          <span className={styles.calendarIcon}>📅</span>
          <span className={styles.dateText}>{formatDateFull(holiday.date)}</span>
        </div>

        {holiday.description && (
          <p className={styles.description}>{holiday.description}</p>
        )}

        {holiday.observed && (
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Observed on:</span>
            <span className={styles.metaValue}>{holiday.observed}</span>
          </div>
        )}

        <div className={styles.footer}>
          <a
            href={`https://www.officeholidays.com/countries/${holiday.countryId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.externalLink}
          >
            Office Holidays Reference →
          </a>
        </div>
      </div>
    </div>
  )
}
