import { useState, useCallback, useRef } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import styles from './HolidayWorldMap.module.scss'

// Reuse the same bundled TopoJSON already used by GeographicMap
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — JSON import, no type declaration needed
import worldAtlas from '../../components/shared/PortfolioDashboard/world-110m.json'

// ─── Country data ────────────────────────────────────────────────────────────

export interface HolidayCountry {
  id: string
  label: string
  url: string
  /** Imported image asset for the card tile */
  src: string
  /** ISO 3166-1 alpha-3 codes that correspond to this entry on the map */
  isoCodes: string[]
}

// Map entry names in the TopoJSON to our country records.
// The world-110m.json uses `geo.properties.name` strings.
const GEO_NAME_MAP: Record<string, string> = {
  // id → TopoJSON name(s) — first match wins
  brazil:      'Brazil',
  'costa-rica':'Costa Rica',
  india:       'India',
  mexico:      'Mexico',
  philippines: 'Philippines',
  usa:         'United States of America',
  canada:      'Canada',
}

interface Tooltip {
  x: number
  y: number
  name: string
  hasCalendar: boolean
}

interface Props {
  countries: HolidayCountry[]
}

export default function HolidayWorldMap({ countries }: Props) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const [hoveredGeo, setHoveredGeo] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Build lookup: TopoJSON name → country record
  const nameToCountry = new Map<string, HolidayCountry>()
  countries.forEach(c => {
    const geoName = GEO_NAME_MAP[c.id]
    if (geoName) nameToCountry.set(geoName, c)
  })

  const handleMouseEnter = useCallback(
    (geoName: string, evt: React.MouseEvent) => {
      setHoveredGeo(geoName)
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      setTooltip({
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
        name: geoName,
        hasCalendar: nameToCountry.has(geoName),
      })
    },
    [nameToCountry]
  )

  const handleMouseMove = useCallback(
    (evt: React.MouseEvent) => {
      if (!tooltip) return
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      setTooltip(prev =>
        prev ? { ...prev, x: evt.clientX - rect.left, y: evt.clientY - rect.top } : null
      )
    },
    [tooltip]
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredGeo(null)
    setTooltip(null)
  }, [])

  const handleDoubleClick = useCallback(
    (geoName: string) => {
      const country = nameToCountry.get(geoName)
      if (country?.url) {
        window.open(country.url, '_blank', 'noopener,noreferrer')
      }
    },
    [nameToCountry]
  )

  function getCountryFill(geoName: string): string {
    const isHovered = hoveredGeo === geoName
    const hasCalendar = nameToCountry.has(geoName)

    if (isHovered && hasCalendar) return '#c8102e'       // IBM red — hovered + available
    if (isHovered && !hasCalendar) return '#9fb0c8'      // slightly darker neutral on hover
    if (hasCalendar) return '#f4a8b5'                    // soft red tint — available, not hovered
    return '#c9d3de'                                     // neutral blue-grey
  }

  return (
    <div className={styles.wrapper}>
      <div
        ref={containerRef}
        className={styles.mapContainer}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label="Interactive world map — double-click a country to view its holiday calendar"
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 135, center: [10, 28] }}
          width={800}
          height={440}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <Geographies geography={worldAtlas as any}>
            {({ geographies }: { geographies: any[] }) =>
              geographies
                .filter((geo: any) => geo.properties?.name !== 'Antarctica')
                .map((geo: any) => {
                  const geoName: string = geo.properties?.name ?? ''
                  const hasCalendar = nameToCountry.has(geoName)

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getCountryFill(geoName)}
                      stroke="#ffffff"
                      strokeWidth={0.5}
                      style={{
                        default:  { outline: 'none', cursor: hasCalendar ? 'pointer' : 'default', transition: 'fill 180ms ease' },
                        hover:    { outline: 'none', cursor: hasCalendar ? 'pointer' : 'default', transition: 'fill 180ms ease' },
                        pressed:  { outline: 'none' },
                      } as any}
                      onMouseEnter={(evt: React.MouseEvent) => handleMouseEnter(geoName, evt)}
                      onMouseLeave={handleMouseLeave}
                      onDoubleClick={() => handleDoubleClick(geoName)}
                      aria-label={geoName}
                    />
                  )
                })
            }
          </Geographies>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div
            className={styles.tooltip}
            style={{
              left: tooltip.x + 14,
              top:  tooltip.y - 12,
            }}
            aria-hidden="true"
          >
            <span className={styles.tooltipName}>{tooltip.name}</span>
            <span className={styles.tooltipHint}>
              {tooltip.hasCalendar
                ? 'Double-click to view calendar'
                : 'No holiday calendar available'}
            </span>
          </div>
        )}

        {/* Legend */}
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendDotAvailable}`} />
            Available calendar
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendDotNone}`} />
            No calendar available
          </span>
        </div>
      </div>
    </div>
  )
}
