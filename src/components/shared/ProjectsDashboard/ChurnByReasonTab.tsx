/**
 * ChurnByReasonTab
 *
 * Redesigned "Resource Churn By Reason" / "Monthly Offboarding" dashboard tab.
 *
 * Consumes the `churn-by-reason` chart data from the existing monday.com
 * integration (aggregateChurnByReason — rolled-off resources from the last
 * 3 calendar months, grouped by Offboarding Reason field).
 *
 * Does NOT fetch data. Does NOT hardcode reason names, counts, percentages,
 * or totals. All values come dynamically from monday.com.
 *
 * Layout (matches reference image):
 *   One large white card containing:
 *     - Header row:    title + description | KPI (total + icon)
 *     - Three columns: horizontal bar chart | donut chart | breakdown table
 *     - Summary cards: one card per offboarding reason
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
import styles from './ChurnByReasonTab.module.scss'

// ─── Color palette ─────────────────────────────────────────────────────────────
// Index-based assignment, consistent across all sub-components.
const REASON_COLORS = [
  '#c8102e', // red        — rank 1
  '#1d3557', // dark navy  — rank 2
  '#4a90d9', // blue       — rank 3
  '#2a9d8f', // teal       — rank 4
  '#e9c46a', // gold       — rank 5
  '#f4a261', // orange     — rank 6
  '#457b9d', // steel blue — rank 7
  '#6d6875', // muted purple
  '#b5838d', // rose
  '#264653', // dark teal
  '#0d6efd', // bright blue
  '#198754', // green
  '#6610f2', // violet
]

function getColor(index: number): string {
  return REASON_COLORS[index % REASON_COLORS.length]
}

// ─── Derived entry ─────────────────────────────────────────────────────────────

interface ReasonEntry {
  label: string
  value: number
  percent: number   // 0-100
  color: string
  rank: number
}

function buildEntries(data: ChartDataPoint[], total: number): ReasonEntry[] {
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

// ─── Shared tooltip ─────────────────────────────────────────────────────────────

function ReasonTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const e: ReasonEntry = payload[0].payload
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDot} style={{ background: e.color }} />
      <div>
        <p className={styles.tooltipName}>{e.label}</p>
        <p className={styles.tooltipValue}>{e.value} resource{e.value !== 1 ? 's' : ''}</p>
        <p className={styles.tooltipPct}>{e.percent.toFixed(0)}% of total</p>
      </div>
    </div>
  )
}

// ─── Horizontal bar chart ───────────────────────────────────────────────────────

function HorizontalBarChart({
  entries,
  active,
  onHover,
  onClick,
}: {
  entries: ReasonEntry[]
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  const maxVal = entries[0]?.value ?? 0

  return (
    <div className={styles.barSection}>
      <h3 className={styles.sectionTitle}>Rolled-off resources by reason</h3>

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
              aria-label={`${e.label}: ${e.value} resource${e.value !== 1 ? 's' : ''}, ${e.percent.toFixed(0)}%`}
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
              const step = Math.max(1, Math.ceil(maxVal / 4))
              const ticks: number[] = []
              for (let v = 0; v <= maxVal + step; v += step) ticks.push(v)
              return ticks.map(t => <span key={t} className={styles.xTick}>{t}</span>)
            })()}
          </div>
          <p className={styles.xAxisLabel}>Number of resources</p>
        </>
      )}
    </div>
  )
}

// ─── Donut chart ────────────────────────────────────────────────────────────────

function DonutChart({
  entries,
  total,
  active,
  onHover,
  onClick,
}: {
  entries: ReasonEntry[]
  total: number
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  return (
    <div className={styles.donutSection}>
      <h3 className={styles.sectionTitle}>Share of rolled-off resources</h3>

      <div className={styles.donutWrapper}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={entries}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={100}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              onMouseEnter={(_: any, i: number) => onHover(entries[i].label)}
              onMouseLeave={() => onHover(null)}
              onClick={(_: any, i: number) => onClick(entries[i].label)}
              style={{ cursor: 'pointer' }}
            >
              {entries.map((e, i) => (
                <Cell
                  key={i}
                  fill={e.color}
                  opacity={active === null || active === e.label ? 1 : 0.25}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<ReasonTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Floating centre label */}
        <div className={styles.donutCenter} aria-hidden="true">
          <span className={styles.donutTotal}>{total}</span>
          <span className={styles.donutCenterLine}>Total</span>
          <span className={styles.donutCenterLine}>Resources</span>
        </div>
      </div>

      {/* Horizontal legend below donut */}
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
              aria-label={`${e.label}: ${e.value} resources`}
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

// ─── Breakdown table ────────────────────────────────────────────────────────────

function BreakdownTable({
  entries,
  active,
  onHover,
  onClick,
}: {
  entries: ReasonEntry[]
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  return (
    <div className={styles.tableSection}>
      <h3 className={styles.sectionTitle}>Offboarding reason breakdown</h3>
      <table className={styles.table} aria-label="Offboarding reason breakdown">
        <thead>
          <tr>
            <th className={styles.thHash}>#</th>
            <th className={styles.thReason}>Offboarding Reason</th>
            <th className={styles.thRes}>Resources</th>
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
                <td className={styles.tdReason}>{e.label}</td>
                <td className={styles.tdRes}>{e.value}</td>
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

function SummaryCards({
  entries,
  active,
  onHover,
  onClick,
}: {
  entries: ReasonEntry[]
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
            aria-label={`${e.label}: ${e.value} resource${e.value !== 1 ? 's' : ''}, ${e.percent.toFixed(0)}% of total`}
            onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') onClick(e.label) }}
          >
            {/* Header: people icon + reason name */}
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

// ─── Empty state ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <svg width="52" height="44" viewBox="0 0 52 44" fill="none" className={styles.emptyIcon} aria-hidden="true">
        <circle cx="20" cy="12" r="9" stroke="#aeaeb2" strokeWidth="2"/>
        <path d="M3 40c0-9.389 7.611-17 17-17s17 7.611 17 40" stroke="#aeaeb2" strokeWidth="2"/>
        <circle cx="39" cy="13" r="6.5" stroke="#aeaeb2" strokeWidth="1.7" opacity="0.55"/>
        <path d="M37 40c0-6.627 1.343-12 3-12s3 5.373 3 12" stroke="#aeaeb2" strokeWidth="1.7" opacity="0.55"/>
      </svg>
      <p className={styles.emptyTitle}>No resources were rolled off in the last 3 months.</p>
      <p className={styles.emptySubtitle}>0 Total rolled-off resources</p>
    </div>
  )
}

// ─── Main export ────────────────────────────────────────────────────────────────

interface ChurnByReasonTabProps {
  /** ChartDataPoint[] from aggregateChurnByReason — sorted descending by backend */
  data: ChartDataPoint[]
}

export default function ChurnByReasonTab({ data }: ChurnByReasonTabProps) {
  const [active, setActive] = useState<string | null>(null)

  // Derive total from the data itself (not analytics.totalRecords which is active
  // resource count, not churn count)
  const total   = data.reduce((s, d) => s + d.value, 0)
  const entries = buildEntries(data, total)

  function handleHover(label: string | null) { setActive(label) }
  function handleClick(label: string) { setActive(prev => prev === label ? null : label) }

  return (
    <div className={styles.container}>

      {/* ── Header card — matches DeliveryModelTab headerCard ── */}
      <div className={styles.headerCard}>
        <div className={styles.headerLeft}>
          <h2 className={styles.headerTitle}>
            Rolled-Off Resources by Reason (Last 3 Months)
          </h2>
          <p className={styles.headerDesc}>
            Rolled-off resources over the last 3 months, grouped by offboarding reason.
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
            <span className={styles.headerTotalLabel}>Total rolled-off resources</span>
          </div>
        </div>
      </div>

      {/* ── Three-column analytics row ──────────────────────── */}
      {entries.length === 0 ? (
        <EmptyState />
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

          {/* ── KPI summary cards ──────────────────────────────── */}
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
