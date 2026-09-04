import styles from './IbmGuidingPrinciples.module.scss'

const principles = [
  {
    id: 'cross-sector',
    title: 'Cross-sector collaboration',
    body: 'We work closely with the public and private sectors, including local, regional and national governments, nonprofit organizations, universities, research organizations and school systems.',
    gradient: 'teal',
    icon: '🤝',
  },
  {
    id: 'solving-problems',
    title: "Solving client's problems",
    body: "To address some of the world's most vexing problems at their roots requires more than simply writing checks. We take a hands-on approach to identify and implement solutions.",
    gradient: 'lavender',
    icon: '💡',
  },
  {
    id: 'impact',
    title: 'Impact and measurement',
    body: 'We measure change by developing comprehensive desired outcomes and key performance indicators for each program. We plan for longevity and sustainability of our solutions.',
    gradient: 'mint',
    icon: '📊',
  },
]

export default function IbmGuidingPrinciples() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionLabel}>Our Approach</div>
        <h2 className={styles.sectionTitle}>IBM Guiding Principles</h2>
        <p className={styles.sectionBody}>
          A company must be true to its values in all of its activities — both internal and
          external. IBM&apos;s core values have remained consistent and are embedded in all our
          citizenship activities.
        </p>
      </div>

      <div className={styles.cards}>
        {principles.map((p) => (
          <div key={p.id} className={styles.card}>
            <div className={`${styles.cardIcon} ${styles[p.gradient]}`}>{p.icon}</div>
            <h3 className={styles.cardTitle}>{p.title}</h3>
            <p className={styles.cardBody}>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
