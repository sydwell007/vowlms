export const visualAssets = {
  logo: "/images/goalvow-logo.png",
  ecosystemHero: "/images/vowlms/hero-ecosystem.png",
  academyNetwork: "/images/vowlms/academy-network.png",
  dashboardExperience: "/images/vowlms/dashboard-experience.png",
  vrPracticeLab: "/images/vowlms/vr-practice-lab.png",
  coursePresenter: "/images/vowlms/course-presenter.webp",
} as const;

export function getAcademyCourseImage(category: string) {
  switch (category) {
    case "skills-training":
      return visualAssets.vrPracticeLab;
    case "chef-academy":
      return visualAssets.ecosystemHero;
    case "business-school":
      return visualAssets.dashboardExperience;
    default:
      return visualAssets.academyNetwork;
  }
}
