/**
 * useProjectAnalytics.ts
 *
 * React hook that manages the lifecycle of project analytics data:
 *   - Fetches once on mount
 *   - Handles loading, error, empty states
 *   - Supports manual refresh
 *   - No slug parameter — uses the fixed /api/projects/analytics endpoint
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getProjectAnalytics,
  getCachedProjectFetchedAt,
  type PortfolioAnalytics,
} from '../services/portfolioAnalyticsService'
import type { UsePortfolioAnalyticsResult } from './usePortfolioAnalytics'

export function useProjectAnalytics(): UsePortfolioAnalyticsResult {
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null)
  const [status, setStatus] = useState<import('./usePortfolioAnalytics').AnalyticsStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchAnalytics = useCallback((forceRefresh: boolean) => {
    setStatus('loading')
    if (forceRefresh) setIsRefreshing(true)

    getProjectAnalytics(forceRefresh)
      .then(data => {
        setAnalytics(data)
        setStatus('success')
        setError(null)
        setLastUpdated(new Date())
      })
      .catch(err => {
        // AbortError means the component unmounted — not a user-visible error
        if (err instanceof Error && err.name === 'AbortError') return

        const msg = err instanceof Error ? err.message : 'Analytics unavailable'
        setStatus('error')
        setError(msg)
      })
      .finally(() => {
        setIsRefreshing(false)
      })
  }, [])

  // Fetch once on mount
  useEffect(() => {
    setLastUpdated(getCachedProjectFetchedAt())
    fetchAnalytics(false)
  }, [fetchAnalytics])

  const refresh = useCallback(() => {
    if (isRefreshing) return
    fetchAnalytics(true)
  }, [isRefreshing, fetchAnalytics])

  return { analytics, status, error, lastUpdated, refresh, isRefreshing }
}
