import { useState, useCallback, useEffect, useRef } from 'react'
import styles from './PortfolioAnalyticsTabs.module.scss'

export interface AnalyticsTab {
  id: string
  label: string
  description?: string | null
  /** Optional content rendered beneath the description (e.g. a definition table) */
  supplement?: React.ReactNode
  lastUpdate?: string
  /** The chart / visualisation element */
  chart: React.ReactNode
}

interface PortfolioAnalyticsTabsProps {
  heading?: string
  tabs: AnalyticsTab[]
}

export default function PortfolioAnalyticsTabs({
  heading = 'By the Numbers',
  tabs,
}: PortfolioAnalyticsTabsProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = useCallback((idx: number) => {
    setActiveIdx(idx)
  }, [])

  /* ── Keyboard navigation (← → Home End) ── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      let next = idx
      if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length
      else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = tabs.length - 1
      else return
      e.preventDefault()
      select(next)
      tabRefs.current[next]?.focus()
    },
    [tabs.length, select]
  )

  /* Scroll active tab into view on mobile */
  useEffect(() => {
    tabRefs.current[activeIdx]?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeIdx])

  const active = tabs[activeIdx]

  return (
    <section
      id="analytics"
      className={styles.section}
      aria-labelledby="analytics-heading"
    >
      {/* ── Section heading ── */}
      <h2 id="analytics-heading" className={styles.heading}>{heading}</h2>

      {/* ── Tab list ── */}
      <div
        role="tablist"
        aria-label="Analytics views"
        className={styles.tabList}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            ref={el => { tabRefs.current[idx] = el }}
            role="tab"
            aria-selected={idx === activeIdx}
            aria-controls={`panel-${tab.id}`}
            tabIndex={idx === activeIdx ? 0 : -1}
            className={`${styles.tab} ${idx === activeIdx ? styles.tabActive : ''}`}
            onClick={() => select(idx)}
            onKeyDown={e => handleKeyDown(e, idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab panel ── */}
      <div
        id={`panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${active.id}`}
        className={styles.panel}
      >
        {/* Description + supplement run full-width above the chart */}
        {(active.description || active.supplement) && (
          <div className={styles.panelMeta}>
            {active.description && (
              <p className={styles.panelDesc}>{active.description}</p>
            )}
            {active.supplement && (
              <div className={styles.panelSupplement}>{active.supplement}</div>
            )}
            {active.lastUpdate && (
              <p className={styles.lastUpdate}>{active.lastUpdate}</p>
            )}
          </div>
        )}

        {/* Chart */}
        <div className={styles.chartArea}>{active.chart}</div>
      </div>
    </section>
  )
}
