// Seed CRM Automation service data using libsql
const path = require('path');
const dbPath = path.resolve(__dirname, 'payload.db');
const { randomUUID } = require('crypto');

function main() {
  const libsql = require('libsql');
  const db = new libsql(dbPath);
  const now = new Date().toISOString();

  // Check if CRM service already exists
  const existing = db.prepare("SELECT id FROM services WHERE slug = 'crm-automation'").get();
  
  let serviceId;

  if (existing) {
    serviceId = existing.id;
    console.log('CRM service already exists with id:', serviceId, '— updating...');
    
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
      'Stop Losing Leads Between Your Website, CRM, and Sales Team.',
      'automation',
      'Automatically capture, score, assign, and follow up with every lead across your entire sales pipeline.',
      'Most sales teams lose 20-40% of their leads to slow follow-up, manual data entry, and disconnected systems. We build automated CRM pipelines that capture every lead instantly, enrich their data, score them with AI, assign them to the right rep, and trigger personalized follow-up sequences — all without a single manual step.',
      5, 1, '📊', 'Build CRM System', 'crm',
      'Growth First Realty', '₹4.2L+', 'Revenue Recovered Monthly',
      'After implementing our CRM automation system, Growth First Realty recovered over ₹4.2 lakhs in monthly revenue by eliminating lead leakage and reducing response time from 6 hours to under 2 minutes. Their sales team now focuses entirely on closing, not chasing.',
      'AI CRM Automation - Stop Losing Leads | Tech Jersey',
      'Automatically capture, score, assign, and follow up with every lead. AI-powered CRM automation that recovers lost revenue and eliminates manual data entry.',
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
      'Stop Losing Leads Between Your Website, CRM, and Sales Team.',
      'crm-automation',
      'automation',
      'Automatically capture, score, assign, and follow up with every lead across your entire sales pipeline.',
      'Most sales teams lose 20-40% of their leads to slow follow-up, manual data entry, and disconnected systems. We build automated CRM pipelines that capture every lead instantly, enrich their data, score them with AI, assign them to the right rep, and trigger personalized follow-up sequences — all without a single manual step.',
      5, 1, '📊', 'Build CRM System', 'crm',
      'Growth First Realty', '₹4.2L+', 'Revenue Recovered Monthly',
      'After implementing our CRM automation system, Growth First Realty recovered over ₹4.2 lakhs in monthly revenue by eliminating lead leakage and reducing response time from 6 hours to under 2 minutes. Their sales team now focuses entirely on closing, not chasing.',
      'AI CRM Automation - Stop Losing Leads | Tech Jersey',
      'Automatically capture, score, assign, and follow up with every lead. AI-powered CRM automation that recovers lost revenue and eliminates manual data entry.',
      now, now
    );
    serviceId = Number(info.lastInsertRowid);
    console.log('CRM service inserted with id:', serviceId);
  }

  // Also update WhatsApp service to use demoType 'whatsapp'
  db.prepare("UPDATE services SET demo_type = 'whatsapp' WHERE slug = 'whatsapp-automation'").run();
  console.log('Updated WhatsApp service demo_type');

  // ── Key Capabilities ──
  const capabilities = [
    'Multi-channel lead capture (Website, WhatsApp, Ads, Email, Referral)',
    'Automatic data enrichment and deduplication',
    'AI-powered lead scoring and qualification',
    'Intelligent round-robin assignment with territory rules',
    'Automated email + WhatsApp follow-up sequences',
    'Real-time Slack/WhatsApp notifications for hot leads',
    'Pipeline stage automation with deal tracking',
    'Custom dashboard with conversion analytics',
    'CRM integration (HubSpot, Zoho, Salesforce, Google Sheets)',
  ];

  const capInsert = db.prepare(`INSERT INTO services_key_capabilities (_order, _parent_id, id, point) VALUES (?, ?, ?, ?)`);
  capabilities.forEach((cap, i) => {
    capInsert.run(i + 1, serviceId, randomUUID(), cap);
  });
  console.log('Inserted', capabilities.length, 'capabilities');

  // ── ROI Metrics ──
  const roiMetrics = [
    { value: '90%+', label: 'Lead Capture Rate', description: 'Stop losing leads to slow forms, missed calls, and disconnected channels. Capture from every touchpoint automatically.' },
    { value: '<2 min', label: 'First Response Time', description: 'Instant automated acknowledgment and personalized follow-up triggered within 2 minutes of lead entry.' },
    { value: '35%', label: 'Close Rate Improvement', description: 'Clients see an average 35% improvement in close rates within 90 days of CRM automation deployment.' },
  ];

  const roiInsert = db.prepare(`INSERT INTO services_roi_metrics (_order, _parent_id, id, value, label, description) VALUES (?, ?, ?, ?, ?, ?)`);
  roiMetrics.forEach((roi, i) => {
    roiInsert.run(i + 1, serviceId, randomUUID(), roi.value, roi.label, roi.description);
  });
  console.log('Inserted', roiMetrics.length, 'ROI metrics');

  // ── FAQs ──
  const faqs = [
    {
      question: 'Which CRMs do you integrate with?',
      answer: 'We integrate with HubSpot, Salesforce, Zoho CRM, Pipedrive, Google Sheets, Airtable, and custom databases. If you use a CRM not listed, we can build a custom integration via API.',
    },
    {
      question: 'How long does CRM automation take to implement?',
      answer: 'A standard CRM automation pipeline takes 2-4 weeks to design, build, test, and deploy. Complex multi-CRM or enterprise implementations may take 4-8 weeks.',
    },
    {
      question: 'Will this work with our existing sales process?',
      answer: 'Yes. We map your existing sales workflow first, then automate it. We don\'t force you into a new process — we make your current process faster and more reliable.',
    },
    {
      question: 'What happens to leads captured outside business hours?',
      answer: 'Leads are captured and scored 24/7. Automated responses are sent instantly. Assignments and notifications queue for business hours, or can be configured for after-hours rotation.',
    },
    {
      question: 'Can we track ROI of the CRM automation?',
      answer: 'Absolutely. We build a custom analytics dashboard that tracks lead source, response time, pipeline velocity, conversion rate, and revenue attribution in real-time.',
    },
    {
      question: 'What if we don\'t have a CRM yet?',
      answer: 'We can set up a complete CRM from scratch — including lead capture, pipeline management, and automation — using tools like HubSpot Free, Zoho, or a custom Google Sheets + n8n stack.',
    },
  ];

  const faqInsert = db.prepare(`INSERT INTO services_faqs (_order, _parent_id, id, question, answer) VALUES (?, ?, ?, ?, ?)`);
  faqs.forEach((faq, i) => {
    faqInsert.run(i + 1, serviceId, randomUUID(), faq.question, faq.answer);
  });
  console.log('Inserted', faqs.length, 'FAQs');

  // ── Problem Statements ──
  const problems = [
    { icon: '💧', title: 'Lead Leakage', description: 'Leads from forms, ads, and referrals fall through the cracks because nobody follows up within the first 5 minutes.', impactMetric: '₹3.2L+ lost/month' },
    { icon: '⏰', title: 'Slow Response Time', description: 'Your average first response takes 6+ hours. By then, the prospect has already spoken to your competitor.', impactMetric: '78% drop in conversion' },
    { icon: '📋', title: 'Manual Data Entry', description: 'Sales reps spend 40% of their time copying data between spreadsheets, emails, and CRM instead of selling.', impactMetric: '16 hrs/week wasted' },
    { icon: '🔗', title: 'Disconnected Systems', description: 'Your website, email, WhatsApp, and CRM don\'t talk to each other. Leads exist in silos nobody can see.', impactMetric: 'Zero pipeline visibility' },
  ];

  const probInsert = db.prepare(`INSERT INTO services_problem_statements (_order, _parent_id, id, icon, title, description, impact_metric) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  problems.forEach((p, i) => {
    probInsert.run(i + 1, serviceId, randomUUID(), p.icon, p.title, p.description, p.impactMetric);
  });
  console.log('Inserted', problems.length, 'problem statements');

  // ── Hero Trust Row ──
  const trustItems = [
    { text: '100% Lead Tracking' },
    { text: 'Instant Assignment' },
    { text: '24/7 Automation' },
  ];

  const trustInsert = db.prepare(`INSERT INTO services_hero_trust_row (_order, _parent_id, id, text) VALUES (?, ?, ?, ?)`);
  trustItems.forEach((t, i) => {
    trustInsert.run(i + 1, serviceId, randomUUID(), t.text);
  });
  console.log('Inserted', trustItems.length, 'hero trust items');

  // ── Integrations ──
  const integrations = [
    { name: 'HubSpot', icon: '🟠', category: 'CRM' },
    { name: 'Salesforce', icon: '☁️', category: 'CRM' },
    { name: 'Zoho CRM', icon: '🔵', category: 'CRM' },
    { name: 'WhatsApp', icon: '💬', category: 'Messaging' },
    { name: 'Slack', icon: '🟣', category: 'Notifications' },
    { name: 'Gmail', icon: '📧', category: 'Email' },
    { name: 'Google Sheets', icon: '📗', category: 'Database' },
    { name: 'n8n', icon: '⚡', category: 'Automation' },
    { name: 'Calendly', icon: '📅', category: 'Scheduling' },
    { name: 'Stripe', icon: '💳', category: 'Payments' },
  ];

  const integInsert = db.prepare(`INSERT INTO services_integrations (_order, _parent_id, id, name, icon, category) VALUES (?, ?, ?, ?, ?, ?)`);
  integrations.forEach((ig, i) => {
    integInsert.run(i + 1, serviceId, randomUUID(), ig.name, ig.icon, ig.category);
  });
  console.log('Inserted', integrations.length, 'integrations');

  // ── Verify ──
  const verify = db.prepare("SELECT id, title, slug, demo_type FROM services WHERE slug = 'crm-automation'").get();
  console.log('\nVerification:', JSON.stringify(verify));

  const capCount = db.prepare("SELECT COUNT(*) as c FROM services_key_capabilities WHERE _parent_id = ?").get(serviceId);
  const roiCount = db.prepare("SELECT COUNT(*) as c FROM services_roi_metrics WHERE _parent_id = ?").get(serviceId);
  const faqCount = db.prepare("SELECT COUNT(*) as c FROM services_faqs WHERE _parent_id = ?").get(serviceId);
  const probCount = db.prepare("SELECT COUNT(*) as c FROM services_problem_statements WHERE _parent_id = ?").get(serviceId);
  const trustCount = db.prepare("SELECT COUNT(*) as c FROM services_hero_trust_row WHERE _parent_id = ?").get(serviceId);
  const integCount = db.prepare("SELECT COUNT(*) as c FROM services_integrations WHERE _parent_id = ?").get(serviceId);

  console.log('Capabilities:', capCount.c);
  console.log('ROI Metrics:', roiCount.c);
  console.log('FAQs:', faqCount.c);
  console.log('Problem Statements:', probCount.c);
  console.log('Hero Trust Row:', trustCount.c);
  console.log('Integrations:', integCount.c);

  db.close();
  console.log('\n✅ CRM service seeded successfully!');
}

main();
