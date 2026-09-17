"use client";

import React, { useEffect, useState, useRef } from "react";
import { isSafari, isMobile } from "../../utils/detectBrowser";
import { ArrowRight } from "lucide-react";
import { useLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// --- Utility to split text into characters for GSAP ---
const SplitText = ({ text, className = "" }: { text: string, className?: string }) => {
  return (
    <span className="inline-block overflow-visible pr-4">
      {text.split("").map((char, i) => (
        <span
          key={i}
          // Added opacity-0 here so it doesn't blink before ScrollTrigger fires!
          className={`char-reveal inline-block origin-bottom opacity-0 ${className}`}
          style={{ willChange: "transform" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

interface MenuItemData {
  title: string;
  subtitle: string;
  link?: string;
  icon: React.ElementType;
}

const Mail: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>Gmail</title><path fill="currentColor" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /></svg>
);
const Github: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>GitHub</title><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
);
const Briefcase: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg role="img" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" {...props}><title>LinkedIn</title><path fill="currentColor" d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" /></svg>
);
const Sparkles: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>WhatsApp</title><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
);

const menuItems: MenuItemData[] = [
  { title: 'Send a Message', subtitle: 'canish8971@gmail.com', link: 'mailto:canish8971@gmail.com', icon: Mail },
  { title: 'GitHub', subtitle: 'Open Source', link: 'https://github.com/badguyOP', icon: Github },
  { title: 'Linkedin', subtitle: 'Professional Network', link: 'https://www.linkedin.com/in/anish--chandra/', icon: Briefcase },
  { title: 'Whatsapp', subtitle: 'Direct Message', link: 'https://api.whatsapp.com/send?phone=9137371642', icon: Sparkles }
];

const FlowingRow: React.FC<MenuItemData & { speed?: number }> = ({
  title, subtitle, link, icon: Icon, speed = 15
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.7, ease: "expo.out" };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };
    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [title]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) animationRef.current.kill();

      const effectiveSpeed = (typeof window !== 'undefined' && (isSafari() || isMobile())) ? Math.max(speed * 2, 30) : speed;
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: effectiveSpeed,
        ease: 'none',
        repeat: -1,
        force3D: true
      });
    };

    const timer = setTimeout(setupMarquee, 100);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) animationRef.current.kill();
    };
  }, [title, repetitions, speed]);

  const isAnimatingClick = useRef(false);

  const handleMouseEnter = (ev: { clientX: number, clientY: number }) => {
    if (isAnimatingClick.current) return;
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap.timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%', overwrite: 'auto' }, 0);
  };

  const handleMouseLeave = (ev: { clientX: number, clientY: number }) => {
    if (isAnimatingClick.current) return;
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap.timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%', overwrite: 'auto' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%', overwrite: 'auto' }, 0);
  };

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const onCursorEnter = (e: Event) => {
      const customEvent = e as CustomEvent;
      const clientX = customEvent.detail?.x ?? (el.getBoundingClientRect().left + el.offsetWidth / 2);
      const clientY = customEvent.detail?.y ?? (el.getBoundingClientRect().top + el.offsetHeight / 2);
      handleMouseEnter({ clientX, clientY });
    };

    const onCursorLeave = (e: Event) => {
      const customEvent = e as CustomEvent;
      const clientX = customEvent.detail?.x ?? (el.getBoundingClientRect().left + el.offsetWidth / 2);
      const clientY = customEvent.detail?.y ?? (el.getBoundingClientRect().top + el.offsetHeight / 2);
      handleMouseLeave({ clientX, clientY });
    };

    el.addEventListener('cursor-enter', onCursorEnter);
    el.addEventListener('cursor-leave', onCursorLeave);

    return () => {
      el.removeEventListener('cursor-enter', onCursorEnter);
      el.removeEventListener('cursor-leave', onCursorLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!link || isAnimatingClick.current) return;

    const isMobileDevice = window.innerWidth <= 768 || window.matchMedia('(hover: none)').matches;

    if (isMobileDevice) {
      ev.preventDefault();
      isAnimatingClick.current = true;

      if (marqueeRef.current && marqueeInnerRef.current) {
        gsap.to([marqueeRef.current, marqueeInnerRef.current], { y: '0%', duration: 0.4, ease: "expo.out", overwrite: "auto" });
      }

      if (animationRef.current) {
        gsap.to(animationRef.current, {
          timeScale: 150, 
          duration: 1.8,  
          ease: "power2.inOut", 
          onComplete: () => {
            gsap.to(animationRef.current, {
              timeScale: 0,
              duration: 0.5, 
              ease: "back.out(1.2)", 
              onComplete: () => {
                if (link.startsWith('mailto:')) {
                  window.location.href = link;
                } else {
                  window.open(link, '_blank', 'noopener,noreferrer');
                }

                setTimeout(() => {
                  if (marqueeRef.current && marqueeInnerRef.current) {
                    gsap.to(marqueeRef.current, { y: '101%', duration: 0.5, ease: "power2.inOut" });
                    gsap.to(marqueeInnerRef.current, { y: '-101%', duration: 0.5, ease: "power2.inOut" });
                  }
                  if (animationRef.current) {
                    gsap.set(animationRef.current, { timeScale: 1 });
                  }
                  isAnimatingClick.current = false;
                }, 800);
              }
            });
          }
        });
      }
      return;
    }

    if (link.startsWith('mailto:')) {
      window.location.href = link;
      return;
    }
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={itemRef}
      onClick={handleClick}
      // Added opacity-0 initially
      className="footer-row-anim opacity-0 relative w-full border-t border-white/20 py-8 md:py-12 overflow-hidden cursor-pointer group cursor-target cursor-no-morph block"
    >
      <div className="relative z-10 flex justify-between items-center w-full px-4 md:px-12 pointer-events-none">
        <h2 className="font-display text-4xl sm:text-6xl md:text-[6vw] leading-none uppercase tracking-tighter pt-2 text-white">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          <span className="font-sans text-[10px] md:text-sm uppercase tracking-widest hidden sm:block text-white">
            {subtitle}
          </span>
          <div className="relative overflow-hidden w-6 h-6 md:w-10 md:h-10">
            <ArrowRight className="absolute inset-0 -rotate-45 text-white transition-transform duration-[700ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:translate-x-full group-hover:-translate-y-full" />
            <ArrowRight className="absolute inset-0 -rotate-45 -translate-x-full translate-y-full text-white transition-transform duration-[700ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
          </div>
        </div>
      </div>

      <div
        ref={marqueeRef}
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none translate-y-[101%] bg-accent z-20"
      >
        <div className="h-full w-fit flex items-center" ref={marqueeInnerRef}>
          {[...Array(repetitions)].map((_, idx) => (
            <div className="marquee-part flex items-center flex-shrink-0" key={idx}>
              <span className="whitespace-nowrap uppercase font-display text-4xl sm:text-6xl md:text-[6vw] leading-none tracking-tighter pt-2 px-[4vw] text-white">
                {title}
              </span>
              <div className="flex items-center justify-center">
                <Icon className="w-10 h-10 md:w-16 md:h-16 text-white" strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [time, setTime] = useState("");

  useEffect(() => {
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      const now = new Date();
      // Drop the millisecond display: updating it every 100ms caused 10
      // re-renders/sec of the whole Contact section. 1s updates are smooth
      // and the ms counter wasn't readable anyway.
      setTime(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  // Removed the IntersectionObserver completely. 
  // Standard GSAP ScrollTrigger ensures it runs properly without snapping backward.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true // It will only animate ONCE, never resetting midway!
        }
      });

      tl.fromTo('.char-reveal',
        { yPercent: 130, rotateZ: 10, scale: 0.9, opacity: 0 },
        { yPercent: 0, rotateZ: 0, scale: 1, opacity: 1, duration: 1.2, stagger: 0.03, ease: 'expo.out' }
      )
        .fromTo('.footer-row-anim',
          { yPercent: 50, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'expo.out' },
          '-=0.8'
        )
        .fromTo('.meta-reveal',
          { yPercent: 50, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, stagger: 0.05, ease: 'expo.out' },
          '-=0.9'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={containerRef} className="relative w-full min-h-screen flex flex-col pt-32 z-10 text-zinc-100 overflow-hidden bg-transparent">

      <div className="flex flex-col items-start w-full px-4 md:px-12 mb-16 md:mb-24">
        <div className="flex items-center gap-3 mb-8 md:mb-12 overflow-hidden">
          {/* Added opacity-0 initially */}
          <div className="meta-reveal opacity-0 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <p className="about-label font-sans text-xs md:text-sm uppercase tracking-widest text-gray-400">
              05 // Initiate Contact
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-x-2 sm:gap-x-4 md:gap-x-8 w-full flex-nowrap whitespace-nowrap">
          <div className="overflow-hidden pb-2 md:pb-4 flex-shrink-0">
            <h1 className="text-[13.5vw] sm:text-[13vw] md:text-[9vw] tracking-tighter text-white font-agno leading-none">
              <SplitText text="HAVE AN" />
            </h1>
          </div>
          <div className="overflow-hidden pb-2 md:pb-4 pr-1 md:pr-8 flex-shrink-0">
            <h1 className="font-accent italic text-accent text-[13.5vw] sm:text-[14vw] md:text-[10vw] tracking-tight leading-none">
              <SplitText text="idea?" />
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col mt-auto border-b border-white/20">
        {menuItems.map((item, idx) => (
          <div key={idx} className="overflow-hidden">
            <FlowingRow {...item} />
          </div>
        ))}
      </div>

      {/* Added opacity-0 to meta-reveal base classes */}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 px-4 md:px-12 py-8 gap-8 md:gap-0">
        <div className="flex flex-col items-start justify-center">
          <div className="overflow-hidden"><p className="meta-reveal opacity-0 font-agno text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Local Time (GMT +5:30)</p></div>
          <div className="overflow-hidden">
            <div className="meta-reveal opacity-0 cursor-target flex items-baseline font-sans text-sm md:text-base uppercase tracking-widest text-zinc-300 tabular-nums w-fit">
              <span>{time || "00:00:00"}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-center justify-center">
          <div className="overflow-hidden"><p className="meta-reveal opacity-0 font-agno text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Location</p></div>
          <div className="overflow-hidden">
            <p className="meta-reveal opacity-0 font-sans text-sm md:text-base uppercase tracking-widest text-zinc-300 cursor-target">Planet Earth</p>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end justify-center col-span-2 md:col-span-1">
          <div className="overflow-hidden"><p className="meta-reveal opacity-0 font-agno text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Navigation</p></div>
          <div className="overflow-hidden">
            <button
              onClick={() => lenis?.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })}
              className="meta-reveal opacity-0 group font-sans text-sm md:text-base uppercase tracking-widest text-zinc-300 hover:text-white transition-colors cursor-target"
            >
              Back to Top <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">↑</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}