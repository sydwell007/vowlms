const tokenEnvironmentByAcademy = {
  upskilling: "UPSKILLING_MOODLE_TOKEN",
  "skills-training": "SKILLS_TRAINING_MOODLE_TOKEN",
  "chef-academy": "CHEF_ACADEMY_MOODLE_TOKEN",
  schools: "GOALVOW_SCHOOLS_MOODLE_TOKEN",
  "business-school": "BUSINESS_SCHOOL_MOODLE_TOKEN",
  university: "GOALVOW_UNIVERSITY_MOODLE_TOKEN",
};

export function requireMoodleToken(academyId) {
  const environmentName = tokenEnvironmentByAcademy[academyId];
  const token = environmentName ? process.env[environmentName] : undefined;

  if (!token) {
    throw new Error(
      `Missing ${environmentName ?? "Moodle token environment variable"} for ${academyId}`,
    );
  }

  return token;
}
