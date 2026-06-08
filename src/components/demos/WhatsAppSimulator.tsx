'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Message {
  sender: 'bot' | 'user'
  text: string
  cta?: { text: string; href: string }
}

export default function WhatsAppSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hello! Thank you for reaching out to Tech Jersey Studio. I'm your virtual automation specialist. How can I assist you today?",
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleSuggestionClick = (text: string, botReply: string, cta?: { text: string; href: string }) => {
    if (isTyping) return

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text }])
    setIsTyping(true)

    // Simulate bot reply
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          cta,
        },
      ])
    }, 1200)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="wa-simulator-container">
      {/* PHONE CONTAINER */}
      <div className="wa-phone">
        {/* PHONE SPEAKER/CAMERA NOTCH */}
        <div className="phone-notch" />
        
        {/* SCREEN HEADER */}
        <div className="wa-header">
          <div className="wa-header-left">
            <div className="wa-back-arrow">←</div>
            <div className="wa-avatar">
              TJ
              <span className="wa-status-dot" />
            </div>
            <div className="wa-title-container">
              <span className="wa-title">Tech Jersey AI</span>
              <span className="wa-subtitle">Online</span>
            </div>
          </div>
          <div className="wa-header-right">
            <span className="wa-icon-call">📞</span>
            <span className="wa-icon-menu">⋮</span>
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className="wa-body">
          <div className="wa-messages-list">
            {messages.map((msg, i) => (
              <div key={i} className={`wa-msg-wrapper ${msg.sender === 'user' ? 'wa-user-msg' : 'wa-bot-msg'}`}>
                <div className="wa-msg-bubble">
                  <p>{msg.text}</p>
                  {msg.cta && (
                    <Link href={msg.cta.href} className="wa-msg-cta">
                      {msg.cta.text}
                    </Link>
                  )}
                  <span className="wa-msg-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="wa-msg-wrapper wa-bot-msg">
                <div className="wa-msg-bubble typing-bubble">
                  <div className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* INPUT FOOTER & SUGGESTIONS */}
        <div className="wa-footer">
          <div className="wa-suggestions">
            <button
              onClick={() =>
                handleSuggestionClick(
                  "I want to book an AI audit",
                  "Excellent choice! Our 2-Minute AI Audit calculates exact operational savings in INR and recommends systems for your team. You can start the self-audit directly inside the simulator or click the button below.",
                  { text: '🤖 Start 2-Min Audit', href: '/audit' }
                )
              }
              className="wa-suggest-btn"
            >
              📊 Start Free AI Audit
            </button>
            <button
              onClick={() =>
                handleSuggestionClick(
                  "What CRMs do you support?",
                  "We connect workflows seamlessly across HubSpot, Salesforce, Zoho CRM, Tally, Google Sheets, and custom proprietary databases using secure APIs."
                )
              }
              className="wa-suggest-btn"
            >
              🔌 Integrations & CRMs
            </button>
            <button
              onClick={() =>
                handleSuggestionClick(
                  "Can I migrate my number?",
                  "Absolutely! You can migrate your existing business landline, mobile, or toll-free number directly to the official Meta Cloud API, preserving your brand history."
                )
              }
              className="wa-suggest-btn"
            >
              📱 Phone Number Migration
            </button>
          </div>
          <div className="wa-input-row">
            <div className="wa-input-box">
              <span className="wa-emoji-icon">😊</span>
              <input type="text" placeholder="Type a message" disabled />
            </div>
            <div className="wa-mic-btn">
              <span>🎤</span>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .wa-simulator-container {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
          position: relative;
        }

        .wa-phone {
          background: #0d1117;
          border: 12px solid #2d3139;
          border-radius: 40px;
          height: 640px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.8);
          position: relative;
        }

        .phone-notch {
          width: 120px;
          height: 18px;
          background: #2d3139;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          z-index: 100;
        }

        .wa-header {
          background: #1f2c34;
          padding: 24px 16px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }

        .wa-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wa-back-arrow {
          color: #8696a0;
          font-size: 18px;
          cursor: pointer;
        }

        .wa-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--em), #4fffca);
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          position: relative;
          font-family: var(--display);
        }

        .wa-status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #00e676;
          border: 1.5px solid #1f2c34;
          position: absolute;
          bottom: 0;
          right: 0;
        }

        .wa-title-container {
          display: flex;
          flex-direction: column;
        }

        .wa-title {
          font-family: var(--display);
          font-size: 14px;
          font-weight: 600;
          color: #e9edef;
        }

        .wa-subtitle {
          font-family: var(--body);
          font-size: 11px;
          color: #8696a0;
        }

        .wa-header-right {
          display: flex;
          gap: 14px;
          color: #8696a0;
          font-size: 16px;
        }

        .wa-body {
          flex-grow: 1;
          background: #0b141a;
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 16px 16px;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .wa-messages-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .wa-msg-wrapper {
          display: flex;
          width: 100%;
        }

        .wa-user-msg {
          justify-content: flex-end;
        }

        .wa-bot-msg {
          justify-content: flex-start;
        }

        .wa-msg-bubble {
          max-width: 80%;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.5;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-family: var(--body);
        }

        .wa-user-msg .wa-msg-bubble {
          background: #005c4b;
          color: #e9edef;
          border-top-right-radius: 0;
        }

        .wa-bot-msg .wa-msg-bubble {
          background: #202c33;
          color: #e9edef;
          border-top-left-radius: 0;
        }

        .wa-msg-bubble p {
          margin: 0;
        }

        .wa-msg-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--em), #4fffca);
          color: #000;
          font-weight: 700;
          font-size: 12px;
          padding: 8px 12px;
          border-radius: 6px;
          text-decoration: none;
          text-align: center;
          transition: opacity 0.2s ease;
          margin-top: 4px;
        }

        .wa-msg-cta:hover {
          opacity: 0.9;
        }

        .wa-msg-time {
          font-size: 9px;
          color: #8696a0;
          align-self: flex-end;
        }

        .typing-bubble {
          padding: 12px 16px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          background: #8696a0;
          border-radius: 50%;
          animation: waTyping 1.4s infinite ease-in-out both;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes waTyping {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }

        .wa-footer {
          padding: 12px;
          background: #1f2c34;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
        }

        .wa-suggestions {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 140px;
          overflow-y: auto;
        }

        .wa-suggest-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #e9edef;
          padding: 8px 12px;
          border-radius: 8px;
          font-family: var(--body);
          font-size: 11px;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
          outline: none;
        }

        .wa-suggest-btn:hover {
          background: rgba(15, 159, 112, 0.15);
          border-color: var(--em);
        }

        .wa-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wa-input-box {
          flex-grow: 1;
          background: #2a3942;
          border-radius: 24px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wa-emoji-icon {
          color: #8696a0;
          font-size: 16px;
          cursor: pointer;
        }

        .wa-input-box input {
          width: 100%;
          background: none;
          border: none;
          outline: none;
          color: #e9edef;
          font-family: var(--body);
          font-size: 13px;
        }

        .wa-input-box input::placeholder {
          color: #8696a0;
        }

        .wa-mic-btn {
          width: 38px;
          height: 38px;
          background: var(--em);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-size: 15px;
          cursor: pointer;
        }
      `}} />
    </div>
  )
}
