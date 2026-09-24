import styles from './PortfolioHighlights.module.scss'

export interface PortfolioHighlightsProps {
  /** Main challenge text — one or more paragraphs */
  challenges: string[]
  /** Mitigation text — one or more paragraphs (separated by visible dividers) */
  mitigations: string[]
  /** Niche skill labels */
  nicheSkills: string[]
  /** IBM accent image shown in the challenge card */
  ibmImg: string
  /** Called when the user clicks "Back to top" */
  onBackToTop: () => void
}

/**
 * PortfolioHighlights
 *
 * Shared "Highlights" section used by every portfolio detail page.
 * Renders three visual cards: Challenges · Niche Skills · Mitigation.
 * All content is passed as props — no portfolio-specific logic here.
 */
export default function PortfolioHighlights({
  challenges,
  mitigations,
  nicheSkills,
  ibmImg,
  onBackToTop,
}: PortfolioHighlightsProps) {
  return (
    <section id="highlights" className={styles.section} aria-labelledby="highlights-heading">
      <div className={styles.inner}>

        {/* ── Section header ── */}
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>Portfolio Highlights</span>
            <h2 id="highlights-heading" className={styles.heading}>Highlights</h2>
          </div>
          <button
            className={styles.backToTop}
            onClick={onBackToTop}
            aria-label="Back to top of page"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 12V4M4 7l4-4 4 4" />
            </svg>
            Back to top
          </button>
        </div>

        {/* ── Three cards grid ── */}
        <div className={styles.grid}>

          {/* Card 1 — Main Challenges */}
          <div className={styles.cardChallenge}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEyebrow}>Challenge</span>
              <h3 className={styles.cardTitle}>Main Challenges</h3>
            </div>
            <div className={styles.cardBody}>
              {challenges.map((text, i) => (
                <p key={i} className={styles.cardText}>{text}</p>
              ))}
            </div>
            <div className={styles.cardImgWrap} aria-hidden="true">
              <img src={ibmImg} alt="" className={styles.cardImg} />
            </div>
          </div>

          {/* Card 2 — Niche Skills */}
          <div className={styles.cardSkills}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEyebrowMuted}>Expertise</span>
              <h3 className={styles.cardTitleDark}>Niche Skills</h3>
            </div>
            <ul className={styles.skillList}>
              {nicheSkills.map((skill, i) => (
                <li key={i} className={styles.skillItem}>
                  <span className={styles.skillDot} aria-hidden="true" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3 — Mitigation */}
          <div className={styles.cardMitigation}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEyebrow}>Response</span>
              <h3 className={styles.cardTitle}>Mitigation</h3>
            </div>
            <div className={styles.cardBody}>
              {mitigations.map((text, i) => (
                <p key={i} className={`${styles.cardText} ${i < mitigations.length - 1 ? styles.cardTextDivided : ''}`}>
                  {text}
                </p>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
