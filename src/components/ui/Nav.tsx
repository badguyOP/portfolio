"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-8 md:top-12 right-4 sm:right-8 md:right-16 lg:right-24 z-[100]">
      {/* Desktop */}
      <ul className="hidden sm:flex items-center gap-6 md:gap-8 mix-blend-difference">
        {LINKS.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href.split("#")[0]) && link.href !== "/#contact";
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`cursor-target font-sans text-[10px] md:text-xs uppercase tracking-widest transition-opacity hover:opacity-70 ${
                  isActive ? "text-white" : "text-gray-400"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile */}
      <div className="sm:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="cursor-target flex items-center justify-center w-9 h-9 text-white mix-blend-difference"
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
        {open && (
          <ul className="absolute top-12 right-0 flex flex-col items-end gap-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="cursor-target font-sans text-xs uppercase tracking-widest text-white whitespace-nowrap"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
