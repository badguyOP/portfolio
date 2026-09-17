"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { ResearchItem } from "@/data/research";

gsap.registerPlugin(ScrollTrigger);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });

export default function ResearchPreview({ items }: { items: ResearchItem[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const latest = items.slice(0, 4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".research-row",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" },
        }
      );
      gsap.fromTo(
        ".research-label",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, scrollTrigger: { trigger: containerRef.current, start: "top 85%" } }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 z-10"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-10 md:mb-14">
        <div className="md:col-span-4">
          <p className="research-label about-label font-sans text-xs md:text-sm uppercase tracking-widest text-gray-400">
            03 // Research &amp; Analysis
          </p>
        </div>
        <div className="md:col-span-8">
          <h2 className="research-label font-display text-[8vw] sm:text-[5vw] md:text-[3.2vw] leading-[0.95] tracking-tighter text-white uppercase">
            Sell-side, venture &amp; FX research —{" "}
            <span className="font-accent italic text-accent lowercase">plus the models behind it.</span>
          </h2>
        </div>
      </div>

      <div className="w-full border-t border-white/15">
        {latest.map((item) => (
          <Link
            key={item.id}
            href={`/research#${item.id}`}
            className="research-row cursor-target group flex flex-col md:flex-row md:items-center gap-2 md:gap-6 py-5 md:py-6 border-b border-white/15 transition-colors hover:bg-white/5 px-2 md:px-4 -mx-2 md:-mx-4"
          >
            <span className="font-sans text-[10px] uppercase tracking-widest text-accent md:w-40 shrink-0">
              {item.type}
            </span>
            <span className="flex-1 font-sans text-base md:text-xl text-zinc-100 tracking-tight">
              {item.title}
            </span>
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 md:w-24 shrink-0">
              {formatDate(item.date)}
            </span>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white shrink-0" />
          </Link>
        ))}
      </div>

      <Link
        href="/research"
        className="research-row cursor-target group inline-flex items-center gap-2 mt-8 md:mt-10 font-sans text-xs md:text-sm uppercase tracking-widest text-zinc-300 hover:text-white transition-colors w-fit"
      >
        View all research
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </Link>
    </section>
  );
}
