import { useEffect, useRef } from 'react'

/**
 * Adds 'visible' class to elements when they enter the viewport.
 * Use with CSS classes: fade-in-up, fade-in-left, fade-in-right, fade-in, scale-in, stagger-children
 */
export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    // Observe the container and all animated children
    const targets = el.querySelectorAll(
      '.fade-in-up, .fade-in-left, .fade-in-right, .reveal-fade, .scale-in, .stagger-children'
    )
    targets.forEach((t) => observer.observe(t))

    return () => observer.disconnect()
  }, [])

  return ref
}
