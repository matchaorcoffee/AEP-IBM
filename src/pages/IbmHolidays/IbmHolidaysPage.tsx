import React, { useState, useMemo } from 'react'
import styles from './IbmHolidaysPage.module.scss'
import { useFadeIn } from '../../hooks/useFadeIn'
import {
  SUPPORTED_COUNTRIES,
  getHolidaysByYear,
  getNextHolidayForCountry,
} from '../../data/mock-holidays'
import type { Holiday } from '../../models/Holiday'
import CountryCards from './components/CountryCards/CountryCards'
import ActiveLocationHero from './components/ActiveLocationHero/ActiveLocationHero'
import LocationSelectorModal from './components/LocationSelectorModal/LocationSelectorModal'
import UpcomingTimeline from './components/UpcomingTimeline/UpcomingTimeline'
import MonthlyCalendar from './components/MonthlyCalendar/MonthlyCalendar'
import HolidayDetailsModal from './components/HolidayDetailsModal/HolidayDetailsModal'

import holidaysVideo from './assets/countries/Holidays Header.mp4'

// Primary quick-access country IDs — separate concept from supported countries list
const PRIMARY_COUNTRY_IDS = ['usa', 'india', 'philippines']

export default function IbmHolidaysPage() {
  const contentFade = useFadeIn<HTMLElement>(0.08)

  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false)
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // Current viewed calendar month
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null)

  // ── Month Navigation ───────────────────────────────────────────────────────
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  // ── Primary 3 Quick-Access Country Cards ───────────────────────────────────
  const primaryCountries = useMemo(() => {
    return SUPPORTED_COUNTRIES.filter(c => PRIMARY_COUNTRY_IDS.includes(c.id))
  }, [])

  // ── Selected Country Details & Metrics ─────────────────────────────────────
  const selectedCountryInfo = useMemo(() => {
    return SUPPORTED_COUNTRIES.find(c => c.id === selectedCountry)
  }, [selectedCountry])

  const displayedYear = currentDate.getFullYear()

  // ── Filtered Holidays For Calendar (based on currently viewed year & country) ─
  const calendarHolidays = useMemo(() => {
    return getHolidaysByYear(selectedCountry, displayedYear)
  }, [selectedCountry, displayedYear])

  // ── Next Upcoming Holiday for Active Location ──────────────────────────────
  const activeNextHoliday = useMemo(() => {
    return getNextHolidayForCountry(selectedCountry)
  }, [selectedCountry])

  // ── Upcoming Holidays Across Locations (Chronological from today) ───────────
  const upcomingTimelineHolidays = useMemo(() => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const todayIso = `${currentYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    const combined = [
      ...getHolidaysByYear(selectedCountry, currentYear),
      ...getHolidaysByYear(selectedCountry, currentYear + 1),
    ]

    const upcoming = combined.filter(h => h.date >= todayIso)
    return upcoming.length > 0 ? upcoming.slice(0, 14) : combined.slice(0, 14)
  }, [selectedCountry])

  const selectedCountryLabel = selectedCountryInfo ? selectedCountryInfo.label : 'All Locations'

  return (
    <div className={styles.page}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <video
          className={styles.heroVideo}
          src={holidaysVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent} aria-live="polite">
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.heroHeading}>IBM Holidays</h1>
          <p className={styles.heroSub}>
            Public holiday calendars for every IBM AEP country location — all in one place.
          </p>
        </div>
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span>Scroll</span>
          <svg className={styles.scrollChevron} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── Main Planning Section ─────────────────────────────────────── */}
      <section
        ref={contentFade.ref}
        className={`${styles.mainSection} ${contentFade.visible ? styles.fadeVisible : styles.fadeHidden}`}
      >
        <div className={styles.mainContainer}>

          {/* Section Header */}
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Global Holiday Calendar</h2>
            <p className={styles.sectionSub}>
              Plan ahead across all AEP–IBM delivery locations with validated holiday schedules
            </p>
          </div>

          {/* ── 1. Primary Location Cards + View All Locations ───────── */}
          <CountryCards
            primaryCountries={primaryCountries}
            supportedCountries={SUPPORTED_COUNTRIES}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            onOpenAllLocations={() => setIsLocationModalOpen(true)}
            getNextHoliday={getNextHolidayForCountry}
          />

          {/* ── 2. Dynamic Single Selected-Location Visual ───────────── */}
          <ActiveLocationHero
            selectedCountry={selectedCountry}
            selectedCountryInfo={selectedCountryInfo}
            displayedYear={displayedYear}
            nextHoliday={activeNextHoliday}
            holidayCountThisYear={calendarHolidays.length}
            onOpenAllLocations={() => setIsLocationModalOpen(true)}
            onSelectHoliday={setSelectedHoliday}
          />

          {/* ── 3. Monthly Calendar Grid ────────────────────────────── */}
          <MonthlyCalendar
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            holidays={calendarHolidays}
            onSelectHoliday={setSelectedHoliday}
          />

          {/* ── 4. Upcoming Holidays Chronological Timeline ─────────── */}
          <UpcomingTimeline
            holidays={upcomingTimelineHolidays}
            onSelectHoliday={setSelectedHoliday}
            selectedCountry={selectedCountry}
            selectedCountryLabel={selectedCountryLabel}
          />

        </div>
      </section>

      {/* ── Location Selector Modal (Searchable All Locations) ───────── */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        supportedCountries={SUPPORTED_COUNTRIES}
        primaryCountryIds={PRIMARY_COUNTRY_IDS}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
      />

      {/* ── Holiday Details Modal ────────────────────────────────────── */}
      <HolidayDetailsModal
        holiday={selectedHoliday}
        onClose={() => setSelectedHoliday(null)}
      />

    </div>
  )
}
