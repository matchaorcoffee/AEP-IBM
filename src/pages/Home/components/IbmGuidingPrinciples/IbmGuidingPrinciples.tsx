import styles from './IbmGuidingPrinciples.module.scss'

const principles = [
  {
    id: 'cross-sector',
    title: 'Cross-sector collaboration',
    body: 'We work closely with the public and private sectors, including local, regional and national governments, nonprofit organizations, universities, research organizations and school systems. We engage with highly qualified public and civic entities that are deeply committed to solving problems.',
    gradient: 'teal',
  },
  {
    id: 'solving-problems',
    title: "Solving client's problems",
    body: "To address some of the world's most vexing problems at their roots requires more than simply writing checks. We take a hands-on approach to identify and implement solutions, drawing on all of IBM's technologies and expertise. We focus on building innovative solutions and then bringing them to scale.",
    gradient: 'lavender',
  },
  {
    id: 'impact',
    title: 'Impact and measurement',
    body: 'We measure that change by developing a set of comprehensive desired outcomes and key performance indicators for each program we initiate. To maximize the impact of our investments, we plan for the longevity and sustainability of our solutions by ensuring that they are scalable and transferable.',
    gradient: 'mint',
  },
]

export default function IbmGuidingPrinciples() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>IBM Guiding Principles</h2>
        <p className={styles.sectionBody}>
          A company must be true to its values in all of its activities — both internal and
          external. IBM&apos;s core values have remained consistent and are embedded in all our
          citizenship activities.
        </p>
      </div>

      <div className={styles.cards}>
        {principles.map((p) => (
          <div key={p.id} className={`${styles.card} ${styles[p.gradient]}`}>
            <h3 className={styles.cardTitle}>{p.title}</h3>
            <p className={styles.cardBody}>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
