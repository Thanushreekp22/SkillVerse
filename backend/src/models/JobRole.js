import mongoose from "mongoose";

const jobRoleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    category: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    // Skills required for this role, each with a priority weight
    skills: [
      {
        name: { type: String, required: true },
        weight: { type: Number, default: 1, min: 1, max: 5 },
      },
    ],
  },
  { timestamps: true }
);

const JobRole = mongoose.model("JobRole", jobRoleSchema);

export default JobRole;