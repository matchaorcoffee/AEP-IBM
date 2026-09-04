export interface Event {
  id: string
  title: string
  description: string
  date: string
  day: number
  month: string
  location: string
  type: 'Webinar' | 'Conference' | 'Workshop' | 'Training'
  imageUrl?: string
  link: string
}
