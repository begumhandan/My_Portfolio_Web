/**
 * Global site configuration. Update links here — no component changes needed.
 */
export const siteConfig = {
  name: "Begüm Handan Demir",
  logo: "BHD.",
  // TODO: Replace with your deployed domain (used for SEO / Open Graph URLs).
  url: "https://begumhandandemir.dev",
  email: "begumhandandemir@gmail.com",
  // CV lives at /public/cv/Begum-Handan-Demir-CV.pdf — `cvFileName` is the name it downloads as.
  cvPath: "/cv/Begum-Handan-Demir-CV.pdf",
  cvFileName: "Begum-Handan-Demir-CV.pdf",
  photo: "/images/begum.jpg",
  socials: {
    // TODO: Replace with your real profile URLs.
    github: "https://github.com/begumhandan",
    linkedin: "https://www.linkedin.com/in/",
  },
} as const;
