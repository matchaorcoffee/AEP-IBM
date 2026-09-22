/**
 * ResourcesByProjectTab
 *
 * Redesigned "Resources by Project" dashboard tab.
 *
 * Receives data already fetched from monday.com via the existing hook/service.
 * Does NOT fetch data, does NOT hardcode project names, counts, or percentages.
 *
 * Layout:
 *   Header card (title + total active resources)
 *   Three-column section: horizontal bar chart | donut chart | breakdown table
 *   Project summary cards row
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

// ─── Tooltip content (shared across bar + donut) ───────────────────────────────

interface TooltipData {
  label: string
  value: number
  percent: number
  color: string
}

function ProjectTooltip({ data }: { data: TooltipData }) {
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDot} style={{ background: data.color }} />
      <div>
        <p className={styles.tooltipName}>{data.label}</p>
        <p className={styles.tooltipValue}>{data.value} resources</p>
        <p className={styles.tooltipPct}>{data.percent.toFixed(1)}% of total</p>
      </div>
    </div>
  )
}

// ─── Recharts donut tooltip ────────────────────────────────────────────────────

function DonutTooltipContent({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const entry: ProjectEntry = payload[0].payload
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDot} style={{ background: entry.color }} />
      <div>
        <p className={styles.tooltipName}>{entry.label}</p>
        <p className={styles.tooltipValue}>{entry.value} resources</p>
        <p className={styles.tooltipPct}>{entry.percent.toFixed(1)}% of total</p>
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
      <h3 className={styles.sectionTitle}>Resources by Project</h3>
      <div className={styles.barList}>
        {projects.map(p => {
          const isActive = activeProject === null || activeProject === p.label
          const pct = maxVal > 0 ? (p.value / maxVal) * 100 : 0
          return (
            <div
              key={p.label}
              className={`${styles.barRow} ${!isActive ? styles.barRowDimmed : ''}`}
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
                    opacity: isActive ? 1 : 0.35,
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

  // Recharts Pie uses the full entry as payload so we can colour + highlight
  const pieData = projects.map(p => ({
    ...p,
    name: p.label,
    // dim non-active segments via opacity in the Cell
  }))

  return (
    <div className={styles.donutSection}>
      <h3 className={styles.sectionTitle}>Share of resources by project</h3>
      <div className={styles.donutWrapper}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={115}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              onMouseEnter={(_: any, index: number) => onProjectHover(pieData[index].label)}
              onMouseLeave={() => onProjectHover(null)}
              onClick={(_: any, index: number) => onProjectClick(pieData[index].label)}
              style={{ cursor: 'pointer' }}
            >
              {pieData.map((entry, index) => {
                const isActive = activeProject === null || activeProject === entry.label
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={isActive ? 1 : 0.3}
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
          <span className={styles.donutTotalLabel}>Total</span>
          <span className={styles.donutTotalLabel}>Resources</span>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.donutLegend}>
        {projects.map(p => {
          const isActive = activeProject === null || activeProject === p.label
          return (
            <button
              key={p.label}
              className={`${styles.legendItem} ${!isActive ? styles.legendItemDimmed : ''}`}
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
            <th className={styles.thResources}>Resources</th>
            <th className={styles.thPct}>% of Total</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => {
            const isActive = activeProject === null || activeProject === p.label
            return (
              <tr
                key={p.label}
                className={`${styles.tableRow} ${!isActive ? styles.tableRowDimmed : ''} ${activeProject === p.label ? styles.tableRowHighlighted : ''}`}
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
                <td className={styles.tdPct}>{p.percent.toFixed(1)}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Summary cards ─────────────────────────────────────────────────────────────

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
    <div className={styles.cardsGrid}>
      {projects.map(p => {
        const isActive = activeProject === null || activeProject === p.label
        return (
          <div
            key={p.label}
            className={`${styles.summaryCard} ${!isActive ? styles.summaryCardDimmed : ''} ${activeProject === p.label ? styles.summaryCardHighlighted : ''}`}
            style={{
              borderTop: `3px solid ${p.color}`,
            }}
            onMouseEnter={() => onProjectHover(p.label)}
            onMouseLeave={() => onProjectHover(null)}
            onClick={() => onProjectClick(p.label)}
            role="button"
            tabIndex={0}
            aria-label={`${p.label}: ${p.value} resources, ${p.percent.toFixed(1)}% of total`}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onProjectClick(p.label) }}
          >
            {/* Icon + project name */}
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} style={{ background: p.color + '18', color: p.color }}>
                {/* Resource/document icon (inline SVG) */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
                  <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M5.5 7.5h5M5.5 10h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className={styles.cardName}>{p.label}</span>
            </div>

            {/* Count + percentage row */}
            <div className={styles.cardBody}>
              <span className={styles.cardCount}>{p.value}</span>
              <div className={styles.cardMeta}>
                <span className={styles.cardPct} style={{ color: p.color }}>
                  {p.percent.toFixed(1)}% of total
                </span>
                {/* Ghost people icon */}
                <svg
                  className={styles.cardPeopleIcon}
                  width="28"
                  height="24"
                  viewBox="0 0 28 24"
                  fill="none"
                  aria-hidden="true"
                  style={{ color: p.color }}
                >
                  <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.35"/>
                  <path d="M2 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="1.5" opacity="0.35"/>
                  <circle cx="20" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.2"/>
                  <path d="M18 20c0-3.314 1.343-6 3-6s3 2.686 3 6" stroke="currentColor" strokeWidth="1.5" opacity="0.2"/>
                </svg>
              </div>
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
  totalRecords: number       // total active resources across all projects
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
      <div className={styles.empty}>
        <p>No active resource data available for projects.</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* ── Header card ─────────────────────────────────────────── */}
      <div className={styles.headerCard}>
        <div className={styles.headerLeft}>
          <h2 className={styles.headerTitle}>Resources by Project</h2>
          <p className={styles.headerDesc}>
            Number of active resources assigned to each project. Excludes rolled-off resources.
          </p>
        </div>
        <div className={styles.headerRight}>
          {/* Group / people icon — matches CoreFlex KPI style */}
          <svg
            className={styles.headerIcon}
            width="28"
            height="28"
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
            <span className={styles.headerTotalLabel}>Active resources</span>
          </div>
        </div>
      </div>

      {/* ── Three-column analytics section ──────────────────────── */}
      <div className={styles.analyticsRow}>
        <HorizontalBarChart
          projects={projects}
          activeProject={activeProject}
          onProjectHover={handleProjectHover}
          onProjectClick={handleProjectClick}
        />
        <DonutChart
          projects={projects}
          total={totalRecords}
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
