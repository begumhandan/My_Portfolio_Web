import type { Localized, MaybeLocalized } from "@/lib/i18n/config";

export type ProjectCategory = "ai" | "mobile" | "fullstack";
export type ProjectFilter = "all" | ProjectCategory;

export interface Project {
  id: string;
  title: MaybeLocalized;
  tagline?: string;
  /** Special highlight (e.g. grant / award) shown as an amber pill above the title. */
  badge?: Localized;
  /** Shown in the card's header strip, e.g. "2024-2025". */
  period?: string;
  description: Localized;
  tags: string[];
  categories: ProjectCategory[];
  /** Repository URL. Leave undefined to hide the GitHub link. */
  github?: string;
  /** Live demo URL. Leave undefined to hide the "Live Demo" link. */
  demo?: string;
  /** Featured projects span the full grid width on tablet & desktop. */
  featured?: boolean;
}

export const projectFilters: { id: ProjectFilter; label: Localized }[] = [
  { id: "all", label: { tr: "Tümü", en: "All" } },
  { id: "ai", label: { tr: "AI & ML", en: "AI & ML" } },
  { id: "mobile", label: { tr: "Mobil", en: "Mobile" } },
  { id: "fullstack", label: { tr: "Full-Stack", en: "Full-Stack" } },
];

export const projects: Project[] = [
  {
    id: "nokta",
    title: "NOKTA",
    tagline: "Nokta AI",
    description: {
      tr: "Ham fikir kıvılcımlarını yapılandırılmış mühendislik spesifikasyonlarına ve teknik gereksinim dokümanlarına dönüştüren yapay zeka destekli mobil uygulama.",
      en: "An AI-powered mobile app that turns raw sparks of ideas into structured engineering specifications and technical requirement documents.",
    },
    tags: ["React Native", "Expo Router", "TypeScript", "Zustand", "Node.js", "Groq API"],
    categories: ["ai", "mobile"],
    // TODO: Add repository / demo links.
    github: "https://github.com/",
  },
  {
    id: "begum-health-agent",
    title: "B.E.G.U.M. Health Agent",
    tagline: "AI Agent",
    description: {
      tr: "Kullanıcı semptomlarını analiz ederek doğru tıbbi bölüme yönlendirme yapan, dinamik JSON render mimarisine sahip veri odaklı mobil sağlık asistanı.",
      en: "A data-driven mobile health assistant with a dynamic JSON rendering architecture that analyzes user symptoms and routes them to the right medical department.",
    },
    tags: ["React Native", "Expo", "Serper API", "AI Agent"],
    categories: ["ai", "mobile"],
    github: "https://github.com/",
  },
  {
    id: "smart-pest-detection",
    title: { tr: "Akıllı Tarımsal Zararlı Tespiti", en: "Smart Agricultural Pest Detection" },
    badge: {
      tr: "🌟 TÜBİTAK 2209-A Araştırma Projesi",
      en: "🌟 TÜBİTAK 2209-A Research Project",
    },
    period: "2024-2025",
    description: {
      tr: "IP102 veri seti üzerinde EfficientNetV2S derin öğrenme mimarisi kullanılarak eğitilen, tarımsal zararlıları yüksek doğrulukla sınıflandıran yapay zeka modeli ve çiftçiler/uzmanlar için geliştirilen mobil karar destek uygulaması.",
      en: "An AI model trained with the EfficientNetV2S deep learning architecture on the IP102 dataset to classify agricultural pests with high accuracy, paired with a mobile decision-support app for farmers and experts.",
    },
    tags: ["Python", "EfficientNetV2S", "Deep Learning", "Flask", "React Native"],
    categories: ["ai", "mobile"],
    // TODO: Add repository / demo links.
    github: "https://github.com/",
    // Third card in a 2-column grid: span full width so the bento stays balanced.
    featured: true,
  },
];
