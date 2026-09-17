import careerCourseVisuals from "@/data/savva-career-visuals.json";

const certificateFiles: Record<string, string> = {
  "business-ethics": "Business Ethics Cert.jpg",
  "workplace-compliance": "Workplace Compliance Cert.jpg",
  "organizational-culture": "Workplace Culture Cert.jpg",
  "stress-management": "Stress Management.jpg",
  cybersecurity: "Cyber Security Cert.jpg",
  "health-and-wellness": "Health&Wellness Cert.jpg",
  "human-resources": "Human Resource Course Cert.jpg",
  marketing: "Marketing Cert.jpg",
  sales: "Sales Cert.jpg",
  "project-management": "Project Management Cert.jpg",
  "customer-service": "Customer Service Cert.jpg",
  "career-management": "Career Managment Course Cert.jpg",
  "change-management": "Leading through Change Cert.jpg",
  communication: "Communication Cert.jpg",
  leadership: "Leadership Cert.jpg",
  resilience: "Resilience Cert.jpg",
  "problem-solving": "Problem Solving Cert.jpg",
  "time-management": "Time Management Cert.jpg",
  "team-management": "Team Managment Cert.jpg",
  "critical-thinking": "Critical Thinking.jpg",
};

const dynamicCertificateCourses = new Set([
  "microsoft-word-basics",
  "microsoft-word-advance",
  "microsoft-excel-basics",
  "microsoft-excel-advance",
  "microsoft-power-point",
  "microsoft-outlook",
  "microsoft-access",
]);

export function getCertificateTemplateSrc(courseSlug: string) {
  const fileName = certificateFiles[courseSlug];
  return fileName ? `/images/certificates/${encodeURIComponent(fileName)}` : null;
}

export function isCertificateCourse(courseSlug: string) {
  return courseSlug in certificateFiles || dynamicCertificateCourses.has(courseSlug) || courseSlug in careerCourseVisuals;
}
