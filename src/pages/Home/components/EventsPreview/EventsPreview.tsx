import styles from './EventsPreview.module.scss'
import SectionHeader from '../../../../components/shared/SectionHeader/SectionHeader'
import TagChip from '../../../../components/shared/TagChip/TagChip'
import type { Event } from '../../../../models/Event'

interface EventsPreviewProps {
  events: Event[]
}

const TYPE_VARIANT: Record<string, 'blue' | 'purple' | 'green' | 'default'> = {
  Conference: 'blue',
  Webinar: 'purple',
  Workshop: 'green',
  Training: 'default',
}

export default function EventsPreview({ events }: EventsPreviewProps) {
  return (
    <section className={styles.section} aria-labelledby="events-heading">
      <div className={styles.inner}>
        <SectionHeader title="Upcoming Events" />
        <div className={styles.grid}>
          {events.slice(0, 3).map(event => (
            <article key={event.id} className={styles.eventCard}>
              <div className={styles.dateBadge}>
                <span className={styles.day}>{event.day}</span>
                <span className={styles.month}>{event.month}</span>
              </div>
              <div className={styles.eventBody}>
                <TagChip label={event.type} variant={TYPE_VARIANT[event.type] ?? 'default'} />
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDesc}>{event.description}</p>
                <div className={styles.eventMeta}>
                  <span className={styles.location}>{event.location}</span>
                </div>
                <a href={event.link} className={styles.eventCta}>
                  Learn More
                  <img src="/src/assets/icons/icon-arrow-right.svg" alt="" width={14} height={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
