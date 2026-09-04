import styles from './WelcomeSection.module.scss'

export default function WelcomeSection() {
  return (
    <section className={styles.welcome} aria-labelledby="welcome-heading">
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Strategic Partnership</span>
        <h1 id="welcome-heading" className={styles.heading}>AEP &amp; IBM</h1>
        <p className={styles.subtitle}>
          Strategic partnership fostering innovation harnessing the vast expertise to propel impactful
          and groundbreaking advancements to benefit AEP customers.
        </p>
      </div>
    </section>
  )
}
