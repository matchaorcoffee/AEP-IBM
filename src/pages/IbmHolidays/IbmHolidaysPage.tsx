import styles from './IbmHolidaysPage.module.scss'
import holidaysImg    from './assets/Holidays.jpg'
import brazilImg      from './assets/Brazil.png'
import costaRicaImg   from './assets/CostaRica.png'
import indiaImg       from './assets/India.png'
import mexicoImg      from './assets/Mexico.png'
import philippinesImg from './assets/Philippines.png'
import usaImg         from './assets/USA.png'
import canadaImg      from './assets/Canada.png'

const countries = [
  { id: 'brazil',       label: 'BRAZIL',      src: brazilImg,      url: 'https://www.officeholidays.com/countries/brazil' },
  { id: 'costa-rica',   label: 'COSTA RICA',  src: costaRicaImg,   url: 'https://www.officeholidays.com/countries/costa-rica' },
  { id: 'india',        label: 'INDIA',       src: indiaImg,       url: 'https://www.officeholidays.com/countries/india' },
  { id: 'mexico',       label: 'MEXICO',      src: mexicoImg,      url: 'https://www.officeholidays.com/countries/mexico' },
  { id: 'philippines',  label: 'PHILIPPINES', src: philippinesImg, url: 'https://www.officeholidays.com/countries/philippines' },
  { id: 'usa',          label: 'USA',         src: usaImg,         url: 'https://www.officeholidays.com/countries/usa' },
  { id: 'canada',       label: 'CANADA',      src: canadaImg,      url: 'https://www.officeholidays.com/countries/canada' },
]

export default function IbmHolidaysPage() {
  const row1 = countries.slice(0, 3)
  const row2 = countries.slice(3)

  return (
    <div className={styles.page}>

      {/* ── Hero banner ─────────────────────────────────────────── */}
      <div className={styles.hero}>
        <img src={holidaysImg} alt="IBM Holidays" className={styles.heroImg} />
      </div>

      {/* ── Page title ──────────────────────────────────────────── */}
      <div className={styles.titleBlock}>
        <h1 className={styles.pageTitle}>Holidays</h1>
      </div>

      {/* ── Country grid ────────────────────────────────────────── */}
      <div className={styles.content}>
        <div className={styles.row3}>
          {row1.map(c => (
            <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" className={styles.countryCard}>
              <div className={styles.imgWrapper}>
                <img src={c.src} alt={c.label} className={styles.countryImg} />
              </div>
              <span className={styles.countryLabel}>{c.label}</span>
            </a>
          ))}
        </div>

        <div className={styles.row4}>
          {row2.map(c => (
            <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" className={styles.countryCard}>
              <div className={styles.imgWrapper}>
                <img src={c.src} alt={c.label} className={styles.countryImg} />
              </div>
              <span className={styles.countryLabel}>{c.label}</span>
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}
