// Projects — type definitions only.
// Entries live as individual files in /content/projects/, edited by hand
// or through the CMS at /admin. See src/lib/content.ts for how they're
// read and turned into Project[].

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string; // path under /public, e.g. "/uploads/my-project.jpg"
  sc: string; // source code link
  live?: string; // live demo link, optional
}
