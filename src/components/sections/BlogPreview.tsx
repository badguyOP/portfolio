"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { BlogPost } from "@/data/blog";

gsap.registerPlugin(ScrollTrigger);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const latest = posts.slice(0, 4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".blog-card",
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
        ".blog-label",
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
          <p className="blog-label about-label font-sans text-xs md:text-sm uppercase tracking-widest text-gray-400">
            04 // Writing
          </p>
        </div>
        <div className="md:col-span-8">
          <h2 className="blog-label font-display text-[8vw] sm:text-[5vw] md:text-[3.2vw] leading-[0.95] tracking-tighter text-white uppercase">
            Notes on markets, building{" "}
            <span className="font-accent italic text-accent lowercase">and everything between.</span>
          </h2>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        {latest.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="blog-card cursor-target group flex flex-col gap-2 py-6 border-b border-white/15"
          >
            <div className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-widest text-zinc-500">
              <span className="text-accent">{post.tag}</span>
              <span>·</span>
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <h3 className="font-sans text-lg md:text-xl text-zinc-100 tracking-tight group-hover:text-accent transition-colors">
              {post.title}
            </h3>
            <p className="font-sans text-sm text-zinc-500 line-clamp-2">{post.excerpt}</p>
            <span className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors mt-1">
              Read
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/blog"
        className="blog-card cursor-target group inline-flex items-center gap-2 mt-8 md:mt-10 font-sans text-xs md:text-sm uppercase tracking-widest text-zinc-300 hover:text-white transition-colors w-fit"
      >
        View all posts
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </Link>
    </section>
  );
}
