import { useState } from 'react'
import styles from './TabPanel.module.scss'
import sustainabilityImg from '../../assets/Sustainability.jpg'
import innovationImg from '../../assets/Innovation.jpg'
import insightsImg from '../../assets/Insights.jpg'
import energyAndUtilitiesImg from '../../assets/EnergyAndUtilities.jpg'

const tabs = [
  {
    id: 'sustainability',
    label: 'Sustainability',
    heading: 'Transformative solutions',
    body: "Turn sustainability ambition into action. Transformative solutions for power, utilities and renewables. Let's create a sustainable future together.",
    image: sustainabilityImg,
    imageAlt: 'Wind turbines in a field at sunset',
    readMoreUrl: 'https://www.ibm.com/industries/energy',
    imageLeft: true,
  },
  {
    id: 'innovation',
    label: 'Innovation',
    heading: 'AI-based process discovery',
    body: 'AI-based process discovery helps speed up grid parts procurement. How the IBM Process Mining solution complements a utility\'s transformation',
    image: innovationImg,
    imageAlt: 'Workers installing solar panels',
    readMoreUrl: 'https://www.ibm.com/case-studies',
    imageLeft: false,
  },
  {
    id: 'insights',
    label: 'Insights',
    heading: 'The importance of sustainable asset management',
    body: 'Sustainable asset management for utilities: new demands for utilities, new approach to distribution.',
    image: insightsImg,
    imageAlt: 'Electrical transmission towers at sunset',
    readMoreUrl: 'https://www.ibm.com/think/insights/sustainability-utilities',
    imageLeft: false,
  },
  {
    id: 'energy-utilities',
    label: 'Energy & Utilities',
    heading: 'Energy and Utilities blog',
    body: "In an era where sustainability and efficiency are paramount, the energy and utilities sector stands at the forefront of transformation. Let's shape a brighter future for generations to come.",
    image: energyAndUtilitiesImg,
    imageAlt: 'Wind turbines on a coastal hillside',
    readMoreUrl: 'https://www.ibm.com/think',
    imageLeft: true,
  },
]

export default function TabPanel() {
  const [active, setActive] = useState(0)
  const tab = tabs[active]

  return (
    <section className={styles.section}>
      <div className={styles.tabBar}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
            onClick={() => setActive(i)}
            aria-selected={i === active}
            role="tab"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={`${styles.panel} ${tab.imageLeft ? styles.imageLeft : styles.imageRight}`}>
        <img
          src={tab.image}
          alt={tab.imageAlt}
          className={styles.image}
        />
        <div className={styles.content}>
          <h2 className={styles.heading}>{tab.heading}</h2>
          <p className={styles.body}>{tab.body}</p>
          <a
            href={tab.readMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            Read more
          </a>
        </div>
      </div>
    </section>
  )
}
