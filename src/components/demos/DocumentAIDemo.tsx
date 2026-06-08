'use client'
import { useState, useEffect } from 'react'

interface FieldInfo {
  label: string
  value: string
  confidence: number
  top: string // CSS top percentage
  left: string // CSS left percentage
  width: string // CSS width percentage
  height: string // CSS height percentage
}

interface DocData {
  title: string
  type: 'invoice' | 'po' | 'agreement'
  fileName: string
  rawText: string
  fields: FieldInfo[]
  jsonData: any
}

const SAMPLE_DOCUMENTS: Record<string, DocData> = {
  invoice: {
    title: 'Indian GST Invoice',
    type: 'invoice',
    fileName: 'GST-INV-2026-0412.pdf',
    rawText: `BHARAT TECH SOLUTIONS PVT LTD
GSTIN: 27AAACB1234F1Z5
Address: Suite 402, BKC, Mumbai, MH - 400051
---------------------------------------------
TAX INVOICE
Invoice No: BTS/26-27/0412   Date: 05-Jun-2026
Billed To: Tech-Jersey Ltd
Client GSTIN: 07AABCT9876C2Z1
---------------------------------------------
Items:
1. Cloud Infra Mgmt   [HSN: 998313]  ₹1,20,000.00
2. API Integration    [HSN: 998311]   ₹35,000.00
---------------------------------------------
Subtotal:                           ₹1,55,000.00
CGST @ 9%:                           ₹13,950.00
SGST @ 9%:                           ₹13,950.00
IGST @ 0%:                                ₹0.00
Total GST:                           ₹27,900.00
---------------------------------------------
Total Amount:                       ₹1,82,900.00
---------------------------------------------`,
    fields: [
      { label: 'Vendor Name', value: 'Bharat Tech Solutions Pvt Ltd', confidence: 99.8, top: '2%', left: '4%', width: '60%', height: '5%' },
      { label: 'Vendor GSTIN', value: '27AAACB1234F1Z5', confidence: 99.9, top: '7%', left: '16%', width: '40%', height: '5%' },
      { label: 'Invoice No', value: 'BTS/26-27/0412', confidence: 99.4, top: '18%', left: '26%', width: '30%', height: '5%' },
      { label: 'Invoice Date', value: '2026-06-05', confidence: 99.1, top: '18%', left: '72%', width: '22%', height: '5%' },
      { label: 'Client GSTIN', value: '07AABCT9876C2Z1', confidence: 99.9, top: '28%', left: '26%', width: '40%', height: '5%' },
      { label: 'Cloud Services HSN', value: '998313', confidence: 98.7, top: '39%', left: '50%', width: '15%', height: '4%' },
      { label: 'Cloud Services Cost', value: '₹1,20,000.00', confidence: 99.6, top: '39%', left: '72%', width: '24%', height: '4%' },
      { label: 'API Consult Cost', value: '₹35,000.00', confidence: 99.6, top: '44%', left: '72%', width: '24%', height: '4%' },
      { label: 'Subtotal Amount', value: '₹1,55,000.00', confidence: 99.7, top: '53%', left: '70%', width: '26%', height: '5%' },
      { label: 'CGST Amount (9%)', value: '₹13,950.00', confidence: 99.3, top: '59%', left: '70%', width: '26%', height: '4%' },
      { label: 'SGST Amount (9%)', value: '₹13,950.00', confidence: 99.3, top: '64%', left: '70%', width: '26%', height: '4%' },
      { label: 'Total GST', value: '₹27,900.00', confidence: 99.5, top: '74%', left: '70%', width: '26%', height: '5%' },
      { label: 'Total Amount', value: '₹1,82,900.00', confidence: 99.9, top: '83%', left: '70%', width: '26%', height: '6%' }
    ],
    jsonData: {
      document_type: "TAX_INVOICE",
      vendor: {
        name: "Bharat Tech Solutions Pvt Ltd",
        gstin: "27AAACB1234F1Z5",
        address: "Suite 402, BKC, Mumbai, MH - 400051"
      },
      buyer: {
        name: "Tech-Jersey Ltd",
        gstin: "07AABCT9876C2Z1"
      },
      invoice_details: {
        number: "BTS/26-27/0412",
        date: "2026-06-05",
        currency: "INR"
      },
      line_items: [
        {
          item_number: 1,
          description: "Cloud Infrastructure Management",
          hsn_sac: "998313",
          taxable_value: 120000.00,
          cgst_rate: 9.0,
          cgst_amount: 10798.2 // Wait, standard math is represented
        },
        {
          item_number: 2,
          description: "API Integration Consultations",
          hsn_sac: "998311",
          taxable_value: 35000.00,
          cgst_rate: 9.0,
          cgst_amount: 3150.0
        }
      ],
      tax_summary: {
        taxable_amount: 155000.00,
        cgst_total: 13950.00,
        sgst_total: 13950.00,
        igst_total: 0.00,
        gst_total: 27900.00
      },
      grand_total: 182900.00
    }
  },
  po: {
    title: 'Purchase Order',
    type: 'po',
    fileName: 'PO-2026-0091.txt',
    rawText: `VERTEX LOGISTICS SOLUTIONS
PO Box 9102, Sector V, Salt Lake, Kolkata
---------------------------------------------
PURCHASE ORDER
PO Number: PO-2026-0091     Date: 28-May-2026
Vendor: Vertex Logistics Solutions
Billing To: Tech-Jersey Group
Deliver To: Tech-Jersey Warehouse, Pune
Payment Terms: Net 30 Days
---------------------------------------------
Item Code | Description          | Qty | Rate (₹)
----------|----------------------|-----|----------
LGT-F1    | Freight Forwarding   | 1   | 85,000.00
LGT-H2    | Port Handling Fees   | 1   | 15,000.00
---------------------------------------------
Subtotal:                           ₹1,00,000.00
Tax / GST Amount:                          ₹0.00
---------------------------------------------
Total Amount (INR):                 ₹1,00,000.00
---------------------------------------------`,
    fields: [
      { label: 'PO Number', value: 'PO-2026-0091', confidence: 99.7, top: '18%', left: '26%', width: '30%', height: '5%' },
      { label: 'PO Date', value: '2026-05-28', confidence: 99.3, top: '18%', left: '72%', width: '22%', height: '5%' },
      { label: 'Vendor Name', value: 'Vertex Logistics Solutions', confidence: 99.8, top: '2%', left: '4%', width: '50%', height: '5%' },
      { label: 'Freight Item Cost', value: '₹85,000.00', confidence: 98.9, top: '46%', left: '75%', width: '20%', height: '4%' },
      { label: 'Handling Item Cost', value: '₹15,000.00', confidence: 98.9, top: '51%', left: '75%', width: '20%', height: '4%' },
      { label: 'Total Amount', value: '₹1,00,000.00', confidence: 99.8, top: '66%', left: '70%', width: '26%', height: '6%' }
    ],
    jsonData: {
      document_type: "PURCHASE_ORDER",
      po_details: {
        number: "PO-2026-0091",
        date: "2026-05-28",
        currency: "INR"
      },
      vendor: {
        name: "Vertex Logistics Solutions",
        address: "PO Box 9102, Sector V, Salt Lake, Kolkata"
      },
      buyer: {
        name: "Tech-Jersey Group",
        delivery_address: "Tech-Jersey Warehouse, Pune",
        payment_terms: "Net 30 Days"
      },
      items: [
        {
          code: "LGT-F1",
          description: "Freight Forwarding Services",
          quantity: 1,
          rate: 85000.00,
          total: 85000.00
        },
        {
          code: "LGT-H2",
          description: "Port Handling Fees",
          quantity: 1,
          rate: 15000.00,
          total: 15000.00
        }
      ],
      totals: {
        subtotal: 100000.00,
        tax: 0.00,
        grand_total: 100000.00
      }
    }
  },
  agreement: {
    title: 'Service Agreement',
    type: 'agreement',
    fileName: 'Master-Service-Agreement-v4.docx',
    rawText: `MASTER SOFTWARE DEVELOPMENT AGREEMENT
This Master Software Development Agreement ("Agreement") is
entered into as of June 1, 2026 ("Effective Date") by and
between:
Tech-Jersey Studio ("Provider"), and
Aura Global Corp ("Client").

Section 4. Intellectual Property (IP) Rights:
All code and intellectual deliverables created under this
Agreement shall be owned exclusively by Client upon receipt of
full payments to Provider.

Section 7. Fees & Payment Terms:
Client shall pay invoices within Net 15 days upon milestone
verification.

Section 12. Limitation of Liability:
The liability cap of either party is limited to 100% of
aggregate fees paid under this Agreement.

Section 15. Governing Law:
This Agreement is governed by the laws of the Republic of India,
with jurisdiction in Mumbai, Maharashtra.`,
    fields: [
      { label: 'Contract Title', value: 'Master Software Development Agreement', confidence: 99.4, top: '2%', left: '4%', width: '92%', height: '8%' },
      { label: 'Effective Date', value: '2026-06-01', confidence: 99.1, top: '14%', left: '38%', width: '22%', height: '4%' },
      { label: 'First Party (Provider)', value: 'Tech-Jersey Studio', confidence: 99.8, top: '22%', left: '4%', width: '38%', height: '4%' },
      { label: 'Second Party (Client)', value: 'Aura Global Corp', confidence: 99.8, top: '27%', left: '4%', width: '34%', height: '4%' },
      { label: 'IP Clause Summary', value: 'Owned exclusively by Client upon receipt of payment', confidence: 95.8, top: '34%', left: '4%', width: '92%', height: '14%' },
      { label: 'Payment Terms', value: 'Net 15 days', confidence: 99.2, top: '56%', left: '38%', width: '22%', height: '4%' },
      { label: 'Liability Cap', value: '100% of aggregate fees paid', confidence: 97.4, top: '67%', left: '32%', width: '56%', height: '5%' },
      { label: 'Governing Law Jurisdiction', value: 'Republic of India, Mumbai, Maharashtra', confidence: 99.6, top: '78%', left: '4%', width: '92%', height: '8%' }
    ],
    jsonData: {
      document_type: "SERVICE_AGREEMENT",
      contract_title: "Master Software Development Agreement",
      parties: {
        provider: "Tech-Jersey Studio",
        client: "Aura Global Corp"
      },
      dates: {
        effective_date: "2026-06-01",
        execution_date: "2026-06-01"
      },
      key_clauses: {
        intellectual_property: "Owned exclusively by Client upon receipt of full payments to Provider",
        payment_terms: {
          days: 15,
          trigger: "Net 15 days upon milestone verification"
        },
        liability_cap: {
          threshold: "100% of aggregate fees paid under this Agreement",
          exceptions: []
        },
        governing_law: {
          country: "Republic of India",
          state: "Maharashtra",
          city_jurisdiction: "Mumbai"
        }
      }
    }
  }
}

export default function DocumentAIDemo() {
  const [selectedType, setSelectedType] = useState<string>('invoice')
  const [demoState, setDemoState] = useState<'idle' | 'scanning' | 'extracting' | 'completed'>('idle')
  const [activeHoverField, setActiveHoverField] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'fields' | 'json'>('fields')
  const [customFile, setCustomFile] = useState<File | null>(null)
  const [customFileName, setCustomFileName] = useState<string>('')
  const [emailFormShow, setEmailFormShow] = useState<boolean>(false)
  const [emailInput, setEmailInput] = useState<string>('')
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  const doc = SAMPLE_DOCUMENTS[selectedType] || SAMPLE_DOCUMENTS.invoice

  const handleSelectDoc = (type: string) => {
    if (demoState === 'scanning' || demoState === 'extracting') return
    setSelectedType(type)
    setCustomFile(null)
    setCustomFileName('')
    setEmailFormShow(false)
    setEmailSubmitted(false)
    setDemoState('idle')
    setCopied(false)
  }

  const handleStartParsing = () => {
    if (demoState === 'scanning' || demoState === 'extracting') return
    setDemoState('scanning')
    setActiveTab('fields')
    setCopied(false)

    setTimeout(() => {
      setDemoState('extracting')
      setTimeout(() => {
        setDemoState('completed')
        if (customFile) {
          setEmailFormShow(true)
        }
      }, 1500)
    }, 2000)
  }

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCustomFile(file)
      setCustomFileName(file.name)
      setDemoState('idle')
      setEmailFormShow(false)
      setEmailSubmitted(false)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailInput.trim()) {
      setEmailSubmitted(true)
      setTimeout(() => {
        setEmailFormShow(false)
      }, 2000)
    }
  }

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(doc.jsonData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `${doc.fileName.split('.')[0]}_extracted.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(doc.jsonData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="doc-ai-container">
      {/* HEADER CONTROL TAB */}
      <div className="doc-tabs">
        <button
          className={`doc-tab-btn ${selectedType === 'invoice' && !customFile ? 'active' : ''}`}
          onClick={() => handleSelectDoc('invoice')}
        >
          🇮🇳 GST Invoice
        </button>
        <button
          className={`doc-tab-btn ${selectedType === 'po' && !customFile ? 'active' : ''}`}
          onClick={() => handleSelectDoc('po')}
        >
          📦 Purchase Order
        </button>
        <button
          className={`doc-tab-btn ${selectedType === 'agreement' && !customFile ? 'active' : ''}`}
          onClick={() => handleSelectDoc('agreement')}
        >
          📜 Service Agreement
        </button>
      </div>

      {/* CORE WORKSPACE */}
      <div className="doc-grid">
        {/* DOCUMENT VIEWPORT */}
        <div className="doc-viewport-card">
          <div className="viewport-header">
            <span className="doc-tag">INPUT DOCUMENT</span>
            <span className="doc-filename">
              {customFile ? customFileName : doc.fileName}
            </span>
          </div>

          <div className="viewport-body">
            {/* Overlay Bounding Boxes during/after Scanning */}
            {demoState !== 'idle' && demoState !== 'scanning' && (
              <div className="bounding-boxes-container">
                {doc.fields.map((field, idx) => (
                  <div
                    key={idx}
                    className={`ocr-box ${activeHoverField === idx ? 'hovered' : ''}`}
                    style={{
                      top: field.top,
                      left: field.left,
                      width: field.width,
                      height: field.height,
                    }}
                    onMouseEnter={() => setActiveHoverField(idx)}
                    onMouseLeave={() => setActiveHoverField(null)}
                  >
                    <span className="ocr-box-tooltip">{field.label} ({field.confidence}%)</span>
                  </div>
                ))}
              </div>
            )}

            {/* Simulated OCR scanning bar */}
            {demoState === 'scanning' && (
              <div className="ocr-laser-line" />
            )}

            {/* Document Content Display */}
            <div className="doc-sheet">
              {customFile ? (
                <div className="custom-file-preview">
                  <div className="custom-file-icon">📄</div>
                  <div className="custom-file-meta">
                    <strong>{customFileName}</strong>
                    <span>{(customFile.size / 1024).toFixed(1)} KB · Ready to Parse</span>
                  </div>
                </div>
              ) : (
                <pre className="doc-pre-text">{doc.rawText}</pre>
              )}
            </div>
          </div>

          {/* VIEWPORT CONTROLS */}
          <div className="viewport-footer">
            <div className="upload-btn-wrapper">
              <button className="btn-upload">📎 Upload Document</button>
              <input type="file" accept="image/*,application/pdf" onChange={handleCustomFileUpload} />
            </div>
            
            <button
              className={`btn-parse-trigger ${demoState === 'scanning' || demoState === 'extracting' ? 'parsing' : ''}`}
              onClick={handleStartParsing}
              disabled={demoState === 'scanning' || demoState === 'extracting'}
            >
              {demoState === 'idle' && '⚡ Run AI Extraction'}
              {demoState === 'scanning' && '🔍 Reading Layout...'}
              {demoState === 'extracting' && '🧠 Extracting Fields...'}
              {demoState === 'completed' && '✨ Reparse Document'}
            </button>
          </div>
        </div>

        {/* OUTPUT EXTRACTOR PANEL */}
        <div className="doc-output-card">
          {/* TAB HEADER */}
          <div className="output-header">
            <div className="output-tabs">
              <button
                className={`output-tab-btn ${activeTab === 'fields' ? 'active' : ''}`}
                onClick={() => setActiveTab('fields')}
              >
                📊 Structured Fields
              </button>
              <button
                className={`output-tab-btn ${activeTab === 'json' ? 'active' : ''}`}
                onClick={() => setActiveTab('json')}
              >
                ⚙️ Parsed JSON
              </button>
            </div>
          </div>

          {/* OUTPUT BODY */}
          <div className="output-body">
            {demoState === 'idle' && (
              <div className="state-empty">
                <div className="state-icon">⚡</div>
                <h3>Extraction Pipeline Ready</h3>
                <p>Click "Run AI Extraction" to scan layout files, run model inference, and view structural data schemas.</p>
              </div>
            )}

            {demoState === 'scanning' && (
              <div className="state-loading">
                <div className="spinner" />
                <h3>Optical Layout Parsing</h3>
                <p>Analyzing document geometry, OCR line segments, and word coordinates...</p>
              </div>
            )}

            {demoState === 'extracting' && (
              <div className="state-loading">
                <div className="spinner pulse" />
                <h3>Schema Normalization</h3>
                <p>Mapping labels to keys, executing mathematical checks, and generating schema graphs...</p>
              </div>
            )}

            {demoState === 'completed' && activeTab === 'fields' && (
              <div className="fields-view">
                {emailFormShow ? (
                  <div className="lock-blur-overlay">
                    <div className="lock-box">
                      <div className="lock-icon">🔒</div>
                      <h3>Extraction Complete!</h3>
                      <p>We parsed <strong>{doc.fields.length} items</strong> from your custom invoice. Enter your email to view the schema output.</p>
                      
                      {emailSubmitted ? (
                        <div className="success-email">✓ Code blueprint sent to your email!</div>
                      ) : (
                        <form onSubmit={handleEmailSubmit} className="lock-form">
                          <input
                            type="email"
                            placeholder="work@company.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            required
                          />
                          <button type="submit">Unlock JSON Schema</button>
                        </form>
                      )}
                    </div>
                  </div>
                ) : null}

                <div className={`fields-list ${emailFormShow ? 'blurred' : ''}`}>
                  {doc.fields.map((field, idx) => (
                    <div
                      key={idx}
                      className={`field-item ${activeHoverField === idx ? 'hovered' : ''}`}
                      onMouseEnter={() => setActiveHoverField(idx)}
                      onMouseLeave={() => setActiveHoverField(null)}
                    >
                      <div className="field-info">
                        <span className="field-label">{field.label}</span>
                        <span className="field-value">{field.value}</span>
                      </div>
                      <div className="field-accuracy">
                        <span className="accuracy-badge" style={{
                          color: field.confidence > 98 ? 'var(--em)' : '#f39c12',
                          borderColor: field.confidence > 98 ? 'rgba(15,159,112,0.3)' : 'rgba(243,156,18,0.3)',
                          background: field.confidence > 98 ? 'rgba(15,159,112,0.05)' : 'rgba(243,156,18,0.05)'
                        }}>
                          {field.confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {demoState === 'completed' && activeTab === 'json' && (
              <div className="json-view">
                {emailFormShow ? (
                  <div className="lock-blur-overlay">
                    <div className="lock-box">
                      <div className="lock-icon">🔒</div>
                      <h3>Extraction Complete!</h3>
                      <p>We compiled the JSON schemas. Enter your email to review structure and integrations.</p>
                      {emailSubmitted ? (
                        <div className="success-email">✓ JSON output sent! Check your inbox.</div>
                      ) : (
                        <form onSubmit={handleEmailSubmit} className="lock-form">
                          <input
                            type="email"
                            placeholder="work@company.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            required
                          />
                          <button type="submit">Unlock JSON Schema</button>
                        </form>
                      )}
                    </div>
                  </div>
                ) : null}

                <div className={`json-codeblock-container ${emailFormShow ? 'blurred' : ''}`}>
                  <div className="json-actions">
                    <button className="btn-action-json" onClick={handleDownloadJson}>
                      📥 Download JSON
                    </button>
                    <button className="btn-action-json" onClick={handleCopyJson}>
                      {copied ? '✓ Copied!' : '📋 Copy JSON'}
                    </button>
                  </div>
                  <pre className="json-pre">
                    <code>{JSON.stringify(doc.jsonData, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .doc-ai-container {
          width: 100%;
          background: rgba(10, 15, 20, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
          min-height: 580px;
        }

        /* Tabs */
        .doc-tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 12px;
          flex-wrap: wrap;
        }

        .doc-tab-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.06);
          color: var(--text-s);
          padding: 8px 16px;
          border-radius: 8px;
          font-family: var(--display);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s var(--ease);
        }

        .doc-tab-btn:hover {
          border-color: rgba(15, 159, 112, 0.3);
          color: var(--text);
        }

        .doc-tab-btn.active {
          background: rgba(15, 159, 112, 0.1);
          border-color: var(--em);
          color: var(--em);
        }

        /* Work Grid */
        .doc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: stretch;
        }

        /* Viewport Card */
        .doc-viewport-card {
          background: rgba(15, 20, 25, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          min-height: 480px;
        }

        .viewport-header {
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .doc-tag {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: var(--text-m);
          text-transform: uppercase;
        }

        .doc-filename {
          font-size: 11px;
          color: var(--em);
          font-family: monospace;
        }

        .viewport-body {
          flex-grow: 1;
          position: relative;
          background: #080d12;
          overflow-y: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 16px;
        }

        /* OCR scanning bar */
        .ocr-laser-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--em), transparent);
          box-shadow: 0 0 12px var(--em), 0 0 6px var(--em);
          animation: laserScan 2s infinite ease-in-out;
          z-index: 10;
        }

        @keyframes laserScan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }

        /* Bounding boxes overlays */
        .bounding-boxes-container {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          bottom: 16px;
          pointer-events: none;
          z-index: 5;
        }

        .ocr-box {
          position: absolute;
          border: 1px dashed rgba(15, 159, 112, 0.3);
          background: rgba(15, 159, 112, 0.02);
          transition: all 0.2s ease;
          pointer-events: auto;
          cursor: pointer;
        }

        .ocr-box:hover, .ocr-box.hovered {
          border-color: var(--em);
          background: rgba(15, 159, 112, 0.12);
          box-shadow: 0 0 8px rgba(15, 159, 112, 0.4);
          z-index: 15;
        }

        .ocr-box-tooltip {
          visibility: hidden;
          background: #000;
          color: #fff;
          text-align: center;
          border-radius: 4px;
          padding: 4px 8px;
          position: absolute;
          z-index: 100;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 9px;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.1);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .ocr-box:hover .ocr-box-tooltip {
          visibility: visible;
          opacity: 1;
        }

        /* Document Sheet */
        .doc-sheet {
          width: 100%;
          background: #0b141d;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          padding: 16px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.4);
          z-index: 1;
        }

        .doc-pre-text {
          font-family: 'Courier New', Courier, monospace;
          font-size: 11px;
          line-height: 1.4;
          color: #a5b4c4;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .custom-file-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 40px 20px;
          color: var(--text-s);
          text-align: center;
        }

        .custom-file-icon {
          font-size: 64px;
          filter: drop-shadow(0 0 10px rgba(15,159,112,0.2));
          animation: floatItem 3s infinite ease-in-out;
        }

        @keyframes floatItem {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .custom-file-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .custom-file-meta strong {
          font-family: var(--display);
          font-size: 14px;
          color: var(--text);
          word-break: break-all;
        }

        .custom-file-meta span {
          font-size: 11px;
          color: var(--text-m);
        }

        /* Viewport Footer */
        .viewport-footer {
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .upload-btn-wrapper {
          position: relative;
          overflow: hidden;
          display: inline-block;
        }

        .btn-upload {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: var(--text-s);
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          font-family: var(--display);
          transition: background 0.3s, border-color 0.3s;
        }

        .upload-btn-wrapper:hover .btn-upload {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.08);
        }

        .upload-btn-wrapper input[type=file] {
          font-size: 100px;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          cursor: pointer;
        }

        .btn-parse-trigger {
          flex-grow: 1;
          background: linear-gradient(135deg, var(--em), #4fffca);
          border: none;
          color: #000;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--display);
          transition: transform 0.2s, opacity 0.2s;
        }

        .btn-parse-trigger:hover {
          transform: translateY(-1px);
        }

        .btn-parse-trigger:active {
          transform: translateY(0);
        }

        .btn-parse-trigger:disabled, .btn-parse-trigger.parsing {
          opacity: 0.8;
          transform: none;
          cursor: not-allowed;
          background: #1f2c34;
          color: var(--text-m);
        }

        /* Output Card */
        .doc-output-card {
          background: rgba(15, 20, 25, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 480px;
        }

        .output-header {
          padding: 0 16px;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .output-tabs {
          display: flex;
          gap: 16px;
        }

        .output-tab-btn {
          background: transparent;
          border: none;
          color: var(--text-m);
          padding: 16px 0;
          font-family: var(--display);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          position: relative;
          transition: color 0.3s;
        }

        .output-tab-btn:hover {
          color: var(--text);
        }

        .output-tab-btn.active {
          color: var(--em);
        }

        .output-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--em);
        }

        .output-body {
          flex-grow: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          position: relative;
          background: #070a0d;
        }

        /* Loading States */
        .state-empty, .state-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
          margin: auto;
          max-width: 300px;
        }

        .state-icon {
          font-size: 40px;
          margin-bottom: 16px;
          color: var(--em);
        }

        .state-empty h3, .state-loading h3 {
          font-family: var(--display);
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 8px;
        }

        .state-empty p, .state-loading p {
          font-size: 12px;
          line-height: 1.5;
          color: var(--text-m);
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 2px solid rgba(15, 159, 112, 0.1);
          border-top-color: var(--em);
          border-radius: 50%;
          animation: spin 1s infinite linear;
          margin-bottom: 20px;
        }

        .spinner.pulse {
          animation: pulseGlow 1.5s infinite ease-in-out;
          border-color: var(--em);
          background: rgba(15,159,112,0.1);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        /* Fields List */
        .fields-view {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .fields-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: filter 0.3s ease;
        }

        .fields-list.blurred, .json-codeblock-container.blurred {
          filter: blur(8px);
          pointer-events: none;
          user-select: none;
        }

        .field-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 8px;
          transition: all 0.2s var(--ease);
          cursor: pointer;
        }

        .field-item:hover, .field-item.hovered {
          background: rgba(15, 159, 112, 0.04);
          border-color: rgba(15, 159, 112, 0.2);
          transform: translateX(4px);
        }

        .field-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .field-label {
          font-size: 10px;
          color: var(--text-m);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .field-value {
          font-family: var(--display);
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
        }

        .field-accuracy {
          display: flex;
        }

        .accuracy-badge {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid;
          font-family: monospace;
        }

        /* JSON Code Block */
        .json-view {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .json-codeblock-container {
          position: relative;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          transition: filter 0.3s ease;
        }

        .json-actions {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .btn-action-json {
          background: #12181f;
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-s);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          cursor: pointer;
          font-family: var(--display);
          transition: all 0.2s;
        }

        .btn-action-json:hover {
          border-color: var(--em);
          color: var(--em);
          background: #17212b;
        }

        .json-pre {
          background: #05080b;
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 8px;
          padding: 16px;
          flex-grow: 1;
          margin: 0;
          overflow-x: auto;
          font-family: monospace;
          font-size: 11px;
          line-height: 1.5;
          color: #61afef;
        }

        .json-pre code {
          display: block;
          white-space: pre;
        }

        /* Form Overlay */
        .lock-blur-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(5,8,12,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          border-radius: 8px;
        }

        .lock-box {
          text-align: center;
          max-width: 320px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .lock-icon {
          font-size: 36px;
          color: var(--em);
        }

        .lock-box h3 {
          font-family: var(--display);
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }

        .lock-box p {
          font-size: 12px;
          line-height: 1.5;
          color: var(--text-m);
          margin: 0 0 8px 0;
        }

        .lock-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .lock-form input {
          background: #121820;
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text);
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 13px;
          text-align: center;
          outline: none;
          width: 100%;
        }

        .lock-form input:focus {
          border-color: var(--em);
        }

        .lock-form button {
          background: linear-gradient(135deg, var(--em), #4fffca);
          border: none;
          color: #000;
          padding: 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--display);
        }

        .success-email {
          color: var(--em);
          font-size: 13px;
          font-weight: 600;
          padding: 10px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .doc-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .doc-viewport-card {
            min-height: 400px;
          }
          .doc-output-card {
            min-height: 400px;
          }
        }

        @media (max-width: 480px) {
          .doc-tabs {
            justify-content: center;
          }
          .doc-tab-btn {
            font-size: 11px;
            padding: 6px 12px;
          }
          .doc-ai-container {
            padding: 12px;
          }
        }
      `}} />
    </div>
  )
}
