import JobRole from "../models/JobRole.js";
import { JOB_ROLES } from "../data/jobRoles.js";

/**
 * Idempotent seeding used at server startup so that fresh deployments
 * (e.g. Render free tier, which has no shell access) automatically get
 * the 10 job roles. Does nothing if roles already exist.
 */
export const ensureJobRolesSeeded = async () => {
  try {
    const count = await JobRole.countDocuments();
    if (count > 0) {
      console.log(`🌱 Job roles already present (${count}), skipping seed`);
      return;
    }
    await JobRole.insertMany(JOB_ROLES);
    console.log(`🌱 Auto-seeded ${JOB_ROLES.length} job roles`);
  } catch (error) {
    // Never crash the server over seeding — job-match just stays empty
    console.error("⚠️  Auto-seed failed:", error.message);
  }
};