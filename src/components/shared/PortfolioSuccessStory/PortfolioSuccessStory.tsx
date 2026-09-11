import { useEffect, useRef, useState } from 'react'
import styles from './PortfolioSuccessStory.module.scss'
import type { PortfolioShowcaseContent } from '../../../data/portfolio-showcase'

interface PortfolioSuccessStoryProps {
  successStory: PortfolioShowcaseContent
}

const STAGES = [
  { key: 'challenge' as const, number: '01', label: 'Challenge' },
  { key: 'solution'  as const, number: '02', label: 'Solution'  },
  { key: 'impact'    as const, number: '03', label: 'Impact'    },
]

export default function PortfolioSuccessStory({ successStory }: PortfolioSuccessStoryProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="success-story"
      className={`${styles.section} ${visible ? styles.sectionVisible : ''}`}
      aria-labelledby="success-story-heading"
    >
      {/* ── Heading only — no summary paragraph ── */}
      <div className={styles.header}>
        <h2 id="success-story-heading" className={styles.heading}>From Challenge to Impact</h2>
      </div>

      {/* ── Three stages ── */}
      <div className={styles.stages}>
        {STAGES.map((stage, idx) => {
          const content = successStory[stage.key]
          const isImpact = stage.key === 'impact'

          return (
            <div key={stage.key} className={styles.stageWrapper}>
              <div
                className={`${styles.stageCard} ${isImpact ? styles.stageCardImpact : ''} ${visible ? styles.stageCardVisible : ''}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <span className={styles.stageNumber} aria-hidden="true">{stage.number}</span>
                <h3 className={styles.stageLabel}>{stage.label}</h3>
                {content && (
                  <p className={styles.stageContent}>{content}</p>
                )}
              </div>

              {/* Connector arrow between stages */}
              {idx < STAGES.length - 1 && (
                <div className={styles.connector} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
