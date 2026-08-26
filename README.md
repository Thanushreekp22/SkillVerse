# SkillVerse 🎯

A focused skill assessment & job matching platform. Register, add your skills, and instantly see which job roles match your profile — with suggestions for skills you're missing.

## ✨ Features
- **Registration & Login** — JWT-authenticated accounts stored in MongoDB (bcrypt password hashing)
- **Dashboard** — Overview of your skills, average match %, best-matching role, and a match chart
- **Add Skills** — Add skills from a curated list with proficiency levels (1–5), edit levels, remove skills
- **Job Match** — Your skills are matched against 10 seeded job roles (Full Stack, Data Scientist, DevOps, etc.) using a weighted matching engine, with missing-skill suggestions per role

## 🛠 Tech Stack
- **Frontend:** React 18, Vite 5, CSS, Recharts, React Router v6
- **Backend:** Node.js, Express 5, Mongoose/MongoDB
- **Auth:** JWT + bcryptjs

## 🚀 Run It Locally

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a `MONGODB_URI` in `.env`)

### 1. Backend (port 5001)
```bash
cd backend
npm install
npm run seed        # seeds 10 job roles into MongoDB
npm run dev         # starts server on http://localhost:5001
```

### 2. Frontend (port 5173)
```bash
cd frontend
npm install
npm run dev         # starts Vite on http://localhost:5173
```

Open **http://localhost:5173**, register a new account, add some skills, and check your job matches!

## ☁️ Deployment (Render + Vercel + MongoDB Atlas)

Deploy order matters: **Atlas → Render (API) → Vercel (frontend)**.

### Step 1 — MongoDB Atlas (free)
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. **Database Access** → add a database user (username + password)
3. **Network Access** → allow connections from anywhere: `0.0.0.0/0` (required for Render)
4. Get the connection string: `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/skillverse`

### Step 2 — Backend on Render
1. Push this repo to GitHub, then on [render.com](https://render.com) → **New → Web Service** → connect the repo
2. Render auto-detects `render.yaml`. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add **Environment Variables**:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | your Atlas connection string from Step 1 |
   | `FRONTEND_URL` | your Vercel URL, e.g. `https://skillverse.vercel.app` |
   - `JWT_SECRET` is generated automatically by the blueprint; set it manually if deploying without `render.yaml`
4. Deploy. Job roles **auto-seed** on first startup — no shell access needed.
5. Verify: open `https://<your-service>.onrender.com/health` → should return `{"status":"ok","db":"connected",...}`

> ⚠️ Free tier cold starts: the API sleeps after ~15 min idle and takes ~30-60s to wake.

### Step 3 — Frontend on Vercel
1. On [vercel.com](https://vercel.com) → **Add New → Project** → import the same repo
2. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
3. Add **Environment Variable** before building:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://<your-service>.onrender.com/api` |
4. Deploy. SPA rewrites for React Router are pre-configured in `frontend/vercel.json`.

CORS on the backend already allows any `*.vercel.app` origin (production + preview deployments), plus your explicit `FRONTEND_URL`.

## 🔌 API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get a JWT |
| GET | `/api/auth/me` | Get current user profile |
| GET | `/api/skills` | List my skills |
| POST | `/api/skills` | Add a skill `{ name, level (1-5) }` |
| PUT | `/api/skills/:id` | Update skill level |
| DELETE | `/api/skills/:id` | Remove a skill |
| GET | `/api/skills/suggestions` | Suggested skills not yet added |
| GET | `/api/job-match` | Ranked job matches + missing-skill suggestions |

## 📂 Project Structure
```
SkillVerse/
├── backend/
│   └── src/
│       ├── config/        # MongoDB connection
│       ├── controllers/   # auth, skills, job-match logic
│       ├── data/          # job-role definitions
│       ├── middleware/    # JWT auth guard
│       ├── models/        # User, Skill, JobRole (Mongoose)
│       ├── routes/        # API route definitions
│       └── scripts/       # seed.js (CLI), autoSeed.js (startup)
└── frontend/
    └── src/
        ├── api/           # Axios instance (JWT interceptor)
        ├── components/    # Navbar, ProtectedRoute
        ├── context/       # AuthContext
        ├── data/          # Skill list for pickers
        └── pages/         # Login, Register, Dashboard, MySkills, JobMatch
```