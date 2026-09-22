/**
 * ProactiveCountTab
 *
 * "Proactive Count by Project" dashboard tab.
 * Visual design matches DeliveryModelTab (Project Resources by Delivery Model page).
 *
 * Receives data already fetched from monday.com via the existing hook/service.
 * Does NOT fetch data. Does NOT hardcode project names, counts, percentages,
 * or totals. All values come dynamically from monday.com.
 *
 * Business logic preserved:
 *   The data prop contains ONLY resources in the AEP In-Progress onboarding
 *   state, filtered and aggregated by the existing backend service
 *   (aggregateProactiveByProject). This component never re-filters.
 *
 * Layout:
 *   Header card  (title + description | total KPI)
 *   Three columns: donut chart | horizontal bar chart | breakdown table
 *   Summary cards: auto-fit grid, one card per project
 */

import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ChartDataPoint } from '../../../services/portfolioAnalyticsService'
import styles from './ProactiveCountTab.module.scss'

// ─── Color palette ─────────────────────────────────────────────────────────────
// Consistent index-based assignment so the same rank always gets the same color.
const PROJECT_COLORS = [
  '#c8102e', // red        — rank 1 (largest)
  '#1d3557', // dark navy  — rank 2
  '#4a90d9', // blue       — rank 3
  '#e88fa0', // pink/coral — rank 4
  '#2a9d8f', // teal       — rank 5
  '#e9c46a', // gold       — rank 6
  '#f4a261', // orange     — rank 7
  '#457b9d', // steel blue — rank 8
  '#6d6875', // muted purple
  '#b5838d', // rose
  '#264653', // dark teal
  '#0d6efd', // bright blue
  '#198754', // green
  '#6610f2', // violet
]

function getColor(index: number): string {
  return PROJECT_COLORS[index % PROJECT_COLORS.length]
}

// ─── Derived entry type ────────────────────────────────────────────────────────

interface ProjectEntry {
  label: string
  value: number
  percent: number  // 0-100
  color: string
  rank: number
}

function buildEntries(data: ChartDataPoint[], total: number): ProjectEntry[] {
  // Backend already sorts descending; re-sort defensively
  return [...data]
    .sort((a, b) => b.value - a.value)
    .map((d, i) => ({
      label:   d.label,
      value:   d.value,
      percent: total > 0 ? (d.value / total) * 100 : 0,
      color:   getColor(i),
      rank:    i + 1,
    }))
}

// ─── Tooltip ───────────────────────────────────────────────────────────────────

function ProactiveTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const e: ProjectEntry = payload[0].payload
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDot} style={{ background: e.color }} />
      <div>
        <p className={styles.tooltipName}>{e.label}</p>
        <p className={styles.tooltipValue}>{e.value} proactive resource{e.value !== 1 ? 's' : ''}</p>
        <p className={styles.tooltipPct}>{e.percent.toFixed(0)}% of total</p>
      </div>
    </div>
  )
}

// ─── Donut chart ───────────────────────────────────────────────────────────────

function DonutChart({
  entries,
  total,
  active,
  onHover,
  onClick,
}: {
  entries: ProjectEntry[]
  total: number
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  // IMPORTANT: do NOT pass label={DonutOuterLabel} — Recharts v3 passes `percent`
  // as 0–1 decimal, but our ProjectEntry.percent is already 0–100, so the label
  // renderer produces "3333%" / "6667%" instead of "33%" / "67%".
  // The legend below the donut already identifies every segment.
  const pieData = entries.map(e => ({
    name:       e.label,
    label:      e.label,
    value:      e.value,
    color:      e.color,
    rank:       e.rank,
    pctDisplay: e.percent, // safe for tooltip — never touched by Recharts label
  }))

  return (
    <div className={styles.donutSection}>
      <h3 className={styles.sectionTitle}>Share of proactive resources</h3>

      <div className={styles.donutWrapper}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={100}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              onMouseEnter={(_: any, i: number) => onHover(pieData[i].label)}
              onMouseLeave={() => onHover(null)}
              onClick={(_: any, i: number) => onClick(pieData[i].label)}
              style={{ cursor: 'pointer' }}
            >
              {pieData.map((entry, i) => {
                const isActive = active === null || active === entry.name
                return (
                  <Cell
                    key={`cell-${i}`}
                    fill={entry.color}
                    opacity={isActive ? 1 : 0.25}
                    stroke="none"
                  />
                )
              })}
            </Pie>
            <Tooltip content={<ProactiveTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div className={styles.donutCenter} aria-hidden="true">
          <span className={styles.donutTotal}>{total}</span>
          <span className={styles.donutCenterLine}>Total</span>
          <span className={styles.donutCenterLine}>Resources</span>
        </div>
      </div>

      {/* Legend — dot + label below the donut */}
      <div className={styles.donutLegend}>
        {entries.map(e => {
          const isActive = active === null || active === e.label
          return (
            <button
              key={e.label}
              className={`${styles.legendItem} ${!isActive ? styles.legendItemDim : ''}`}
              onClick={() => onClick(e.label)}
              onMouseEnter={() => onHover(e.label)}
              onMouseLeave={() => onHover(null)}
              aria-label={`${e.label}: ${e.value} proactive resources`}
            >
              <span className={styles.legendDot} style={{ background: e.color }} />
              <span className={styles.legendText}>{e.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Horizontal bar chart ──────────────────────────────────────────────────────

function HorizontalBarChart({
  entries,
  active,
  onHover,
  onClick,
}: {
  entries: ProjectEntry[]
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  const maxVal = entries[0]?.value ?? 0

  return (
    <div className={styles.barSection}>
      <h3 className={styles.sectionTitle}>Proactive resources by project</h3>

      <div className={styles.barList}>
        {entries.map(e => {
          const isActive = active === null || active === e.label
          const fillPct  = maxVal > 0 ? (e.value / maxVal) * 100 : 0
          return (
            <div
              key={e.label}
              className={`${styles.barRow} ${!isActive ? styles.barRowDim : ''}`}
              onMouseEnter={() => onHover(e.label)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onClick(e.label)}
              role="button"
              tabIndex={0}
              aria-label={`${e.label}: ${e.value} proactive resource${e.value !== 1 ? 's' : ''}, ${e.percent.toFixed(0)}% of total`}
              onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') onClick(e.label) }}
            >
              <span className={styles.barLabel}>{e.label}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${fillPct}%`,
                    background: e.color,
                    opacity: isActive ? 1 : 0.28,
                  }}
                />
              </div>
              <span className={styles.barCount} style={{ color: e.color }}>{e.value}</span>
            </div>
          )
        })}
      </div>

      {/* X-axis */}
      {maxVal > 0 && (
        <>
          <div className={styles.xAxisRow}>
            {(() => {
              const ticks: number[] = []
              const step = Math.max(1, Math.ceil(maxVal / 4))
              for (let v = 0; v <= maxVal + step; v += step) ticks.push(v)
              return ticks.map(t => <span key={t} className={styles.xTick}>{t}</span>)
            })()}
          </div>
          <p className={styles.xAxisLabel}>Number of proactive resources</p>
        </>
      )}
    </div>
  )
}

// ─── Project breakdown table ───────────────────────────────────────────────────

function BreakdownTable({
  entries,
  active,
  onHover,
  onClick,
}: {
  entries: ProjectEntry[]
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  return (
    <div className={styles.tableSection}>
      <h3 className={styles.sectionTitle}>Project breakdown</h3>
      <table className={styles.table} aria-label="Proactive resource project breakdown">
        <thead>
          <tr>
            <th className={styles.thHash}>#</th>
            <th className={styles.thProject}>Project</th>
            <th className={styles.thCount}>Proactive Resources</th>
            <th className={styles.thPct}>% of Total</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(e => {
            const isActive = active === null || active === e.label
            return (
              <tr
                key={e.label}
                className={`${styles.tableRow} ${!isActive ? styles.tableRowDim : ''} ${active === e.label ? styles.tableRowActive : ''}`}
                onMouseEnter={() => onHover(e.label)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onClick(e.label)}
                style={{ cursor: 'pointer' }}
              >
                <td className={styles.tdRank}>
                  <span
                    className={styles.rankBadge}
                    style={{ background: e.color + '22', color: e.color }}
                  >
                    {e.rank}
                  </span>
                </td>
                <td className={styles.tdProject}>{e.label}</td>
                <td className={styles.tdCount}>{e.value}</td>
                <td className={styles.tdPct}>{e.percent.toFixed(0)}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Summary cards — matches DeliveryModelTab KpiCards exactly ──────────────────
// kpiGrid → kpiCard → kpiHeader (icon + label) / kpiBody (count + badge + ghost circle)

function SummaryCards({
  entries,
  active,
  onHover,
  onClick,
}: {
  entries: ProjectEntry[]
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  return (
    <div className={styles.kpiGrid}>
      {entries.map(e => {
        const isActive = active === null || active === e.label
        return (
          <div
            key={e.label}
            className={`${styles.kpiCard} ${!isActive ? styles.kpiCardDim : ''} ${active === e.label ? styles.kpiCardActive : ''}`}
            style={{ background: e.color + '18' }}
            onMouseEnter={() => onHover(e.label)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(e.label)}
            role="button"
            tabIndex={0}
            aria-label={`${e.label}: ${e.value} proactive resource${e.value !== 1 ? 's' : ''}, ${e.percent.toFixed(0)}% of total`}
            onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') onClick(e.label) }}
          >
            {/* Header: people icon + project name */}
            <div className={styles.kpiHeader}>
              <svg
                className={styles.kpiIcon}
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ color: e.color }}
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className={styles.kpiLabel} style={{ color: e.color }}>
                {e.label}
              </span>
            </div>

            {/* Body: large count + percentage pill + ghost circle */}
            <div className={styles.kpiBody}>
              <span className={styles.kpiCount}>{e.value}</span>
              <div className={styles.kpiMeta}>
                <span
                  className={styles.kpiPctBadge}
                  style={{ background: e.color + '22', color: e.color }}
                >
                  {e.percent.toFixed(0)}% of total
                </span>
              </div>
              <span
                className={styles.kpiGhostCircle}
                style={{ background: e.color + '18', color: e.color }}
                aria-hidden="true"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyProactive() {
  return (
    <div className={styles.emptyState}>
      <svg width="48" height="42" viewBox="0 0 48 42" fill="none" aria-hidden="true" className={styles.emptyIcon}>
        <circle cx="18" cy="11" r="8" stroke="#aeaeb2" strokeWidth="2"/>
        <path d="M3 38c0-8.284 6.716-15 15-15s15 6.716 15 38" stroke="#aeaeb2" strokeWidth="2"/>
        <circle cx="35" cy="12" r="6" stroke="#aeaeb2" strokeWidth="1.7" opacity="0.55"/>
        <path d="M33 38c0-6.075 1.567-11 3.5-11s3.5 4.925 3.5 11" stroke="#aeaeb2" strokeWidth="1.7" opacity="0.55"/>
      </svg>
      <p className={styles.emptyTitle}>No proactive resources currently in AEP In-Progress onboarding.</p>
      <p className={styles.emptySubtitle}>0 Total proactive resources</p>
    </div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

interface ProactiveCountTabProps {
  /** Proactive-only data: ChartDataPoint[] sorted descending by the backend  */
  data: ChartDataPoint[]
  /**
   * Total proactive resource count.
   * NOTE: analytics.totalRecords is the TOTAL active resource count across all
   * projects — NOT the proactive subset. We therefore compute our own sum from
   * the chart data so the total always reflects the proactive count only.
   */
}

export default function ProactiveCountTab({ data }: ProactiveCountTabProps) {
  const [active, setActive] = useState<string | null>(null)

  // Compute the proactive-specific total from the chart data itself
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const entries = buildEntries(data, total)

  function handleHover(label: string | null) { setActive(label) }
  function handleClick(label: string) { setActive(prev => prev === label ? null : label) }

  return (
    <div className={styles.container}>

      {/* ── Header card ─────────────────────────────────────────── */}
      <div className={styles.headerCard}>
        <div className={styles.headerLeft}>
          <h2 className={styles.headerTitle}>Proactive Resources by Project</h2>
          <p className={styles.headerDesc}>
            Resources currently in the AEP In-Progress onboarding state, grouped by project.
          </p>
        </div>
        <div className={styles.headerRight}>
          <svg
            className={styles.headerIcon}
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1d3557"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <div className={styles.headerTotalBlock}>
            <span className={styles.headerTotalNum}>{total}</span>
            <span className={styles.headerTotalLabel}>Total proactive{'\u00A0'}resources</span>
          </div>
        </div>
      </div>

      {/* ── Three-column analytics row ──────────────────────────── */}
      {entries.length === 0 ? (
        <EmptyProactive />
      ) : (
        <>
          <div className={styles.analyticsRow}>
            <DonutChart
              entries={entries}
              total={total}
              active={active}
              onHover={handleHover}
              onClick={handleClick}
            />
            <HorizontalBarChart
              entries={entries}
              active={active}
              onHover={handleHover}
              onClick={handleClick}
            />
            <BreakdownTable
              entries={entries}
              active={active}
              onHover={handleHover}
              onClick={handleClick}
            />
          </div>

          {/* ── KPI summary cards ────────────────────────────────── */}
          <SummaryCards
            entries={entries}
            active={active}
            onHover={handleHover}
            onClick={handleClick}
          />
        </>
      )}
    </div>
  )
}
