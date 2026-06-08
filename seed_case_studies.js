// Seed Case Studies with deployment stories using generic industry client names
const path = require('path');
const dbPath = path.resolve(__dirname, 'payload.db');
const { randomUUID } = require('crypto');

function main() {
  const libsql = require('libsql');
  const db = new libsql(dbPath);
  const now = new Date().toISOString();

  // Service IDs (from existing seeds)
  const CRM_SERVICE_ID = 2;
  const DOCUMENT_AI_SERVICE_ID = 3;
  const WHATSAPP_SERVICE_ID = 1;

  // Define 3 case studies with generic industry names
  const caseStudies = [
    {
      client: 'Premier Realty Group — CRM Lead Pipeline Automation',
      slug: 'premier-realty-crm-pipeline',
      industry: 'real-estate',
      summary: 'A 30-agent real estate brokerage was losing 35% of inbound leads due to manual data entry, slow assignment routing, and zero WhatsApp follow-up integration. We deployed an end-to-end CRM pipeline that captures leads from 6 sources, auto-scores them, assigns agents in under 4 seconds, and triggers WhatsApp drip sequences — recovering ₹4.2L in monthly pipeline value.',
      featured: true,
      relatedServiceIds: [CRM_SERVICE_ID],
      metrics: [
        { value: '₹4.2L/mo', label: 'Pipeline Value Recovered' },
        { value: '4 sec', label: 'Lead Assignment Speed' },
        { value: '92%', label: 'Follow-Up Coverage' },
        { value: '35%', label: 'Lead Leakage Eliminated' },
      ],
      challenge: {
        root: {
          type: 'root',
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'Premier Realty Group operated with 30 agents across 3 city branches. Leads arrived from property portals, Google Ads, walk-ins, referrals, WhatsApp inquiries, and social media DMs — but every lead was manually logged into spreadsheets.', format: 0 }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'The average lead response time exceeded 6 hours, and over 35% of inbound leads were never contacted. Agents frequently cherry-picked high-value leads while mid-tier prospects rotted in shared folders.', format: 0 }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'Monthly revenue leakage was estimated at ₹4-5 lakhs from dropped follow-ups alone.', format: 1 }] },
          ],
          direction: 'ltr', format: '', indent: 0, version: 1,
        },
      },
      solution: {
        root: {
          type: 'root',
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'We deployed a fully automated CRM pipeline using Zoho CRM integrated with n8n automation workflows.', format: 0 }] },
            { type: 'list', listType: 'bullet', children: [
              { type: 'listitem', children: [{ type: 'text', text: '6-source lead ingestion (web forms, WhatsApp, portals, walk-in QR, referral links, social DMs)', format: 0 }] },
              { type: 'listitem', children: [{ type: 'text', text: 'AI-powered lead scoring model based on budget, location, timeline, and engagement history', format: 0 }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Round-robin assignment with priority overrides for high-value prospects', format: 0 }] },
              { type: 'listitem', children: [{ type: 'text', text: 'WhatsApp Business API drip sequences triggered automatically on lead creation', format: 0 }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Real-time dashboard with conversion funnel, agent performance, and revenue attribution', format: 0 }] },
            ] },
            { type: 'paragraph', children: [{ type: 'text', text: 'The system went live in 3 weeks with zero downtime during migration from the existing spreadsheet-based workflow.', format: 0 }] },
          ],
          direction: 'ltr', format: '', indent: 0, version: 1,
        },
      },
    },
    {
      client: 'Apex Logistics — Automated Waybill & Invoice OCR',
      slug: 'apex-logistics-document-ai',
      industry: 'finance',
      summary: 'A mid-sized logistics company processing 800+ invoices/month manually was experiencing 12% error rates and 3-day processing delays. We deployed a Document Intelligence pipeline using GPT-4 Vision and custom OCR to extract, validate, and sync invoice data directly into Tally ERP — reducing processing time from 72 hours to 15 seconds per document.',
      featured: true,
      relatedServiceIds: [DOCUMENT_AI_SERVICE_ID],
      metrics: [
        { value: '99.2%', label: 'Extraction Accuracy' },
        { value: '15 sec', label: 'Per-Document Processing' },
        { value: '₹1.8L/mo', label: 'Labour Cost Savings' },
        { value: '85%', label: 'Fewer Manual Corrections' },
      ],
      challenge: {
        root: {
          type: 'root',
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'Apex Logistics handled 800+ vendor invoices monthly across their supply chain operations. Each invoice was manually reviewed, keyed into spreadsheets, validated against purchase orders, and then re-entered into Tally ERP.', format: 0 }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'This process consumed 3 full-time employees and took an average of 72 hours from invoice receipt to ERP entry. Error rates averaged 12%, leading to payment disputes and vendor relationship friction.', format: 0 }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'The finance team spent more time correcting entries than analyzing financial data.', format: 1 }] },
          ],
          direction: 'ltr', format: '', indent: 0, version: 1,
        },
      },
      solution: {
        root: {
          type: 'root',
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'We built an end-to-end document intelligence pipeline combining OCR extraction with GPT-4 Vision validation:', format: 0 }] },
            { type: 'list', listType: 'bullet', children: [
              { type: 'listitem', children: [{ type: 'text', text: 'Multi-format document intake via email attachment monitoring, WhatsApp file uploads, and manual drag-and-drop', format: 0 }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Hybrid OCR engine processing Indian GST invoices, waybills, and purchase orders with GSTIN, HSN/SAC, and tax component extraction', format: 0 }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Confidence scoring with automated flagging for human review on low-confidence fields', format: 0 }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Direct API integration into Tally ERP for automated journal entry creation', format: 0 }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Monthly reconciliation reports auto-generated and emailed to the finance head', format: 0 }] },
            ] },
            { type: 'paragraph', children: [{ type: 'text', text: 'Processing time dropped from 72 hours to 15 seconds per document, freeing the finance team to focus on analysis and forecasting.', format: 0 }] },
          ],
          direction: 'ltr', format: '', indent: 0, version: 1,
        },
      },
    },
    {
      client: 'Urban Style D2C — WhatsApp Commerce & Support Bot',
      slug: 'urban-style-whatsapp-commerce',
      industry: 'retail',
      summary: 'A direct-to-consumer fashion brand with 15K+ monthly WhatsApp inquiries was manually handling order status, returns, and product recommendations. We deployed a conversational commerce bot on the WhatsApp Business API that handles 87% of inquiries autonomously, processes COD confirmations, and drives ₹6.4L/month in attributable WhatsApp revenue.',
      featured: true,
      relatedServiceIds: [WHATSAPP_SERVICE_ID],
      metrics: [
        { value: '₹6.4L/mo', label: 'WhatsApp-Attributed Revenue' },
        { value: '87%', label: 'Autonomous Resolution Rate' },
        { value: '< 8 sec', label: 'Average Response Time' },
        { value: '2.3x', label: 'Repeat Purchase Uplift' },
      ],
      challenge: {
        root: {
          type: 'root',
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'Urban Style, a growing D2C fashion brand, received 15,000+ WhatsApp messages monthly — order status queries, return requests, size guidance, product recommendations, and COD confirmations.', format: 0 }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'A team of 4 customer support agents manually handled every message, resulting in average response times exceeding 45 minutes during peak hours. Cart abandonment was high because customers could not get instant answers about sizing, availability, or delivery timelines.', format: 0 }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'The brand was leaving significant revenue on the table from missed upsell opportunities and delayed COD confirmations.', format: 1 }] },
          ],
          direction: 'ltr', format: '', indent: 0, version: 1,
        },
      },
      solution: {
        root: {
          type: 'root',
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'We deployed a multi-capability WhatsApp Commerce Bot using the official WhatsApp Business API:', format: 0 }] },
            { type: 'list', listType: 'bullet', children: [
              { type: 'listitem', children: [{ type: 'text', text: 'Natural language intent classification routing queries to Order Status, Returns, Product Discovery, and Human Agent queues', format: 0 }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Real-time order tracking integration with Shiprocket and Delhivery APIs', format: 0 }] },
              { type: 'listitem', children: [{ type: 'text', text: 'AI-powered product recommendations based on browsing history and purchase patterns', format: 0 }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Automated COD confirmation flows with payment link fallback for prepaid conversion', format: 0 }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Post-purchase drip campaigns triggering review requests and cross-sell sequences', format: 0 }] },
            ] },
            { type: 'paragraph', children: [{ type: 'text', text: 'The bot now handles 87% of all inquiries without human intervention, with average response times under 8 seconds.', format: 0 }] },
          ],
          direction: 'ltr', format: '', indent: 0, version: 1,
        },
      },
    },
  ];

  // Check and seed each case study
  for (const cs of caseStudies) {
    const existing = db.prepare('SELECT id FROM case_studies WHERE slug = ?').get(cs.slug);

    let caseStudyId;

    if (existing) {
      caseStudyId = existing.id;
      console.log(`Case study "${cs.slug}" already exists (id: ${caseStudyId}) — updating...`);

      db.prepare(`UPDATE case_studies SET
        client = ?,
        industry = ?,
        summary = ?,
        featured = ?,
        challenge = ?,
        solution = ?,
        updated_at = ?
        WHERE id = ?
      `).run(
        cs.client,
        cs.industry,
        cs.summary,
        cs.featured ? 1 : 0,
        JSON.stringify(cs.challenge),
        JSON.stringify(cs.solution),
        now,
        caseStudyId
      );

      // Clear existing metrics
      db.prepare('DELETE FROM case_studies_metrics WHERE _parent_id = ?').run(caseStudyId);

      // Clear existing related services relationships
      db.prepare("DELETE FROM case_studies_rels WHERE parent_id = ? AND path = 'relatedServices'").run(caseStudyId);

    } else {
      const insertResult = db.prepare('INSERT INTO case_studies (client, slug, industry, summary, featured, challenge, solution, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
        cs.client,
        cs.slug,
        cs.industry,
        cs.summary,
        cs.featured ? 1 : 0,
        JSON.stringify(cs.challenge),
        JSON.stringify(cs.solution),
        now,
        now
      );
      caseStudyId = Number(insertResult.lastInsertRowid);
      console.log(`Created case study "${cs.slug}" with id: ${caseStudyId}`);
    }

    // Insert metrics
    const metricsInsert = db.prepare('INSERT INTO case_studies_metrics (_order, _parent_id, id, value, label) VALUES (?, ?, ?, ?, ?)');
    cs.metrics.forEach((m, i) => {
      metricsInsert.run(i + 1, caseStudyId, randomUUID(), m.value, m.label);
    });
    console.log(`  → Inserted ${cs.metrics.length} metrics`);

    // Insert related services relationships
    const relInsert = db.prepare('INSERT INTO case_studies_rels (parent_id, path, services_id, "order") VALUES (?, ?, ?, ?)');
    cs.relatedServiceIds.forEach((serviceId, i) => {
      relInsert.run(caseStudyId, 'relatedServices', serviceId, i + 1);
    });
    console.log(`  → Linked ${cs.relatedServiceIds.length} service(s)`);
  }

  // Verification
  console.log('\n── Verification ──');
  const allCaseStudies = db.prepare('SELECT id, client, slug, industry, featured FROM case_studies').all();
  console.log(`Total case studies: ${allCaseStudies.length}`);
  allCaseStudies.forEach(cs => {
    const metricsCount = db.prepare('SELECT COUNT(*) as c FROM case_studies_metrics WHERE _parent_id = ?').get(cs.id);
    const relsCount = db.prepare("SELECT COUNT(*) as c FROM case_studies_rels WHERE parent_id = ? AND path = 'relatedServices'").get(cs.id);
    console.log(`  [${cs.id}] ${cs.client.substring(0, 50)}... | industry=${cs.industry} | featured=${cs.featured} | metrics=${metricsCount.c} | services=${relsCount.c}`);
  });

  db.close();
  console.log('\n✅ Case studies seeded successfully!');
}

main();
