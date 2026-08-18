import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { ScatterProject } from '../types';

interface ProjectLayerPopupProps {
  project: ScatterProject | null;
  allProjects: ScatterProject[];
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const clampPercentage = (value: number) => Math.min(100, Math.max(0, value));

export const ProjectLayerPopup: React.FC<ProjectLayerPopupProps> = ({
  project,
  allProjects,
  onClose,
  onNavigate,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const onNavigateRef = useRef(onNavigate);
  const projectId = project?.id;
  const isOpen = Boolean(project);

  useEffect(() => {
    onCloseRef.current = onClose;
    onNavigateRef.current = onNavigate;
  }, [onClose, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onNavigateRef.current('prev');
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNavigateRef.current('next');
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ) as HTMLElement[];

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!projectId) return;

    const scrollFrame = window.requestAnimationFrame(() => {
      dialogRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(scrollFrame);
  }, [projectId]);

  if (!project) return null;

  const projectIndex = allProjects.findIndex((item) => item.id === project.id);
  const currentPosition = projectIndex >= 0 ? projectIndex + 1 : 1;
  const hasMultipleProjects = allProjects.length > 1;
  const titleId = `project-popup-title-${project.id}`;
  const descriptionId = `project-popup-description-${project.id}`;
  const colorTitleId = `project-popup-color-title-${project.id}`;
  const fontTitleId = `project-popup-font-title-${project.id}`;
  const mockupTitleId = `project-popup-mockup-title-${project.id}`;
  const accentColor = project.colors[0]?.hex ?? '#7B00FF';
  const mockupImage = project.mockupImage;
  const mockupMobileImage = project.mockupMobileImage;
  const projectCountLabel = `${String(currentPosition).padStart(2, '0')} / ${String(
    allProjects.length,
  ).padStart(2, '0')}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden sm:p-6 lg:p-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="project-popup-backdrop pointer-events-none absolute inset-0 bg-black/90 backdrop-blur-xl" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        lang="ko"
        className="project-popup-panel relative z-10 h-[100svh] w-full max-w-[1180px] overflow-y-auto overscroll-contain bg-[#080808] text-white shadow-[0_24px_100px_rgba(0,0,0,0.82)] sm:h-auto sm:max-h-[94svh] sm:rounded-2xl sm:border sm:border-white/10"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-white/10 bg-black/80 px-5 py-3 backdrop-blur-xl sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Project
            </span>
            <span className="text-xs tabular-nums tracking-[0.16em] text-white" aria-live="polite">
              {projectCountLabel}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('prev')}
              disabled={!hasMultipleProjects}
              aria-label="이전 프로젝트"
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B875FF] disabled:cursor-default disabled:opacity-30"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('next')}
              disabled={!hasMultipleProjects}
              aria-label="다음 프로젝트"
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B875FF] disabled:cursor-default disabled:opacity-30"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="프로젝트 상세 닫기"
              className="ml-1 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:border-[#7B00FF]/70 hover:bg-[#7B00FF]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B875FF]"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main>
          <section className="grid gap-10 px-5 pb-14 pt-8 sm:px-10 sm:pb-20 sm:pt-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-8 lg:gap-14 lg:px-16 lg:pb-24 lg:pt-16">
            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-[clamp(2.7rem,7vw,6rem)] font-medium leading-[0.98] tracking-[-0.055em] text-white md:text-[clamp(2.5rem,5vw,5.5rem)]"
              >
                {project.title}
              </h2>
              <p
                id={descriptionId}
                className="mt-7 max-w-xl break-keep text-base leading-8 text-neutral-300 sm:text-lg sm:leading-9 lg:mt-9"
              >
                {project.description}
              </p>
            </div>

            <figure className="aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-[0_28px_80px_rgba(0,0,0,0.55)] sm:rounded-3xl">
              <img
                src={project.previewImage}
                alt={`${project.title} 프로젝트 대표 이미지`}
                className="size-full object-cover object-center"
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </figure>
          </section>

          <section
            aria-label="프로젝트 기본 정보"
            className="grid border-y border-white/10 sm:grid-cols-3"
          >
            <div className="border-b border-white/10 px-5 py-8 sm:border-b-0 sm:border-r sm:px-8 lg:px-10 lg:py-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                Client · 발주사
              </p>
              <p className="mt-3 break-keep text-base leading-7 text-white lg:text-lg">
                {project.client ?? '—'}
              </p>
            </div>

            <div className="border-b border-white/10 px-5 py-8 sm:border-b-0 sm:border-r sm:px-8 lg:px-10 lg:py-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                Year · 제작연도
              </p>
              <p className="mt-3 text-2xl tabular-nums text-white lg:text-3xl">{project.year}</p>
            </div>

            <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                Contribution · 기여도
              </p>
              <div className="mt-4 space-y-4">
                {(
                  [
                    ['기획', project.contribution.planning],
                    ['디자인', project.contribution.design],
                  ] as const
                ).map(([label, value]) => {
                  const percentage = value === null ? null : clampPercentage(value);

                  return (
                    <div key={label}>
                      <div className="mb-2 flex items-center justify-between gap-4 text-xs">
                        <span className="text-neutral-300">{label}</span>
                        <span className="tabular-nums text-white">
                          {percentage === null ? '—%' : `${percentage}%`}
                        </span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage ?? 0}%`,
                            background: `linear-gradient(90deg, ${accentColor}, #C084FC)`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section
            aria-labelledby={colorTitleId}
            className="px-5 py-20 sm:px-10 sm:py-28 lg:px-16 lg:py-32"
          >
            <div className="mb-10 flex items-end justify-between gap-6 sm:mb-14">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  01
                </p>
                <h3 id={colorTitleId} className="text-3xl tracking-tight text-white sm:text-5xl">
                  Color System
                </h3>
              </div>
              <span className="hidden text-xs uppercase tracking-[0.18em] text-neutral-600 sm:block">
                Brand Palette
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {project.colors.map((color) => (
                <article
                  key={`${color.name}-${color.hex}`}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
                >
                  <div className="h-28 sm:h-36 lg:h-44" style={{ backgroundColor: color.hex }} />
                  <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
                    <p className="text-sm text-white">{color.name}</p>
                    <code className="text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                      {color.hex}
                    </code>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby={fontTitleId}
            className="border-y border-white/10 bg-white/[0.018] px-5 py-20 sm:px-10 sm:py-28 lg:px-16 lg:py-32"
          >
            <div className="mb-10 sm:mb-14">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                02
              </p>
              <h3 id={fontTitleId} className="text-3xl tracking-tight text-white sm:text-5xl">
                Font System
              </h3>
            </div>

            <div className="divide-y divide-white/10 border-y border-white/10">
              {project.fonts.map((font) => (
                <article
                  key={`${font.family}-${font.usage}`}
                  className="grid gap-8 py-8 sm:grid-cols-[minmax(0,1.25fr)_minmax(220px,0.75fr)] sm:items-center sm:py-10"
                >
                  <div className="min-w-0">
                    <p
                      className="truncate leading-none tracking-[-0.045em] text-white"
                      style={
                        font.size
                          ? {
                              fontSize: `clamp(${Math.max(font.size * 0.6, 19)}px, ${font.size / 10}vw, ${font.size}px)`,
                            }
                          : { fontSize: 'clamp(2.2rem, 6vw, 5rem)' }
                      }
                    >
                      {font.family}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.16em] text-neutral-600">
                      Typography Family
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-5 text-sm sm:grid-cols-1 sm:gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">Weight</p>
                      <p className="mt-1 text-neutral-300">{font.weights}</p>
                    </div>
                    {font.size && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">Size</p>
                        <p className="mt-1 tabular-nums text-neutral-300">{font.size}px</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">Usage</p>
                      <p className="mt-1 text-neutral-300">{font.usage}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {mockupImage && (
            <section
              aria-labelledby={mockupTitleId}
              className="overflow-hidden px-5 pb-24 pt-20 sm:px-10 sm:pb-32 sm:pt-28 lg:px-16 lg:pb-40 lg:pt-32"
            >
              <div className="mb-10 sm:mb-14">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  03
                </p>
                <h3 id={mockupTitleId} className="text-3xl tracking-tight text-white sm:text-5xl">
                  Full Page
                </h3>
                <p className="mt-3 text-sm text-neutral-500">Website · Full-page View</p>
              </div>

              <div
                className={`mx-auto grid max-w-5xl gap-10 ${
                  mockupMobileImage
                    ? 'md:grid-cols-[minmax(0,2.25fr)_minmax(180px,0.75fr)] md:items-start md:gap-5 lg:gap-7'
                    : ''
                }`}
              >
                <figure>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-[0_35px_90px_rgba(0,0,0,0.7)] sm:rounded-3xl">
                    <img
                      src={mockupImage}
                      alt={`${project.title} 웹사이트 PC 전체 페이지`}
                      className="block h-auto w-full"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                  <figcaption className="mt-4 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.16em] text-neutral-600 sm:text-xs">
                    <span>{project.title}</span>
                    <span>PC Full Page</span>
                  </figcaption>
                </figure>

                {mockupMobileImage && (
                  <figure>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-[0_28px_70px_rgba(0,0,0,0.62)] sm:rounded-3xl">
                      <img
                        src={mockupMobileImage}
                        alt={`${project.title} 웹사이트 모바일 화면`}
                        className="block h-auto w-full"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                    <figcaption className="mt-4 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.16em] text-neutral-600 sm:text-xs">
                      <span>{project.title}</span>
                      <span>Mobile</span>
                    </figcaption>
                  </figure>
                )}
              </div>
            </section>
          )}
        </main>

        <footer className="flex items-center justify-between border-t border-white/10 px-5 py-6 sm:px-8">
          <button
            type="button"
            onClick={() => onNavigate('prev')}
            disabled={!hasMultipleProjects}
            className="flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.16em] text-neutral-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B875FF] disabled:cursor-default disabled:opacity-30"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span>Prev</span>
          </button>

          <span className="text-xs tabular-nums tracking-[0.14em] text-neutral-600">
            {projectCountLabel}
          </span>

          <button
            type="button"
            onClick={() => onNavigate('next')}
            disabled={!hasMultipleProjects}
            className="flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.16em] text-neutral-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B875FF] disabled:cursor-default disabled:opacity-30"
          >
            <span>Next</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </footer>
      </div>

      <style>{`
        @keyframes projectPopupBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes projectPopupPanelIn {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .project-popup-backdrop {
          animation: projectPopupBackdropIn 280ms ease-out both;
        }

        .project-popup-panel {
          animation: projectPopupPanelIn 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
          scrollbar-color: #7B00FF #080808;
          scrollbar-gutter: stable;
        }

        @media (prefers-reduced-motion: reduce) {
          .project-popup-backdrop,
          .project-popup-panel {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
