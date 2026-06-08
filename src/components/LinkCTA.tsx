'use client'
import Link from 'next/link'
import { trackNavCTAClicked } from '@/lib/analytics'

interface LinkCTAProps {
  href: string
  id?: string
  className?: string
  style?: React.CSSProperties
  location: 'header' | 'hero' | 'footer' | 'mid_page' | 'sticky_float' | 'about_hero' | 'about_bottom' | 'case_study_mid' | string
  children: React.ReactNode
}

export default function LinkCTA({ href, id, className, style, location, children }: LinkCTAProps) {
  return (
    <Link
      href={href}
      id={id}
      className={className}
      style={style}
      onClick={() => trackNavCTAClicked(location)}
    >
      {children}
    </Link>
  )
}
