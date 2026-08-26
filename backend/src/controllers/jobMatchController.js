import { Skill, User, JobRole } from "../models/index.js";

/**
 * Weighted job matching engine.
 * Reads role requirements from the JobRole collection (seeded data).
 * For each role, we compute a match percentage based on the sum of the
 * (weighted) proficiencies the user has for that role's required skills,
 * relative to the total possible weighted score for that role.
 */
export const getJobMatch = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user.id });
    const user = await User.findById(req.user.id).select("name email");
    const jobRoles = await JobRole.find({});

    if (!skills || skills.length === 0 || jobRoles.length === 0) {
      return res.status(200).json({
        message:
          "You don't have any skills yet. Add skills to see your best job matches!",
        matches: [],
        topSkills: [],
        hasSkills: skills.length > 0,
        user,
      });
    }

    // Index user skills by lowercase name -> level (1-5)
    const skillMap = new Map();
    skills.forEach((s) => skillMap.set(s.name.toLowerCase(), s.level));

    const matches = jobRoles.map((role) => {
      let earned = 0;
      let total = 0;
      const matchedSkills = [];
      const missingSkills = [];

      role.skills.forEach((required) => {
        const w = required.weight;
        total += w * 5; // max proficiency contribution per skill (5)
        const userLevel = skillMap.get(required.name.toLowerCase());

        if (userLevel !== undefined) {
          earned += w * userLevel;
          matchedSkills.push({ name: required.name, level: userLevel, weight: w });
        } else {
          missingSkills.push({ name: required.name, weight: w });
        }
      });

      const percent = Math.round((earned / total) * 100);

      // Sort missing skills by highest priority first
      missingSkills.sort((a, b) => b.weight - a.weight);

      return {
        title: role.title,
        category: role.category,
        description: role.description,
        percent,
        matchedSkills,
        missingSkills,
        matchedCount: matchedSkills.length,
        requiredCount: role.skills.length,
      };
    });

    // Sort by match percentage (highest first)
    matches.sort((a, b) => b.percent - a.percent);

    // Derive "top skills" = the user's skills with highest level, for dashboard use
    const topSkills = skills
      .map((s) => ({ name: s.name, level: s.level }))
      .sort((a, b) => b.level - a.level)
      .slice(0, 5);

    res.status(200).json({
      message: "Job matches computed successfully!",
      matches,
      topSkills,
      hasSkills: true,
      user,
    });
  } catch (error) {
    console.error("Job match error:", error.message);
    res.status(500).json({ message: "Server error computing job matches." });
  }
};