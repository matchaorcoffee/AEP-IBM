import React from 'react'
import styles from './MonthlyCalendar.module.scss'
import type { Holiday } from '../../../../models/Holiday'

interface MonthlyCalendarProps {
  currentDate: Date // Current month & year viewed
  onPrevMonth: () => void
  onNextMonth: () => void
  holidays: Holiday[]
  onSelectHoliday: (holiday: Holiday) => void
}

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export default function MonthlyCalendar({
  currentDate,
  onPrevMonth,
  onNextMonth,
  holidays,
  onSelectHoliday,
}: MonthlyCalendarProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() // 0-indexed

  // Format header title: e.g. "September 2025"
  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  // Group holidays by ISO date string (YYYY-MM-DD)
  const holidaysByDate = React.useMemo(() => {
    const map = new Map<string, Holiday[]>()
    holidays.forEach(h => {
      const existing = map.get(h.date) || []
      existing.push(h)
      map.set(h.date, existing)
    })
    return map
  }, [holidays])

  // Compute calendar grid cells
  const firstDayOfMonth = new Date(year, month, 1)
  let startDayOfWeek = firstDayOfMonth.getDay() - 1
  if (startDayOfWeek === -1) startDayOfWeek = 6

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: {
    dayNumber: number
    isoDate: string
    isCurrentMonth: boolean
    holidays: Holiday[]
    isToday: boolean
  }[] = []

  const today = new Date()
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // 1. Prev month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const prevMonthIdx = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const iso = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({
      dayNumber: d,
      isoDate: iso,
      isCurrentMonth: false,
      holidays: holidaysByDate.get(iso) || [],
      isToday: iso === todayIso,
    })
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({
      dayNumber: d,
      isoDate: iso,
      isCurrentMonth: true,
      holidays: holidaysByDate.get(iso) || [],
      isToday: iso === todayIso,
    })
  }

  // 3. Next month leading days
  const remaining = (7 - (cells.length % 7)) % 7
  const nextDaysNeeded = remaining === 0 && cells.length < 35 ? 7 : remaining
  for (let d = 1; d <= nextDaysNeeded; d++) {
    const nextMonthIdx = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    const iso = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({
      dayNumber: d,
      isoDate: iso,
      isCurrentMonth: false,
      holidays: holidaysByDate.get(iso) || [],
      isToday: iso === todayIso,
    })
  }

  return (
    <div className={styles.calendarCard}>
      {/* ── Month Navigation Header ── */}
      <div className={styles.navHeader}>
        <button
          type="button"
          onClick={onPrevMonth}
          className={styles.navBtn}
          aria-label="Previous month"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <h3 className={styles.monthTitle} aria-live="polite">
          {monthName}
        </h3>

        <button
          type="button"
          onClick={onNextMonth}
          className={styles.navBtn}
          aria-label="Next month"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* ── Weekday Headers ── */}
      <div className={styles.weekdaysGrid} aria-hidden="true">
        {WEEKDAYS.map(w => (
          <div key={w} className={styles.weekdayCell}>
            {w}
          </div>
        ))}
      </div>

      {/* ── Calendar Grid ── */}
      <div className={styles.daysGrid} role="grid" aria-label={`Calendar for ${monthName}`}>
        {cells.map(cell => {
          const hasHolidays = cell.holidays.length > 0
          return (
            <div
              key={cell.isoDate}
              role="gridcell"
              className={`
                ${styles.dayCell}
                ${!cell.isCurrentMonth ? styles.otherMonth : ''}
                ${hasHolidays ? styles.hasHoliday : ''}
                ${cell.isToday ? styles.isToday : ''}
              `}
            >
              <div className={styles.dayCellHeader}>
                <span className={`${styles.dayNumber} ${cell.isToday ? styles.todayNumber : ''}`}>
                  {cell.dayNumber}
                </span>
                {hasHolidays && (
                  <span className={styles.holidayDot} aria-hidden="true" />
                )}
              </div>

              {/* Holiday Tags */}
              <div className={styles.holidayList}>
                {cell.holidays.map(h => (
                  <button
                    key={h.id}
                    type="button"
                    className={styles.holidayPill}
                    onClick={() => onSelectHoliday(h)}
                    title={`${h.name} (${h.countryName})`}
                    aria-label={`Holiday: ${h.name} in ${h.countryName}`}
                  >
                    <span className={styles.pillFlag} aria-hidden="true">{h.flag}</span>
                    <span className={styles.pillText}>{h.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
