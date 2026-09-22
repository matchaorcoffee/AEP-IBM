import styles from './Hero.module.scss'
import heroVideo from '../../assets/homepage.mp4'

export default function Hero() {
  return (
    <div className={styles.hero} role="region" aria-label="AEP IBM hero">
      <video
        className={styles.video}
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>Strategic Partnership</div>
        <h1 className={styles.heroHeading}>
          AEP &amp; IBM<br />Powering the Future
        </h1>
        <p className={styles.heroSub}>
          Harnessing the vast expertise of IBM to propel impactful and groundbreaking
          advancements that benefit AEP customers.
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
  )
}
