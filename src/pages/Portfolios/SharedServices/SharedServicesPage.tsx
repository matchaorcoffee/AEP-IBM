import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import styles from './SharedServicesPage.module.scss'
import headerVideo from './assets/SharedServices Header.mp4'
import ibmImg from './assets/IBM.jpg'
import PortfolioIntroduction from '../../../components/shared/PortfolioIntroduction/PortfolioIntroduction'
import PortfolioSuccessStory from '../../../components/shared/PortfolioSuccessStory/PortfolioSuccessStory'
import PortfolioDashboard from '../../../components/shared/PortfolioDashboard/PortfolioDashboard'
import PortfolioHighlights from '../../../components/shared/PortfolioHighlights/PortfolioHighlights'
import { PORTFOLIO_SHOWCASE } from '../../../data/portfolio-showcase'

const PORTFOLIO_SLUG = 'shared-services'
const PORTFOLIO_NAME = 'Shared Services'
const SHOWCASE = PORTFOLIO_SHOWCASE[PORTFOLIO_SLUG]

const NICHE_SKILLS = ['PeopleSoft Finance', 'Workday']
const CHALLENGES = ['Limited resource availability from specific locations and securing Workday resources and specialized skills.']
const MITIGATIONS = [
  'Optimizing resource allocation by prioritizing critical tasks and cross-training opportunities.',
  'Invest in upskilling existing team members.',
  'Explore a hybrid model of onshore-offshore resource allocation to balance expertise.',
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

export default function SharedServicesPage() {
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
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.pageTitle}>{PORTFOLIO_NAME}</h1>
          <p className={styles.heroSub}>Enterprise-wide shared capabilities</p>
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
