import { createContext, useContext, useState, type ReactNode } from 'react'
import type { ContentCard } from '../models/ContentCard'
import { MOCK_CONTENT } from '../data/mock-content'
import { MOCK_EVENTS } from '../data/mock-events'
import { MOCK_PORTFOLIOS, MOCK_PROJECTS } from '../data/mock-portfolios'
import { MOCK_HOLIDAYS } from '../data/mock-holidays'
import { MOCK_QUICK_LINKS } from '../data/mock-quick-links'
import type { Event } from '../models/Event'
import type { Portfolio } from '../models/Portfolio'
import type { Holiday } from '../models/Holiday'
import type { QuickLink } from '../models/QuickLink'

interface ContentContextValue {
  cards: ContentCard[]
  events: Event[]
  portfolios: Portfolio[]
  projects: Portfolio[]
  holidays: Holiday[]
  quickLinks: QuickLink[]
  toggleBookmark: (id: string) => void
  searchCards: (query: string, filter?: string) => ContentCard[]
}

const ContentContext = createContext<ContentContextValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<ContentCard[]>(MOCK_CONTENT)

  function toggleBookmark(id: string) {
    setCards(prev =>
      prev.map(card => card.id === id ? { ...card, isBookmarked: !card.isBookmarked } : card)
    )
  }

  function searchCards(query: string, filter?: string): ContentCard[] {
    const q = query.toLowerCase().trim()
    return cards.filter(card => {
      const matchesQuery = !q || [card.title, card.description, card.category, card.productTag]
        .some(f => f.toLowerCase().includes(q))
      const matchesFilter = !filter || filter === 'all' || card.contentType === filter
      return matchesQuery && matchesFilter
    })
  }

  return (
    <ContentContext.Provider value={{
      cards,
      events: MOCK_EVENTS,
      portfolios: MOCK_PORTFOLIOS,
      projects: MOCK_PROJECTS,
      holidays: MOCK_HOLIDAYS,
      quickLinks: MOCK_QUICK_LINKS,
      toggleBookmark,
      searchCards,
    }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside ContentProvider')
  return ctx
}
