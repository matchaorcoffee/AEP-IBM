import { useEffect, useRef, useState } from 'react'

/**
 * useFadeIn
 *
 * Observes a target element and, once it enters the viewport:
 *   1. Adds the global `.fade-in--visible` CSS class directly on the element
 *      (supports the legacy `.fade-in` / `.fade-in--visible` global stylesheet pattern).
 *   2. Sets `visible = true` (supports the module-CSS sectionHidden/sectionVisible pattern).
 *
 * Returns `{ ref, visible }`.  Callers that only need the ref can destructure:
 *   const { ref: sectionRef } = useFadeIn<HTMLElement>()
 *
 * The observer disconnects after the first intersection so the animation fires once.
 *
 * @param threshold  Fraction of the element that must be visible before
 *                   triggering (default 0.12).
 */
export function useFadeIn<T extends HTMLElement = HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion — mark visible immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('fade-in--visible')
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('fade-in--visible')
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
