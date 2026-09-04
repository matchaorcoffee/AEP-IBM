import styles from './NavTabs.module.scss'
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import aepLogo from '../../../assets/AEP.png'

const NAV_ITEMS = [
  { label: 'Home', path: '/home', hasDropdown: false },
  { label: 'Portfolios', path: '/portfolios', hasDropdown: true },
  { label: 'Projects', path: '/projects', hasDropdown: false },
  { label: 'IBM Holidays', path: '/ibm-holidays', hasDropdown: false },
  { label: 'Partnership', path: '/partnership', hasDropdown: false },
  { label: 'IBM FNCs', path: '/ibm-cics', hasDropdown: false },
]

const PORTFOLIO_ITEMS = [
  { label: 'WAM',                        path: '/portfolios/wam' },
  { label: 'Energy Delivery',            path: '/portfolios/energy-delivery' },
  { label: 'Grid Operations',            path: '/portfolios/grid-operations' },
  { label: 'Generation & Commercial Ops',path: '/portfolios/generation-commercial' },
  { label: 'Shared Services',            path: '/portfolios/shared-services' },
  { label: 'ICOE',                       path: '/portfolios/icoe' },
  { label: 'Automation COE',             path: '/portfolios/automation-coe' },
  { label: 'Digital Emerging Technology',path: '/portfolios/digital-emerging' },
  { label: 'Data Platforms',             path: '/portfolios/data-platforms' },
  { label: 'Security',                   path: '/portfolios/security' },
  { label: 'Customer',                   path: '/portfolios/customer' },
]

export default function NavTabs() {
  const location = useLocation()
  const navigate = useNavigate()
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const portfolioTabRef = useRef<HTMLLIElement>(null)
  const dropdownRef = useRef<HTMLUListElement>(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })

  // Position dropdown under the Portfolios tab
  useEffect(() => {
    if (portfolioDropdownOpen && portfolioTabRef.current) {
      const rect = portfolioTabRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 1, left: rect.left })
    }
  }, [portfolioDropdownOpen])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        portfolioTabRef.current && !portfolioTabRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setPortfolioDropdownOpen(false)
      }
    }
    if (portfolioDropdownOpen) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [portfolioDropdownOpen])

  // Close on route change
  useEffect(() => {
    setMobileNavOpen(false)
    setPortfolioDropdownOpen(false)
  }, [location.pathname])

  function isActive(path: string) {
    return location.pathname.startsWith(path)
  }

  function handlePortfolioItemClick(path: string) {
    setPortfolioDropdownOpen(false)
    navigate(path)
  }

  return (
    <nav className={styles.navTabs} aria-label="Main navigation">
      {/* Channel identity */}
      <div className={styles.channelId}>
        <Link to="/" className={styles.channelLogoLink} aria-label="Go to home">
          <img
            src={aepLogo}
            alt="American Electric Power"
            className={styles.channelLogo}
          />
        </Link>
        <span className={styles.channelDivider} />
      </div>

      {/* Desktop tab list */}
      <ul className={styles.tabList} role="list">
        {NAV_ITEMS.map(item =>
          item.hasDropdown ? (
            <li key={item.path} className={styles.tabItem} ref={portfolioTabRef}>
              <div className={`${styles.tab} ${isActive(item.path) ? styles.active : ''}`}>
                <Link
                  to={item.path}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={styles.tabLink}
                >
                  {item.label}
                </Link>
                <button
                  className={styles.dropdownToggle}
                  onClick={() => setPortfolioDropdownOpen(v => !v)}
                  aria-label="Portfolios submenu"
                  aria-expanded={portfolioDropdownOpen}
                  aria-haspopup="menu"
                >
                  <svg
                    viewBox="0 0 10 6"
                    width="10"
                    height="6"
                    fill="currentColor"
                    style={{ transform: portfolioDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }}
                  >
                    <path d="M0 0l5 6 5-6z" />
                  </svg>
                </button>
              </div>
            </li>
          ) : (
            <li key={item.path} className={styles.tabItem}>
              <Link
                to={item.path}
                className={`${styles.tab} ${isActive(item.path) ? styles.active : ''}`}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          )
        )}
      </ul>

      {/* Dropdown rendered via portal so it's never clipped */}
      {portfolioDropdownOpen && createPortal(
        <ul
          ref={dropdownRef}
          className={styles.portfolioDropdown}
          role="menu"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          {/* Header */}
          <li role="none">
            <button
              role="menuitem"
              className={styles.portfolioDropdownHeader}
              onClick={() => { setPortfolioDropdownOpen(false); navigate('/portfolios') }}
            >
              Portfolios
            </button>
          </li>
          {/* Sub-items */}
          {PORTFOLIO_ITEMS.map(item => (
            <li key={item.label} role="none">
              <button
                role="menuitem"
                className={styles.portfolioDropdownItem}
                onClick={() => handlePortfolioItemClick(item.path)}
              >
                - {item.label}
              </button>
            </li>
          ))}
        </ul>,
        document.body
      )}

      {/* Mobile hamburger */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setMobileNavOpen(v => !v)}
        aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={mobileNavOpen}
        aria-controls="mobile-nav-drawer"
      >
        {mobileNavOpen ? (
          <img src="/src/assets/icons/icon-close.svg" alt="" width={20} height={20} />
        ) : (
          <img src="/src/assets/icons/icon-menu.svg" alt="" width={20} height={20} />
        )}
      </button>

      {/* Mobile backdrop */}
      {mobileNavOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-nav-drawer"
        className={`${styles.mobileDrawer} ${mobileNavOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >
        <div className={styles.drawerHeader}>
          <img
            src="/src/assets/icons/aep-logo.svg"
            alt="American Electric Power"
            height={28}
          />
          <button
            className={styles.drawerClose}
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation menu"
          >
            <img src="/src/assets/icons/icon-close.svg" alt="" width={20} height={20} />
          </button>
        </div>
        <ul className={styles.drawerList}>
          {NAV_ITEMS.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`${styles.drawerItem} ${isActive(item.path) ? styles.drawerItemActive : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
