// Reads /content/research/*.json and /content/blog/*.md from disk and turns
// them into the same ResearchItem[] / BlogPost[] shapes the site already
// uses. This is the one place that knows the CMS writes plain files — every
// component downstream just gets an array of typed objects, same as before.
//
// Only import this from server components (it uses Node's `fs`).

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ResearchItem, ResearchType, ResearchAttachment, AttachmentFileType } from "@/data/research";
import { BlogPost } from "@/data/blog";
import { Project } from "@/data/projects";

const RESEARCH_DIR = path.join(process.cwd(), "content", "research");
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export function getResearchItems(): ResearchItem[] {
  if (!fs.existsSync(RESEARCH_DIR)) return [];

  const items = fs
    .readdirSync(RESEARCH_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(RESEARCH_DIR, file), "utf-8");
      const data = JSON.parse(raw);
      const id = file.replace(/\.json$/, "");

      const attachments: ResearchAttachment[] = Array.isArray(data.attachments)
        ? data.attachments.map((a: { label?: string; fileType?: AttachmentFileType; file?: string; externalLink?: string }) => ({
            label: a.label || "Report",
            fileType: (a.fileType || "Link") as AttachmentFileType,
            href: a.file || a.externalLink || "#",
          }))
        : [];

      return {
        id,
        title: data.title,
        type: data.type as ResearchType,
        coverage: data.coverage,
        summary: data.summary,
        date: data.date,
        image: data.image || undefined,
        attachments,
      } as ResearchItem;
    });

  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const posts = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.md$/, "");

      return {
        id: slug,
        slug,
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        readTime: data.readTime,
        tag: data.tag,
        cover: data.cover || undefined,
        content,
      } as BlogPost;
    });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const ranked = fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf-8");
      const data = JSON.parse(raw);
      const id = file.replace(/\.json$/, "");

      const project: Project = {
        id,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        image: data.image,
        sc: data.sc,
        live: data.live || undefined,
      };

      const order = typeof data.order === "number" ? data.order : 999;
      return { project, order };
    });

  return ranked.sort((a, b) => a.order - b.order).map((r) => r.project);
}
