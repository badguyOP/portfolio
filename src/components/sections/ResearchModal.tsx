"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Download, X } from "lucide-react";
import { ResearchItem, ResearchAttachment } from "@/data/research";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

function AttachmentRow({ attachment }: { attachment: ResearchAttachment }) {
  const hasRealLink = !!attachment.href && attachment.href !== "#";
  const isDownload = attachment.fileType === "PDF" || attachment.fileType === "Excel";

  // Excel can't be previewed natively in a browser tab like a PDF can, so
  // "View" for Excel routes through Google's free public viewer instead.
  const viewHref =
    attachment.fileType === "Excel" && hasRealLink && typeof window !== "undefined"
      ? `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + attachment.href)}&embedded=true`
      : attachment.href;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-white/10 last:border-b-0">
      <div>
        <p className="font-sans text-sm md:text-base text-zinc-100">{attachment.label}</p>
        <p className="font-sans text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">
          {attachment.fileType}
        </p>
      </div>

      {!hasRealLink ? (
        <span className="font-sans text-xs uppercase tracking-widest text-zinc-500 border border-white/10 rounded-full px-5 py-3 shrink-0">
          Not uploaded yet
        </span>
      ) : (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {(attachment.fileType === "PDF" || attachment.fileType === "Excel") && (
            <a
              href={viewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target group flex items-center justify-center gap-2 px-5 py-3 bg-white/10 text-white border border-white/20 rounded-full font-sans uppercase text-xs tracking-wider font-bold transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white hover:text-black"
            >
              View
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          )}
          <a
            href={attachment.href}
            target="_blank"
            rel="noopener noreferrer"
            download={isDownload}
            className="cursor-target group flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white rounded-full font-sans uppercase text-xs tracking-wider font-bold transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white hover:text-black"
          >
            {isDownload ? (
              <>
                Download <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
              </>
            ) : (
              <>
                View <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </>
            )}
          </a>
        </div>
      )}
    </div>
  );
}

export default function ResearchModal({
  item,
  onClose,
}: {
  item: ResearchItem | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = item ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [item]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-lg pointer-events-auto"
        >
          <div className="absolute inset-0 z-0 cursor-pointer" onClick={onClose} />

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            onClick={onClose}
            className="cursor-target absolute top-6 right-6 md:top-8 md:right-8 z-50 p-3 bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/20 transition-colors"
          >
            <X size={20} strokeWidth={2} />
          </motion.button>

          <div className="relative z-10 w-full max-w-4xl px-6 md:px-12 flex flex-col justify-center max-h-screen overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-auto flex flex-col w-full pb-20 pt-20"
            >
              <span className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-accent text-center mb-4">
                {item.type}
              </span>

              <h1 className="font-display text-3xl sm:text-4xl md:text-6xl tracking-tighter mb-8 md:mb-10 text-center uppercase text-zinc-100">
                {item.title}
              </h1>

              <div className="relative w-full aspect-video md:aspect-[21/9] bg-zinc-900 rounded-2xl md:rounded-3xl overflow-hidden mb-8 md:mb-12 shadow-2xl border border-white/10">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-90" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
                    <span className="font-accent italic text-2xl md:text-4xl text-zinc-600">{item.type}</span>
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="flex-1">
                  <h2 className="text-lg md:text-2xl font-sans uppercase tracking-tight mb-3 text-zinc-100">
                    {item.coverage}
                  </h2>
                  <p className="text-zinc-400 text-sm md:text-base font-sans">{item.summary}</p>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest font-sans mt-4">
                    {formatDate(item.date)}
                  </p>
                </div>

                <div className="md:w-[380px] shrink-0">
                  {item.attachments.length === 0 ? (
                    <p className="font-sans text-xs uppercase tracking-widest text-zinc-500">
                      No files attached yet
                    </p>
                  ) : (
                    item.attachments.map((attachment, i) => <AttachmentRow key={i} attachment={attachment} />)
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
