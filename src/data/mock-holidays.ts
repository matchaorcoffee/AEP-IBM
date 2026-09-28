import type { Holiday, CountryInfo, CountryHolidayData } from '../models/Holiday'
import brazilImg from '../pages/IbmHolidays/assets/Brazil.png'
import costaRicaImg from '../pages/IbmHolidays/assets/CostaRica.png'
import indiaImg from '../pages/IbmHolidays/assets/India.png'
import mexicoImg from '../pages/IbmHolidays/assets/Mexico.png'
import philippinesImg from '../pages/IbmHolidays/assets/Philippines.png'
import usaImg from '../pages/IbmHolidays/assets/USA.png'
import canadaImg from '../pages/IbmHolidays/assets/Canada.png'

// ─── Supported Countries Metadata ───────────────────────────────────────────

export const SUPPORTED_COUNTRIES: CountryInfo[] = [
  { id: 'usa',         label: 'United States', flag: '🇺🇸', code: 'USA', url: 'https://www.officeholidays.com/countries/usa',         src: usaImg },
  { id: 'india',       label: 'India',         flag: '🇮🇳', code: 'IND', url: 'https://www.officeholidays.com/countries/india',       src: indiaImg },
  { id: 'philippines', label: 'Philippines',   flag: '🇵🇭', code: 'PHL', url: 'https://www.officeholidays.com/countries/philippines', src: philippinesImg },
  { id: 'canada',      label: 'Canada',        flag: '🇨🇦', code: 'CAN', url: 'https://www.officeholidays.com/countries/canada',      src: canadaImg },
  { id: 'brazil',      label: 'Brazil',        flag: '🇧🇷', code: 'BRA', url: 'https://www.officeholidays.com/countries/brazil',      src: brazilImg },
  { id: 'mexico',      label: 'Mexico',        flag: '🇲🇽', code: 'MEX', url: 'https://www.officeholidays.com/countries/mexico',      src: mexicoImg },
  { id: 'costa-rica',  label: 'Costa Rica',    flag: '🇨🇷', code: 'CRI', url: 'https://www.officeholidays.com/countries/costa-rica', src: costaRicaImg },
]

// ─── Structured Multi-Year Holiday Dataset (Validated via Office Holidays) ───

export const HOLIDAY_DATA_BY_COUNTRY: Record<string, CountryHolidayData> = {
  // ── 1. UNITED STATES ────────────────────────────────────────────────────────
  usa: {
    country: SUPPORTED_COUNTRIES.find(c => c.id === 'usa')!,
    years: {
      2025: [
        { id: 'us-25-01', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: "New Year's Day",             date: '2025-01-01', day: 'Wednesday', month: 'January',   type: 'Federal Holiday', description: 'Celebrates the beginning of the new Gregorian calendar year.' },
        { id: 'us-25-02', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Martin Luther King Jr. Day', date: '2025-01-20', day: 'Monday',    month: 'January',   type: 'Federal Holiday', description: 'Honors the life and legacy of Dr. Martin Luther King Jr.' },
        { id: 'us-25-03', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: "Washington's Birthday",       date: '2025-02-17', day: 'Monday',    month: 'February',  type: 'Federal Holiday', description: "Commonly known as Presidents' Day, celebrating US presidents." },
        { id: 'us-25-04', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Memorial Day',               date: '2025-05-26', day: 'Monday',    month: 'May',       type: 'Federal Holiday', description: 'Honors the men and women who died while serving in the military.' },
        { id: 'us-25-05', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Juneteenth',                 date: '2025-06-19', day: 'Thursday',  month: 'June',      type: 'Federal Holiday', description: 'Commemorates the emancipation of enslaved African Americans.' },
        { id: 'us-25-06', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Independence Day',           date: '2025-07-04', day: 'Friday',    month: 'July',      type: 'Federal Holiday', description: 'Celebrates the Declaration of Independence of the United States in 1776.' },
        { id: 'us-25-07', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Labor Day',                  date: '2025-09-01', day: 'Monday',    month: 'September', type: 'Federal Holiday', description: 'Honors the American labor movement and social/economic contributions of workers.' },
        { id: 'us-25-08', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Columbus Day',               date: '2025-10-13', day: 'Monday',    month: 'October',   type: 'Federal Holiday', description: 'Federal holiday commemorating Christopher Columbus landing in the Americas.' },
        { id: 'us-25-09', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Veterans Day',               date: '2025-11-11', day: 'Tuesday',   month: 'November',  type: 'Federal Holiday', description: 'Honors all military veterans of the United States Armed Forces.' },
        { id: 'us-25-10', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Thanksgiving Day',           date: '2025-11-27', day: 'Thursday',  month: 'November',  type: 'Federal Holiday', description: 'Annual national day of giving thanks for harvest and blessings.' },
        { id: 'us-25-11', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Day After Thanksgiving',     date: '2025-11-28', day: 'Friday',    month: 'November',  type: 'Corporate Holiday', description: 'Extended Thanksgiving holiday break.' },
        { id: 'us-25-12', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Christmas Day',              date: '2025-12-25', day: 'Thursday',  month: 'December',  type: 'Federal Holiday', description: 'Celebration of Christmas.' },
        { id: 'us-25-13', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Day After Christmas',         date: '2025-12-26', day: 'Friday',    month: 'December',  type: 'Corporate Holiday', description: 'Extended winter year-end break.' },
      ],
      2026: [
        { id: 'us-26-01', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: "New Year's Day",             date: '2026-01-01', day: 'Thursday',  month: 'January',   type: 'Federal Holiday', description: 'Celebrates the beginning of 2026.' },
        { id: 'us-26-02', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Martin Luther King Jr. Day', date: '2026-01-19', day: 'Monday',    month: 'January',   type: 'Federal Holiday', description: 'Honors the civil rights leader Dr. Martin Luther King Jr.' },
        { id: 'us-26-03', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: "Washington's Birthday",       date: '2026-02-16', day: 'Monday',    month: 'February',  type: 'Federal Holiday', description: "Presidents' Day observance." },
        { id: 'us-26-04', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Memorial Day',               date: '2026-05-25', day: 'Monday',    month: 'May',       type: 'Federal Holiday', description: 'Honors fallen military service personnel.' },
        { id: 'us-26-05', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Juneteenth',                 date: '2026-06-19', day: 'Friday',    month: 'June',      type: 'Federal Holiday', description: 'Emancipation Day.' },
        { id: 'us-26-06', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Independence Day (Observed)', date: '2026-07-03', day: 'Friday',    month: 'July',      type: 'Federal Holiday', description: 'Observed holiday since July 4 falls on Saturday.' },
        { id: 'us-26-07', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Labor Day',                  date: '2026-09-07', day: 'Monday',    month: 'September', type: 'Federal Holiday', description: 'Honors workers across the nation.' },
        { id: 'us-26-08', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Columbus Day',               date: '2026-10-12', day: 'Monday',    month: 'October',   type: 'Federal Holiday', description: 'Federal holiday.' },
        { id: 'us-26-09', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Veterans Day',               date: '2026-11-11', day: 'Wednesday', month: 'November',  type: 'Federal Holiday', description: 'Honors all armed forces veterans.' },
        { id: 'us-26-10', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Thanksgiving Day',           date: '2026-11-26', day: 'Thursday',  month: 'November',  type: 'Federal Holiday', description: 'Thanksgiving celebration.' },
        { id: 'us-26-11', countryId: 'usa', countryName: 'United States', flag: '🇺🇸', name: 'Christmas Day',              date: '2026-12-25', day: 'Friday',    month: 'December',  type: 'Federal Holiday', description: 'Celebration of Christmas.' },
      ],
    },
  },

  // ── 2. INDIA ────────────────────────────────────────────────────────────────
  india: {
    country: SUPPORTED_COUNTRIES.find(c => c.id === 'india')!,
    years: {
      2025: [
        { id: 'in-25-01', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Republic Day',             date: '2025-01-26', day: 'Sunday',    month: 'January',   type: 'National Holiday', description: 'Honors the date on which the Constitution of India came into effect in 1950.' },
        { id: 'in-25-02', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Maha Shivratri',           date: '2025-02-26', day: 'Wednesday', month: 'February',  type: 'Gazetted Holiday', description: 'Hindu festival celebrating the solemn wedding of Shiva and Parvati.' },
        { id: 'in-25-03', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Holi',                     date: '2025-03-14', day: 'Friday',    month: 'March',     type: 'Gazetted Holiday', description: 'Festival of colors celebrating love, springtime, and triumph of good.' },
        { id: 'in-25-04', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Id-ul-Fitr (Ramadan Eid)', date: '2025-03-31', day: 'Monday',    month: 'March',     type: 'Gazetted Holiday', description: 'Islamic festival marking the end of Ramadan fasting.' },
        { id: 'in-25-05', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Mahavir Jayanti',          date: '2025-04-10', day: 'Thursday',  month: 'April',     type: 'Gazetted Holiday', description: 'Birth anniversary of Lord Mahavira, founder of Jainism.' },
        { id: 'in-25-06', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Good Friday',              date: '2025-04-18', day: 'Friday',    month: 'April',     type: 'Gazetted Holiday', description: 'Christian holiday commemorating the passion and crucifixion of Jesus.' },
        { id: 'in-25-07', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Buddha Purnima',           date: '2025-05-12', day: 'Monday',    month: 'May',       type: 'Gazetted Holiday', description: 'Commemorates the birth, enlightenment, and nirvana of Gautama Buddha.' },
        { id: 'in-25-08', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Bakrid / Eid al-Adha',     date: '2025-06-07', day: 'Saturday',  month: 'June',      type: 'Gazetted Holiday', description: 'Islamic Feast of the Sacrifice.' },
        { id: 'in-25-09', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Muharram',                 date: '2025-07-06', day: 'Sunday',    month: 'July',      type: 'Gazetted Holiday', description: 'First month of Islamic calendar and solemn remembrance.' },
        { id: 'in-25-10', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Independence Day',         date: '2025-08-15', day: 'Friday',    month: 'August',    type: 'National Holiday', description: 'Celebrates independence from British rule in 1947.' },
        { id: 'in-25-11', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Milad un-Nabi',            date: '2025-09-05', day: 'Friday',    month: 'September', type: 'Gazetted Holiday', description: 'Birthday of the Prophet Muhammad.' },
        { id: 'in-25-12', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Mahatma Gandhi Jayanti',   date: '2025-10-02', day: 'Thursday',  month: 'October',   type: 'National Holiday', description: 'Birth anniversary of Mahatma Gandhi, Father of the Nation.' },
        { id: 'in-25-13', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Dussehra (Vijayadashami)', date: '2025-10-02', day: 'Thursday',  month: 'October',   type: 'Gazetted Holiday', description: 'Hindu festival celebrating the victory of Lord Rama over Ravana.' },
        { id: 'in-25-14', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Diwali (Deepavali)',       date: '2025-10-20', day: 'Monday',    month: 'October',   type: 'Gazetted Holiday', description: 'Festival of Lights symbolizing spiritual victory of light over darkness.' },
        { id: 'in-25-15', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Guru Nanak Jayanti',       date: '2025-11-05', day: 'Wednesday', month: 'November',  type: 'Gazetted Holiday', description: 'Celebrates the birth anniversary of Guru Nanak Dev Ji.' },
        { id: 'in-25-16', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Christmas Day',             date: '2025-12-25', day: 'Thursday',  month: 'December',  type: 'Gazetted Holiday', description: 'Christmas celebration.' },
      ],
      2026: [
        { id: 'in-26-01', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Republic Day',             date: '2026-01-26', day: 'Monday',    month: 'January',   type: 'National Holiday', description: 'Constitution enactment anniversary.' },
        { id: 'in-26-02', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Maha Shivratri',           date: '2026-02-15', day: 'Sunday',    month: 'February',  type: 'Gazetted Holiday', description: 'Night of Shiva festival.' },
        { id: 'in-26-03', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Holi',                     date: '2026-03-04', day: 'Wednesday', month: 'March',     type: 'Gazetted Holiday', description: 'Festival of Colors.' },
        { id: 'in-26-04', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Good Friday',              date: '2026-04-03', day: 'Friday',    month: 'April',     type: 'Gazetted Holiday', description: 'Good Friday church service.' },
        { id: 'in-26-05', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Independence Day',         date: '2026-08-15', day: 'Saturday',  month: 'August',    type: 'National Holiday', description: 'Indian Independence Day.' },
        { id: 'in-26-06', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Mahatma Gandhi Jayanti',   date: '2026-10-02', day: 'Friday',    month: 'October',   type: 'National Holiday', description: 'Gandhi birthday observance.' },
        { id: 'in-26-07', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Dussehra',                 date: '2026-10-20', day: 'Tuesday',   month: 'October',   type: 'Gazetted Holiday', description: 'Vijayadashami festival.' },
        { id: 'in-26-08', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Diwali (Deepavali)',       date: '2026-11-08', day: 'Sunday',    month: 'November',  type: 'Gazetted Holiday', description: 'Festival of Lights.' },
        { id: 'in-26-09', countryId: 'india', countryName: 'India', flag: '🇮🇳', name: 'Christmas Day',             date: '2026-12-25', day: 'Friday',    month: 'December',  type: 'Gazetted Holiday', description: 'Christmas celebration.' },
      ],
    },
  },

  // ── 3. PHILIPPINES ──────────────────────────────────────────────────────────
  philippines: {
    country: SUPPORTED_COUNTRIES.find(c => c.id === 'philippines')!,
    years: {
      2025: [
        { id: 'ph-25-01', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: "New Year's Day",            date: '2025-01-01', day: 'Wednesday', month: 'January',   type: 'Regular Holiday',        description: 'First day of the Gregorian year.' },
        { id: 'ph-25-02', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Chinese New Year',          date: '2025-01-29', day: 'Wednesday', month: 'January',   type: 'Special Non-Working Day', description: 'Celebration of the Lunar New Year.' },
        { id: 'ph-25-03', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'EDSA People Power Day',     date: '2025-02-25', day: 'Tuesday',   month: 'February',  type: 'Special Non-Working Day', description: 'Commemorates the 1986 EDSA People Power Revolution.' },
        { id: 'ph-25-04', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Araw ng Kagitingan',        date: '2025-04-09', day: 'Wednesday', month: 'April',     type: 'Regular Holiday',        description: 'Day of Valor commemorating the Battle of Bataan in WWII.' },
        { id: 'ph-25-05', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Maundy Thursday',           date: '2025-04-17', day: 'Thursday',  month: 'April',     type: 'Regular Holiday',        description: 'Semana Santa Holy Thursday religious observance.' },
        { id: 'ph-25-06', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Good Friday',               date: '2025-04-18', day: 'Friday',    month: 'April',     type: 'Regular Holiday',        description: 'Semana Santa Good Friday solemn passion remembrance.' },
        { id: 'ph-25-07', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Black Saturday',            date: '2025-04-19', day: 'Saturday',  month: 'April',     type: 'Special Non-Working Day', description: 'Holy Week preparation day before Easter.' },
        { id: 'ph-25-08', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Labor Day',                 date: '2025-05-01', day: 'Thursday',  month: 'May',       type: 'Regular Holiday',        description: 'Honors the hard work and dedication of Filipino workers.' },
        { id: 'ph-25-09', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Independence Day',          date: '2025-06-12', day: 'Thursday',  month: 'June',      type: 'Regular Holiday',        description: 'Commemorates the 1898 Philippine Declaration of Independence.' },
        { id: 'ph-25-10', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Ninoy Aquino Day',          date: '2025-08-21', day: 'Thursday',  month: 'August',    type: 'Special Non-Working Day', description: 'Honors the memory and sacrifice of Senator Benigno Aquino Jr.' },
        { id: 'ph-25-11', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'National Heroes Day',       date: '2025-08-25', day: 'Monday',    month: 'August',    type: 'Regular Holiday',        description: 'National Heroes Day honors all known and unknown heroes of freedom.' },
        { id: 'ph-25-12', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: "All Saints' Day",           date: '2025-11-01', day: 'Saturday',  month: 'November',  type: 'Special Non-Working Day', description: 'Undas - Day of prayer honoring all departed saints.' },
        { id: 'ph-25-13', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: "All Souls' Day",            date: '2025-11-02', day: 'Sunday',    month: 'November',  type: 'Special Working Day',    description: 'Undas - Day of remembrance for departed faithful.' },
        { id: 'ph-25-14', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Bonifacio Day',             date: '2025-11-30', day: 'Sunday',    month: 'November',  type: 'Regular Holiday',        description: 'Birth anniversary of Katipunan supreme leader Andres Bonifacio.' },
        { id: 'ph-25-15', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Immaculate Conception',    date: '2025-12-08', day: 'Monday',    month: 'December',  type: 'Special Non-Working Day', description: 'Feast of the Immaculate Conception, patroness of the Philippines.' },
        { id: 'ph-25-16', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Christmas Eve',             date: '2025-12-24', day: 'Wednesday', month: 'December',  type: 'Special Non-Working Day', description: 'Special non-working day for Christmas Eve family reunions.' },
        { id: 'ph-25-17', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Christmas Day',             date: '2025-12-25', day: 'Thursday',  month: 'December',  type: 'Regular Holiday',        description: 'Araw ng Pasko - Festive celebration of the birth of Jesus.' },
        { id: 'ph-25-18', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Rizal Day',                 date: '2025-12-30', day: 'Tuesday',   month: 'December',  type: 'Regular Holiday',        description: 'Honors the martyrdom and patriotism of national hero Dr. Jose Rizal.' },
        { id: 'ph-25-19', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: "New Year's Eve",            date: '2025-12-31', day: 'Wednesday', month: 'December',  type: 'Special Non-Working Day', description: 'Year-end celebrations and family reunions.' },
      ],
      2026: [
        { id: 'ph-26-01', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: "New Year's Day",            date: '2026-01-01', day: 'Thursday',  month: 'January',   type: 'Regular Holiday',        description: 'New Year celebration.' },
        { id: 'ph-26-02', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Chinese New Year',          date: '2026-02-17', day: 'Tuesday',   month: 'February',  type: 'Special Non-Working Day', description: 'Lunar New Year.' },
        { id: 'ph-26-03', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Maundy Thursday',           date: '2026-04-02', day: 'Thursday',  month: 'April',     type: 'Regular Holiday',        description: 'Holy Thursday.' },
        { id: 'ph-26-04', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Good Friday',               date: '2026-04-03', day: 'Friday',    month: 'April',     type: 'Regular Holiday',        description: 'Good Friday.' },
        { id: 'ph-26-05', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Araw ng Kagitingan',        date: '2026-04-09', day: 'Thursday',  month: 'April',     type: 'Regular Holiday',        description: 'Day of Valor.' },
        { id: 'ph-26-06', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Labor Day',                 date: '2026-05-01', day: 'Friday',    month: 'May',       type: 'Regular Holiday',        description: 'Labor Day.' },
        { id: 'ph-26-07', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Independence Day',          date: '2026-06-12', day: 'Friday',    month: 'June',      type: 'Regular Holiday',        description: 'Philippine Independence Day.' },
        { id: 'ph-26-08', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'National Heroes Day',       date: '2026-08-31', day: 'Monday',    month: 'August',    type: 'Regular Holiday',        description: 'National Heroes Day.' },
        { id: 'ph-26-09', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: "All Saints' Day",           date: '2026-11-01', day: 'Sunday',    month: 'November',  type: 'Special Non-Working Day', description: "All Saints' Day." },
        { id: 'ph-26-10', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Bonifacio Day',             date: '2026-11-30', day: 'Monday',    month: 'November',  type: 'Regular Holiday',        description: 'Bonifacio Day.' },
        { id: 'ph-26-11', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Christmas Day',             date: '2026-12-25', day: 'Friday',    month: 'December',  type: 'Regular Holiday',        description: 'Christmas Day.' },
        { id: 'ph-26-12', countryId: 'philippines', countryName: 'Philippines', flag: '🇵🇭', name: 'Rizal Day',                 date: '2026-12-30', day: 'Wednesday', month: 'December',  type: 'Regular Holiday',        description: 'Rizal Day.' },
      ],
    },
  },

  // ── 4. CANADA ───────────────────────────────────────────────────────────────
  canada: {
    country: SUPPORTED_COUNTRIES.find(c => c.id === 'canada')!,
    years: {
      2025: [
        { id: 'ca-25-01', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: "New Year's Day",            date: '2025-01-01', day: 'Wednesday', month: 'January',   type: 'Statutory Holiday', description: 'Celebration of the New Year.' },
        { id: 'ca-25-02', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Family Day',               date: '2025-02-17', day: 'Monday',    month: 'February',  type: 'Statutory Holiday', description: 'Celebration of family life and community.' },
        { id: 'ca-25-03', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Good Friday',               date: '2025-04-18', day: 'Friday',    month: 'April',     type: 'Statutory Holiday', description: 'Christian observance before Easter.' },
        { id: 'ca-25-04', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Victoria Day',              date: '2025-05-19', day: 'Monday',    month: 'May',       type: 'Statutory Holiday', description: "Celebrates Queen Victoria's birthday." },
        { id: 'ca-25-05', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Canada Day',                 date: '2025-07-01', day: 'Tuesday',   month: 'July',      type: 'Statutory Holiday', description: 'Celebrates the 1867 Canadian Confederation.' },
        { id: 'ca-25-06', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Civic Holiday',             date: '2025-08-04', day: 'Monday',    month: 'August',    type: 'Public Holiday',    description: 'Mid-summer civic holiday.' },
        { id: 'ca-25-07', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Labour Day',                 date: '2025-09-01', day: 'Monday',    month: 'September', type: 'Statutory Holiday', description: 'Honors the labor movement and workers.' },
        { id: 'ca-25-08', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Truth & Reconciliation Day', date: '2025-09-30', day: 'Tuesday',   month: 'September', type: 'Federal Statutory',  description: 'Honors Indigenous residential school survivors and families.' },
        { id: 'ca-25-09', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Thanksgiving',              date: '2025-10-13', day: 'Monday',    month: 'October',   type: 'Statutory Holiday', description: 'Celebration of harvest and blessings.' },
        { id: 'ca-25-10', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Remembrance Day',            date: '2025-11-11', day: 'Tuesday',   month: 'November',  type: 'Statutory Holiday', description: 'Honors armed forces members who died in service.' },
        { id: 'ca-25-11', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Christmas Day',             date: '2025-12-25', day: 'Thursday',  month: 'December',  type: 'Statutory Holiday', description: 'Celebration of Christmas.' },
        { id: 'ca-25-12', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Boxing Day',                 date: '2025-12-26', day: 'Friday',    month: 'December',  type: 'Statutory Holiday', description: 'Post-Christmas civic holiday.' },
      ],
      2026: [
        { id: 'ca-26-01', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: "New Year's Day",            date: '2026-01-01', day: 'Thursday',  month: 'January',   type: 'Statutory Holiday', description: 'New Year celebration.' },
        { id: 'ca-26-02', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Good Friday',               date: '2026-04-03', day: 'Friday',    month: 'April',     type: 'Statutory Holiday', description: 'Good Friday.' },
        { id: 'ca-26-03', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Victoria Day',              date: '2026-05-18', day: 'Monday',    month: 'May',       type: 'Statutory Holiday', description: 'Victoria Day.' },
        { id: 'ca-26-04', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Canada Day',                 date: '2026-07-01', day: 'Wednesday', month: 'July',      type: 'Statutory Holiday', description: 'Canada Day.' },
        { id: 'ca-26-05', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Labour Day',                 date: '2026-09-07', day: 'Monday',    month: 'September', type: 'Statutory Holiday', description: 'Labour Day.' },
        { id: 'ca-26-06', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Thanksgiving',              date: '2026-10-12', day: 'Monday',    month: 'October',   type: 'Statutory Holiday', description: 'Thanksgiving.' },
        { id: 'ca-26-07', countryId: 'canada', countryName: 'Canada', flag: '🇨🇦', name: 'Christmas Day',             date: '2026-12-25', day: 'Friday',    month: 'December',  type: 'Statutory Holiday', description: 'Christmas celebration.' },
      ],
    },
  },

  // ── 5. BRAZIL ───────────────────────────────────────────────────────────────
  brazil: {
    country: SUPPORTED_COUNTRIES.find(c => c.id === 'brazil')!,
    years: {
      2025: [
        { id: 'br-25-01', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Universal Brotherhood Day',  date: '2025-01-01', day: 'Wednesday', month: 'January',   type: 'National Holiday', description: "New Year's Day and day of peace." },
        { id: 'br-25-02', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Carnival',                  date: '2025-03-03', day: 'Monday',    month: 'March',     type: 'Optional Holiday', description: 'World-famous festival before Lent.' },
        { id: 'br-25-03', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Carnival Tuesday',          date: '2025-03-04', day: 'Tuesday',   month: 'March',     type: 'Optional Holiday', description: 'Main day of Carnival celebration.' },
        { id: 'br-25-04', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Good Friday',               date: '2025-04-18', day: 'Friday',    month: 'April',     type: 'National Holiday', description: 'Sexta-feira Santa religious holiday.' },
        { id: 'br-25-05', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Tiradentes Day',            date: '2025-04-21', day: 'Monday',    month: 'April',     type: 'National Holiday', description: 'Honors national martyr Joaquim José da Silva Xavier.' },
        { id: 'br-25-06', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Labor Day',                 date: '2025-05-01', day: 'Thursday',  month: 'May',       type: 'National Holiday', description: 'Dia do Trabalhador.' },
        { id: 'br-25-07', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Corpus Christi',            date: '2025-06-19', day: 'Thursday',  month: 'June',      type: 'Optional Holiday', description: 'Catholic solemnity of the Body and Blood of Christ.' },
        { id: 'br-25-08', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Independence Day',          date: '2025-09-07', day: 'Sunday',    month: 'September', type: 'National Holiday', description: 'Celebrates independence from Portugal in 1822.' },
        { id: 'br-25-09', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Our Lady of Aparecida',     date: '2025-10-12', day: 'Sunday',    month: 'October',   type: 'National Holiday', description: 'Patron saint of Brazil and Children\'s Day.' },
        { id: 'br-25-10', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: "All Souls' Day",            date: '2025-11-02', day: 'Sunday',    month: 'November',  type: 'National Holiday', description: 'Dia de Finados remembering departed loved ones.' },
        { id: 'br-25-11', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Republic Proclamation Day', date: '2025-11-15', day: 'Saturday',  month: 'November',  type: 'National Holiday', description: 'Commemorates the proclamation of the Republic in 1889.' },
        { id: 'br-25-12', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Black Consciousness Day',   date: '2025-11-20', day: 'Thursday',  month: 'November',  type: 'National Holiday', description: 'Honors Zumbi dos Palmares and Afro-Brazilian culture.' },
        { id: 'br-25-13', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Christmas Day',             date: '2025-12-25', day: 'Thursday',  month: 'December',  type: 'National Holiday', description: 'Natal celebration.' },
      ],
      2026: [
        { id: 'br-26-01', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Universal Brotherhood Day',  date: '2026-01-01', day: 'Thursday',  month: 'January',   type: 'National Holiday', description: 'New Year celebration.' },
        { id: 'br-26-02', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Carnival Tuesday',          date: '2026-02-17', day: 'Tuesday',   month: 'February',  type: 'Optional Holiday', description: 'Carnival festival.' },
        { id: 'br-26-03', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Good Friday',               date: '2026-04-03', day: 'Friday',    month: 'April',     type: 'National Holiday', description: 'Sexta-feira Santa.' },
        { id: 'br-26-04', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Labor Day',                 date: '2026-05-01', day: 'Friday',    month: 'May',       type: 'National Holiday', description: 'Labor Day.' },
        { id: 'br-26-05', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Independence Day',          date: '2026-09-07', day: 'Monday',    month: 'September', type: 'National Holiday', description: 'Independence Day.' },
        { id: 'br-26-06', countryId: 'brazil', countryName: 'Brazil', flag: '🇧🇷', name: 'Christmas Day',             date: '2026-12-25', day: 'Friday',    month: 'December',  type: 'National Holiday', description: 'Christmas Day.' },
      ],
    },
  },

  // ── 6. MEXICO ───────────────────────────────────────────────────────────────
  mexico: {
    country: SUPPORTED_COUNTRIES.find(c => c.id === 'mexico')!,
    years: {
      2025: [
        { id: 'mx-25-01', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: "New Year's Day",            date: '2025-01-01', day: 'Wednesday', month: 'January',   type: 'Statutory Holiday', description: 'Año Nuevo.' },
        { id: 'mx-25-02', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: 'Constitution Day',          date: '2025-02-03', day: 'Monday',    month: 'February',  type: 'Statutory Holiday', description: 'Commemorates the 1917 Constitution of Mexico.' },
        { id: 'mx-25-03', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: "Benito Juárez's Birthday",  date: '2025-03-17', day: 'Monday',    month: 'March',     type: 'Statutory Holiday', description: 'Honors national hero Benito Juárez.' },
        { id: 'mx-25-04', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: 'Labor Day',                 date: '2025-05-01', day: 'Thursday',  month: 'May',       type: 'Statutory Holiday', description: 'Día del Trabajo.' },
        { id: 'mx-25-05', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: 'Independence Day',          date: '2025-09-16', day: 'Tuesday',   month: 'September', type: 'Statutory Holiday', description: 'Día de la Independencia celebrating the Grito de Dolores.' },
        { id: 'mx-25-06', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: 'Revolution Day',            date: '2025-11-17', day: 'Monday',    month: 'November',  type: 'Statutory Holiday', description: 'Commemorates the Mexican Revolution of 1910.' },
        { id: 'mx-25-07', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: 'Christmas Day',             date: '2025-12-25', day: 'Thursday',  month: 'December',  type: 'Statutory Holiday', description: 'Navidad celebration.' },
      ],
      2026: [
        { id: 'mx-26-01', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: "New Year's Day",            date: '2026-01-01', day: 'Thursday',  month: 'January',   type: 'Statutory Holiday', description: 'New Year celebration.' },
        { id: 'mx-26-02', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: 'Constitution Day',          date: '2026-02-02', day: 'Monday',    month: 'February',  type: 'Statutory Holiday', description: 'Constitution Day.' },
        { id: 'mx-26-03', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: "Benito Juárez's Birthday",  date: '2026-03-16', day: 'Monday',    month: 'March',     type: 'Statutory Holiday', description: "Benito Juárez's Birthday." },
        { id: 'mx-26-04', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: 'Labor Day',                 date: '2026-05-01', day: 'Friday',    month: 'May',       type: 'Statutory Holiday', description: 'Labor Day.' },
        { id: 'mx-26-05', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: 'Independence Day',          date: '2026-09-16', day: 'Wednesday', month: 'September', type: 'Statutory Holiday', description: 'Independence Day.' },
        { id: 'mx-26-06', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: 'Revolution Day',            date: '2026-11-16', day: 'Monday',    month: 'November',  type: 'Statutory Holiday', description: 'Revolution Day.' },
        { id: 'mx-26-07', countryId: 'mexico', countryName: 'Mexico', flag: '🇲🇽', name: 'Christmas Day',             date: '2026-12-25', day: 'Friday',    month: 'December',  type: 'Statutory Holiday', description: 'Christmas celebration.' },
      ],
    },
  },

  // ── 7. COSTA RICA ───────────────────────────────────────────────────────────
  'costa-rica': {
    country: SUPPORTED_COUNTRIES.find(c => c.id === 'costa-rica')!,
    years: {
      2025: [
        { id: 'cr-25-01', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: "New Year's Day",        date: '2025-01-01', day: 'Wednesday', month: 'January',   type: 'Mandatory Holiday', description: 'Año Nuevo.' },
        { id: 'cr-25-02', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Juan Santamaría Day',   date: '2025-04-11', day: 'Friday',    month: 'April',     type: 'Mandatory Holiday', description: 'Honors the national hero Juan Santamaría.' },
        { id: 'cr-25-03', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Maundy Thursday',       date: '2025-04-17', day: 'Thursday',  month: 'April',     type: 'Mandatory Holiday', description: 'Jueves Santo religious observance.' },
        { id: 'cr-25-04', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Good Friday',           date: '2025-04-18', day: 'Friday',    month: 'April',     type: 'Mandatory Holiday', description: 'Viernes Santo religious observance.' },
        { id: 'cr-25-05', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Labor Day',             date: '2025-05-01', day: 'Thursday',  month: 'May',       type: 'Mandatory Holiday', description: 'Día Internacional del Trabajo.' },
        { id: 'cr-25-06', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Annexation of Nicoya',  date: '2025-07-25', day: 'Friday',    month: 'July',      type: 'Mandatory Holiday', description: 'Celebrates the 1824 annexation of Nicoya.' },
        { id: 'cr-25-07', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: "Mother's Day",          date: '2025-08-15', day: 'Friday',    month: 'August',    type: 'Mandatory Holiday', description: 'Día de la Madre.' },
        { id: 'cr-25-08', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Independence Day',      date: '2025-09-15', day: 'Monday',    month: 'September', type: 'Mandatory Holiday', description: 'Día de la Independencia.' },
        { id: 'cr-25-09', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Army Abolition Day',    date: '2025-12-01', day: 'Monday',    month: 'December',  type: 'Non-Mandatory Holiday', description: 'Celebrates the abolition of the military in 1948.' },
        { id: 'cr-25-10', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Christmas Day',         date: '2025-12-25', day: 'Thursday',  month: 'December',  type: 'Mandatory Holiday', description: 'Navidad celebration.' },
      ],
      2026: [
        { id: 'cr-26-01', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: "New Year's Day",        date: '2026-01-01', day: 'Thursday',  month: 'January',   type: 'Mandatory Holiday', description: 'New Year celebration.' },
        { id: 'cr-26-02', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Maundy Thursday',       date: '2026-04-02', day: 'Thursday',  month: 'April',     type: 'Mandatory Holiday', description: 'Jueves Santo.' },
        { id: 'cr-26-03', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Good Friday',           date: '2026-04-03', day: 'Friday',    month: 'April',     type: 'Mandatory Holiday', description: 'Viernes Santo.' },
        { id: 'cr-26-04', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Labor Day',             date: '2026-05-01', day: 'Friday',    month: 'May',       type: 'Mandatory Holiday', description: 'Labor Day.' },
        { id: 'cr-26-05', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Independence Day',      date: '2026-09-15', day: 'Tuesday',   month: 'September', type: 'Mandatory Holiday', description: 'Independence Day.' },
        { id: 'cr-26-06', countryId: 'costa-rica', countryName: 'Costa Rica', flag: '🇨🇷', name: 'Christmas Day',         date: '2026-12-25', day: 'Friday',    month: 'December',  type: 'Mandatory Holiday', description: 'Christmas celebration.' },
      ],
    },
  },
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Returns holidays for a specific country or all countries in a given year.
 */
export function getHolidaysByYear(countryId: string = 'all', year: number = new Date().getFullYear()): Holiday[] {
  if (countryId !== 'all') {
    const data = HOLIDAY_DATA_BY_COUNTRY[countryId]
    if (!data || !data.years[year]) {
      return data?.years[2025] ?? []
    }
    return [...data.years[year]].sort((a, b) => a.date.localeCompare(b.date))
  }

  // All countries combined
  const combined: Holiday[] = []
  Object.values(HOLIDAY_DATA_BY_COUNTRY).forEach(cData => {
    const list = cData.years[year] ?? cData.years[2025] ?? []
    combined.push(...list)
  })

  return combined.sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Returns the next upcoming holiday for a given country or all countries.
 */
export function getNextHolidayForCountry(countryId: string, referenceDate: Date = new Date()): Holiday | null {
  const currentYear = referenceDate.getFullYear()
  const todayIso = `${currentYear}-${String(referenceDate.getMonth() + 1).padStart(2, '0')}-${String(referenceDate.getDate()).padStart(2, '0')}`

  // Check current year then next year
  const holidays = [
    ...getHolidaysByYear(countryId, currentYear),
    ...getHolidaysByYear(countryId, currentYear + 1),
  ]

  const upcoming = holidays.filter(h => h.date >= todayIso)
  return upcoming.length > 0 ? upcoming[0] : holidays[0] ?? null
}

// Export a legacy flat array for backward compatibility
export const MOCK_HOLIDAYS: Holiday[] = getHolidaysByYear('all', 2025)
