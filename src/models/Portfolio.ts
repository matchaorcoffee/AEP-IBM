export interface Portfolio {
  id: string
  name: string
  description: string
  status: 'Active' | 'Completed' | 'Archived'
  date: string
  cardCount: number
  link: string
}
