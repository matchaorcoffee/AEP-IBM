import styles from './Hero.module.scss'
import heroVideo from '../../assets/homepage.mp4'
import { Link } from 'react-router-dom'

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
        <div className={styles.heroActions}>
          <Link to="/portfolios" className={styles.heroCta}>
            Explore Portfolios
          </Link>
          <Link to="/partnership" className={styles.heroCtaOutline}>
            Our Partnership
          </Link>
        </div>
      </div>
    </div>
  )
}
