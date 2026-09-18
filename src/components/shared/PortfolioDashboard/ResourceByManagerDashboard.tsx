import React, { useState, useMemo, useEffect } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ChartDataPoint } from '../../../services/portfolioAnalyticsService'
import styles from './PortfolioDashboard.module.scss'

// ─── Color System ─────────────────────────────────────────────────────────────
// Professional enterprise palette — assigned by sorted rank position so the
// first/largest manager is always the same color across every component.
const MANAGER_COLORS: { color: string; tint: string }[] = [
  { color: '#c8102e', tint: '#fdf2f4' }, // Red/coral     — rank 1
  { color: '#1d3557', tint: '#f0f3f9' }, // Dark navy     — rank 2
  { color: '#4a90c4', tint: '#f0f7fc' }, // Medium blue   — rank 3
  { color: '#e05a8a', tint: '#fdf0f6' }, // Pink          — rank 4
  { color: '#1d8a74', tint: '#edf8f5' }, // Teal          — rank 5
  { color: '#7c6eaa', tint: '#f5f3fa' }, // Muted purple  — rank 6
  { color: '#c06c2b', tint: '#fdf5ee' }, // Amber-brown   — rank 7
  { color: '#2e7d5e', tint: '#edf6f2' }, // Forest green  — rank 8
  { color: '#5b6abf', tint: '#f2f3fc' }, // Slate blue    — rank 9
  { color: '#9c3f4a', tint: '#faf0f1' }, // Dusty rose    — rank 10
]

function getManagerColor(index: number): { color: string; tint: string } {
  return MANAGER_COLORS[index % MANAGER_COLORS.length]
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const PeopleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
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
)

const PersonIcon = ({ className, color }: { className?: string; color?: string }) => (
  <svg
    className={className}
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || 'currentColor'}
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface ManagerEntry {
  name: string
  count: number
  percentage: number
  rank: number
  color: string
  tint: string
}

interface ResourceByManagerDashboardProps {
  data: ChartDataPoint[]
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ManagerTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: { name: string; value: number; percentage: number; color: string } }>
}) {
  if (!active || !payload?.length) return null
  const { name, value, percentage } = payload[0].payload
  return (
    <div className={styles.rbmTooltip}>
      <div className={styles.rbmTooltipName}>{name}</div>
      <div className={styles.rbmTooltipValue}>{value} resources</div>
      <div className={styles.rbmTooltipPct}>{percentage.toFixed(1)}% of total</div>
    </div>
  )
}

// ─── Donut center label (rendered inside SVG) ─────────────────────────────────
function DonutCenterLabel({ cx, cy, total }: { cx?: number; cy?: number; total: number }) {
  if (cx === undefined || cy === undefined) return null
  return (
    <text textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} y={cy - 10} fontSize="28" fontWeight="800" fill="#111827">
        {total}
      </tspan>
      <tspan x={cx} y={cy + 16} fontSize="11" fontWeight="600" fill="#6b7280" letterSpacing="0.04em">
        Total
      </tspan>
      <tspan x={cx} y={cy + 30} fontSize="11" fontWeight="600" fill="#6b7280" letterSpacing="0.04em">
        Resources
      </tspan>
    </text>
  )
}

// ─── Percentage label outside donut ──────────────────────────────────────────
const RADIAN = Math.PI / 180

function DonutOuterLabel({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  fill,
}: any) {
  if (percent < 0.04) return null
  const radius = outerRadius + 22
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  const isLeft = x < cx
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      textAnchor={isLeft ? 'end' : 'start'}
      dominantBaseline="central"
      fontSize="12"
      fontWeight="700"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ResourceByManagerDashboard({ data }: ResourceByManagerDashboardProps) {
  const [animate, setAnimate] = useState(false)
  const [activeManager, setActiveManager] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 60)
    return () => clearTimeout(timer)
  }, [])

  // ─── Data Processing ─────────────────────────────────────────────────────
  const totalResources = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  )

  // Normalize: group by manager name (handles duplicates from normalization),
  // assign colors by descending rank, produce enriched manager entries
  const managers: ManagerEntry[] = useMemo(() => {
    // Step 1: aggregate in case the API returns duplicates
    const agg = new Map<string, number>()
    data.forEach(d => {
      const key = d.label?.trim() || 'Unassigned'
      agg.set(key, (agg.get(key) ?? 0) + d.value)
    })

    // Step 2: sort descending by count
    const sorted = Array.from(agg.entries())
      .sort((a, b) => b[1] - a[1])

    // Step 3: enrich with rank, %, color
    return sorted.map(([name, count], idx) => {
      const { color, tint } = getManagerColor(idx)
      return {
        name,
        count,
        percentage: totalResources > 0 ? (count / totalResources) * 100 : 0,
        rank: idx + 1,
        color,
        tint,
      }
    })
  }, [data, totalResources])

  // Data shaped for Recharts
  const pieData = useMemo(
    () =>
      managers
        .filter(m => m.count > 0)
        .map(m => ({
          name: m.name,
          value: m.count,
          percentage: m.percentage,
          color: m.color,
        })),
    [managers]
  )

  // Dynamic bar scale
  const maxCount = managers[0]?.count ?? 0
  const barMax = Math.ceil((maxCount + 1) / 5) * 5 || 10
  const barTicks = useMemo(() => {
    const ticks: number[] = []
    const steps = 5
    for (let i = 0; i <= steps; i++) {
      ticks.push(Math.round((barMax / steps) * i))
    }
    return ticks
  }, [barMax])

  return (
    <div className={styles.rbmDashboard}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className={styles.rbmHeader}>
        <div className={styles.rbmHeaderLeft}>
          <h3 className={styles.rbmHeading}>Resources by AEP Manager</h3>
          <p className={styles.rbmDescription}>
            Number of active resources associated with each AEP manager. Sorted by headcount —
            managers with the most resources appear first.
          </p>
        </div>

        <div className={styles.rbmHeaderRight}>
          <div className={styles.rbmKpi}>
            <PeopleIcon className={styles.rbmKpiIcon} />
            <span className={styles.rbmKpiNumber}>{totalResources}</span>
            <span className={styles.rbmKpiLabel}>Active resources</span>
          </div>
        </div>
      </div>

      {/* ── Three-Column Grid ───────────────────────────────────────────────── */}
      <div className={styles.rbmMainGrid}>
        {/* LEFT: Horizontal Bar Chart */}
        <div className={styles.rbmBarSection}>
          <h4 className={styles.rbmSectionTitle}>Managers by resource count</h4>

          <div className={styles.rbmBarChartWrapper}>
            {/* Subtle grid lines */}
            <div className={styles.rbmBarGridLines}>
              {barTicks.map((_, i) => (
                <div key={i} className={styles.rbmBarGridLine} />
              ))}
            </div>

            <div className={styles.rbmBarRows}>
              {managers.map(m => {
                const fillPct = barMax > 0 ? (m.count / barMax) * 100 : 0
                const isActive = activeManager === null || activeManager === m.name

                return (
                  <div
                    key={m.name}
                    className={styles.rbmBarRow}
                    onMouseEnter={() => setActiveManager(m.name)}
                    onMouseLeave={() => setActiveManager(null)}
                    style={{ opacity: isActive ? 1 : 0.45 }}
                  >
                    <span className={styles.rbmBarLabel}>{m.name}</span>
                    <div className={styles.rbmBarTrack}>
                      <div
                        className={styles.rbmBarFill}
                        style={{
                          width: animate ? `${fillPct}%` : '0%',
                          backgroundColor: m.color,
                          boxShadow:
                            activeManager === m.name
                              ? `0 0 8px ${m.color}55`
                              : 'none',
                        }}
                      />
                      {/* Count label at end of bar */}
                      <span
                        className={styles.rbmBarCount}
                        style={{
                          left: animate ? `calc(${fillPct}% + 8px)` : '8px',
                        }}
                      >
                        {m.count}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Scale ticks */}
            <div className={styles.rbmBarTicksRow}>
              {barTicks.map((tick, i) => (
                <div key={i} className={styles.rbmBarTick}>
                  {tick}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: Donut Chart */}
        <div className={styles.rbmDonutSection}>
          <h4 className={styles.rbmSectionTitle}>Share of resources by manager</h4>

          <div className={styles.rbmDonutWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={108}
                  paddingAngle={2}
                  strokeWidth={0}
                  label={DonutOuterLabel}
                  labelLine={false}
                  onMouseEnter={(_: any, index: number) => {
                    setActiveManager(pieData[index]?.name ?? null)
                  }}
                  onMouseLeave={() => setActiveManager(null)}
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color}
                      style={{
                        opacity:
                          activeManager === null || activeManager === entry.name
                            ? 1
                            : 0.4,
                        transition: 'opacity 150ms ease',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ManagerTooltip />} />
                {/* Invisible pie for center text via SVG foreignObject trick isn't reliable;
                    we overlay via absolute positioning instead */}
              </PieChart>
            </ResponsiveContainer>

            {/* Centered total inside the donut */}
            <div className={styles.rbmDonutCenter}>
              <span className={styles.rbmDonutTotal}>{totalResources}</span>
              <span className={styles.rbmDonutLabel}>Total</span>
              <span className={styles.rbmDonutLabel}>Resources</span>
            </div>
          </div>

          {/* Compact legend row */}
          <div className={styles.rbmLegend}>
            {managers.map(m => (
              <div
                key={m.name}
                className={styles.rbmLegendItem}
                onMouseEnter={() => setActiveManager(m.name)}
                onMouseLeave={() => setActiveManager(null)}
                style={{
                  opacity:
                    activeManager === null || activeManager === m.name ? 1 : 0.45,
                }}
              >
                <span
                  className={styles.rbmLegendDot}
                  style={{ backgroundColor: m.color }}
                />
                <span className={styles.rbmLegendName}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Manager Breakdown Table */}
        <div className={styles.rbmTableSection}>
          <h4 className={styles.rbmSectionTitle}>Manager breakdown</h4>

          <table className={styles.rbmTable} aria-label="Manager breakdown">
            <thead>
              <tr>
                <th className={styles.rbmTh}>#</th>
                <th className={styles.rbmTh}>Manager</th>
                <th className={`${styles.rbmTh} ${styles.rbmThRight}`}>Resources</th>
                <th className={`${styles.rbmTh} ${styles.rbmThRight}`}>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {managers.map(m => (
                <tr
                  key={m.name}
                  className={styles.rbmTr}
                  onMouseEnter={() => setActiveManager(m.name)}
                  onMouseLeave={() => setActiveManager(null)}
                  style={{
                    opacity:
                      activeManager === null || activeManager === m.name ? 1 : 0.4,
                  }}
                >
                  <td className={styles.rbmTd}>
                    <span
                      className={styles.rbmRankBadge}
                      style={{ backgroundColor: m.tint, color: m.color }}
                    >
                      {m.rank}
                    </span>
                  </td>
                  <td className={styles.rbmTd}>
                    <span className={styles.rbmTdName}>{m.name}</span>
                  </td>
                  <td className={`${styles.rbmTd} ${styles.rbmTdRight}`}>
                    <span className={styles.rbmTdCount}>{m.count}</span>
                  </td>
                  <td className={`${styles.rbmTd} ${styles.rbmTdRight}`}>
                    <span className={styles.rbmTdPct}>{m.percentage.toFixed(1)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────────────────── */}
      <div className={styles.rbmSummaryGrid}>
        {managers.map(m => (
          <div
            key={m.name}
            className={styles.rbmSummaryCard}
            style={{
              backgroundColor: m.tint,
              borderColor:
                activeManager === m.name ? m.color : 'transparent',
              opacity:
                activeManager === null || activeManager === m.name ? 1 : 0.55,
            }}
            onMouseEnter={() => setActiveManager(m.name)}
            onMouseLeave={() => setActiveManager(null)}
          >
            {/* Top row: colored icon bubble + name */}
            <div className={styles.rbmCardHeader}>
              <div
                className={styles.rbmCardIconBubble}
                style={{ backgroundColor: m.color }}
              >
                <PersonIcon color="#ffffff" />
              </div>
              <span className={styles.rbmCardName}>{m.name}</span>
            </div>

            {/* Count + badge + watermark icon row */}
            <div className={styles.rbmCardBody}>
              <span className={styles.rbmCardCount}>{m.count}</span>
              <div className={styles.rbmCardRight}>
                <span
                  className={styles.rbmCardBadge}
                  style={{ color: m.color, backgroundColor: 'rgba(255,255,255,0.65)' }}
                >
                  {m.percentage.toFixed(1)}% of total
                </span>
                <PersonIcon
                  className={styles.rbmCardWatermark}
                  color={`${m.color}28`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
