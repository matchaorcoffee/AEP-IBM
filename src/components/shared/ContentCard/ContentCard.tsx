import styles from './ContentCard.module.scss'
import TagChip from '../TagChip/TagChip'
import type { ContentCard } from '../../../models/ContentCard'
import { Link } from 'react-router-dom'

interface ContentCardProps {
  card: ContentCard
  onBookmarkToggle?: (id: string) => void
}

const TYPE_VARIANTS: Record<string, 'blue' | 'purple' | 'green' | 'default'> = {
  Document: 'blue',
  Video: 'purple',
  Tool: 'green',
  Guide: 'default',
  Article: 'default',
}

export default function ContentCard({ card, onBookmarkToggle }: ContentCardProps) {
  const tagVariant = TYPE_VARIANTS[card.contentType] ?? 'default'

  return (
    <article className={styles.card}>
      {/* Card image / placeholder */}
      <div className={`${styles.imageArea} ${styles[`cat${card.category.replace(/[^a-zA-Z]/g, '')}`] || ''}`}>
        <div className={styles.imagePlaceholder} aria-hidden="true" />
        <TagChip label={card.contentType} variant={tagVariant} />
      </div>

      {/* Card body */}
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.productTag}>{card.productTag}</span>
          <span className={styles.date}>{card.date}</span>
        </div>

        <h3 className={styles.title}>{card.title}</h3>
        <p className={styles.description}>{card.description}</p>
      </div>

      {/* Card footer */}
      <div className={styles.footer}>
        <Link to={card.link} className={styles.cta}>
          Read more
          <img src="/src/assets/icons/icon-arrow-right.svg" alt="" width={14} height={14} />
        </Link>
        {onBookmarkToggle && (
          <button
            className={`${styles.bookmarkBtn} ${card.isBookmarked ? styles.bookmarked : ''}`}
            onClick={() => onBookmarkToggle(card.id)}
            aria-label={card.isBookmarked ? 'Remove bookmark' : 'Bookmark this item'}
            aria-pressed={card.isBookmarked}
          >
            <img
              src={card.isBookmarked
                ? '/src/assets/icons/icon-bookmark-filled.svg'
                : '/src/assets/icons/icon-bookmark.svg'}
              alt=""
              width={16}
              height={16}
            />
          </button>
        )}
      </div>
    </article>
  )
}
