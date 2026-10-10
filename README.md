 <p align="center">
  <img src="https://img.shields.io/badge/PROJECT-CampusConnect-4F46E5?style=for-the-badge" alt="CampusConnect Project" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Status-Frontend%20MVP-16A34A?style=for-the-badge" alt="Frontend MVP" />
</p>

<h1 align="center">🎓 CampusConnect</h1>

<h3 align="center">One Campus. Every Club. Every Event.</h3>

<p align="center">
  A university club and event management platform designed to connect students, empower club organizers, and simplify campus event administration at the University of Information Technology & Sciences (UITS).
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-demo-accounts">Demo Accounts</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Project Objectives](#-project-objectives)
- [Features](#-features)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Database Design](#-database-design)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Demo Accounts](#-demo-accounts)
- [Demo Walkthrough](#-demo-walkthrough)
- [Business Rules](#-business-rules)
- [Deployment](#-deployment)
- [Future Backend Integration](#-future-backend-integration)
- [Limitations and Security](#-limitations-and-security)
- [Project Status](#-project-status)
- [Team Members](#-team-members)
- [Course Information](#-course-information)

---

## 📖 About the Project

**CampusConnect** is a frontend prototype of a centralized university club and event management system developed for the University of Information Technology & Sciences (UITS).

University clubs and events are often announced through scattered posters, social media posts, and messaging groups. Finding relevant events, managing registrations, tracking attendance, and obtaining event approval can become unnecessarily complicated.

CampusConnect brings these activities together in one platform.

Students can explore clubs, discover events, and manage their registrations. Club organizers can manage their assigned clubs, publish events, and record attendance. Administrators can manage users and clubs while reviewing events before publication.

The project demonstrates role-based interfaces, reusable React components, centralized state management, service-layer business rules, and browser-based data persistence.

> **Project scope:** CampusConnect is currently a frontend-only demonstration. It does not yet include a production backend or a real database.

## 🎯 Project Objectives

- Create a centralized platform for university clubs and events.
- Make it easier for students to discover campus activities.
- Simplify event creation, registration, and attendance tracking.
- Introduce an event approval workflow for administrators.
- Apply software engineering principles, including modular architecture, role-based access, data modeling, validation, and separation of concerns.
- Develop a functional prototype that can be extended with a backend in the future.

## ✨ Features

### 🌐 Public Features

- Modern home page and navigation.
- Browse and search university clubs.
- View club descriptions and details.
- Browse events and search for relevant activities.
- Filter events by club and upcoming or past status.
- View event details, schedules, locations, and available capacity.

### 🎓 Student Dashboard

- Register for a student account and log in.
- Browse approved events.
- Register for available events.
- Cancel personal registrations for upcoming events.
- View registration history and attendance status.
- Access a dedicated student dashboard.

### 🏛️ Club Organizer Dashboard

- View an organizer dashboard and attendance summary.
- Manage the assigned club's information.
- Create, edit, and delete events belonging to the assigned club.
- Submit new events for administrative approval.
- View event participants.
- Mark registered participants as Present or Absent.

### 🛡️ Admin Dashboard

- View system information and dashboard statistics.
- Manage users and their roles.
- Enable or disable user accounts.
- Delete users.
- Create, edit, activate, and delete clubs.
- Assign organizers to clubs.
- Approve or reject pending events.
- Reset demo data to its initial state.

### ⚙️ Additional Features

- Role-specific navigation and dashboards.
- Reusable UI components and forms.
- Form validation and readable error messages.
- Confirmation dialogs for important actions.
- Toast notifications for successful actions and errors.
- Centralized service functions for business rules.
- Browser `localStorage` persistence.
- Demo data that can be restored when needed.
- Hash-based routing suitable for static hosting.

## 👥 User Roles

| Role | Main Responsibilities |
|---|---|
| **Student** | Discover clubs and events, register for events, cancel registrations, and view personal registration history. |
| **Club Organizer** | Manage an assigned club, create and maintain events, view participants, and record attendance. |
| **Administrator** | Manage users and clubs, assign organizers, and approve or reject events. |

**Important:** Administrators approve or reject events, not clubs.

## 📸 Screenshots

The following screenshots illustrate the public interface, student experience, club organizer dashboard, and administrative interface.

### 🌐 Public Interface

<details open>
<summary><strong>View public pages and event management screens</strong></summary>

**Application Overview**

![CampusConnect Application Overview](https://github.com/user-attachments/assets/e5a26a60-d3c5-4218-ae5f-2b4b90e81917)

**Public Interface — Screen 2**

![CampusConnect Public Interface 2](https://github.com/user-attachments/assets/4cd0fb1d-95a5-405a-9715-cdbb28f673c1)

**Public Interface — Screen 3**

![CampusConnect Public Interface 3](https://github.com/user-attachments/assets/6c17e38c-c5ea-4bd2-8f81-814b27f00001)

**Public Interface — Screen 4**

![CampusConnect Public Interface 4](https://github.com/user-attachments/assets/3daf9774-9bb9-4f22-9d12-8bea18638ff2)

**Public Interface — Screen 5**

![CampusConnect Public Interface 5](https://github.com/user-attachments/assets/a0c6de15-aec9-452e-abc1-2f386944f8db)

**Public Interface — Screen 6**

![CampusConnect Public Interface 6](https://github.com/user-attachments/assets/3a0ce78a-72cb-41d3-a5f2-9d0bb8fcb8a2)

**Public Interface — Screen 7**

![CampusConnect Public Interface 7](https://github.com/user-attachments/assets/eba60352-8869-423e-9ea3-8476700c2d5d)

**Public Interface — Screen 8**

![CampusConnect Public Interface 8](https://github.com/user-attachments/assets/c204c7d8-cfaf-4b0d-bfa7-04c31b25e796)

</details>

### 🎓 Student Experience

<details open>
<summary><strong>View student dashboard and registration screens</strong></summary>

**Student View — Screen 1**

![CampusConnect Student View 1](https://github.com/user-attachments/assets/99ca1c6e-099b-43f0-a0d0-77ecb047598e)

**Student View — Screen 2**

![CampusConnect Student View 2](https://github.com/user-attachments/assets/2708d4fe-329a-45bd-b756-4954521476ae)

</details>

### 🏛️ Club Organizer Dashboard

<details>
<summary><strong>View club management, events, and attendance screens</strong></summary>

**Organizer View — Screen 1**

![CampusConnect Organizer View 1](https://github.com/user-attachments/assets/274c93d2-80ae-4aa5-98b5-04db3db1c295)

**Organizer View — Screen 2**

![CampusConnect Organizer View 2](https://github.com/user-attachments/assets/e0943267-a96c-496b-bd5c-04db3db1c295)

**Organizer View — Screen 3**

![CampusConnect Organizer View 3](https://github.com/user-attachments/assets/caad6a9a-682f-47a2-b229-57cd79ab4287)

**Organizer View — Screen 4**

![CampusConnect Organizer View 4](https://github.com/user-attachments/assets/81d9d305-34e0-4b5f-bd60-723eb1c55486)

</details>

### 🛡️ Administrator Dashboard

<details>
<summary><strong>View administrative management and event approval screens</strong></summary>

**Admin View — Screen 1**

![CampusConnect Admin View 1](https://github.com/user-attachments/assets/5c1d4d33-d1f4-4d24-b5e5-ca987c441f6e)

**Admin View — Screen 2**

![CampusConnect Admin View 2](https://github.com/user-attachments/assets/87963d32-b24b-4af5-9f83-4521bd116d40)

**Admin View — Screen 3**

![CampusConnect Admin View 3](https://github.com/user-attachments/assets/1949ca1e-f89a-4d16-9f8c-0e5a159c8ed1)

**Admin View — Screen 4**

![CampusConnect Admin View 4](https://github.com/user-attachments/assets/5450ea9b-8101-42cd-8233-b08381108d24)

</details>

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| **React 18** | Component-based user interface |
| **Vite 5** | Development server and build tooling |
| **JavaScript (ES Modules)** | Application logic |
| **React Router 6** | Client-side navigation using `HashRouter` |
| **Lucide React** | Interface icons |
| **HTML5** | Application structure |
| **CSS3** | Styling and responsive layouts |
| **Browser localStorage** | Demo data and session persistence |

All technologies used in the current frontend prototype are available without paid API keys.

## 🏗️ System Architecture

CampusConnect follows a layered frontend architecture to separate UI rendering, application state, business rules, and data persistence.

```text
                 ┌──────────────────────────┐
                 │       React UI            │
                 │ Pages & Components        │
                 └────────────┬─────────────┘
                              │
                 ┌────────────▼─────────────┐
                 │      React Contexts       │
                 │ AuthContext               │
                 │ AppDataContext            │
                 └────────────┬─────────────┘
                              │
                 ┌────────────▼─────────────┐
                 │       Service Layer       │
                 │ Authentication            │
                 │ Users, Clubs & Events     │
                 │ Registrations & Rules     │
                 └────────────┬─────────────┘
                              │
                 ┌────────────▼─────────────┐
                 │      storage.js           │
                 │     localStorage          │
                 └──────────────────────────┘
```

### Architecture Highlights

- **Pages and components:** Render the interface and interact with application contexts instead of accessing browser storage directly.
- **AuthContext:** Manages demo authentication state.
- **AppDataContext:** Maintains application data in React state and provides a centralized mutation mechanism with success and error notifications.
- **Service layer:** Contains business logic, validation, and permission checks for users, clubs, events, and registrations.
- **Storage layer:** Centralizes `localStorage` access and handles missing, corrupted, or outdated demo data by re-seeding.
- **HashRouter:** Supports client-side URLs such as `/#/events`, making the application compatible with static hosting without requiring server-side route rewrites.

## 🗃️ Database Design

The logical data model contains four primary entities.

| Entity | Main Attributes |
|---|---|
| **USER** | `user_id`, `name`, `email`, `password`, `role` |
| **CLUB** | `club_id`, `name`, `description`, `category`, `status`, `organizer_id` |
| **EVENT** | `event_id`, `club_id`, `title`, `description`, `date`, `time`, `location`, `capacity`, `status` |
| **REGISTRATION** | `registration_id`, `event_id`, `student_id`, `registration_date`, `attendance` |

The JavaScript implementation uses camelCase property names, such as `userId`, `clubId`, and `organizerId`.

### Data Model Notes

- Users also have an `Active` or `Disabled` status for account management.
- Event statuses include `Pending`, `Approved`, and `Rejected`.
- Attendance is recorded as `Present` or `Absent`.
- New registrations initially have an attendance value of `Absent` until updated by the organizer.
- Editing a rejected event returns it to `Pending`.
- Editing an approved event preserves its approved status in the current implementation.

The current prototype stores this data in the browser. The logical model can serve as a starting point for a future relational database implementation.

## 📂 Project Structure

```text
CampusConnect/
│
├── index.html
├── package.json
├── vite.config.js
├── .env.example
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── docs/
│   └── screenshots/
│
└── src/
    ├── main.jsx
    ├── App.jsx
    │
    ├── components/
    │   ├── Button
    │   ├── StatusBadge
    │   ├── StatCard
    │   ├── SearchInput
    │   ├── ConfirmDialog
    │   ├── Modal
    │   ├── Toast
    │   ├── Navbar
    │   ├── Sidebar
    │   ├── Footer
    │   ├── EventCard
    │   ├── ClubCard
    │   ├── EventForm
    │   ├── ClubForm
    │   ├── Field
    │   ├── EmptyState
    │   ├── PageHeader
    │   └── RequireRole
    │
    ├── layouts/
    │   ├── PublicLayout
    │   └── DashboardLayout
    │
    ├── pages/
    │   ├── Home
    │   ├── Clubs
    │   ├── ClubDetails
    │   ├── Events
    │   ├── EventDetails
    │   ├── Login
    │   ├── Register
    │   ├── NotFound
    │   ├── student/
    │   ├── organizer/
    │   └── admin/
    │
    ├── context/
    │   ├── AuthContext
    │   └── AppDataContext
    │
    ├── services/
    │   ├── authService
    │   ├── userService
    │   ├── clubService
    │   ├── eventService
    │   ├── registrationService
    │   ├── permissions
    │   ├── storage
    │   └── apiConfig
    │
    ├── data/
    │   └── initialData.js
    │
    ├── utils/
    │   ├── constants
    │   ├── validation
    │   └── formatters
    │
    └── styles/
        ├── global.css
        └── components.css
```

*Note: This is a representative overview. Some component and page names are shown without file extensions for readability.*

## 🚀 Getting Started

Follow these steps to run CampusConnect locally.

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/) version 18 or newer.
- npm, which is included with Node.js.
- Git (recommended for cloning the repository).

Verify your installation:

```bash
node -v
npm -v
git --version
```

### 1. Clone the Repository

Replace `YOUR_USERNAME` with the GitHub username that owns the repository.

```bash
git clone https://github.com/YOUR_USERNAME/CampusConnect.git
cd CampusConnect
```

Alternatively, download the repository as a ZIP file and extract it.

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open the local URL shown in the terminal. The default Vite address is:

```text
http://localhost:5173
```

### 4. Build for Production

```bash
npm run build
```

Vite generates the production-ready frontend in the `dist/` directory.

### 5. Preview the Production Build

```bash
npm run preview
```

Use the local URL printed in the terminal to inspect the production build.

## 🔑 Demo Accounts

CampusConnect includes fictional accounts for testing its role-based functionality.

**Default demo password:** `Demo123!`

| Role | Email | Password |
|---|---|---|
| Student | `student@campusconnect.demo` | `Demo123!` |
| Club Organizer | `organizer@campusconnect.demo` | `Demo123!` |
| Administrator | `admin@campusconnect.demo` | `Demo123!` |

Additional organizer accounts use the same demo password:

- `culture.organizer@campusconnect.demo`
- `debate.organizer@campusconnect.demo`
- `photo.organizer@campusconnect.demo`

The login page also provides a **Demo access** panel with buttons to fill in the demo credentials. A new student account can be created through the registration page.

> **Security notice:** These are fictional demonstration accounts, not real university accounts. Never enter a real password into this application.

### Reset Demo Data

To restore the original sample data:

1. Log in using the administrator account.
2. Open the administrator dashboard.
3. Select **Reset Demo Data**.

This restores the application's initial demo state in the current browser.

## 🧪 Demo Walkthrough

Use the following workflow to demonstrate the core functionality.

### Scenario 1 — Student Registration

1. Log in as a student.
2. Browse the available events.
3. Open an approved event and register.
4. Navigate to **My Registrations**.
5. Verify that the registration appears.
6. Cancel the registration while the event is upcoming.

**Expected result:** The registration is created, displayed in the student's history, and removed when cancelled.

### Scenario 2 — Club Organizer

1. Log in as a club organizer.
2. Open the organizer dashboard.
3. Create a new event for the assigned club.
4. Verify that the event is marked `Pending`.
5. Open the participants list for an existing event.
6. Mark a registered participant as `Present`.

**Expected result:** The organizer can manage their assigned club's events and record attendance for registered participants.

### Scenario 3 — Administrator Approval

1. Log in as the administrator.
2. Open the event approvals section.
3. Locate the pending event created by the organizer.
4. Approve or reject the event.
5. Return to the student view and inspect the event's availability.

**Expected result:** The event's status changes, and students cannot register for pending or rejected events.

### Scenario 4 — Registration Validation

1. Find the full event named **Folk Music Open Mic**.
2. Attempt to register as a student.

**Expected result:** Registration is blocked because the event has reached its capacity.

## ⚖️ Business Rules

The service layer enforces the following application rules:

- A student cannot register for the same event more than once.
- Registration is blocked for pending, rejected, full, or past events.
- Students can cancel only their own registrations for upcoming events.
- Organizers can manage only their assigned club and its events.
- Organizers can view and manage participants for their own events.
- Only administrators can approve or reject events.
- Attendance can be recorded only for existing registrations.
- Deleting an event also deletes its associated registrations.
- Event dates, capacities, and email addresses are validated.
- User account status and role restrictions are checked by the application's service and interface layers.

These rules are implemented in the frontend prototype. They must also be enforced on a server before the system can be used securely in production.

## 🌍 Deployment

CampusConnect can be deployed as a static frontend using a compatible hosting provider.

### Option 1 — GitHub Pages

The project includes a GitHub Actions deployment workflow.

1. Push the project to a GitHub repository named `CampusConnect`.
2. Open the repository's **Settings → Pages**.
3. Set the deployment source to **GitHub Actions**.
4. Ensure the workflow file exists at `.github/workflows/deploy.yml`.
5. Push the project to the `main` branch.
6. Open the **Actions** tab and verify that the deployment workflow succeeds.

If your repository is hosted under `YOUR_USERNAME`, the expected project URL is:

```text
https://YOUR_USERNAME.github.io/CampusConnect/
```

The current Vite configuration uses a relative asset base, and the application uses `HashRouter` for client-side routing. Verify the generated build and deployed URL after deployment.

### Option 2 — Other Static Hosting Providers

The frontend can also be deployed to services such as:

- [Netlify](https://www.netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Vercel](https://vercel.com/)

Typical build settings:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js | 18 or newer |

Hosting providers may change their free-tier limits and terms over time.

**Important:** Static hosting can serve the current frontend but cannot run a Node.js/Express backend or host a relational database by itself.

## 🔮 Future Backend Integration

The next major architectural improvement is replacing browser-based demo storage with a real backend and database.

### Planned Technology Stack

```text
React Frontend
      │
      ▼
REST API
      │
      ▼
Node.js + Express
      │
      ▼
PostgreSQL Database
```

### Planned API Endpoints

| Module | Example Endpoints |
|---|---|
| Authentication | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout` |
| Users | `GET /users`, `PATCH /users/:id/role`, `PATCH /users/:id/status`, `DELETE /users/:id` |
| Clubs | `GET /clubs`, `POST /clubs`, `GET /clubs/:id`, `PUT /clubs/:id`, `DELETE /clubs/:id` |
| Events | `GET /events`, `POST /events`, `GET /events/:id`, `PUT /events/:id`, `DELETE /events/:id`, `PATCH /events/:id/status` |
| Registrations | `POST /events/:id/registrations`, `DELETE /events/:id/registrations`, `GET /events/:id/participants`, `PATCH /registrations/:id/attendance` |

### Integration Plan

1. Create PostgreSQL tables for users, clubs, events, and registrations based on the data model.
2. Implement Express routes and server-side validation.
3. Move authentication, authorization, ownership checks, and business rules to the backend.
4. Update the existing service functions to make asynchronous REST API requests.
5. Update `AppDataContext` to load and manage API data.
6. Implement secure authentication using appropriately hashed passwords and secure session cookies or tokens.
7. Remove demo passwords and the Reset Demo Data feature from production.
8. Test API errors, invalid requests, concurrent registrations, permissions, and data consistency.

The existing service-layer structure provides a starting point for this migration, but backend integration will require additional implementation and testing.

## ⚠️ Limitations and Security

CampusConnect is a working frontend prototype, not a production-ready system.

### Current Limitations

- **No backend:** Application logic and data operations currently run in the browser.
- **No real database:** Data is stored in the current browser's `localStorage`.
- **No synchronization:** Data is not shared across different users, browsers, or devices.
- **Simulated authentication:** Demo passwords are stored unencrypted in browser storage.
- **Client-side authorization:** Browser-side role and ownership checks can be bypassed by someone with developer tools.
- **No cross-device persistence:** Clearing browser storage can remove the locally saved demo data.
- **No production security:** The current authentication and authorization mechanisms are unsuitable for sensitive or real user information.

### Features Not Included

The current project does not implement:

- Online payments.
- QR-code attendance.
- In-app chat.
- Push or email notifications.
- Event certificates.
- Advanced analytics.
- Native Android or iOS applications.

These features may be considered for future versions if they fit the project requirements.

> **Production warning:** Do not use real passwords, sensitive personal information, or actual university records in this demo. A secure backend must enforce authentication, permissions, and data validation independently of the frontend.

## 📊 Project Status

| Area | Status |
|---|---|
| Public pages and event browsing | Implemented |
| Student registration workflows | Implemented |
| Club organizer workflows | Implemented |
| Administrator workflows | Implemented |
| Service-layer business rules | Implemented |
| Browser-based demo persistence | Implemented |
| Development-time source syntax checks | Completed |
| Development-time import/export checks | Completed |
| Service-layer business-rule checks | 59 checks completed during development |
| Full browser and real-device testing | Not yet completed |
| Production backend and database | Planned |

**Current milestone:** Frontend MVP implemented for the three user roles and the required pages.

The next steps are to verify the production build, complete browser testing, organize committed screenshot files, and implement backend integration.

## 👨‍💻 Team Members

**Team Dooms — Batch 4B**

| Name | Student ID |
|---|---|
| Forhad Hossen | `4326205101114` |
| Rupok | `4324205101094` |

## 🎓 Course Information

| Detail | Information |
|---|---|
| University | University of Information Technology & Sciences (UITS) |
| Course | Software Engineering and System Analysis Lab |
| Instructor | Rafat Ara |
| Project | CampusConnect — University Club & Event Management System |

## 🤝 Contributing

This repository was developed as an academic project. Improvements, bug fixes, and suggestions that align with the project's objectives are welcome.

For proposed changes:

1. Create a branch for your changes.
2. Make focused updates.
3. Run `npm run build` to check the production build.
4. Test the affected workflows.
5. Submit a pull request describing the changes.

## 📄 License

No open-source license has been specified for this project yet. All rights and permissions remain subject to the repository owner's applicable terms until a license is added.

---

<p align="center">
  <strong>CampusConnect</strong>
  <br />
  Connecting Students, Clubs, and Campus Events.
  <br /><br />
  Built with ❤️ by Team Dooms at UITS.
</p>
