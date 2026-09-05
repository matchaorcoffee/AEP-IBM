import styles from './IbmHolidaysPage.module.scss'
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

      {/* ── Top header bar ────────────────────────────────────────────── */}
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <span className={styles.topBarEyebrow}>IBM · AEP</span>
          <h1 className={styles.topBarTitle}>IBM Holidays</h1>
          <p className={styles.topBarSub}>
            Public holiday calendars for every IBM AEP country location — all in one place.
          </p>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className={styles.main}>
        <div className={styles.inner}>

          {/* Section label */}
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Select a Country</h2>
            <p className={styles.sectionSub}>Click a card to open the full holiday calendar for that location.</p>
          </div>

          {/* Cards */}
          <div className={styles.grid}>
            {countries.map(c => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
              >
                {/* Flag image */}
                <div className={styles.cardMedia}>
                  <img src={c.src} alt={`${c.label} flag`} className={styles.cardImg} />
                </div>

                {/* Card body */}
                <div className={styles.cardBody}>
                  <span className={styles.cardChip}>Public Holidays</span>
                  <span className={styles.cardTitle}>{c.label}</span>
                  <span className={styles.cardAction}>
                    View Calendar
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4"/>
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>

        </div>
      </main>

    </div>
  )
}
