# CampusConnect

**University Club & Event Management System** for the University of Information Technology & Sciences (UITS).

Students discover clubs and register for events, club organizers create events and record attendance, and administrators approve events and manage users and clubs. This is a complete full-stack project: **React frontend, Node.js REST API and a SQL database** (PostgreSQL in production).

**To deploy it and get a public link, follow [DEPLOY.md](DEPLOY.md)** (free, about 15 minutes).

---

## 1. Project objectives
- Replace scattered posters and chat groups with one place to find clubs and events.
- Give organizers a simple way to publish events, see who registered and record attendance.
- Give administrators control over which events become public.
- Apply the analysis and design work from the course (roles, ER model, use cases) in a working system.

## 2. Main features
**Public:** home page, browse and search clubs, browse events with search and filters, club details, event details.
**Sign up:** choose your role at registration, **Student** or **Club Organizer** (Admin accounts cannot be self-selected).
**Student:** register for / cancel event registrations, registration history with status, dashboard.
**Club Organizer:** dashboard with attendance summary, edit own club, create / edit / delete own events, view participants, mark Present or Absent.
**Admin:** dashboard and system information, manage users (role, enable/disable, delete), manage clubs (add, edit, activate, delete, assign organizer), approve or reject pending events, Reset Demo Data.

**Rules enforced on the server:** no duplicate registration; no registration for pending, rejected, full or past events (the last seat is claimed atomically, so two students can't both get it); students cancel only their own upcoming registrations; organizers manage only their own club's events and participants; only admins approve or reject; attendance only for existing registrations; deleting an event deletes its registrations; validated dates, capacities and emails.

## 3. User roles
| Role | How you get it | Can do |
|---|---|---|
| Student | Pick it at sign up | Browse, register for events, cancel, view own registrations |
| Club Organizer | Pick it at sign up; an admin then assigns a club | Manage assigned club, own events, participants and attendance |
| Admin | Created by the system (demo account) or promoted by another admin | Manage users and clubs, approve or reject events |

## 4. Technology stack
React 18, Vite 5, React Router 6, Lucide icons, plain CSS | Node.js 22 (built-in `http`, no framework) | PostgreSQL via `pg` (production) or SQLite via Node's built-in `node:sqlite` (local development) | scrypt password hashing and signed (HS256) login tokens using Node's built-in `crypto`. All free and open source.

## 5. System architecture
```
Browser (React)  --HTTPS/JSON-->  Node.js REST API (server/)  -->  PostgreSQL
   src/pages                          routes, rules, permissions       users, clubs,
   src/services (API client)          password hashing, tokens         events, registrations
```
- **Frontend** (`src/`): pages and components call service functions (`src/services`), which call the REST API through one fetch wrapper (`services/api.js`). Nothing in the UI talks to the database or stores data itself.
- **Backend** (`server/`): `app.js` holds every route, permission check and business rule. `db.js` is a small adapter so the same SQL runs on PostgreSQL and SQLite. `schema.js` creates the tables, `seed.js` loads realistic sample data on first start.
- **One deployable service:** in production the Node server also serves the built React files, so there is a single link and no CORS setup.
- **Shared rules:** form validation code in `src/utils/validation.js` is used by both the browser (instant messages) and the server (the real check).
- **Data scoping:** `GET /api/data` returns only what the caller's role may see: the public sees approved events only, students see only their own registrations, organizers see their club's events and participants, admins see everything.

### Database (matches the ER diagram)
| Table | Columns |
|---|---|
| `users` | `user_id`, `name`, `email` (unique), `password_hash`, `role`, `status`, `created_at` |
| `clubs` | `club_id`, `name`, `description`, `category`, `status`, `organizer_id` |
| `events` | `event_id`, `club_id`, `title`, `description`, `event_date`, `event_time`, `location`, `capacity`, `status` |
| `registrations` | `registration_id`, `event_id`, `student_id`, `registration_date`, `attendance`, unique (`event_id`, `student_id`) |

Small, documented choices: `users.status` (Active/Disabled) and `users.created_at` are extra columns beyond the ER diagram, so admins can disable accounts. `attendance` is Present or Absent; new registrations start as Absent until the organizer marks them. Editing a Rejected event re-submits it as Pending.

### REST API
| Method and path | Who | Purpose |
|---|---|---|
| `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/me` | public / logged in | Sign up (with role), log in, current user |
| `GET /api/data` | everyone (scoped by role) | Clubs, events, registrations visible to the caller |
| `POST /api/events/:id/registrations`, `DELETE /api/registrations/:id` | student | Register / cancel |
| `PATCH /api/registrations/:id/attendance` | organizer (own event) | Present / Absent |
| `POST /api/events`, `PUT/DELETE /api/events/:id` | organizer (own club) | Create, edit, delete events |
| `PATCH /api/events/:id/status` | admin | Approve / reject |
| `POST /api/clubs`, `PUT/DELETE /api/clubs/:id` | admin (organizer may PUT own club) | Manage clubs |
| `PATCH/DELETE /api/users/:id` | admin | Change role/status, delete |
| `GET /api/system`, `POST /api/admin/reset` | admin | System info, reset demo data |
| `GET /api/health` | anyone | Health check |

## 6. Project folder structure
```
CampusConnect/
├── DEPLOY.md, render.yaml         deployment guide and Render blueprint
├── package.json, vite.config.js, index.html
├── scripts/dev.mjs                runs API + Vite together for local development
├── server/
│   ├── index.js                   starts the server, creates tables, seeds sample data
│   ├── app.js                     routes, permissions, business rules, static file serving
│   ├── db.js, schema.js, seed.js  database adapter, tables, sample data
│   ├── auth.js, time.js           password hashing + tokens, campus time zone handling
└── src/                           React app
    ├── components/, layouts/, pages/{student,organizer,admin}/
    ├── context/                   AuthContext, AppDataContext
    ├── services/                  api.js + auth/user/club/event/registration services
    ├── utils/                     constants, validation (shared with server), formatters
    └── styles/
```

## 7. Run it locally
Requires Node.js 22 or newer. No database install needed (a SQLite file is created in `data/`).
```bash
npm install
npm run dev        # website: http://localhost:5173   API: http://localhost:5000
```
Production-style (single server): `npm run build` then `npm start`, open http://localhost:5000.

## 8. Demo credentials
| Role | Email | Password |
|---|---|---|
| Student | `student@campusconnect.demo` | `Demo123!` |
| Club Organizer | `organizer@campusconnect.demo` (Programming & Robotics Club) | `Demo123!` |
| Admin | `admin@campusconnect.demo` | `Demo123!` |

Other sample organizers (same password): `culture.organizer@`, `debate.organizer@`, `photo.organizer@` + `campusconnect.demo`. These are public sample accounts. You can also sign up with your own account and pick Student or Club Organizer.

## 9. Suggested demo walkthrough
1. **Sign up** a new account as *Club Organizer*. Note that you have no club yet.
2. Log in as **admin**, open *Clubs*, edit a club (or add one) and assign your new organizer. Open *Event approvals* to review the pending events.
3. Log in as your new **organizer**, create an event (it shows as *Pending*).
4. As **admin**, approve it. As **student**, register for it, then cancel. Try the full event "Folk Music Open Mic".
5. As **organizer**, open *Participants* on "Intro to Web Development Workshop" and mark attendance.

## 10. Limitations (be honest in your presentation)
- This is a student MVP, not a hardened production system. There is no email verification, password reset, or audit logging.
- Demo accounts have a public password. Anyone who knows the link can log in with them, and the admin demo account can change or reset data. For a public deployment you can set `DEMO_RESET=off`.
- Login tokens are stored in the browser's `localStorage` and are valid for 7 days. Logging out removes them from that browser but they cannot be revoked server-side (disabling or deleting the account does block them).
- Free hosting sleeps when idle (first load can take up to a minute) and free database tiers have storage limits. Check the providers' current terms.
- Local development uses SQLite while production uses PostgreSQL. The SQL is kept compatible with both, but the automated tests were run against SQLite; do a quick walkthrough on the deployed site.

## 11. Current project status
Implemented: all pages for the three roles, role selection at sign up, REST API, SQL database with seed data, server-side permissions and rules. Automated checks run during development: 80 end-to-end API tests and 22 client-to-API integration tests (on SQLite), plus syntax/import checks. **Not verified by me:** the production build (`vite build`), rendering in a browser, and a live PostgreSQL deployment. Run through the demo walkthrough once after deploying.

## 12. Team
**Team Dooms**, Batch 4B: Forhad Hossen (ID 4326205101114), Rupok (ID 4324205101094)

## 13. Course information
University of Information Technology & Sciences (UITS), Software Engineering and System Analysis Lab. Instructor: Rafat Ara.

## 14. Screenshots
Take them from the running or deployed site and save them in `docs/screenshots/` (see `docs/screenshots/README.md` for the list and file names). Then embed them here:
```markdown
![Homepage](docs/screenshots/01-homepage.png)
```

## 15. Future improvements
Email verification and password reset, refresh tokens or cookies for sessions, pagination for large lists, file uploads for club logos, automated browser tests.
