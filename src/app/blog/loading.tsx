import BlogBackdrop from "@/components/ui/BlogBackdrop";

export default function Loading() {
  return (
    <div className="relative w-full min-h-screen px-6 sm:px-12 md:px-24 pt-36 pb-24 z-10">
      <BlogBackdrop />

      <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-16" />
      <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-4" />
      <div className="h-14 w-56 bg-white/10 rounded animate-pulse mb-16" />

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-3 py-6 border-b border-white/15">
            <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
            <div className="h-6 w-4/5 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
