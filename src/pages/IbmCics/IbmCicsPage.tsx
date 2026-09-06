import styles from './IbmCicsPage.module.scss'
import fncVideo from './assets/IBMFNC.mp4'

const COUNTRY_INFO = [
  {
    id: 'brazil',
    title: 'FNC Brazil',
    gradient: 'green',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    body: "IBM Brazil has been providing business information services for over two decades. In 2005, the IBM FNC in Brazil achieved CMMI Level 5. Brazil's proximity to the US, with a maximum time zone difference of just two hours, along with proficiency in English, Spanish, and Portuguese, ensures strategic importance for years to come.",
  },
  {
    id: 'costarica',
    title: 'FNC Costa Rica',
    gradient: 'teal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    body: "Costa Rica stands out as one of the world's top five countries for investment, boasting a stable democracy spanning 120 years. FNC Costa Rica has been in operation since 2004, offering ITO, BPO, Cloud, Cybersecurity Services, and shared services to global clients.",
  },
  {
    id: 'india',
    title: 'FNC India',
    gradient: 'lavender',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    body: "IBM FNC — India operates from 11 FutureNow Centers across India. Operating in a FutureNow Center framework, it is the professional services arm of Global Services, enabling customers in their mission-critical and business-critical work.",
  },
  {
    id: 'mexico',
    title: 'FNC Mexico',
    gradient: 'orange',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    body: "Mexico is one of IBM's most important delivery centers in Latin America, combining technical expertise with bilingual capabilities. The FNC in Mexico supports application development, infrastructure management, and business process outsourcing.",
  },
  {
    id: 'philippines',
    title: 'FNC Philippines',
    gradient: 'sky',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    body: "The Philippines is a key hub for IBM's global delivery network, known for its highly skilled English-speaking workforce. The FNC specialises in IT services, business process management, and analytics, with a large pool of IT graduates entering the workforce each year.",
  },
  {
    id: 'usa',
    title: 'FNC USA',
    gradient: 'mint',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M3 15h18M9 3v18"/>
      </svg>
    ),
    body: "IBM's US-based FNCs focus on high-value consulting, emerging technology deployment, and mission-critical application management. Strategically located across the country, they offer seamless hybrid delivery models in collaboration with IBM's global network.",
  },
  {
    id: 'canada',
    title: 'FNC Canada',
    gradient: 'rose',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    body: "Canada's FutureNow Centers are known for their expertise in financial services, government, and natural resources. With a highly educated, bilingual workforce and a reputation for stability, IBM Canada plays an important role in delivering complex, large-scale transformation programmes.",
  },
]

const CAPABILITIES = [
  {
    id: 'ito',
    title: 'IT Outsourcing',
    description: 'End-to-end infrastructure, cloud, and managed services delivered from global FNC locations.',
    icon: '🖥️',
    gradient: 'teal',
  },
  {
    id: 'bpo',
    title: 'Business Process',
    description: 'Finance, HR, procurement, and supply-chain BPO delivered with precision and scale.',
    icon: '⚙️',
    gradient: 'lavender',
  },
  {
    id: 'cloud',
    title: 'Cloud & Hybrid',
    description: 'Hybrid cloud transformation, migration, and ongoing management across public and private environments.',
    icon: '☁️',
    gradient: 'sky',
  },
  {
    id: 'security',
    title: 'Cybersecurity',
    description: 'Threat detection, compliance, and security operations protecting critical enterprise assets.',
    icon: '🔒',
    gradient: 'mint',
  },
  {
    id: 'consulting',
    title: 'Consulting',
    description: 'Business transformation consulting combining IBM methodology with deep domain expertise.',
    icon: '💡',
    gradient: 'orange',
  },
  {
    id: 'analytics',
    title: 'Data & Analytics',
    description: 'AI-powered analytics, data engineering, and insight-driven decision support solutions.',
    icon: '📊',
    gradient: 'rose',
  },
]

export default function IbmCicsPage() {
  return (
    <div className={styles.page}>

      {/* ── Hero — video with overlay ──────────────────────────────────── */}
      <div className={styles.hero} role="region" aria-label="IBM FutureNow Centers">
        <video
          className={styles.heroVideo}
          src={fncVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>IBM · AEP</div>
          <h1 className={styles.heroHeading}>IBM FutureNow Centers</h1>
          <p className={styles.heroSub}>
            Global capability combining industry and process skills with solutioning expertise —
            spanning 17 countries and 34 languages.
          </p>
        </div>
      </div>

      {/* ── Intro / Welcome section ───────────────────────────────────── */}
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <div className={styles.introLabel}>Global Delivery Network</div>
          <h2 className={styles.introHeading}>Powering Innovation Worldwide</h2>
          <p className={styles.introSub}>
            IBM FutureNow Centers serve as the behind-the-scenes catalysts driving innovation.
            Our FNC experts collaborate with clients to revolutionise their work processes,
            harnessing the power of intelligent automation and smart workflows.
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>17</span>
              <span className={styles.statLabel}>Countries</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>34</span>
              <span className={styles.statLabel}>Languages</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>7</span>
              <span className={styles.statLabel}>AEP Locations</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities — icon card grid (IbmGuidingPrinciples pattern) */}
      <section className={styles.capabilities} aria-labelledby="capabilities-heading">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLabel}>What We Deliver</div>
          <h2 id="capabilities-heading" className={styles.sectionTitle}>Core Capabilities</h2>
          <p className={styles.sectionBody}>
            Each FutureNow Center delivers a consistent catalogue of services, tailored to the
            needs of the client engagement they support.
          </p>
        </div>
        <div className={styles.capabilityCards}>
          {CAPABILITIES.map((cap) => (
            <div key={cap.id} className={styles.capabilityCard}>
              <div className={`${styles.capabilityIcon} ${styles[cap.gradient]}`}>{cap.icon}</div>
              <h3 className={styles.capabilityTitle}>{cap.title}</h3>
              <p className={styles.capabilityBody}>{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Country cards — icon card grid ────────────────────────────── */}
      <section className={styles.locations} aria-labelledby="locations-heading">
        <div className={styles.locationsInner}>
          <div className={styles.sectionHeaderCentered}>
            <div className={styles.sectionLabel}>AEP Locations</div>
            <h2 id="locations-heading" className={styles.sectionTitle}>AEP FNC Locations</h2>
            <p className={styles.sectionBody}>
              Learn about each IBM FutureNow Center location supporting the AEP engagement.
            </p>
          </div>
          <div className={styles.locationCards}>
            {COUNTRY_INFO.map((country) => (
              <div key={country.id} className={styles.locationCard}>
                <div className={`${styles.locationIcon} ${styles[country.gradient]}`}>
                  {country.icon}
                </div>
                <h3 className={styles.locationTitle}>{country.title}</h3>
                <p className={styles.locationBody}>{country.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
