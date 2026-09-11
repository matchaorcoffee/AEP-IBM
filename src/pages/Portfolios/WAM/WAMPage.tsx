import styles from './WAMPage.module.scss'
import wamHero from './assets/WAM.png'
import ibmImg from './assets/IBM.jpg'
import geographicDistributionImg from './assets/GeographicDistribution.png'
import coreFlexImg from './assets/CoreFlex.png'
import onboardingImg from './assets/Onboarding.png'
import offboardingImg from './assets/Offboarding.png'
import demandManagementImg from './assets/DemandManagement.png'
import { ResourceChurnTable } from '../../../components/shared/ResourceChurnChart/ResourceChurnChart'
import resourceChurnImg from './assets/ResourceChurn.png'
import PortfolioIntroduction from '../../../components/shared/PortfolioIntroduction/PortfolioIntroduction'
import PortfolioSuccessStory from '../../../components/shared/PortfolioSuccessStory/PortfolioSuccessStory'
import PortfolioAnalyticsTabs from '../../../components/shared/PortfolioAnalyticsTabs/PortfolioAnalyticsTabs'
import type { AnalyticsTab } from '../../../components/shared/PortfolioAnalyticsTabs/PortfolioAnalyticsTabs'
import { PORTFOLIO_SHOWCASE } from '../../../data/portfolio-showcase'

const videos = import.meta.glob('./assets/*.{mp4,webm,mov}', { eager: true, query: '?url', import: 'default' })

const PORTFOLIO_NAME = 'WAM'
const SHOWCASE = PORTFOLIO_SHOWCASE['wam']

const LAST_UPDATE = 'Last update 03/20/2026'

/* ── Analytics tabs — one entry per existing chart section ─────────────────
   Order, labels, descriptions, and images are exactly as they were in
   the previous vertical layout. Nothing has been added or removed.        */
const WAM_ANALYTICS_TABS: AnalyticsTab[] = [
  {
    id: 'geographic-distribution',
    label: 'Geographic Distribution',
    description:
      'This chart shows visualization on how many people we have assigned by country. This helps leadership to get insights and make some projection of what is coming next in terms of resources.',
    lastUpdate: LAST_UPDATE,
    chart: (
      <img
        src={geographicDistributionImg}
        alt="Geographic Distribution chart"
        className={styles.chartImg}
      />
    ),
  },
  {
    id: 'core-flex-distribution',
    label: 'Core-Flex Distribution',
    description:
      'This chart shows visualization on how people are distributed between Core and Flex. This helps leadership to get insights and make some projections of what is coming next in terms of core and flex resources.',
    lastUpdate: LAST_UPDATE,
    chart: (
      <img
        src={coreFlexImg}
        alt="Core-Flex Distribution chart"
        className={styles.chartImg}
      />
    ),
  },
  {
    id: 'resource-churn',
    label: 'Resource Churn (last 3 months)',
    description:
      'This chart shows visualization on the progress for people churn in the past 3 months. This helps leadership to get insights of what portfolios we have more churn and make some projection of what is coming next.',
    supplement: <ResourceChurnTable />,
    lastUpdate: LAST_UPDATE,
    chart: (
      <img
        src={resourceChurnImg}
        alt="Resource Churn chart"
        className={styles.chartImg}
      />
    ),
  },
  {
    id: 'monthly-onboarding',
    label: 'Monthly Onboarding of Resources (last 3 months)',
    description:
      'This chart shows visualization on how resource is increasing month by month. This helps leadership to get insights and make some projections of what is coming next in terms of resource count.',
    lastUpdate: LAST_UPDATE,
    chart: (
      <img
        src={onboardingImg}
        alt="Monthly Onboarding chart"
        className={styles.chartImg}
      />
    ),
  },
  {
    id: 'monthly-offboarding',
    label: 'Monthly Offboarding of Resources (last 3 months)',
    description:
      'This chart shows the resource offboarding activities happened for the past three months. Data will help leadership to know and plan accordingly based on the reduction of resource count per month.',
    lastUpdate: LAST_UPDATE,
    chart: (
      <img
        src={offboardingImg}
        alt="Monthly Offboarding chart"
        className={styles.chartImg}
      />
    ),
  },
  {
    id: 'demand-management',
    label: 'Demand Management',
    description:
      'This chart shows visualization on how demand is distributed between 30-60-90 day forecast. This helps leadership to get insights and make some projections of what is coming next in terms of demand.',
    lastUpdate: LAST_UPDATE,
    chart: (
      <img
        src={demandManagementImg}
        alt="Demand Management chart"
        className={styles.chartImg}
      />
    ),
  },
]

const NICHE_SKILLS = [
  'Maximo Admin and Application Developer',
  'MAS 9.0 Features and Know How',
  'Open Shift Admin, Development',
  'React NodeJS',
  'Eggplant Test Automation',
  'Dynatrace',
  'Splunk',
]

/* ── Nav links point to the two remaining landmark sections ──────────────── */
const NAV_LINKS = [
  { id: 'analytics',  label: `${PORTFOLIO_NAME} by the Numbers` },
  { id: 'highlights', label: 'Highlights' },
]

export default function WAMPage() {
  const videoFiles = Object.values(videos) as string[]

  return (
    <div className={styles.page} id="top">

      {/* Hero */}
      <div className={styles.hero}>
        <img src={wamHero} alt="WAM" className={styles.heroImg} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.pageTitle}>{PORTFOLIO_NAME}</h1>
          <p className={styles.heroSub}>Work &amp; Asset Management solutions</p>
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
          tabs={WAM_ANALYTICS_TABS}
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

            {/* Left — dark red: Main challenges + IBM image */}
            <div className={styles.hlCardRed}>
              <div className={styles.hlCardContent}>
                <h3 className={styles.hlCardTitle}>Main challenges</h3>
                <p className={styles.hlCardText}>
                  In preparation for MAS, the team has undergone necessary training; however, hands-on experience remains limited.
                  The admin team is encountering challenges during the initial installation on the Sandbox environment.
                  Additionally, the team is facing difficulties in identifying the technical changes introduced by the latest iFix,
                  based on the release notes provided by IBM Product team.
                </p>
              </div>
              <img src={ibmImg} alt="IBM" className={styles.hlCardImg} />
            </div>

            {/* Center — light grey: Niche Skills */}
            <div className={styles.hlCardGrey}>
              <h3 className={styles.hlCardTitleDark}>Niche Skills</h3>
              <ul className={styles.nicheList}>
                {NICHE_SKILLS.map((skill, i) => (
                  <li key={i} className={styles.nicheItem}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* Right — dark red: Mitigation */}
            <div className={styles.hlCardRed}>
              <div className={styles.hlCardContent}>
                <h3 className={styles.hlCardTitle}>Mitigation</h3>
                <p className={styles.hlCardText}>
                  For the first time MAS installation, the team is receiving support from IBM Maximo Service Line.
                  To enhance skills, the team is also undergoing MAS-specific training.
                </p>
                <hr className={styles.hlDivider} />
                <p className={styles.hlCardText}>
                  Regarding iFix, the team is collaborating with IBM Product team to identify any gaps and is planning
                  to address them in future releases.
                </p>
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
