import React, { useEffect, useRef, useState } from 'react';

import { SCATTER_PROJECTS } from '../data';
import { ScatterProject } from '../types';
import ViewportReveal from './ViewportReveal';

interface ProjectsSectionProps {
  onSelectScatterProject?: (proj: ScatterProject) => void;
}

type ProjectsMotionPhase = 'idle' | 'lead' | 'flipping' | 'holding' | 'aligning' | 'marquee';

const FLIP_DURATION_MS = 1050;
const FLIP_STAGGER_MS = 180;
const TITLE_LEAD_MS = 500;
const SCATTER_HOLD_MS = 650;
const ALIGN_DURATION_MS = 900;

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onSelectScatterProject }) => {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [motionPhase, setMotionPhase] = useState<ProjectsMotionPhase>('idle');

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

        <div className="project-card-face h-full w-full rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900/90 via-black/80 to-black p-4 shadow-2xl backdrop-blur-md transition-[border-color,box-shadow] duration-500 group-hover:border-[#7B00FF]/60 group-hover:shadow-[0_15px_35px_rgba(123,0,255,0.18)]">
          <div
            className={`relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-xl border border-neutral-800/80 bg-gradient-to-br p-3 ${proj.gradient}`}
          >
            <div className="z-10 flex items-center justify-between">
              <span className="rounded border border-[#7B00FF]/25 bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#D8B4FE]">
                {proj.badge}
              </span>
              <span className="font-mono text-[10px] text-neutral-400">#124</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="h-24 w-24 rounded-full opacity-60 blur-xl transition-transform duration-500 group-hover:scale-125"
                style={{ backgroundColor: proj.accent }}
              />
              <div className="z-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/5 shadow-inner backdrop-blur-sm transition-colors group-hover:border-[#7B00FF]/60">
                  <span className="font-serif-display text-xl font-bold text-white">
                    {proj.title[0]}
                  </span>
                </div>
              </div>
            </div>

            <div className="z-10 rounded-lg border border-neutral-800 bg-black/80 p-2.5 backdrop-blur-sm">
              <p className="truncate text-[11px] font-semibold text-white">{proj.title}</p>
              <p className="mt-0.5 text-[9px] text-neutral-400">{proj.edition}</p>
              <div className="mt-2 flex items-center justify-between border-t border-neutral-800 pt-1.5 text-[9px]">
                <div>
                  <span className="block text-neutral-500">Floor Price</span>
                  <span className="font-mono font-medium text-[#C084FC]">{proj.floorPrice}</span>
                </div>
                <div className="text-right">
                  <span className="block text-neutral-500">Auction</span>
                  <span className="font-mono font-medium text-emerald-400">{proj.auctionPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <section
      id="projects"
      className="relative min-h-[100svh] w-full overflow-x-clip bg-black xl:h-[160svh] xl:min-h-0 motion-reduce:xl:h-auto motion-reduce:xl:min-h-[100svh]"
    >
      <div className="relative min-h-[100svh] overflow-hidden py-48 md:py-72 xl:sticky xl:top-0 xl:h-[100svh] xl:min-h-0 xl:py-0 motion-reduce:xl:static motion-reduce:xl:h-auto motion-reduce:xl:min-h-[100svh] motion-reduce:xl:py-96">
        <div className="portfolio-grid xl:h-full xl:content-center motion-reduce:xl:h-auto">
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
            className="projects-marquee-viewport col-span-full"
            aria-label="Projects gallery"
          >
            <div
              className={`projects-showcase-track projects-phase-${motionPhase}`}
            >
              <div className="projects-marquee-set projects-marquee-set--primary">
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
        </div>
      </div>
    </section>
  );
};
