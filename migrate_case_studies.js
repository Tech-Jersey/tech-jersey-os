/**
 * migrate_case_studies.js
 * Adds missing tables for the CaseStudies collection:
 *   - case_studies_process_steps
 *   - case_studies_timeline
 *   - case_studies_metrics
 *   - case_studies_rels
 *
 * Safe to run multiple times (uses IF NOT EXISTS).
 * Run with: node migrate_case_studies.js
 */
const path = require('path')
const dbPath = path.resolve(__dirname, 'payload.db')

async function main() {
  const libsql = require('libsql')
  const db = new libsql(dbPath)

  // Inspect current state
  const existing = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'case_studies%'"
  ).all().map(t => t.name)
  console.log('Existing case_studies tables:', existing)

  // ── 1. case_studies_metrics ──────────────────────────────────────────────
  if (!existing.includes('case_studies_metrics')) {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS case_studies_metrics (
        _order    INTEGER NOT NULL,
        _parent_id INTEGER NOT NULL REFERENCES case_studies(id) ON DELETE CASCADE,
        id        TEXT PRIMARY KEY,
        value     TEXT,
        label     TEXT,
        context   TEXT
      )
    `).run()
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_cs_metrics_parent ON case_studies_metrics(_parent_id)`).run()
    console.log('✓ Created case_studies_metrics')
  } else {
    console.log('· case_studies_metrics already exists')
  }

  // ── 2. case_studies_process_steps ────────────────────────────────────────
  if (!existing.includes('case_studies_process_steps')) {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS case_studies_process_steps (
        _order    INTEGER NOT NULL,
        _parent_id INTEGER NOT NULL REFERENCES case_studies(id) ON DELETE CASCADE,
        id        TEXT PRIMARY KEY,
        icon      TEXT,
        title     TEXT,
        description TEXT,
        tech_tag  TEXT
      )
    `).run()
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_cs_process_parent ON case_studies_process_steps(_parent_id)`).run()
    console.log('✓ Created case_studies_process_steps')
  } else {
    console.log('· case_studies_process_steps already exists')
  }

  // ── 3. case_studies_timeline ─────────────────────────────────────────────
  if (!existing.includes('case_studies_timeline')) {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS case_studies_timeline (
        _order    INTEGER NOT NULL,
        _parent_id INTEGER NOT NULL REFERENCES case_studies(id) ON DELETE CASCADE,
        id        TEXT PRIMARY KEY,
        phase     TEXT,
        milestone TEXT,
        detail    TEXT
      )
    `).run()
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_cs_timeline_parent ON case_studies_timeline(_parent_id)`).run()
    console.log('✓ Created case_studies_timeline')
  } else {
    console.log('· case_studies_timeline already exists')
  }

  // ── 4. case_studies_rels ─────────────────────────────────────────────────
  if (!existing.includes('case_studies_rels')) {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS case_studies_rels (
        "order"   INTEGER,
        path      TEXT,
        parent_id INTEGER NOT NULL REFERENCES case_studies(id) ON DELETE CASCADE,
        services_id INTEGER REFERENCES services(id) ON DELETE SET NULL
      )
    `).run()
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_cs_rels_parent ON case_studies_rels(parent_id)`).run()
    console.log('✓ Created case_studies_rels')
  } else {
    console.log('· case_studies_rels already exists')
  }

  // ── Verify ────────────────────────────────────────────────────────────────
  const after = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'case_studies%'"
  ).all().map(t => t.name)
  console.log('\n✅ Final case_studies tables:', after)

  db.close()
}

main().catch(e => {
  console.error('Migration failed:', e.message)
  process.exit(1)
})
