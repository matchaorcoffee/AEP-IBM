# Projects Dashboard — Live Data Plan

## Overview

Replace all 9 static image chart cards on the Projects page with live React
chart components driven by monday board 18431218352.

7 charts become real data-driven components.
2 charts (Average Fulfillment Time and Demand Management) remain as static
images — they have no monday data source.

The data flows through the same backend pipeline already used by portfolio
dashboards: monday → backend → `/api/projects/analytics` → React charts.

**Board ID:** 18431218352  
**Filter:** `status__1` values that are project-level (not portfolio-level)

---

## Architecture

```
monday Board 18431218352
        ↓
All items (cached 5 min)
        ↓
Filter: status__1 IN project values list
Exclude: on_boarding_status__1 = "Rolled-Off"  (for active charts)
        ↓
Aggregations (7 charts)
        ↓
GET /api/projects/analytics
        ↓
useProjectAnalytics hook
        ↓
ProjectsDashboard component
        ↓
ProjectsPage — replaces 7 static image cards
```

---

## Confirmed Project Status__1 Values

These are the confirmed project-level `status__1` values from board discovery:

- MAS Upgrade
- ESRI Upgrade
- FIS Aligne ETRM Upgrade
- IGA
- Field Mobility Services
- Gen AI
- ADMS

---

## The 7 Live Charts

| # | Chart title | Source | Filter | Chart type |
|---|-------------|--------|--------|------------|
| 1 | Resources by Project | `status__1` | active (not rolled-off) | Horizontal bar |
| 2 | Onshore / Nearshore / Offshore | `onsite___offshore__1` | active | Pie |
| 3 | Proactive Count by Project | `on_boarding_status__1` | `= "AEP In-Progress"`, grouped by `status__1` | Horizontal bar |
| 4 | Resource Churn By Reason | `offboarding_reason__1` | rolled-off only (last 3 months via `offboarding_date__1`) | Bar |
| 5 | Monthly Onboarding | `start_date_in_aep__1` | `on_boarding_status__1 = "Completed"`, last 3 months | Bar |
| 6 | Monthly Offboarding | `offboarding_date__1` | rolled-off, last 3 months | Bar |
| 7 | Monthly Resource Count | `start_date_in_aep__1` | active, last 3 months | Bar |

## The 2 Static Image Charts (no monday data)

| # | Chart title | Keep as |
|---|-------------|---------|
| 8 | Average Fulfillment Time | Static image |
| 9 | Demand Management Forecast | Static image |

---

## Existing Pattern to Follow

The portfolio dashboard is already fully implemented and sets the pattern:

**Backend:**
- `server/src/mondayService.ts` — `REQUIRED_COLUMN_IDS`, `fetchAllBoardItems()`
- `server/src/portfolioAnalyticsService.ts` — `normalizeItem()`, `aggregateByField()`, `buildPortfolioAnalytics()`
- `server/src/cache.ts` — `getCachedRecords()` (5-min TTL, shared across all endpoints)
- `server/src/types.ts` — `PortfolioAnalytics`, `ChartDefinition`, `ChartDataPoint`
- `server/src/index.ts` — `GET /api/portfolios/:slug/analytics`

**Frontend:**
- `src/services/portfolioAnalyticsService.ts` — `getPortfolioAnalytics()`, 5-min client cache
- `src/hooks/usePortfolioAnalytics.ts` — React hook pattern with slug-guard
- `src/components/shared/PortfolioDashboard/PortfolioDashboard.tsx` — tab-based dashboard
- Sub-components: `GeographicMap`, `CoreFlexDashboard`, `DeliveryModelDashboard`,
  `ResourceByManagerDashboard`, `BillableNonBillableDashboard`

The Projects dashboard follows the same architecture but uses a single fixed
endpoint (`/api/projects/analytics`) instead of a per-slug route.

---

## Sub-Tasks

### Sub-Task 1 — Add missing columns to backend fetch
**Status:** [ ] pending

**Intent:**  
Add `offboarding_reason__1`, `start_date_in_aep__1`, `offboarding_date__1`
to `REQUIRED_COLUMN_IDS` in `mondayService.ts`. These are already modelled in
`NormalizedRecord` but not currently fetched (column filtering at the GraphQL
level means they return empty strings without this change).

**Files:**
- `server/src/mondayService.ts` — add 3 IDs to `REQUIRED_COLUMN_IDS` array (line ~132)

**Expected outcome:**  
After this change the cached records will have non-empty `startDate`,
`offboardingDate`, and `offboardingReason` fields for items that have those
columns populated in monday.

---

### Sub-Task 2 — Add project analytics to backend
**Status:** [ ] pending

**Intent:**  
Add `PROJECT_STATUS_VALUES`, filter/aggregation functions for all 7 live
project charts, a `buildProjectAnalytics()` builder, and a new
`GET /api/projects/analytics` route.

The `PortfolioAnalytics` response shape (from `server/src/types.ts`) is reused
unchanged — the endpoint just returns the same `{ charts, totalRecords, updatedAt }`
structure without a slug parameter.

**Files:**
- `server/src/portfolioAnalyticsService.ts` — add:
  - `PROJECT_STATUS_VALUES` array (the 7 confirmed values)
  - `filterByProjects(records)` — status__1 IN project values AND not rolled-off
  - `aggregateByProject(records)` — group-by status__1, count items
  - `aggregateProactiveByProject(records)` — filter `onboardingStatus = "AEP In-Progress"`, group by status__1
  - `aggregateChurnByReason(records)` — filter rolled-off + last 3 months by offboardingDate, group by offboardingReason
  - `aggregateByMonth(records, dateField, filterFn?)` — reusable monthly bucketer (last 3 months)
  - `buildProjectAnalytics(allRecords)` — assembles all 7 charts

- `server/src/index.ts` — add `GET /api/projects/analytics` route (mirrors portfolio route but no slug)

**Expected outcome:**  
`GET https://aep-ibm.onrender.com/api/projects/analytics` returns valid JSON with
7 `ChartDefinition` entries and correct `totalRecords` count.

**Monthly bucket logic:**  
Use `new Date()` to get today. Last 3 months = current month − 2 through current month.
Month labels format: `"Jan 2025"`. Items outside that window are excluded.
Items with no date in the relevant column are excluded (not bucketed as "Unspecified").

**Churn last-3-months logic:**  
For chart 4 (Resource Churn By Reason), filter to rolled-off items whose
`offboarding_date__1` falls within the last 3 calendar months — same window
as the monthly charts. Items with no offboarding date are excluded.

---

### Sub-Task 3 — Frontend service + hook
**Status:** [ ] pending

**Intent:**  
Add `getProjectAnalytics()` to the frontend service and create
`useProjectAnalytics` hook — mirrors `usePortfolioAnalytics` exactly but with
no slug parameter (fixed endpoint).

**Files:**
- `src/services/portfolioAnalyticsService.ts` — add `getProjectAnalytics()` using
  a fixed cache key `"projects"` and hitting `/api/projects/analytics`
- `src/hooks/useProjectAnalytics.ts` — new file, mirrors `usePortfolioAnalytics`
  (same `{ analytics, status, error, lastUpdated, refresh, isRefreshing }` return shape)
  but with no slug arg or slug-guard logic

**Expected outcome:**  
`useProjectAnalytics()` can be called from a component, fetches once on mount,
caches for 5 minutes, supports `refresh()`.

---

### Sub-Task 4 — Build ProjectsDashboard component
**Status:** [ ] pending

**Intent:**  
Create a `ProjectsDashboard` component that uses `useProjectAnalytics` and
renders the 7 live charts using the existing `MondayBarChart`, `MondayPieChart`,
`MondayDonutChart` primitives already defined inside `PortfolioDashboard.tsx`.

The simplest approach: extract those chart primitives into a shared location OR
duplicate minimally in `ProjectsDashboard.tsx` (prefer extraction to avoid
duplication — move `MondayBarChart`, `MondayPieChart` etc. to a shared
`src/components/shared/MondayCharts/` location if it doesn't exist yet, then
import from both `PortfolioDashboard.tsx` and `ProjectsDashboard.tsx`).

**Files:**
- `src/components/shared/MondayCharts/` — (new) extract bar, pie, donut chart
  components here if not already done
- `src/components/shared/ProjectsDashboard/ProjectsDashboard.tsx` — new component
- `src/components/shared/ProjectsDashboard/ProjectsDashboard.module.scss` — styles

**Layout:**  
Tab-based, same as `PortfolioDashboard`. One tab per chart. Chart renders in
panel below tabs. Include loading skeleton, error state, empty state.

**Chart descriptions:**  
Each tab panel shows a short description above the chart (same pattern as
`CHART_DESCRIPTIONS` in `PortfolioDashboard.tsx`).

**Expected outcome:**  
`<ProjectsDashboard />` renders with correct tabs for all 7 live charts.
Shows skeleton while loading, error + retry on failure.

---

### Sub-Task 5 — Wire ProjectsDashboard into ProjectsPage
**Status:** [ ] pending

**Intent:**  
In `ProjectsPage.tsx`, replace the 7 live-data static image cards with the
new `<ProjectsDashboard />` component. Keep the 2 static image cards
(Average Fulfillment Time, Demand Management) in place — do not remove them.

The existing page structure (hero, intro/stats, highlights, analytics section,
chart subnav, card grid) should be preserved. The 7 chart cards in `CHART_CARDS`
that are being replaced should be removed from the array; the 2 static ones remain.

**Files:**
- `src/pages/Projects/ProjectsPage.tsx`

**Expected outcome:**  
- `<ProjectsDashboard />` appears in the analytics section above or replacing
  the card grid for the 7 live charts.
- Average Fulfillment Time and Demand Management remain as `ChartCardPanel` cards.
- The chart subnav and "back to top" remain.
- No empty tabs, no broken imports.

---

## Notes for Implementation

- The backend `PortfolioAnalytics` type is reused as-is for the projects
  endpoint. No new types needed in `server/src/types.ts`.
- `getCachedRecords()` is already shared — the projects endpoint benefits from
  the same 5-min cache as portfolio endpoints at zero extra cost.
- The `?refresh=true` query param pattern should be supported on the projects
  endpoint too (same as portfolio route).
- `aggregateByMonth` must produce labels for all 3 months even if count is 0,
  so the bar chart always shows 3 bars (not a confusing 1 or 2 bar chart on quiet months).
- Manager names in `aep_manager__1` are free-text — no mapping needed.
- All `offboarding_reason__1`, `start_date_in_aep__1`, `offboarding_date__1`
  values come through as `.text` strings after normalization.
- Date columns in monday are ISO strings like `"2025-01-15"` in the `.text` field.

---

## Acceptance Checklist

- [ ] `/api/projects/analytics` returns 200 with 7 charts
- [ ] Resources by Project counts match project status__1 groups (active only)
- [ ] Onshore/Nearshore/Offshore pie uses onsite___offshore__1 across all project items
- [ ] Proactive Count shows only AEP In-Progress resources grouped by project
- [ ] Churn By Reason shows only rolled-off resources from last 3 months by reason
- [ ] Monthly Onboarding shows 3-month bucketed bar chart
- [ ] Monthly Offboarding shows 3-month bucketed bar chart
- [ ] Monthly Resource Count shows 3-month bucketed bar chart
- [ ] Average Fulfillment Time remains a static image
- [ ] Demand Management remains a static image
- [ ] Switching to ProjectsPage shows live charts (no placeholder images for the 7)
- [ ] Refresh button fetches fresh data without source code change
- [ ] Token never appears in frontend bundle
