// Sits above the global WebGL canvas (-z-50) and below page content (z-10),
// giving Blog its own calmer, editorial background instead of the
// animated gradient used everywhere else.
export default function BlogBackdrop() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ backgroundColor: "var(--blog-background)" }}
    />
  );
}
