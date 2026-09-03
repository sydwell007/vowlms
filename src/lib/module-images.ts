const MODULE_IMAGE_DIR = "/images/upskilling_Module Images";

// Maps each Upskilling course (by slug) and module (by order) to a real module
// image filename in public/images/upskilling_Module Images. Built by matching
// each module's real title against the available image set; where more than one
// image existed for the same module, one was selected. Modules with no
// reasonable image match are intentionally omitted so the UI falls back to the
// existing generic icon rather than showing an unrelated image.
const MODULE_IMAGES: Record<string, Record<number, string>> = {
  "business-ethics": {
    1: "Business Ethics Fundamentals.png",
    2: "Employee Ethics.jpg",
    3: "Leadership on Ethics.png",
  },
  "workplace-compliance": {
    1: "Health and Safety.png",
    2: "Workplace Violence.png",
  },
  "organizational-culture": {
    1: "Inclusive and Respect.png",
    2: "Inclusive Communication.png",
    3: "Culture Competence.png",
  },
  "stress-management": {
    1: "Stress Fundamentals.png",
    2: "Stress and Work Performance.png",
    3: "Relieving Stress.png",
  },
  cybersecurity: {
    1: "Online Security.png",
    2: "Data Protection.png",
    3: "Social Engineering.png",
  },
  "health-and-wellness": {
    1: "Positive Psychology Fundamentals.png",
    2: "Healthy Habits.png",
    3: "Positive Psychology in the workplace.png",
    4: "Exercise.png",
    5: "Mental Health Awareness.png",
    6: "Difficult Emotions.png",
  },
  "human-resources": {
    1: "HR Fundamentals.jpg",
    2: "1_Diversity_Inclusion_Belonging_Thumbnail.jpg",
    3: "3_Interviewing Thumbnail.jpg",
    4: "Unconcious Bias.jpg",
    5: "Talent Management.jpg",
    6: "Workplace Wellbeing.jpg",
    7: "Anti-Harassment and Discrimination.jpg",
    8: "Retirement Planning.jpg",
  },
  marketing: {
    1: "9_Marketing Fundamentals.jpg",
    2: "Marketing - 7_Brand Identity (1).jpg",
    3: "10_Product Marketing.jpg",
    4: "Marketing - 9_Content Marketing (1).jpg",
    5: "Marketing - 7_Customer and Marketing Reserch (1).jpg",
    6: "4_Website Marketing.jpg",
    7: "10_Search Engine Optimisation_SEO.jpg",
    8: "12_Social Media Marketing.jpg",
    9: "11_Email Marketing.jpg",
    10: "7_Paid Advertising.jpg",
    11: "7_Marketing Analytics.jpg",
  },
  sales: {
    1: "Sales Fundamentals.jpg",
    2: "Sales Leadership and Management.jpg",
    3: "Sales Psychology.jpg",
    4: "Presnting your solution1.jpg",
    5: "Building Relationships.jpg",
    6: "Closing the Deal.jpg",
    7: "Handling Objection.jpg",
    8: "Prospecting.jpg",
  },
  "project-management": {
    1: "Project Management Fundamentals.jpg",
    2: "Project Management Frame Works.jpg",
    3: "Communication.jpg",
    4: "Project Scheduling.jpg",
    5: "Project Scope Mnagement.png",
    6: "Project Reporting.png",
    7: "Project Improvement.jpg",
    8: "Project Change Management.jpg",
  },
  "customer-service": {
    1: "Customer Service Fundamentals.png",
    2: "Customer Service Skills.jpg",
    3: "Customer Communication Basics.jpg",
    4: "Customer Communication Channels.jpg",
    5: "Team Management.png",
    6: "Culture Sensitivity.png",
    7: "Customer Diffucult Situation.png",
  },
  "career-management": {
    1: "Driving your Career.png",
    2: "Assessing your Strength and Skills.png",
    3: "Finding a New Job.png",
    4: "New Professional.png",
    5: "Networking.png",
    6: "Mentoring in the Workplace.png",
    7: "Professional Ettequete.png",
    8: "Building Working Relationship.png",
    9: "Career Management - Overcoming Challenges.png",
  },
  "change-management": {
    1: "Change Management.jpg",
    2: "Change Management Model.png",
    3: "Change Management Process.png",
    4: "Communicating Change.png",
    5: "Leading through change.png",
    6: "Managing Change in time of Crisis.png",
  },
  communication: {
    1: "Communication Fundamentals.png",
    2: "Empathy at Work.png",
    3: "Verbal Communication3.png",
    4: "Meetings.png",
    5: "Presentation.png",
    6: "Negotiation.png",
    7: "Writting Well.png",
    8: "DIfficult Situation.jpg",
  },
  leadership: {
    1: "Leadership Fundamentals.png",
    2: "Leadership Style.png",
    3: "Emotional Intelligence.jpg",
    4: "Leadership for Crisis Management.png",
  },
  resilience: {
    1: "Resilience Fundamentals.png",
    2: "Career Resilience.jpg",
    3: "Leadership and Resilience.jpg",
    4: "Emotional and Physical Resilience3.jpg",
    5: "Thriving Through Challenges.png",
  },
  "problem-solving": {
    1: "Problem Solving Fundamentals.png",
    2: "Problem Solving in the Workplace.png",
    3: "Steps in Problem Solving.png",
    4: "Advance Problem Solving.png",
  },
  "time-management": {
    1: "Time Management Fundamentals.png",
    2: "Goal Setting.png",
    3: "Scheduling.png",
    4: "Prioritization.png",
    5: "Concentration.png",
    6: "Time Management - Overcoming Challenges.png",
  },
  "team-management": {
    1: "Team Management Fundamentals.png",
    2: "New Manager.png",
    3: "Developing your Team.png",
    4: "Team Culture.png",
    5: "Delegating Task.png",
    6: "Motivating your Team.png",
    7: "Managing Remote Teams.png",
    8: "Team Dynamics.png",
    9: "Performance Management.png",
    10: "Resolving Conflict.png",
    11: "Letting an Employee go.png",
  },
  "critical-thinking": {
    1: "Critical Thinking Fundamentals.png",
    2: "Critical Thinking in the workplace.png",
    3: "Critical Thinking and Info Lit.png",
  },
};

export function getModuleImageSrc(courseSlug: string, moduleOrder: number): string | null {
  const filename = MODULE_IMAGES[courseSlug]?.[moduleOrder];
  if (!filename) return null;
  return `${MODULE_IMAGE_DIR}/${filename}`;
}
