import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './TabPanel.module.scss'
import { useFadeIn } from '../../../../hooks/useFadeIn'
import sustainabilityImg from '../../assets/solarpanel.avif'
import innovationImg from '../../assets/solarpanel.avif'
import insightsImg from '../../assets/SustainableAssetManagement.avif'
import energyAndUtilitiesImg from '../../assets/EnergyAndUtilsBlog.avif'

interface SlideData {
  id: string
  eyebrow: string
  title: string
  description: string
  ctaText: string
  ctaUrl: string
  image: string
  imageAlt: string
}

const slides: SlideData[] = [
  {
    id: 'sustainability',
    eyebrow: 'SUSTAINABILITY',
    title: 'Transformative solutions',
    description:
      "Turn sustainability ambition into action. Transformative solutions for power, utilities and renewables. Let's create a sustainable future together.",
    ctaText: 'Explore sustainability',
    ctaUrl: 'https://www.ibm.com/industries/energy',
    image: sustainabilityImg,
    imageAlt: 'Wind turbines in a field at sunset',
  },
  {
    id: 'innovation',
    eyebrow: 'INNOVATION',
    title: 'AI-based process discovery',
    description:
      "AI-based process discovery helps speed up grid parts procurement. How the IBM Process Mining solution complements a utility's transformation.",
    ctaText: 'Read case study',
    ctaUrl: 'https://www.ibm.com/case-studies',
    image: innovationImg,
    imageAlt: 'Workers installing solar panels',
  },
  {
    id: 'insights',
    eyebrow: 'INSIGHTS',
    title: 'Sustainable asset management',
    description:
      'The importance of sustainable asset management for utilities: meeting new demands and establishing innovative approaches to power distribution.',
    ctaText: 'Read insights',
    ctaUrl: 'https://www.ibm.com/think/insights/sustainability-utilities',
    image: insightsImg,
    imageAlt: 'Electrical transmission towers at sunset',
  },
  {
    id: 'energy-utilities',
    eyebrow: 'ENERGY & UTILITIES',
    title: 'Energy and Utilities blog',
    description:
      "In an era where sustainability and efficiency are paramount, the energy and utilities sector stands at the forefront of transformation. Let's shape a brighter future for generations to come.",
    ctaText: 'Read blog',
    ctaUrl: 'https://www.ibm.com/think',
    image: energyAndUtilitiesImg,
    imageAlt: 'Wind turbines on a coastal hillside',
  },
]

const AUTOPLAY_INTERVAL = 5000 // Exactly 5 seconds

export default function TabPanel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<number | null>(null)
  const totalSlides = slides.length

  // Preload all 4 images to avoid blank frames
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image()
      img.src = slide.image
    })
  }, [])

  const startTimer = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, AUTOPLAY_INTERVAL)
  }, [totalSlides])

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex((index + totalSlides) % totalSlides)
      startTimer()
    },
    [totalSlides, startTimer]
  )

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1)
  }, [currentIndex, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1)
  }, [currentIndex, goToSlide])

  // Start autoplay timer on mount and cleanup
  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [startTimer])

  // Pause when browser tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timerRef.current) window.clearInterval(timerRef.current)
      } else {
        startTimer()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [startTimer])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide()
    } else if (e.key === 'ArrowRight') {
      nextSlide()
    }
  }

  const sectionRef = useFadeIn<HTMLElement>()

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} fade-in`}
      aria-roledescription="carousel"
      aria-label="AEP & IBM in Action"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className={styles.carouselContainer}>
        {/* Slides Layer */}
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex
          return (
            <div
              key={slide.id}
              className={`${styles.slide} ${isActive ? styles.slideActive : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${totalSlides}: ${slide.title}`}
              aria-hidden={!isActive}
            >
              {/* 100% Full-Bleed Background Image */}
              <div className={styles.imageWrapper}>
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  className={styles.slideImage}
                />
              </div>

              {/* Subtle top-to-bottom & overall overlay for contrast */}
              <div className={styles.imageOverlay} aria-hidden="true" />

              {/* Centered Overlay Content */}
              <div className={styles.contentOverlay}>
                <div className={styles.eyebrow}>{slide.eyebrow}</div>
                <h3 className={styles.headline}>{slide.title}</h3>
                <p className={styles.description}>{slide.description}</p>
                <div className={styles.ctaWrapper}>
                  <a
                    href={slide.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ctaButton}
                    tabIndex={isActive ? 0 : -1}
                  >
                    {slide.ctaText}
                  </a>
                </div>
              </div>
            </div>
          )
        })}

        {/* Previous Arrow Button (Left Center) */}
        <button
          type="button"
          onClick={prevSlide}
          className={`${styles.arrowButton} ${styles.arrowLeft}`}
          aria-label="Previous slide"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next Arrow Button (Right Center) */}
        <button
          type="button"
          onClick={nextSlide}
          className={`${styles.arrowButton} ${styles.arrowRight}`}
          aria-label="Next slide"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Minimal Dot Indicators (Bottom Center) - 4 dots */}
        <div
          className={styles.dotsContainer}
          role="tablist"
          aria-label="Slides navigation"
        >
          {slides.map((s, idx) => {
            const isDotActive = idx === currentIndex
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isDotActive}
                aria-label={`Go to slide ${idx + 1}: ${s.eyebrow}`}
                className={`${styles.dot} ${isDotActive ? styles.dotActive : ''}`}
                onClick={() => goToSlide(idx)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
