import React, { useEffect, useRef, useState } from 'react';

import { FEATURED_PROJECTS } from '../data';
import { FeaturedProject } from '../types';
import ViewportReveal from './ViewportReveal';

const FEATURED_VIDEO_URL = new URL('../video/featured_video.mp4', import.meta.url).href;

interface FeaturedSectionProps {
  onSelectProject: (project: FeaturedProject) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onSelectProject }) => {
  // Active index (0: BX, 1: UI/UX, 2: Promotion)
  const [activeIndex, setActiveIndex] = useState(1);
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const total = FEATURED_PROJECTS.length;

  useEffect(() => {
    if (!hasEntered || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const autoplayId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % total);
    }, 4000);

    return () => window.clearInterval(autoplayId);
  }, [hasEntered, total]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );

    const section = sectionRef.current;
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Calculate relative offset for infinite horizontal sliding
  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff < -Math.floor(total / 2)) diff += total;
    if (diff > Math.floor(total / 2)) diff -= total;
    return diff; // -1 (left), 0 (center), 1 (right)
  };

  return (
    <section
      id="featured"
      ref={sectionRef}
      className="relative min-h-[100svh] w-full overflow-x-clip bg-black select-none xl:h-[160svh] xl:min-h-0 motion-reduce:xl:h-auto motion-reduce:xl:min-h-[100svh]"
    >
      <div className="relative min-h-[100svh] overflow-hidden py-48 md:py-72 xl:sticky xl:top-0 xl:h-[100svh] xl:min-h-0 xl:py-0 motion-reduce:xl:static motion-reduce:xl:h-auto motion-reduce:xl:min-h-[100svh] motion-reduce:xl:py-96">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <video
            ref={videoRef}
            src={FEATURED_VIDEO_URL}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="portfolio-grid relative z-10 xl:h-full xl:content-center motion-reduce:xl:h-auto">
        {/* Section Title */}
        <ViewportReveal
          className="col-span-full mb-16 text-center"
          distance={{ mobile: 80, desktop: 170 }}
          progressOffset={[0, 0.62]}
          viewportOffset={['start 98%', 'start 46%']}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[100pt] font-serif-display tracking-tight text-white">
            Featured
          </h2>
        </ViewportReveal>

        {/* Card Carousel Stage */}
        <ViewportReveal
          className="relative col-span-full mx-auto flex min-h-[500px] max-w-6xl items-center justify-center perspective-[1200px] sm:min-h-[580px] md:min-h-[650px] xl:col-start-2 xl:col-span-10 xl:max-w-none"
          distance={{ mobile: 65, desktop: 125 }}
          delay={0.1}
          progressOffset={[0, 0.8]}
          viewportOffset={['start 98%', 'start 42%']}
        >
        
        {/* Sliding Cards Track */}
        <div className="relative w-full max-w-[1050px] h-[440px] sm:h-[520px] md:h-[600px] flex items-center justify-center">
          {FEATURED_PROJECTS.map((project, index) => {
            const offset = getOffset(index);
            const isCenter = offset === 0;
            const isLeft = offset === -1;
            const isRight = offset === 1;

            // Calculate horizontal transform percentage & styling
            let translateX = '0%';
            let scale = 1;
            let opacity = 1;
            let zIndex = 20;
            let filter = 'brightness(1)';
            let rotateY = '0deg';

            if (isLeft) {
              translateX = '-68%';
              scale = 0.82;
              opacity = 1;
              zIndex = 10;
              filter = 'brightness(1) contrast(1)';
              rotateY = '10deg';
            } else if (isRight) {
              translateX = '68%';
              scale = 0.82;
              opacity = 1;
              zIndex = 10;
              filter = 'brightness(1) contrast(1)';
              rotateY = '-10deg';
            } else if (!isCenter) {
              translateX = offset < 0 ? '-140%' : '140%';
              scale = 0.6;
              opacity = 0;
              zIndex = 0;
            }

            return (
              <div
                key={project.id}
                onClick={() => {
                  if (isCenter) {
                    onSelectProject(project);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                className="absolute w-[86vw] sm:w-[58vw] max-w-[520px] h-[420px] sm:h-[500px] md:h-[580px] rounded-2xl cursor-pointer flex flex-col justify-end p-6 sm:p-8 overflow-hidden"
                style={{
                  transform: `translateX(${translateX}) scale(${scale}) rotateY(${rotateY})`,
                  opacity,
                  zIndex,
                  filter,
                  transition: 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease, filter 500ms ease, border-color 400ms ease, box-shadow 400ms ease',
                  backgroundColor: '#121212',
                  border: isCenter ? '1px solid rgba(123, 0, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isCenter
                    ? '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(123, 0, 255, 0.22)'
                    : '0 15px 35px rgba(0, 0, 0, 0.7)'
                }}
              >
                {/* Image Background */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className={`w-full h-full ${project.previewBg} flex items-center justify-center relative`}>
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className={`w-full h-full object-cover opacity-100 transition-transform duration-700 ease-out ${
                        isCenter ? 'scale-100 hover:scale-105' : 'scale-100'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  </div>
                </div>

                {/* Card Info Overlay */}
                <div
                  className={`relative z-10 text-center p-4 sm:p-5 rounded-xl border transition-all duration-500 ${
                    isCenter
                      ? 'bg-black/75 backdrop-blur-md border-neutral-800 shadow-xl'
                      : 'bg-black/50 backdrop-blur-sm border-white/5'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#D8B4FE] font-semibold mb-1 block">
                    {project.category}
                  </span>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif-display font-medium text-white tracking-wider">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-2 font-light tracking-wide line-clamp-1">
                    {project.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        </ViewportReveal>

        {/* Helper hint */}
        <ViewportReveal
          className="col-span-full mt-6 text-center"
          distance={{ mobile: 35, desktop: 55 }}
          delay={0.22}
          progressOffset={[0, 0.95]}
          viewportOffset={['start 100%', 'start 55%']}
        >
          <p className="text-[14px] uppercase tracking-[0.2em] text-neutral-500">
            Click center card to view project details
          </p>
        </ViewportReveal>
        </div>
      </div>
    </section>
  );
};
