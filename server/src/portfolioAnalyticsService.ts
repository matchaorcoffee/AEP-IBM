/**
 * portfolioAnalyticsService.ts
 *
 * Normalization and aggregation layer.
 *
 * ─── VERIFIED COLUMN IDs (from Phase 2 discovery, board 18431218352) ────────
 *
 * Column ID            Title                              Type
 * ─────────────────────────────────────────────────────────────────────
 * name                 Name                               name
 * status__1            Portfolio                          status
 * geography__1         Geography                          status
 * location__1          Location                           text
 * emp_category__1      Emp Category                       status
 * onsite___offshore__1 On/Off/Nearshore                   status
 * core_flex__1         Core/Flex                          status
 * aep_manager__1       AEP Manager                        text/people
 * rate_card_role__1    Rate Card Role                     text
 * tower6__1            Area / Project / Team              long_text
 * on_boarding_status__1 On-Boarding Status                status
 * offboarding_date__1  Offboarding Date                   text
 * offboarding_reason__1 Offboarding Reason                text
 * band__1              Band                               text
 * fte__1               Billability Count (1/0.5/etc)      numbers
 * start_date_in_aep__1 Start Date in AEP                  date
 * emp_id__1            Emp ID                             text
 *
 * ─── VERIFIED PORTFOLIO GROUP MAP (from discover-groups.js, board 18431218352) ─
 *
 * App portfolio slug → one or more monday GROUP IDs.
 * Group IDs were confirmed by running server/discover-groups.js.
 *
 * Portfolio groups that span multiple monday groups (e.g. Energy Delivery,
 * WAM with sub-projects) are specified as arrays; ALL items from ALL listed
 * groups are aggregated together for that portfolio's dashboards.
 *
 * NOTE on "icoe":
 *   No single ICOE group exists.  IGA, GenAI, and ITCT are the closest matches.
 *   Mapped below as a multi-group aggregate until the engagement team confirms.
 *
 * NOTE on "energy-delivery":
 *   Energy Delivery spans several project sub-groups.  All are included.
 *   Verify with the engagement team if any should be excluded.
 */

import type { MondayItem, MondayColumnValue } from './mondayService'
import type { PortfolioAnalytics, ChartDataPoint } from './types'

// ─── Centralized Column IDs ───────────────────────────────────────────────────
/**
 * Single source of truth for all monday column IDs used in dashboard analytics.
 * Do NOT scatter these IDs throughout the codebase.
 */
export const MONDAY_COLUMNS = {
  /** "Portfolio" — status column, used for legacy cross-reference only */
  portfolio: 'status__1',
  /** "Area / Project / Team" — project/team assignment */
  project: 'tower6__1',
  /** "Rate Card Role" — role/job title */
  role: 'rate_card_role__1',
  /** "Location" — city/country location text */
  location: 'location__1',
  /** "Geography" — country (status column) */
  geography: 'geography__1',
  /** "On/Off/Nearshore" — delivery model (Onshore / Nearshore / Offshore) */
  shoreModel: 'onsite___offshore__1',
  /** "Core/Flex" — resource type (Core / Flex / Project / N/A) */
  coreFlex: 'core_flex__1',
  /** "AEP Manager" — the manager responsible for this resource */
  manager: 'aep_manager__1',
  /** "On-Boarding Status" — used to filter active vs rolled-off */
  onboardingStatus: 'on_boarding_status__1',
  /** "Emp Category" — IBM IN Regular, IBM US Regular, SubK, etc. */
  empCategory: 'emp_category__1',
  /** "Emp ID" — stable employee identifier */
  empId: 'emp_id__1',
  /** "Start Date in AEP" */
  startDate: 'start_date_in_aep__1',
  /** "Offboarding Date" */
  offboardingDate: 'offboarding_date__1',
  /** "Offboarding Reason" */
  offboardingReason: 'offboarding_reason__1',
  /** "Billable" — Yes / No billability flag */
  billable: 'billable__1',
} as const

// ─── Portfolio Filter Map ─────────────────────────────────────────────────────
/**
 * Maps app portfolio slug → monday status__1 label.
 *
 * These values are the EXACT strings returned by the status__1 column on
 * board 18431218352, verified by running server/discover-portfolios.js.
 * Filter comparison is case-insensitive.
 *
 * Empty string = no confirmed match — analytics will show empty state.
 */
export const PORTFOLIO_FILTER_MAP: Record<string, string> = {
  'wam':                   'WAM',
  'energy-delivery':       'Energy Delivery',
  'grid-operations':       'Grid Operations',
  'generation-commercial': 'Gen and Comm Ops',
  'automation-coe':        'Automation COE',
  'digital-emerging':      'Digital Emerging Tech',
  'data-platforms':        'Data Platform Services',
  'security':              'Security',
  'customer':              'Customer',
  'shared-services':       'ServiceCo',
  // No single status__1 value maps to ICOE — shows empty until verified
  'icoe':                  '',
}

/**
 * All distinct status__1 values found on board 18431218352 (1,945 items):
 *
 *   236  WAM
 *    48  Energy Delivery
 *    38  Grid Operations
 *    42  Gen and Comm Ops
 *    32  Automation COE
 *    53  Digital Emerging Tech
 *   127  Data Platform Services
 *    66  Security
 *    70  Customer
 *   165  ServiceCo
 *   392  N/A
 *   254  Middleware
 *   107  ADMS
 *    56  EDW Replatform
 *    42  Overall AEP Account
 *    40  MAS Upgrade
 *    33  Transmission Technologies Product Line Services
 *    32  Gen AI
 *    23  IGA
 *    22  ESRI Upgrade
 *    10  MaxMobile
 *    10  ARS Modernization
 *     9  Bill Redesign
 *     9  Field Mobility Services
 *     8  Test COE
 *     6  LSDB
 *     5  WAM for Generation
 *     4  Copperleaf Project
 *     3  Web and Mobile
 *     3  FIS Aligne ETRM Upgrade
 */

// ─── Normalisation ────────────────────────────────────────────────────────────

export interface NormalizedRecord {
  id: string
  name: string
  empId: string
  groupId: string
  groupTitle: string
  portfolio: string
  project: string
  role: string
  location: string
  geography: string
  shoreModel: string
  coreFlex: string
  manager: string
  onboardingStatus: string
  empCategory: string
  startDate: string
  offboardingDate: string
  offboardingReason: string
  billable: string
  /** Full raw column values map for future use */
  raw: Record<string, string>
}

function safeText(cvMap: Record<string, MondayColumnValue>, colId: string): string {
  return cvMap[colId]?.text?.trim() ?? ''
}

export function normalizeItem(item: MondayItem): NormalizedRecord {
  const cvMap: Record<string, MondayColumnValue> = {}
  for (const cv of item.column_values) cvMap[cv.id] = cv

  const raw: Record<string, string> = {}
  for (const cv of item.column_values) raw[cv.id] = cv.text?.trim() ?? ''

  return {
    id: item.id,
    name: item.name?.trim() ?? '',
    empId: safeText(cvMap, MONDAY_COLUMNS.empId),
    groupId: item.group?.id ?? '',
    groupTitle: item.group?.title?.trim() ?? '',
    portfolio: safeText(cvMap, MONDAY_COLUMNS.portfolio),
    project: safeText(cvMap, MONDAY_COLUMNS.project),
    role: safeText(cvMap, MONDAY_COLUMNS.role),
    location: safeText(cvMap, MONDAY_COLUMNS.location),
    geography: safeText(cvMap, MONDAY_COLUMNS.geography),
    shoreModel: safeText(cvMap, MONDAY_COLUMNS.shoreModel),
    coreFlex: safeText(cvMap, MONDAY_COLUMNS.coreFlex),
    manager: safeText(cvMap, MONDAY_COLUMNS.manager),
    onboardingStatus: safeText(cvMap, MONDAY_COLUMNS.onboardingStatus),
    empCategory: safeText(cvMap, MONDAY_COLUMNS.empCategory),
    startDate: safeText(cvMap, MONDAY_COLUMNS.startDate),
    offboardingDate: safeText(cvMap, MONDAY_COLUMNS.offboardingDate),
    offboardingReason: safeText(cvMap, MONDAY_COLUMNS.offboardingReason),
    billable: safeText(cvMap, MONDAY_COLUMNS.billable),
    raw,
  }
}

export function normalizeItems(items: MondayItem[]): NormalizedRecord[] {
  return items.map(normalizeItem)
}


// ─── Filtering ────────────────────────────────────────────────────────────────

/**
 * Returns true if the resource is NOT rolled-off.
 * Excludes on_boarding_status__1 === "Rolled-Off" only.
 * All other statuses (Completed, AEP In-Progress, N/A, Cancelled) are included.
 */
function isNotRolledOff(record: NormalizedRecord): boolean {
  return record.onboardingStatus.toLowerCase() !== 'rolled-off'
}

/**
 * Filter all board records to only those matching this portfolio's status__1 label,
 * excluding any resources that have been rolled off.
 */
export function filterByPortfolio(
  records: NormalizedRecord[],
  portfolioSlug: string
): NormalizedRecord[] {
  const label = PORTFOLIO_FILTER_MAP[portfolioSlug]
  if (label === undefined || label === '') return []
  const labelLower = label.toLowerCase()
  return records.filter(r => r.portfolio.toLowerCase() === labelLower && isNotRolledOff(r))
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

function aggregateByField(
  records: NormalizedRecord[],
  getValue: (r: NormalizedRecord) => string,
  fallback = 'Unspecified'
): ChartDataPoint[] {
  const counts = new Map<string, number>()

  for (const r of records) {
    const raw = getValue(r)?.trim()
    const key = raw || fallback
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Dashboard 1 — Geographic Distribution
 * Source: geography__1
 */
export function aggregateByGeography(records: NormalizedRecord[]): ChartDataPoint[] {
  return aggregateByField(records, r => r.geography)
}

/**
 * Dashboard 2 — CoreFlex
 * Source: core_flex__1
 */
export function aggregateByCoreFlex(records: NormalizedRecord[]): ChartDataPoint[] {
  return aggregateByField(records, r => r.coreFlex)
}

/**
 * Dashboard 3 — Onshore / Nearshore / Offshore
 * Source: onsite___offshore__1
 */
export function aggregateByShoreModel(records: NormalizedRecord[]): ChartDataPoint[] {
  return aggregateByField(records, r => r.shoreModel)
}

/**
 * Dashboard 4 — Resource by Manager
 * Source: aep_manager__1
 * Counts the number of resource items (one item = one resource) per manager.
 */
export function aggregateByManager(records: NormalizedRecord[]): ChartDataPoint[] {
  return aggregateByField(records, r => r.manager, 'Unassigned')
}

/**
 * Dashboard 5 — Billable x Non-Billable
 * Source: billable__1
 */
export function aggregateByBillable(records: NormalizedRecord[]): ChartDataPoint[] {
  return aggregateByField(records, r => r.billable || 'No')
}

// ─── Analytics builder ────────────────────────────────────────────────────────

export function buildPortfolioAnalytics(
  portfolioSlug: string,
  portfolioId: string,
  allRecords: NormalizedRecord[]
): PortfolioAnalytics {
  const records = filterByPortfolio(allRecords, portfolioSlug)

  return {
    portfolioId,
    portfolioSlug,
    updatedAt: new Date().toISOString(),
    totalRecords: records.length,
    charts: [
      {
        id: 'geographic-distribution',
        title: 'Geographic Distribution',
        type: 'bar',
        data: aggregateByGeography(records),
      },
      {
        id: 'core-flex',
        title: 'CoreFlex',
        type: 'bar',
        data: aggregateByCoreFlex(records),
      },
      {
        id: 'onshore-nearshore-offshore',
        title: 'Onshore / Nearshore / Offshore',
        type: 'pie',
        data: aggregateByShoreModel(records),
      },
      {
        id: 'resource-by-manager',
        title: 'Resource by Manager',
        type: 'bar',
        data: aggregateByManager(records),
      },
      {
        id: 'billable-non-billable',
        title: 'Billable x Non-Billable',
        type: 'donut',
        data: aggregateByBillable(records),
      },
    ],
  }
}

// ─── Project Analytics ────────────────────────────────────────────────────────

/**
 * Confirmed project-level status__1 values on board 18431218352.
 * Used to scope all project analytics aggregations.
 */
export const PROJECT_STATUS_VALUES = [
  'MAS Upgrade',
  'ESRI Upgrade',
  'FIS Aligne ETRM Upgrade',
  'IGA',
  'Field Mobility Services',
  'Gen AI',
  'ADMS',
] as const

const PROJECT_STATUS_LOWER = PROJECT_STATUS_VALUES.map(v => v.toLowerCase())

/**
 * Filter all board records to only those whose status__1 matches a known
 * project value, excluding any resources that have been rolled off.
 */
export function filterByProjects(records: NormalizedRecord[]): NormalizedRecord[] {
  return records.filter(
    r => PROJECT_STATUS_LOWER.includes(r.portfolio.toLowerCase()) && isNotRolledOff(r)
  )
}

/**
 * Group active project records by project name (status__1 / portfolio field).
 */
export function aggregateByProject(records: NormalizedRecord[]): ChartDataPoint[] {
  return aggregateByField(records, r => r.portfolio)
}

/**
 * Count resources per project where on-boarding status is "AEP In-Progress".
 */
export function aggregateProactiveByProject(records: NormalizedRecord[]): ChartDataPoint[] {
  const proactive = records.filter(r => r.onboardingStatus.toLowerCase() === 'aep in-progress')
  return aggregateByField(proactive, r => r.portfolio)
}

/**
 * Group rolled-off project resources (within the last 3 calendar months) by
 * offboarding reason.
 *
 * @param allProjectRecords - All project records BEFORE the rolled-off exclusion.
 */
export function aggregateChurnByReason(allProjectRecords: NormalizedRecord[]): ChartDataPoint[] {
  const now = new Date()
  // First day of (currentMonth − 2)
  const cutoff = new Date(now.getFullYear(), now.getMonth() - 2, 1)
  // First day of next month (exclusive upper bound)
  const ceiling = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const churned = allProjectRecords.filter(r => {
    if (r.onboardingStatus.toLowerCase() !== 'rolled-off') return false
    if (!r.offboardingDate) return false
    const d = new Date(r.offboardingDate)
    if (isNaN(d.getTime())) return false
    return d >= cutoff && d < ceiling
  })

  return aggregateByField(churned, r => r.offboardingReason, 'Unspecified')
}

/**
 * Bucket records into the last 3 calendar months by a date field.
 * Always emits all 3 month labels (count defaults to 0 when empty).
 * Items with unparseable or empty dates are excluded.
 *
 * @param records  - The records to bucket.
 * @param getDate  - Returns the ISO date string for each record.
 */
export function aggregateByMonth(
  records: NormalizedRecord[],
  getDate: (r: NormalizedRecord) => string
): ChartDataPoint[] {
  const now = new Date()

  // Build the 3 month buckets (oldest → newest)
  const months = [-2, -1, 0].map(offset => {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1)
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      value: 0,
    }
  })

  for (const r of records) {
    const raw = getDate(r)
    if (!raw) continue
    const d = new Date(raw)
    if (isNaN(d.getTime())) continue

    for (const bucket of months) {
      if (d.getFullYear() === bucket.year && d.getMonth() === bucket.month) {
        bucket.value++
        break
      }
    }
  }

  return months.map(({ label, value }) => ({ label, value }))
}

/**
 * Build the full PortfolioAnalytics object for the Projects view.
 * Aggregates all records whose status__1 matches a PROJECT_STATUS_VALUES entry.
 */
export function buildProjectAnalytics(allRecords: NormalizedRecord[]): PortfolioAnalytics {
  // Filter: project status__1 values only, exclude rolled-off (active records)
  const active = filterByProjects(allRecords)
  // All project records including rolled-off (for churn chart)
  const allProject = allRecords.filter(r =>
    PROJECT_STATUS_LOWER.includes(r.portfolio.toLowerCase())
  )

  return {
    portfolioId: 'projects',
    portfolioSlug: 'projects',
    updatedAt: new Date().toISOString(),
    totalRecords: active.length,
    charts: [
      {
        id: 'resources-by-project',
        title: 'Resources by Project',
        type: 'bar',
        data: aggregateByProject(active),
      },
      {
        id: 'onshore-nearshore-offshore',
        title: 'Onshore / Nearshore / Offshore',
        type: 'pie',
        data: aggregateByShoreModel(active),
      },
      {
        id: 'proactive-count',
        title: 'Proactive Count by Project',
        type: 'bar',
        data: aggregateProactiveByProject(allProject),
      },
      {
        id: 'churn-by-reason',
        title: 'Resource Churn By Reason',
        type: 'bar',
        data: aggregateChurnByReason(allProject),
      },
      {
        id: 'monthly-onboarding',
        title: 'Monthly Onboarding',
        type: 'bar',
        data: aggregateByMonth(
          allProject.filter(
            r =>
              r.onboardingStatus.toLowerCase() === 'completed' ||
              r.onboardingStatus.toLowerCase() === 'aep in-progress'
          ),
          r => r.startDate
        ),
      },
      {
        id: 'monthly-offboarding',
        title: 'Monthly Offboarding',
        type: 'bar',
        data: aggregateByMonth(
          allProject.filter(r => r.onboardingStatus.toLowerCase() === 'rolled-off'),
          r => r.offboardingDate
        ),
      },
      {
        id: 'monthly-resource-count',
        title: 'Monthly Resource Count',
        type: 'bar',
        data: aggregateByMonth(active, r => r.startDate),
      },
    ],
  }
}
