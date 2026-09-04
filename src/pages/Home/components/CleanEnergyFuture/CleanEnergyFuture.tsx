import styles from './CleanEnergyFuture.module.scss'
import cleanEnergyImg from '../../assets/CleanEnergyFuture.jpg'

export default function CleanEnergyFuture() {
  return (
    <section className={styles.section}>
      <div className={styles.imageWrapper}>
        <img
          src={cleanEnergyImg}
          alt="Aerial view of houses with solar panels"
          className={styles.image}
        />
        <div className={styles.accent} aria-hidden="true" />
      </div>
      <div className={styles.content}>
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
