import styles from './PartnershipPage.module.scss'
import partnershipImg from './assets/Partnership.png'

export default function PartnershipPage() {
  return (
    <div className={styles.page}>

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

      {/* ── Intro section ─────────────────────────────────────────────── */}
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <div className={styles.introLabel}>Account Organisation</div>
          <h2 className={styles.introHeading}>AEP Account Org Chart</h2>
          <p className={styles.introSub}>
            Explore the leadership structure and team organisation across the AEP–IBM engagement.
          </p>
        </div>
      </section>

      {/* ── Org chart iframe ──────────────────────────────────────────── */}
      <section className={styles.chartSection}>
        <div className={styles.chartInner}>
          <iframe
            src="AEP_Org_Chart_v2.html"
            className={styles.orgChartFrame}
            title="AEP Account Org Chart"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </section>

    </div>
  )
}
