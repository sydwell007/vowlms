const certificateFiles: Record<string, string> = {
  "business-ethics": "Business Ethics Certificate of Completion.png",
  "workplace-compliance": "Workplace Compliance Certificate of Completion.png",
  "organizational-culture": "Workplace Culture Certificate of Completion.png",
  "stress-management": "Stress Management Certificate of Completion.png",
  cybersecurity: "Online Security Certificate of Completion.png",
  "health-and-wellness": "Health and Wellness Certificate of Completion.png",
  "human-resources": "Human Resource Certificate of Completion.png",
  marketing: "Marketing Certificate of Completion.png",
  sales: "Sales Certificate of Completion.png",
  "project-management": "Project Management Certificate of Completion.png",
  "customer-service": "Customer Service Certificate of Completion.png",
  "career-management": "Career Management Certificate of Completion.png",
  "change-management": "Change Management Certificate of Completion.png",
  communication: "Communication Certificate of Completion.png",
  leadership: "Leadership Certificate of Completion.png",
  resilience: "Resilience Certificate of Completion.png",
  "problem-solving": "Problem Solving Certificate of Completion.png",
  "time-management": "Time Management Certificate of Completion.png",
  "team-management": "Team Management Certificate of Completion.png",
  "critical-thinking": "Critical Thinking Certificate of Completion.png",
};

export function getCertificateTemplateSrc(courseSlug: string) {
  const fileName = certificateFiles[courseSlug];
  return fileName ? `/images/upskilling_Module%20Images/${encodeURIComponent(fileName)}` : null;
}

export function isCertificateCourse(courseSlug: string) {
  return courseSlug in certificateFiles;
}
