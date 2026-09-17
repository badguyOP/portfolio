"use client";

import { useEffect, useState } from "react";
import { ResearchItem, ResearchType, researchTypes } from "@/data/research";
import ResearchModal from "@/components/sections/ResearchModal";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function ResearchArchive({ items: allItems }: { items: ResearchItem[] }) {
  const [filter, setFilter] = useState<ResearchType | "All">("All");
  const [activeItem, setActiveItem] = useState<ResearchItem | null>(null);

  // Auto-open a report if we arrived via /research#id (e.g. from the homepage preview)
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const match = allItems.find((r) => r.id === id);
    if (match) setActiveItem(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openItem = (item: ResearchItem) => {
    window.history.replaceState(null, "", `#${item.id}`);
    setActiveItem(item);
  };

  const closeItem = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setActiveItem(null);
  };

  const items = filter === "All" ? allItems : allItems.filter((r) => r.type === filter);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-10 md:mb-14">
        {(["All", ...researchTypes] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`cursor-target font-sans text-[10px] md:text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${
              filter === type
                ? "bg-accent border-accent text-white"
                : "border-white/20 text-zinc-400 hover:text-white hover:border-white/40"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="w-full border-t border-white/15">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => openItem(item)}
            className="cursor-target group flex flex-col md:flex-row md:items-center gap-2 md:gap-6 py-5 md:py-6 border-b border-white/15 transition-colors hover:bg-white/5 px-2 md:px-4 -mx-2 md:-mx-4 w-[calc(100%+1rem)] md:w-[calc(100%+2rem)] text-left"
          >
            <span className="font-sans text-[10px] uppercase tracking-widest text-accent md:w-40 shrink-0">
              {item.type}
            </span>
            <div className="flex-1">
              <p className="font-sans text-base md:text-xl text-zinc-100 tracking-tight">{item.title}</p>
              <p className="font-sans text-sm text-zinc-500 mt-1">{item.summary}</p>
            </div>
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 md:w-24 shrink-0">
              {item.coverage}
            </span>
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 md:w-28 shrink-0">
              {formatDate(item.date)}
            </span>
          </button>
        ))}
        {items.length === 0 && (
          <p className="py-10 font-sans text-sm text-zinc-500">Nothing in this category yet.</p>
        )}
      </div>

      <ResearchModal item={activeItem} onClose={closeItem} />
    </>
  );
}
