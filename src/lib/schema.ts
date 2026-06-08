/**
 * schema.ts — Schema.org structured data builder functions.
 *
 * All functions return plain objects safe to pass to <JsonLd />.
 * No external schema libraries — pure TypeScript objects.
 *
 * Schemas implemented:
 *   - Organization / LocalBusiness
 *   - WebSite (with SearchAction)
 *   - Person (Founder)
 *   - Service
 *   - Article / BlogPosting
 *   - FAQPage
 *   - BreadcrumbList
 *   - WebPage
 *   - ContactPage
 *   - ItemList
 */

const BASE_URL = 'https://techjersey.studio'
const ORG_NAME = 'Tech Jersey Studio'
const FOUNDER_NAME = 'Dhruv'

// ── Shared Organisation Reference ────────────────────────────────────────────

export function orgRef() {
  return {
    '@type': 'Organization',
    name: ORG_NAME,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/images/logo.png`,
      width: 200,
      height: 60,
    },
  }
}

// ── Organization + LocalBusiness ─────────────────────────────────────────────

export function buildOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${BASE_URL}/#organization`,
    name: ORG_NAME,
    alternateName: 'Tech Jersey',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/images/logo.png`,
      width: 200,
      height: 60,
    },
    image: `${BASE_URL}/images/og-default.jpg`,
    description:
      'Tech Jersey Studio builds AI automation systems, WhatsApp pipelines, CRM engines, and business operating systems for modern enterprises across India, UAE, and Southeast Asia.',
    founder: {
      '@type': 'Person',
      name: FOUNDER_NAME,
      url: `${BASE_URL}/about`,
    },
    foundingDate: '2021',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 5 },
    areaServed: ['India', 'United Arab Emirates', 'Southeast Asia'],
    knowsAbout: [
      'AI Automation',
      'WhatsApp Business API',
      'n8n Workflow Automation',
      'CRM Systems',
      'Document Intelligence',
      'Business Operating Systems',
    ],
    serviceType: 'AI Automation Agency',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-73579-71717',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
      contactOption: 'TollFree',
    },
    sameAs: [
      'https://www.linkedin.com/company/tech-jersey-studio',
      'https://twitter.com/techjersey_',
      'https://instagram.com/techjersey.studio',
    ],
  }
}

// ── WebSite (with Sitelinks Searchbox) ───────────────────────────────────────

export function buildWebSiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: ORG_NAME,
    url: BASE_URL,
    publisher: { '@id': `${BASE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// ── Person (Founder) ─────────────────────────────────────────────────────────

export function buildFounderSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/about#founder`,
    name: FOUNDER_NAME,
    jobTitle: 'Founder & AI Systems Architect',
    url: `${BASE_URL}/about`,
    image: `${BASE_URL}/images/founder.jpg`,
    worksFor: { '@id': `${BASE_URL}/#organization` },
    knowsAbout: [
      'AI Automation',
      'WhatsApp Business API',
      'n8n',
      'CRM Systems',
      'Next.js',
      'Payload CMS',
    ],
    sameAs: [
      'https://www.linkedin.com/in/techjersey',
      'https://twitter.com/techjersey_',
    ],
  }
}

// ── Service ──────────────────────────────────────────────────────────────────

export function buildServiceSchema(service: {
  title: string
  slug: string
  tagline?: string
  description?: string
  category?: string
  updatedAt?: string
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${BASE_URL}/services/${service.slug}#service`,
    name: service.title,
    description: service.tagline || service.description || '',
    url: `${BASE_URL}/services/${service.slug}`,
    provider: { '@id': `${BASE_URL}/#organization` },
    serviceType: service.category || 'AI Automation',
    areaServed: ['India', 'United Arab Emirates', 'Southeast Asia'],
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'INR',
      seller: { '@id': `${BASE_URL}/#organization` },
    },
  }
}

// ── FAQPage ──────────────────────────────────────────────────────────────────

export function buildFAQSchema(faqs: { question: string; answer: string }[]): Record<string, unknown> {
  if (!faqs || faqs.length === 0) return {}
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ── BreadcrumbList ───────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string
  url: string
}

export function buildBreadcrumbSchema(crumbs: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${BASE_URL}${crumb.url}`,
    })),
  }
}

// ── Article (Case Study) ─────────────────────────────────────────────────────

export function buildArticleSchema(caseStudy: {
  client: string
  slug: string
  summary?: string
  updatedAt?: string
  createdAt?: string
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${BASE_URL}/case-studies/${caseStudy.slug}#article`,
    headline: `${caseStudy.client} — Case Study`,
    description: caseStudy.summary || '',
    url: `${BASE_URL}/case-studies/${caseStudy.slug}`,
    author: {
      '@type': 'Person',
      name: FOUNDER_NAME,
      url: `${BASE_URL}/about`,
    },
    publisher: { '@id': `${BASE_URL}/#organization` },
    datePublished: caseStudy.createdAt || new Date().toISOString(),
    dateModified: caseStudy.updatedAt || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/case-studies/${caseStudy.slug}`,
    },
    image: `${BASE_URL}/images/og-default.jpg`,
    articleSection: 'Case Study',
    keywords: ['AI automation', 'case study', 'business transformation'],
  }
}

// ── BlogPosting ──────────────────────────────────────────────────────────────

export function buildBlogPostingSchema(post: {
  title: string
  slug: string
  excerpt?: string
  publishedDate?: string
  updatedAt?: string
  category?: string
  readTime?: string
  featuredImage?: string
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${BASE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt || '',
    url: `${BASE_URL}/blog/${post.slug}`,
    image: post.featuredImage || `${BASE_URL}/images/og-default.jpg`,
    author: {
      '@type': 'Person',
      name: FOUNDER_NAME,
      url: `${BASE_URL}/about`,
      image: `${BASE_URL}/images/founder.jpg`,
    },
    publisher: { '@id': `${BASE_URL}/#organization` },
    datePublished: post.publishedDate || post.updatedAt || new Date().toISOString(),
    dateModified: post.updatedAt || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
    articleSection: post.category || 'AI Automation',
    keywords: ['AI automation', 'business systems', post.category || 'automation'].filter(Boolean),
    timeRequired: post.readTime || 'PT5M',
    inLanguage: 'en-IN',
  }
}

// ── WebPage ──────────────────────────────────────────────────────────────────

export function buildWebPageSchema(page: {
  name: string
  url: string
  description: string
  dateModified?: string
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${page.url.startsWith('http') ? page.url : `${BASE_URL}${page.url}`}#webpage`,
    name: page.name,
    description: page.description,
    url: page.url.startsWith('http') ? page.url : `${BASE_URL}${page.url}`,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    publisher: { '@id': `${BASE_URL}/#organization` },
    dateModified: page.dateModified || new Date().toISOString(),
    inLanguage: 'en-IN',
  }
}

// ── ItemList ─────────────────────────────────────────────────────────────────

export function buildItemListSchema(items: { name: string; url: string }[], listName: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  }
}

// ── ContactPage ──────────────────────────────────────────────────────────────

export function buildContactPageSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${BASE_URL}/contact#page`,
    name: 'Contact Tech Jersey Studio',
    url: `${BASE_URL}/contact`,
    description: 'Contact Tech Jersey Studio for AI automation, WhatsApp pipelines, and business operating systems.',
    mainEntity: {
      '@type': 'Organization',
      name: ORG_NAME,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          availableLanguage: ['English', 'Hindi'],
          telephone: '+91-73579-71717',
          contactOption: 'TollFree',
        },
      ],
    },
  }
}
