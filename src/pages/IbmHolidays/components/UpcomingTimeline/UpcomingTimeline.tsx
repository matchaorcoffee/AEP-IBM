import React from 'react'
import styles from './UpcomingTimeline.module.scss'
import type { Holiday } from '../../../../models/Holiday'

interface UpcomingTimelineProps {
  holidays: Holiday[]
  onSelectHoliday: (holiday: Holiday) => void
  selectedCountry: string
  selectedCountryLabel: string
}

export default function UpcomingTimeline({
  holidays,
  onSelectHoliday,
  selectedCountry,
  selectedCountryLabel,
}: UpcomingTimelineProps) {
  const formatMonthAndDay = (isoStr: string) => {
    try {
      const [year, month, day] = isoStr.split('-').map(Number)
      const d = new Date(year, month - 1, day)
      const monthAbbr = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
      const dayStr = String(day).padStart(2, '0')
      const fullYear = year
      return { monthAbbr, dayStr, fullYear }
    } catch {
      return { monthAbbr: 'HOL', dayStr: '00', fullYear: 2025 }
    }
  }

  return (
    <div className={styles.timelineSection}>
      <div className={styles.sectionHead}>
        <div className={styles.badge}>CHRONOLOGICAL TIMELINE</div>
        <h3 className={styles.title}>Upcoming Across Locations</h3>
        <p className={styles.subtitle}>
          {selectedCountry === 'all'
            ? 'Showing upcoming holidays across all active AEP–IBM delivery hubs'
            : `Showing upcoming holidays for ${selectedCountryLabel}`}
        </p>
      </div>

      {holidays.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No upcoming holidays found for this selection.</p>
        </div>
      ) : (
        <div className={styles.timelineList} role="feed" aria-label="Upcoming holidays chronological timeline">
          {holidays.map(h => {
            const { monthAbbr, dayStr, fullYear } = formatMonthAndDay(h.date)

            return (
              <article
                key={h.id}
                className={styles.timelineItem}
                onClick={() => onSelectHoliday(h)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectHoliday(h)
                  }
                }}
                aria-label={`${h.name} on ${h.date} in ${h.countryName}`}
              >
                {/* Date Stamp Block */}
                <div className={styles.dateBlock}>
                  <span className={styles.monthAbbr}>{monthAbbr}</span>
                  <span className={styles.dayStr}>{dayStr}</span>
                  <span className={styles.yearStr}>{fullYear}</span>
                </div>

                {/* Holiday Info */}
                <div className={styles.infoBlock}>
                  <div className={styles.nameRow}>
                    <h4 className={styles.holidayName}>{h.name}</h4>
                    {h.type && (
                      <span className={styles.typeTag}>{h.type}</span>
                    )}
                  </div>
                  <div className={styles.countryRow}>
                    <span className={styles.flagIcon} aria-hidden="true">{h.flag}</span>
                    <span className={styles.countryName}>{h.countryName}</span>
                  </div>
                </div>

                {/* Arrow Action */}
                <div className={styles.actionBlock} aria-hidden="true">
                  <span className={styles.detailsLabel}>Details</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
