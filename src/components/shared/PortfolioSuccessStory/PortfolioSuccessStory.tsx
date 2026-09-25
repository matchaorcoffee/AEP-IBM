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
      <div className={styles.inner}>
        {/* ── Section header (editorial stacked) ── */}
        <div className={styles.header}>
          <div className={styles.eyebrowWrapper}>
            <span className={styles.eyebrow}>Portfolio Story</span>
          </div>
          <h2 id="success-story-heading" className={styles.heading}>From Challenge to Impact</h2>
          <p className={styles.subheading}>
            How structured engagement and targeted expertise transform complex operational challenges into measurable enterprise value.
          </p>
        </div>

        {/* ── Three stage cards ── */}
        <div className={styles.stages}>
          {STAGES.map((stage, idx) => {
            const content = successStory[stage.key]
            const isImpact = stage.key === 'impact'

            return (
              <div key={stage.key} className={styles.stageWrapper}>
                <div
                  className={`${styles.stageCard} ${isImpact ? styles.stageCardImpact : ''} ${visible ? styles.stageCardVisible : ''}`}
                  style={{ transitionDelay: `${idx * 120}ms` }}
                >
                  <div className={styles.cardGlow} aria-hidden="true" />
                  <div className={styles.stageNumberRow}>
                    <span className={styles.stageNumber} aria-hidden="true">{stage.number}</span>
                    <div className={styles.stageLabelGroup}>
                      <span className={styles.stageMeta}>Stage {stage.number}</span>
                      <h3 className={styles.stageLabel}>{stage.label}</h3>
                    </div>
                  </div>
                  <div className={styles.stageDivider} aria-hidden="true" />
                  {content && (
                    <p className={styles.stageContent}>{content}</p>
                  )}
                </div>

                {/* Connector arrow between stages */}
                {idx < STAGES.length - 1 && (
                  <div className={styles.connector} aria-hidden="true">
                    <span className={styles.connectorCircle}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
