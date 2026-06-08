'use client'
import { useState, useRef, useEffect } from 'react'

interface DownloadGateModalProps {
  resourceSlug: string
  resourceTitle: string
  onClose: () => void
}

export default function DownloadGateModal({ resourceSlug, resourceTitle, onClose }: DownloadGateModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on overlay click
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/resources/${resourceSlug}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setDownloadUrl(data.downloadUrl)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(5, 5, 5, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9000,
        padding: '24px',
      }}
    >
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-light)',
        borderRadius: 20,
        padding: 40,
        width: '100%',
        maxWidth: 480,
        position: 'relative',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none',
            color: 'var(--text-m)', fontSize: 20, cursor: 'pointer',
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 6, transition: 'color 0.2s',
          }}
        >
          ✕
        </button>

        {!downloadUrl ? (
          <>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--em)', marginBottom: 10 }}>
                Free Download
              </div>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 8, lineHeight: 1.2 }}>
                {resourceTitle}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-s)', lineHeight: 1.6, fontWeight: 300 }}>
                Enter your details to get instant access. We'll also send a copy to your inbox.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Honeypot */}
              <input
                type="text"
                name="website_url"
                tabIndex={-1}
                aria-hidden="true"
                style={{ position: 'absolute', left: -9999, opacity: 0, height: 0, width: 0 }}
                autoComplete="off"
              />

              <div style={{ marginBottom: 20 }}>
                <label className="lux-label" htmlFor="dl-name">Your Name</label>
                <input
                  id="dl-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  required
                  minLength={2}
                  className="lux-input"
                  style={{ fontSize: 16 }}
                  autoComplete="name"
                />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label className="lux-label" htmlFor="dl-email">Work Email</label>
                <input
                  id="dl-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="lux-input"
                  style={{ fontSize: 16 }}
                  autoComplete="email"
                />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(231, 76, 60, 0.08)',
                  border: '1px solid rgba(231, 76, 60, 0.2)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginBottom: 20,
                  fontSize: 13,
                  color: '#e74c3c',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  background: loading
                    ? 'rgba(15,159,112,0.5)'
                    : 'linear-gradient(135deg,var(--em),#4fffca)',
                  color: '#000',
                  border: 'none',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Preparing Download…' : 'Get Free Download →'}
              </button>

              <p style={{ fontSize: 10, color: 'var(--text-m)', textAlign: 'center', marginTop: 12, lineHeight: 1.5, fontWeight: 300 }}>
                No spam. We may send you relevant automation insights. Unsubscribe anytime.
              </p>
            </form>
          </>
        ) : (
          /* Success state */
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
              Your download is ready
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-s)', lineHeight: 1.6, marginBottom: 28, fontWeight: 300 }}>
              A copy has also been sent to your inbox. If you don't see it, check your spam folder.
            </p>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg,var(--em),#4fffca)',
                color: '#000',
                border: 'none',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
              }}
            >
              ↓ Download Now
            </a>
            <br />
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-m)', fontSize: 12, cursor: 'pointer', marginTop: 8 }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
