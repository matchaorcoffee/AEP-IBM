import styles from './Hero.module.scss'
import heroVideo from '../../assets/homepage.mp4'

export default function Hero() {
  return (
    <div className={styles.hero} role="region" aria-label="AEP IBM hero video">
      <video
        className={styles.video}
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  )
}
