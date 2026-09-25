import type { Localized, MaybeLocalized } from "@/lib/i18n/config";

export type ExperienceKind = "work" | "achievement" | "research";

export interface ExperienceItem {
  id: string;
  kind: ExperienceKind;
  organization: Localized;
  role: Localized;
  period: Localized;
  highlights: Localized[];
  tech: MaybeLocalized[];
}

/** Listed chronologically, oldest first. */
export const experience: ExperienceItem[] = [
  {
    id: "tubitak-2209a",
    kind: "research",
    organization: {
      tr: "TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projeleri Destekleme Programı",
      en: "TÜBİTAK 2209-A University Students Research Projects Support Program",
    },
    role: { tr: "Proje Yürütücüsü", en: "Principal Investigator" },
    period: { tr: "2024-2025 Akademik Yılı", en: "2024-2025 Academic Year" },
    highlights: [
      {
        tr: "Derin öğrenme tabanlı akıllı tarımsal zararlı tespiti üzerine akademik araştırma, model eğitimi ve mobil uygulama entegrasyonu.",
        en: "Academic research on deep learning-based smart agricultural pest detection, covering model training and mobile app integration.",
      },
    ],
    tech: ["Python", "Deep Learning", "EfficientNetV2S", "Flask", "React Native"],
  },
  {
    id: "robust-design",
    kind: "work",
    organization: { tr: "Robust Design", en: "Robust Design" },
    role: {
      tr: "Yazılım Mühendisliği Stajyeri",
      en: "Software Engineering Intern",
    },
    period: { tr: "Yaz 2025", en: "Summer 2025" },
    highlights: [
      {
        tr: "Yazılım geliştirme yaşam döngüsü (SDLC), modern uygulama mimarileri ve mühendislik pratikleri üzerine aktif proje geliştirme ve takım çalışması deneyimi.",
        en: "Hands-on project development and teamwork across the software development life cycle (SDLC), modern application architectures and engineering practices.",
      },
    ],
    tech: [
      {
        tr: "Web & Yazılım Geliştirme Teknolojileri",
        en: "Web & Software Development Technologies",
      },
      "Git",
      { tr: "Çevik (Agile) Metodolojiler", en: "Agile Methodologies" },
    ],
  },
  {
    id: "milsoft",
    kind: "work",
    organization: {
      tr: "MilSOFT Yazılım Teknolojileri A.Ş.",
      en: "MilSOFT Software Technologies Inc.",
    },
    role: {
      tr: "Yazılım Mühendisliği Stajyeri",
      en: "Software Engineering Intern",
    },
    period: { tr: "Yaz 2026", en: "Summer 2026" },
    highlights: [
      {
        tr: "Kurumsal düzeyde uçtan uca Diş Kliniği Randevu Yönetim Sistemi geliştirilmesi.",
        en: "Built an enterprise-grade, end-to-end Dental Clinic Appointment Management System.",
      },
    ],
    tech: ["Java", "Spring Boot", "React", "RESTful API"],
  },
  {
    id: "teknofest",
    kind: "achievement",
    organization: {
      tr: "TEKNOFEST 2026 Savaşan İHA Finalisti",
      en: "TEKNOFEST 2026 Fighter UAV Finalist",
    },
    role: {
      tr: "Tanyeli SİHA – Yazılım Ekibi Üyesi",
      en: "Tanyeli SİHA – Software Team Member",
    },
    period: { tr: "2026", en: "2026" },
    highlights: [
      {
        tr: "Otonom uçuş sistemleri ve gerçek zamanlı nesne tespiti.",
        en: "Autonomous flight systems and real-time object detection.",
      },
      {
        tr: "Yer Kontrol İstasyonu (YKİ) arayüzü geliştirilmesi.",
        en: "Ground Control Station (GCS) interface development.",
      },
      {
        tr: "Yarışma sunucusu ile API entegrasyonları.",
        en: "API integrations with the competition server.",
      },
    ],
    tech: [
      "Python",
      "YOLOv8 & YOLOv11",
      "NVIDIA Jetson Orin",
      { tr: "Görüntü İşleme", en: "Image Processing" },
    ],
  },
];
