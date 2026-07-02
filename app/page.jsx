import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { FeaturedWorks } from "@/sections/FeaturedWorks";
import { Hero } from "@/sections/Hero";
import { ResumeDownload } from "@/sections/ResumeDownload";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <FeaturedWorks />
        <About />
        <Contact />
        <ResumeDownload />
        <Footer />
      </main>
    </>
  );
}
