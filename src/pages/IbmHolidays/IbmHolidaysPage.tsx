import styles from './IbmHolidaysPage.module.scss'
import { useFadeIn } from '../../hooks/useFadeIn'
import HolidayWorldMap from './HolidayWorldMap'
import type { HolidayCountry } from './HolidayWorldMap'
import holidaysVideo  from './assets/countries/Holidays Header.mp4'
import brazilImg      from './assets/Brazil.png'
import costaRicaImg   from './assets/CostaRica.png'
import indiaImg       from './assets/India.png'
import mexicoImg      from './assets/Mexico.png'
import philippinesImg from './assets/Philippines.png'
import usaImg         from './assets/USA.png'
import canadaImg      from './assets/Canada.png'

const countries: HolidayCountry[] = [
  { id: 'brazil',      label: 'Brazil',      url: 'https://www.officeholidays.com/countries/brazil',       src: brazilImg,      isoCodes: ['BRA'] },
  { id: 'costa-rica',  label: 'Costa Rica',  url: 'https://www.officeholidays.com/countries/costa-rica',  src: costaRicaImg,   isoCodes: ['CRI'] },
  { id: 'india',       label: 'India',       url: 'https://www.officeholidays.com/countries/india',        src: indiaImg,       isoCodes: ['IND'] },
  { id: 'mexico',      label: 'Mexico',      url: 'https://www.officeholidays.com/countries/mexico',       src: mexicoImg,      isoCodes: ['MEX'] },
  { id: 'philippines', label: 'Philippines', url: 'https://www.officeholidays.com/countries/philippines',  src: philippinesImg, isoCodes: ['PHL'] },
  { id: 'usa',         label: 'USA',         url: 'https://www.officeholidays.com/countries/usa',          src: usaImg,         isoCodes: ['USA'] },
  { id: 'canada',      label: 'Canada',      url: 'https://www.officeholidays.com/countries/canada',       src: canadaImg,      isoCodes: ['CAN'] },
]

export default function IbmHolidaysPage() {
  const mapFade      = useFadeIn<HTMLElement>(0.08)
  const cardsFade    = useFadeIn<HTMLElement>(0.06)

  return (
    <div className={styles.page}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <video
          className={styles.heroVideo}
          src={holidaysVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent} aria-live="polite">
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.heroHeading}>IBM Holidays</h1>
          <p className={styles.heroSub}>
            Public holiday calendars for every IBM AEP country location — all in one place.
          </p>
        </div>
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span>Scroll</span>
          <svg className={styles.scrollChevron} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── White section — Select a Country + World Map ──────────────── */}
      <section
        ref={mapFade.ref}
        className={`${styles.mapSection} ${mapFade.visible ? styles.fadeVisible : styles.fadeHidden}`}
      >
        <div className={styles.inner}>

          {/* Section label */}
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Select a Country</h2>
            <p className={styles.sectionSub}>
              Hover over a country to explore. Double-click to open its holiday calendar.
            </p>
          </div>

          {/* ── Interactive world map ─────────────────────────────────── */}
          <HolidayWorldMap countries={countries} />

        </div>
      </section>

      {/* ── Black section — Featured Countries ────────────────────────── */}
      <section
        ref={cardsFade.ref}
        className={`${styles.cardsSection} ${cardsFade.visible ? styles.fadeVisible : styles.fadeHidden}`}
      >
        <div className={styles.inner}>

          <div className={styles.cardsSectionHead}>
            <h3 className={styles.cardsSectionTitle}>Featured Countries</h3>
            <a
              href="https://www.officeholidays.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardsSectionLink}
            >
              View All Countries →
            </a>
          </div>

          <div className={styles.grid}>
            {countries.map(c => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
              >
                {/* Top image thumbnail */}
                <div className={styles.cardMedia}>
                  <img src={c.src} alt={`${c.label} flag`} className={styles.cardImg} />
                  <div className={styles.cardOverlay} aria-hidden="true" />
                </div>

                {/* Text content below the image */}
                <div className={styles.cardBody}>
                  <span className={styles.cardChip}>Public Holidays</span>
                  <span className={styles.cardTitle}>{c.label}</span>
                  <span className={styles.cardAction}>
                    View Calendar
                    <span className={styles.cardArrow} aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8h10M9 4l4 4-4 4"/>
                      </svg>
                    </span>
                  </span>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

    </div>
  )
}
