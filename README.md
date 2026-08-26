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
│       ├── data/          # seeded job-role definitions
│       ├── middleware/    # JWT auth guard
│       ├── models/        # User, Skill, JobRole (Mongoose)
│       ├── routes/        # API route definitions
│       └── scripts/       # seed.js
└── frontend/
    └── src/
        ├── api/           # Axios instance (JWT interceptor)
        ├── components/    # Navbar, ProtectedRoute
        ├── context/       # AuthContext
        ├── data/          # Skill list for pickers
        ├── pages/         # Login, Register, Dashboard, MySkills, JobMatch
        └── theme/         # Material UI theme
```