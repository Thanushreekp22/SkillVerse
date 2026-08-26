import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import jobMatchRoutes from "./routes/jobMatchRoutes.js";

dotenv.config();

const app = express();

// CORS: explicit allowlist + any *.vercel.app deployment (prod + previews)
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Non-browser requests (curl, mobile apps, same-origin) have no Origin header
      if (!origin) return callback(null, true);
      // Any Vercel deployment of this project (production domain + preview URLs)
      if (origin.startsWith("https://") && origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      // Block unknown origins without crashing the request
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("SkillVerse API running 🚀"));

// Health check endpoint for Render
app.get("/health", (req, res) =>
  res.json({
    status: "ok",
    uptime: Math.round(process.uptime()),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/job-match", jobMatchRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server." });
});

export default app;