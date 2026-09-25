import { useEffect, useRef, useState } from 'react'

/**
 * useFadeIn
 *
 * Observes a target element and sets `visible = true` once it enters the
 * viewport.  The observer is immediately disconnected after the first
 * intersection so the element only animates once per page load.
 *
 * @param threshold  Fraction of the element that must be visible before
 *                   triggering (default 0.12 — fires slightly before the
 *                   element is fully in view for a natural feel).
 */
export function useFadeIn<T extends HTMLElement = HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion — mark visible immediately so CSS
    // skip-animation rules (opacity:1; transform:none) take effect.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}
