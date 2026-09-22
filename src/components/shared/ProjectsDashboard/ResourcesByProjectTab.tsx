/**
 * ResourcesByProjectTab
 *
 * "Proactive Resources by Project" dashboard tab.
 * Visual design matches DeliveryModelTab (Project Resources by Delivery Model page).
 *
 * Does NOT fetch data, does NOT hardcode project names, counts, or percentages.
 * All values come dynamically from monday.com via the existing hook/service.
 *
 * Layout:
 *   Header card  (title + description | total KPI)
 *   Three columns: donut chart | horizontal bar chart | breakdown table
 *   Summary cards: 3-column grid, one card per project
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
import styles from './ResourcesByProjectTab.module.scss'

// ─── Color palette ─────────────────────────────────────────────────────────────
// Ordered: largest → smallest project (index 0 = dominant project)
const PROJECT_COLORS = [
  '#c8102e', // red        — largest
  '#1d3557', // dark navy  — 2nd
  '#4a90d9', // blue       — 3rd
  '#e88fa0', // pink/coral — 4th
  '#2a9d8f', // teal       — 5th
  '#e9c46a', // gold       — 6th
  '#f4a261', // orange     — 7th
  '#457b9d', // steel blue — 8th
  '#6d6875', // muted purple
  '#b5838d', // rose
  '#264653', // dark teal
  '#0d6efd', // bright blue
  '#198754', // green
  '#6610f2', // violet
]

function getProjectColor(index: number): string {
  return PROJECT_COLORS[index % PROJECT_COLORS.length]
}

// ─── Derived data helper ───────────────────────────────────────────────────────

interface ProjectEntry {
  label: string
  value: number
  percent: number
  color: string
  rank: number
}

function buildProjectEntries(data: ChartDataPoint[], total: number): ProjectEntry[] {
  // data is already sorted descending by the backend
  return data.map((d, i) => ({
    label: d.label,
    value: d.value,
    percent: total > 0 ? (d.value / total) * 100 : 0,
    color: getProjectColor(i),
    rank: i + 1,
  }))
}

// ─── Recharts donut tooltip ────────────────────────────────────────────────────

function DonutTooltipContent({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const entry = payload[0].payload
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDot} style={{ background: entry.color }} />
      <div>
        <p className={styles.tooltipName}>{entry.name}</p>
        <p className={styles.tooltipValue}>{entry.value} resource{entry.value !== 1 ? 's' : ''}</p>
        <p className={styles.tooltipPct}>{(entry.pctDisplay ?? 0).toFixed(1)}% of total</p>
      </div>
    </div>
  )
}


// ─── Donut chart ──────────────────────────────────────────────────────────────

function DonutChart({
  projects,
  total,
  activeProject,
  onProjectHover,
  onProjectClick,
}: {
  projects: ProjectEntry[]
  total: number
  activeProject: string | null
  onProjectHover: (label: string | null) => void
  onProjectClick: (label: string) => void
}) {
  if (!projects.length) return null

  // IMPORTANT: do NOT spread `percent` into pieData.
  // Recharts treats a field named `percent` as a 0-1 decimal for its built-in
  // label renderer and multiplies by 100 — our `percent` is already 0-100, so
  // spreading it would produce "6667%" labels.
  const pieData = projects.map(p => ({
    name:    p.label,
    label:   p.label,
    value:   p.value,
    color:   p.color,
    rank:    p.rank,
    pctDisplay: p.percent, // renamed — safe for custom tooltip, never touched by Recharts label
  }))

  return (
    <div className={styles.donutSection}>
      <h3 className={styles.sectionTitle}>Proactive resource share</h3>
      <div className={styles.donutWrapper}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={100}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              onMouseEnter={(_: any, index: number) => onProjectHover(pieData[index].label)}
              onMouseLeave={() => onProjectHover(null)}
              onClick={(_: any, index: number) => onProjectClick(pieData[index].label)}
              style={{ cursor: 'pointer' }}
            >
              {pieData.map((entry, index) => {
                const isActive = activeProject === null || activeProject === entry.name
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={isActive ? 1 : 0.25}
                    stroke="none"
                  />
                )
              })}
            </Pie>
            <Tooltip content={<DonutTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div className={styles.donutCenter} aria-hidden="true">
          <span className={styles.donutTotal}>{total}</span>
          <span className={styles.donutCenterLine}>Total</span>
          <span className={styles.donutCenterLine}>Resources</span>
        </div>
      </div>

      {/* Legend — dot + label below the donut */}
      <div className={styles.donutLegend}>
        {projects.map(p => {
          const isActive = activeProject === null || activeProject === p.label
          return (
            <button
              key={p.label}
              className={`${styles.legendItem} ${!isActive ? styles.legendItemDim : ''}`}
              onClick={() => onProjectClick(p.label)}
              onMouseEnter={() => onProjectHover(p.label)}
              onMouseLeave={() => onProjectHover(null)}
              aria-label={`${p.label}: ${p.value} resources`}
            >
              <span className={styles.legendDot} style={{ background: p.color }} />
              <span className={styles.legendText}>{p.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Horizontal bar chart ──────────────────────────────────────────────────────

function HorizontalBarChart({
  projects,
  activeProject,
  onProjectHover,
  onProjectClick,
}: {
  projects: ProjectEntry[]
  activeProject: string | null
  onProjectHover: (label: string | null) => void
  onProjectClick: (label: string) => void
}) {
  if (!projects.length) return null
  const maxVal = projects[0].value

  return (
    <div className={styles.barSection}>
      <h3 className={styles.sectionTitle}>Proactive resources by project</h3>
      <div className={styles.barList}>
        {projects.map(p => {
          const isActive = activeProject === null || activeProject === p.label
          const pct = maxVal > 0 ? (p.value / maxVal) * 100 : 0
          return (
            <div
              key={p.label}
              className={`${styles.barRow} ${!isActive ? styles.barRowDim : ''}`}
              onMouseEnter={() => onProjectHover(p.label)}
              onMouseLeave={() => onProjectHover(null)}
              onClick={() => onProjectClick(p.label)}
              role="button"
              tabIndex={0}
              aria-label={`${p.label}: ${p.value} resources, ${p.percent.toFixed(1)}% of total`}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onProjectClick(p.label) }}
            >
              <span className={styles.barLabel}>{p.label}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${pct}%`,
                    background: p.color,
                    opacity: isActive ? 1 : 0.28,
                  }}
                />
              </div>
              <span className={styles.barCount} style={{ color: p.color }}>
                {p.value}
              </span>
            </div>
          )
        })}
      </div>

      {/* X-axis */}
      {maxVal > 0 && (
        <>
          <div className={styles.xAxisRow}>
            {(() => {
              const step = Math.max(1, Math.ceil(maxVal / 4))
              const ticks: number[] = []
              for (let v = 0; v <= maxVal + step; v += step) ticks.push(v)
              return ticks.map(t => <span key={t} className={styles.xTick}>{t}</span>)
            })()}
          </div>
          <p className={styles.xAxisLabel}>Number of proactive resources</p>
        </>
      )}
    </div>
  )
}

// ─── Breakdown table ───────────────────────────────────────────────────────────

function BreakdownTable({
  projects,
  activeProject,
  onProjectHover,
  onProjectClick,
}: {
  projects: ProjectEntry[]
  activeProject: string | null
  onProjectHover: (label: string | null) => void
  onProjectClick: (label: string) => void
}) {
  return (
    <div className={styles.tableSection}>
      <h3 className={styles.sectionTitle}>Project breakdown</h3>
      <table className={styles.table} aria-label="Project resource breakdown">
        <thead>
          <tr>
            <th className={styles.thHash}>#</th>
            <th className={styles.thProject}>Project</th>
            <th className={styles.thResources}>Proactive Resources</th>
            <th className={styles.thPct}>% of Total</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => {
            const isActive = activeProject === null || activeProject === p.label
            return (
              <tr
                key={p.label}
                className={`${styles.tableRow} ${!isActive ? styles.tableRowDim : ''} ${activeProject === p.label ? styles.tableRowActive : ''}`}
                onMouseEnter={() => onProjectHover(p.label)}
                onMouseLeave={() => onProjectHover(null)}
                onClick={() => onProjectClick(p.label)}
                style={{ cursor: 'pointer' }}
              >
                <td className={styles.tdRank}>
                  <span className={styles.rankBadge} style={{ background: p.color + '22', color: p.color }}>
                    {p.rank}
                  </span>
                </td>
                <td className={styles.tdProject}>{p.label}</td>
                <td className={styles.tdResources}>{p.value}</td>
                <td className={styles.tdPct}>{p.percent.toFixed(0)}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Summary cards ─────────────────────────────────────────────────────────────
// Exact same structure/class-names as KpiCards in DeliveryModelTab.
// kpiGrid → kpiCard → kpiHeader (icon + label) / kpiBody (count + badge + ghost circle)

function SummaryCards({
  projects,
  activeProject,
  onProjectHover,
  onProjectClick,
}: {
  projects: ProjectEntry[]
  activeProject: string | null
  onProjectHover: (label: string | null) => void
  onProjectClick: (label: string) => void
}) {
  return (
    <div className={styles.kpiGrid}>
      {projects.map(p => {
        const isActive = activeProject === null || activeProject === p.label
        return (
          <div
            key={p.label}
            className={`${styles.kpiCard} ${!isActive ? styles.kpiCardDim : ''} ${activeProject === p.label ? styles.kpiCardActive : ''}`}
            style={{ background: p.color + '18' }}
            onMouseEnter={() => onProjectHover(p.label)}
            onMouseLeave={() => onProjectHover(null)}
            onClick={() => onProjectClick(p.label)}
            role="button"
            tabIndex={0}
            aria-label={`${p.label}: ${p.value} resource${p.value !== 1 ? 's' : ''}, ${p.percent.toFixed(0)}% of total`}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onProjectClick(p.label) }}
          >
            {/* Header row: people icon + project name */}
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
                style={{ color: p.color }}
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className={styles.kpiLabel} style={{ color: p.color }}>
                {p.label}
              </span>
            </div>

            {/* Body: large count + percentage pill + ghost circle */}
            <div className={styles.kpiBody}>
              <span className={styles.kpiCount}>{p.value}</span>
              <div className={styles.kpiMeta}>
                <span
                  className={styles.kpiPctBadge}
                  style={{ background: p.color + '22', color: p.color }}
                >
                  {p.percent.toFixed(0)}% of total
                </span>
              </div>
              <span
                className={styles.kpiGhostCircle}
                style={{ background: p.color + '18', color: p.color }}
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

// ─── Main export ───────────────────────────────────────────────────────────────

interface ResourcesByProjectTabProps {
  data: ChartDataPoint[]    // sorted descending from backend
  totalRecords: number       // total proactive resources across all projects
}

export default function ResourcesByProjectTab({ data, totalRecords }: ResourcesByProjectTabProps) {
  const [activeProject, setActiveProject] = useState<string | null>(null)

  const projects = buildProjectEntries(data, totalRecords)

  function handleProjectHover(label: string | null) {
    setActiveProject(label)
  }

  function handleProjectClick(label: string) {
    setActiveProject(prev => (prev === label ? null : label))
  }

  if (!projects.length) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No active resource data available for projects.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>

      {/* ── Header card ─────────────────────────────────────────── */}
      <div className={styles.headerCard}>
        <div className={styles.headerLeft}>
          <h2 className={styles.headerTitle}>Proactive Resources by Project</h2>
          <p className={styles.headerDesc}>
            Resources currently in the AEP In-Progress onboarding state, grouped by project.
          </p>
        </div>
        <div className={styles.headerRight}>
          {/* People / group icon */}
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
            <span className={styles.headerTotalLabel}>Total proactive{'\u00A0'}resources</span>
          </div>
        </div>
      </div>

      {/* ── Three-column analytics section ──────────────────────── */}
      <div className={styles.analyticsRow}>
        <DonutChart
          projects={projects}
          total={totalRecords}
          activeProject={activeProject}
          onProjectHover={handleProjectHover}
          onProjectClick={handleProjectClick}
        />
        <HorizontalBarChart
          projects={projects}
          activeProject={activeProject}
          onProjectHover={handleProjectHover}
          onProjectClick={handleProjectClick}
        />
        <BreakdownTable
          projects={projects}
          activeProject={activeProject}
          onProjectHover={handleProjectHover}
          onProjectClick={handleProjectClick}
        />
      </div>

      {/* ── Summary cards ────────────────────────────────────────── */}
      <SummaryCards
        projects={projects}
        activeProject={activeProject}
        onProjectHover={handleProjectHover}
        onProjectClick={handleProjectClick}
      />
    </div>
  )
}
