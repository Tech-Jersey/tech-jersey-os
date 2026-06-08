/**
 * JsonLd.tsx — Lightweight JSON-LD structured data server component.
 *
 * Usage:
 *   import { JsonLd } from '@/components/seo/JsonLd'
 *   <JsonLd data={buildOrganizationSchema()} />
 *
 * Renders a <script type="application/ld+json"> tag with the given object.
 * No client-side JS required — purely server-rendered.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
