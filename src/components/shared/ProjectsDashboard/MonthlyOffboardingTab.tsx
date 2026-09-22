/**
 * MonthlyOffboardingTab
 *
 * Redesigned "Monthly Offboarding" dashboard tab.
 *
 * Consumes the `monthly-offboarding` chart data from the existing monday.com
 * integration (aggregateByMonth — resources with onboardingStatus "rolled-off"
 * from the last 3 calendar months, bucketed by offboardingDate).
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
import styles from './MonthlyOffboardingTab.module.scss'

// ─── Color palette ──────────────────────────────────────────────────────────────
// Position-based: oldest month → red, middle → dark navy, newest → medium blue.
// Colors are consistent across bar chart, donut, table badges, and summary cards.
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
        <p className={styles.tooltipValue}>{value} resource{value !== 1 ? 's' : ''}</p>
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
      <h3 className={styles.sectionTitle}>Offboarded resources by month</h3>
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
      <h3 className={styles.sectionTitle}>Share of offboarded resources</h3>

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
  // Sort by value descending for the table ranking; ties broken by chrono order
  const sorted = [...entries].sort((a, b) => b.value - a.value || a.chronoIndex - b.chronoIndex)

  return (
    <div className={styles.tableSection}>
      <h3 className={styles.sectionTitle}>Monthly offboarding breakdown</h3>
      <table className={styles.table} aria-label="Monthly offboarding breakdown">
        <thead>
          <tr>
            <th className={styles.thHash}>#</th>
            <th className={styles.thMonth}>Month</th>
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

// ─── Summary cards — matches DeliveryModelTab KpiCards exactly ──────────────────

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
            {/* Header: people icon + month label */}
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
      <p className={styles.emptyTitle}>No resources were offboarded in the last 3 months.</p>
      <p className={styles.emptySubtitle}>0 Total offboarded resources</p>
    </div>
  )
}

// ─── Main export ────────────────────────────────────────────────────────────────

interface MonthlyOffboardingTabProps {
  /** ChartDataPoint[] from aggregateByMonth — 3 items, chronological order */
  data: ChartDataPoint[]
}

export default function MonthlyOffboardingTab({ data }: MonthlyOffboardingTabProps) {
  const [active, setActive] = useState<string | null>(null)

  const total   = data.reduce((s, d) => s + d.value, 0)
  const entries = buildEntries(data, total)
  const hasData = entries.some(e => e.value > 0)

  function handleHover(label: string | null) { setActive(label) }
  function handleClick(label: string) { setActive(prev => prev === label ? null : label) }

  return (
    <div className={styles.container}>

      {/* ── Header card ────────────────────────────────────── */}
      <div className={styles.headerCard}>
        <div className={styles.headerLeft}>
          <h2 className={styles.headerTitle}>
            Monthly Offboarding (Last 3 Months)
          </h2>
          <p className={styles.headerDesc}>
            Resources offboarded (rolled-off) per month over the last 3 months.
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
            <span className={styles.headerTotalLabel}>Total offboarded resources</span>
          </div>
        </div>
      </div>

      {/* ── Three-column analytics row ──────────────────────── */}
      {!hasData ? (
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
            <VerticalBarChart
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
