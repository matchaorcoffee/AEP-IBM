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

// ─── Color System ────────────────────────────────────────────────────────────
// Unified colors and tints (soft pastel backgrounds) for KPI cards
const CATEGORY_COLORS: Record<string, { color: string; tint: string }> = {
  Flex: { color: '#e31b23', tint: '#fff1f1' },       // IBM Red 60
  Core: { color: '#1c2d5a', tint: '#f4f6fb' },       // IBM Blue 90
  'N/A': { color: '#2f80ed', tint: '#f0f6ff' },       // IBM Blue 60
  Project: { color: '#ff5c8a', tint: '#fff1f4' },     // Coral/Pink
  Unspecified: { color: '#14b8a6', tint: '#f0fbf9' }, // Teal
}

// ─── Inline SVG Icons ────────────────────────────────────────────────────────
const PeopleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
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

const SinglePersonIcon = ({ className, color }: { className?: string; color?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || 'currentColor'}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

// ─── Normalization Helper ────────────────────────────────────────────────────
function normalizeCategoryKey(label: string): string {
  if (!label) return 'Unspecified'
  const clean = label.trim().toLowerCase()
  if (clean === 'flex') return 'Flex'
  if (clean === 'core') return 'Core'
  if (clean === 'n/a' || clean === 'na') return 'N/A'
  if (clean === 'project') return 'Project'
  return 'Unspecified'
}

interface CoreFlexDashboardProps {
  data: ChartDataPoint[]
}

export default function CoreFlexDashboard({ data }: CoreFlexDashboardProps) {
  const [animate, setAnimate] = useState(false)
  const [activeSegment, setActiveSegment] = useState<string | null>(null)

  // Trigger smooth animation on load
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // ─── Data Processing ───────────────────────────────────────────────────────
  const totalResources = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0)
  }, [data])

  // Normalize and group data, ensuring all 5 categories are always represented
  const normalizedData = useMemo(() => {
    const counts = new Map<string, number>()
    const expectedCategories = ['Flex', 'Core', 'N/A', 'Project', 'Unspecified']
    expectedCategories.forEach(cat => counts.set(cat, 0))

    data.forEach(item => {
      const key = normalizeCategoryKey(item.label)
      counts.set(key, (counts.get(key) ?? 0) + item.value)
    })

    return Array.from(counts.entries())
      .map(([label, value]) => ({
        label,
        value,
        percentage: totalResources > 0 ? (value / totalResources) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value) // Sort descending
  }, [data, totalResources])

  // Process data for Recharts Pie (exclude zero counts to avoid rendering artifacts)
  const pieData = useMemo(() => {
    return normalizedData
      .filter(item => item.value > 0)
      .map(item => ({
        name: item.label,
        value: item.value,
        percentage: item.percentage,
        color: CATEGORY_COLORS[item.label]?.color || '#9ca3af',
      }))
  }, [normalizedData])

  // Calculate dynamic scale ticks for the horizontal bar chart
  const barTicks = useMemo(() => {
    const maxVal = normalizedData[0]?.value || 10
    // Round to the next highest multiple of 10 to provide padding
    const maxTick = Math.ceil((maxVal + 1) / 10) * 10
    const ticks = [0]
    const steps = 6
    const step = maxTick / steps

    for (let i = 1; i <= steps; i++) {
      ticks.push(Math.round(i * step))
    }
    return ticks
  }, [normalizedData])

  const maxTickValue = barTicks[barTicks.length - 1]

  // Custom outer label for Recharts Donut Slices
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
  }: any) => {
    if (percent < 0.01) return null // Hide tiny slice labels

    const RADIAN = Math.PI / 180
    const radius = outerRadius + 20
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    const isLeft = x < cx
    const labelColor = CATEGORY_COLORS[name]?.color || '#374151'

    return (
      <text
        x={x}
        y={y}
        fill={labelColor}
        textAnchor={isLeft ? 'end' : 'start'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="700"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    )
  }

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const { name, value, percentage } = payload[0].payload
    return (
      <div className={styles.cfTooltip}>
        <div className={styles.cfTooltipCategory}>{name}</div>
        <div className={styles.cfTooltipValue}>{value} resources</div>
        <div className={styles.cfTooltipPct}>{percentage.toFixed(1)}% of total</div>
      </div>
    )
  }

  return (
    <div className={styles.cfDashboard}>
      {/* ─── Header ─── */}
      <div className={styles.cfHeader}>
        <div className={styles.cfHeaderLeft}>
          <h3 className={styles.cfHeading}>Distribution of resources by Core/Flex designation</h3>
          <p className={styles.cfDescription}>
            Shows how many resources are classified as Core, Flex, Project, or N/A.
          </p>
        </div>

        {/* Compact KPI on upper right */}
        <div className={styles.cfHeaderRight}>
          <div className={styles.cfHeaderKpi}>
            <PeopleIcon className={styles.cfHeaderKpiIcon} />
            <span className={styles.cfHeaderKpiNumber}>{totalResources}</span>
            <span className={styles.cfHeaderKpiText}>Active resources</span>
          </div>
        </div>
      </div>

      {/* ─── Main Visualization Area ─── */}
      <div className={styles.cfMainGrid}>
        {/* Left Side: Large Donut Chart */}
        <div className={styles.cfDonutSection}>
          <div className={styles.cfDonutChartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                  label={renderCustomLabel}
                  labelLine={false}
                  onMouseEnter={(data, idx) => {
                    setActiveSegment(pieData[idx]?.name ?? null)
                  }}
                  onMouseLeave={() => {
                    setActiveSegment(null)
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      style={{
                        opacity: activeSegment === null || activeSegment === entry.name ? 1 : 0.65,
                        transition: 'opacity 150ms ease, transform 150ms ease',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Absolutely centered label inside the donut */}
            <div className={styles.cfDonutCenter}>
              <span className={styles.cfCenterNumber}>{totalResources}</span>
              <span className={styles.cfCenterText}>Total</span>
              <span className={styles.cfCenterText}>Resources</span>
            </div>
          </div>
        </div>

        {/* Right Side: Horizontal Bar Chart */}
        <div className={styles.cfBarSection}>
          <h4 className={styles.cfBarTitle}>Resources by Core/Flex</h4>

          <div className={styles.cfBarChartWrapper}>
            {/* Absolute background grid lines */}
            <div className={styles.cfBarGridLines}>
              {barTicks.map((_, idx) => (
                <div key={idx} className={styles.cfBarGridLine} />
              ))}
            </div>

            <div className={styles.cfBarRows}>
              {normalizedData.map(item => {
                const colorInfo = CATEGORY_COLORS[item.label] || { color: '#9ca3af', tint: '#f3f4f6' }
                // Width is relative to the scale's maximum tick value to match grid lines perfectly
                const fillWidth = maxTickValue > 0 ? (item.value / maxTickValue) * 100 : 0
                const isHovered = activeSegment === item.label

                return (
                  <div
                    key={item.label}
                    className={`${styles.cfBarRow} ${isHovered ? styles.cfBarRowHovered : ''}`}
                    onMouseEnter={() => setActiveSegment(item.label)}
                    onMouseLeave={() => setActiveSegment(null)}
                  >
                    {/* Label */}
                    <span className={styles.cfBarLabel}>{item.label}</span>

                    {/* Bar Track & Fill */}
                    <div className={styles.cfBarTrack}>
                      <div
                        className={styles.cfBarFill}
                        style={{
                          width: animate ? `${fillWidth}%` : '0%',
                          backgroundColor: colorInfo.color,
                          boxShadow: isHovered ? `0 0 8px ${colorInfo.color}44` : 'none',
                        }}
                      />
                      <span
                        className={styles.cfBarValue}
                        style={{
                          left: animate ? `calc(${fillWidth}% + 10px)` : '10px',
                          color: item.value > 0 ? '#1f2937' : '#9ca3af',
                        }}
                      >
                        {item.value}
                      </span>
                    </div>

                    {/* Far right Percentage Badge */}
                    <div
                      className={styles.cfBarPercentBadge}
                      style={{
                        color: colorInfo.color,
                        backgroundColor: colorInfo.tint,
                        fontWeight: '700',
                      }}
                    >
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Scale Ticks */}
            <div className={styles.cfBarTicksRow}>
              {barTicks.map((tick, idx) => (
                <div key={idx} className={styles.cfBarTick}>
                  {tick}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Summary Cards ─── */}
      <div className={styles.cfSummaryGrid}>
        {normalizedData.map(item => {
          const colorInfo = CATEGORY_COLORS[item.label] || { color: '#9ca3af', tint: '#f3f4f6' }
          const isSelected = activeSegment === item.label

          return (
            <div
              key={item.label}
              className={`${styles.cfSummaryCard} ${isSelected ? styles.cfSummaryCardSelected : ''}`}
              style={{
                backgroundColor: colorInfo.tint,
                borderColor: isSelected ? colorInfo.color : 'transparent',
              }}
              onMouseEnter={() => setActiveSegment(item.label)}
              onMouseLeave={() => setActiveSegment(null)}
            >
              <div className={styles.cfCardTop}>
                <span
                  className={styles.cfCardDot}
                  style={{ backgroundColor: colorInfo.color }}
                />
                <span className={styles.cfCardName}>{item.label}</span>
              </div>

              <div className={styles.cfCardContent}>
                <span className={styles.cfCardCount}>{item.value}</span>
                <span
                  className={styles.cfCardBadge}
                  style={{
                    color: colorInfo.color,
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {item.percentage.toFixed(1)}%
                </span>
                <SinglePersonIcon className={styles.cfCardIcon} color={`${colorInfo.color}33`} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}