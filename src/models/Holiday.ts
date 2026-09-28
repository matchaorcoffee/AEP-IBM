export interface Holiday {
  id: string
  name: string
  date: string // ISO format YYYY-MM-DD
  day?: string // 'Monday', 'Tuesday', etc.
  month?: string // 'January', etc.
  observed?: string
  countryId: string // 'usa' | 'india' | 'philippines' | 'canada' | 'brazil' | 'mexico' | 'costa-rica'
  countryName: string
  flag: string
  type?: string // 'Public Holiday' | 'Federal Holiday' | 'National Holiday' | 'Gazetted Holiday' | 'Special Non-Working Day' | 'Regular Holiday'
  description?: string
}

export interface CountryInfo {
  id: string
  label: string
  flag: string
  code: string
  url: string
  src: string
  description?: string
}

export interface CountryHolidaysByYear {
  [year: number]: Holiday[]
}

export interface CountryHolidayData {
  country: CountryInfo
  years: CountryHolidaysByYear
}
