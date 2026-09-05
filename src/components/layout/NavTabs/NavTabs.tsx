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
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (portfolioDropdownOpen && portfolioTabRef.current) {
      const rect = portfolioTabRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 8, left: rect.left })
    }
  }, [portfolioDropdownOpen])

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
    if (portfolioDropdownOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [portfolioDropdownOpen])

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
    <div className={styles.navOuter}>
      <nav className={styles.navCard} aria-label="Main navigation">

        {/* Logo */}
        <Link to="/" className={styles.logoLink} aria-label="Go to home">
          <img src={aepLogo} alt="American Electric Power" className={styles.logo} />
        </Link>

        {/* Desktop nav links — centered */}
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
                      viewBox="0 0 10 6" width="10" height="6" fill="currentColor"
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

        {/* Right actions */}
        <div className={styles.actions}>
          <Link to="/search" className={styles.searchBtn} aria-label="Search">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </Link>
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileNavOpen(v => !v)}
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>

      </nav>

      {/* Portfolio dropdown */}
      {portfolioDropdownOpen && createPortal(
        <div
          ref={dropdownRef}
          className={styles.portfolioDropdown}
          role="menu"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          <div className={styles.portfolioDropdownLeft}>
            <button
              className={styles.portfolioDropdownTitle}
              onClick={() => { setPortfolioDropdownOpen(false); navigate('/portfolios') }}
            >
              Portfolios
            </button>
            <p className={styles.portfolioDropdownDesc}>
              IBM Vantage AEP portfolio areas and domains.
            </p>
            <button
              className={styles.portfolioDropdownSeeAll}
              onClick={() => { setPortfolioDropdownOpen(false); navigate('/portfolios') }}
            >
              See All ›
            </button>
          </div>
          <div className={styles.portfolioDropdownDivider} aria-hidden="true" />
          <ul className={styles.portfolioDropdownRight} role="none">
            {PORTFOLIO_ITEMS.map(item => (
              <li key={item.label} role="none">
                <button
                  role="menuitem"
                  className={styles.portfolioDropdownItem}
                  onClick={() => handlePortfolioItemClick(item.path)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>,
        document.body
      )}

      {/* Mobile backdrop */}
      {mobileNavOpen && (
        <div className={styles.backdrop} onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
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
          <img src={aepLogo} alt="American Electric Power" height={32} />
          <button className={styles.drawerClose} onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
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
    </div>
  )
}
