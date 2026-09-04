import styles from './WelcomeSection.module.scss'

export default function WelcomeSection() {
  return (
    <section className={styles.welcome} aria-labelledby="welcome-heading">
      <div className={styles.inner}>
        <div className={styles.label}>AEP &amp; IBM Partnership</div>
        <h1 id="welcome-heading" className={styles.heading}>
          Innovation That Powers Tomorrow
        </h1>
        <p className={styles.subtitle}>
          Strategic partnership fostering innovation harnessing the vast expertise to propel
          impactful and groundbreaking advancements to benefit AEP customers.
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>11+</span>
            <span className={styles.statLabel}>Portfolio Areas</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>100+</span>
            <span className={styles.statLabel}>Active Projects</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>5+</span>
            <span className={styles.statLabel}>Years Together</span>
          </div>
        </div>
      </div>
    </section>
  )
}
