/**
 * DeliveryModelTab
 *
 * Redesigned "Onshore / Nearshore / Offshore" dashboard tab.
 *
 * Receives data already fetched from monday.com via the existing hook/service.
 * Does NOT fetch data, does NOT hardcode any counts, percentages, or labels.
 *
 * Layout:
 *   Header card  (title + total project resources)
 *   Three-column section: donut | horizontal bar chart | breakdown table
 *   KPI summary cards row
 *
 * Color rules (matching reference image):
 *   Offshore  → red        (#c8102e)
 *   Onshore   → dark navy  (#1d3557)
 *   Nearshore → medium blue (#457b9d)
 *   Any other label → palette fallback
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
import styles from './DeliveryModelTab.module.scss'

// ─── Color map ─────────────────────────────────────────────────────────────────
// Normalise label → canonical key for color lookup.
// Handles common casing/hyphen variations from monday.com.

const FALLBACK_COLORS = [
  '#2a9d8f', '#e9c46a', '#f4a261', '#264653',
  '#6d6875', '#b5838d', '#0d6efd', '#6610f2',
]

function normaliseLabel(raw: string): string {
  const s = raw.trim().toLowerCase().replace(/[-\s]+/g, '')
  if (s === 'offshore' || s === 'offshore') return 'Offshore'
  if (s === 'onshore') return 'Onshore'
  if (s === 'nearshore') return 'Nearshore'
  return raw.trim() // preserve original casing for unknowns
}

function getDeliveryColor(canonicalLabel: string, fallbackIndex: number): string {
  switch (canonicalLabel) {
    case 'Offshore':  return '#c8102e'
    case 'Onshore':   return '#1d3557'
    case 'Nearshore': return '#457b9d'
    default:          return FALLBACK_COLORS[fallbackIndex % FALLBACK_COLORS.length]
  }
}

// ─── Derived entry type ────────────────────────────────────────────────────────

interface ModelEntry {
  label: string       // canonical display label
  rawLabel: string    // original label from monday.com
  value: number
  percent: number
  color: string
  rank: number
}

function buildEntries(data: ChartDataPoint[], total: number): ModelEntry[] {
  // Sort descending by count (backend already does this, but be safe)
  const sorted = [...data].sort((a, b) => b.value - a.value)
  return sorted.map((d, i) => {
    const canonical = normaliseLabel(d.label)
    return {
      label:    canonical,
      rawLabel: d.label,
      value:    d.value,
      percent:  total > 0 ? (d.value / total) * 100 : 0,
      color:    getDeliveryColor(canonical, i),
      rank:     i + 1,
    }
  })
}

// ─── Shared tooltip ────────────────────────────────────────────────────────────

function ModelTooltipContent({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const entry: ModelEntry = payload[0].payload
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDot} style={{ background: entry.color }} />
      <div>
        <p className={styles.tooltipName}>{entry.label}</p>
        <p className={styles.tooltipValue}>{entry.value} resources</p>
        <p className={styles.tooltipPct}>{entry.percent.toFixed(0)}% of total</p>
      </div>
    </div>
  )
}

// ─── Donut chart ───────────────────────────────────────────────────────────────

function DonutChart({
  entries,
  total,
  active,
  onHover,
  onClick,
}: {
  entries: ModelEntry[]
  total: number
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  if (!entries.length) return null

  return (
    <div className={styles.donutSection}>
      <h3 className={styles.sectionTitle}>Share of project resources</h3>

      <div className={styles.donutWrapper}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={entries}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={115}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
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
            <Tooltip content={<ModelTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Floating centre label */}
        <div className={styles.donutCenter} aria-hidden="true">
          <span className={styles.donutTotal}>{total}</span>
          <span className={styles.donutCenterLine}>Total</span>
          <span className={styles.donutCenterLine}>Resources</span>
        </div>
      </div>

      {/* Legend with percentage callouts */}
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

// ─── Horizontal bar chart ──────────────────────────────────────────────────────

function HorizontalBarChart({
  entries,
  active,
  onHover,
  onClick,
}: {
  entries: ModelEntry[]
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  if (!entries.length) return null
  const maxVal = entries[0]?.value ?? 0

  return (
    <div className={styles.barSection}>
      <h3 className={styles.sectionTitle}>Resources by Delivery Model</h3>

      <div className={styles.barList}>
        {entries.map(e => {
          const isActive = active === null || active === e.label
          const fillPct   = maxVal > 0 ? (e.value / maxVal) * 100 : 0
          return (
            <div
              key={e.label}
              className={`${styles.barRow} ${!isActive ? styles.barRowDim : ''}`}
              onMouseEnter={() => onHover(e.label)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onClick(e.label)}
              role="button"
              tabIndex={0}
              aria-label={`${e.label}: ${e.value} resources, ${e.percent.toFixed(0)}%`}
              onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') onClick(e.label) }}
            >
              <span className={styles.barLabel}>{e.label}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${fillPct}%`, background: e.color, opacity: isActive ? 1 : 0.3 }}
                />
              </div>
              <span className={styles.barCount}>{e.value}</span>
              <span
                className={styles.barPctBadge}
                style={{
                  background: e.color + '1a',
                  color: e.color,
                  opacity: isActive ? 1 : 0.4,
                }}
              >
                {e.percent.toFixed(0)}%
              </span>
            </div>
          )
        })}
      </div>

      {/* X-axis ticks */}
      <div className={styles.barXAxis}>
        {maxVal > 0 && (() => {
          const steps = 4
          const step  = Math.ceil(maxVal / steps / 10) * 10 || 10
          const ticks = Array.from({ length: Math.floor(maxVal / step) + 2 }, (_, i) => i * step).filter(v => v <= maxVal + step)
          return ticks.map(t => (
            <span key={t} className={styles.barXTick}>{t}</span>
          ))
        })()}
      </div>
    </div>
  )
}

// ─── Breakdown table ───────────────────────────────────────────────────────────

function BreakdownTable({
  entries,
  active,
  onHover,
  onClick,
}: {
  entries: ModelEntry[]
  active: string | null
  onHover: (label: string | null) => void
  onClick: (label: string) => void
}) {
  return (
    <div className={styles.tableSection}>
      <h3 className={styles.sectionTitle}>Resources by Project and Delivery Model</h3>
      <table className={styles.table} aria-label="Delivery model resource breakdown">
        <thead>
          <tr>
            <th className={styles.thHash}>#</th>
            <th className={styles.thModel}>Delivery Model</th>
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
                    style={{ background: e.color + '20', color: e.color }}
                  >
                    {e.rank}
                  </span>
                </td>
                <td className={styles.tdModel}>{e.label}</td>
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

// ─── KPI summary cards ─────────────────────────────────────────────────────────

// Card background tints per canonical label
function cardBg(label: string): string {
  switch (label) {
    case 'Offshore':  return '#fde8ea'   // light red/pink
    case 'Onshore':   return '#e8edf4'   // very light navy blue
    case 'Nearshore': return '#e8f0f7'   // light medium blue
    default:          return '#f3f4f6'
  }
}

function KpiCards({
  entries,
  active,
  onHover,
  onClick,
}: {
  entries: ModelEntry[]
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
            style={{ background: cardBg(e.label) }}
            onMouseEnter={() => onHover(e.label)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(e.label)}
            role="button"
            tabIndex={0}
            aria-label={`${e.label} Resources: ${e.value}, ${e.percent.toFixed(0)}% of total`}
            onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') onClick(e.label) }}
          >
            {/* Header row */}
            <div className={styles.kpiHeader}>
              {/* People icon — same Feather/Lucide "users" style as Resources by Project page */}
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
                {e.label} Resources
              </span>
            </div>

            {/* Count + badge + ghost icon */}
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
              {/* Compact circular icon container — same style as Resources by Project summary cards */}
              <span
                className={styles.kpiGhostCircle}
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

// ─── Main export ───────────────────────────────────────────────────────────────

interface DeliveryModelTabProps {
  /** ChartDataPoint[] sorted descending from backend (onshore-nearshore-offshore chart) */
  data: ChartDataPoint[]
  /** Total active project resources (analytics.totalRecords) */
  totalRecords: number
}

export default function DeliveryModelTab({ data, totalRecords }: DeliveryModelTabProps) {
  const [active, setActive] = useState<string | null>(null)

  const entries = buildEntries(data, totalRecords)

  function handleHover(label: string | null) { setActive(label) }
  function handleClick(label: string) { setActive(prev => prev === label ? null : label) }

  if (!entries.length) {
    return (
      <div className={styles.empty}>
        <p>No delivery model data is currently available.</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>

      {/* ── Header card ─────────────────────────────────────── */}
      <div className={styles.headerCard}>
        <div className={styles.headerLeft}>
          <h2 className={styles.headerTitle}>Project Resources by Delivery Model</h2>
          <p className={styles.headerDesc}>
            Distribution of project resources across Onshore, Nearshore, and Offshore delivery models.
          </p>
        </div>
        <div className={styles.headerRight}>
          {/* People icon — same Feather/Lucide "users" style as Resources by Project page */}
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
            <span className={styles.headerTotalNum}>{totalRecords}</span>
            <span className={styles.headerTotalLabel}>Project resources</span>
          </div>
        </div>
      </div>

      {/* ── Three-column analytics row ──────────────────────── */}
      <div className={styles.analyticsRow}>
        <DonutChart
          entries={entries}
          total={totalRecords}
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

      {/* ── KPI summary cards ───────────────────────────────── */}
      <KpiCards
        entries={entries}
        active={active}
        onHover={handleHover}
        onClick={handleClick}
      />

    </div>
  )
}
