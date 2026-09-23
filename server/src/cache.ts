/**
 * cache.ts
 *
 * Shared in-process cache for the full monday board.
 * No TTL — once loaded, data stays valid until explicitly replaced by a
 * successful forceRefreshCache() call or until the Node.js process restarts.
 * First load fetches from monday (~5-10s); all subsequent requests are served
 * instantly from memory regardless of age.
 */

import { fetchAllBoardItems } from './mondayService'
import { normalizeItems } from './portfolioAnalyticsService'
import type { NormalizedRecord } from './portfolioAnalyticsService'

interface CacheEntry {
  records: NormalizedRecord[]
  fetchedAt: Date
}

let cache: CacheEntry | null = null
let inflightPromise: Promise<NormalizedRecord[]> | null = null

export async function getCachedRecords(forceRefresh = false): Promise<NormalizedRecord[]> {
  // Return cached data immediately if it exists and no explicit refresh was requested
  if (!forceRefresh && cache) {
    return cache.records
  }

  // Deduplicate concurrent requests
  if (inflightPromise) return inflightPromise

  inflightPromise = fetchAllBoardItems()
    .then(items => {
      const records = normalizeItems(items)
      cache = { records, fetchedAt: new Date() }
      inflightPromise = null
      return records
    })
    .catch(err => {
      inflightPromise = null
      throw err
    })

  return inflightPromise
}

export function getCacheMetadata(): { fetchedAt: Date | null; recordCount: number } {
  return {
    fetchedAt: cache?.fetchedAt ?? null,
    recordCount: cache?.records.length ?? 0,
  }
}

/**
 * forceRefreshCache
 *
 * Used by the scheduled POST /api/refresh-cache endpoint.
 *
 * Behaviour:
 *  - If a Monday fetch is already in-flight (from a concurrent dashboard request
 *    or a previous refresh), waits for that same Promise to settle rather than
 *    starting a redundant second request.
 *  - Fetches fresh data from Monday.com.
 *  - ONLY replaces the shared cache after a fully successful fetch + transform.
 *  - If Monday fails or returns bad data the existing cache is left intact and
 *    the error is re-thrown so the caller can return an appropriate 5xx.
 *
 * Returns the number of records written into the cache.
 */
export async function forceRefreshCache(): Promise<number> {
  // Re-use any already in-flight request (deduplication)
  if (inflightPromise) {
    const records = await inflightPromise
    return records.length
  }

  inflightPromise = fetchAllBoardItems()
    .then(items => {
      const records = normalizeItems(items)
      // Only update cache after successful fetch + transform
      cache = { records, fetchedAt: new Date() }
      inflightPromise = null
      return records
    })
    .catch(err => {
      inflightPromise = null
      // Cache is intentionally NOT cleared — previous data remains valid
      throw err
    })

  const records = await inflightPromise
  return records.length
}
