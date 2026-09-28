import React from 'react'
import styles from './CountryCards.module.scss'
import type { CountryInfo, Holiday } from '../../../../models/Holiday'

interface CountryCardsProps {
  primaryCountries: CountryInfo[]
  supportedCountries: CountryInfo[]
  selectedCountry: string // 'all' | countryId
  onSelectCountry: (countryId: string) => void
  onOpenAllLocations: () => void
  getNextHoliday: (countryId: string) => Holiday | null
}

export default function CountryCards({
  primaryCountries,
  supportedCountries,
  selectedCountry,
  onSelectCountry,
  onOpenAllLocations,
  getNextHoliday,
}: CountryCardsProps) {
  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—'
    try {
      const [year, month, day] = isoStr.split('-').map(Number)
      const d = new Date(year, month - 1, day)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return isoStr
    }
  }

  // Check if selected country is a non-primary country
  const isSelectedNonPrimary = selectedCountry !== 'all' && !primaryCountries.some(c => c.id === selectedCountry)
  const nonPrimaryCountry = isSelectedNonPrimary ? supportedCountries.find(c => c.id === selectedCountry) : null

  return (
    <div className={styles.container}>
      {/* ── Top Bar: All Locations Trigger & Active Location State ── */}
      <div className={styles.topControlRow}>
        <button
          type="button"
          className={`${styles.allLocationsBtn} ${selectedCountry === 'all' ? styles.active : ''}`}
          onClick={onOpenAllLocations}
          aria-label="Open location selector dialog"
        >
          <span className={styles.allIcon} aria-hidden="true">🌐</span>
          <span>View All Locations ({supportedCountries.length})</span>
          <span className={styles.browseChevron} aria-hidden="true">▾</span>
        </button>

        {selectedCountry === 'all' ? (
          <div className={styles.activeFilterBadge}>
            <span className={styles.dot} />
            <span>Showing all {supportedCountries.length} delivery locations</span>
          </div>
        ) : (
          <button
            type="button"
            className={styles.resetAllBtn}
            onClick={() => onSelectCountry('all')}
            title="Reset to all delivery locations"
          >
            Show All Locations
          </button>
        )}
      </div>

      {/* ── Active Non-Primary Country Banner (when user picks e.g. Canada/Brazil) ── */}
      {nonPrimaryCountry && (
        <div className={styles.nonPrimaryActiveBanner} role="status">
          <div className={styles.bannerLeft}>
            <span className={styles.bannerFlag} aria-hidden="true">{nonPrimaryCountry.flag}</span>
            <div>
              <span className={styles.bannerCaption}>VIEWING CALENDAR FOR</span>
              <div className={styles.bannerCountry}>{nonPrimaryCountry.label}</div>
            </div>
          </div>
          <button
            type="button"
            className={styles.changeLocationBtn}
            onClick={onOpenAllLocations}
          >
            Change Location
          </button>
        </div>
      )}

      {/* ── Primary 3 Country Cards (Quick-Access) ── */}
      <div className={styles.cardsGrid} role="region" aria-label="Primary Delivery Hubs">
        {primaryCountries.map(c => {
          const next = getNextHoliday(c.id)
          const isSelected = selectedCountry === c.id

          return (
            <div
              key={c.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              className={`${styles.countryCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelectCountry(c.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectCountry(c.id)
                }
              }}
            >
              {/* Card Header: Flag + Name */}
              <div className={styles.cardHeader}>
                <span className={styles.flagBadge} aria-hidden="true">{c.flag}</span>
                <div>
                  <h3 className={styles.countryLabel}>{c.label}</h3>
                  <span className={styles.quickBadge}>Primary Delivery Hub</span>
                </div>
              </div>

              {/* Next Holiday Box */}
              <div className={styles.nextHolidayBox}>
                <span className={styles.nextTag}>NEXT HOLIDAY</span>
                <div className={styles.holidayName} title={next ? next.name : ''}>
                  {next ? next.name : 'No upcoming holiday'}
                </div>
                <div className={styles.holidayDate}>
                  {next ? formatDate(next.date) : '—'}
                </div>
              </div>

              {/* Action link styled footer */}
              <div className={styles.cardFooter}>
                <span className={styles.viewCalendarText}>
                  {isSelected ? 'Viewing Calendar' : 'View Calendar'}
                </span>
                <svg className={styles.arrowIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
