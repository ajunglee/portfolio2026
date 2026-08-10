import React, { useState, useEffect, useRef } from 'react';

import { HERO_CATEGORIES } from '../data';
import { VideoCanvasHero } from './VideoCanvasHero';

const SLOGAN_IMAGE_URL = new URL('../images/slogan.png', import.meta.url).href;
const CATEGORY_GRID_CLASSES = [
  'xl:col-start-3 xl:col-span-2',
  'xl:col-start-6 xl:col-span-2',
  'xl:col-start-9 xl:col-span-2'
];

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Mouse Parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1440 : window.innerWidth
  );
  const [scrollProgress, setScrollProgress] = useState(0);

  // Entrance states
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    // Detect touch
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
    }

    // Trigger entrance animation immediately
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncPreferences = () => {
      setIsMobileViewport(mobileQuery.matches);
      setPrefersReducedMotion(reducedMotionQuery.matches);
      setViewportWidth(window.innerWidth);
    };

    syncPreferences();
    mobileQuery.addEventListener('change', syncPreferences);
    reducedMotionQuery.addEventListener('change', syncPreferences);
    window.addEventListener('resize', syncPreferences);

    return () => {
      mobileQuery.removeEventListener('change', syncPreferences);
      reducedMotionQuery.removeEventListener('change', syncPreferences);
      window.removeEventListener('resize', syncPreferences);
    };
  }, []);

  // Drive the hero motion through the full viewport exit, so the scroll and
  // animation feel locked together instead of completing too early.
  useEffect(() => {
    if (prefersReducedMotion) {
      setScrollProgress(0);
      return;
    }

    const updateScrollProgress = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const exitDistance = Math.max(rect.height, window.innerHeight);
      const nextProgress = Math.min(Math.max(-rect.top / exitDistance, 0), 1);
      setScrollProgress(nextProgress);
    };

    const handleScroll = () => {
      if (scrollFrameRef.current !== null) return;

      scrollFrameRef.current = requestAnimationFrame(() => {
        updateScrollProgress();
        scrollFrameRef.current = null;
      });
    };

    updateScrollProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  // Smooth Lerp Mouse Parallax
  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const normX = (e.clientX - centerX) / centerX; // -1 to 1
      const normY = (e.clientY - centerY) / centerY; // -1 to 1

      targetPos.current = { x: normX, y: normY };
    };

    const handleMouseLeave = () => {
      targetPos.current = { x: 0, y: 0 };
    };

    const updateParallax = () => {
      setMousePos((prev) => ({
        x: prev.x + (targetPos.current.x - prev.x) * 0.08,
        y: prev.y + (targetPos.current.y - prev.y) * 0.08
      }));
      animationFrameRef.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    animationFrameRef.current = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isTouchDevice, prefersReducedMotion]);

  const sloganLift = isMobileViewport ? 88 : 180;
  const categoryLift = isMobileViewport ? 112 : 230;
  const sloganFade = isMobileViewport ? 0.88 : 0.96;
  const categoryFade = isMobileViewport ? 0.94 : 1;
  const backgroundDrift = isMobileViewport ? 5 : 7;
  const backgroundScaleProgress = Math.min(Math.max((viewportWidth - 1024) / 416, 0), 1);
  const backgroundScale = 1.04 - backgroundScaleProgress * 0.21;
  const sloganOpacity = prefersReducedMotion ? 1 : 1 - scrollProgress * sloganFade;
  const categoryOpacity = prefersReducedMotion ? 1 : 1 - scrollProgress * categoryFade;
  const mouseX = !isTouchDevice && !prefersReducedMotion ? mousePos.x : 0;
  const mouseY = !isTouchDevice && !prefersReducedMotion ? mousePos.y : 0;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-black"
    >
      {/* Background Video with Mouse Parallax */}
      <div
        className="absolute inset-0"
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : `translate3d(${mouseX * 8}px, calc(${mouseY * 5}px + ${scrollProgress * backgroundDrift}vh), 0) scale(${backgroundScale})`,
          willChange: prefersReducedMotion ? 'auto' : 'transform'
        }}
      >
        <VideoCanvasHero />
      </div>

      <div className="portfolio-grid relative z-10 min-h-screen pt-24 pb-12">
        <div className="col-span-full min-h-[calc(100vh-9rem)] flex flex-col justify-between items-center">
          {/* Spacer for navbar balance */}
          <div className="w-full h-8 z-10 pointer-events-none" />

          {/* Main Hero Visual: slogan image with Light Sweep & Parallax */}
          <div
            className="z-10 w-full text-center mt-auto mb-8 md:mb-12 flex flex-col items-center justify-center"
            style={{
              opacity: sloganOpacity,
              transform: `translate3d(0, ${-scrollProgress * sloganLift}px, 0)`,
              willChange: prefersReducedMotion ? 'auto' : 'transform, opacity'
            }}
          >
            <div
              className="w-full transition-all duration-1000 ease-out flex items-center justify-center"
              style={{
                opacity: hasEntered ? 1 : 0,
                transform: `scale(${hasEntered ? 1 : 0.9}) translate3d(${mouseX * 12}px, ${mouseY * 8}px, 0)`
              }}
            >
              <div className="relative inline-block w-full max-w-[1797px] light-sweep-effect select-none">
                <img
                  src={SLOGAN_IMAGE_URL}
                  alt="DIG DEEPER"
                  width={1797}
                  height={215}
                  draggable={false}
                  className="block w-full max-w-[1797px] h-auto object-contain drop-shadow-[0_10px_35px_rgba(123,0,255,0.3)]"
                />
              </div>
            </div>
          </div>

          {/* Bottom Category Entrance */}
          <div
            className="z-10 w-full grid grid-cols-3 items-center gap-x-2 sm:gap-x-4 md:gap-x-6 xl:grid-cols-12 xl:gap-x-10 pt-8 pb-4"
            style={{
              opacity: categoryOpacity,
              transform: `translate3d(${mouseX * 3}px, ${mouseY * 2 - scrollProgress * categoryLift}px, 0)`,
              willChange: prefersReducedMotion ? 'auto' : 'transform, opacity'
            }}
          >
            {HERO_CATEGORIES.map((cat, idx) => {
              const delays = [1.25, 1.40, 1.55];
              const delay = delays[idx] || 1.25;

              return (
                <span
                  key={cat.id}
                  style={{
                    transitionDelay: `${delay}s`,
                    opacity: hasEntered ? 1 : 0,
                    transform: hasEntered ? 'translateY(0)' : 'translateY(10px)'
                  }}
                  className={`${CATEGORY_GRID_CLASSES[idx] ?? ''} justify-self-center whitespace-nowrap text-center font-serif-display text-xs tracking-[0.08em] text-neutral-300 transition-[opacity,transform] duration-500 sm:text-base sm:tracking-[0.12em] md:text-xl md:tracking-[0.14em] lg:text-[clamp(22px,2vw,32px)] lg:tracking-[0.1em] xl:tracking-[0.12em] 2xl:tracking-[0.18em]`}
                >
                  {cat.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
