import type { Locale } from "./config";

const tr = {
  nav: {
    about: "Hakkımda",
    experience: "Deneyim",
    projects: "Projeler",
    skills: "Yetenekler",
    contact: "İletişime Geç",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    language: "Dil seçimi",
    skipToContent: "İçeriğe geç",
    home: "Sayfanın başına dön",
  },
  hero: {
    badge: "Full-Stack & AI projeleri için açık",
    greeting: "Merhaba, ben",
    subtitle: "Full-Stack, Mobil ve Yapay Zeka Odaklı Yazılım Mühendisi.",
    description:
      "Samsun Üniversitesi Yazılım Mühendisliği son sınıf öğrencisiyim. Ölçeklenebilir web/mobil uygulamalar, RAG mimarileri ve bilgisayarlı görü (Computer Vision) sistemleri geliştiriyorum.",
    photoAlt: "Begüm Handan Demir profil fotoğrafı",
    ctaProjects: "Projeleri İncele",
    ctaCv: "CV İndir",
    github: "GitHub profili (yeni sekmede açılır)",
    linkedin: "LinkedIn profili (yeni sekmede açılır)",
  },
  experience: {
    eyebrow: "Deneyim",
    title: "Deneyim & Başarılar",
    description: "Kurumsal yazılım geliştirmeden otonom İHA sistemlerine uzanan yolculuğum.",
    kinds: { work: "Staj", achievement: "Başarı", research: "Araştırma" },
  },
  projects: {
    eyebrow: "Projeler",
    title: "Seçili Projeler",
    description: "Fikirden ürüne: yapay zeka destekli mobil uygulamalar ve veri odaklı sistemler.",
    filterLabel: "Projeleri kategoriye göre filtrele",
    source: "Kaynak kodu",
    demo: "Canlı Demo",
    empty: "Bu kategoride yakında yeni projeler olacak.",
    emptyHint: "Şu an üzerinde çalışıyorum — takipte kalın.",
  },
  skills: {
    eyebrow: "Yetenekler",
    title: "Teknik Yetkinlikler",
    description: "Projelerimde aktif olarak kullandığım teknolojiler ve araçlar.",
  },
  contact: {
    eyebrow: "İletişim",
    title: "Birlikte bir şeyler inşa edelim.",
    description:
      "Staj, iş birliği ya da bir proje fikri hakkında konuşmak isterseniz mesaj bırakabilir veya doğrudan e-posta gönderebilirsiniz.",
    emailLabel: "E-posta",
    copyEmail: "E-postamı Kopyala",
    copied: "Kopyalandı ✓",
    socials: "Sosyal medya",
    form: {
      name: "İsim",
      namePlaceholder: "Adınız Soyadınız",
      email: "E-posta",
      emailPlaceholder: "ornek@eposta.com",
      message: "Mesaj",
      messagePlaceholder: "Merhaba Begüm, ...",
      submit: "Mesajı Gönder",
      submitting: "Gönderiliyor…",
    },
    errors: {
      nameRequired: "Lütfen isminizi girin.",
      nameShort: "İsim en az 2 karakter olmalı.",
      emailRequired: "Lütfen e-posta adresinizi girin.",
      emailInvalid: "Geçerli bir e-posta adresi girin.",
      messageRequired: "Lütfen bir mesaj yazın.",
      messageShort: "Mesaj en az 10 karakter olmalı.",
    },
    toast: {
      title: "Mesajınız alındı",
      body: "Teşekkürler! En kısa sürede size dönüş yapacağım.",
      dismiss: "Bildirimi kapat",
    },
  },
  footer: {
    rights: "Tüm hakları saklıdır.",
    built: "Next.js, Tailwind CSS & Framer Motion ile geliştirildi.",
  },
};

export type Dictionary = typeof tr;

const en: Dictionary = {
  nav: {
    about: "About",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    contact: "Get in Touch",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    skipToContent: "Skip to content",
    home: "Back to top",
  },
  hero: {
    badge: "Open to Full-Stack & AI projects",
    greeting: "Hi, I'm",
    subtitle: "Software Engineer focused on Full-Stack, Mobile and AI.",
    description:
      "I'm a senior Software Engineering student at Samsun University. I build scalable web/mobile applications, RAG architectures and Computer Vision systems.",
    photoAlt: "Portrait of Begüm Handan Demir",
    ctaProjects: "View Projects",
    ctaCv: "Download CV",
    github: "GitHub profile (opens in a new tab)",
    linkedin: "LinkedIn profile (opens in a new tab)",
  },
  experience: {
    eyebrow: "Experience",
    title: "Experience & Achievements",
    description: "A journey from enterprise software development to autonomous UAV systems.",
    kinds: { work: "Internship", achievement: "Achievement", research: "Research" },
  },
  projects: {
    eyebrow: "Projects",
    title: "Selected Projects",
    description: "From idea to product: AI-powered mobile apps and data-driven systems.",
    filterLabel: "Filter projects by category",
    source: "Source code",
    demo: "Live Demo",
    empty: "New projects in this category are coming soon.",
    emptyHint: "Currently in the works — stay tuned.",
  },
  skills: {
    eyebrow: "Skills",
    title: "Technical Skills",
    description: "Technologies and tools I actively use in my projects.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's build something together.",
    description:
      "Whether it's an internship, a collaboration or a project idea, feel free to leave a message or email me directly.",
    emailLabel: "Email",
    copyEmail: "Copy my Email",
    copied: "Copied ✓",
    socials: "Social media",
    form: {
      name: "Name",
      namePlaceholder: "Your full name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      message: "Message",
      messagePlaceholder: "Hi Begüm, ...",
      submit: "Send Message",
      submitting: "Sending…",
    },
    errors: {
      nameRequired: "Please enter your name.",
      nameShort: "Name must be at least 2 characters.",
      emailRequired: "Please enter your email address.",
      emailInvalid: "Please enter a valid email address.",
      messageRequired: "Please write a message.",
      messageShort: "Message must be at least 10 characters.",
    },
    toast: {
      title: "Message received",
      body: "Thank you! I'll get back to you as soon as possible.",
      dismiss: "Dismiss notification",
    },
  },
  footer: {
    rights: "All rights reserved.",
    built: "Built with Next.js, Tailwind CSS & Framer Motion.",
  },
};

export const translations: Record<Locale, Dictionary> = { tr, en };
