import mongoose from "mongoose";
import dotenv from "dotenv";
import JobRole from "../models/JobRole.js";
import { JOB_ROLES } from "../data/jobRoles.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skillverse";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`🌱 Connecting to ${MONGODB_URI}`);

    await JobRole.deleteMany({});
    console.log("🧹 Cleared existing job roles");

    const inserted = await JobRole.insertMany(JOB_ROLES);
    console.log(`✅ Seeded ${inserted.length} job roles:`);
    inserted.forEach((r) =>
      console.log(`   • ${r.title} (${r.skills.length} required skills)`)
    );

    await mongoose.disconnect();
    console.log("🌱 Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();