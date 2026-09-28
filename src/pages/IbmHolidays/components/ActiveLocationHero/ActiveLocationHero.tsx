import React from 'react'
import styles from './ActiveLocationHero.module.scss'
import type { CountryInfo, Holiday } from '../../../../models/Holiday'
import fallbackImg from '../../assets/Holidays.jpg'

interface ActiveLocationHeroProps {
  selectedCountry: string // 'all' | countryId
  selectedCountryInfo?: CountryInfo
  displayedYear: number
  nextHoliday: Holiday | null
  holidayCountThisYear: number
  onOpenAllLocations: () => void
  onSelectHoliday: (holiday: Holiday) => void
}

export default function ActiveLocationHero({
  selectedCountry,
  selectedCountryInfo,
  displayedYear,
  nextHoliday,
  holidayCountThisYear,
  onOpenAllLocations,
  onSelectHoliday,
}: ActiveLocationHeroProps) {
  const isAll = selectedCountry === 'all' || !selectedCountryInfo

  // Determine image and alt
  const currentImage = isAll ? fallbackImg : (selectedCountryInfo.src || fallbackImg)
  const imageAlt = isAll ? 'Global Delivery Hubs' : `${selectedCountryInfo.label} delivery location`

  const formatNextDate = (isoStr?: string) => {
    if (!isoStr) return '—'
    try {
      const [year, month, day] = isoStr.split('-').map(Number)
      const d = new Date(year, month - 1, day)
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return isoStr
    }
  }

  return (
    <div className={styles.container} role="region" aria-label="Active Location Overview">
      <div className={styles.card}>
        {/* ── Left Column: Holiday & Location Information (55-60%) ── */}
        <div className={styles.infoCol}>
          {/* Header Identity Row */}
          <div className={styles.identityRow}>
            <span className={styles.flagBadge} aria-hidden="true">
              {isAll ? '🌐' : selectedCountryInfo.flag}
            </span>
            <div className={styles.identityText}>
              <div className={styles.countryName}>
                {isAll ? 'ALL DELIVERY LOCATIONS' : selectedCountryInfo.label.toUpperCase()}
              </div>
              <div className={styles.calendarSub}>
                Holiday Calendar · {displayedYear}
              </div>
            </div>
          </div>

          {/* Next Holiday Feature Box */}
          <div className={styles.nextHolidayBox}>
            <div className={styles.nextTagRow}>
              <span className={styles.nextTag}>NEXT UPCOMING HOLIDAY</span>
              {nextHoliday?.type && (
                <span className={styles.typeBadge}>{nextHoliday.type}</span>
              )}
            </div>

            {nextHoliday ? (
              <div
                className={styles.holidayContent}
                role="button"
                tabIndex={0}
                onClick={() => onSelectHoliday(nextHoliday)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectHoliday(nextHoliday)
                  }
                }}
                title="Click to view holiday details"
              >
                <div className={styles.holidayNameRow}>
                  <span className={styles.holidayTitle}>{nextHoliday.name}</span>
                  {isAll && (
                    <span className={styles.holidayCountryFlag} title={nextHoliday.countryName}>
                      {nextHoliday.flag}
                    </span>
                  )}
                </div>
                <div className={styles.holidayDateRow}>
                  <span className={styles.dateIcon}>📅</span>
                  <span className={styles.dateText}>{formatNextDate(nextHoliday.date)}</span>
                </div>
              </div>
            ) : (
              <div className={styles.noHolidays}>
                No upcoming holidays scheduled for this selection
              </div>
            )}
          </div>

          {/* Quick Metrics & Location Switcher */}
          <div className={styles.metaRow}>
            <div className={styles.statChip}>
              <span className={styles.statVal}>{holidayCountThisYear}</span>
              <span className={styles.statLabel}>Total in {displayedYear}</span>
            </div>

            <button
              type="button"
              className={styles.switchLocationBtn}
              onClick={onOpenAllLocations}
              aria-label="Switch delivery location"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{isAll ? 'Filter by Location' : 'Change Location'}</span>
            </button>
          </div>
        </div>

        {/* ── Right Column: Contained Location Visual (40-45%) ── */}
        <div className={styles.visualCol}>
          <div className={styles.imageWrapper}>
            <img
              key={selectedCountry}
              src={currentImage}
              alt={imageAlt}
              className={styles.locationImage}
            />
            <div className={styles.imageOverlay} aria-hidden="true" />
            <div className={styles.imageCaption}>
              <span className={styles.captionFlag} aria-hidden="true">
                {isAll ? '🌐' : selectedCountryInfo.flag}
              </span>
              <span className={styles.captionText}>
                {isAll ? 'Global Delivery Network' : selectedCountryInfo.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
