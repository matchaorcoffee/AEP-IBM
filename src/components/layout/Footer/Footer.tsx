import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <span className={styles.ibmText}>IBM</span>
      </div>
      <nav className={styles.links} aria-label="Footer navigation">
        <a href="#" className={styles.link}>Privacy</a>
        <span className={styles.sep}>|</span>
        <a href="#" className={styles.link}>Terms</a>
        <span className={styles.sep}>|</span>
        <a href="#" className={styles.link}>Accessibility</a>
        <span className={styles.sep}>|</span>
        <a href="#" className={styles.link}>Contact</a>
      </nav>
      <p className={styles.copyright}>© Copyright IBM Corporation 2024</p>
    </footer>
  )
}
