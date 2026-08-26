// Popular tech skills grouped by category, used in the Add Skills page
export const SKILL_GROUPS = [
  {
    category: 'Programming Languages',
    skills: ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Rust'],
  },
  {
    category: 'Web Development',
    skills: ['HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot'],
  },
  {
    category: 'Databases',
    skills: ['MongoDB', 'SQL', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'DynamoDB', 'Elasticsearch'],
  },
  {
    category: 'Data & AI',
    skills: ['Machine Learning', 'Deep Learning', 'Data Analysis', 'Data Visualization', 'Statistics', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Tableau'],
  },
  {
    category: 'Cloud & DevOps',
    skills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Linux', 'Terraform', 'CI/CD', 'Jenkins', 'Git'],
  },
  {
    category: 'Mobile',
    skills: ['React Native', 'Flutter', 'Android', 'Swift', 'Kotlin'],
  },
  {
    category: 'Security',
    skills: ['Network Security', 'Penetration Testing', 'Ethical Hacking', 'Firewalls', 'Cryptography'],
  },
];

// Flat list for autocomplete
export const ALL_SKILLS = SKILL_GROUPS.flatMap((g) => g.skills);