// Research & Analysis — type definitions only.
// The actual entries now live as individual files in /content/research/,
// edited either by hand or through the CMS at /admin. See
// src/lib/content.ts for how they're read and turned into ResearchItem[].

export type ResearchType =
  | "Sell-Side Equity"
  | "Venture"
  | "Currency / FX"
  | "Financial Model";

export type AttachmentFileType = "PDF" | "Excel" | "Link";

export interface ResearchAttachment {
  label: string; // e.g. "Full Report", "Financial Model"
  fileType: AttachmentFileType;
  href: string; // resolved from the CMS's uploaded file or external link
}

export interface ResearchItem {
  id: string;
  title: string;
  type: ResearchType;
  coverage: string; // ticker, sector, or fund/company covered
  summary: string;
  date: string; // ISO date, e.g. "2026-08-01"
  /** Path under /public, e.g. "/uploads/report1.jpg". Unset shows a styled placeholder. */
  image?: string;
  /** One entry can carry any number of files — a PDF write-up, an Excel
   * model, a link, all three, whatever the report needs. */
  attachments: ResearchAttachment[];
  featured?: boolean;
}

export const researchTypes: ResearchType[] = [
  "Sell-Side Equity",
  "Venture",
  "Currency / FX",
  "Financial Model",
];
