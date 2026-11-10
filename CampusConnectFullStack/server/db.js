// Database adapter. Production: PostgreSQL (set DATABASE_URL). Local development: a SQLite file
// using Node's built-in node:sqlite (Node 22+), so no database install is needed to try the app.
// All SQL in this project uses $1, $2 placeholders and only features both databases share.
import fs from 'node:fs';
import path from 'node:path';

export async function openDb() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { default: pg } = await import('pg');
    const local = /localhost|127\.0\.0\.1/.test(url);
    const pool = new pg.Pool({
      connectionString: url,
      ssl: local || process.env.PGSSL === 'disable' ? false : { rejectUnauthorized: false },
      max: 5,
    });
    return {
      kind: 'PostgreSQL',
      async query(sql, params = []) { return (await pool.query(sql, params)).rows; },
      async run(sql, params = []) { const r = await pool.query(sql, params); return { rowCount: r.rowCount }; },
      async exec(sql) { await pool.query(sql); },
      close: () => pool.end(),
    };
  }

  let sqlite;
  try {
    sqlite = await import('node:sqlite');
  } catch {
    throw new Error('No DATABASE_URL set and this Node.js version has no built-in SQLite. Use Node 22+ or set DATABASE_URL to a PostgreSQL connection string.');
  }
  const file = process.env.SQLITE_FILE || './data/campusconnect.db';
  if (file !== ':memory:') fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  const d = new sqlite.DatabaseSync(file);
  d.exec('PRAGMA foreign_keys = ON;');
  const toSqlite = (sql) => sql.replace(/\$(\d+)/g, '?$1');
  return {
    kind: 'SQLite (local file)',
    async query(sql, params = []) { return d.prepare(toSqlite(sql)).all(...params); },
    async run(sql, params = []) { return { rowCount: Number(d.prepare(toSqlite(sql)).run(...params).changes) }; },
    async exec(sql) { d.exec(sql); },
    close: () => d.close(),
  };
}
