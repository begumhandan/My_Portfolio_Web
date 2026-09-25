/**
 * Global site configuration. Update links here — no component changes needed.
 */
export const siteConfig = {
  name: "Begüm Handan Demir",
  logo: "BHD.",
  // Deployed domain — used for SEO canonical and Open Graph URLs.
  url: "https://my-portfolio-web-nine-beta.vercel.app",
  email: "begumhandandemir@gmail.com",
  // CV lives at /public/cv/Begum-Handan-Demir-CV.pdf — `cvFileName` is the name it downloads as.
  cvPath: "/cv/Begum-Handan-Demir-CV.pdf",
  cvFileName: "Begum-Handan-Demir-CV.pdf",
  photo: "/images/begum.jpg",
  socials: {
    github: "https://github.com/begumhandan",
    linkedin: "https://www.linkedin.com/in/beg%C3%BCm-handan-demir-69788b287/",
  },
} as const;
