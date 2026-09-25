import type { Localized, MaybeLocalized } from "@/lib/i18n/config";

/** Icon keys are mapped to Lucide icons inside components/Skills.tsx. */
export type SkillIcon = "frontend" | "backend" | "ai";

export interface SkillGroup {
  id: string;
  icon: SkillIcon;
  title: Localized;
  description: Localized;
  items: MaybeLocalized[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    icon: "frontend",
    title: { tr: "Frontend & Mobile", en: "Frontend & Mobile" },
    description: {
      tr: "Hızlı, erişilebilir ve akıcı arayüzler.",
      en: "Fast, accessible and fluid interfaces.",
    },
    items: ["React", "Next.js", "React Native", "Expo", "TypeScript", "Tailwind CSS", "Zustand"],
  },
  {
    id: "backend",
    icon: "backend",
    title: { tr: "Backend & Database", en: "Backend & Database" },
    description: {
      tr: "Ölçeklenebilir API'ler ve sağlam veri katmanları.",
      en: "Scalable APIs and solid data layers.",
    },
    items: [
      "Node.js",
      "Express.js",
      "Spring Boot",
      "Python",
      "Flask",
      "Drizzle ORM",
      "PostgreSQL",
      "MS SQL",
      "MongoDB",
    ],
  },
  {
    id: "ai",
    icon: "ai",
    title: { tr: "AI & Computer Vision", en: "AI & Computer Vision" },
    description: {
      tr: "LLM tabanlı sistemler ve gerçek zamanlı görüntü işleme.",
      en: "LLM-powered systems and real-time vision.",
    },
    items: [
      { tr: "RAG Mimarileri", en: "RAG Architectures" },
      "Google Gemini API",
      "Groq API",
      "YOLOv8/v11",
      "Deep Learning (EfficientNet)",
      "Gradio",
    ],
  },
];
