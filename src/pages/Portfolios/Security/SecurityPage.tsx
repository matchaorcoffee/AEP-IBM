import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import styles from './SecurityPage.module.scss'
import headerVideo from './assets/Security Header.mp4'
import ibmImg from './assets/IBM.jpg'
import PortfolioIntroduction from '../../../components/shared/PortfolioIntroduction/PortfolioIntroduction'
import PortfolioSuccessStory from '../../../components/shared/PortfolioSuccessStory/PortfolioSuccessStory'
import PortfolioDashboard from '../../../components/shared/PortfolioDashboard/PortfolioDashboard'
import PortfolioHighlights from '../../../components/shared/PortfolioHighlights/PortfolioHighlights'
import { PORTFOLIO_SHOWCASE } from '../../../data/portfolio-showcase'

const PORTFOLIO_SLUG = 'security'
const PORTFOLIO_NAME = 'Security'
const SHOWCASE = PORTFOLIO_SHOWCASE[PORTFOLIO_SLUG]

const NICHE_SKILLS = ['CyberArk', 'IAM Specialist']
const CHALLENGES = [
  'Hard to find resources with the CyberArk experience needed + Powershell experience + NERC restrictions. Only US resources are NERC compliant, nearshore resources are not NERC compliant (Brazil, Mexico, Costa Rica) so they are not a fit for AEP.',
  'Resources with IAM experience are hard to find',
]
const MITIGATIONS = [
  'Proactive search for strong resources',
  'Train junior resources on Active Directory and other IAM demands.',
]

const NAV_LINKS = [{ id: 'analytics', label: `${PORTFOLIO_NAME} by the Numbers` }, { id: 'highlights', label: 'Highlights' }]

function useSlidingPill(refs: React.RefObject<HTMLButtonElement | null>[], activeIndex: number) {
  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({})
  const [pillReady, setPillReady] = useState(false)
  function measure(idx: number) {
    const btn = refs[idx]?.current; if (!btn) return
    const parent = btn.parentElement; if (!parent) return
    const pr = parent.getBoundingClientRect(); const br = btn.getBoundingClientRect()
    setPillStyle({ left: br.left - pr.left, width: br.width })
  }
  useLayoutEffect(() => { measure(activeIndex); const id = requestAnimationFrame(() => setPillReady(true)); return () => cancelAnimationFrame(id) }, []) // eslint-disable-line
  useEffect(() => { if (pillReady) measure(activeIndex) }, [activeIndex]) // eslint-disable-line
  useEffect(() => { function onResize() { measure(activeIndex) }; window.addEventListener('resize', onResize, { passive: true }); return () => window.removeEventListener('resize', onResize) }, [activeIndex]) // eslint-disable-line
  return { pillStyle, pillReady }
}

export default function SecurityPage() {
  const [activePillIdx, setActivePillIdx] = useState(0)
  const navBtnRefs = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)]
  const { pillStyle, pillReady } = useSlidingPill(navBtnRefs, activePillIdx)
  function handleNavClick(idx: number, sectionId: string) { setActivePillIdx(idx); document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }) }

  return (
    <div className={styles.page} id="top">
      <div className={styles.hero}>
        <video
          className={styles.heroVideo}
          src={headerVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.pageTitle}>{PORTFOLIO_NAME}</h1>
          <p className={styles.heroSub}>Cybersecurity &amp; risk management</p>
        </div>
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span>Scroll</span>
          <svg className={styles.scrollChevron} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      <div className={styles.segWrap}>
        <nav className={styles.segControl} role="navigation" aria-label="Page sections">
          <span className={`${styles.segPill}${pillReady ? ` ${styles.segPillAnimated}` : ''}`} style={pillStyle} aria-hidden="true" />
          {NAV_LINKS.map((link, idx) => (
            <button key={link.id} ref={navBtnRefs[idx]} className={`${styles.segBtn}${activePillIdx === idx ? ` ${styles.segBtnActive}` : ''}`} aria-pressed={activePillIdx === idx} onClick={() => handleNavClick(idx, link.id)}>{link.label}</button>
          ))}
        </nav>
      </div>
      <PortfolioIntroduction portfolioName={PORTFOLIO_NAME} showcase={SHOWCASE} />
      <PortfolioSuccessStory successStory={SHOWCASE} />
      <PortfolioDashboard portfolioSlug={PORTFOLIO_SLUG} portfolioName={PORTFOLIO_NAME} />
      <PortfolioHighlights
        challenges={CHALLENGES}
        mitigations={MITIGATIONS}
        nicheSkills={NICHE_SKILLS}
        ibmImg={ibmImg}
        onBackToTop={() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })}
      />
    </div>
  )
}
