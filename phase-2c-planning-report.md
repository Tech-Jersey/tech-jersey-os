# Tech-Jersey Studio — Phase 2C Planning Report
## Service: Document Intelligence (AI-Powered Document Extraction)

---

## Executive Summary
Document Intelligence represents a major upgrade to Tech-Jersey's capability catalog. This service automates high-friction, manual document processing workflows (such as invoice entry, receipt filing, and contract extraction) by translating unstructured files into structured JSON data. 

This planning report outlines the page architecture, interactive sandbox simulation, CMS models, mobile adaptation, and conversion pathways required to deliver a premium, high-converting service detail page at `/services/document-intelligence`.

---

## 1. Page Architecture & Section Layout

The page will follow the dynamic template of `/services/[slug]/page.tsx` powered by Next.js and Payload CMS, extending the page sections to support the interactive document extraction sandbox.

```mermaid
graph TD
  A[User visits /services/document-intelligence] --> B(Dynamic [slug] Router)
  B --> C[Fetch Service Data from Payload CMS]
  C --> D[Render Page Template]
  
  subgraph Section Sequence
    D --> E[1. Service Hero + Integrated Demo]
    E --> F[2. Problem Section: Invisible Leaks]
    F --> G[3. Solution Section: System Spec Grid]
    G --> H[4. ROI Yield Metrics Section]
    H --> I[5. Dynamic Document AI Demo Mid-Page Scroll Target]
    I --> J[6. Case Study Snapshot: Apex Global Logistics]
    J --> K[7. FAQ Section: Technical Integrations]
    K --> L[8. Bottom Audit Conversion Strip]
  end
```

### Page Structure Details
*   **Routing**: `/services/document-intelligence` resolved dynamically by [page.tsx](file:///c:/Users/ks005/Downloads/New%20folder/tech-jersey-os/src/app/(frontend)/services/[slug]/page.tsx).
*   **Layout Grid**: A desktop 2-column layout (1.2fr 1fr split) where the left column houses text/CTAs and the right column houses the interactive `DocumentAIDemo` sandbox.
*   **Section Flow**: Seamless transitions from immediate tactile interaction (Hero Demo) to analytical evaluation (Problem & Solution grids) to empirical proof (ROI & Case Study) and finally trust validation (FAQ & Audit CTA).

---

## 2. Interactive Document Parsing Demo Simulation

The interactive demo will simulate a full machine-learning extraction pipeline without backend dependencies (client-side simulation) to maximize performance and engagement.

### The Pipeline Flow
```
[Invoice Selector / Drag-and-Drop File]
                 ↓
      [OCR Boundary Mapping]
                 ↓
    [Data Field Extraction Cards]
                 ↓
      [Syntax-Highlighted JSON]
```

### Detailed Execution Storyboard
1.  **Step 1: Intake & Upload (File Selector)**
    *   *Visuals*: A drag-and-drop dropzone decorated with a dashed neon-green border (`var(--em)`).
    *   *Interaction*: Users can drag/drop any image/PDF, or click on one of 3 pre-loaded samples:
        *   **Standard Service Invoice** (Freelance consulting bill)
        *   **Retail/Office Receipt** (Vendor hardware store receipt)
        *   **Hosting/Cloud Invoice** (Tech-Jersey cloud hosting bill)
    *   *Micro-interaction*: Hovering over samples scales them up smoothly (`transform: scale(1.02)`) with a subtle glow.

2.  **Step 2: OCR Scanning Animation (Horizontal Laser Beam)**
    *   *Visuals*: A vertical laser line scanning top-to-bottom across the document using a keyframe animation.
    *   *Overlay*: Bounding boxes (`div` overlays with a faint green background and borders) pop into view dynamically as the scanline passes them, simulating word detection.
    *   *Timing*: 1.8 seconds scan period to keep the user engaged without causing frustration.

3.  **Step 3: Fields Extraction (Confidence Scores)**
    *   *Visuals*: A sidebar list where key-value fields slide in with a typewriter effect.
    *   *Data Fields Simulated*:
        *   `Vendor Name` (e.g., "Tech-Jersey Hosting" — 99% confidence)
        *   `Invoice Number` (e.g., "TJ-2026-894" — 99% confidence)
        *   `Issue Date` (e.g., "2026-06-01" — 98% confidence)
        *   `Line Items` (Array of items, quantities, and prices)
        *   `Subtotal`, `Tax Rate (GST/VAT)`, and `Total Amount`
    *   *Glow Highlights*: Hovering over an extracted data card in the sidebar highlights the matching bounding box on the document view, creating an intuitive spatial reference.

4.  **Step 4: JSON Output Node**
    *   *Visuals*: A dark terminal panel displaying a pretty-printed JSON structure.
    *   *Feature*: Syntax-highlighted keys (orange/red) and values (green), matching a premium developer interface. A "Copy JSON" button that transitions to a green "✓ Copied!" badge.

---

## 3. Component Architecture

We will create a modular components folder structure inside `src/components/demos` to keep code readable and reusable.

```
src/components/demos/
├── DocumentAIDemo.tsx            # Parent container managing state (Intake -> Scan -> Extract -> JSON)
└── document-ai/                  # Sub-components
    ├── InvoiceSelector.tsx       # Pre-loaded sample selector + Drag-n-drop interface
    ├── ScanningViewport.tsx      # Render document image with canvas/CSS laser scanner overlay
    ├── ExtractionSidebar.tsx     # Display fields list with loading spinners and accuracy gauges
    └── JsonOutputViewer.tsx      # Codeblock wrapper with syntax highlighting and Copy capability
```

### Component Breakdown & State Management

#### A. Parent Container: `DocumentAIDemo.tsx`
*   **State Hook**:
    ```typescript
    type DemoStep = 'idle' | 'scanning' | 'extracting' | 'completed';
    const [step, setStep] = useState<DemoStep>('idle');
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
    ```
*   **Logic**: Handles progress transitions via timeout functions (`setTimeout` simulations for scanning and extraction).

#### B. Scanner Overlays: `ScanningViewport.tsx`
*   **Visual Structure**: Absolute containers positioned over the relative viewport container.
*   **CSS Styles**:
    ```css
    .scan-line {
      position: absolute;
      left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, transparent, var(--em), transparent);
      box-shadow: 0 0 12px var(--em);
      animation: laserScan 2s infinite ease-in-out;
    }
    .bounding-box {
      position: absolute;
      border: 1px dashed var(--em);
      background: rgba(15, 159, 112, 0.1);
      transition: opacity 0.3s ease;
    }
    ```

#### C. Value Highlighters: `ExtractionSidebar.tsx`
*   **States**: Displaying progress bars for each field being "read". Once read, shows green checkmarks or confidence thresholds (e.g. `99.2% Accuracy`).

---

## 4. CMS Changes & Seeding Plan

Payload CMS handles dynamic service generation. We need to add the new capability and database structure.

### CMS Schema Update (`src/payload/collections/Services.ts`)
*   The `demoType` select field already supports `document-ai`. We will map this options key to import and render `DocumentAIDemo` inside `/services/[slug]/page.tsx`.
*   Ensure that file size fields and schema structures are ready to accept document configuration parameters.

### Seeding Script (`seed_document_service.js`)
We will create a database seeding script using the `libsql` package, mirroring `seed_crm_service.js` to insert the service metadata, problem statements, FAQ blocks, capabilities, and ROI values directly into `payload.db`.

#### Seed Data Content:
1.  **Service Meta**:
    *   **Slug**: `document-intelligence`
    *   **Title**: `Turn Unstructured Documents into Structured Data, Instantly.`
    *   **Tagline**: `Automate invoices, receipts, and logistics slips with 99% accuracy using layout-aware AI.`
    *   **Icon**: `📄`
    *   **demoType**: `document-ai`
2.  **Problem Statements (`services_problem_statements`)**:
    *   🚨 **Lead-Lag Entry**: Invoice entry backlogs lock up accounting and delay vendor payments. (*Impact: 4.5 days processing lag*)
    *   ✍️ **Manual Typo Leakage**: Transcription mistakes cause tax audits and account mismatch errors. (*Impact: 12% average error rate*)
    *   🏗️ **Template Fragility**: Traditional OCR breaks when vendor invoices move fields by 10 pixels. (*Impact: Constant template rebuilds*)
    *   💰 **High Per-Doc Cost**: Staff costs of manual copy-pasting limit scale and hurt margins. (*Impact: ₹85+ per invoice cost*)
3.  **ROI Metrics (`services_roi_metrics`)**:
    *   `99.2%`: **Accuracy Threshold** — Advanced validation logic removes human data verification.
    *   `15 Seconds`: **Processing Time** — From upload to ERP storage, completely removing queuing delays.
    *   `85% Saved`: **Operational Costs** — Drops standard processing cost to under ₹13 per document.
4.  **Key Capabilities (`services_key_capabilities`)**:
    *   Multi-format support (PDF, TIFF, JPEG, PNG)
    *   Zero-template zero-shot layout learning using vision LLMs
    *   Human-in-the-loop exception routing triggers on low confidence scores
    *   Line-item table extraction and mathematical cross-checks
    *   API integrations with Xero, Zoho Books, QuickBooks, and SAP
5.  **FAQ Content (`services_faqs`)**:
    *   *Is my financial data secure?* Yes, documents are encrypted at rest (AES-256) and transit (TLS 1.3) with optional automated PII redactors.
    *   *Does it require templates?* No, our system uses vision-based models that adapt dynamically to any invoice design.
    *   *What happens if accuracy is low?* Documents scoring below 95% confidence are routed to a secure verification portal for human sign-off.
6.  **Case Study Snapshot (`case_study_snapshot` group)**:
    *   **Client**: `Apex Global Logistics`
    *   **Metric Value**: `120 hrs`
    *   **Metric Label**: `Saved Monthly`
    *   **Summary**: `We deployed a custom Document AI pipeline for Apex Logistics. It automatically extracts vendor, billing dates, line items, and totals from diverse PDF invoices, validates them against purchase orders, and syncs them directly with Zoho Books. This eliminated their manual data entry queue and saved their finance team 120 hours monthly.`

---

## 5. Mobile & Responsive Strategy

Interactive demos on small viewports can become crowded and difficult to read. The layout needs to adjust dynamically for screen sizes below 1024px.

### Mobile UX Adapters
*   **Single-Column View**: On screens `< 1024px`, the layout shifts from side-by-side to a vertical stack.
*   **Step-by-Step wizard**: Instead of displaying the file list and document preview simultaneously, the UI uses a mobile stepper wizard.
    *   *Step 1*: Select/Upload Document (vertical card stack).
    *   *Step 2*: Scanner Viewport (fills the container; user watches the scanning animation).
    *   *Step 3*: Extracted Card List & JSON Node. Tabs allow toggle between "Extracted Fields" and "JSON Schema".
*   **Touch Optimizations**:
    *   Interactive items have a minimum 48px hit area.
    *   Swipe gestures to change between steps or preview modes.
    *   Disabled CSS pointer-events on scanners to avoid page scrolling locks.

---

## 6. Conversion Strategy

Converting sandbox visitors into warm leads is the primary commercial objective of this page.

```
[TACTILE SANDBOX] ──(Custom File Trigger)──> [LEAD POPUP: GET SCHEMA]
        │
        ├───────────────────────────────────> [INLINE ROI CALCULATOR]
        │
        └───────────────────────────────────> [STICKY AUDIT CTA STRIP]
```

### Lead Capture Mechanisms
1.  **"Test Your Own Invoice" Trigger**:
    *   When a user uploads their own file (instead of selecting a pre-loaded sample), the simulation processes it.
    *   Upon completion, a locked blur overlay covers the JSON panel with a message:
        > 🔒 **Structured Schema Identified**
        > We detected **12 invoice fields** and a **3 line-item array** on your document. Enter your work email to view the custom JSON export.
2.  **Savings ROI Calculator**:
    *   Inside the ROI section, a simple interactive component:
        *   *Inputs*: Invoices Processed Monthly (slider: 100 - 10,000) and Staff Hourly Rate (slider: ₹200 - ₹2,000).
        *   *Output*: Dynamic savings counter: `You could save ₹X,XXX,XXX annually`.
        *   *CTA*: "Get Custom Savings PDF Report" (leads to a simple form).
3.  **Export Schema to n8n / Zapier Button**:
    *   Below the JSON output viewport, add a secondary action button: "Send n8n Workflow Blueprint".
    *   Clicking it triggers a form to send the preconfigured node setup directly to the user's email.
4.  **Sticky Bottom Audit Bar**:
    *   A floating footer strip prompting the user:
        *   `Is your invoice flow ready for AI automation?`
        *   Action: "Start Free 2-Min Audit →" linking to the existing `/audit` engine.

---

## Verification Plan

To ensure successful delivery of Phase 2C, verification will occur in two stages:

### Automated Tests
*   **Lint Check**: Run `npm run lint` to confirm TypeScript type safety.
*   **Next.js Production Build**: Run `npm run build` to verify page rendering paths compile statically and server-side configurations do not leak credentials.
*   **Accessibility Validate**: Run Lighthouse audits targeting mobile viewport sizing, ARIA roles for modal sliders, and tab indexes.

### Manual Verification
*   **Device Responsiveness**: Verify transitions on iOS Safari, Android Chrome, and desktop screens at various breakpoint widths (320px, 768px, 1024px, 1440px).
*   **Interaction Verification**: Test clicking through all 3 templates, canceling uploads, copying JSON, and clicking the sliders inside the ROI calculator. Verify the local DB seeding script matches sqlite formatting.
