export function isSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  // Safari has "Safari" in UA but not Chrome/Chromium/Edge/Opera
  return /Safari/.test(ua) && !/Chrome|CriOS|Chromium|Edg|OPR/.test(ua);
}

export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
}

export function isFirefox(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Firefox/.test(navigator.userAgent);
}

/**
 * Returns true when the user has requested reduced motion via OS / browser
 * settings (prefers-reduced-motion: reduce). JS-driven animations (rAF
 * loops, GSAP tweens, Framer Motion) are NOT covered by the CSS media query
 * in globals.css, so each animation hotspot must check this explicitly and
 * skip / freeze its work when it returns true.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
