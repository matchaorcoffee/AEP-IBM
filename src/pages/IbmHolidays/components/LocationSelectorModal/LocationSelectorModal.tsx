import React, { useState, useMemo, useEffect, useRef } from 'react'
import styles from './LocationSelectorModal.module.scss'
import type { CountryInfo } from '../../../../models/Holiday'

interface LocationSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  supportedCountries: CountryInfo[]
  primaryCountryIds: string[]
  selectedCountry: string // 'all' | countryId
  onSelectCountry: (countryId: string) => void
}

export default function LocationSelectorModal({
  isOpen,
  onClose,
  supportedCountries,
  primaryCountryIds,
  selectedCountry,
  onSelectCountry,
}: LocationSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('')
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    }
  }, [isOpen])

  // Filter countries by search term (by label or code)
  const filteredCountries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return supportedCountries

    return supportedCountries.filter(c => {
      const matchName = c.label.toLowerCase().includes(term)
      const matchCode = c.code.toLowerCase().includes(term)
      const matchId = c.id.toLowerCase().includes(term)
      return matchName || matchCode || matchId
    })
  }, [supportedCountries, searchTerm])

  const primaryCountries = useMemo(() => {
    return filteredCountries.filter(c => primaryCountryIds.includes(c.id))
  }, [filteredCountries, primaryCountryIds])

  const otherCountries = useMemo(() => {
    return filteredCountries.filter(c => !primaryCountryIds.includes(c.id))
  }, [filteredCountries, primaryCountryIds])

  if (!isOpen) return null

  const handleSelect = (id: string) => {
    onSelectCountry(id)
    onClose()
  }

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.titleArea}>
            <h3 id="location-modal-title" className={styles.modalTitle}>
              Select a Delivery Location
            </h3>
            <p className={styles.modalSubtitle}>
              Choose an AEP–IBM delivery location to view its holiday schedule
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close location selector"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Search locations by name or code (e.g. Philippines, PH, Canada)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Search delivery locations"
          />
          {searchTerm && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* List Content */}
        <div className={styles.locationsBody}>
          {/* Option: View All */}
          {!searchTerm && (
            <div className={styles.allOptionWrapper}>
              <button
                type="button"
                className={`${styles.locationItem} ${styles.allLocationsItem} ${selectedCountry === 'all' ? styles.selected : ''}`}
                onClick={() => handleSelect('all')}
              >
                <span className={styles.locationFlag} aria-hidden="true">🌐</span>
                <div className={styles.locationInfo}>
                  <div className={styles.locationName}>All Delivery Locations</div>
                  <div className={styles.locationSub}>Combined schedule for all delivery hubs</div>
                </div>
                {selectedCountry === 'all' && (
                  <span className={styles.activeCheck} aria-label="Active selection">✓</span>
                )}
              </button>
            </div>
          )}

          {/* Primary Locations Group */}
          {primaryCountries.length > 0 && (
            <div className={styles.group}>
              <div className={styles.groupLabel}>PRIMARY LOCATIONS</div>
              <div className={styles.groupGrid}>
                {primaryCountries.map(c => {
                  const isSelected = selectedCountry === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`${styles.locationItem} ${isSelected ? styles.selected : ''}`}
                      onClick={() => handleSelect(c.id)}
                    >
                      <span className={styles.locationFlag} aria-hidden="true">{c.flag}</span>
                      <div className={styles.locationInfo}>
                        <div className={styles.locationName}>{c.label}</div>
                        <div className={styles.locationSub}>{c.code} · Primary Hub</div>
                      </div>
                      {isSelected && (
                        <span className={styles.activeCheck} aria-label="Active selection">✓</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* All Other Locations Group */}
          {otherCountries.length > 0 && (
            <div className={styles.group}>
              <div className={styles.groupLabel}>
                {primaryCountries.length > 0 ? 'ALL LOCATIONS' : 'MATCHING LOCATIONS'}
              </div>
              <div className={styles.groupGrid}>
                {otherCountries.map(c => {
                  const isSelected = selectedCountry === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`${styles.locationItem} ${isSelected ? styles.selected : ''}`}
                      onClick={() => handleSelect(c.id)}
                    >
                      <span className={styles.locationFlag} aria-hidden="true">{c.flag}</span>
                      <div className={styles.locationInfo}>
                        <div className={styles.locationName}>{c.label}</div>
                        <div className={styles.locationSub}>{c.code} · Delivery Center</div>
                      </div>
                      {isSelected && (
                        <span className={styles.activeCheck} aria-label="Active selection">✓</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Empty Search Result */}
          {filteredCountries.length === 0 && (
            <div className={styles.emptySearch}>
              <p>No delivery locations match &ldquo;{searchTerm}&rdquo;.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
