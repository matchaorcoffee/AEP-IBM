import { useState } from 'react'
import styles from './IbmCicsPage.module.scss'
import fncVideo from './assets/IBMFNC.mp4'

const LOCATIONS = [
  { name: 'COSTA RICA',  img: 'COSTARICA'   },
  { name: 'INDIA',       img: 'INDIA'        },
  { name: 'MEXICO',      img: 'MEXICO'       },
  { name: 'PHILIPPINES', img: 'PHILIPPINES'  },
  { name: 'USA',         img: 'USA'          },
  { name: 'BRAZIL',      img: 'BRAZIL'       },
  { name: 'CANADA',      img: 'CANADA'       },
]

const COUNTRY_INFO = [
  {
    id: 'brazil',
    title: 'FNC BRAZIL',
    body: [
      'IBM Brazil has been providing business information services for over two decades, with a focus on remote clients since 2001. The country has been vital to IBM\'s history, as it hosted the company\'s first international office in 1917. IBM Brazil has gained expertise in the Telecommunications and Financial Services sectors through active participation in the domestic market.',
      'In 2005, the IBM FNC in Brazil achieved a significant milestone by reaching CMMI Level 5, demonstrating its commitment to service quality. Each IBM FutureNow Center is designed for efficient service delivery and offers a wide range of remote custom and ISV service options.',
      'Brazil\'s proximity to the United States, with a maximum time zone difference of just two hours, along with proficiency in English, Spanish, and Portuguese, ensures that IBM Brazil will continue to hold strategic importance in the years to come.',
    ],
  },
  {
    id: 'costarica',
    title: 'FNC COSTA RICA',
    body: [
      'Costa Rica stands out as one of the world\'s top five countries for investment, boasting a safe capital city and a stable democracy spanning 120 years, with no army since 1948. Despite its small population of around 5 million, Costa Rica excels in digital competencies, human capital, and the quality of its graduates, particularly in STEAM fields, with approximately 9,000 graduates annually, 37% of whom are women.',
      'The country is also renowned for its significant investments in public health and education.',
      'FNC Costa Rica is a valuable technology outsourcing and service center, offering support to global clients in areas such as ITO, BPO, Cloud, Cybersecurity Services, and various shared services for IBM.',
      'It has been in operation since 2004, initially providing back-office services for Human Resources.',
    ],
  },
  {
    id: 'india',
    title: 'FNC INDIA',
    body: [
      'India offers competitive delivery solutions through global, regional, local and on-site expertise to help clients successfully compete in today\'s economic environment. Known for commitment of Delivery Excellence to clients who comprise of the top names in business worldwide, the center comes with the right mix of expertise, experience, innovation and flexibility.',
      'IBM FNC — India operates from 11 FutureNow Centers across India.',
      'Operating in a FutureNow Center framework, IBM FNC — India is the professional services arm of Global Services. With a talented and dedicated pool of co-located consulting Client Service Professionals, the center enables customers in their mission critical and business critical work, by deploying future-ready solutions using deep FutureNow Center capabilities, and is armed with deep expertise and experience.',
    ],
  },
  {
    id: 'mexico',
    title: 'FNC MEXICO',
    body: [
      'Mexico is one of IBM\'s most important delivery centers in Latin America, combining technical expertise with bilingual capabilities in English and Spanish. The FNC in Mexico supports a wide range of services including application development, infrastructure management, and business process outsourcing.',
      'The center has been instrumental in driving digital transformation for clients across multiple industries, leveraging Mexico\'s strong talent pool in engineering and technology.',
    ],
  },
  {
    id: 'philippines',
    title: 'FNC PHILIPPINES',
    body: [
      'The Philippines is a key hub for IBM\'s global delivery network, known for its highly skilled English-speaking workforce and strong cultural affinity with Western business practices. The FNC in the Philippines specializes in IT services, business process management, and analytics.',
      'With a large pool of IT and business graduates entering the workforce each year, the Philippines continues to be a strategic location for IBM\'s service delivery operations.',
    ],
  },
  {
    id: 'usa',
    title: 'FNC USA',
    body: [
      'The United States FutureNow Centers serve as domestic delivery hubs that provide clients with onshore expertise and proximity. IBM\'s US-based FNCs focus on high-value consulting, emerging technology deployment, and mission-critical application management.',
      'Strategically located across the country, the US centers work in close collaboration with IBM\'s global delivery network to offer seamless hybrid delivery models.',
    ],
  },
  {
    id: 'canada',
    title: 'FNC CANADA',
    body: [
      'Canada\'s FutureNow Centers are known for their expertise in financial services, government, and natural resources sectors. With a highly educated, bilingual workforce and a reputation for stability and innovation, IBM Canada plays an important role in delivering complex, large-scale transformation programs.',
      'The Canadian centers work alongside US and global FNCs to provide near-shore delivery advantages for North American clients.',
    ],
  },
]

export default function IbmCicsPage() {
  const [loadedCount, setLoadedCount] = useState(0)
  const hasImages = loadedCount > 0

  return (
    <div className={styles.page}>

      {/* Full-width video banner */}
      <div className={styles.videoBanner} role="region" aria-label="IBM FutureNow Centers video banner">
        <video
          className={styles.bannerVideo}
          src={fncVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Centered page title */}
      <section className={styles.titleSection} aria-labelledby="fnc-heading">
        <h1 id="fnc-heading" className={styles.pageTitle}>IBM FutureNow Center</h1>
      </section>

      {/* Inset diagonal country image strip — only shown when images are available */}
      {hasImages && (
        <section className={styles.stripSection} aria-label="FNC global locations">
          <div className={styles.locationsTrack}>
            {LOCATIONS.map((loc) => (
              <div key={loc.name} className={styles.locationSlice}>
                <div
                  className={styles.locationImg}
                  style={{ backgroundImage: `url(/src/pages/IbmCics/assets/${loc.img}.jpg)` }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hidden image probes to detect when assets exist */}
      <div style={{ display: 'none' }} aria-hidden="true">
        {LOCATIONS.map((loc) => (
          <img
            key={loc.name}
            src={`/src/pages/IbmCics/assets/${loc.img}.jpg`}
            onLoad={() => setLoadedCount(c => c + 1)}
            alt=""
          />
        ))}
      </div>

      {/* Centered description */}
      <section className={styles.descSection}>
        <p className={styles.descText}>
          IBM FutureNow Center (FNC) — Global capability combines industry and process skills with
          solutioning expertise providing quality assured remote delivery. IBM's FNCs serve as the
          behind-the-scenes catalysts driving innovation. Spanning 17 countries and encompassing
          34 languages, our FNC experts collaborate with clients to revolutionize their work
          processes, harnessing the power of intelligent automation and smart workflows.
        </p>
      </section>

      {/* Country info cards */}
      <section className={styles.cardsSection} aria-label="FNC country details">
        <div className={styles.cardsGrid}>
          {COUNTRY_INFO.map((country) => (
            <div key={country.id} className={styles.countryCard}>
              <h2 className={styles.countryTitle}>{country.title}</h2>
              {country.body.map((para, i) => (
                <p key={i} className={styles.countryBody}>{para}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
