import http from 'node:http';
import { openDb } from './db.js';
import { SCHEMA } from './schema.js';
import { seedDatabase } from './seed.js';
import { createApp } from './app.js';

const PORT = Number(process.env.PORT) || 5000;

const db = await openDb();
await db.exec(SCHEMA);
const [{ n }] = await db.query('SELECT CAST(COUNT(*) AS INTEGER) AS n FROM users');
if (n === 0) {
  console.log('Empty database: loading sample data...');
  await seedDatabase(db);
}

http.createServer(createApp(db)).listen(PORT, '0.0.0.0', () => {
  console.log(`CampusConnect running on http://localhost:${PORT}  (database: ${db.kind})`);
});
