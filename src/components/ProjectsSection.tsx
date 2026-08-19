import React, { useEffect, useRef, useState } from 'react';

import { SCATTER_PROJECTS } from '../data';
import { ScatterProject } from '../types';
import ViewportReveal from './ViewportReveal';

const PROJECTS_BACKGROUND_VIDEO_URL = new URL(
  '../video/featured_video.mp4',
  import.meta.url,
).href;

interface ProjectsSectionProps {
  onSelectScatterProject?: (proj: ScatterProject) => void;
  onOpenProjectGallery: () => void;
}

type ProjectsMotionPhase = 'idle' | 'lead' | 'flipping' | 'holding' | 'aligning' | 'marquee';

interface ProjectsDragSession {
  pointerId: number;
  captureTarget: Element;
  startX: number;
  startY: number;
  startScrollLeft: number;
  hasDragged: boolean;
  axis: 'pending' | 'horizontal' | 'vertical';
  animation: Animation | null;
  animationStartTime: number;
  animationDuration: number;
  marqueeDistance: number;
}

const FLIP_DURATION_MS = 1050;
const FLIP_STAGGER_MS = 180;
const TITLE_LEAD_MS = 500;
const SCATTER_HOLD_MS = 650;
const ALIGN_DURATION_MS = 900;
const DRAG_THRESHOLD_PX = 6;
const CLICK_SUPPRESSION_MS = 350;
const BASE_MARQUEE_DURATION_SECONDS = 28;
const BASE_PROJECT_COUNT = 5;
const MARQUEE_DURATION_SECONDS =
  (BASE_MARQUEE_DURATION_SECONDS * SCATTER_PROJECTS.length) / BASE_PROJECT_COUNT;

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectScatterProject,
  onOpenProjectGallery,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const primarySetRef = useRef<HTMLDivElement>(null);
  const dragSessionRef = useRef<ProjectsDragSession | null>(null);
  const suppressClickUntilRef = useRef(0);
  const [motionPhase, setMotionPhase] = useState<ProjectsMotionPhase>('idle');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = backgroundVideoRef.current;
    if (!section || !video) return;

    if (!('IntersectionObserver' in window)) {
      void video.play().catch(() => undefined);
      return () => video.pause();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  useEffect(() => {
    const showcase = showcaseRef.current;

    if (!showcase || motionPhase !== 'idle') return;

    if (!('IntersectionObserver' in window)) {
      setMotionPhase('lead');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setMotionPhase('lead');
        observer.disconnect();
      },
      {
        rootMargin: '-24% 0px -24% 0px',
        threshold: 0.4,
      },
    );

    observer.observe(showcase);

    return () => observer.disconnect();
  }, [motionPhase]);

  useEffect(() => {
    let fallbackTimer: number | undefined;

    if (motionPhase === 'lead') {
      fallbackTimer = window.setTimeout(() => setMotionPhase('flipping'), TITLE_LEAD_MS);
    } else if (motionPhase === 'flipping') {
      const finalFlipEnd = FLIP_DURATION_MS + FLIP_STAGGER_MS * (SCATTER_PROJECTS.length - 1);
      fallbackTimer = window.setTimeout(() => setMotionPhase('holding'), finalFlipEnd + 180);
    } else if (motionPhase === 'holding') {
      fallbackTimer = window.setTimeout(() => setMotionPhase('aligning'), SCATTER_HOLD_MS);
    } else if (motionPhase === 'aligning') {
      fallbackTimer = window.setTimeout(() => setMotionPhase('marquee'), ALIGN_DURATION_MS + 160);
    }

    return () => {
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
    };
  }, [motionPhase]);

  useEffect(() => {
    const handleWindowBlur = () => {
      if (!dragSessionRef.current) return;

      trackRef.current?.style.removeProperty('animation-play-state');
      dragSessionRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener('blur', handleWindowBlur);

    return () => window.removeEventListener('blur', handleWindowBlur);
  }, []);

  const getMarqueeAnimation = () => {
    return (
      trackRef.current?.getAnimations().find(
        (animation) =>
          'animationName' in animation &&
          (animation as CSSAnimation).animationName === 'projects-marquee',
      ) ?? null
    );
  };

  const finishDrag = (
    pointerId: number,
    shouldSuppressClick = false,
  ) => {
    const session = dragSessionRef.current;

    if (!session || session.pointerId !== pointerId) return;

    if (shouldSuppressClick && session.hasDragged) {
      suppressClickUntilRef.current = performance.now() + CLICK_SUPPRESSION_MS;
    }

    trackRef.current?.style.removeProperty('animation-play-state');
    dragSessionRef.current = null;
    setIsDragging(false);

    if (session.captureTarget.hasPointerCapture(pointerId)) {
      session.captureTarget.releasePointerCapture(pointerId);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;

    // A fresh gesture must never inherit an unconsumed synthetic-click guard.
    suppressClickUntilRef.current = 0;
    const animation = getMarqueeAnimation();

    if (!animation) {
      const usesNativeTouch = event.pointerType !== 'mouse';
      const isLockedDesktopIntro = getComputedStyle(event.currentTarget).overflowX === 'hidden';

      // Small screens keep native kinetic scrolling; the desktop intro stays undisturbed.
      if (usesNativeTouch || isLockedDesktopIntro) return;
    }

    const computedDuration = animation?.effect?.getComputedTiming().duration;
    const animationDuration =
      typeof computedDuration === 'number' && computedDuration > 0 ? computedDuration : 0;
    const currentTime = animation?.currentTime;
    const marqueeDistance = primarySetRef.current?.offsetWidth ?? 0;
    const canScrubMarquee = Boolean(animation && animationDuration && marqueeDistance);
    const captureTarget =
      event.target instanceof Element ? event.target : event.currentTarget;

    dragSessionRef.current = {
      pointerId: event.pointerId,
      captureTarget,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: event.currentTarget.scrollLeft,
      hasDragged: false,
      axis: 'pending',
      animation: canScrubMarquee ? animation : null,
      animationStartTime: typeof currentTime === 'number' ? currentTime : 0,
      animationDuration,
      marqueeDistance,
    };

    if (canScrubMarquee && trackRef.current) {
      trackRef.current.style.animationPlayState = 'paused';
    }

    // Keep the original hit target as the click target for taps without movement.
    captureTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const session = dragSessionRef.current;

    if (!session || session.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - session.startX;
    const deltaY = event.clientY - session.startY;

    if (session.axis === 'pending') {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < DRAG_THRESHOLD_PX) return;

      session.hasDragged = true;
      session.axis = Math.abs(deltaX) >= Math.abs(deltaY) ? 'horizontal' : 'vertical';
      const focusedElement = document.activeElement;

      if (focusedElement instanceof HTMLElement && event.currentTarget.contains(focusedElement)) {
        focusedElement.blur();
      }
    }

    if (session.axis === 'vertical') return;

    event.preventDefault();

    if (session.animation) {
      const draggedTime = (deltaX / session.marqueeDistance) * session.animationDuration;
      const nextTime = session.animationStartTime - draggedTime;
      const wrappedTime =
        ((nextTime % session.animationDuration) + session.animationDuration) %
        session.animationDuration;

      session.animation.currentTime = wrappedTime;
      return;
    }

    event.currentTarget.scrollLeft = session.startScrollLeft - deltaX;
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(event.pointerId, true);
  };

  const handlePointerAbort = (event: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(event.pointerId);
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.detail === 0 || performance.now() > suppressClickUntilRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    suppressClickUntilRef.current = 0;
  };

  const handleCardAnimationEnd = (
    event: React.AnimationEvent<HTMLElement>,
    idx: number,
    isDuplicate: boolean,
  ) => {
    if (isDuplicate || idx !== SCATTER_PROJECTS.length - 1) return;

    if (event.animationName === 'projects-card-flip-in') {
      setMotionPhase((current) => (current === 'flipping' ? 'holding' : current));
    } else if (event.animationName === 'projects-card-align') {
      setMotionPhase((current) => (current === 'aligning' ? 'marquee' : current));
    }
  };

  const renderProjectCard = (
    proj: ScatterProject,
    idx: number,
    isDuplicate = false,
  ) => (
    <article
      key={`${isDuplicate ? 'duplicate' : 'primary'}-${proj.id}`}
      className="project-showcase-card group relative cursor-pointer rounded-2xl"
      style={{ '--project-flip-delay': `${idx * FLIP_STAGGER_MS}ms` } as React.CSSProperties}
      onAnimationEnd={(event) => handleCardAnimationEnd(event, idx, isDuplicate)}
    >
      <button
        type="button"
        aria-label={isDuplicate ? undefined : `Open ${proj.title} project`}
        tabIndex={isDuplicate ? -1 : 0}
        className="absolute inset-0 z-20 cursor-pointer rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7B00FF]"
        onClick={() => onSelectScatterProject?.(proj)}
      />

      <div className="project-card-flip-shell relative h-full w-full">
        <div className="project-card-flip-back absolute inset-0 rounded-2xl" aria-hidden="true" />

        <div className="project-card-face h-full w-full overflow-hidden rounded-2xl border border-neutral-800 bg-black shadow-2xl transition-[border-color,box-shadow] duration-500 group-hover:border-[#7B00FF]/60 group-hover:shadow-[0_15px_35px_rgba(123,0,255,0.18)]">
          <div
            className={`relative flex aspect-[3/4] w-full flex-col justify-end overflow-hidden bg-gradient-to-br p-3 ${proj.gradient}`}
          >
            <img
              src={proj.previewImage}
              alt=""
              aria-hidden="true"
              draggable={false}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-black/70"
              aria-hidden="true"
            />

            <div className="portfolio-glass-panel z-10 rounded-xl p-4 md:p-5">
              <p className="line-clamp-2 text-[14px] font-semibold leading-tight text-white md:text-[16px] xl:text-[18px]">
                {proj.title}
              </p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-neutral-300 md:text-[12px] xl:text-[13px]">
                {proj.subtitle}
              </p>
              <ul
                className="mt-3 flex flex-wrap gap-x-2 gap-y-1 border-t border-white/10 pt-3 text-[10px] text-[#D8B4FE] md:text-[11px] xl:text-[12px]"
                aria-label="Project tags"
              >
                {proj.tags.map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-[100svh] w-full overflow-x-clip bg-black xl:h-[160svh] xl:min-h-0 motion-reduce:xl:h-auto motion-reduce:xl:min-h-[100svh]"
    >
      <div className="relative min-h-[100svh] overflow-hidden py-48 md:py-72 xl:sticky xl:top-0 xl:h-[100svh] xl:min-h-0 xl:py-0 motion-reduce:xl:static motion-reduce:xl:h-auto motion-reduce:xl:min-h-[100svh] motion-reduce:xl:py-96">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <video
            ref={backgroundVideoRef}
            src={PROJECTS_BACKGROUND_VIDEO_URL}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="portfolio-grid relative z-10 xl:h-full xl:content-center motion-reduce:xl:h-auto">
          <ViewportReveal
            className="projects-title-reveal relative z-10 col-span-full mb-16 text-center md:mb-20 xl:mb-20 2xl:mb-24"
            distance={{ mobile: 80, desktop: 170 }}
            progressOffset={[0, 0.62]}
            viewportOffset={['start 98%', 'start 46%']}
          >
            <h2 className="font-serif-display text-4xl leading-none tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[100pt]">
              Projects
            </h2>
          </ViewportReveal>

          <div
            ref={showcaseRef}
            className={`projects-marquee-viewport col-span-full${isDragging ? ' is-dragging' : ''}`}
            aria-label="Projects gallery"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerAbort}
            onLostPointerCapture={handlePointerAbort}
            onClickCapture={handleClickCapture}
          >
            <div
              ref={trackRef}
              className={`projects-showcase-track projects-phase-${motionPhase}`}
              style={
                {
                  '--projects-marquee-duration': `${MARQUEE_DURATION_SECONDS}s`,
                } as React.CSSProperties
              }
            >
              <div
                ref={primarySetRef}
                className="projects-marquee-set projects-marquee-set--primary"
              >
                {SCATTER_PROJECTS.map((proj, idx) => renderProjectCard(proj, idx))}
              </div>

              {[1, 2].map((copyNumber) => (
                <div
                  key={copyNumber}
                  className="projects-marquee-set projects-marquee-set--duplicate"
                  aria-hidden="true"
                >
                  {SCATTER_PROJECTS.map((proj, idx) =>
                    renderProjectCard(proj, idx, true),
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-20 col-span-full -mt-2 flex justify-center md:-mt-3 xl:-mt-4">
            <button
              id="projects-gallery-trigger"
              type="button"
              aria-haspopup="dialog"
              aria-controls="projects-gallery-dialog"
              onClick={onOpenProjectGallery}
              className="group inline-flex items-center gap-3 rounded-full border border-neutral-700 bg-neutral-950/90 px-7 py-3 text-xs font-semibold tracking-[0.12em] text-white shadow-[0_12px_36px_rgba(0,0,0,0.38)] backdrop-blur-md transition-[border-color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[#9C4DFF] hover:bg-[#7B00FF] hover:shadow-[0_14px_40px_rgba(123,0,255,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B875FF]"
            >
              <span>Keep digging</span>
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#B875FF] transition-[background-color,transform] duration-300 group-hover:scale-125 group-hover:bg-white"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
