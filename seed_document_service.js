// Seed Document Intelligence service data using libsql
const path = require('path');
const dbPath = path.resolve(__dirname, 'payload.db');
const { randomUUID } = require('crypto');

function main() {
  const libsql = require('libsql');
  const db = new libsql(dbPath);
  const now = new Date().toISOString();

  // Check if Document Intelligence service already exists
  const existing = db.prepare("SELECT id FROM services WHERE slug = 'document-intelligence'").get();
  
  let serviceId;

  if (existing) {
    serviceId = existing.id;
    console.log('Document Intelligence service already exists with id:', serviceId, '— updating...');
    
    db.prepare(`UPDATE services SET
      title = ?,
      category = ?,
      tagline = ?,
      description = ?,
      "order" = ?,
      featured = ?,
      icon = ?,
      cta_text = ?,
      demo_type = ?,
      case_study_snapshot_client_name = ?,
      case_study_snapshot_metric_value = ?,
      case_study_snapshot_metric_label = ?,
      case_study_snapshot_summary = ?,
      seo_title = ?,
      seo_description = ?,
      updated_at = ?
      WHERE id = ?
    `).run(
      'Turn Unstructured Documents into Structured Data, Instantly.',
      'ai',
      'Automate invoice, receipt, and contract data entry with 99.2% accuracy using AI-powered document extraction pipelines.',
      'Manual document processing is slow, error-prone, and expensive. We build end-to-end Document Intelligence pipelines that automatically extract structured JSON data from any document using optical character recognition (OCR) and vision-based AI classification. Integrate directly with your ERP, accounting software, or databases.',
      15, 1, '📄', 'Build Document AI', 'document-ai',
      'Leading Logistics Provider', '120 hrs', 'Saved Monthly',
      'By deploying a custom Document AI pipeline, this leading logistics provider automatically extracts vendor information, billing dates, line items, and totals from thousands of diverse PDF invoices monthly, validating them against purchase orders and syncing them directly to Zoho Books. This eliminated their manual data entry queue and saved their finance team 120 hours monthly.',
      'AI Document Intelligence & OCR Automation | Tech Jersey',
      'Automate invoice, receipt, and contract data entry with 99.2% accuracy. vision-based layout-agnostic Document AI pipelines that sync with Zoho, Tally, and SAP.',
      now,
      serviceId
    );
    
    // Clear existing related data
    db.prepare("DELETE FROM services_key_capabilities WHERE _parent_id = ?").run(serviceId);
    db.prepare("DELETE FROM services_roi_metrics WHERE _parent_id = ?").run(serviceId);
    db.prepare("DELETE FROM services_faqs WHERE _parent_id = ?").run(serviceId);
    db.prepare("DELETE FROM services_problem_statements WHERE _parent_id = ?").run(serviceId);
    db.prepare("DELETE FROM services_hero_trust_row WHERE _parent_id = ?").run(serviceId);
    db.prepare("DELETE FROM services_integrations WHERE _parent_id = ?").run(serviceId);
    console.log('Cleared existing related data');
  } else {
    // Insert new service
    const info = db.prepare(`INSERT INTO services (
      title, slug, category, tagline, description,
      "order", featured, icon, cta_text, demo_type,
      case_study_snapshot_client_name, case_study_snapshot_metric_value,
      case_study_snapshot_metric_label, case_study_snapshot_summary,
      seo_title, seo_description,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      'Turn Unstructured Documents into Structured Data, Instantly.',
      'document-intelligence',
      'ai',
      'Automate invoice, receipt, and contract data entry with 99.2% accuracy using AI-powered document extraction pipelines.',
      'Manual document processing is slow, error-prone, and expensive. We build end-to-end Document Intelligence pipelines that automatically extract structured JSON data from any document using optical character recognition (OCR) and vision-based AI classification. Integrate directly with your ERP, accounting software, or databases.',
      15, 1, '📄', 'Build Document AI', 'document-ai',
      'Leading Logistics Provider', '120 hrs', 'Saved Monthly',
      'By deploying a custom Document AI pipeline, this leading logistics provider automatically extracts vendor information, billing dates, line items, and totals from thousands of diverse PDF invoices monthly, validating them against purchase orders and syncing them directly to Zoho Books. This eliminated their manual data entry queue and saved their finance team 120 hours monthly.',
      'AI Document Intelligence & OCR Automation | Tech Jersey',
      'Automate invoice, receipt, and contract data entry with 99.2% accuracy. vision-based layout-agnostic Document AI pipelines that sync with Zoho, Tally, and SAP.',
      now, now
    );
    serviceId = Number(info.lastInsertRowid);
    console.log('Document Intelligence service inserted with id:', serviceId);
  }

  // ── Key Capabilities ──
  const capabilities = [
    'Layout-aware OCR extraction from PDFs, PNGs, and JPEGs',
    'Zero-template zero-shot layout learning using vision LLMs',
    'Multi-page document splitting and document classification',
    'Automatic line-item extraction and tax math cross-checking',
    'Integrations with Zoho Books, Tally, SAP, QuickBooks, and Xero',
    'Secure local hosting or cloud deployment with PII redaction',
  ];

  const capInsert = db.prepare(`INSERT INTO services_key_capabilities (_order, _parent_id, id, point) VALUES (?, ?, ?, ?)`);
  capabilities.forEach((cap, i) => {
    capInsert.run(i + 1, serviceId, randomUUID(), cap);
  });
  console.log('Inserted', capabilities.length, 'capabilities');

  // ── ROI Metrics ──
  const roiMetrics = [
    { value: '99.2%', label: 'Extraction Accuracy', description: 'Vision-based layout analysis matched with programmatic math verification guarantees error-free billing entries.' },
    { value: '15 Secs', label: 'Processing Speed', description: 'From mail intake to database sync in seconds, eliminating payment delays and invoice pileups.' },
    { value: '85%+', label: 'Operational Savings', description: 'Reduces per-invoice processing cost from ₹85 (manual) to under ₹13 in API and compute resource overhead.' },
  ];

  const roiInsert = db.prepare(`INSERT INTO services_roi_metrics (_order, _parent_id, id, value, label, description) VALUES (?, ?, ?, ?, ?, ?)`);
  roiMetrics.forEach((roi, i) => {
    roiInsert.run(i + 1, serviceId, randomUUID(), roi.value, roi.label, roi.description);
  });
  console.log('Inserted', roiMetrics.length, 'ROI metrics');

  // ── FAQs ──
  const faqs = [
    {
      question: 'How does this compare to traditional template-based OCR?',
      answer: 'Traditional OCR breaks if an invoice layout changes by even 10 pixels. Our system uses advanced multi-modal vision models that read documents like humans, understanding semantic fields regardless of logo position or table grids.',
    },
    {
      question: 'What types of documents can be processed?',
      answer: 'We support invoices (including Indian GST invoices), purchase orders, service agreements, bills of lading, receipts, bank statements, and KYC documents. Custom models can be trained for proprietary layouts.',
    },
    {
      question: 'How does it handle Indian GST invoices?',
      answer: 'Our parsing pipeline is optimized for GST invoices. It automatically identifies Vendor and Buyer GSTINs, separates state taxes (CGST, SGST) from inter-state tax (IGST), reads HSN/SAC codes, and cross-calculates line items to ensure zero errors.',
    },
    {
      question: 'Can this integrate with our accounting software?',
      answer: 'Yes. We support direct API integrations with Tally Prime, Zoho Books, SAP, QuickBooks, and Xero. We can also output CSV or JSON exports into automated folders.',
    },
    {
      question: 'What happens with low-confidence extractions?',
      answer: 'If the model is unsure of a field (confidence drops below 95%), the document is routed to a secure verification portal for quick operator review. No incorrect data is ever synced.',
    },
  ];

  const faqInsert = db.prepare(`INSERT INTO services_faqs (_order, _parent_id, id, question, answer) VALUES (?, ?, ?, ?, ?)`);
  faqs.forEach((faq, i) => {
    faqInsert.run(i + 1, serviceId, randomUUID(), faq.question, faq.answer);
  });
  console.log('Inserted', faqs.length, 'FAQs');

  // ── Problem Statements ──
  const problems = [
    { icon: '📋', title: 'Manual Data Entry', description: 'Finance teams spend up to 16 hours a week transcriptionally copying line items, HSN numbers, and tax tables.', impactMetric: '16 hrs/rep wasted' },
    { icon: '❌', title: 'High Error Rates', description: 'Manual entry yields a 12% average error rate. Mismatched tax totals trigger audit alerts and reconciliation blocks.', impactMetric: '12% average errors' },
    { icon: '⏰', title: 'Processing Bottlenecks', description: 'Invoices take an average of 4.5 days to cycle from intake to approval, creating operational backlogs and payment delays.', impactMetric: '4.5 days turnaround' },
    { icon: '🏗️', title: 'Inflexible Systems', description: 'Traditional OCR template engines break down whenever a vendor slightly alters their layout or adds columns.', impactMetric: 'Template fragility' },
  ];

  const probInsert = db.prepare(`INSERT INTO services_problem_statements (_order, _parent_id, id, icon, title, description, impact_metric) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  problems.forEach((p, i) => {
    probInsert.run(i + 1, serviceId, randomUUID(), p.icon, p.title, p.description, p.impactMetric);
  });
  console.log('Inserted', problems.length, 'problem statements');

  // ── Hero Trust Row ──
  const trustItems = [
    { text: '99.2% Accuracy Rate' },
    { text: 'Direct ERP Sync' },
    { text: 'PII Redaction Secured' },
  ];

  const trustInsert = db.prepare(`INSERT INTO services_hero_trust_row (_order, _parent_id, id, text) VALUES (?, ?, ?, ?)`);
  trustItems.forEach((t, i) => {
    trustInsert.run(i + 1, serviceId, randomUUID(), t.text);
  });
  console.log('Inserted', trustItems.length, 'hero trust items');

  // ── Integrations ──
  const integrations = [
    { name: 'Zoho Books', icon: '📘', category: 'ERP' },
    { name: 'Tally', icon: '📗', category: 'ERP' },
    { name: 'QuickBooks', icon: '📙', category: 'Accounting' },
    { name: 'Xero', icon: '🔵', category: 'Accounting' },
    { name: 'SAP', icon: '🖥️', category: 'Enterprise' },
    { name: 'Google Sheets', icon: '📊', category: 'Database' },
    { name: 'n8n', icon: '⚡', category: 'Automation' },
    { name: 'WhatsApp API', icon: '💬', category: 'Ingestion' },
  ];

  const integInsert = db.prepare(`INSERT INTO services_integrations (_order, _parent_id, id, name, icon, category) VALUES (?, ?, ?, ?, ?, ?)`);
  integrations.forEach((ig, i) => {
    integInsert.run(i + 1, serviceId, randomUUID(), ig.name, ig.icon, ig.category);
  });
  console.log('Inserted', integrations.length, 'integrations');

  // ── Verify ──
  const verify = db.prepare("SELECT id, title, slug, demo_type FROM services WHERE slug = 'document-intelligence'").get();
  console.log('\nVerification:', JSON.stringify(verify));

  db.close();
  console.log('\n✅ Document Intelligence service seeded successfully!');
}

main();
