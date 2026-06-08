'use client'

import React, { useEffect, useState, useRef } from 'react'
import Lottie from 'lottie-react'

type RobotState = 'working' | 'resting'

export default function GlobalRobots() {
  const [robotState, setRobotState] = useState<RobotState>('resting')
  const [workingData, setWorkingData] = useState<object | null>(null)
  const [restingData, setRestingData] = useState<object | null>(null)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load Lottie JSONs on the client side only (avoids SSR issues)
  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const [w, r] = await Promise.all([
          fetch('/lottie/working.json').then(res => res.json()),
          fetch('/lottie/resting.json').then(res => res.json()),
        ])
        setWorkingData(w)
        setRestingData(r)
      } catch (e) {
        console.warn('Could not load Lottie animations', e)
      }
    }
    loadAnimations()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // User is actively scrolling → robot works
      setRobotState(prev => (prev !== 'working' ? 'working' : prev))

      // Clear previous timeout to debounce
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

      // If no scroll happens for 400ms, robot rests
      scrollTimeoutRef.current = setTimeout(() => {
        setRobotState('resting')
      }, 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [])

  // Don't render until animations are loaded
  if (!workingData || !restingData) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        width: '128px',
        height: '128px',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <Lottie
        animationData={robotState === 'working' ? workingData : restingData}
        loop
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
