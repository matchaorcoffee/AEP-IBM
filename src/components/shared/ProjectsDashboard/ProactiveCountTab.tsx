/**
 * ProactiveCountTab
 *
 * Redesigned "Proactive Count by Project" dashboard tab.
 *
 * Receives data already fetched from monday.com via the existing hook/service.
 * Does NOT fetch data. Does NOT hardcode project names, counts, percentages,
 * or totals. All values come dynamically from monday.com.
 *
 * Layout (matches reference image):
 *   One large white card containing:
 *     - Header row:  title + description | KPI (total + icon)
 *     - Two-column:  horizontal bar chart (left) | donut chart (right)
 *     - Full-width:  project breakdown table
 *     - Card grid:   project summary cards
 *
 * Business logic preserved:
 *   The data prop contains ONLY resources in the AEP In-Progress onboarding
 *   state, filtered and aggregated by the existing backend service
 *   (aggregateProactiveByProject).  This component never re-filters.
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

// ─── Shared tooltip ────────────────────────────────────────────────────────────

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
      <div className={styles.xAxisRow}>
        {maxVal > 0 && (() => {
          const ticks: number[] = []
          const step = Math.max(1, Math.ceil(maxVal / 4))
          for (let v = 0; v <= maxVal + step; v += step) {
            if (v > maxVal + step) break
            ticks.push(v)
          }
          return ticks.map(t => (
            <span key={t} className={styles.xTick}>{t}</span>
          ))
        })()}
      </div>
      <p className={styles.xAxisLabel}>Number of proactive resources</p>
    </div>
  )
}

// ─── Donut chart ───────────────────────────────────────────────────────────────

// Render percentage labels outside the donut, connected by a small line
// (matching the reference image style)
const RADIAN = Math.PI / 180

function DonutOuterLabel({
  cx, cy, midAngle, outerRadius, percent, name, fill,
}: any) {
  if (percent < 0.04) return null

  const LINE_LENGTH = 20
  const TEXT_OFFSET = 6

  const sin = Math.sin(-midAngle * RADIAN)
  const cos = Math.cos(-midAngle * RADIAN)

  // Start of line (on the outer edge of the donut)
  const sx = cx + (outerRadius + 4) * cos
  const sy = cy + (outerRadius + 4) * sin
  // End of line
  const ex = cx + (outerRadius + LINE_LENGTH) * cos
  const ey = cy + (outerRadius + LINE_LENGTH) * sin
  // Text anchor
  const textX = ex + (cos >= 0 ? TEXT_OFFSET : -TEXT_OFFSET)
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <path d={`M${sx},${sy}L${ex},${ey}`} stroke={fill} strokeWidth={1.5} fill="none" />
      <circle cx={ex} cy={ey} r={3} fill={fill} />
      <text
        x={textX}
        y={ey}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
        fill={fill}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  )
}

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
  return (
    <div className={styles.donutSection}>
      <h3 className={styles.sectionTitle}>Proactive resource share</h3>

      <div className={styles.donutWrapper}>
        <ResponsiveContainer width="70%" height={260}>
          <PieChart>
            <Pie
              data={entries}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={108}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              label={DonutOuterLabel}
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
            <Tooltip content={<ProactiveTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Floating centre label */}
        <div className={styles.donutCenter} aria-hidden="true">
          <span className={styles.donutTotal}>{total}</span>
          <span className={styles.donutCenterLine}>Total</span>
          <span className={styles.donutCenterLine}>Resources</span>
        </div>

        {/* Legend — right of donut */}
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

// ─── Summary cards ─────────────────────────────────────────────────────────────

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
    <div className={styles.cardsGrid}>
      {entries.map(e => {
        const isActive = active === null || active === e.label
        return (
          <div
            key={e.label}
            className={`${styles.summaryCard} ${!isActive ? styles.cardDim : ''} ${active === e.label ? styles.cardActive : ''}`}
            style={{ borderTop: `3px solid ${e.color}` }}
            onMouseEnter={() => onHover(e.label)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(e.label)}
            role="button"
            tabIndex={0}
            aria-label={`${e.label}: ${e.value} proactive resources, ${e.percent.toFixed(0)}% of total`}
            onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') onClick(e.label) }}
          >
            {/* Icon + name */}
            <div className={styles.cardHeader}>
              <span
                className={styles.cardIcon}
                style={{ background: e.color + '1a', color: e.color }}
              >
                {/* Document icon */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
                  <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M5.5 7.5h5M5.5 10h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className={styles.cardName}>{e.label}</span>
            </div>

            {/* Count + percentage + ghost icon */}
            <div className={styles.cardBody}>
              <span className={styles.cardCount}>{e.value}</span>
              <div className={styles.cardMeta}>
                <span
                  className={styles.cardPct}
                  style={{ background: e.color + '22', color: e.color }}
                >
                  {e.percent.toFixed(0)}% of total
                </span>
              </div>
              {/* Compact circular icon — same style as Delivery Model page cards */}
              <span
                className={styles.cardGhostCircle}
                style={{ background: e.color + '18', color: e.color }}
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
                  aria-hidden="true"
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
      {/* People icon */}
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
   * projects — NOT the proactive subset.  We therefore compute our own sum from
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
    <div className={styles.card}>

      {/* ── Header row ────────────────────────────────────────── */}
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.headerTitle}>Proactive Resources by Project</h2>
          <p className={styles.headerDesc}>
            Resources currently in the AEP In-Progress onboarding state, grouped by project.
          </p>
        </div>
        <div className={styles.kpiBox}>
          {/* People icon — Feather/Lucide "users" style, matches Delivery Model page */}
          <svg
            className={styles.kpiIcon}
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
          <div className={styles.kpiNumbers}>
            <span className={styles.kpiTotal}>{total}</span>
            <span className={styles.kpiLabel}>Total proactive{'\u00A0'}resources</span>
          </div>
        </div>
      </div>

      {/* ── Main charts row (50 / 50) ─────────────────────────── */}
      {entries.length === 0 ? (
        <EmptyProactive />
      ) : (
        <>
          <div className={styles.chartsRow}>
            <HorizontalBarChart
              entries={entries}
              active={active}
              onHover={handleHover}
              onClick={handleClick}
            />
            <DonutChart
              entries={entries}
              total={total}
              active={active}
              onHover={handleHover}
              onClick={handleClick}
            />
          </div>

          {/* ── Project breakdown table ───────────────────────── */}
          <BreakdownTable
            entries={entries}
            active={active}
            onHover={handleHover}
            onClick={handleClick}
          />

          {/* ── Summary cards ─────────────────────────────────── */}
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
