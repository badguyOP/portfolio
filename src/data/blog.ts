// Blog — type definitions only.
// The actual posts now live as individual markdown files in /content/blog/,
// edited either by hand or through the CMS at /admin. `content` is the
// post's markdown body (frontmatter fields become everything else). See
// src/lib/content.ts for how files are read and turned into BlogPost[].

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO date
  readTime: string; // e.g. "6 min read"
  tag: string;
  cover?: string; // path under /public, e.g. "/uploads/my-post-cover.jpg"
  content: string; // markdown body, images included inline
}
