import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getResearchItems } from "@/lib/content";
import ResearchArchive from "@/components/sections/ResearchArchive";
import ResearchBackdrop from "@/components/ui/ResearchBackdrop";

export const metadata: Metadata = {
  title: "Research & Analysis",
  description:
    "Sell-side equity, venture, and currency research, plus the financial models behind it.",
};

export default function ResearchPage() {
  const items = getResearchItems();

  return (
    <div className="relative w-full min-h-screen px-6 sm:px-12 md:px-24 pt-36 pb-24 z-10 text-zinc-100">
      <ResearchBackdrop />
      <Link
        href="/"
        className="cursor-target inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors mb-12 md:mb-16"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back home
      </Link>

      <p className="about-label font-sans text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-4">
        03 // Research &amp; Analysis
      </p>
      <h1 className="font-display text-[10vw] sm:text-[7vw] md:text-[4.5vw] leading-[0.95] tracking-tighter text-white uppercase mb-10 md:mb-14">
        The Archive
      </h1>

      <ResearchArchive items={items} />
    </div>
  );
}
