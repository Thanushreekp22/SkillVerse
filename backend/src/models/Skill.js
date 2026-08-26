import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Proficiency level on a 1-5 scale (1 = beginner, 5 = expert)
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 3,
    },
    category: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate skills for the same user (case-insensitive)
skillSchema.index({ userId: 1, name: 1 }, { unique: true });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;