const Database = require('better-sqlite3');
const db = new Database('./payload.db');

// Check which case_studies tables exist
const tables = db.prepare(
  "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'case_studies%'"
).all();
console.log('Existing case_studies tables:', tables.map(t => t.name));

// Check if Payload is using libsql (not better-sqlite3)
const allTables = db.prepare(
  "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
).all();
console.log('\nAll tables:', allTables.map(t => t.name).join(', '));
