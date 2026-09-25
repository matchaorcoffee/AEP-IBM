import React, { useState, useMemo, useEffect } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps'
import type { ChartDataPoint } from '../../../services/portfolioAnalyticsService'
import styles from './PortfolioDashboard.module.scss'

import worldAtlas from './world-110m.json'

// ─── GeoJSON / TopoJSON Data ────────────────────────────────────────────────
// Offline-safe, bundled directly as static JSON
const GEO_URL = worldAtlas as any

// ─── Color Interpolation Helper ──────────────────────────────────────────────
function interpolateColor(color1: string, color2: string, factor: number): string {
  const r1 = parseInt(color1.substring(1, 3), 16)
  const g1 = parseInt(color1.substring(3, 5), 16)
  const b1 = parseInt(color1.substring(5, 7), 16)

  const r2 = parseInt(color2.substring(1, 3), 16)
  const g2 = parseInt(color2.substring(3, 5), 16)
  const b2 = parseInt(color2.substring(5, 7), 16)

  const r = Math.round(r1 + factor * (r2 - r1))
  const g = Math.round(g1 + factor * (g2 - g1))
  const b = Math.round(b1 + factor * (b2 - b1))

  const rHex = r.toString(16).padStart(2, '0')
  const gHex = g.toString(16).padStart(2, '0')
  const bHex = b.toString(16).padStart(2, '0')

  return `#${rHex}${gHex}${bHex}`
}

// ─── Country Name Normalization ──────────────────────────────────────────────
export function normalizeCountryName(name: string | null | undefined): string {
  if (!name) return ''
  const clean = name.trim().toLowerCase()

  // US Variations
  if (
    clean === 'us' ||
    clean === 'usa' ||
    clean === 'united states' ||
    clean === 'united states of america' ||
    clean.startsWith('u.s')
  ) {
    return 'United States'
  }

  // UK Variations
  if (
    clean === 'uk' ||
    clean === 'united kingdom' ||
    clean === 'u.k' ||
    clean === 'great britain' ||
    clean === 'gb' ||
    clean === 'gbr'
  ) {
    return 'United Kingdom'
  }

  // Philippines Variations
  if (clean === 'philippines' || clean === 'ph' || clean === 'phl') {
    return 'Philippines'
  }

  // Brazil Variations
  if (clean === 'brazil' || clean === 'brasil' || clean === 'br') {
    return 'Brazil'
  }

  // Canada Variations
  if (clean === 'canada' || clean === 'ca') {
    return 'Canada'
  }

  // Mexico Variations
  if (clean === 'mexico' || clean === 'mx') {
    return 'Mexico'
  }

  // India Variations
  if (clean === 'india' || clean === 'in') {
    return 'India'
  }

  // General capitalization of words
  return name.trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

interface GeographicMapProps {
  data: ChartDataPoint[]
}

interface TooltipState {
  show: boolean
  x: number
  y: number
  countryName: string
  resources: number
  percentage: string
}

export default function GeographicMap({ data }: { data: ChartDataPoint[] }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  // ─── Map Data Processing ───────────────────────────────────────────────────
  // Calculate total resources for percentage calculations
  const totalResources = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0)
  }, [data])

  // Find max value in data to establish color scale dynamic range
  const maxResources = useMemo(() => {
    if (data.length === 0) return 0
    return Math.max(...data.map(item => item.value))
  }, [data])

  // Map country name normalizations from data
  const normalizedDataMap = useMemo(() => {
    const map = new Map<string, number>()
    data.forEach(item => {
      const normName = normalizeCountryName(item.label)
      if (normName) {
        map.set(normName, (map.get(normName) ?? 0) + item.value)
      }
    })
    return map
  }, [data])

  // Get color for a country based on resource count
  const getColorForCount = (count: number) => {
    if (count === 0) return '#f3f4f6' // beautiful light gray for no matching data / 0 resources
    if (maxResources <= 0) return '#d6e4ff' // fallback light blue

    const minVal = 1
    const factor = maxResources > minVal
      ? (count - minVal) / (maxResources - minVal)
      : 0.5 // if only one active count, map to mid color gradient

    // Dynamic linear interpolation from light blue (#cfe2fe) to deep navy (#0a2c5c)
    return interpolateColor('#cfe2fe', '#0a2c5c', factor)
  }

  // Get hover color for a country
  const getHoverColorForCount = (count: number) => {
    if (count === 0) return '#e5e7eb' // slightly darker gray on hover for 0 resources
    if (maxResources <= 0) return '#a6c8ff'

    const minVal = 1
    const factor = maxResources > minVal
      ? (count - minVal) / (maxResources - minVal)
      : 0.5

    // Hover is slightly darker / more saturated
    return interpolateColor('#a6c8ff', '#002d9c', factor)
  }

  // Sort countries with resources descending for the summary list
  const activeCountriesSummary = useMemo(() => {
    const list: { name: string; count: number }[] = []
    normalizedDataMap.forEach((count, name) => {
      list.push({ name, count })
    })
    return list.sort((a, b) => b.count - a.count)
  }, [normalizedDataMap])

  // Calculate legend tick marks dynamically (split range into 4 equal segments)
  const legendTicks = useMemo(() => {
    const ticks = [0]
    if (maxResources <= 0) return ticks

    const q1 = Math.round(maxResources * 0.25)
    const q2 = Math.round(maxResources * 0.50)
    const q3 = Math.round(maxResources * 0.75)

    // Deduplicate and push in order
    const set = new Set([0, q1, q2, q3, maxResources])
    return Array.from(set).sort((a, b) => a - b)
  }, [maxResources])

  return (
    <div className={styles.mapCard}>
      {/* ─── Header ─── */}
      <div className={styles.mapHeader}>
        <span className={styles.mapEyebrow}>Resources</span>
        <h3 className={styles.mapHeading}>Distribution of resources by country</h3>
        <p className={styles.mapDescription}>
          Counts all active resources in this portfolio grouped by their Geography field.
        </p>
      </div>

      {/* ─── Large Interactive World Map ─── */}
      <div className={styles.mapWrapper}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 135,
            center: [10, 28], // beautifully frames the continents (US, Brazil, UK, India, Philippines, Canada)
          }}
          width={800}
          height={260}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies
                .filter(geo => geo.properties?.name !== 'Antarctica') // Filter Antarctica to focus the view
                .map(geo => {
                  const rawName = geo.properties?.name || ''
                  const normName = normalizeCountryName(rawName)
                  const count = normalizedDataMap.get(normName) ?? 0
                  const percentage = totalResources > 0
                    ? ((count / totalResources) * 100).toFixed(1)
                    : '0.0'

                  const isHovered = hoveredCountry === normName
                  const fillColor = isHovered ? getHoverColorForCount(count) : getColorForCount(count)

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 0.8 : 0.5}
                      onMouseEnter={(event) => {
                        setHoveredCountry(normName)
                        setTooltip({
                          show: true,
                          x: event.clientX,
                          y: event.clientY,
                          countryName: normName || rawName,
                          resources: count,
                          percentage,
                        })
                      }}
                      onMouseMove={(event) => {
                        setTooltip(prev => prev ? {
                          ...prev,
                          x: event.clientX,
                          y: event.clientY,
                        } : null)
                      }}
                      onMouseLeave={() => {
                        setHoveredCountry(null)
                        setTooltip(null)
                      }}
                      style={{
                        default: {
                          outline: 'none',
                          transition: 'fill 150ms ease',
                        },
                        hover: {
                          outline: 'none',
                          cursor: 'pointer',
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

        {/* ─── Tooltip ─── */}
        {tooltip && tooltip.show && (
          <div
            className={styles.mapTooltip}
            style={{
              left: `${tooltip.x + 12}px`,
              top: `${tooltip.y + 12}px`,
            }}
          >
            <div className={styles.mapTooltipCountry}>{tooltip.countryName}</div>
            <div className={styles.mapTooltipValue}>
              {tooltip.resources} resource{tooltip.resources !== 1 ? 's' : ''}
            </div>
            {tooltip.resources > 0 && (
              <div className={styles.mapTooltipPercentage}>
                {tooltip.percentage}% of total
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Blue Gradient Legend ─── */}
      <div className={styles.legendContainer}>
        <div className={styles.legendLabel}>Number of resources</div>
        <div className={styles.legendGradientWrapper}>
          <div className={styles.legendGradientBar} />
          <div className={styles.legendTicks}>
            {legendTicks.map((tick, index) => (
              <div key={index} className={styles.legendTick}>
                <span className={styles.legendTickLine} />
                <span className={styles.legendTickText}>{tick}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Country Summary Section ─── */}
      <div className={styles.summaryContainer}>
        {activeCountriesSummary.map((item) => {
          const dotColor = getColorForCount(item.count)
          return (
            <div key={item.name} className={styles.summaryItem}>
              <span
                className={styles.summaryDot}
                style={{ backgroundColor: dotColor }}
              />
              <div className={styles.summaryText}>
                <span className={styles.summaryCountryName}>{item.name}</span>
                <span className={styles.summaryResourceCount}>
                  {item.count} resource{item.count !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}