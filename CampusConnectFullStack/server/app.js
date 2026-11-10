// CampusConnect REST API (Node's built-in http, no framework). Also serves the built frontend.
// Every business rule and permission check is enforced here, on the server.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROLES, EVENT_STATUS, ATTENDANCE, CLUB_STATUS, USER_STATUS } from '../src/utils/constants.js';
import { validateLogin, validateRegister, validateEvent, validateClub } from '../src/utils/validation.js';
import { makeId } from '../src/utils/formatters.js';
import { hashPassword, verifyPassword, signToken, verifyToken } from './auth.js';
import { isPast, todayISO, eventTimestamp } from './time.js';
import { seedDatabase } from './seed.js';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const bad = (m) => new HttpError(400, m);
const firstError = (errors) => { const k = Object.keys(errors); if (k.length) throw bad(errors[k[0]]); };

// ---- row -> JSON mappers (database snake_case -> API camelCase) ----
const userOut = (r) => ({ userId: r.user_id, name: r.name, email: r.email, role: r.role, status: r.status });
const clubOut = (r) => ({ clubId: r.club_id, name: r.name, description: r.description, category: r.category, status: r.status, organizerId: r.organizer_id || null, organizerName: r.organizer_name || null });
const eventOut = (r) => ({ eventId: r.event_id, clubId: r.club_id, title: r.title, description: r.description, date: r.event_date, time: r.event_time, location: r.location, capacity: Number(r.capacity), status: r.status, registeredCount: Number(r.registered_count || 0) });
const regOut = (r) => ({
  registrationId: r.registration_id, eventId: r.event_id, studentId: r.student_id, registrationDate: r.registration_date, attendance: r.attendance,
  student: r.student_name ? { name: r.student_name, email: r.student_email } : undefined,
});

const EVENT_SELECT = 'SELECT e.*, (SELECT CAST(COUNT(*) AS INTEGER) FROM registrations r WHERE r.event_id = e.event_id) AS registered_count FROM events e';
const REG_SELECT = 'SELECT r.*, u.name AS student_name, u.email AS student_email FROM registrations r JOIN users u ON u.user_id = r.student_id';
const CLUB_SELECT = 'SELECT c.*, u.name AS organizer_name FROM clubs c LEFT JOIN users u ON u.user_id = c.organizer_id';

export function createApp(db) {
  const one = async (sql, params) => (await db.query(sql, params))[0] || null;
  const routes = [];
  const route = (method, pattern, handler) => {
    const keys = [...pattern.matchAll(/:(\w+)/g)].map((m) => m[1]);
    routes.push({ method, keys, re: new RegExp(`^${pattern.replace(/:\w+/g, '([^/]+)')}$`), handler });
  };

  const requireRole = (user, ...roles) => {
    if (!user) throw new HttpError(401, 'Log in to continue.');
    if (!roles.includes(user.role)) throw new HttpError(403, 'Your account does not have permission to do that.');
  };
  const clubOfOrganizer = (user) => one('SELECT * FROM clubs WHERE organizer_id = $1', [user.user_id]);
  async function ownedEvent(user, eventId) {
    requireRole(user, ROLES.ORGANIZER);
    const event = await one('SELECT * FROM events WHERE event_id = $1', [eventId]);
    if (!event) throw new HttpError(404, 'Event not found.');
    const club = await clubOfOrganizer(user);
    if (!club || club.club_id !== event.club_id) throw new HttpError(403, 'You can only manage events that belong to your club.');
    return event;
  }
  const getEventOut = async (id) => eventOut(await one(`${EVENT_SELECT} WHERE e.event_id = $1`, [id]));
  const getClubOut = async (id) => clubOut(await one(`${CLUB_SELECT} WHERE c.club_id = $1`, [id]));
  const futureCheck = (date, time) => { if (eventTimestamp(date, time) <= Date.now()) throw bad('Choose a date and time in the future.'); };

  // ---------- auth ----------
  const attempts = new Map(); // tiny in-memory login rate limit: 10 tries / 15 min per IP+email
  route('POST', '/api/auth/register', async ({ body }) => {
    firstError(validateRegister(body));
    const email = body.email.trim().toLowerCase();
    if (await one('SELECT user_id FROM users WHERE email = $1', [email])) throw new HttpError(409, 'An account with this email already exists. Try logging in instead.');
    const user = { user_id: makeId('u'), name: body.name.trim(), email, role: body.role, status: USER_STATUS.ACTIVE };
    await db.run('INSERT INTO users (user_id, name, email, password_hash, role, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [user.user_id, user.name, email, hashPassword(body.password), user.role, user.status, new Date().toISOString()]);
    return { status: 201, data: { token: signToken(user.user_id), user: userOut(user) } };
  });

  route('POST', '/api/auth/login', async ({ body, req }) => {
    firstError(validateLogin(body));
    const email = body.email.trim().toLowerCase();
    const key = `${req.socket.remoteAddress}|${email}`;
    const rec = attempts.get(key);
    if (rec && rec.count >= 10 && Date.now() - rec.first < 15 * 60000) throw new HttpError(429, 'Too many login attempts. Please wait a few minutes and try again.');
    const user = await one('SELECT * FROM users WHERE email = $1', [email]);
    if (!user || !verifyPassword(body.password, user.password_hash)) {
      const fresh = !rec || Date.now() - rec.first >= 15 * 60000;
      attempts.set(key, { count: fresh ? 1 : rec.count + 1, first: fresh ? Date.now() : rec.first });
      throw new HttpError(401, 'Incorrect email or password.');
    }
    if (user.status === USER_STATUS.DISABLED) throw new HttpError(403, 'This account is disabled. Contact an administrator.');
    attempts.delete(key);
    return { data: { token: signToken(user.user_id), user: userOut(user) } };
  });

  route('GET', '/api/me', async ({ user }) => {
    requireRole(user, ROLES.STUDENT, ROLES.ORGANIZER, ROLES.ADMIN);
    return { data: { user: userOut(user) } };
  });

  route('GET', '/api/health', async () => ({ data: { ok: true, database: db.kind } }));

  // ---------- data (scoped to the caller's role) ----------
  route('GET', '/api/data', async ({ user }) => {
    const role = user?.role;
    let club = null;
    if (role === ROLES.ORGANIZER) club = await clubOfOrganizer(user);

    let eventsSql = EVENT_SELECT; let eventParams = [];
    if (role !== ROLES.ADMIN) {
      eventsSql += " WHERE e.status = 'Approved'";
      if (club) { eventsSql += ' OR e.club_id = $1'; eventParams = [club.club_id]; }
    }
    eventsSql += ' ORDER BY e.event_date, e.event_time';

    let regsSql = null; let regParams = [];
    if (role === ROLES.STUDENT) { regsSql = `${REG_SELECT} WHERE r.student_id = $1`; regParams = [user.user_id]; }
    else if (role === ROLES.ADMIN) regsSql = REG_SELECT;
    else if (club) { regsSql = `${REG_SELECT} JOIN events e ON e.event_id = r.event_id WHERE e.club_id = $1`; regParams = [club.club_id]; }

    const [clubs, events, regs, users] = await Promise.all([
      db.query(`${CLUB_SELECT} ORDER BY c.name`),
      db.query(eventsSql, eventParams),
      regsSql ? db.query(regsSql, regParams) : [],
      role === ROLES.ADMIN ? db.query('SELECT * FROM users ORDER BY name') : [],
    ]);
    return { data: { clubs: clubs.map(clubOut), events: events.map(eventOut), registrations: regs.map(regOut), users: users.map(userOut) } };
  });

  // ---------- registrations ----------
  route('POST', '/api/events/:id/registrations', async ({ user, params }) => {
    requireRole(user, ROLES.STUDENT);
    const event = await one('SELECT * FROM events WHERE event_id = $1', [params.id]);
    if (!event) throw new HttpError(404, 'Event not found.');
    if (event.status === EVENT_STATUS.PENDING) throw bad('This event is waiting for admin approval.');
    if (event.status === EVENT_STATUS.REJECTED) throw bad('This event was not approved.');
    if (isPast(event.event_date, event.event_time)) throw bad('This event has already taken place.');
    if (await one('SELECT registration_id FROM registrations WHERE event_id = $1 AND student_id = $2', [event.event_id, user.user_id])) throw new HttpError(409, 'You are already registered for this event.');
    const id = makeId('r');
    // One atomic statement: inserts only while seats remain, so two students can't take the last seat.
    const res = await db.run(
      `INSERT INTO registrations (registration_id, event_id, student_id, registration_date, attendance)
       SELECT CAST($1 AS TEXT), CAST($2 AS TEXT), CAST($3 AS TEXT), CAST($4 AS TEXT), CAST($5 AS TEXT)
       WHERE (SELECT COUNT(*) FROM registrations WHERE event_id = $2) < (SELECT capacity FROM events WHERE event_id = $2)`,
      [id, event.event_id, user.user_id, todayISO(), ATTENDANCE.ABSENT]
    );
    if (res.rowCount === 0) throw new HttpError(409, 'This event is full.');
    return { status: 201, data: { registration: { registrationId: id, eventId: event.event_id } } };
  });

  route('DELETE', '/api/registrations/:id', async ({ user, params }) => {
    requireRole(user, ROLES.STUDENT);
    const reg = await one('SELECT r.*, e.event_date, e.event_time FROM registrations r JOIN events e ON e.event_id = r.event_id WHERE r.registration_id = $1', [params.id]);
    if (!reg || reg.student_id !== user.user_id) throw new HttpError(404, 'Registration not found.');
    if (isPast(reg.event_date, reg.event_time)) throw bad("Registrations for past events can't be cancelled.");
    await db.run('DELETE FROM registrations WHERE registration_id = $1', [params.id]);
    return { data: { ok: true } };
  });

  route('PATCH', '/api/registrations/:id/attendance', async ({ user, params, body }) => {
    const reg = await one('SELECT * FROM registrations WHERE registration_id = $1', [params.id]);
    if (!reg) throw new HttpError(404, 'That registration no longer exists.');
    await ownedEvent(user, reg.event_id);
    if (![ATTENDANCE.PRESENT, ATTENDANCE.ABSENT].includes(body.attendance)) throw bad('Choose Present or Absent.');
    await db.run('UPDATE registrations SET attendance = $1 WHERE registration_id = $2', [body.attendance, params.id]);
    return { data: { registration: { registrationId: params.id, attendance: body.attendance } } };
  });

  // ---------- events ----------
  route('POST', '/api/events', async ({ user, body }) => {
    requireRole(user, ROLES.ORGANIZER);
    const club = await clubOfOrganizer(user);
    if (!club) throw bad('No club is assigned to your account. Ask an administrator.');
    firstError(validateEvent(body, { requireFuture: false }));
    futureCheck(body.date, body.time);
    const id = makeId('e');
    await db.run('INSERT INTO events (event_id, club_id, title, description, event_date, event_time, location, capacity, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [id, club.club_id, body.title.trim(), body.description.trim(), body.date, body.time, body.location.trim(), Number(body.capacity), EVENT_STATUS.PENDING]);
    return { status: 201, data: { event: await getEventOut(id) } };
  });

  route('PUT', '/api/events/:id', async ({ user, params, body }) => {
    const event = await ownedEvent(user, params.id);
    firstError(validateEvent(body, { requireFuture: false }));
    if (body.date !== event.event_date || body.time !== event.event_time) futureCheck(body.date, body.time);
    const registered = (await one('SELECT CAST(COUNT(*) AS INTEGER) AS n FROM registrations WHERE event_id = $1', [params.id])).n;
    if (Number(body.capacity) < registered) throw bad(`Capacity can't be lower than the ${registered} students already registered.`);
    const status = event.status === EVENT_STATUS.REJECTED ? EVENT_STATUS.PENDING : event.status; // resubmission
    await db.run('UPDATE events SET title=$1, description=$2, event_date=$3, event_time=$4, location=$5, capacity=$6, status=$7 WHERE event_id=$8',
      [body.title.trim(), body.description.trim(), body.date, body.time, body.location.trim(), Number(body.capacity), status, params.id]);
    return { data: { event: await getEventOut(params.id) } };
  });

  route('DELETE', '/api/events/:id', async ({ user, params }) => {
    const event = await ownedEvent(user, params.id);
    const removed = (await one('SELECT CAST(COUNT(*) AS INTEGER) AS n FROM registrations WHERE event_id = $1', [params.id])).n;
    await db.run('DELETE FROM events WHERE event_id = $1', [params.id]); // registrations cascade
    return { data: { event: { eventId: event.event_id, title: event.title }, removedRegistrations: removed } };
  });

  route('PATCH', '/api/events/:id/status', async ({ user, params, body }) => {
    requireRole(user, ROLES.ADMIN);
    const event = await one('SELECT * FROM events WHERE event_id = $1', [params.id]);
    if (!event) throw new HttpError(404, 'Event not found.');
    if (event.status !== EVENT_STATUS.PENDING) throw bad('Only pending events can be approved or rejected.');
    if (![EVENT_STATUS.APPROVED, EVENT_STATUS.REJECTED].includes(body.status)) throw bad('Choose Approved or Rejected.');
    await db.run('UPDATE events SET status = $1 WHERE event_id = $2', [body.status, params.id]);
    return { data: { event: await getEventOut(params.id) } };
  });

  // ---------- clubs ----------
  async function checkOrganizer(organizerId, clubId) {
    if (!organizerId) return;
    const u = await one('SELECT * FROM users WHERE user_id = $1', [organizerId]);
    if (!u || u.role !== ROLES.ORGANIZER) throw bad('The selected organizer is not a Club Organizer account.');
    const other = await one('SELECT club_id FROM clubs WHERE organizer_id = $1', [organizerId]);
    if (other && other.club_id !== clubId) throw bad('That organizer already manages another club.');
  }

  route('POST', '/api/clubs', async ({ user, body }) => {
    requireRole(user, ROLES.ADMIN);
    firstError(validateClub(body));
    const organizerId = body.organizerId || null;
    await checkOrganizer(organizerId, null);
    const status = Object.values(CLUB_STATUS).includes(body.status) ? body.status : CLUB_STATUS.ACTIVE;
    const id = makeId('c');
    await db.run('INSERT INTO clubs (club_id, name, description, category, status, organizer_id) VALUES ($1,$2,$3,$4,$5,$6)',
      [id, body.name.trim(), body.description.trim(), body.category, status, organizerId]);
    return { status: 201, data: { club: await getClubOut(id) } };
  });

  route('PUT', '/api/clubs/:id', async ({ user, params, body }) => {
    requireRole(user, ROLES.ADMIN, ROLES.ORGANIZER);
    const club = await one('SELECT * FROM clubs WHERE club_id = $1', [params.id]);
    if (!club) throw new HttpError(404, 'Club not found.');
    const next = { name: club.name, description: club.description, category: club.category, status: club.status, organizerId: club.organizer_id };
    for (const k of ['name', 'description', 'category']) if (body[k] !== undefined) next[k] = body[k];
    if (user.role === ROLES.ORGANIZER) {
      if (club.organizer_id !== user.user_id) throw new HttpError(403, 'You can only edit your own club.');
    } else {
      if (body.status !== undefined) next.status = body.status;
      if (body.organizerId !== undefined) next.organizerId = body.organizerId || null;
      if (!Object.values(CLUB_STATUS).includes(next.status)) throw bad('Choose a valid status.');
      await checkOrganizer(next.organizerId, params.id);
    }
    firstError(validateClub(next));
    await db.run('UPDATE clubs SET name=$1, description=$2, category=$3, status=$4, organizer_id=$5 WHERE club_id=$6',
      [next.name.trim(), next.description.trim(), next.category, next.status, next.organizerId, params.id]);
    return { data: { club: await getClubOut(params.id) } };
  });

  route('DELETE', '/api/clubs/:id', async ({ user, params }) => {
    requireRole(user, ROLES.ADMIN);
    const club = await one('SELECT * FROM clubs WHERE club_id = $1', [params.id]);
    if (!club) throw new HttpError(404, 'Club not found.');
    const removedEvents = (await one('SELECT CAST(COUNT(*) AS INTEGER) AS n FROM events WHERE club_id = $1', [params.id])).n;
    await db.run('DELETE FROM clubs WHERE club_id = $1', [params.id]); // events + registrations cascade
    return { data: { club: { clubId: club.club_id, name: club.name }, removedEvents } };
  });

  // ---------- users (admin) ----------
  async function targetUser(user, id, verb) {
    requireRole(user, ROLES.ADMIN);
    if (id === user.user_id) throw bad(`You can't ${verb} your own account.`);
    const target = await one('SELECT * FROM users WHERE user_id = $1', [id]);
    if (!target) throw new HttpError(404, 'User not found.');
    return target;
  }

  route('PATCH', '/api/users/:id', async ({ user, params, body }) => {
    const target = await targetUser(user, params.id, body.role !== undefined ? 'change the role of' : 'disable');
    if (body.role !== undefined) {
      if (!Object.values(ROLES).includes(body.role)) throw bad('Choose a valid role.');
      await db.run('UPDATE users SET role = $1 WHERE user_id = $2', [body.role, target.user_id]);
      if (body.role !== ROLES.ORGANIZER) await db.run('UPDATE clubs SET organizer_id = NULL WHERE organizer_id = $1', [target.user_id]);
      if (body.role !== ROLES.STUDENT) await db.run('DELETE FROM registrations WHERE student_id = $1', [target.user_id]);
    }
    if (body.status !== undefined) {
      if (!Object.values(USER_STATUS).includes(body.status)) throw bad('Choose a valid status.');
      await db.run('UPDATE users SET status = $1 WHERE user_id = $2', [body.status, target.user_id]);
    }
    return { data: { user: userOut(await one('SELECT * FROM users WHERE user_id = $1', [target.user_id])) } };
  });

  route('DELETE', '/api/users/:id', async ({ user, params }) => {
    const target = await targetUser(user, params.id, 'delete');
    await db.run('DELETE FROM users WHERE user_id = $1', [target.user_id]); // registrations cascade, clubs un-assigned
    return { data: { user: userOut(target) } };
  });

  // ---------- admin: system info + demo reset ----------
  route('GET', '/api/system', async ({ user }) => {
    requireRole(user, ROLES.ADMIN);
    const n = async (t) => (await one(`SELECT CAST(COUNT(*) AS INTEGER) AS n FROM ${t}`)).n;
    return { data: {
      database: db.kind, nodeVersion: process.version, serverTime: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()), demoResetEnabled: process.env.DEMO_RESET !== 'off',
      counts: { users: await n('users'), clubs: await n('clubs'), events: await n('events'), registrations: await n('registrations') },
    } };
  });

  route('POST', '/api/admin/reset', async ({ user }) => {
    requireRole(user, ROLES.ADMIN);
    if (process.env.DEMO_RESET === 'off') throw new HttpError(403, 'Demo reset is disabled on this server.');
    await seedDatabase(db);
    return { data: { ok: true } };
  });

  // ---------- request handling ----------
  async function currentUser(req) {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return null;
    const payload = verifyToken(header.slice(7));
    const user = payload ? await one('SELECT * FROM users WHERE user_id = $1', [payload.sub]) : null;
    if (!user || user.status === USER_STATUS.DISABLED) throw new HttpError(401, 'Your session has expired. Please log in again.');
    return user;
  }

  function readBody(req) {
    return new Promise((resolve, reject) => {
      let size = 0; const chunks = [];
      req.on('data', (c) => { size += c.length; if (size > 100_000) { reject(new HttpError(413, 'Request too large.')); req.destroy(); } else chunks.push(c); });
      req.on('end', () => {
        if (!chunks.length) return resolve({});
        try { resolve(JSON.parse(Buffer.concat(chunks).toString())); } catch { reject(bad('Invalid JSON in request.')); }
      });
      req.on('error', reject);
    });
  }

  const send = (res, status, data, extra = {}) => {
    const body = JSON.stringify(data);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra });
    res.end(body);
  };

  const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.json': 'application/json', '.woff2': 'font/woff2', '.txt': 'text/plain' };
  function serveStatic(req, res, url) {
    if (!fs.existsSync(path.join(DIST, 'index.html'))) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Frontend not built yet. Run "npm run build" (the API is available under /api).');
    }
    let file = path.join(DIST, decodeURIComponent(url.pathname));
    if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html');
    const ext = path.extname(file);
    const cache = file.includes(`${path.sep}assets${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache';
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': cache, 'X-Content-Type-Options': 'nosniff' });
    fs.createReadStream(file).pipe(res);
  }

  return async function handle(req, res) {
    const cors = { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS' };
    try {
      const url = new URL(req.url, 'http://localhost');
      if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
      if (!url.pathname.startsWith('/api/')) return serveStatic(req, res, url);
      for (const r of routes) {
        if (r.method !== req.method) continue;
        const m = r.re.exec(url.pathname);
        if (!m) continue;
        const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
        const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readBody(req) : {};
        const user = await currentUser(req);
        const out = await r.handler({ req, user, params, body });
        return send(res, out.status || 200, out.data, cors);
      }
      throw new HttpError(404, 'Not found.');
    } catch (err) {
      if (err instanceof HttpError) return send(res, err.status, { error: err.message }, cors);
      console.error(err);
      return send(res, 500, { error: 'Something went wrong on the server. Please try again.' }, cors);
    }
  };
}
