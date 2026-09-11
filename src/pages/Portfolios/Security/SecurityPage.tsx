import styles from './SecurityPage.module.scss'
import securityHero from './assets/Security.png'
import ibmImg from './assets/IBM.jpg'
import geographicDistributionImg from './assets/GeographicDistribution.png'
import coreFlexImg from './assets/CoreFlex.png'
import resourceChurnImg from './assets/ResourceChurn.png'
import onboardingImg from './assets/Onboarding.png'
import offboardingImg from './assets/Offboarding.png'
import demandManagementImg from './assets/DemandManagement.png'
import { ResourceChurnTable } from '../../../components/shared/ResourceChurnChart/ResourceChurnChart'
import PortfolioIntroduction from '../../../components/shared/PortfolioIntroduction/PortfolioIntroduction'
import PortfolioSuccessStory from '../../../components/shared/PortfolioSuccessStory/PortfolioSuccessStory'
import PortfolioAnalyticsTabs from '../../../components/shared/PortfolioAnalyticsTabs/PortfolioAnalyticsTabs'
import type { AnalyticsTab } from '../../../components/shared/PortfolioAnalyticsTabs/PortfolioAnalyticsTabs'
import { PORTFOLIO_SHOWCASE } from '../../../data/portfolio-showcase'

const videos = import.meta.glob('./assets/*.{mp4,webm,mov}', { eager: true, query: '?url', import: 'default' })

const PORTFOLIO_NAME = 'Security'
const SHOWCASE = PORTFOLIO_SHOWCASE['security']
const LAST_UPDATE = 'Last update 03/20/2026'

const ANALYTICS_TABS: AnalyticsTab[] = [
  {
    id: 'geographic-distribution',
    label: 'Geographic Distribution',
    description: 'This chart shows visualization on how many people we have assigned by country. This helps leadership to get insights and make some projection of what is coming next in terms of resources.',
    lastUpdate: LAST_UPDATE,
    chart: <img src={geographicDistributionImg} alt="Geographic Distribution chart" className={styles.chartImg} />,
  },
  {
    id: 'core-flex-distribution',
    label: 'Core-Flex Distribution',
    description: 'This chart shows visualization on how people are distributed between Core and Flex. This helps leadership to get insights and make some projections of what is coming next in terms of core and flex resources.',
    lastUpdate: LAST_UPDATE,
    chart: <img src={coreFlexImg} alt="Core-Flex Distribution chart" className={styles.chartImg} />,
  },
  {
    id: 'resource-churn',
    label: 'Resource Churn (last 3 months)',
    description: 'This chart shows visualization on the progress for people churn in the past 3 months. This helps leadership to get insights of what portfolios we have more churn and make some projection of what is coming next.',
    supplement: <ResourceChurnTable />,
    lastUpdate: LAST_UPDATE,
    chart: <img src={resourceChurnImg} alt="Resource Churn chart" className={styles.chartImg} />,
  },
  {
    id: 'monthly-onboarding',
    label: 'Monthly Onboarding of Resources (last 3 months)',
    description: 'This chart shows visualization on how resource is increasing month by month. This helps leadership to get insights and make some projections of what is coming next in terms of resource count.',
    lastUpdate: LAST_UPDATE,
    chart: <img src={onboardingImg} alt="Monthly Onboarding chart" className={styles.chartImg} />,
  },
  {
    id: 'monthly-offboarding',
    label: 'Monthly Offboarding of Resources (last 3 months)',
    description: 'This chart shows the resource offboarding activities happened for the past three months. Data will help leadership to know and plan accordingly based on the reduction of resource count per month.',
    lastUpdate: LAST_UPDATE,
    chart: <img src={offboardingImg} alt="Monthly Offboarding chart" className={styles.chartImg} />,
  },
  {
    id: 'demand-management',
    label: 'Demand Management',
    description: 'This chart shows visualization on how demand is distributed between 30-60-90 day forecast. This helps leadership to get insights and make some projections of what is coming next in terms of demand.',
    lastUpdate: LAST_UPDATE,
    chart: <img src={demandManagementImg} alt="Demand Management chart" className={styles.chartImg} />,
  },
]

const NICHE_SKILLS = [
  'CyberArk',
  'IAM Specialist',
]

const MAIN_CHALLENGES = [
  'Hard to find resources with the CyberArk experience needed + Powershell experience + NERC restrictions. Only US resources are NERC compliant, nearshore resources are not NERC compliant (Brazil, Mexico, Costa Rica) so they are not a fit for AEP.',
  'Resources with IAM experience are hard to find',
]

const MITIGATIONS = [
  'Proactive search for strong resources',
  'Train junior resources on Active Directory and other IAM demands.',
]

const NAV_LINKS = [
  { id: 'analytics',  label: `${PORTFOLIO_NAME} by the Numbers` },
  { id: 'highlights', label: 'Highlights' },
]

export default function SecurityPage() {
  const videoFiles = Object.values(videos) as string[]

  return (
    <div className={styles.page} id="top">

      {/* Hero */}
      <div className={styles.hero}>
        <img src={securityHero} alt="Security" className={styles.heroImg} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.pageTitle}>{PORTFOLIO_NAME}</h1>
          <p className={styles.heroSub}>Cybersecurity &amp; risk management</p>
        </div>
      </div>

      {/* Sticky nav */}
      <nav className={styles.navBar} aria-label="Page sections">
        {NAV_LINKS.map(link => (
          <button
            key={link.id}
            className={styles.navLink}
            onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })}
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* ── About [Portfolio] ── */}
      <PortfolioIntroduction portfolioName={PORTFOLIO_NAME} showcase={SHOWCASE} />

      {/* ── From Challenge to Impact ── */}
      <PortfolioSuccessStory successStory={SHOWCASE} />

      {/* ── [Portfolio] by the Numbers — tabbed analytics ── */}
      <div className={styles.analyticsBorder}>
        <PortfolioAnalyticsTabs
          heading={`${PORTFOLIO_NAME} by the Numbers`}
          tabs={ANALYTICS_TABS}
        />
      </div>

      {/* ── Highlights ── */}
      <div className={styles.sections}>
        <section id="highlights" className={`${styles.section} ${styles.sectionLast}`}>
          <div className={styles.highlightsHeader}>
            <h2 className={styles.highlightsTitle}>Highlights</h2>
            <button
              className={styles.backToTop}
              onClick={() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Back to top
            </button>
          </div>

          <div className={styles.highlightsGrid}>

            <div className={styles.hlCardRed}>
              <div className={styles.hlCardContent}>
                <h3 className={styles.hlCardTitle}>Main challenges</h3>
                {MAIN_CHALLENGES.map((text, i) => (
                  <p key={i} className={styles.hlCardText}>{text}</p>
                ))}
              </div>
              <img src={ibmImg} alt="IBM" className={styles.hlCardImg} />
            </div>

            <div className={styles.hlCardGrey}>
              <h3 className={styles.hlCardTitleDark}>Niche Skills</h3>
              <ul className={styles.nicheList}>
                {NICHE_SKILLS.map((skill, i) => (
                  <li key={i} className={styles.nicheItem}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className={styles.hlCardRed}>
              <div className={styles.hlCardContent}>
                <h3 className={styles.hlCardTitle}>Mitigation</h3>
                {MITIGATIONS.map((text, i) => (
                  <p key={i} className={styles.hlCardText}>{text}</p>
                ))}
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Remaining video assets */}
      {videoFiles.length > 0 && (
        <div className={styles.content}>
          {videoFiles.map((src, i) => (
            <video key={i} src={src} controls className={styles.video} />
          ))}
        </div>
      )}

    </div>
  )
}
