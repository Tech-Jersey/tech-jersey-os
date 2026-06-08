// Inspect and seed CRM data using libsql (the driver used by this project)
const path = require('path');
const dbPath = path.resolve(__dirname, 'payload.db');

async function main() {
  // Use libsql native binding
  const libsql = require('libsql');
  const db = new libsql(dbPath);

  // List all tables with 'service' in name
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%service%'").all();
  console.log('\n=== Service-related tables ===');
  for (const t of tables) {
    console.log('\n--- ' + t.name + ' ---');
    const cols = db.prepare("PRAGMA table_info(" + t.name + ")").all();
    for (const c of cols) {
      console.log('  ', c.name, '|', c.type);
    }
    const cnt = db.prepare("SELECT COUNT(*) as c FROM " + t.name).get();
    console.log('  rows:', cnt.c);
  }

  // Check existing services
  const services = db.prepare("SELECT id, title, slug, demo_type FROM services").all();
  console.log('\n=== Existing services ===');
  for (const s of services) {
    console.log(JSON.stringify(s));
  }

  db.close();
}

main().catch(e => {
  console.error('Error:', e.message);
  console.error(e.stack);
});
