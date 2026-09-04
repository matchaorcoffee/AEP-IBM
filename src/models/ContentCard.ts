export interface ContentCard {
  id: string
  title: string
  description: string
  imageUrl?: string
  category: string
  contentType: 'Document' | 'Video' | 'Tool' | 'Guide' | 'Article'
  date: string
  productTag: string
  link: string
  isBookmarked: boolean
}
