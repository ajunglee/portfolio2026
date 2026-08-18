import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

import { ScatterProject } from '../types';

const PROJECT_YEARS = Array.from({ length: 8 }, (_, index) => String(2026 - index));
const YEAR_TABS = ['all', ...PROJECT_YEARS];

interface ProjectGalleryPopupProps {
  isOpen: boolean;
  projects: ScatterProject[];
  initialFocusProjectId?: string;
  onClose: () => void;
  onSelectProject: (project: ScatterProject) => void;
}

const getFocusableElements = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.getClientRects().length > 0);

export const ProjectGalleryPopup: React.FC<ProjectGalleryPopupProps> = ({
  isOpen,
  projects,
  initialFocusProjectId,
  onClose,
  onSelectProject,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const projectButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const yearTabRefs = useRef(new Map<string, HTMLButtonElement>());
  const onCloseRef = useRef(onClose);
  const [selectedYear, setSelectedYear] = useState('all');

  useLayoutEffect(() => {
    if (!isOpen) return;

    if (!initialFocusProjectId) {
      setSelectedYear('all');
      return;
    }

    const focusedProjectYear = projects.find(
      (project) => project.id === initialFocusProjectId,
    )?.year;

    setSelectedYear(
      focusedProjectYear && PROJECT_YEARS.includes(focusedProjectYear)
        ? focusedProjectYear
        : 'all',
    );
  }, [initialFocusProjectId, isOpen, projects]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const overlay = overlayRef.current;
    const siblingInertStates = overlay?.parentElement
      ? Array.from(overlay.parentElement.children)
          .filter((element): element is HTMLElement => (
            element instanceof HTMLElement && element !== overlay
          ))
          .map((element) => ({ element, wasInert: element.inert }))
      : [];

    document.body.style.overflow = 'hidden';
    siblingInertStates.forEach(({ element }) => {
      element.inert = true;
    });

    const focusFrame = window.requestAnimationFrame(() => {
      const requestedProject = initialFocusProjectId
        ? projectButtonRefs.current.get(initialFocusProjectId)
        : null;

      (requestedProject ?? closeButtonRef.current)?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = getFocusableElements(dialogRef.current);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
        return;
      }

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
      siblingInertStates.forEach(({ element, wasInert }) => {
        element.inert = wasInert;
      });

      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [initialFocusProjectId, isOpen]);

  if (!isOpen) return null;

  const filteredProjects = selectedYear === 'all'
    ? projects
    : projects.filter((project) => project.year === selectedYear);
  const activeTabId = `projects-gallery-tab-${selectedYear}`;

  const handleYearTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentYear: string,
  ) => {
    const currentIndex = YEAR_TABS.indexOf(currentYear);
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % YEAR_TABS.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + YEAR_TABS.length) % YEAR_TABS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = YEAR_TABS.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    const nextYear = YEAR_TABS[nextIndex];
    setSelectedYear(nextYear);
    yearTabRefs.current.get(nextYear)?.focus();
  };

  return (
    <div
      ref={overlayRef}
      className="project-gallery-backdrop fixed inset-0 z-[110] flex items-center justify-center overflow-hidden bg-black/90 backdrop-blur-xl sm:p-6 lg:p-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        id="projects-gallery-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="projects-gallery-title"
        lang="ko"
        className="project-gallery-panel relative h-[100svh] w-full max-w-[1180px] overflow-y-auto overscroll-contain bg-[#080808] text-white shadow-[0_24px_100px_rgba(0,0,0,0.82)] sm:h-auto sm:max-h-[94svh] sm:rounded-2xl sm:border sm:border-white/10"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-20 flex items-center justify-between gap-5 border-b border-white/10 bg-black/80 px-5 py-4 backdrop-blur-xl sm:px-8 sm:py-5">
          <div className="flex min-w-0 items-baseline gap-3 sm:gap-4">
            <h2
              id="projects-gallery-title"
              lang="en"
              className="font-serif-display text-2xl tracking-tight text-white sm:text-3xl"
            >
              All Projects
            </h2>
            <span
              className="text-[10px] tabular-nums tracking-[0.18em] text-neutral-500 sm:text-xs"
              aria-hidden="true"
            >
              {String(filteredProjects.length).padStart(2, '0')}
            </span>
            <span className="sr-only" aria-live="polite">
              {selectedYear === 'all'
                ? `전체 프로젝트 ${filteredProjects.length}개`
                : `${selectedYear}년 프로젝트 ${filteredProjects.length}개`}
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label="전체 프로젝트 갤러리 닫기"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-neutral-300 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B875FF]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <main className="p-4 pb-10 sm:p-6 sm:pb-12 lg:p-8 lg:pb-14">
          <div
            role="tablist"
            aria-label="프로젝트 제작 연도"
            className="-mx-4 mb-7 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:mb-9 sm:px-6 lg:-mx-8 lg:px-8"
          >
            {YEAR_TABS.map((year) => {
              const isSelected = selectedYear === year;
              const label = year === 'all' ? 'ALL' : year;

              return (
                <button
                  key={year}
                  id={`projects-gallery-tab-${year}`}
                  ref={(element) => {
                    if (element) yearTabRefs.current.set(year, element);
                    else yearTabRefs.current.delete(year);
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="projects-gallery-panel"
                  aria-label={year === 'all' ? '전체 연도' : `${year}년`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelectedYear(year)}
                  onKeyDown={(event) => handleYearTabKeyDown(event, year)}
                  className={`min-w-[68px] shrink-0 rounded-full border px-4 py-2 text-xs font-semibold tabular-nums tracking-[0.12em] transition-[border-color,background-color,color,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B875FF] sm:min-w-[76px] sm:px-5 sm:text-sm ${
                    isSelected
                      ? 'border-[#9C4DFF] bg-[#7B00FF] text-white shadow-[0_8px_24px_rgba(123,0,255,0.28)]'
                      : 'border-white/15 bg-white/[0.03] text-neutral-400 hover:-translate-y-0.5 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div
            id="projects-gallery-panel"
            role="tabpanel"
            aria-labelledby={activeTabId}
          >
            {filteredProjects.length > 0 ? (
              <ul
                className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10"
                aria-label={selectedYear === 'all' ? '전체 프로젝트 목록' : `${selectedYear}년 프로젝트 목록`}
              >
                {filteredProjects.map((project) => (
                  <li key={project.id}>
                    <button
                      ref={(element) => {
                        if (element) projectButtonRefs.current.set(project.id, element);
                        else projectButtonRefs.current.delete(project.id);
                      }}
                      type="button"
                      aria-label={`${project.title} 프로젝트 상세 보기`}
                      onClick={() => onSelectProject(project)}
                      className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B875FF]"
                    >
                      <span className="relative block aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 transition-[border-color,box-shadow] duration-300 group-hover:border-[#7B00FF]/60 group-hover:shadow-[0_16px_42px_rgba(123,0,255,0.18)] sm:rounded-2xl">
                        <img
                          src={project.previewImage}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                        />
                        <span
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-80"
                          aria-hidden="true"
                        />
                      </span>

                      <span className="mt-3 block line-clamp-2 text-sm font-semibold leading-snug text-neutral-200 transition-colors group-hover:text-white sm:mt-4 sm:text-base">
                        {project.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 text-center">
                <p className="text-sm leading-relaxed text-neutral-500">
                  {selectedYear}년에 등록된 프로젝트가 없습니다.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes project-gallery-backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes project-gallery-panel-in {
          from { opacity: 0; transform: translateY(22px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .project-gallery-backdrop {
          animation: project-gallery-backdrop-in 220ms ease-out both;
        }

        .project-gallery-panel {
          animation: project-gallery-panel-in 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .project-gallery-backdrop,
          .project-gallery-panel {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
