const path = require('path');
const dbPath = path.resolve(__dirname, 'payload.db');
const libsql = require('libsql');
const db = new libsql(dbPath);

// Check table schema
const schema = db.prepare('PRAGMA table_info(case_studies)').all();
console.log('case_studies schema:');
schema.forEach(c => console.log(`  ${c.name} (${c.type}) ${c.pk ? 'PK' : ''}`));

// Check existing records
const rows = db.prepare('SELECT id, client, slug FROM case_studies').all();
console.log('\nExisting case studies:', JSON.stringify(rows, null, 2));

// Check rels table schema
const relsSchema = db.prepare('PRAGMA table_info(case_studies_rels)').all();
console.log('\ncase_studies_rels schema:');
relsSchema.forEach(c => console.log(`  ${c.name} (${c.type})`));

// Check metrics table
const metricsSchema = db.prepare('PRAGMA table_info(case_studies_metrics)').all();
console.log('\ncase_studies_metrics schema:');
metricsSchema.forEach(c => console.log(`  ${c.name} (${c.type})`));

db.close();
