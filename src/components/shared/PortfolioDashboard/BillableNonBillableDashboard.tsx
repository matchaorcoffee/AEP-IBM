import React, { useState, useMemo, useEffect } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'
import type { ChartDataPoint } from '../../../services/portfolioAnalyticsService'
import styles from './PortfolioDashboard.module.scss'

// ─── Color System ─────────────────────────────────────────────────────────────
const BILLABLE_COLOR   = '#16a34a'   // professional green
const BILLABLE_TINT    = '#f0fdf4'
const NONBILLABLE_COLOR = '#dc2626'  // professional red
const NONBILLABLE_TINT  = '#fef2f2'
const UTILIZATION_COLOR = '#2563eb'  // blue
const UTILIZATION_TINT  = '#eff6ff'
const COUNT_COLOR       = '#7c3aed'  // purple
const COUNT_TINT        = '#f5f3ff'

// ─── Normalization ────────────────────────────────────────────────────────────
/**
 * Map raw monday.com billable field values to canonical keys.
 * Handles: "Yes", "YES", "yes", "Billable", "No", "NO", "no", "Non-Billable",
 * empty string, null, undefined → "Unspecified"
 */
function normalizeBillableLabel(raw: string): 'Yes' | 'No' | 'Unspecified' {
  if (!raw) return 'Unspecified'
  const v = raw.trim().toLowerCase()
  if (v === 'yes' || v === 'billable') return 'Yes'
  if (v === 'no'  || v === 'non-billable' || v === 'non billable') return 'No'
  return 'Unspecified'
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const PeopleIcon = ({ className, color }: { className?: string; color?: string }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color ?? 'currentColor'}
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
)

const ClockIcon = ({ className, color }: { className?: string; color?: string }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color ?? 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const HashIcon = ({ className, color }: { className?: string; color?: string }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color ?? 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
)

// ─── Donut center label ───────────────────────────────────────────────────────
const RADIAN = Math.PI / 180

function DonutOuterLabel({ cx, cy, midAngle, outerRadius, percent, value, fill }: any) {
  if (percent < 0.03) return null
  const radius = outerRadius + 30
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  const isLeft = x < cx
  return (
    <text
      x={x}
      y={y}
      textAnchor={isLeft ? 'end' : 'start'}
      dominantBaseline="central"
      fontSize="12"
      fontWeight="700"
      fill={fill}
    >
      {`${(percent * 100).toFixed(0)}%`}
      {'\n'}
      {`(${value})`}
    </text>
  )
}

// Recharts doesn't auto-wrap <text>; use two <tspan> elements instead
function DonutOuterLabelTwoLine({ cx, cy, midAngle, outerRadius, percent, value, fill }: any) {
  if (percent < 0.03) return null
  const radius = outerRadius + 26
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  const anchor = x < cx ? 'end' : 'start'
  return (
    <text fontSize="11" fontWeight="700" fill={fill}>
      <tspan x={x} y={y - 7} textAnchor={anchor} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </tspan>
      <tspan x={x} y={y + 9} textAnchor={anchor} dominantBaseline="central">
        {`(${value})`}
      </tspan>
    </text>
  )
}

// ─── Custom tooltips ──────────────────────────────────────────────────────────
function DonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { name, value, pct } = payload[0].payload
  return (
    <div className={styles.bnbTooltip}>
      <div className={styles.bnbTooltipName}>{name}</div>
      <div className={styles.bnbTooltipValue}>{value} resources</div>
      <div className={styles.bnbTooltipPct}>{pct.toFixed(1)}% of total</div>
    </div>
  )
}

function BarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { name, value, pct } = payload[0].payload
  return (
    <div className={styles.bnbTooltip}>
      <div className={styles.bnbTooltipName}>{name}</div>
      <div className={styles.bnbTooltipValue}>{value} resources</div>
      <div className={styles.bnbTooltipPct}>{pct.toFixed(1)}% of total</div>
    </div>
  )
}

function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.bnbTooltip}>
      <div className={styles.bnbTooltipName}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className={styles.bnbTooltipValue} style={{ color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface BillableEntry {
  key: 'Yes' | 'No' | 'Unspecified'
  label: string
  count: number
  pct: number
  color: string
  tint: string
}

interface BillableNonBillableDashboardProps {
  data: ChartDataPoint[]
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BillableNonBillableDashboard({ data }: BillableNonBillableDashboardProps) {
  const [animate, setAnimate] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 60)
    return () => clearTimeout(t)
  }, [])

  // ─── Data Processing ─────────────────────────────────────────────────────
  const totalResources = useMemo(
    () => data.reduce((s, d) => s + d.value, 0),
    [data]
  )

  // Aggregate into canonical Yes / No / Unspecified buckets
  const entries: BillableEntry[] = useMemo(() => {
    const buckets = new Map<'Yes' | 'No' | 'Unspecified', number>([
      ['Yes', 0],
      ['No', 0],
    ])

    data.forEach(d => {
      const key = normalizeBillableLabel(d.label)
      if (key === 'Unspecified') {
        // Only show Unspecified bucket if there are actual records
        buckets.set('Unspecified', (buckets.get('Unspecified') ?? 0) + d.value)
      } else {
        buckets.set(key, (buckets.get(key) ?? 0) + d.value)
      }
    })

    const colorMap: Record<string, { color: string; tint: string; label: string }> = {
      Yes:         { color: BILLABLE_COLOR,    tint: BILLABLE_TINT,    label: 'Billable (Yes)' },
      No:          { color: NONBILLABLE_COLOR, tint: NONBILLABLE_TINT, label: 'Non-Billable (No)' },
      Unspecified: { color: '#6b7280',         tint: '#f9fafb',        label: 'Unspecified' },
    }

    return Array.from(buckets.entries())
      .filter(([, v]) => v > 0)          // remove empty buckets
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({
        key,
        label: colorMap[key].label,
        count,
        pct: totalResources > 0 ? (count / totalResources) * 100 : 0,
        color: colorMap[key].color,
        tint: colorMap[key].tint,
      }))
  }, [data, totalResources])

  const billableEntry    = entries.find(e => e.key === 'Yes')
  const nonBillableEntry = entries.find(e => e.key === 'No')

  const billableCount    = billableEntry?.count    ?? 0
  const nonBillableCount = nonBillableEntry?.count ?? 0
  const billablePct      = totalResources > 0 ? (billableCount / totalResources) * 100 : 0

  // Recharts pie data
  const pieData = useMemo(
    () => entries.map(e => ({ name: e.label, value: e.count, pct: e.pct, color: e.color })),
    [entries]
  )

  // Horizontal bar scale
  const barMax = Math.ceil((totalResources + 1) / 10) * 10 || 10
  const barTicks = useMemo(() => {
    const steps = 4
    return Array.from({ length: steps + 1 }, (_, i) =>
      Math.round((barMax / steps) * i)
    )
  }, [barMax])

  // ─── Trend: no historical data available from this data source ─────────────
  // The monday.com aggregation only provides current snapshot counts (Yes/No).
  // We render the "Billability Overview" fallback instead of fabricating history.

  return (
    <div className={styles.bnbDashboard}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className={styles.bnbHeader}>
        <div className={styles.bnbHeaderLeft}>
          <h3 className={styles.bnbHeading}>Billable vs Non-Billable Resources</h3>
          <p className={styles.bnbDescription}>
            Breakdown of resources by billability — Yes (billable to the client) vs No (non-billable).
          </p>
        </div>
        <div className={styles.bnbHeaderRight}>
          <div className={styles.bnbKpi}>
            <PeopleIcon className={styles.bnbKpiIcon} />
            <span className={styles.bnbKpiNumber}>{totalResources}</span>
            <span className={styles.bnbKpiLabel}>Active resources</span>
          </div>
        </div>
      </div>

      {/* ── Three-column main grid ───────────────────────────────────────────── */}
      <div className={styles.bnbMainGrid}>

        {/* LEFT — Donut Chart */}
        <div className={styles.bnbDonutSection}>
          <h4 className={styles.bnbSectionTitle}>Billable vs Non-Billable</h4>

          <div className={styles.bnbDonutWrapper}>
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={74}
                  outerRadius={108}
                  paddingAngle={2}
                  strokeWidth={0}
                  label={DonutOuterLabelTwoLine}
                  labelLine={false}
                  onMouseEnter={(_: any, index: number) =>
                    setActiveKey(pieData[index]?.name ?? null)
                  }
                  onMouseLeave={() => setActiveKey(null)}
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color}
                      style={{
                        opacity:
                          activeKey === null || activeKey === entry.name ? 1 : 0.35,
                        transition: 'opacity 150ms ease',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center total overlay */}
            <div className={styles.bnbDonutCenter}>
              <span className={styles.bnbDonutTotal}>{totalResources}</span>
              <span className={styles.bnbDonutLabel}>Total</span>
              <span className={styles.bnbDonutLabel}>Resources</span>
            </div>
          </div>

          {/* Legend */}
          <div className={styles.bnbLegend}>
            {entries.map(e => (
              <div
                key={e.key}
                className={styles.bnbLegendItem}
                onMouseEnter={() => setActiveKey(e.label)}
                onMouseLeave={() => setActiveKey(null)}
                style={{
                  opacity:
                    activeKey === null || activeKey === e.label ? 1 : 0.45,
                }}
              >
                <span
                  className={styles.bnbLegendDot}
                  style={{ backgroundColor: e.color }}
                />
                <span className={styles.bnbLegendName}>{e.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — Horizontal Bar Chart */}
        <div className={styles.bnbBarSection}>
          <h4 className={styles.bnbSectionTitle}>Resources by Billability</h4>

          <div className={styles.bnbBarChartWrapper}>
            {/* Subtle grid lines */}
            <div className={styles.bnbBarGridLines}>
              {barTicks.map((_, i) => (
                <div key={i} className={styles.bnbBarGridLine} />
              ))}
            </div>

            <div className={styles.bnbBarRows}>
              {entries.map(e => {
                const fillPct = barMax > 0 ? (e.count / barMax) * 100 : 0
                const isActive = activeKey === null || activeKey === e.label

                return (
                  <div
                    key={e.key}
                    className={styles.bnbBarRow}
                    onMouseEnter={() => setActiveKey(e.label)}
                    onMouseLeave={() => setActiveKey(null)}
                    style={{ opacity: isActive ? 1 : 0.4 }}
                  >
                    <span className={styles.bnbBarLabel}>{e.label}</span>
                    <div className={styles.bnbBarTrack}>
                      <div
                        className={styles.bnbBarFill}
                        style={{
                          width: animate ? `${fillPct}%` : '0%',
                          backgroundColor: e.color,
                          boxShadow:
                            activeKey === e.label
                              ? `0 0 10px ${e.color}55`
                              : 'none',
                        }}
                      />
                      {/* Count at the end of bar */}
                      <span
                        className={styles.bnbBarCount}
                        style={{
                          left: animate ? `calc(${fillPct}% + 8px)` : '8px',
                        }}
                      >
                        {e.count}
                      </span>
                    </div>
                    {/* Percentage badge */}
                    <span
                      className={styles.bnbBarPctBadge}
                      style={{ color: e.color, backgroundColor: e.tint }}
                    >
                      {e.pct.toFixed(0)}%
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Scale ticks */}
            <div className={styles.bnbBarTicksRow}>
              {barTicks.map((tick, i) => (
                <div key={i} className={styles.bnbBarTick}>{tick}</div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Billability Overview (no reliable historical data available) */}
        <div className={styles.bnbOverviewSection}>
          <h4 className={styles.bnbSectionTitle}>Billability Overview</h4>

          <div className={styles.bnbOverviewCards}>
            {/* Billable large metric */}
            <div
              className={styles.bnbOverviewCard}
              style={{ borderLeftColor: BILLABLE_COLOR, backgroundColor: BILLABLE_TINT }}
            >
              <div className={styles.bnbOverviewCardTop}>
                <PeopleIcon color={BILLABLE_COLOR} />
                <span className={styles.bnbOverviewCardLabel}>Billable</span>
              </div>
              <div className={styles.bnbOverviewCardMetric}>
                <span
                  className={styles.bnbOverviewCardCount}
                  style={{ color: BILLABLE_COLOR }}
                >
                  {billableCount}
                </span>
                <span className={styles.bnbOverviewCardUnit}>resources</span>
              </div>
              <div className={styles.bnbOverviewCardPct}>
                {billablePct.toFixed(1)}% of total active resources
              </div>
            </div>

            {/* Non-Billable large metric */}
            <div
              className={styles.bnbOverviewCard}
              style={{ borderLeftColor: NONBILLABLE_COLOR, backgroundColor: NONBILLABLE_TINT }}
            >
              <div className={styles.bnbOverviewCardTop}>
                <PeopleIcon color={NONBILLABLE_COLOR} />
                <span className={styles.bnbOverviewCardLabel}>Non-Billable</span>
              </div>
              <div className={styles.bnbOverviewCardMetric}>
                <span
                  className={styles.bnbOverviewCardCount}
                  style={{ color: NONBILLABLE_COLOR }}
                >
                  {nonBillableCount}
                </span>
                <span className={styles.bnbOverviewCardUnit}>resources</span>
              </div>
              <div className={styles.bnbOverviewCardPct}>
                {totalResources > 0
                  ? ((nonBillableCount / totalResources) * 100).toFixed(1)
                  : '0.0'}
                % of total active resources
              </div>
            </div>
          </div>

          {/* Ratio bar */}
          <div className={styles.bnbRatioBar}>
            <div className={styles.bnbRatioLabel}>
              <span style={{ color: BILLABLE_COLOR }}>●</span> Billable
              <strong style={{ color: BILLABLE_COLOR }}> {billablePct.toFixed(0)}%</strong>
            </div>
            <div className={styles.bnbRatioTrack}>
              <div
                className={styles.bnbRatioFill}
                style={{
                  width: animate ? `${billablePct}%` : '0%',
                  backgroundColor: BILLABLE_COLOR,
                }}
              />
              <div
                className={styles.bnbRatioFillRight}
                style={{
                  width: animate ? `${100 - billablePct}%` : '0%',
                  backgroundColor: NONBILLABLE_COLOR,
                }}
              />
            </div>
            <div className={styles.bnbRatioLabel}>
              <span style={{ color: NONBILLABLE_COLOR }}>●</span> Non-Billable
              <strong style={{ color: NONBILLABLE_COLOR }}>
                {' '}
                {totalResources > 0
                  ? ((nonBillableCount / totalResources) * 100).toFixed(0)
                  : '0'}
                %
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
      <div className={styles.bnbKpiGrid}>
        {/* Card 1 — Billable Resources */}
        <div
          className={styles.bnbKpiCard}
          style={{ backgroundColor: BILLABLE_TINT }}
          onMouseEnter={() => setActiveKey(billableEntry?.label ?? null)}
          onMouseLeave={() => setActiveKey(null)}
        >
          <div className={styles.bnbKpiCardTop}>
            <PeopleIcon color={BILLABLE_COLOR} />
            <span className={styles.bnbKpiCardTitle}>Billable Resources</span>
          </div>
          <div className={styles.bnbKpiCardBody}>
            <span className={styles.bnbKpiCardCount}>{billableCount}</span>
            <span
              className={styles.bnbKpiCardBadge}
              style={{ color: BILLABLE_COLOR, backgroundColor: 'rgba(255,255,255,0.65)' }}
            >
              {billablePct.toFixed(0)}% of total
            </span>
          </div>
        </div>

        {/* Card 2 — Non-Billable Resources */}
        <div
          className={styles.bnbKpiCard}
          style={{ backgroundColor: NONBILLABLE_TINT }}
          onMouseEnter={() => setActiveKey(nonBillableEntry?.label ?? null)}
          onMouseLeave={() => setActiveKey(null)}
        >
          <div className={styles.bnbKpiCardTop}>
            <PeopleIcon color={NONBILLABLE_COLOR} />
            <span className={styles.bnbKpiCardTitle}>Non-Billable Resources</span>
          </div>
          <div className={styles.bnbKpiCardBody}>
            <span className={styles.bnbKpiCardCount}>{nonBillableCount}</span>
            <span
              className={styles.bnbKpiCardBadge}
              style={{ color: NONBILLABLE_COLOR, backgroundColor: 'rgba(255,255,255,0.65)' }}
            >
              {totalResources > 0
                ? ((nonBillableCount / totalResources) * 100).toFixed(0)
                : '0'}
              % of total
            </span>
          </div>
        </div>

        {/* Card 3 — Billable Utilization */}
        <div
          className={styles.bnbKpiCard}
          style={{ backgroundColor: UTILIZATION_TINT }}
        >
          <div className={styles.bnbKpiCardTop}>
            <ClockIcon color={UTILIZATION_COLOR} />
            <span className={styles.bnbKpiCardTitle}>Billable Utilization</span>
          </div>
          <div className={styles.bnbKpiCardBody}>
            <span className={styles.bnbKpiCardCountLg} style={{ color: UTILIZATION_COLOR }}>
              {billablePct.toFixed(0)}%
            </span>
            <span className={styles.bnbKpiCardUnit}>of active resources</span>
          </div>
        </div>

        {/* Card 4 — Non-Billable Count */}
        <div
          className={styles.bnbKpiCard}
          style={{ backgroundColor: COUNT_TINT }}
        >
          <div className={styles.bnbKpiCardTop}>
            <HashIcon color={COUNT_COLOR} />
            <span className={styles.bnbKpiCardTitle}>Non-Billable Count</span>
          </div>
          <div className={styles.bnbKpiCardBody}>
            <span className={styles.bnbKpiCardCount}>{nonBillableCount}</span>
            <span className={styles.bnbKpiCardUnit}>resources</span>
          </div>
        </div>
      </div>
    </div>
  )
}
