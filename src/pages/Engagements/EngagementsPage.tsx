import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './EngagementsPage.module.scss'
import headerGif from '../Portfolios/assets/Header.gif'
import projectsImg  from '../Projects/assets/Projects.png'
import { useFadeIn } from '../../hooks/useFadeIn'

/* ── Portfolio card data ─────────────────────────────────────────────────── */
const PORTFOLIO_ITEMS = [
  {
    label: 'WAM',
    path: '/portfolios/wam',
    desc: 'Work & Asset Management solutions',
    category: 'Asset Management',
    img: new URL('../Portfolios/WAM/assets/WAM.png', import.meta.url).href,
  },
  {
    label: 'Energy Delivery',
    path: '/portfolios/energy-delivery',
    desc: 'Reliable energy transmission & distribution',
    category: 'Transmission & Distribution',
    img: new URL('../Portfolios/EnergyDelivery/assets/EnergyDelivery.png', import.meta.url).href,
  },
  {
    label: 'Grid Operations',
    path: '/portfolios/grid-operations',
    desc: 'Real-time grid monitoring & control',
    category: 'Operations',
    img: new URL('../Portfolios/GridOperations/assets/GridOperations.png', import.meta.url).href,
  },
  {
    label: 'Generation & Commercial Ops',
    path: '/portfolios/generation-commercial',
    desc: 'Power generation & commercial optimization',
    category: 'Generation',
    img: new URL('../Portfolios/GenerationCommercial/assets/GenerationCommercial.png', import.meta.url).href,
  },
  {
    label: 'Shared Services',
    path: '/portfolios/shared-services',
    desc: 'Enterprise-wide shared capabilities',
    category: 'Enterprise',
    img: new URL('../Portfolios/SharedServices/assets/SharedServices.png', import.meta.url).href,
  },
  {
    label: 'ICOE',
    path: '/portfolios/icoe',
    desc: 'Innovation Center of Excellence',
    category: 'Innovation',
    img: new URL('../Portfolios/ICOE/assets/ICOE.png', import.meta.url).href,
  },
  {
    label: 'Automation COE',
    path: '/portfolios/automation-coe',
    desc: 'Intelligent automation & RPA initiatives',
    category: 'Automation',
    img: new URL('../Portfolios/AutomationCOE/assets/AutomationCOE.png', import.meta.url).href,
  },
  {
    label: 'Digital Emerging Technology',
    path: '/portfolios/digital-emerging',
    desc: 'Next-gen digital & emerging tech programs',
    category: 'Emerging Tech',
    img: new URL('../Portfolios/DigitalEmerging/assets/DigitalEmerging.png', import.meta.url).href,
  },
  {
    label: 'Data Platforms',
    path: '/portfolios/data-platforms',
    desc: 'Data infrastructure & analytics platforms',
    category: 'Data & Analytics',
    img: new URL('../Portfolios/DataPlatforms/assets/DataPlatforms.png', import.meta.url).href,
  },
  {
    label: 'Security',
    path: '/portfolios/security',
    desc: 'Cybersecurity & risk management',
    category: 'Cybersecurity',
    img: new URL('../Portfolios/Security/assets/Security.png', import.meta.url).href,
  },
  {
    label: 'Customer',
    path: '/portfolios/customer',
    desc: 'Customer experience & engagement',
    category: 'Customer Experience',
    img: new URL('../Portfolios/Customer/assets/Customer.png', import.meta.url).href,
  },
]

type Tab = 'portfolio' | 'projects'

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function EngagementsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('portfolio')
  const { ref: cardsSectionRef } = useFadeIn<HTMLElement>()
  const { ref: projectsSectionRef } = useFadeIn<HTMLElement>()

  /* ── Sliding-pill geometry ───────────────────────────────────────────────
     Measure the active button's bounds relative to the track container and
     drive the pill via inline style. pillReady gates the CSS transition so
     the pill snaps on first render instead of sliding in from zero.        */
  const portfolioBtnRef = useRef<HTMLButtonElement>(null)
  const projectsBtnRef  = useRef<HTMLButtonElement>(null)
  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({})
  const [pillReady, setPillReady] = useState(false)

  function measurePill(ref: React.RefObject<HTMLButtonElement | null>) {
    const btn = ref.current
    if (!btn) return
    const parent = btn.parentElement
    if (!parent) return
    const parentRect = parent.getBoundingClientRect()
    const btnRect    = btn.getBoundingClientRect()
    setPillStyle({
      left:  btnRect.left - parentRect.left,
      width: btnRect.width,
    })
  }

  /* Snap to Portfolio on mount, then enable the CSS transition */
  useLayoutEffect(() => {
    measurePill(portfolioBtnRef)
    const id = requestAnimationFrame(() => setPillReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  /* Slide pill whenever the active tab changes */
  useEffect(() => {
    measurePill(activeTab === 'portfolio' ? portfolioBtnRef : projectsBtnRef)
  }, [activeTab])

  /* Re-measure on resize so the pill stays aligned */
  useEffect(() => {
    function handleResize() {
      measurePill(activeTab === 'portfolio' ? portfolioBtnRef : projectsBtnRef)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [activeTab])

  function switchTab(tab: Tab) {
    if (tab === activeTab) return
    setActiveTab(tab)
  }

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <div className={styles.hero} role="region" aria-label="Engagements">
        <img src={headerGif} alt="" className={styles.heroImg} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.heroHeading}>Engagements</h1>
          <p className={styles.heroSub}>
            Explore the domains where IBM and AEP collaborate to drive innovation,
            efficiency, and impact across the enterprise.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span>Scroll</span>
          <svg className={styles.scrollChevron} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── Sliding-pill switcher ── */}
      <div className={styles.tabSwitcherWrap}>
        <div
          className={styles.segControl}
          role="tablist"
          aria-label="Engagements sections"
        >
          {/* Pill — no transition on mount to prevent slide-from-0 */}
          <span
            className={`${styles.segPill}${pillReady ? ` ${styles.segPillAnimated}` : ''}`}
            style={pillStyle}
            aria-hidden="true"
          />

          <button
            ref={portfolioBtnRef}
            role="tab"
            aria-selected={activeTab === 'portfolio'}
            className={`${styles.segBtn}${activeTab === 'portfolio' ? ` ${styles.segBtnActive}` : ''}`}
            onClick={() => switchTab('portfolio')}
          >
            Portfolios
          </button>

          <button
            ref={projectsBtnRef}
            role="tab"
            aria-selected={activeTab === 'projects'}
            className={`${styles.segBtn}${activeTab === 'projects' ? ` ${styles.segBtnActive}` : ''}`}
            onClick={() => switchTab('projects')}
          >
            Projects
          </button>
        </div>
      </div>

      {/* ── Content panels ── */}
      <div className={styles.contentArea}>

        {/* ── PORTFOLIO panel ── */}
        <section
          ref={cardsSectionRef}
          role="tabpanel"
          aria-label="Portfolios"
          className={`${styles.panel} ${styles.cardsSection} fade-in ${activeTab === 'portfolio' ? ` ${styles.panelVisible}` : ''}`}
          aria-hidden={activeTab !== 'portfolio'}
        >
          <div className={styles.inner}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionLabel}>Portfolio Overview</div>
              <h2 className={styles.sectionTitle}>Portfolios</h2>
              <p className={styles.sectionSub}>
                Select a portfolio to explore its projects, capabilities, and delivery metrics.
              </p>
            </div>
            <div className={styles.grid}>
              {PORTFOLIO_ITEMS.map(item => (
                <Link key={item.path} to={item.path} className={styles.card}>
                  <div className={styles.cardVisual}>
                    <img src={item.img} alt={item.label} className={styles.cardImg} />
                    <div className={styles.cardOverlay} aria-hidden="true" />
                  </div>
                  <div className={styles.cardContent}>
                    {item.category && (
                      <span className={styles.cardCategory}>{item.category}</span>
                    )}
                    <h3 className={styles.cardTitle}>{item.label}</h3>
                    <p className={styles.cardDesc}>{item.desc}</p>
                    <div className={styles.cardCtaWrapper}>
                      <span className={styles.cardCta}>
                        View Portfolio
                        <svg
                          className={styles.cardArrow}
                          viewBox="0 0 16 16" width="14" height="14"
                          fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M3 8h10M9 4l4 4-4 4"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS panel ── */}
        <section
          ref={projectsSectionRef}
          role="tabpanel"
          aria-label="Projects"
          className={`${styles.panel} ${styles.projectsSection} fade-in ${activeTab === 'projects' ? ` ${styles.panelVisible}` : ''}`}
          aria-hidden={activeTab !== 'projects'}
        >
          <div className={styles.inner}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionLabel}>Project Intelligence</div>
              <h2 className={styles.sectionTitle}>Projects Hub</h2>
              <p className={styles.sectionSub}>
                A centralized hub for project and resource insights — allocation, distribution,
                workforce trends, and demand forecasts.
              </p>
            </div>

            {/* Hero thumbnail — clicking goes to the full Projects page */}
            <div className={styles.projectsPreview}>
              <Link to="/projects" className={styles.projectsThumb}>
                <div className={styles.projectsThumbVisual}>
                  <img src={projectsImg} alt="Projects" className={styles.projectsThumbImg} />
                  <div className={styles.projectsThumbOverlay} aria-hidden="true" />
                </div>
                <div className={styles.projectsThumbBody}>
                  <div className={styles.projectsThumbBadge}>IBM · AEP Projects</div>
                  <h3 className={styles.projectsThumbTitle}>Project Visibility &amp; Resource Intelligence</h3>
                  <p className={styles.projectsThumbSub}>
                    Explore real-time dashboards, delivery model distributions, onboarding/offboarding metrics, and 30-60-90 day forecasts.
                  </p>
                  <span className={styles.projectsThumbAction}>
                    Open Projects Dashboard
                    <svg
                      viewBox="0 0 16 16" width="14" height="14"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4"/>
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
