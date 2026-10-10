# CampusConnect

**University Club & Event Management System** - a frontend demo for the University of Information Technology & Sciences (UITS).

CampusConnect lets students discover clubs and register for events, lets club organizers create events and record attendance, and lets administrators approve events and manage users and clubs.

> **This is a frontend-only demo.** There is no backend and no real database. All data is stored in your browser's `localStorage`, and the login is a demo simulation that is **not secure**. See [Demo limitations](#10-important-frontend-only--demo-limitations).

---

## 1. Project objectives

- Replace scattered posters and chat groups with one place to find clubs and events.
- Give organizers a simple way to publish events, see who registered and record attendance.
- Give administrators control over which events go public.
- Practise the analysis and design work from the course (roles, ER model, use cases) in a working prototype.

## 2. Main features

**Public:** home page, browse and search clubs, browse events with search and filters (club, upcoming/past), club details, event details.
**Student:** register and log in, register for and cancel event registrations, registration history with status, dashboard.
**Club Organizer:** dashboard with attendance summary, edit own club, create / edit / delete own events, view participants, mark Present or Absent.
**Admin:** dashboard and system information, manage users (role, enable/disable, delete), manage clubs (add, edit, activate, delete, assign organizer), approve or reject pending events, **Reset Demo Data**.

**Business rules enforced:** no duplicate registration; no registration for pending, rejected, full or past events; students cancel only their own upcoming registrations; organizers manage only their club's events and participants; only admins approve or reject; attendance only for existing registrations; deleting an event deletes its registrations; validated dates, capacities and emails.

## 3. User roles

| Role | Can do |
|---|---|
| Student | Browse, register for events, cancel, view own registrations |
| Club Organizer | Manage assigned club, own events, participants and attendance |
| Admin | Manage users and clubs, approve or reject events |

Admins approve **events**, not clubs.

## 4. Technology stack

React 18, Vite 5, JavaScript (ES modules), React Router 6 (`HashRouter`), Lucide React icons, plain CSS, browser `localStorage`. All free and open source; no API keys.

## 5. System architecture

```
UI pages & components  ->  Contexts (AuthContext, AppDataContext)  ->  Services  ->  storage.js (localStorage)
```

- **Pages/components** never call `localStorage`. They call service functions through the contexts.
- **`AppDataContext`** holds the data in React state and exposes `act(fn, successMessage)`, which runs a service mutation, saves it, and shows a toast (including readable error messages from business rules).
- **Services** (`src/services`) contain all business rules and permission checks. Mutations are pure: `(db, actor, ...args) => ({ db, result })`, throwing an `Error` with a readable message when a rule is broken.
- **`storage.js`** is the only file that touches `localStorage` (keys `campusconnect_demo_v1` and `campusconnect_session_v1`). It handles missing, corrupted or outdated data by re-seeding.
- **Why `HashRouter`?** Pages are served as `/#/events`, so refreshing or sharing a link works on any static host (including GitHub Pages) without server rewrite rules.

### Data model (matches the ER diagram)

| Entity | Fields |
|---|---|
| USER | `user_id`, `name`, `email`, `password` (demo only), `role` |
| CLUB | `club_id`, `name`, `description`, `category`, `status`, `organizer_id` |
| EVENT | `club_id`, `event_id`, `title`, `description`, `date`, `time`, `location`, `capacity`, `status` |
| REGISTRATION | `registration_id`, `event_id`, `student_id`, `registration_date`, `attendance` |

In JavaScript these are camelCase (`userId`, `clubId`, `organizerId`, ...). Notes on small, documented choices:
- USER also has a `status` (`Active`/`Disabled`) so admins can disable accounts. This is an extra column to add to the ER diagram if you want to keep them identical.
- `attendance` is `Present` or `Absent`; new registrations start as `Absent` until the organizer marks them.
- Editing a **Rejected** event re-submits it as **Pending**. Editing an **Approved** event keeps it Approved.

## 6. Project folder structure

```
CampusConnect/
├── index.html
├── package.json
├── vite.config.js
├── .github/workflows/deploy.yml     optional GitHub Pages deployment
├── docs/screenshots/                put your screenshots here
└── src/
    ├── main.jsx, App.jsx            entry point, providers and routes
    ├── components/                  Button, StatusBadge, StatCard, SearchInput, ConfirmDialog,
    │                                Modal, Toast, Navbar, Sidebar, Footer, EventCard, ClubCard,
    │                                EventForm, ClubForm, Field, EmptyState, PageHeader, RequireRole
    ├── layouts/                     PublicLayout, DashboardLayout
    ├── pages/                       Home, Clubs, ClubDetails, Events, EventDetails, Login, Register, NotFound
    │   ├── student/  organizer/  admin/
    ├── context/                     AuthContext, AppDataContext
    ├── services/                    authService, userService, clubService, eventService,
    │                                registrationService, permissions, storage, apiConfig
    ├── data/initialData.js          sample data (relative to today's date)
    ├── utils/                       constants, validation, formatters
    └── styles/                      global.css, components.css
```

## 7. Installation and run

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev        # start the development server (http://localhost:5173)
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## 8. Demo credentials

| Role | Email | Password |
|---|---|---|
| Student | `student@campusconnect.demo` | `Demo123!` |
| Club Organizer | `organizer@campusconnect.demo` (Programming & Robotics Club) | `Demo123!` |
| Admin | `admin@campusconnect.demo` | `Demo123!` |

Other organizers (all use `Demo123!`): `culture.organizer@`, `debate.organizer@`, `photo.organizer@` + `campusconnect.demo`.
The Login page has a **Demo access** panel with "Fill in" buttons. You can also register a new student account. These are fictional accounts with a mock password, not real credentials.

To restore the sample data: log in as admin, open the dashboard, and use **Reset demo data**.

## 9. Suggested demo walkthrough

1. As **student**: open an event, register, see it on *My registrations*, cancel it. Try the full event "Folk Music Open Mic" (registration is blocked).
2. As **organizer**: create an event (it shows as *Pending*), edit it, open *Participants* on "Intro to Web Development Workshop" and mark attendance.
3. As **admin**: open *Event approvals*, approve or reject the pending event, then check it from the student's view.

## 10. Important frontend-only / demo limitations

- **No backend, no real database.** Data lives in `localStorage` of one browser; it is not shared between users or devices, and clearing site data removes it (Reset Demo Data restores the samples).
- **Authentication is simulated.** Demo passwords are stored unencrypted in `localStorage` and compared in the browser. This is **not secure** and must not be used in production. Do not enter a real password.
- **Authorization is browser-side.** Role and ownership checks hide pages and block actions in the UI/service layer, but anyone with browser developer tools can bypass them. A real backend must enforce them on the server.
- Sample dates are generated relative to the day the data is created, so events stay "upcoming" when you first run the app.
- Not included by design: payments, QR attendance, chat, notifications, certificates, analytics, mobile apps.

## 11. Current project status

Frontend MVP implemented for all three roles and all required pages. Automated checks done during development: source syntax check, import/export resolution check, and 59 checks of the business rules against the service layer. **Not yet done:** browser testing on real devices, screenshots, and connection to a backend. Run `npm run build` once after cloning and report any error.

## 12. Team

**Team Dooms**, Batch 4B

| Name | ID |
|---|---|
| Forhad Hossen | 4326205101114 |
| Rupok | 4324205101094 |

## 13. Course information

University of Information Technology & Sciences (UITS)
Course: Software Engineering and System Analysis Lab
Instructor: Rafat Ara

## 14. Screenshots

Screenshots are not committed yet because they have to be taken from the running site. Capture them following [`docs/screenshots/README.md`](docs/screenshots/README.md) using these file names:

`01-homepage.png`, `02-clubs.png`, `03-event-details.png`, `04-student-dashboard.png`, `05-organizer-dashboard.png`, `06-attendance.png`, `07-admin-dashboard.png`, `08-event-approval.png`

After the files exist in `docs/screenshots/`, add them here, for example:

```markdown
![Homepage](docs/screenshots/01-homepage.png)
![Event approval](docs/screenshots/08-event-approval.png)
```

## 15. Deployment (free frontend hosting)

### Option A - GitHub Pages (included workflow)

1. Create a **public** repository named `CampusConnect` and push the project to the `main` branch.
2. In the repository: **Settings -> Pages -> Source: GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` runs `npm install` and `npm run build` and publishes `dist/`.
4. The site appears at `https://<your-username>.github.io/CampusConnect/`.

Configuration already done: `vite.config.js` uses `base: './'`, and the app uses `HashRouter`, so page refreshes and direct links work on GitHub Pages without extra redirect files.

Limitations: GitHub Pages hosts **static files only**, so it can host this frontend but never a Node/Express server or a database. Free Pages for a private repository depends on your GitHub plan; check GitHub's current terms.

### Option B - other free static hosts

Netlify, Cloudflare Pages and Vercel all offer free tiers for static sites. Connect the repository and use build command `npm run build` and output directory `dist`. Free tiers and limits can change, so check each provider's current terms; none of this is guaranteed to stay free.

### Frontend hosting vs. future backend hosting

Hosting the frontend (above) is separate from hosting a backend. When the Express API and PostgreSQL database exist, they must be hosted elsewhere (a Node host plus a managed or self-hosted database). Free tiers for those usually have limits, may sleep when idle, and some require a card, so decide that when you reach that stage.

## 16. Future backend integration plan

Planned stack: **React frontend -> REST API -> Node.js/Express -> PostgreSQL.**

All data access already goes through `src/services`. Today every service function uses `localStorage` through `services/storage.js`. To integrate a backend, replace the function bodies (keeping names and return shapes) with `fetch()` calls to `API_BASE_URL` (see `src/services/apiConfig.js`, set `VITE_API_BASE_URL`; copy `.env.example` to `.env`).

| Service function(s) | Now | Future REST call |
|---|---|---|
| `authService.login` / `registerStudent` / `logout` | localStorage + demo session | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout` (JWT or session cookie, hashed passwords) |
| `userService.*` | localStorage | `GET /users`, `PATCH /users/:id/role`, `PATCH /users/:id/status`, `DELETE /users/:id` |
| `clubService.*` | localStorage | `GET/POST /clubs`, `GET/PUT/DELETE /clubs/:id` |
| `eventService.*` | localStorage | `GET/POST /events`, `GET/PUT/DELETE /events/:id`, `PATCH /events/:id/status` |
| `registrationService.*` | localStorage | `POST/DELETE /events/:id/registrations`, `GET /events/:id/participants`, `PATCH /registrations/:id/attendance` |

Steps: (1) create the PostgreSQL tables `users`, `clubs`, `events`, `registrations` from the ER diagram; (2) build the Express routes and move every rule in `services/permissions.js` and the services to the server; (3) make service functions `async` and update `AppDataContext` to load data from the API instead of holding the whole database in memory; (4) remove demo passwords and the Reset Demo Data tool.
