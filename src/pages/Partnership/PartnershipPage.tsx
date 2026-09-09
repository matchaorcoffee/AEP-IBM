import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './PartnershipPage.module.scss'
import partnershipImg from './assets/Partnership.png'
import aepIbmLogo from './assets/AEP_IBM_logo.png'

const highlights = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Strategic Leadership',
    desc: "A dedicated team of IBM leaders aligned with AEP's business priorities, driving executive engagement and account governance.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Innovation at Scale',
    desc: "Leveraging IBM's vast portfolio of AI, automation, and cloud technologies to propel groundbreaking advancements across AEP.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: 'Digital Transformation',
    desc: 'End-to-end digital solutions spanning grid modernisation, enterprise platforms, data analytics, and customer experience.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Enterprise Security',
    desc: 'Industry-leading cybersecurity and risk management practices embedded across every portfolio and project engagement.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Data-Driven Insights',
    desc: 'Advanced analytics and AI-powered reporting giving AEP leadership real-time visibility into resources, demand, and delivery.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: '5+ Years Together',
    desc: 'A mature, trust-based partnership built over five years of consistent delivery, collaboration, and shared success.',
  },
]

export default function PartnershipPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [frameHeight, setFrameHeight] = useState<number>(600)
  const [modalOpen, setModalOpen] = useState(false)
  // Remember scroll position so we can restore it on close
  const savedScrollY = useRef(0)

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data || typeof e.data !== 'object') return

      if (e.data.type === 'orgChartHeight' && typeof e.data.height === 'number') {
        // Add 40px bottom padding so next section has a clean gap
        setFrameHeight(e.data.height + 40)
      }

      if (e.data.type === 'orgChartModalOpen') {
        // Capture current scroll position before locking
        savedScrollY.current = window.scrollY
        // Lock page scroll without jumping: use position:fixed trick
        document.body.style.top = `-${savedScrollY.current}px`
        document.body.style.overflow = 'hidden'
        document.body.style.width = '100%'
        setModalOpen(true)
      }

      if (e.data.type === 'orgChartModalClose') {
        // Restore page scroll
        document.body.style.overflow = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, savedScrollY.current)
        setModalOpen(false)
      }
    }

    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      // Safety cleanup: always restore scroll if component unmounts while modal open
      document.body.style.overflow = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [])

  return (
    <div className={styles.page}>

      {/* ── Full-viewport backdrop portal — rendered at document.body level ── */}
      {modalOpen && createPortal(
        <div
          className={styles.modalBackdrop}
          aria-hidden="true"
        />,
        document.body
      )}

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <img src={partnershipImg} alt="" className={styles.heroImg} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.heroHeading}>Our Partnership</h1>
          <p className={styles.heroSub}>
            A strategic alliance between AEP and IBM — driving innovation,
            efficiency, and impact across the enterprise.
          </p>
        </div>
      </div>

      {/* ── Org chart section ─────────────────────────────────────────── */}
      <section className={styles.chartSection}>
        <div className={styles.chartHead}>
          <span className={styles.sectionEyebrow}>Account Organisation</span>
          <h2 className={styles.sectionTitle}>AEP Account Org Chart</h2>
          <p className={styles.sectionSub}>
            Explore the leadership structure and team organisation across the AEP–IBM engagement.
          </p>
          <img src={aepIbmLogo} alt="AEP – IBM" className={styles.chartLogo} />
        </div>
        <iframe
          ref={iframeRef}
          src="AEP_Org_Chart_v2.html"
          className={styles.orgChartFrame}
          style={{ height: frameHeight + 'px' }}
          title="AEP Account Org Chart"
          sandbox="allow-scripts allow-same-origin"
        />
      </section>

      {/* ── Highlights section ────────────────────────────────────────── */}
      <section className={styles.highlights}>
        <div className={styles.highlightsInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>What We Deliver</span>
            <h2 className={styles.sectionTitle}>Partnership Highlights</h2>
            <p className={styles.sectionSub}>
              The pillars that define the AEP &amp; IBM strategic collaboration.
            </p>
          </div>
          <div className={styles.cardsGrid}>
            {highlights.map((h, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardIcon}>{h.icon}</div>
                <h3 className={styles.cardTitle}>{h.title}</h3>
                <p className={styles.cardDesc}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
