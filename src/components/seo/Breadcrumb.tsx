/**
 * Breadcrumb.tsx — Reusable semantic breadcrumb component.
 *
 * Renders an accessible <nav aria-label="Breadcrumb"> with <ol> structure.
 * Matches Google's recommended breadcrumb markup for rich results.
 *
 * Usage:
 *   <Breadcrumb crumbs={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Services', href: '/services' },
 *     { label: 'WhatsApp Automation', href: null }, // current page = no href
 *   ]} />
 */
import Link from 'next/link'

interface CrumbItem {
  label: string
  href: string | null
}

interface BreadcrumbProps {
  crumbs: CrumbItem[]
  className?: string
}

export default function Breadcrumb({ crumbs, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px 8px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontSize: 13,
          color: 'var(--text-m)',
        }}
      >
        {crumbs.map((crumb, index) => (
          <li
            key={index}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {/* Separator — not rendered for first item */}
            {index > 0 && (
              <span aria-hidden="true" style={{ opacity: 0.3, fontSize: 11 }}>
                /
              </span>
            )}

            {/* Current page = no link */}
            {crumb.href ? (
              <Link
                href={crumb.href}
                itemProp="item"
                style={{
                  color: 'var(--text-m)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-s)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-m)' }}
              >
                <span itemProp="name">{crumb.label}</span>
              </Link>
            ) : (
              <span
                itemProp="name"
                aria-current="page"
                style={{ color: 'var(--text-s)', fontWeight: 500 }}
              >
                {crumb.label}
              </span>
            )}

            {/* Schema.org position */}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  )
}
