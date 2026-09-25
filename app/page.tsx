import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/ui/SkipLink";

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
      </main>
      <Footer />
    </>
  );
}
