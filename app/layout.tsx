import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { siteConfig } from "@/data/site";
import { Providers } from "./providers";
import "./globals.css";

const title = "Begüm Handan Demir — Full-Stack, Mobil & AI Yazılım Mühendisi";
const description =
  "Samsun Üniversitesi Yazılım Mühendisliği son sınıf öğrencisi. Ölçeklenebilir web/mobil uygulamalar, RAG mimarileri ve bilgisayarlı görü sistemleri geliştiriyorum.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: title,
    template: `%s | ${siteConfig.name}`,
  },
  description,
  applicationName: `${siteConfig.name} Portfolio`,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  keywords: [
    "Begüm Handan Demir",
    "Yazılım Mühendisi",
    "Software Engineer",
    "Full-Stack",
    "React Native",
    "Next.js",
    "RAG",
    "Computer Vision",
    "YOLO",
    "Portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title,
    description,
    locale: "tr_TR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-ink font-sans text-zinc-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
