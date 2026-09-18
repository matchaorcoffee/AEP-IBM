import React, { useState, useMemo, useEffect } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps'
import type { ChartDataPoint } from '../../../services/portfolioAnalyticsService'
import styles from './PortfolioDashboard.module.scss'
import worldAtlas from './world-110m.json'
import { normalizeCountryName } from './GeographicMap'

// ─── GeoJSON / TopoJSON Data ────────────────────────────────────────────────
const GEO_URL = worldAtlas as any

// ─── Color System ────────────────────────────────────────────────────────────
// Unified colors and tints (soft pastel backgrounds) for delivery models
const MODEL_COLORS: Record<string, { color: string; tint: string }> = {
  Offshore: { color: '#e31b23', tint: '#fff1f1' }, // Red (IBM Red 60)
  Onshore: { color: '#1c2d5a', tint: '#f4f6fb' },  // Dark Navy Blue
  Nearshore: { color: '#2f80ed', tint: '#f0f6ff' }, // Medium Blue
}

// Map countries to their standard delivery models
const SHORE_MODEL_MAPPING: Record<string, 'Onshore' | 'Nearshore' | 'Offshore'> = {
  'United States': 'Onshore',
  Canada: 'Nearshore',
  Mexico: 'Nearshore',
  Brazil: 'Nearshore',
  'Costa Rica': 'Nearshore',
  India: 'Offshore',
  Philippines: 'Offshore',
  'United Kingdom': 'Offshore',
}

export function getDeliveryModelForCountry(countryName: string): 'Onshore' | 'Nearshore' | 'Offshore' | null {
  const norm = normalizeCountryName(countryName)
  if (SHORE_MODEL_MAPPING[norm]) {
    return SHORE_MODEL_MAPPING[norm]
  }

  // Generic regional fallbacks
  const lower = norm.toLowerCase()
  if (lower.includes('united states') || lower === 'us' || lower === 'usa') {
    return 'Onshore'
  }
  // Americas -> Nearshore
  if (
    lower.includes('colombia') ||
    lower.includes('argentina') ||
    lower.includes('chile') ||
    lower.includes('peru') ||
    lower.includes('costa rica') ||
    lower.includes('guatemala') ||
    lower.includes('panama') ||
    lower.includes('venezuela')
  ) {
    return 'Nearshore'
  }
  // Europe / Asia / Africa / Oceania -> Offshore
  if (
    lower.includes('india') ||
    lower.includes('philippines') ||
    lower.includes('united kingdom') ||
    lower.includes('uk') ||
    lower.includes('china') ||
    lower.includes('germany') ||
    lower.includes('france') ||
    lower.includes('spain') ||
    lower.includes('australia') ||
    lower.includes('japan') ||
    lower.includes('poland') ||
    lower.includes('romania') ||
    lower.includes('italy') ||
    lower.includes('singapore')
  ) {
    return 'Offshore'
  }

  return null
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

interface DeliveryModelDashboardProps {
  data: ChartDataPoint[]
  geoData: ChartDataPoint[]
}

interface TooltipState {
  show: boolean
  x: number
  y: number
  countryName: string
  resources: number
  model: string | null
}

export default function DeliveryModelDashboard({ data, geoData }: DeliveryModelDashboardProps) {
  const [animate, setAnimate] = useState(false)
  const [activeModel, setActiveModel] = useState<string | null>(null)
  const [mapTooltip, setMapTooltip] = useState<TooltipState | null>(null)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  // Smooth slide-in trigger on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // ─── Data Processing ───────────────────────────────────────────────────────
  const totalResources = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0)
  }, [data])

  // Process and sort delivery model data (Offshore, Onshore, Nearshore)
  const processedModels = useMemo(() => {
    const models = ['Offshore', 'Onshore', 'Nearshore']
    const map = new Map<string, number>()
    models.forEach(m => map.set(m, 0))

    data.forEach(item => {
      // Normalize casing just in case
      const key = item.label.charAt(0).toUpperCase() + item.label.slice(1).toLowerCase()
      if (map.has(key)) {
        map.set(key, item.value)
      }
    })

    return Array.from(map.entries()).map(([label, value]) => ({
      label,
      value,
      percentage: totalResources > 0 ? (value / totalResources) * 100 : 0,
    }))
  }, [data, totalResources])

  // Pie chart data representation (only positive counts)
  const pieData = useMemo(() => {
    return processedModels
      .filter(m => m.value > 0)
      .map(m => ({
        name: m.label,
        value: m.value,
        percentage: m.percentage,
        color: MODEL_COLORS[m.label]?.color || '#9ca3af',
      }))
  }, [processedModels])

  // Max value in delivery models to set horizontal bar limits
  const maxModelValue = useMemo(() => {
    const maxVal = Math.max(...processedModels.map(m => m.value))
    return Math.ceil((maxVal + 1) / 10) * 10 // next multiple of 10
  }, [processedModels])

  // Grid tick scale
  const barTicks = useMemo(() => {
    const ticks = [0]
    const steps = 6
    const step = maxModelValue / steps
    for (let i = 1; i <= steps; i++) {
      ticks.push(Math.round(i * step))
    }
    return ticks
  }, [maxModelValue])

  // Normalizations for mapping geography counts
  const normalizedGeoDataMap = useMemo(() => {
    const map = new Map<string, number>()
    geoData.forEach(item => {
      const normName = normalizeCountryName(item.label)
      if (normName) {
        map.set(normName, item.value)
      }
    })
    return map
  }, [geoData])

  // Donut Custom Labels
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
  }: any) => {
    if (percent < 0.01) return null

    const RADIAN = Math.PI / 180
    const radius = outerRadius + 18
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    const isLeft = x < cx
    const labelColor = MODEL_COLORS[name]?.color || '#374151'

    return (
      <text
        x={x}
        y={y}
        fill={labelColor}
        textAnchor={isLeft ? 'end' : 'start'}
        dominantBaseline="central"
        fontSize="11"
        fontWeight="700"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Custom tooltips
  const CustomDonutTooltip = ({ active, payload }: any) => {
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
    <div className={styles.dmDashboard}>
      {/* ─── Header ─── */}
      <div className={styles.dmHeader}>
        <div className={styles.dmHeaderLeft}>
          <h3 className={styles.dmHeading}>Distribution of resources by delivery model</h3>
          <p className={styles.dmDescription}>
            Shows how many resources are assigned as Onshore (US), Nearshore (Americas), and Offshore (India, Philippines, etc.).
          </p>
        </div>

        {/* Dynamic upper right total KPI badge */}
        <div className={styles.dmHeaderRight}>
          <div className={styles.dmHeaderKpi}>
            <PeopleIcon className={styles.dmHeaderKpiIcon} />
            <span className={styles.dmHeaderKpiNumber}>{totalResources}</span>
            <span className={styles.dmHeaderKpiText}>Active resources</span>
          </div>
        </div>
      </div>

      {/* ─── Main Visualization Row (Side-by-Side) ─── */}
      <div className={styles.dmMainGrid}>
        {/* Column 1: Donut Chart */}
        <div className={styles.dmDonutSection}>
          <div className={styles.dmDonutChartWrapper}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  label={renderCustomLabel}
                  labelLine={false}
                  onMouseEnter={(data, idx) => {
                    setActiveModel(pieData[idx]?.name ?? null)
                  }}
                  onMouseLeave={() => {
                    setActiveModel(null)
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      style={{
                        opacity: activeModel === null || activeModel === entry.name ? 1 : 0.6,
                        transition: 'opacity 150ms ease',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomDonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Total resources centered inside Donut */}
            <div className={styles.dmDonutCenter}>
              <span className={styles.dmCenterNumber}>{totalResources}</span>
              <span className={styles.dmCenterText}>Total</span>
              <span className={styles.dmCenterText}>Resources</span>
            </div>
          </div>
        </div>

        {/* Column 2: Horizontal Bar Chart */}
        <div className={styles.dmBarSection}>
          <h4 className={styles.dmBarTitle}>Resources by Delivery Model</h4>

          <div className={styles.dmBarChartWrapper}>
            {/* Absolute background grid lines */}
            <div className={styles.dmBarGridLines}>
              {barTicks.map((_, idx) => (
                <div key={idx} className={styles.dmBarGridLine} />
              ))}
            </div>

            <div className={styles.dmBarRows}>
              {processedModels.map(item => {
                const colorInfo = MODEL_COLORS[item.label] || { color: '#9ca3af', tint: '#f3f4f6' }
                const fillWidth = maxModelValue > 0 ? (item.value / maxModelValue) * 100 : 0
                const isHovered = activeModel === item.label

                return (
                  <div
                    key={item.label}
                    className={`${styles.dmBarRow} ${isHovered ? styles.dmBarRowHovered : ''}`}
                    onMouseEnter={() => setActiveModel(item.label)}
                    onMouseLeave={() => setActiveModel(null)}
                  >
                    {/* Model Label */}
                    <span className={styles.dmBarLabel}>{item.label}</span>

                    {/* Track & Bar */}
                    <div className={styles.dmBarTrack}>
                      <div
                        className={styles.dmBarFill}
                        style={{
                          width: animate ? `${fillWidth}%` : '0%',
                          backgroundColor: colorInfo.color,
                        }}
                      />
                      <span
                        className={styles.dmBarValue}
                        style={{
                          left: animate ? `calc(${fillWidth}% + 10px)` : '10px',
                          color: item.value > 0 ? '#1f2937' : '#9ca3af',
                        }}
                      >
                        {item.value}
                      </span>
                    </div>

                    {/* Percentage on far right */}
                    <div
                      className={styles.dmBarPercentBadge}
                      style={{
                        color: colorInfo.color,
                        backgroundColor: colorInfo.tint,
                      }}
                    >
                      {item.percentage.toFixed(0)}%
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom numeric ticks */}
            <div className={styles.dmBarTicksRow}>
              {barTicks.map((tick, idx) => (
                <div key={idx} className={styles.dmBarTick}>
                  {tick}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: World Map (Right-aligned, styled by delivery models) */}
        <div className={styles.dmMapSection}>
          <div className={styles.dmMapWrapper}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 85, // beautifully scaled down to fit next to charts
                center: [10, 32], // beautifully centered on inhabited continents
              }}
              width={400}
              height={230}
              style={{ width: '100%', height: 'auto' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies
                    .filter(geo => geo.properties?.name !== 'Antarctica')
                    .map(geo => {
                      const rawName = geo.properties?.name || ''
                      const normName = normalizeCountryName(rawName)
                      const count = normalizedGeoDataMap.get(normName) ?? 0
                      const model = count > 0 ? getDeliveryModelForCountry(normName) : null

                      // Colors: Onshore = blue (#2f80ed), Nearshore = lighter blue (#a6c8ff), Offshore = red (#e31b23)
                      let fillColor = '#f3f4f6' // fallback/default gray
                      if (count > 0 && model) {
                        if (model === 'Onshore') fillColor = '#1c2d5a'
                        else if (model === 'Nearshore') fillColor = '#2f80ed'
                        else if (model === 'Offshore') fillColor = '#e31b23'
                      }

                      const isSelectedModel = activeModel === null || (model && activeModel === model)
                      const isHovered = hoveredCountry === normName

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fillColor}
                          stroke="#ffffff"
                          strokeWidth={isHovered ? 0.8 : 0.4}
                          onMouseEnter={(event) => {
                            setHoveredCountry(normName)
                            setMapTooltip({
                              show: true,
                              x: event.clientX,
                              y: event.clientY,
                              countryName: normName || rawName,
                              resources: count,
                              model,
                            })
                          }}
                          onMouseMove={(event) => {
                            setMapTooltip(prev => prev ? {
                              ...prev,
                              x: event.clientX,
                              y: event.clientY,
                            } : null)
                          }}
                          onMouseLeave={() => {
                            setHoveredCountry(null)
                            setMapTooltip(null)
                          }}
                          style={{
                            default: {
                              outline: 'none',
                              opacity: count > 0 && !isSelectedModel ? 0.3 : 1,
                              transition: 'opacity 150ms ease, fill 150ms ease',
                            },
                            hover: {
                              outline: 'none',
                              cursor: count > 0 ? 'pointer' : 'default',
                              fill: count > 0 ? fillColor : '#e5e7eb',
                              opacity: 1,
                            },
                            pressed: {
                              outline: 'none',
                            },
                          } as any}
                        />
                      )
                    })
                }
              </Geographies>
            </ComposableMap>

            {/* Custom Mini Map Legend */}
            <div className={styles.dmMiniMapLegend}>
              <div className={styles.dmMiniMapLegendItem}>
                <span className={styles.dmMiniMapLegendDot} style={{ backgroundColor: '#1c2d5a' }} />
                <span>Onshore</span>
              </div>
              <div className={styles.dmMiniMapLegendItem}>
                <span className={styles.dmMiniMapLegendDot} style={{ backgroundColor: '#2f80ed' }} />
                <span>Nearshore</span>
              </div>
              <div className={styles.dmMiniMapLegendItem}>
                <span className={styles.dmMiniMapLegendDot} style={{ backgroundColor: '#e31b23' }} />
                <span>Offshore</span>
              </div>
            </div>

            {/* World Map Floating Tooltip */}
            {mapTooltip && mapTooltip.show && (
              <div
                className={styles.mapTooltip}
                style={{
                  left: `${mapTooltip.x + 12}px`,
                  top: `${mapTooltip.y + 12}px`,
                  position: 'fixed',
                  zIndex: 2000,
                }}
              >
                <div className={styles.mapTooltipCountry}>{mapTooltip.countryName}</div>
                <div className={styles.mapTooltipValue}>
                  {mapTooltip.resources} resource{mapTooltip.resources !== 1 ? 's' : ''}
                </div>
                {mapTooltip.resources > 0 && mapTooltip.model && (
                  <div
                    className={styles.mapTooltipPercentage}
                    style={{
                      color: MODEL_COLORS[mapTooltip.model]?.color,
                      fontWeight: '700',
                    }}
                  >
                    {mapTooltip.model}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Bottom Summary Grid (Onshore / Nearshore / Offshore) ─── */}
      <div className={styles.dmSummaryGrid}>
        {processedModels.map(item => {
          const colorInfo = MODEL_COLORS[item.label] || { color: '#9ca3af', tint: '#f3f4f6' }
          const isSelected = activeModel === item.label

          return (
            <div
              key={item.label}
              className={`${styles.dmSummaryCard} ${isSelected ? styles.dmSummaryCardSelected : ''}`}
              style={{
                backgroundColor: colorInfo.tint,
                borderColor: isSelected ? colorInfo.color : 'transparent',
              }}
              onMouseEnter={() => setActiveModel(item.label)}
              onMouseLeave={() => setActiveModel(null)}
            >
              <div className={styles.dmCardTop}>
                <span
                  className={styles.dmCardDot}
                  style={{ backgroundColor: colorInfo.color }}
                />
                <span className={styles.dmCardName}>
                  {item.label} {item.label === 'Onshore' ? '(US)' : item.label === 'Nearshore' ? '(Americas)' : '(India, Philippines, etc.)'}
                </span>
              </div>

              <div className={styles.dmCardContent}>
                <span className={styles.dmCardCount}>{item.value}</span>
                <span
                  className={styles.dmCardBadge}
                  style={{
                    color: colorInfo.color,
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {item.percentage.toFixed(0)}% of total
                </span>
                <SinglePersonIcon className={styles.dmCardIcon} color={`${colorInfo.color}33`} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}