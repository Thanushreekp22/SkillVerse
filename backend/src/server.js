import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { ensureJobRolesSeeded } from "./scripts/autoSeed.js";

dotenv.config();
const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectDB();
    await ensureJobRolesSeeded();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 SkillVerse server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
}

startServer();