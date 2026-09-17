import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import ResearchPreview from "@/components/sections/ResearchPreview";
import BlogPreview from "@/components/sections/BlogPreview";
import Contact from "@/components/sections/Contact";
import { getResearchItems, getBlogPosts, getProjects } from "@/lib/content";

export default function Home() {
  const research = getResearchItems();
  const posts = getBlogPosts();
  const projects = getProjects();

  return (
    <div className="w-full">
      <Hero />
      <About />
      <Projects projects={projects} />
      <ResearchPreview items={research} />
      <BlogPreview posts={posts} />
      <Contact />
    </div>
  );
}
