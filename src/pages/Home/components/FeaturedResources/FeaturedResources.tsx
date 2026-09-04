import styles from './FeaturedResources.module.scss'
import ContentCard from '../../../../components/shared/ContentCard/ContentCard'
import SectionHeader from '../../../../components/shared/SectionHeader/SectionHeader'
import type { ContentCard as ContentCardType } from '../../../../models/ContentCard'

interface FeaturedResourcesProps {
  cards: ContentCardType[]
  onBookmarkToggle: (id: string) => void
}

export default function FeaturedResources({ cards, onBookmarkToggle }: FeaturedResourcesProps) {
  return (
    <section className={styles.section} aria-labelledby="featured-heading">
      <div className={styles.inner}>
        <SectionHeader
          title="Featured Resources"
          viewAllPath="/portfolios"
          viewAllLabel="View all resources"
        />
        <div className={styles.grid}>
          {cards.map(card => (
            <ContentCard key={card.id} card={card} onBookmarkToggle={onBookmarkToggle} />
          ))}
        </div>
      </div>
    </section>
  )
}
