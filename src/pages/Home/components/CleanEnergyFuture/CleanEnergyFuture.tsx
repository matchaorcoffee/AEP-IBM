import { useFadeIn } from '../../../../hooks/useFadeIn'
import styles from './CleanEnergyFuture.module.scss'
import solarVideo from '../../assets/SolarVideo.mp4'

export default function CleanEnergyFuture() {
  const { ref: sectionRef } = useFadeIn<HTMLElement>()

  return (
    <section ref={sectionRef} className={`${styles.section} fade-in`}>
      <div className={styles.imageWrapper}>
        <video
          src={solarVideo}
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <div className={styles.content}>
        <div className={styles.label}>Clean Energy</div>
        <h2 className={styles.heading}>Building a bright future together</h2>
        <p className={styles.body}>
          Together with our customers, we&apos;re redefining the future of energy. Investing in a
          modern and efficient grid. Staying ahead of the curve as technology advances. Reducing
          carbon emissions and giving customers the cleaner power they want. Smarter, cleaner and
          more vibrant – we&apos;re creating the energy company of the future.
        </p>
        <a
          href="https://www.aep.com/about/ourstory/cleanenergy"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
        >
          Clean energy future
        </a>
      </div>
    </section>
  )
}
