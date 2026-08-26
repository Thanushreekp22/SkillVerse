import { Skill, User } from "../models/index.js";

const SUGGESTED_SKILLS = [
  "JavaScript", "Python", "React", "Node.js", "HTML", "CSS", "MongoDB",
  "Express", "SQL", "TypeScript", "Git", "Docker", "AWS", "Linux",
  "Machine Learning", "Data Analysis", "Statistics", "React Native",
  "REST APIs", "GitHub", "Java", "C++", "Data Visualization", "Flutter",
];

// GET /api/skills - list current user's skills
export const getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.status(200).json({ skills });
  } catch (error) {
    console.error("Get skills error:", error.message);
    res.status(500).json({ message: "Server error fetching skills." });
  }
};

// POST /api/skills - add a skill
export const addSkill = async (req, res) => {
  try {
    const { name, level = 3 } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Skill name is required." });
    }

    const parsedLevel = Number(level);
    if (Number.isNaN(parsedLevel) || parsedLevel < 1 || parsedLevel > 5) {
      return res.status(400).json({ message: "Skill level must be between 1 and 5." });
    }

    const cleanedName = name.trim().replace(/\s+/g, " ");

    const existing = await Skill.findOne({
      userId: req.user.id,
      name: { $regex: new RegExp(`^${cleanedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });

    if (existing) {
      return res.status(409).json({ message: `You already have "${cleanedName}" in your skills.` });
    }

    const skill = await Skill.create({
      userId: req.user.id,
      name: cleanedName,
      level: parsedLevel,
    });

    res.status(201).json({ message: `${cleanedName} added to your skills!`, skill });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This skill already exists for you." });
    }
    console.error("Add skill error:", error.message);
    res.status(500).json({ message: "Server error adding skill." });
  }
};

// PUT /api/skills/:id - update skill level
export const updateSkill = async (req, res) => {
  try {
    const { level } = req.body;
    const parsedLevel = Number(level);

    if (Number.isNaN(parsedLevel) || parsedLevel < 1 || parsedLevel > 5) {
      return res.status(400).json({ message: "Skill level must be between 1 and 5." });
    }

    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { level: parsedLevel },
      { new: true }
    );

    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    res.status(200).json({ message: "Skill updated!", skill });
  } catch (error) {
    console.error("Update skill error:", error.message);
    res.status(500).json({ message: "Server error updating skill." });
  }
};

// DELETE /api/skills/:id - remove a skill
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    res.status(200).json({ message: `${skill.name} removed from your skills.` });
  } catch (error) {
    console.error("Delete skill error:", error.message);
    res.status(500).json({ message: "Server error deleting skill." });
  }
};

// GET /api/skills/suggestions - suggested popular skills
export const getSkillSuggestions = async (req, res) => {
  try {
    const mySkills = await Skill.find({ userId: req.user.id }).select("name");
    const owned = new Set(mySkills.map((s) => s.name.toLowerCase()));

    // Keep order, drop skills the user already owns
    const suggestions = SUGGESTED_SKILLS.filter((s) => !owned.has(s.toLowerCase()));

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Skill suggestions error:", error.message);
    res.status(500).json({ message: "Server error fetching suggestions." });
  }
};