/**
 * MonthlyResourceCountTab
 *
 * Redesigned "Monthly Resource Count" dashboard tab.
 *
 * Consumes the `monthly-resource-count` chart data from the existing monday.com
 * integration (aggregateByMonth — active resources with a valid startDate,
 * bucketed into the last 3 calendar months).
 *
 * Does NOT fetch data. Does NOT hardcode month names, counts, percentages,
 * or totals. All values come dynamically from monday.com.
 *
 * Layout (matches reference image):
 *   One large white card containing:
 *     - Header row:    title + description | KPI (total + icon)
 *     - Three columns: vertical bar chart | donut chart | breakdown table
 *     - Summary cards: one card per month (chronological, oldest → newest)
 */

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
} from 'recharts'
import type { ChartDataPoint } from '../../../services/portfolioAnalyticsService'
import styles from './MonthlyResourceCountTab.module.scss'

// ─── Color palette ──────────────────────────────────────────────────────────────
// Position-based: oldest month → red, middle → dark navy, newest → medium blue.
// Applied consistently across bar chart, donut, table badges, and summary cards.
const MONTH_COLORS = ['#c8102e', '#1d3557', '#4a90d9']

function getMonthColor(index: number): string {
  return MONTH_COLORS[index % MONTH_COLORS.length]
}

// ─── Derived entry ─────────────────────────────────────────────────────────────

interface MonthEntry {
  label: string
  value: number
  percent: number      // 0–100
  color: string
  chronoIndex: number  // original position (0 = oldest)
}

function buildEntries(data: ChartDataPoint[], total: number): MonthEntry[] {
  return data.map((d, i) => ({
    label:       d.label,
    value:       d.value,
    percent:     total > 0 ? (d.value / total) * 100 : 0,
    color:       getMonthColor(i),
    chronoIndex: i,
  }))
}

// ─── Custom bar tooltip ─────────────────────────────────────────────────────────

function BarTooltip({ active, payload, label, entriesByLabel }: any) {
  if (!active || !payload?.length) return null
  const entry: MonthEntry | undefined = entriesByLabel?.[label]
  const value   = payload[0].value as number
  const percent = entry?.percent?.toFixed(0) ?? '0'
  const color   = entry?.color ?? '#1d3557'
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDot} style={{ background: color }} />
      <div>
        <p className={styles.tooltipName}>{label}</p>
        <p className={styles.tooltipValue}>{value} active resource{value !== 1 ? 's' : ''}</p>
        <p className={styles.tooltipPct}>{percent}% of total</p>
      </div>
    </div>
  )
}

// ─── Custom donut tooltip ───────────────────────────────────────────────────────

function DonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const e: MonthEntry = payload[0].payload
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

// ─── Vertical bar chart ─────────────────────────────────────────────────────────

function VerticalBarChart({
  entries,
  active,
  onHover,
  onClick,
}: {
  entries: MonthEntry[]
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  const entriesByLabel = Object.fromEntries(entries.map(e => [e.label, e]))
  const barData = entries.map(e => ({ label: e.label, value: e.value }))

  return (
    <div className={styles.barSection}>
      <h3 className={styles.sectionTitle}>Active resources by start month</h3>
      <div className={styles.barChartWrapper}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={barData}
            margin={{ top: 24, right: 12, left: -8, bottom: 4 }}
            onMouseLeave={() => onHover(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#3a3a3c' }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6e6e73' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={28}
            />
            <Tooltip
              content={<BarTooltip entriesByLabel={entriesByLabel} />}
              cursor={{ fill: 'rgba(200,16,46,0.06)' }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              maxBarSize={64}
              onMouseEnter={(_: any, index: number) => onHover(entries[index]?.label ?? null)}
              onMouseLeave={() => onHover(null)}
              onClick={(_: any, index: number) => onClick(entries[index]?.label ?? '')}
              style={{ cursor: 'pointer' }}
            >
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontSize: 12, fontWeight: 700, fill: '#1f2328' }}
              />
              {entries.map((e, i) => (
                <Cell
                  key={i}
                  fill={e.color}
                  opacity={active === null || active === e.label ? 1 : 0.25}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Donut chart ────────────────────────────────────────────────────────────────

const RADIAN = Math.PI / 180

function OuterLabel({ cx, cy, midAngle, outerRadius, percent, fill }: any) {
  if (percent < 0.04) return null
  const LINE   = 18
  const OFFSET = 5
  const sin    = Math.sin(-midAngle * RADIAN)
  const cos    = Math.cos(-midAngle * RADIAN)
  const sx     = cx + (outerRadius + 3)  * cos
  const sy     = cy + (outerRadius + 3)  * sin
  const ex     = cx + (outerRadius + LINE) * cos
  const ey     = cy + (outerRadius + LINE) * sin
  const tx     = ex + (cos >= 0 ? OFFSET : -OFFSET)
  return (
    <g>
      <path d={`M${sx},${sy}L${ex},${ey}`} stroke={fill} strokeWidth={1.4} fill="none" />
      <circle cx={ex} cy={ey} r={3} fill={fill} />
      <text
        x={tx} y={ey}
        textAnchor={cos >= 0 ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={11}
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
  entries: MonthEntry[]
  total: number
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  return (
    <div className={styles.donutSection}>
      <h3 className={styles.sectionTitle}>Share of active resources</h3>

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
              outerRadius={96}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              label={OuterLabel}
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
            <Tooltip content={<DonutTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div className={styles.donutCenter} aria-hidden="true">
          <span className={styles.donutTotal}>{total}</span>
          <span className={styles.donutCenterLine}>Total</span>
          <span className={styles.donutCenterLine}>Resources</span>
        </div>
      </div>

      {/* Legend */}
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
// Sorted descending by value (ties broken by chronological order) for ranking.

function BreakdownTable({
  entries,
  active,
  onHover,
  onClick,
}: {
  entries: MonthEntry[]
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  const sorted = [...entries].sort((a, b) => b.value - a.value || a.chronoIndex - b.chronoIndex)

  return (
    <div className={styles.tableSection}>
      <h3 className={styles.sectionTitle}>Monthly resource count breakdown</h3>
      <table className={styles.table} aria-label="Monthly resource count breakdown">
        <thead>
          <tr>
            <th className={styles.thHash}>#</th>
            <th className={styles.thMonth}>Start Month</th>
            <th className={styles.thRes}>Resources</th>
            <th className={styles.thPct}>% of Total</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((e, rowIdx) => {
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
                    {rowIdx + 1}
                  </span>
                </td>
                <td className={styles.tdMonth}>{e.label}</td>
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

// ─── Summary cards ──────────────────────────────────────────────────────────────

function SummaryCards({
  entries,
  active,
  onHover,
  onClick,
}: {
  entries: MonthEntry[]
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
            className={`${styles.card} ${!isActive ? styles.cardDim : ''} ${active === e.label ? styles.cardActive : ''}`}
            style={{ background: e.color + '0d', borderTop: `3px solid ${e.color}` }}
            onMouseEnter={() => onHover(e.label)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(e.label)}
            role="button"
            tabIndex={0}
            aria-label={`${e.label}: ${e.value} resource${e.value !== 1 ? 's' : ''}, ${e.percent.toFixed(0)}% of total`}
            onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') onClick(e.label) }}
          >
            {/* Calendar icon + month label */}
            <div className={styles.cardTop}>
              <span
                className={styles.cardIcon}
                style={{ background: e.color, color: '#fff' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="1.5" y="3" width="13" height="11.5" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                  <path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M5 1.5v3M11 1.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </span>
              <span className={styles.cardMonthName}>{e.label}</span>
            </div>

            {/* Count + badge + ghost people icon */}
            <div className={styles.cardBottom}>
              <span className={styles.cardCount}>{e.value}</span>
              <span
                className={styles.cardPct}
                style={{ background: e.color + '28', color: e.color }}
              >
                {e.percent.toFixed(0)}% of total
              </span>
              {/* Compact circular icon — same style as Delivery Model / Monthly Onboarding page cards */}
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
      <p className={styles.emptyTitle}>No active resources with a recorded start date in the last 3 months.</p>
      <p className={styles.emptySubtitle}>0 Total active resources</p>
    </div>
  )
}

// ─── Main export ────────────────────────────────────────────────────────────────

interface MonthlyResourceCountTabProps {
  /** ChartDataPoint[] from aggregateByMonth — 3 items, chronological order */
  data: ChartDataPoint[]
}

export default function MonthlyResourceCountTab({ data }: MonthlyResourceCountTabProps) {
  const [active, setActive] = useState<string | null>(null)

  const total   = data.reduce((s, d) => s + d.value, 0)
  const entries = buildEntries(data, total)
  const hasData = entries.some(e => e.value > 0)

  function handleHover(label: string | null) { setActive(label) }
  function handleClick(label: string) { setActive(prev => prev === label ? null : label) }

  return (
    <div className={styles.outerCard}>

      {/* ── Header row ─────────────────────────────────────── */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h2 className={styles.headerTitle}>
            Active Resources by Start Month (Last 3 Months)
          </h2>
          <p className={styles.headerDesc}>
            Active resources with a recorded start date, bucketed by start month over the last 3 months.
          </p>
        </div>

        {/* KPI box */}
        <div className={styles.kpiBox}>
          {/* People icon — Feather/Lucide "users" style, matches Monthly Onboarding page */}
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
            <span className={styles.kpiLabel}>Total active{'\u00A0'}resources</span>
          </div>
        </div>
      </div>

      {/* ── Three-column analytics row ──────────────────────── */}
      {!hasData ? (
        <EmptyState />
      ) : (
        <>
          <div className={styles.analyticsRow}>
            <VerticalBarChart
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
            <BreakdownTable
              entries={entries}
              active={active}
              onHover={handleHover}
              onClick={handleClick}
            />
          </div>

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
