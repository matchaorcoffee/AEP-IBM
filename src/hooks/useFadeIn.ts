import { useEffect, useRef } from 'react'

/**
 * Tesla-style scroll fade-in.
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, adds the `.visible` class
 * which triggers the CSS transition defined in _animations.scss.
 *
 * @param threshold  0–1, fraction of element visible before triggering (default 0.15)
 */
export function useFadeIn<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('fade-in--visible')
          observer.disconnect() // fire once
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
