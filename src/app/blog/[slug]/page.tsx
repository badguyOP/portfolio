import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/content";
import BlogBackdrop from "@/components/ui/BlogBackdrop";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPosts().find((p) => p.slug === params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: post.cover
      ? { title: post.title, description: post.excerpt, images: [{ url: post.cover }] }
      : { title: post.title, description: post.excerpt },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPosts().find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <article className="relative w-full min-h-screen px-6 sm:px-12 md:px-24 pt-36 pb-24 z-10 text-zinc-100">
      <BlogBackdrop />

      <Link
        href="/blog"
        className="cursor-target inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors mb-12 md:mb-16"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All posts
      </Link>

      <div className="flex items-center gap-3 font-sans text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 mb-6">
        <span className="text-accent">{post.tag}</span>
        <span>·</span>
        <span>{formatDate(post.date)}</span>
        <span>·</span>
        <span>{post.readTime}</span>
      </div>

      <h1 className="font-display text-[9vw] sm:text-[6vw] md:text-[3.6vw] leading-[1] tracking-tighter text-white uppercase mb-10 md:mb-14 max-w-4xl">
        {post.title}
      </h1>

      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover}
          alt={post.title}
          className="w-full max-w-3xl aspect-video object-cover rounded-2xl mb-10 md:mb-14 border border-white/10"
        />
      )}

      <div className="max-w-2xl">
        <ReactMarkdown
          components={{
            p: ({ ...props }) => (
              <p className="font-sans text-base md:text-lg leading-relaxed text-zinc-300 mb-6" {...props} />
            ),
            h1: ({ ...props }) => (
              <h2 className="font-display text-2xl md:text-4xl uppercase tracking-tight text-white mt-10 mb-4" {...props} />
            ),
            h2: ({ ...props }) => (
              <h3 className="font-sans text-xl md:text-2xl uppercase tracking-tight text-white mt-8 mb-3" {...props} />
            ),
            h3: ({ ...props }) => (
              <h4 className="font-sans text-lg uppercase tracking-tight text-white mt-6 mb-2" {...props} />
            ),
            a: ({ ...props }) => (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                className="text-accent underline underline-offset-4 hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            strong: ({ ...props }) => <strong className="text-zinc-100" {...props} />,
            ul: ({ ...props }) => (
              <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-6" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal list-inside text-zinc-300 space-y-2 mb-6" {...props} />
            ),
            blockquote: ({ ...props }) => (
              <blockquote className="border-l-2 border-accent pl-4 italic text-zinc-400 my-6" {...props} />
            ),
            img: ({ alt, ...props }) => (
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img className="w-full rounded-xl border border-white/10 my-8" alt={alt || ""} {...props} />
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
