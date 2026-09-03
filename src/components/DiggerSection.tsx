import React, { useCallback, useState, useEffect, useRef } from 'react';

import AboutLayerPopup from './AboutLayerPopup';
import { VideoCanvasDigger } from './VideoCanvasDigger';
import ViewportReveal from './ViewportReveal';

const DIGGER_TITLE = "I'm a Digger.";
const DIGGER_DESCRIPTION = 'Beneath every problem, there is something worth finding.';

export const DiggerSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isAboutPopupOpen, setIsAboutPopupOpen] = useState(false);
  const openAboutPopup = useCallback(() => setIsAboutPopupOpen(true), []);
  const closeAboutPopup = useCallback(() => setIsAboutPopupOpen(false), []);

  // Typing state
  const [hasTriggered, setHasTriggered] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [descText, setDescText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [isScrollHold, setIsScrollHold] = useState(false);
  const [ctaPointer, setCtaPointer] = useState({ x: 0, y: 0 });
  const ctaRef = useRef<HTMLButtonElement | null>(null);

  // Mouse Parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
    }

    const handlePointerMove = (event: MouseEvent) => {
      const button = ctaRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const safeDistance = Math.max(rect.width, rect.height) * 1.3;

      if (distance < safeDistance) {
        const strength = 1 - distance / safeDistance;
        setCtaPointer({
          x: dx * (0.12 + strength * 0.26),
          y: dy * (0.12 + strength * 0.26),
        });
      } else if (distance < safeDistance * 1.8) {
        const strength = 1 - (distance - safeDistance) / (safeDistance * 0.8);
        setCtaPointer({
          x: dx * (0.05 + strength * 0.08),
          y: dy * (0.05 + strength * 0.08),
        });
      } else {
        setCtaPointer({ x: 0, y: 0 });
      }
    };

    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncPreferences = () => {
      setIsMobileViewport(mobileQuery.matches);
      setPrefersReducedMotion(reducedMotionQuery.matches);
    };

    syncPreferences();
    mobileQuery.addEventListener('change', syncPreferences);
    reducedMotionQuery.addEventListener('change', syncPreferences);
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    return () => {
      mobileQuery.removeEventListener('change', syncPreferences);
      reducedMotionQuery.removeEventListener('change', syncPreferences);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let holdTimeout: number | undefined;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const section = sectionRef.current;
      const isScrollingDown = currentY > lastScrollY;

      if (!section) {
        lastScrollY = currentY;
        return;
      }

      const rect = section.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;

      if (isScrollingDown && isInView) {
        setIsScrollHold(true);
        if (holdTimeout) window.clearTimeout(holdTimeout);
        holdTimeout = window.setTimeout(() => setIsScrollHold(false), 420);
      } else {
        setIsScrollHold(false);
      }

      lastScrollY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (holdTimeout) window.clearTimeout(holdTimeout);
    };
  }, []);

  // IntersectionObserver to trigger typing ONCE
  useEffect(() => {
    if (hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '-25% 0px -25% 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasTriggered]);

  // Execute Typing Sequence
  useEffect(() => {
    if (!hasTriggered) return;

    let titleIdx = 0;
    let descIdx = 0;
    setShowCursor(true);

    // Step 1: Type Title
    const titleInterval = setInterval(() => {
      if (titleIdx < DIGGER_TITLE.length) {
        setTitleText(DIGGER_TITLE.slice(0, titleIdx + 1));
        titleIdx++;
      } else {
        clearInterval(titleInterval);
        setShowBackground(true);

        // Step 2: Pause 400ms
        setTimeout(() => {
          // Step 3: Fade the title cursor while typing the description
          setShowCursor(false);
          setShowCta(true);
          const descInterval = setInterval(() => {
            if (descIdx < DIGGER_DESCRIPTION.length) {
              setDescText(DIGGER_DESCRIPTION.slice(0, descIdx + 1));
              descIdx++;
            } else {
              clearInterval(descInterval);
            }
          }, 38); // 30–45ms per char
        }, 400); // 300–500ms pause
      }
    }, 90); // 80–100ms per char

    return () => clearInterval(titleInterval);
  }, [hasTriggered]);

  // Parallax Smoothing
  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const normX = (e.clientX - centerX) / centerX;
      const normY = (e.clientY - centerY) / centerY;
      targetPos.current = { x: normX, y: normY };
    };

    const updateParallax = () => {
      setMousePos((prev) => ({
        x: prev.x + (targetPos.current.x - prev.x) * 0.08,
        y: prev.y + (targetPos.current.y - prev.y) * 0.08
      }));
      animFrameRef.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animFrameRef.current = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isTouchDevice, prefersReducedMotion]);

  const revealDistance = isMobileViewport ? 14 : 32;
  const revealDuration = prefersReducedMotion ? '0ms' : '700ms';
  const mouseX = !isTouchDevice && !prefersReducedMotion ? mousePos.x : 0;
  const mouseY = !isTouchDevice && !prefersReducedMotion ? mousePos.y : 0;

  return (
    <>
      <section
        id="digger"
        className="relative mt-24 w-full bg-black md:mt-36 lg:mt-48 xl:mt-56"
      >
        <div
          ref={sectionRef}
          className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-black py-48 md:min-h-[120svh] md:py-72 lg:h-[100svh] lg:min-h-0 lg:py-0 transition-[position] duration-200 motion-reduce:lg:h-auto motion-reduce:lg:min-h-[120svh] motion-reduce:lg:py-96"
          style={
            isScrollHold
              ? { position: 'sticky', top: 0, zIndex: 1, transform: 'translateZ(0)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04)' }
              : { position: 'relative' }
          }
        >
        {/* Background Person Video / Canvas with Parallax */}
        <div
          className={`absolute inset-0 transition-[opacity,filter] duration-[1800ms] ease-out motion-reduce:transition-none ${
            showBackground ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
          }`}
          style={{
            transform: `translate3d(${mouseX * 10}px, ${mouseY * 7}px, 0)`,
            willChange: prefersReducedMotion ? 'auto' : 'transform, opacity, filter'
          }}
        >
          <VideoCanvasDigger />
        </div>

        <div className="portfolio-grid relative z-10 w-full">
          {/* Typing Text Area with Parallax */}
          <ViewportReveal
            className="col-span-full xl:col-start-4 xl:col-span-6 max-w-3xl xl:max-w-none mx-auto w-full"
            distance={{ mobile: 70, desktop: 130 }}
            progressOffset={[0.04, 0.88]}
            viewportOffset={['start 100%', 'start 42%']}
          >
            <div
              className="relative flex w-full flex-col items-center gap-4 px-4 text-center sm:gap-5 md:gap-6"
              style={{
                transform: `translate3d(${mouseX * 2}px, ${mouseY}px, 0)`,
                willChange: prefersReducedMotion ? 'auto' : 'transform'
              }}
            >
              <div className="pointer-events-none absolute inset-x-[-5%] top-[-8%] bottom-[-12%] rounded-[2rem] bg-black/50 blur-xl" aria-hidden="true" />
              {/* Step 1 Title */}
              <h2
                className="flex min-h-[1.2em] items-center justify-center text-4xl font-serif-display font-medium tracking-tight text-white sm:text-6xl md:text-7xl lg:whitespace-nowrap lg:text-[100pt]"
                style={{
                  opacity: hasTriggered ? 1 : 0,
                  transform: hasTriggered ? 'translateY(0)' : `translateY(${revealDistance}px)`,
                  transition: `opacity ${revealDuration} ease-out, transform ${revealDuration} cubic-bezier(0.22, 1, 0.36, 1)`
                }}
              >
                <span>{titleText}</span>
                <span
                  aria-hidden="true"
                  className={`inline-block ml-2 h-[0.72em] w-[2px] shrink-0 bg-white transition-opacity duration-300 ease-out ${
                    showCursor ? 'opacity-100 animate-pulse' : 'opacity-0'
                  }`}
                />
              </h2>

              {/* Step 3 Description */}
              <p
                className="max-w-2xl min-h-[2.5em] text-lg font-serif-display font-light leading-relaxed tracking-wide text-neutral-300 sm:text-2xl lg:max-w-none lg:whitespace-nowrap"
                style={{
                  opacity: descText.length > 0 ? 1 : 0,
                  transform: descText.length > 0 ? 'translateY(0)' : `translateY(${revealDistance * 0.65}px)`,
                  transition: `opacity ${revealDuration} ease-out, transform ${revealDuration} cubic-bezier(0.22, 1, 0.36, 1)`
                }}
              >
                {descText}
              </p>

              {/* Step 4 CTA Button */}
              <div
                className="transition-all duration-700 ease-out"
                style={{
                  opacity: showCta ? 1 : 0,
                  transform: showCta ? 'translateY(0)' : 'translateY(8px)',
                  pointerEvents: showCta ? 'auto' : 'none',
                  transitionDuration: prefersReducedMotion ? '0ms' : undefined
                }}
              >
                <button
                  ref={ctaRef}
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={isAboutPopupOpen}
                  onClick={openAboutPopup}
                  onMouseMove={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    const centeredX = event.clientX - (rect.left + rect.width / 2);
                    const centeredY = event.clientY - (rect.top + rect.height / 2);
                    const maxDistance = Math.max(rect.width, rect.height) * 0.7;
                    const distanceRatio = Math.min(1, Math.hypot(centeredX, centeredY) / maxDistance);
                    const x = centeredX * (0.55 + distanceRatio * 0.7);
                    const y = centeredY * (0.55 + distanceRatio * 0.7);
                    setCtaPointer({ x, y });
                  }}
                  onMouseLeave={() => setCtaPointer({ x: 0, y: 0 })}
                  className="group relative overflow-hidden rounded-full border border-neutral-700 bg-neutral-900/80 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-xl shadow-black/50 backdrop-blur-sm transition-all duration-300 hover:border-[#A855F7] hover:bg-[#7B00FF] active:scale-95"
                  style={{
                    transform: `translate(${ctaPointer.x}px, ${ctaPointer.y}px) scale(1.08)`,
                    transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), border-color 180ms ease, background-color 180ms ease'
                  }}
                >
                  <span className="relative z-10 inline-flex items-center gap-3">
                    <span>Take a closer look</span>
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[14px] text-[#F4D6FF] transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-110"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </ViewportReveal>
        </div>
        </div>
      </section>
      <AboutLayerPopup isOpen={isAboutPopupOpen} onClose={closeAboutPopup} />
    </>
  );
};
