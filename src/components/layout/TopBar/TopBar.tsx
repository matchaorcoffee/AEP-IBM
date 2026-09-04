import styles from './TopBar.module.scss'
import aepLogo from '../../assets/AEP.png'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus()
    }
  }, [searchOpen])

  // Close user menu on click-outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [userMenuOpen])

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`)
      setSearchOpen(false)
      setSearchValue('')
    }
    if (e.key === 'Escape') {
      setSearchOpen(false)
      setSearchValue('')
    }
  }

  return (
    <header className={styles.topBar} role="banner">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Left: IBM branding */}
      <div className={styles.brand}>
        <img src={aepLogo} alt="AEP" className={styles.aepLogo} />
        <span className={styles.brandName}>
          <strong>IBM</strong> Client Vantage
        </span>
      </div>

      {/* Right: utility icons */}
      <div className={styles.actions}>
        {/* Inline search expansion */}
        {searchOpen && (
          <div className={styles.searchExpand}>
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search resources, events, portfolios…"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search"
            />
            <button
              className={styles.iconBtn}
              onClick={() => { setSearchOpen(false); setSearchValue('') }}
              aria-label="Close search"
            >
              <img src="/src/assets/icons/icon-close.svg" alt="" width={20} height={20} />
            </button>
          </div>
        )}

        {!searchOpen && (
          <button className={styles.iconBtn} onClick={() => setSearchOpen(true)} aria-label="Open search">
            <img src="/src/assets/icons/icon-search.svg" alt="" width={20} height={20} />
          </button>
        )}

        <div className={styles.divider} />

        <button className={styles.iconBtn} aria-label="Favourites">
          <img src="/src/assets/icons/icon-heart.svg" alt="" width={20} height={20} />
        </button>
        <button className={styles.iconBtn} aria-label="Share">
          <img src="/src/assets/icons/icon-share.svg" alt="" width={20} height={20} />
        </button>
        <button className={styles.iconBtn} aria-label="Messages">
          <img src="/src/assets/icons/icon-chat.svg" alt="" width={20} height={20} />
        </button>
        <button className={styles.iconBtn} aria-label="Calendar">
          <img src="/src/assets/icons/icon-calendar-badge.svg" alt="" width={20} height={20} />
        </button>
        <button className={styles.iconBtn} aria-label="Notifications">
          <img src="/src/assets/icons/icon-notification.svg" alt="" width={20} height={20} />
        </button>

        {/* User avatar with dropdown */}
        <div className={styles.userMenu} ref={userMenuRef}>
          <button
            className={`${styles.iconBtn} ${styles.avatarBtn}`}
            onClick={() => setUserMenuOpen(v => !v)}
            aria-label="User menu"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
          >
            <span className={styles.avatarCircle}>SJ</span>
          </button>

          {userMenuOpen && (
            <div className={styles.dropdown} role="menu">
              <button role="menuitem" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                Profile
              </button>
              <button role="menuitem" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                Settings
              </button>
              <div className={styles.dropdownDivider} />
              <button role="menuitem" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
