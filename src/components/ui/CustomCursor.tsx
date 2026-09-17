'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../../utils/detectBrowser';

interface TargetCursorProps {
    targetSelector?: string;
    hideDefaultCursor?: boolean;
    hoverDuration?: number;
    parallaxOn?: boolean;
}

const CustomCursor: React.FC<TargetCursorProps> = ({
    targetSelector = '.cursor-target',
    hideDefaultCursor = true,
    hoverDuration = 0.3,
    parallaxOn = true
}) => {
    const blobRef = useRef<HTMLDivElement>(null);
    const arrowWrapperRef = useRef<HTMLDivElement>(null);

    const activeTargetRef = useRef<Element | null>(null);
    const lastNoMorphRef = useRef<Element | null>(null);
    const mousePos = useRef({ x: -100, y: -100 });
    const isReady = useRef(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isMobileDevice = useMemo(() => {
        if (typeof window === 'undefined') return true;
        return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
    }, []);

    useEffect(() => {
        if (!mounted || isMobileDevice || !blobRef.current || !arrowWrapperRef.current) return;

        const originalCursor = document.body.style.cursor;
        
        if (hideDefaultCursor) {
            document.documentElement.style.cursor = 'none';
            document.body.style.cursor = 'none';
            const style = document.createElement('style');
            style.id = 'target-cursor-style';
            style.innerHTML = `* { cursor: none !important; }`;
            document.head.appendChild(style);
        }

        const blob = blobRef.current;
        const arrow = arrowWrapperRef.current;

        gsap.set([blob, arrow], { xPercent: -50, yPercent: -50, x: -200, y: -200 });
        gsap.set(blob, { opacity: 0, width: 40, height: 40, borderRadius: "50%", border: "2px solid white" });
        gsap.set(arrow, { opacity: 0 });

        // Lightweight parallax loop: only runs work while a target is active.
        // Uses a single rAF instead of gsap.ticker to avoid extra overhead.
        // Under prefers-reduced-motion the loop is skipped entirely — the
        // cursor still snaps to targets via gsap.set on enter, just without
        // the continuous parallax drift.
        const reducedMotion = prefersReducedMotion();
        let parallaxRaf = 0;
        const parallaxLoop = () => {
            parallaxRaf = requestAnimationFrame(parallaxLoop);
            if (reducedMotion || !isReady.current || !activeTargetRef.current) return;

            if (!document.contains(activeTargetRef.current)) {
                handleLeave();
                return;
            }

            const rect = activeTargetRef.current.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2;
            const targetY = rect.top + rect.height / 2;

            const parallaxDistanceX = parallaxOn ? (mousePos.current.x - targetX) * 0.15 : 0;
            const parallaxDistanceY = parallaxOn ? (mousePos.current.y - targetY) * 0.15 : 0;

            gsap.to(blob, {
                x: targetX + parallaxDistanceX,
                y: targetY + parallaxDistanceY,
                duration: 0.1,
                ease: 'none',
                overwrite: 'auto'
            });
        };
        parallaxRaf = requestAnimationFrame(parallaxLoop);

        const handleEnter = (target: Element) => {
            const noMorph = target.classList.contains('cursor-no-morph');

            // --- RE-ADDED: DISPATCH EVENT FOR CONTACT MARQUEE ---
            const event = new CustomEvent('cursor-enter', { 
                detail: { x: mousePos.current.x, y: mousePos.current.y }, 
                bubbles: true 
            });
            target.dispatchEvent(event);

            // For cursor-no-morph elements (e.g. contact rows), only fire the
            // event so the marquee can animate — don't lock/morph the cursor.
            if (noMorph) return;

            activeTargetRef.current = target;
            const rect = target.getBoundingClientRect();

            // Hide Arrow / Show Outline
            gsap.to(arrow, { scale: 0, opacity: 0, duration: 0.15, ease: "power2.in", overwrite: 'auto' });
            gsap.to(blob, {
                opacity: 1,
                width: rect.width + 16,
                height: rect.height + 16,
                borderRadius: "8px",
                duration: hoverDuration,
                ease: 'power3.out',
                overwrite: 'auto'
            });
        };

        const handleLeave = (target?: Element) => {
            const leaveTarget = target || activeTargetRef.current;
            if (!leaveTarget) return;
            const noMorph = leaveTarget.classList.contains('cursor-no-morph');

            // --- RE-ADDED: DISPATCH EVENT FOR CONTACT MARQUEE ---
            const event = new CustomEvent('cursor-leave', { 
                detail: { x: mousePos.current.x, y: mousePos.current.y }, 
                bubbles: true 
            });
            leaveTarget.dispatchEvent(event);

            // For cursor-no-morph elements, only fire the event — nothing to restore.
            if (noMorph) return;

            activeTargetRef.current = null;

            // Restore Arrow / Hide Outline
            gsap.to(arrow, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)", overwrite: 'auto' });
            gsap.to(blob, {
                width: 20,
                height: 20,
                borderRadius: "50%",
                opacity: 0,
                duration: 0.2,
                ease: 'power3.out',
                overwrite: 'auto'
            });
        };

        // Event-driven hover detection (replaces the expensive setInterval +
        // document.elementsFromPoint polling, which forced a layout/hit-test
        // every 30ms and was the #1 Firefox FPS killer).
        const resolveTarget = (el: Element | null): Element | null => {
            if (!el) return null;
            return el.closest(targetSelector) || (el.matches(targetSelector) ? el : null);
        };

        const onOver = (e: MouseEvent) => {
            if (!isReady.current) return;
            const actualTarget = resolveTarget(e.target as Element);
            if (!actualTarget) return;
            const noMorph = actualTarget.classList.contains('cursor-no-morph');

            if (noMorph) {
                if (lastNoMorphRef.current !== actualTarget) {
                    if (activeTargetRef.current) handleLeave();
                    if (lastNoMorphRef.current) handleLeave(lastNoMorphRef.current);
                    lastNoMorphRef.current = actualTarget;
                    handleEnter(actualTarget);
                }
            } else {
                if (lastNoMorphRef.current) {
                    handleLeave(lastNoMorphRef.current);
                    lastNoMorphRef.current = null;
                }
                if (activeTargetRef.current !== actualTarget) {
                    if (activeTargetRef.current) handleLeave();
                    handleEnter(actualTarget);
                }
            }
        };

        const onOut = (e: MouseEvent) => {
            if (!isReady.current) return;
            const actualTarget = resolveTarget(e.target as Element);
            if (!actualTarget) return;
            const related = resolveTarget(e.relatedTarget as Element | null);
            // Only leave if we're not moving to another target (or to null).
            if (related === actualTarget) return;

            const noMorph = actualTarget.classList.contains('cursor-no-morph');
            if (noMorph) {
                if (lastNoMorphRef.current === actualTarget) {
                    handleLeave(lastNoMorphRef.current);
                    lastNoMorphRef.current = null;
                }
            } else if (activeTargetRef.current === actualTarget) {
                handleLeave();
            }
        };

        const moveHandler = (e: MouseEvent) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;

            if (!isReady.current) {
                isReady.current = true;
                if (!activeTargetRef.current) {
                    gsap.to(arrow, { opacity: 1, duration: 0.3 });
                }
                gsap.set([arrow, blob], { x: e.clientX, y: e.clientY });
            }

            gsap.set(arrow, { x: e.clientX, y: e.clientY });
            if (!activeTargetRef.current) {
                gsap.set(blob, { x: e.clientX, y: e.clientY });
            }
        };

        const mouseDownHandler = () => {
            if (!activeTargetRef.current) { gsap.to(arrow, { scale: 0.8, duration: 0.2 }); }
            else { gsap.to(blob, { scale: 0.95, duration: 0.15 }); }
        };

        const mouseUpHandler = () => {
            if (!activeTargetRef.current) { gsap.to(arrow, { scale: 1, duration: 0.3, ease: "back.out(2)" }); }
            else { gsap.to(blob, { scale: 1, duration: 0.4, ease: "back.out(1.5)" }); }
        };

        window.addEventListener('mousemove', moveHandler, { passive: true });
        window.addEventListener('mousedown', mouseDownHandler);
        window.addEventListener('mouseup', mouseUpHandler);
        // Use mouseover/mouseout (bubbling) for cheap event-delegated hover
        // detection instead of polling elementsFromPoint every 30ms.
        document.addEventListener('mouseover', onOver, { passive: true });
        document.addEventListener('mouseout', onOut, { passive: true });

        return () => {
            cancelAnimationFrame(parallaxRaf);
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mousedown', mouseDownHandler);
            window.removeEventListener('mouseup', mouseUpHandler);
            document.removeEventListener('mouseover', onOver);
            document.removeEventListener('mouseout', onOut);
            document.documentElement.style.cursor = originalCursor;
            document.body.style.cursor = originalCursor;
            const style = document.getElementById('target-cursor-style');
            if(style) style.remove();
        };
    }, [mounted, targetSelector, hideDefaultCursor, isMobileDevice, hoverDuration, parallaxOn]);

    if (!mounted || isMobileDevice) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[99999]">
            <div ref={blobRef} className="fixed top-0 left-0 border-white pointer-events-none" style={{ willChange: 'transform' }} />
            <div ref={arrowWrapperRef} className="fixed top-0 left-0 flex items-center justify-center" style={{ willChange: 'transform' }}>
                <svg stroke="black" fill="white" strokeWidth="1" viewBox="0 0 16 16" className="h-7 w-7 -rotate-[70deg] transform drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
                </svg>
            </div>
        </div>
    );
};

export default CustomCursor;