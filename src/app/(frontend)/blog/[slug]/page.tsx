import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StickyAuditCTA from '@/components/StickyAuditCTA'
import { getBlogPostBySlug, getBlogPosts, getPayloadClient } from '@/lib/payload-utils'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBlogPostingSchema, buildBreadcrumbSchema } from '@/lib/schema'

// ── Static Params: pre-render all published blog posts at build time ─────────
export const revalidate = 60

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts()
    return (posts || []).map((p: any) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

// ── Dynamic Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }

  const title = post.title
  const description = post.excerpt || `${post.title} — read on the Tech Jersey Studio blog.`

  return {
    title,
    description,
    authors: [{ name: post.author || 'Dhruv', url: 'https://techjersey.studio/about' }],
    keywords: [post.category, 'AI automation', 'Tech Jersey Studio', 'business systems'].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://techjersey.studio/blog/${slug}`,
      publishedTime: post.publishedDate || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: ['https://techjersey.studio/about'],
      section: post.category,
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `https://techjersey.studio/blog/${slug}` },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = await getBlogPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  const thumbnailUrl = post.thumbnail && typeof post.thumbnail === 'object'
    ? (post.thumbnail as any).url
    : null

  return (
    <>
      <Header />
      <article style={{ paddingTop: '160px', paddingBottom: '120px', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px' }}>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 32 }}>
            <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'var(--text-m)' }}>
              <li><Link href="/" style={{ color: 'var(--text-m)' }}>Home</Link></li>
              <li style={{ opacity: 0.4 }}>/</li>
              <li><Link href="/blog" style={{ color: 'var(--text-m)' }}>Blog</Link></li>
              <li style={{ opacity: 0.4 }}>/</li>
              <li style={{ color: 'var(--text-s)' }}>{post.title}</li>
            </ol>
          </nav>

          <div style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--em)' }}>
              <span>{post.category}</span>
              {post.readTime && <span style={{ color: 'var(--text-m)' }}>• {post.readTime}</span>}
            </div>

            <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '24px', lineHeight: 1.1 }}>
              {post.title}
            </h1>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '24px 0', color: 'var(--text-s)' }}>
              <Link href="/about" style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--em-dim)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--em)' }}>D</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{post.author || 'Dhruv'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: 1 }}>Founder, Tech Jersey Studio</div>
                </div>
              </Link>
              {post.publishedDate && (
                <div style={{ marginLeft: 'auto' }}>
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-m)', marginBottom: '4px' }}>Published</div>
                  <div style={{ fontSize: 13 }}>{new Date(post.publishedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              )}
            </div>
          </div>

          {thumbnailUrl && (
            <div style={{ marginBottom: '64px', borderRadius: '16px', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl}
                alt={(post.thumbnail as any).alt || post.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          )}

          <div className="rich-text" style={{ fontSize: '18px', lineHeight: 1.8, color: 'var(--text-primary)' }}>
            {post.excerpt && (
              <p style={{ fontSize: '22px', color: 'var(--text-s)', marginBottom: '40px', fontStyle: 'italic', borderLeft: '3px solid var(--em)', paddingLeft: 24 }}>
                {post.excerpt}
              </p>
            )}

            <div style={{ padding: '40px', background: 'var(--bg-surface)', border: '1px dashed var(--border)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-m)' }}>
              [ Rich Text Content Area ]<br />
              <span style={{ fontSize: '14px' }}>The Lexical content block will render here.</span>
            </div>
          </div>

          {/* Related service CTA */}
          <div style={{ marginTop: 80, padding: '40px', background: 'rgba(15,159,112,0.04)', border: '1px solid rgba(15,159,112,0.12)', borderRadius: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--em)', marginBottom: 12 }}>Ready to Apply This?</div>
            <p style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 300, letterSpacing: -0.5, marginBottom: 20, lineHeight: 1.3 }}>
              See how Tech Jersey builds these systems for real clients.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/audit" className="btn-primary" style={{ background: 'linear-gradient(135deg,var(--em),#4fffca)', color: '#000', border: 'none', fontWeight: 700, fontSize: 13 }}>
                Get Your Free Audit →
              </Link>
              <Link href="/case-studies" className="btn-secondary" style={{ fontSize: 13 }}>
                View Case Studies
              </Link>
            </div>
          </div>

        </div>
      </article>

      <Footer />
      <StickyAuditCTA />

      {/* ── STRUCTURED DATA ─── */}
      <JsonLd data={buildBlogPostingSchema({
        title: post.title,
        slug: resolvedParams.slug,
        excerpt: post.excerpt,
        publishedDate: post.publishedDate,
        updatedAt: post.updatedAt,
        category: post.category,
        readTime: post.readTime,
        featuredImage: thumbnailUrl || undefined,
      })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: post.title, url: `/blog/${resolvedParams.slug}` },
      ])} />
    </>
  )
}
