import styles from './PortfolioIntroduction.module.scss'
import type { PortfolioShowcaseContent } from '../../../data/portfolio-showcase'

interface PortfolioIntroductionProps {
  /** The portfolio display name, e.g. "WAM" or "Energy Delivery". Used in the heading. */
  portfolioName: string
  showcase: PortfolioShowcaseContent
}

/**
 * PortfolioIntroduction
 *
 * Renders the "About [Portfolio]" editorial block at the top of every portfolio page.
 * Content is driven entirely by the `showcase` prop — no portfolio-specific logic here.
 *
 * Usage:
 *   <PortfolioIntroduction portfolioName="WAM" showcase={PORTFOLIO_SHOWCASE['wam']} />
 */
export default function PortfolioIntroduction({
  portfolioName,
  showcase,
}: PortfolioIntroductionProps) {
  return (
    <div className={styles.portfolioIntro}>
      <div className={styles.introInner}>
        <div className={styles.introMeta}>
          <h2 className={styles.introHeading}>About {portfolioName}</h2>

          {showcase.fullName && (
            <p className={styles.introFullName}>{showcase.fullName}</p>
          )}

          <p className={styles.introDescription}>{showcase.description}</p>
        </div>

        {showcase.capabilities && showcase.capabilities.length > 0 && (
          <div className={styles.capabilities}>
            <p className={styles.capabilitiesLabel}>What {portfolioName} Enables</p>
            <ul className={styles.capabilityList}>
              {showcase.capabilities.map((cap) => (
                <li key={cap} className={styles.capabilityItem}>{cap}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
