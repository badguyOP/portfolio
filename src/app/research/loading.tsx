import ResearchBackdrop from "@/components/ui/ResearchBackdrop";

export default function Loading() {
  return (
    <div className="relative w-full min-h-screen px-6 sm:px-12 md:px-24 pt-36 pb-24 z-10">
      <ResearchBackdrop />

      <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-16" />
      <div className="h-4 w-40 bg-white/10 rounded animate-pulse mb-4" />
      <div className="h-14 w-64 bg-white/10 rounded animate-pulse mb-14" />

      <div className="flex flex-wrap gap-3 mb-14">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-28 bg-white/10 rounded-full animate-pulse" />
        ))}
      </div>

      <div className="w-full border-t border-white/15">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-6 py-6 border-b border-white/15">
            <div className="h-3 w-24 bg-white/10 rounded animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" />
            </div>
            <div className="h-3 w-20 bg-white/10 rounded animate-pulse shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
