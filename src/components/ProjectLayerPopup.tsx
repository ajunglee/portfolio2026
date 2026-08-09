import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { ScatterProject } from '../types';

interface ProjectLayerPopupProps {
  project: ScatterProject | null;
  allProjects: ScatterProject[];
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const ProjectLayerPopup: React.FC<ProjectLayerPopupProps> = ({
  project,
  allProjects,
  onClose,
  onNavigate
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onNavigate('prev');
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNavigate('next');
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
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
  }, [project, onClose, onNavigate]);

  if (!project) return null;

  const projectIndex = allProjects.findIndex((item) => item.id === project.id);
  const currentPosition = projectIndex >= 0 ? projectIndex + 1 : 1;
  const hasMultipleProjects = allProjects.length > 1;
  const titleId = `project-popup-title-${project.id}`;
  const descriptionId = `project-popup-description-${project.id}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/90 backdrop-blur-xl project-popup-backdrop" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="project-popup-panel relative z-10 max-h-[90svh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-2xl border border-[#7B00FF]/30 bg-black text-white shadow-[0_24px_90px_rgba(123,0,255,0.22)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/10 bg-black/85 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="rounded-full border border-[#7B00FF]/35 bg-[#7B00FF]/15 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#D8B4FE]">
              {project.type}
            </span>
            <span className="hidden text-xs text-neutral-400 sm:inline">{project.year}</span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('prev')}
              disabled={!hasMultipleProjects}
              aria-label="Previous project"
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-[#7B00FF]/60 hover:bg-[#7B00FF]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B00FF] disabled:cursor-default disabled:opacity-30"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('next')}
              disabled={!hasMultipleProjects}
              aria-label="Next project"
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-[#7B00FF]/60 hover:bg-[#7B00FF]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B00FF] disabled:cursor-default disabled:opacity-30"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="ml-1 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:border-[#7B00FF]/70 hover:bg-[#7B00FF]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B00FF]"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="p-5 sm:p-8 lg:p-10">
          <div className="mb-7 sm:mb-9">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-[#C084FC]">
              <span>{project.badge}</span>
              <span className="h-px w-7 bg-[#7B00FF]" aria-hidden="true" />
              <span>{project.edition}</span>
            </div>
            <h2
              id={titleId}
              className="text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              {project.title}
            </h2>
          </div>

          <div
            className={`relative mb-9 aspect-[16/10] max-h-[520px] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${project.gradient}`}
          >
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 48%, ${project.accent}99 0%, ${project.accent}22 30%, transparent 64%)`
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" aria-hidden="true" />

            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <div
                className="absolute size-36 rounded-full blur-3xl sm:size-52"
                style={{ backgroundColor: project.accent, opacity: 0.55 }}
              />
              <div
                className="relative flex size-28 rotate-45 items-center justify-center rounded-[2rem] border border-white/35 bg-black/20 shadow-2xl backdrop-blur-md sm:size-40"
                style={{ boxShadow: `0 0 70px ${project.accent}66` }}
              >
                <span className="-rotate-45 text-5xl font-medium text-white sm:text-7xl">
                  {project.title.charAt(0)}
                </span>
              </div>
            </div>

            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-xl border border-white/10 bg-black/55 p-4 backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
              <div>
                <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-neutral-400">Edition</span>
                <span className="text-sm text-white sm:text-base">{project.edition}</span>
              </div>
              <div className="text-right">
                <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-neutral-400">Appreciations</span>
                <span className="text-sm text-[#D8B4FE] sm:text-base">{project.stars}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 border-t border-white/10 pt-8 md:grid-cols-3 md:gap-10">
            <dl className="grid grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-1">
              <div>
                <dt className="mb-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500">Role</dt>
                <dd className="text-sm leading-relaxed text-white">{project.role}</dd>
              </div>
              <div>
                <dt className="mb-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500">Year</dt>
                <dd className="text-sm text-white">{project.year}</dd>
              </div>
              <div>
                <dt className="mb-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500">Floor Price</dt>
                <dd className="text-sm text-[#D8B4FE]">{project.floorPrice}</dd>
              </div>
              <div>
                <dt className="mb-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500">Auction Price</dt>
                <dd className="text-sm text-white">{project.auctionPrice}</dd>
              </div>
            </dl>

            <div className="md:col-span-2">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#C084FC]">About the project</p>
              <p
                id={descriptionId}
                className="max-w-2xl text-base leading-8 text-neutral-300 sm:text-lg sm:leading-9"
              >
                {project.description}
              </p>
            </div>
          </div>

          <footer className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={() => onNavigate('prev')}
              disabled={!hasMultipleProjects}
              className="flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.16em] text-neutral-400 transition-colors hover:text-[#D8B4FE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7B00FF] disabled:cursor-default disabled:opacity-30"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              <span>Prev</span>
            </button>

            <span className="text-xs tracking-[0.14em] text-neutral-500" aria-live="polite">
              {currentPosition} / {allProjects.length}
            </span>

            <button
              type="button"
              onClick={() => onNavigate('next')}
              disabled={!hasMultipleProjects}
              className="flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.16em] text-neutral-400 transition-colors hover:text-[#D8B4FE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7B00FF] disabled:cursor-default disabled:opacity-30"
            >
              <span>Next</span>
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </footer>
        </div>
      </div>

      <style>{`
        @keyframes projectPopupBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes projectPopupPanelIn {
          from { opacity: 0; transform: translateY(24px) scale(0.975); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .project-popup-backdrop {
          animation: projectPopupBackdropIn 280ms ease-out both;
        }

        .project-popup-panel {
          animation: projectPopupPanelIn 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
          scrollbar-color: #7B00FF #000000;
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
