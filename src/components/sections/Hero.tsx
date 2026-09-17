"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLoad } from "@/context/LoadContext";
import { isFirefox } from "@/utils/detectBrowser";

export default function Hero() {
  const { isLoaded } = useLoad();
  const containerRef = useRef<HTMLDivElement>(null);
  // Firefox desktop's compositor is much slower at mix-blend-difference,
  // especially over a full-screen animated WebGL canvas. Dropping the
  // blend mode on Firefox removes the per-frame re-composite that causes
  // the stutter; text falls back to solid white (still readable on the
  // dark shader background). Chrome/Safari/mobile keep the blend look.
  const [dropBlend, setDropBlend] = useState(false);
  useEffect(() => {
    setDropBlend(isFirefox());
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".reveal-text");

      gsap.fromTo(
        lines,
        { yPercent: 120, opacity: 0, rotateZ: 3 },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
          delay: 0.2,
        }
      );

      gsap.fromTo(
        ".fade-in-ui",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power2.out", delay: 1 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Top UI */}
      <div className={`absolute top-8 md:top-12 left-4 sm:left-8 md:left-16 lg:left-24 flex justify-start w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] md:w-[calc(100%-8rem)] lg:w-[calc(100%-12rem)] fade-in-ui ${dropBlend ? "" : "mix-blend-difference"}`}>
        <p className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-gray cursor-target">
          Anish Chandra
        </p>
      </div>

      {/* Main Massive Typography - ANTI-CROP LAYOUT */}
      <div className={`flex flex-col justify-center w-full z-10 ${dropBlend ? "" : "mix-blend-difference"} pointer-events-none mt-8 md:mt-0`}>

        {/* Line 1: Left Aligned */}
        <div className="overflow-hidden flex self-start z-30">
          <h1 className="reveal-text font-display text-[12vw] sm:text-[10vw] md:text-[10vw] leading-none tracking-tighter text-white uppercase pb-[2vw]">
            Complexity
          </h1>
        </div>

        {/* Line 2: Center Aligned 
            - Added py-[4vw] to protect the 'g' and 'i' from being chopped.
            - Added -mt-[6vw] to pull it tightly up against the lines around it. */}
        <div className="overflow-hidden flex self-center z-20 -mt-[6vw] md:-mt-[4vw]">
          <h1 className="reveal-text -webkit-text-stroke: 1px white; font-accent italic text-[14vw] sm:text-[12vw] md:text-[11vw] leading-none text-accent tracking-tight lowercase py-[4vw] px-[4vw]" style={{ WebkitTextStroke: "0.03px white" }}>
            into
          </h1>
        </div>

        {/* Line 3: Right Aligned 
            - Added -mt-[6vw] to pull it tightly up against the line above. */}
        <div className="overflow-hidden flex self-end z-10 -mt-[6vw] md:-mt-[4vw]">
          <h1 className="reveal-text font-agno text-[12vw] sm:text-[10vw] md:text-[13vw] leading-none tracking-tighter text-white uppercase pt-[2vw]">
            Clarity
          </h1>
        </div>

        {/* Current focus line — swap this for whatever you're actively working on */}
        <div className="overflow-hidden flex self-center mt-[3vw] md:mt-[1.5vw]">
          <p className="fade-in-ui font-sans text-[3.2vw] sm:text-[2vw] md:text-[1.1vw] uppercase tracking-[0.15em] text-center text-white/70 px-[4vw] pointer-events-auto cursor-target">
            Currently: building, operating &amp; analyzing — open to roles at the intersection of strategy and execution
          </p>
        </div>

      </div>

      {/* Bottom UI */}
      <div className={`absolute bottom-8 md:bottom-12 right-4 sm:right-8 md:right-16 lg:right-24 fade-in-ui ${dropBlend ? "" : "mix-blend-difference"}`}>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-8 md:w-12 h-[1px] bg-white/50" />
          <p className="cursor-target font-sans text-[10px] md:text-xs uppercase tracking-widest text-white">
            Scroll to explore
          </p>
        </div>
      </div>
    </section>
  );
}