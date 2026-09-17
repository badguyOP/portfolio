import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/content";
import BlogBackdrop from "@/components/ui/BlogBackdrop";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on markets, building, and everything in between.",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="relative w-full min-h-screen px-6 sm:px-12 md:px-24 pt-36 pb-24 z-10 text-zinc-100">
      <BlogBackdrop />

      <Link
        href="/"
        className="cursor-target inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors mb-12 md:mb-16"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back home
      </Link>

      <p className="about-label font-sans text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-4">
        04 // Writing
      </p>
      <h1 className="font-display text-[10vw] sm:text-[7vw] md:text-[4.5vw] leading-[0.95] tracking-tighter text-white uppercase mb-10 md:mb-16">
        All Posts
      </h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="cursor-target group flex flex-col gap-2 py-6 border-b border-white/15"
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
    </div>
  );
}
