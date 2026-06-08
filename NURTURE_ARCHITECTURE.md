# Nurture Architecture — Tech Jersey Studio

## Overview

Two primary nurture sequences flow from n8n into leads. Both sequences use a combination of WhatsApp Cloud API messages and email. Lead state is synced back into Payload CMS via `PATCH /api/leads/nurture` after each touchpoint.

---

## Sequence 1: Audit Funnel Nurture (7-Day)

**Trigger**: Lead completes `/audit` and receives score  
**Lead Source**: `audit_funnel`  
**n8n Tag**: `audit_funnel_nurture`

```
Day 0  (Immediate)
  → WhatsApp: "Hi {name}! Your AI Automation Score is {score}/100.
               Here's what it means for {company}: [brief interpretation]
               Your top opportunity: {top_opportunity}
               I'll send your full report in a few minutes."

  → Email (5 min delay): Full Audit PDF report
    Subject: "Your Automation Readiness Report — {score}/100"
    Body: Full breakdown of score, opportunities, recommended systems, ROI estimate

Day 1
  → n8n callback → PATCH /api/leads/nurture { sequenceStage: 'day_1' }

Day 3
  → WhatsApp: "Hi {name} — wanted to share a case study relevant to {industry}:
               [Link to case study].
               Client went from {before_metric} to {after_metric} in {timeframe}.
               Would something like this work for your business?"

Day 5
  → Email: "What {company} could save with automation"
    Subject: "A rough estimate for {company}"
    Body: Personalised ROI estimate based on audit score + industry

Day 7
  → WhatsApp: "Hey {name}, happy to jump on a quick call to review your score together.
               Here's my calendar: [booking link]
               No pressure — just 20 minutes."

  → If unresponsive after Day 7: mark lead as 'on_hold', stop sequence
```

---

## Sequence 2: Resource Download Nurture (5-Day)

**Trigger**: Lead downloads any resource from `/resources`  
**Lead Source**: `website`  
**n8n Tag**: `resource_{resource_slug}` (e.g. `resource_whatsapp-automation-blueprint`)

```
Day 0  (Immediate)
  → Email: "Your {resource_title} is ready"
    Subject: "Here's your free download: {resource_title}"
    Body: Direct download link + 3 highlights from the resource

Day 2
  → WhatsApp (if phone number captured): "Hi {name} — did you get a chance to look
    through the {resource_title}? Happy to answer any questions directly."

Day 4
  → Email: Related case study for the resource topic
    e.g. Blueprint downloaders get WhatsApp automation case study
    Subject: "See the blueprint in action — real client results"

Day 5
  → WhatsApp: "Based on what you downloaded, I think {specific system} would be
               a great fit for your business. Here's a quick audit to see:
               [audit link] — takes 2 minutes."

  → If no audit taken: mark nurture_tag complete, no further messages
```

---

## n8n → Payload CMS Callback

After each nurture step, n8n calls back to Payload to update the lead record:

```http
PATCH /api/leads/nurture
Authorization: X-Webhook-Signature: hmac-sha256-{signature}
Content-Type: application/json

{
  "leadId": "64abc123",
  "sequenceStage": "day_3_whatsapp",
  "lastEmailed": "2026-06-07T08:00:00Z",
  "whatsappSent": true,
  "lastWhatsappAt": "2026-06-07T08:05:00Z",
  "nurtureTag": "audit_funnel_nurture"
}
```

**Response**: `200 { "success": true, "leadId": "64abc123" }`

---

## Lead Segmentation Logic in n8n

```
IF lead.source == 'audit_funnel'
  → Start: Audit Funnel Nurture sequence
  → Use: lead.auditDetails.score, lead.auditDetails.opportunities, lead.industry

ELSE IF lead.nurtureDetails.resourceDownloaded != null
  → Start: Resource Download Nurture sequence
  → Use: lead.nurtureDetails.resourceDownloaded to select case study

ELSE IF lead.source == 'website'
  → Start: Generic contact nurture (simple 3-step sequence)
  → Day 0 email ack, Day 3 case study, Day 7 audit invite

IF lead.nurtureDetails.unsubscribed == true
  → STOP all sequences immediately
```

---

## Unsubscribe Handling

1. Email unsubscribe link → n8n receives webhook → calls `PATCH /api/leads/nurture` with `{ unsubscribed: true }`
2. WhatsApp opt-out keyword ("STOP", "UNSUBSCRIBE") → n8n processes → same callback
3. Payload CMS `nurtureDetails.unsubscribed = true` — admin can also manually toggle

---

## Sequence Configuration (n8n Variables)

Set these in n8n environment:

| Variable | Value |
|----------|-------|
| `PAYLOAD_NURTURE_CALLBACK_URL` | `https://techjersey.studio/api/leads/nurture` |
| `PAYLOAD_WEBHOOK_SECRET` | Same as `N8N_WEBHOOK_SECRET` in `.env` |
| `WHATSAPP_PHONE_NUMBER_ID` | Cloud API phone number ID |
| `CALENDLY_LINK` | Booking calendar URL |
| `AUDIT_URL` | `https://techjersey.studio/audit` |

---

## Monitoring

Check nurture health in Payload CMS Admin → Leads → filter by `nurtureDetails.sequenceStage`.

Leads stuck in the same stage for 48+ hours may indicate n8n is unreachable or the webhook secret has rotated.
