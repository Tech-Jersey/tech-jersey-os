'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trackNavCTAClicked } from '@/lib/analytics'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/whatsapp-automation' },
  { label: 'Work', href: '/case-studies' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close mobile menu on route change / resize
  useEffect(() => {
    const close = () => setMobileOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="nav-logo">
        <Image
          src="/images/mera-logo.png"
          alt="Tech Jersey"
          width={120}
          height={40}
          style={{ height: 36, width: 'auto', objectFit: 'contain' }}
          priority
        />
      </Link>

      {/* Desktop nav links */}
      <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(link => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        {/* Highlighted audit link in mobile menu */}
        <Link
          href="/audit"
          className="nav-audit-link"
          onClick={() => {
            trackNavCTAClicked('header')
            setMobileOpen(false)
          }}
        >
          Free Audit ↗
        </Link>
      </div>

      {/* Desktop CTA group */}
      <div className="nav-cta-group">
        <Link href="/resources" className="nav-resources-link">
          Resources
        </Link>
        <Link
          href="/audit"
          id="header-audit-cta"
          className="nav-cta nav-cta-primary"
          onClick={() => trackNavCTAClicked('header')}
        >
          Free Audit ↗
        </Link>
        <Link href="/contact" className="nav-cta">
          Build Your System
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="mobile-toggle"
        onClick={() => setMobileOpen(p => !p)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        <span className={`hamburger-line ${mobileOpen ? 'open-1' : ''}`} />
        <span className={`hamburger-line ${mobileOpen ? 'open-2' : ''}`} />
        <span className={`hamburger-line ${mobileOpen ? 'open-3' : ''}`} />
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        .nav-cta-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-resources-link {
          font-family: var(--body);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-s);
          transition: color 0.3s;
        }
        .nav-resources-link:hover { color: var(--text); }

        .nav-cta-primary {
          background: linear-gradient(135deg, var(--em), #4fffca) !important;
          color: #000 !important;
          border: none !important;
        }

        .nav-audit-link {
          display: none;
        }

        .hamburger-line {
          display: block;
          width: 24px;
          height: 1.5px;
          background: var(--text);
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        @media (max-width: 900px) {
          .nav-links.open .nav-audit-link {
            display: block;
            color: var(--em);
            font-weight: 600;
          }

          .nav-cta-group {
            display: none;
          }

          .mobile-toggle {
            display: flex !important;
            flex-direction: column;
            gap: 5px;
            background: none;
            border: none;
            padding: 8px;
            cursor: pointer;
          }

          .hamburger-line.open-1 {
            transform: translateY(6.5px) rotate(45deg);
          }
          .hamburger-line.open-2 {
            opacity: 0;
            transform: scaleX(0);
          }
          .hamburger-line.open-3 {
            transform: translateY(-6.5px) rotate(-45deg);
          }
        }
      ` }} />
    </nav>
  )
}
