import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styles from './SearchPage.module.scss'
import { useContent } from '../../context/ContentContext'
import ContentCard from '../../components/shared/ContentCard/ContentCard'

const CONTENT_FILTERS = ['All', 'Document', 'Video', 'Tool', 'Guide', 'Article']

export default function SearchPage() {
  const { searchCards, toggleBookmark } = useContent()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const qParam = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(qParam)
  const [activeFilter, setActiveFilter] = useState('All')

  // Sync input with URL param when it changes (e.g., from top bar search)
  useEffect(() => {
    setInputValue(qParam)
  }, [qParam])

  const results = useMemo(() => {
    return searchCards(qParam, activeFilter !== 'All' ? activeFilter : undefined)
  }, [qParam, activeFilter, searchCards])

  function handleSearch() {
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`, { replace: true })
    } else {
      navigate('/search', { replace: true })
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  function handleClear() {
    setInputValue('')
    setActiveFilter('All')
    navigate('/search', { replace: true })
  }

  return (
    <div className={styles.page}>
      {/* Search bar section */}
      <section className={styles.searchSection} aria-label="Search">
        <div className={styles.searchInner}>
          <h1 className={styles.searchTitle}>Search</h1>
          <div className={styles.searchBar}>
            <img src="/src/assets/icons/icon-search.svg" alt="" className={styles.searchIcon} width={20} height={20} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search resources, portfolios, events…"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Search query"
              autoFocus
            />
            {inputValue && (
              <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
                <img src="/src/assets/icons/icon-close.svg" alt="" width={16} height={16} />
              </button>
            )}
            <button className={styles.searchBtn} onClick={handleSearch}>Search</button>
          </div>

          {/* Content type filter chips */}
          <div className={styles.filters} role="group" aria-label="Filter by content type">
            {CONTENT_FILTERS.map(f => (
              <button
                key={f}
                className={`${styles.chip} ${activeFilter === f ? styles.chipActive : ''}`}
                onClick={() => setActiveFilter(f)}
                aria-pressed={activeFilter === f}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className={styles.results} aria-label="Search results">
        <div className={styles.resultsInner}>
          {qParam && (
            <p className={styles.resultCount}>
              {results.length} result{results.length !== 1 ? 's' : ''} for "<strong>{qParam}</strong>"
            </p>
          )}

          {results.length === 0 ? (
            <div className={styles.empty}>
              <img src="/src/assets/icons/icon-search.svg" alt="" className={styles.emptyIcon} width={48} height={48} />
              <h2 className={styles.emptyTitle}>No results found</h2>
              <p className={styles.emptyBody}>
                {qParam
                  ? `We couldn't find anything matching "${qParam}". Try different keywords or clear your filters.`
                  : 'Enter a search term above to find resources, portfolios, and events.'}
              </p>
              {qParam && (
                <button className={styles.clearAllBtn} onClick={handleClear}>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className={styles.grid}>
              {results.map(card => (
                <ContentCard key={card.id} card={card} onBookmarkToggle={toggleBookmark} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
