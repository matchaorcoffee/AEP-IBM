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
  { id: 'brazil',       label: 'Brazil',      src: brazilImg,      url: 'https://www.officeholidays.com/countries/brazil' },
  { id: 'costa-rica',   label: 'Costa Rica',  src: costaRicaImg,   url: 'https://www.officeholidays.com/countries/costa-rica' },
  { id: 'india',        label: 'India',       src: indiaImg,       url: 'https://www.officeholidays.com/countries/india' },
  { id: 'mexico',       label: 'Mexico',      src: mexicoImg,      url: 'https://www.officeholidays.com/countries/mexico' },
  { id: 'philippines',  label: 'Philippines', src: philippinesImg, url: 'https://www.officeholidays.com/countries/philippines' },
  { id: 'usa',          label: 'USA',         src: usaImg,         url: 'https://www.officeholidays.com/countries/usa' },
  { id: 'canada',       label: 'Canada',      src: canadaImg,      url: 'https://www.officeholidays.com/countries/canada' },
]

export default function IbmHolidaysPage() {
  return (
    <div className={styles.page}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <img src={holidaysImg} alt="IBM Holidays" className={styles.heroImg} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.heroHeading}>IBM Holidays</h1>
          <p className={styles.heroSub}>
            Public holiday calendars for every IBM AEP country location, all in one place.
          </p>
        </div>
      </div>

      {/* ── Intro section ─────────────────────────────────────────────── */}
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <div className={styles.introLabel}>Country Calendars</div>
          <h2 className={styles.introHeading}>Select Your Country</h2>
          <p className={styles.introSub}>
            Click on any country below to view its full public holiday schedule for the year.
          </p>
        </div>
      </section>

      {/* ── Country cards ─────────────────────────────────────────────── */}
      <section className={styles.cardsSection} aria-label="Country holiday calendars">
        <div className={styles.cardsInner}>
          <div className={styles.grid}>
            {countries.map(c => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
              >
                <div className={styles.cardImg}>
                  <img src={c.src} alt={c.label} />
                </div>
                <div className={styles.cardOverlay} aria-hidden="true" />
                <div className={styles.cardBody}>
                  <span className={styles.cardLabel}>{c.label}</span>
                  <span className={styles.cardCta}>View Holidays ↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
