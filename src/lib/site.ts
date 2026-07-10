const configuredUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vowlms.vercel.app";

export const siteConfig = {
  name: "VowLMS",
  legalName: "GoalVow Holdings",
  url: configuredUrl.replace(/\/$/, ""),
  description:
    "A connected GoalVow learning platform for academy courses, Skills Practice, support, rewards, certificates, and opportunity pathways.",
  contact: {
    phoneDisplay: "+27 63 270 6787",
    phoneHref: "tel:+27632706787",
    email: "support@goalvow.com",
    address: "17 Vultee, Cape Town, South Africa",
    whatsappDisplay: "+27 83 948 8894",
    whatsappHref: "https://wa.me/27839488894",
  },
} as const;
