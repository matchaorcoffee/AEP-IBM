import type { QuickLink } from '../models/QuickLink'

export const MOCK_QUICK_LINKS: QuickLink[] = [
  {
    id: 'ql1',
    label: 'Portfolios',
    icon: '/src/assets/icons/icon-document.svg',
    path: '/portfolios',
    description: 'Browse partner portfolios',
  },
  {
    id: 'ql2',
    label: 'Projects',
    icon: '/src/assets/icons/icon-launch.svg',
    path: '/projects',
    description: 'View active projects',
  },
  {
    id: 'ql3',
    label: 'IBM Holidays',
    icon: '/src/assets/icons/icon-calendar-badge.svg',
    path: '/ibm-holidays',
    description: 'IBM holiday calendar',
  },
  {
    id: 'ql4',
    label: 'Partnership',
    icon: '/src/assets/icons/icon-heart.svg',
    path: '/partnership',
    description: 'Partnership programme details',
  },
  {
    id: 'ql5',
    label: 'IBM FNCs',
    icon: '/src/assets/icons/icon-chat.svg',
    path: '/ibm-cics',
    description: 'Client Innovation Centers',
  },
  {
    id: 'ql6',
    label: 'Search',
    icon: '/src/assets/icons/icon-search.svg',
    path: '/search',
    description: 'Search all resources',
  },
]
