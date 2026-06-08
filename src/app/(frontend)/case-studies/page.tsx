import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CaseStudiesGrid from '@/components/CaseStudiesGrid'
import { getPayloadClient, getCaseStudies } from '@/lib/payload-utils'
import StickyAuditCTA from '@/components/StickyAuditCTA'

export const metadata = {
  title: 'Client Case Studies & Transformations — Tech-Jersey Studio',
  description: 'Explore the performance outcomes, lead-retrieval latency drops, and automated database sync structures engineered across our client portfolio.',
}

export default async function CaseStudiesIndexPage() {
  const caseStudies = await getCaseStudies()
  const payload = await getPayloadClient()
  
  // Fetch services for category filtering metadata
  const { docs: services } = await payload.find({
    collection: 'services',
    limit: 100,
  })

  // Format case studies fields for cleaner types
  const formattedCaseStudies = caseStudies.map((cs: any) => ({
    id: cs.id.toString(),
    client: cs.client,
    slug: cs.slug,
    industry: cs.industry,
    summary: cs.summary || '',
    metrics: cs.metrics || [],
    relatedServices: cs.relatedServices || []
  }))

  const formattedServices = services.map((s: any) => ({
    id: s.id.toString(),
    title: s.title,
    slug: s.slug
  }))

  return (
    <>
      <Header />

      {/* HEADER SECTION */}
      <section style={{ paddingTop: 220, paddingBottom: 60, position: 'relative' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--em)', letterSpacing: 3, textTransform: 'uppercase', fontSize: 11, fontWeight: 700 }}>
            Proven Architectures
          </span>
          <h1 style={{
            fontFamily: 'var(--display)',
            fontWeight: 300,
            fontSize: 'clamp(44px, 7vw, 80px)',
            lineHeight: 1.1,
            letterSpacing: -1.5,
            marginTop: 16,
            marginBottom: 20
          }}>
            Client{' '}
            <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)', fontWeight: 400 }}>
              Case Studies
            </span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-s)', fontWeight: 300, maxWidth: 680, lineHeight: 1.6 }}>
            Explore verified operational and financial outcomes achieved across our portfolio through custom AI automation, CRM pipelines, and OCR document processing.
          </p>
        </div>
      </section>

      {/* CASE STUDIES FILTER GRID SECTION */}
      <section style={{ paddingBottom: 160 }}>
        <div className="container">
          <CaseStudiesGrid
            initialCaseStudies={formattedCaseStudies}
            services={formattedServices}
          />
        </div>
      </section>

      <Footer />
      <StickyAuditCTA />
    </>
  )
}
