"use client";

import { useEffect, useRef, useState } from "react";
import { useLoad } from "@/context/LoadContext";
import { StaticImageData } from "next/image";
import MoiraiImage from '../../app/assets/Moirai.jpg';
import NudgeImage from '../../app/assets/Nudge.jpg';
import ChameleonDocsImage from '../../app/assets/ChameleonDocs.jpg';
import ASAPImage from '../../app/assets/ASAP.jpg';
import GlassBoxImage from '../../app/assets/GlassBox.jpg';

const ASSETS_TO_PRELOAD: (string | StaticImageData)[] = [
  MoiraiImage,
  NudgeImage,
  ChameleonDocsImage,
  GlassBoxImage,
  ASAPImage,
];

export default function Preloader() {
  const { isLoaded, setIsLoaded } = useLoad();
  const [mounted, setMounted] = useState(false);

  const preloaderRef = useRef<HTMLDivElement>(null);
  
  // The Shader Hole Element & its inner black cover
  const irisHoleRef = useRef<HTMLDivElement>(null);
  const holeCoverRef = useRef<HTMLDivElement>(null);

  // Typography Refs
  const flexContainerRef = useRef<HTMLDivElement>(null);
  const textRevealContainerRef = useRef<HTMLDivElement>(null);
  const textInnerRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLSpanElement>(null);
  const dotPlaceholderRef = useRef<HTMLDivElement>(null);
  
  // Slurp Targets (We include the non-breaking spaces here so they collapse too)
  const tharvRef = useRef<HTMLSpanElement>(null);
  const space1Ref = useRef<HTMLSpanElement>(null);
  const achchiRef = useRef<HTMLSpanElement>(null);

  // --- MOBILE VERTICAL LAYOUT REFS ---
  // Separate refs so the vertical (mobile-only) animation can move lines
  // independently: ANISH collapses up, CHANDRA collapses down.
  const mobileWrapRef = useRef<HTMLDivElement>(null);       // whole vertical block
  const vAtharvLineRef = useRef<HTMLDivElement>(null);      // "ANISH" line
  const vGachchiLineRef = useRef<HTMLDivElement>(null);     // "CHANDRA" line
  const vAtharvInnerRef = useRef<HTMLSpanElement>(null);   // "ANISH" text
  const vGachchiInnerRef = useRef<HTMLSpanElement>(null);  // "CHANDRA" text
  const vTharvTailRef = useRef<HTMLSpanElement>(null);     // "NISH" tail (mobile)
  const vAchchiTailRef = useRef<HTMLSpanElement>(null);    // "HANDRA" tail (mobile)
  const vSlashRef = useRef<HTMLSpanElement>(null);         // vertical slash
  const vDotRef = useRef<HTMLDivElement>(null);            // vertical dot
  const vSlashDotRowRef = useRef<HTMLDivElement>(null);   // the /. row (mobile)

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded || !mounted) return;

    let loadedCount = 0;
    const totalAssets = ASSETS_TO_PRELOAD.length;

    const runAnimation = async () => {
      try {
        const gsapModule = await import("gsap");
        const gsap = gsapModule.default || gsapModule.gsap;

        // Mobile vs desktop split. Mobile (<640px) uses the vertical stack
        // animation; everything else keeps the original horizontal flow.
        const isMobile = window.innerWidth < 640;

        // The dot we track depends on which layout is active.
        const activeDotRef = isMobile ? vDotRef : dotPlaceholderRef;

        // Initialize completely hidden to prevent flashes.
        // (Both layouts are pre-hidden so neither can flash before the branch.)
        gsap.set(flexContainerRef.current, { opacity: 0 });
        gsap.set(textRevealContainerRef.current, { width: 0 });
        gsap.set(textInnerRef.current, { yPercent: 100, opacity: 0 });
        gsap.set(slashRef.current, { scaleY: 0, opacity: 0, transformOrigin: "bottom" });

        if (isMobile) {
          // Mobile vertical layout initial state.
          gsap.set(mobileWrapRef.current, { opacity: 0 });
          gsap.set(vAtharvInnerRef.current, { yPercent: 100, opacity: 0 });
          gsap.set(vGachchiInnerRef.current, { yPercent: -100, opacity: 0 });
          gsap.set(vSlashRef.current, { scaleY: 0, opacity: 0, transformOrigin: "bottom" });
        } else {
          // --- AUTO-FIT FONT (desktop only) ---
          // Measure the full natural width of "ANISH CHANDRA /." and scale the
          // typography down if it would overflow the viewport. This keeps the
          // horizontal animation IDENTICAL to desktop on every device — only
          // the type size adapts, so the dot always stays on-screen.
          const fitTypography = () => {
            const container = flexContainerRef.current;
            const inner = textInnerRef.current;
            if (!container || !inner) return;
            // Temporarily make the inner text full-width so we can measure it.
            gsap.set(textRevealContainerRef.current, { width: "auto" });
            const naturalWidth = inner.scrollWidth
              + (slashRef.current?.offsetWidth || 0)
              + (dotPlaceholderRef.current?.offsetWidth || 0)
              + 16; // a little slack for margins/gaps
            const targetMax = window.innerWidth * 0.92; // leave 4% margin each side
            if (naturalWidth > targetMax) {
              const scale = targetMax / naturalWidth;
              gsap.set(container, { scale });
            } else {
              gsap.set(container, { scale: 1 });
            }
            // Restore the collapsed state for the animation.
            gsap.set(textRevealContainerRef.current, { width: 0 });
          };
          fitTypography();
        }

        // Set the initial shader box dimensions.
        // On mobile (portrait) we shrink the box so it never exceeds the
        // viewport width — otherwise the 150vmax border pushes the layout
        // and the tracking math off-screen.
        gsap.set(irisHoleRef.current, {
          width: isMobile ? "min(220px, 70vw)" : "min(300px, 60vw)",
          height: isMobile ? "min(300px, 50vh)" : "min(400px, 60vh)",
          borderRadius: "0px",
          xPercent: -50,
          yPercent: -50,
          left: "50%",
          top: "50%"
        });

        // Tracking function: Keeps the shader hole perfectly tethered to the
        // active dot (mobile vertical dot OR desktop horizontal dot).
        // On small screens we clamp the dot's center inside the viewport so the
        // iris never tracks off-frame (which was causing the bleed-out on mobile).
        const trackDot = () => {
          const dot = activeDotRef.current;
          if (!dot || !irisHoleRef.current) return;
          const rect = dot.getBoundingClientRect();
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const margin = 16; // keep a small breathing room from the edge
          const clampedX = Math.min(Math.max(cx, margin), vw - margin);
          const clampedY = Math.min(Math.max(cy, margin), vh - margin);
          gsap.set(irisHoleRef.current, {
            left: clampedX,
            top: clampedY,
          });
        };

        const getDotCenterX = () => {
          const r = activeDotRef.current?.getBoundingClientRect();
          return r ? r.left + r.width / 2 : window.innerWidth / 2;
        };

        const getDotCenterY = () => {
          const r = activeDotRef.current?.getBoundingClientRect();
          return r ? r.top + r.height / 2 : window.innerHeight / 2;
        };

        const tl = gsap.timeline({
          onComplete: () => setIsLoaded(true),
        });

        // 1. Fade in the Shader Box (Opacity of the black cover goes to 0)
        tl.to(holeCoverRef.current, {
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut",
        })
        .to({}, { duration: 0.2 }) // Slight pause

        // 2. Prep the active text container (invisible, but allows dot to position)
        .set(isMobile ? mobileWrapRef.current : flexContainerRef.current, { opacity: 1 })

        // 3. Smoothly Morph the Box into the Dot
        .to(irisHoleRef.current, {
          width: () => activeDotRef.current?.offsetWidth || 15,
          height: () => activeDotRef.current?.offsetHeight || 15,
           left: getDotCenterX,
           top: getDotCenterY,
          borderRadius: "50%",
          duration: 1.4,
          ease: "expo.inOut"
        });

        if (isMobile) {
          // ============ MOBILE VERTICAL ANIMATION ============
          // Layout (centered, stacked):
          //   ANISH
          //   CHANDRA
          //     /.
          // Flow: ANISH whips up from below, CHANDRA whips up from above →
          // pause → ANISH collapses up into A, CHANDRA collapses down into C
          // → the two letters A/C merge to center into AC → iris out from the dot.

          // 4m. Slash appears like a lightsaber (under the stack)
          tl.to(vSlashRef.current, {
            scaleY: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(2)"
          })

          // 5m. ANISH whips up from below into the top line
          .to(vAtharvInnerRef.current, {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            onUpdate: trackDot
          }, "whip")

          // 5m. CHANDRA whips up from above into the bottom line
          .to(vGachchiInnerRef.current, {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            onUpdate: trackDot
          }, "whip+=0.15")

          .to({}, { duration: 1 }) // Readability pause

          // 6m. Slurp: ANISH collapses into "A", CHANDRA collapses into "C".
          //     We clip each line's width down to its leading letter AND fade the
          //     tail (NISH / HANDRA) so it disappears as it gets clipped.
          //     A and C remain because they are separate leading spans that
          //     stay opaque.
          .to(vAtharvLineRef.current, {
            width: () => {
              const firstLetter = vAtharvInnerRef.current?.querySelector("span");
              return (firstLetter as HTMLElement)?.offsetWidth
                || vAtharvInnerRef.current?.offsetWidth || 0;
            },
            duration: 1.0,
            ease: "expo.inOut",
            onUpdate: trackDot
          }, "slurp")
          .to(vGachchiLineRef.current, {
            width: () => {
              const firstLetter = vGachchiInnerRef.current?.querySelector("span");
              return (firstLetter as HTMLElement)?.offsetWidth
                || vGachchiInnerRef.current?.offsetWidth || 0;
            },
            duration: 1.0,
            ease: "expo.inOut",
            onUpdate: trackDot
          }, "slurp")
          // Fade only the tail spans (THARV / ACHCHI) as they clip out.
          .to([vTharvTailRef.current, vAchchiTailRef.current], {
            opacity: 0,
            duration: 0.8,
            ease: "power2.in"
          }, "slurp")

          .to({}, { duration: 0.5 }) // Pause on stacked A / C

          // 6m-merge. Flatten the vertical stack into a single horizontal row
          //          "AC/." using a FLIP technique so the browser's own layout
          //          engine handles all spacing — no hardcoded pixel gaps, so it
          //          works correctly on any screen size.
          //
          // 1. Capture each piece's current (stacked) rect (FIRST).
          // 2. Switch the wrapper to a horizontal flex row (LAST layout).
          // 3. Measure the new rect, compute the inverse delta (INVERT).
          // 4. Animate the delta back to 0 (PLAY) — pieces glide into the row.
          .add(() => {
            const wrap = mobileWrapRef.current;
            const pieces = [
              vAtharvLineRef.current,
              vGachchiLineRef.current,
              vSlashDotRowRef.current,
            ].filter(Boolean) as HTMLElement[];

            // FIRST: capture stacked positions.
            const firstRects = pieces.map((el) => el.getBoundingClientRect());

            // LAST: switch to a single horizontal row. We also align items to
            // the baseline so A/R/G and /. sit on one line like real text.
            // Neutralize the /. row's top margin so it doesn't push its
            // baseline off in the row layout.
            gsap.set(vSlashDotRowRef.current, { marginTop: 0 });
            gsap.set(wrap, {
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "center",
              gap: "0.06em", // natural letter-spacing-ish gap between AC/.
            });

            // INVERT: measure new positions and apply the inverse as x/y so the
            // pieces *appear* to still be in their stacked spots.
            pieces.forEach((el, i) => {
              const lastRect = el.getBoundingClientRect();
              const first = firstRects[i];
              const dx = first.left - lastRect.left;
              const dy = first.top - lastRect.top;
              gsap.set(el, { x: dx, y: dy });
            });
          })
          // PLAY: animate the inverse transforms back to 0 — pieces glide into
          // the horizontal row with the browser's natural spacing.
          .to(
            [vAtharvLineRef.current, vGachchiLineRef.current, vSlashDotRowRef.current],
            {
              x: 0,
              y: 0,
              duration: 0.9,
              ease: "expo.inOut",
              onUpdate: trackDot
            },
            "merge"
          )

          .to({}, { duration: 0.5 }) // Pause on "AC /."

          // 7m. Iris Out (same as desktop, viewport-diagonal-aware).
          .to(irisHoleRef.current, {
            scale: () => {
              const vw = window.innerWidth;
              const vh = window.innerHeight;
              const diag = Math.sqrt(vw * vw + vh * vh);
              const dotW = activeDotRef.current?.offsetWidth || 15;
              return Math.max(350, (diag / dotW) * 1.2);
            },
            duration: 1.8,
            ease: "power4.inOut",
            onUpdate: trackDot
          }, "iris")
          .to(mobileWrapRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut"
          }, "iris");

        } else {
          // ============ DESKTOP HORIZONTAL ANIMATION (unchanged) ============

          // 4. Slash appears like a lightsaber
          tl.to(slashRef.current, {
            scaleY: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(2)"
          })

          // 5. "Anish Chandra" whips up from bottom & pushes out from Slash.
          //    Because fitTypography() already scaled the whole row to fit the
          //    viewport, the full natural width is now safe to reveal.
          .to(textRevealContainerRef.current, {
            width: () => textInnerRef.current?.scrollWidth || 0,
            duration: 1.6,
            ease: "expo.inOut",
            onUpdate: trackDot // CRITICAL: Live track dot as the text pushes it right
          }, "whip")
          .to(textInnerRef.current, {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
          }, "whip+=0.3")
          
          .to({}, { duration: 1 }) // Readability Pause

          // 6. Slurp into "AC"
          .to([tharvRef.current, space1Ref.current, achchiRef.current], {
            width: 0,
            opacity: 0,
            duration: 1.4,
            ease: "expo.inOut",
            onUpdate: trackDot // Track the dot as it glides back towards the center
          })

          .to({}, { duration: 0.6 }) // Pause on "AC /."

          // 7. Iris Out! Scale the transparent hole massively to reveal the site.
          //    Scale is computed from the viewport diagonal so the reveal always
          //    fully covers the screen on any aspect ratio (mobile included).
          .to(irisHoleRef.current, {
            scale: () => {
              const vw = window.innerWidth;
              const vh = window.innerHeight;
              const diag = Math.sqrt(vw * vw + vh * vh);
              const dotW = dotPlaceholderRef.current?.offsetWidth || 15;
              // We need the hole's final diameter >= diagonal. Since scale is
              // relative to the element's own size, divide diagonal by dotW.
              return Math.max(350, (diag / dotW) * 1.2);
            },
            duration: 1.8,
            ease: "power4.inOut",
            onUpdate: trackDot
          }, "iris")
          // Fade out the leftover text simultaneously
          .to(flexContainerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut"
          }, "iris");
        }

      } catch {
        setIsLoaded(true);
      }
    };

    const checkDone = () => {
      loadedCount++;
      if (loadedCount >= totalAssets) {
        setTimeout(runAnimation, 200);
      }
    };

    if (totalAssets === 0) {
      setTimeout(runAnimation, 800);
    } else {
      ASSETS_TO_PRELOAD.forEach((asset) => {
        const url = typeof asset === "string" ? asset : asset.src;
        if (url.endsWith(".mp4") || url.endsWith(".webm")) {
          const video = document.createElement("video");
          video.src = url;
          video.onloadeddata = checkDone;
          video.onerror = checkDone; 
        } else {
          const img = new Image();
          img.src = url;
          img.onload = checkDone;
          img.onerror = checkDone;
        }
      });
    }
  }, [isLoaded, setIsLoaded, mounted]);

  if (isLoaded) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-auto bg-transparent"
    >
      <div className="absolute inset-0 z-10 w-full h-full" />

      {/* 
        THE IRIS OUT MASK 
        A massive 150vmax border acts as our solid black screen.
        The transparent center is what reveals the WebGL background underneath.
      */}
      <div 
        ref={irisHoleRef}
        className="fixed z-20 pointer-events-none"
        style={{
          boxSizing: 'content-box',
          border: '150vmax solid #050505',
          willChange: 'transform, width, height, left, top',
        }}
      >
        <div ref={holeCoverRef} className="w-full h-full bg-[#050505]" />
      </div>

      {/* THE TYPOGRAPHY ENGINE */}

      {/* --- DESKTOP / TABLET HORIZONTAL LAYOUT (hidden on mobile) --- */}
      <div 
        ref={flexContainerRef}
        className="relative z-30 hidden sm:flex items-end justify-center mix-blend-difference text-white font-display uppercase tracking-tighter text-[11vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw] leading-none opacity-0 w-full max-w-[95vw]"
      >
        {/* TEXT REVEAL WRAPPER (Handles horizontal slide out) */}
        <div 
          ref={textRevealContainerRef} 
          className="flex items-end justify-end overflow-hidden whitespace-nowrap pb-2 max-w-full"
        >
          {/* INNER TEXT WRAPPER (Handles the vertical whip-up fade) */}
          <div ref={textInnerRef} className="flex items-end leading-none">
            <span>A</span>
            <span ref={tharvRef} className="inline-flex overflow-hidden">NISH</span>
            
            {/* Added exact gap for 'Anish Chandra' */}
            <span ref={space1Ref} className="inline-flex overflow-hidden w-[0.25em]" />
            
            <span>C</span>
            <span ref={achchiRef} className="inline-flex overflow-hidden">HANDRA</span>
          </div>
        </div>

        {/* THE SLASH & DOT (Perfectly aligned to bottom baseline) */}
        <div className="flex items-end pb-2 ml-1 sm:ml-2 shrink-0">
          <span ref={slashRef} className="inline-block leading-none">/</span>
          <div 
            ref={dotPlaceholderRef} 
            className="w-[2.2vw] h-[2.2vw] min-w-[12px] min-h-[12px] max-w-[22px] max-h-[22px] rounded-full ml-1 mb-[0.12em]" 
          />
        </div>
      </div>

      {/* --- MOBILE VERTICAL LAYOUT (hidden on >=640px) --- */}
      <div
        ref={mobileWrapRef}
        className="relative z-30 flex sm:hidden flex-col items-center justify-center mix-blend-difference text-white font-display uppercase tracking-tighter text-[14vw] leading-[1.05] opacity-0"
      >
        {/* ANISH line — collapses up to just "A" during slurp */}
        <div ref={vAtharvLineRef} className="overflow-hidden whitespace-nowrap">
          <span ref={vAtharvInnerRef} className="inline-flex">
            <span>A</span><span ref={vTharvTailRef}>NISH</span>
          </span>
        </div>

        {/* CHANDRA line — collapses down to just "C" during slurp */}
        <div ref={vGachchiLineRef} className="overflow-hidden whitespace-nowrap">
          <span ref={vGachchiInnerRef} className="inline-flex">
            <span>C</span><span ref={vAchchiTailRef}>HANDRA</span>
          </span>
        </div>

        {/* Slash + dot, centered under the stack (glides up to AC during merge) */}
        <div ref={vSlashDotRowRef} className="flex items-end justify-center mt-1">
          <span ref={vSlashRef} className="inline-block leading-none">/</span>
          <div
            ref={vDotRef}
            className="w-[3vw] h-[3vw] min-w-[12px] min-h-[12px] max-w-[20px] max-h-[20px] rounded-full ml-1 mb-[0.12em]"
          />
        </div>
      </div>
    </div>
  );
}