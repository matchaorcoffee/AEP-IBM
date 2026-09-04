import type { Holiday } from '../models/Holiday'

export const MOCK_HOLIDAYS: Holiday[] = [
  { id: 'h1',  name: "New Year's Day",              date: 'January 1, 2025',    day: 'Wednesday', month: 'January' },
  { id: 'h2',  name: 'Martin Luther King Jr. Day',  date: 'January 20, 2025',   day: 'Monday',    month: 'January' },
  { id: 'h3',  name: "Presidents' Day",             date: 'February 17, 2025',  day: 'Monday',    month: 'February' },
  { id: 'h4',  name: 'Memorial Day',                date: 'May 26, 2025',       day: 'Monday',    month: 'May' },
  { id: 'h5',  name: 'Juneteenth',                  date: 'June 19, 2025',      day: 'Thursday',  month: 'June' },
  { id: 'h6',  name: 'Independence Day',            date: 'July 4, 2025',       day: 'Friday',    month: 'July' },
  { id: 'h7',  name: 'Labor Day',                   date: 'September 1, 2025',  day: 'Monday',    month: 'September' },
  { id: 'h8',  name: 'Columbus Day',                date: 'October 13, 2025',   day: 'Monday',    month: 'October' },
  { id: 'h9',  name: 'Veterans Day',                date: 'November 11, 2025',  day: 'Tuesday',   month: 'November', observed: 'November 11, 2025' },
  { id: 'h10', name: 'Thanksgiving Day',            date: 'November 27, 2025',  day: 'Thursday',  month: 'November' },
  { id: 'h11', name: 'Day After Thanksgiving',      date: 'November 28, 2025',  day: 'Friday',    month: 'November' },
  { id: 'h12', name: 'Christmas Day',               date: 'December 25, 2025',  day: 'Thursday',  month: 'December' },
  { id: 'h13', name: 'Day After Christmas',         date: 'December 26, 2025',  day: 'Friday',    month: 'December' },
]
