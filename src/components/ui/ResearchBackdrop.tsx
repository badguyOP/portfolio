// Sits above the global WebGL canvas (-z-50) and below page content (z-10),
// giving Research its own calmer, "archive" background — a different tone
// from Blog's navy so the two sections still read as distinct.
export default function ResearchBackdrop() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ backgroundColor: "var(--research-background)" }}
    />
  );
}
