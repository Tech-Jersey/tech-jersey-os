'use client'
import { useEffect, useRef, useState } from 'react'

interface MetricCounterProps {
  value: string
  label: string
  context?: string
  delay?: number
}

/**
 * MetricCounter — animates a numeric value from 0 → target on mount.
 * Handles both pure numbers ("72") and formatted strings ("₹1.8L+", "4.8hrs", "100%").
 * Non-numeric values (e.g. "Instant") display immediately without animation.
 */
export default function MetricCounter({ value, label, context, delay = 0 }: MetricCounterProps) {
  const [displayed, setDisplayed] = useState('0')
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Extract numeric part from value string
    const numericMatch = value.match(/[\d.]+/)
    if (!numericMatch) {
      // Non-numeric: show immediately
      setDisplayed(value)
      return
    }

    const target = parseFloat(numericMatch[0])
    const isDecimal = numericMatch[0].includes('.')
    const prefix = value.slice(0, value.indexOf(numericMatch[0]))
    const suffix = value.slice(value.indexOf(numericMatch[0]) + numericMatch[0].length)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          observer.disconnect()

          const DURATION = 1400
          const STEPS = 60
          let step = 0

          setTimeout(() => {
            const interval = setInterval(() => {
              step++
              const progress = step / STEPS
              // Ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = target * eased
              setDisplayed(
                prefix +
                (isDecimal ? current.toFixed(1) : Math.round(current).toString()) +
                suffix
              )

              if (step >= STEPS) {
                clearInterval(interval)
                setDisplayed(value) // Ensure exact value at end
              }
            }, DURATION / STEPS)
          }, delay)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, delay, hasAnimated])

  return (
    <div ref={ref} style={{
      background: 'rgba(10, 15, 20, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: 12,
      padding: '24px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{
        fontFamily: 'var(--display)',
        fontSize: 'clamp(28px, 4vw, 40px)',
        fontWeight: 700,
        color: 'var(--em)',
        lineHeight: 1.1,
        letterSpacing: -1,
        transition: 'all 0.05s',
      }}>
        {displayed}
      </div>
      <div style={{
        fontSize: 11,
        color: 'var(--text-m)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: 500,
      }}>
        {label}
      </div>
      {context && (
        <div style={{
          fontSize: 11,
          color: 'var(--text-m)',
          marginTop: 4,
          fontStyle: 'italic',
          fontWeight: 300,
        }}>
          {context}
        </div>
      )}
    </div>
  )
}
