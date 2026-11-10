# Deploying CampusConnect (free, about 15 minutes)

You will get **one public link** that shows the whole working website (React frontend + Node.js API + PostgreSQL database).

| Part | Service | Cost |
|---|---|---|
| Website + API (one Node.js service) | [Render](https://render.com) free web service | Free (no card required at the time of writing) |
| Database | [Neon](https://neon.tech) free PostgreSQL | Free (no card required at the time of writing) |
| Code storage | GitHub (public repository) | Free |

> Free tiers and their rules can change. Check each site's current pricing page; nothing here is guaranteed to stay free.

## Step 1: Put the code on GitHub
1. Create a new **public** repository named `CampusConnect` on github.com.
2. Upload the project files (unzip first). Do **not** upload `node_modules`, `dist` or `data` (the `.gitignore` already excludes them).
   - Easiest: on the empty repo page click **uploading an existing file**, drag all the unzipped files and folders in, then **Commit changes**.

## Step 2: Create the free database (Neon)
1. Sign up at neon.tech (you can use your GitHub or Google account) and create a project (any name, e.g. `campusconnect`).
2. On the project dashboard click **Connect** and copy the **connection string**. It starts with `postgresql://` and contains your password.
3. Keep it handy for the next step. Treat it like a password: never put it in GitHub.

You do **not** need to create tables. The server creates them and loads the sample data the first time it starts.

## Step 3: Deploy to Render
1. Sign up at render.com (GitHub login is easiest).
2. Click **New +** -> **Blueprint**, connect your GitHub account, and choose the `CampusConnect` repository. Render reads `render.yaml`.
3. When asked for `DATABASE_URL`, paste the Neon connection string. (`JWT_SECRET` is generated for you.)
4. Click **Apply** / **Deploy**. The first build takes a few minutes. When the status says **Live**, click the URL at the top of the service page, for example `https://campusconnect-xxxx.onrender.com`.

That URL is the link to share with your teacher.

### If you prefer not to use the Blueprint
**New +** -> **Web Service** -> pick the repo, then set:
- Runtime: `Node`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Instance type: `Free`
- Environment variables: `NODE_VERSION` = `22`, `NODE_ENV` = `production`, `JWT_SECRET` = any long random text, `DATABASE_URL` = your Neon string.

## Before you present
- **Free servers go to sleep** after about 15 minutes without visitors. The first visit afterwards can take 30-60 seconds (the site shows a "Loading CampusConnect..." screen). **Open the link once a minute or two before the demo** so it is awake.
- Log in with the demo accounts (password `Demo123!`): `student@campusconnect.demo`, `organizer@campusconnect.demo`, `admin@campusconnect.demo`.
- If the data gets messy, log in as admin and press **Reset demo data** on the dashboard.
- On a public site you may want to disable that button afterwards: set the environment variable `DEMO_RESET` to `off` in Render.
- Sample event dates are created relative to the day the database was first loaded. If events look old after a few weeks, press **Reset demo data** to refresh them.

## Troubleshooting
| Problem | Fix |
|---|---|
| Build fails with "vite: not found" | Make sure the build command is exactly `npm install && npm run build` |
| App shows "We couldn't reach the server" | Open Render -> your service -> **Logs**. Usually `DATABASE_URL` is missing or wrong. |
| Log says "JWT_SECRET must be set" | Add the `JWT_SECRET` environment variable |
| Database connection error | Re-copy the Neon connection string (it must start with `postgresql://`) |
| Site was working, now slow | The free server was asleep. Wait up to a minute. |

## Running it on your own computer instead
Needs Node.js 22 or newer. No database install is needed locally (a SQLite file is created in `data/`).
```bash
npm install
npm run dev          # website on http://localhost:5173, API on http://localhost:5000
```
Production-style (one server, like the deployed version):
```bash
npm run build
npm start            # everything on http://localhost:5000
```
To use PostgreSQL locally, set `DATABASE_URL` to a connection string first.
