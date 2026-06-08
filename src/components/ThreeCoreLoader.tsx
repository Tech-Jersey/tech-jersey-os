'use client'
/**
 * ThreeCoreLoader.tsx — Client-side lazy loader for ThreeCore.
 *
 * `ssr: false` with next/dynamic is only allowed in Client Components.
 * This thin wrapper lives as a Client Component so the Server Component
 * homepage (page.tsx) can import it without hitting the "ssr:false in
 * Server Component" build error.
 *
 * The Three.js bundle (~600KB) is deferred until the client hydrates,
 * preserving LCP performance.
 */
import dynamic from 'next/dynamic'

const ThreeCore = dynamic(() => import('@/components/ThreeCore'), {
  ssr: false,
  loading: () => <div style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />,
})

export default function ThreeCoreLoader() {
  return <ThreeCore />
}
