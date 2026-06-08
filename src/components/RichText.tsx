'use client'
import React from 'react'

export interface LexicalTextNode {
  type: 'text'
  text: string
  format: number
  style?: string
  mode?: string
  detail?: number
}

export interface LexicalElementNode {
  type: string
  tag?: string
  listType?: 'bullet' | 'number'
  children?: (LexicalTextNode | LexicalElementNode)[]
  format?: string | number
  indent?: number
  value?: number
  url?: string
  newTab?: boolean
}

// Bitmask constants for text formatting
const IS_BOLD = 1
const IS_ITALIC = 1 << 1
const IS_UNDERLINE = 1 << 2
const IS_STRIKETHROUGH = 1 << 3
const IS_CODE = 1 << 4
const IS_SUBSCRIPT = 1 << 5
const IS_SUPERSCRIPT = 1 << 6

function serializeText(node: LexicalTextNode, index: number): React.ReactNode {
  let text: React.ReactNode = node.text

  if (node.format & IS_BOLD) {
    text = <strong key={`bold-${index}`}>{text}</strong>
  }
  if (node.format & IS_ITALIC) {
    text = <em key={`italic-${index}`}>{text}</em>
  }
  if (node.format & IS_UNDERLINE) {
    text = <u key={`underline-${index}`}>{text}</u>
  }
  if (node.format & IS_STRIKETHROUGH) {
    text = <span key={`strike-${index}`} style={{ textDecoration: 'line-through' }}>{text}</span>
  }
  if (node.format & IS_CODE) {
    text = <code key={`code-${index}`} style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.9em', color: 'var(--em)' }}>{text}</code>
  }
  if (node.format & IS_SUBSCRIPT) {
    text = <sub key={`sub-${index}`}>{text}</sub>
  }
  if (node.format & IS_SUPERSCRIPT) {
    text = <sup key={`sup-${index}`}>{text}</sup>
  }

  return <React.Fragment key={index}>{text}</React.Fragment>
}

function serializeElement(node: LexicalElementNode, index: number): React.ReactNode {
  const children = node.children ? node.children.map((child, i) => serializeNode(child, i)) : null

  switch (node.type) {
    case 'paragraph':
      return <p key={index} style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.7', color: 'var(--text-s)', fontWeight: 300 }}>{children}</p>
    case 'heading':
      const Tag = (node.tag as keyof React.JSX.IntrinsicElements | undefined) || 'h2' as keyof React.JSX.IntrinsicElements
      let fontSize = '24px'
      let marginTop = '32px'
      if (Tag === 'h1') { fontSize = 'clamp(32px, 5vw, 44px)'; marginTop = '40px' }
      if (Tag === 'h2') { fontSize = 'clamp(24px, 4vw, 32px)'; marginTop = '36px' }
      if (Tag === 'h3') { fontSize = '22px'; marginTop = '28px' }
      return (
        <Tag
          key={index}
          style={{
            fontFamily: 'var(--display)',
            fontWeight: 400,
            color: 'var(--text)',
            lineHeight: 1.25,
            marginBottom: '16px',
            marginTop: marginTop,
            letterSpacing: '-0.5px'
          }}
        >
          {children}
        </Tag>
      )
    case 'list':
      if (node.listType === 'bullet') {
        return <ul key={index} style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', color: 'var(--text-s)', fontSize: '16px', fontWeight: 300, display: 'flex', flexDirection: 'column', gap: '8px' }}>{children}</ul>
      } else {
        return <ol key={index} style={{ listStyleType: 'decimal', paddingLeft: '24px', marginBottom: '24px', color: 'var(--text-s)', fontSize: '16px', fontWeight: 300, display: 'flex', flexDirection: 'column', gap: '8px' }}>{children}</ol>
      }
    case 'listitem':
      return <li key={index} style={{ lineHeight: '1.6' }}>{children}</li>
    case 'quote':
      return (
        <blockquote
          key={index}
          style={{
            borderLeft: '3px solid var(--em)',
            background: 'rgba(15,159,112,0.02)',
            padding: '24px 32px',
            margin: '32px 0',
            borderRadius: '0 8px 8px 0',
            fontStyle: 'italic',
            fontSize: '18px',
            color: 'var(--text)',
            fontFamily: 'var(--serif)',
            lineHeight: 1.6
          }}
        >
          {children}
        </blockquote>
      )
    case 'link':
      return (
        <a
          key={index}
          href={node.url}
          target={node.newTab ? '_blank' : undefined}
          rel={node.newTab ? 'noopener noreferrer' : undefined}
          style={{ color: 'var(--em)', textDecoration: 'underline' }}
        >
          {children}
        </a>
      )
    default:
      return <div key={index}>{children}</div>
  }
}

function serializeNode(node: any, index: number): React.ReactNode {
  if (!node) return null

  if (node.type === 'text') {
    return serializeText(node as LexicalTextNode, index)
  }

  return serializeElement(node as LexicalElementNode, index)
}

export default function RichText({ content, style }: { content: any; style?: React.CSSProperties }) {
  if (!content || !content.root || !content.root.children) return null
  return (
    <div className="lexical-rich-text" style={style}>
      {content.root.children.map((child: any, i: number) => serializeNode(child, i))}
    </div>
  )
}
