import React, { useEffect, useRef } from 'react';
import { Layers3, Search, Sparkles, X } from 'lucide-react';

interface AboutLayerPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DISCIPLINES = [
  {
    title: 'Web UI/UX',
    description: 'Turning complex journeys into clear, intuitive digital experiences.',
    icon: Search,
  },
  {
    title: 'Visual Design',
    description: 'Building visual systems that give every touchpoint one distinct voice.',
    icon: Layers3,
  },
  {
    title: 'Motion',
    description: 'Using movement to guide attention, explain change, and create rhythm.',
    icon: Sparkles,
  },
];

const PROCESS = [
  ['01', 'Discover', 'Look beneath the request and find the question that matters.'],
  ['02', 'Define', 'Turn observations into a focused direction and clear priorities.'],
  ['03', 'Design', 'Shape the idea across interaction, image, type, and motion.'],
  ['04', 'Refine', 'Test the details until every part supports the same intention.'],
];

const AboutLayerPopup: React.FC<AboutLayerPopupProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCloseRef.current();
      }}
    >
      <div className="about-popup-backdrop pointer-events-none absolute inset-0 bg-black/90 backdrop-blur-xl" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-popup-title"
        aria-describedby="about-popup-description"
        className="about-popup-panel relative z-10 max-h-[90svh] w-full max-w-6xl overflow-y-auto overscroll-contain rounded-2xl border border-[#7B00FF]/35 bg-black text-white shadow-[0_24px_100px_rgba(123,0,255,0.24)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black/80 px-5 py-4 backdrop-blur-xl sm:px-8">
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#C084FC]">
            About / Design approach
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => onCloseRef.current()}
            aria-label="Close about dialog"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-[#7B00FF]/70 hover:bg-[#7B00FF]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B875FF]"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="p-5 sm:p-8 lg:p-12">
          <section className="grid items-center gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-16">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#B875FF]">I’m a Digger.</p>
              <h2
                id="about-popup-title"
                className="max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
              >
                I dig for the reason behind the surface.
              </h2>
              <p
                id="about-popup-description"
                className="mt-6 max-w-2xl text-base leading-8 text-neutral-300 sm:text-lg sm:leading-9"
              >
                Good design begins before the first screen. I look beneath the visible problem,
                find what is worth solving, and turn that insight into an experience people can
                understand and remember.
              </p>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[360px]" aria-hidden="true">
              <div className="absolute inset-[8%] rounded-full border border-[#7B00FF]/25 shadow-[0_0_80px_rgba(123,0,255,0.24)]" />
              <div className="absolute inset-[22%] animate-[aboutOrbit_12s_linear_infinite] rounded-[38%] border border-[#B875FF]/45 bg-[#7B00FF]/10 shadow-[inset_0_0_45px_rgba(123,0,255,0.2)] motion-reduce:animate-none" />
              <div className="absolute inset-[37%] rotate-45 rounded-xl border border-white/40 bg-[#7B00FF]/35 shadow-[0_0_55px_rgba(123,0,255,0.65)] backdrop-blur-md" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,117,255,0.22),transparent_62%)]" />
            </div>
          </section>

          <section className="border-b border-white/10 py-12 lg:py-16" aria-labelledby="about-disciplines-title">
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h3 id="about-disciplines-title" className="text-2xl sm:text-3xl">What I explore</h3>
              <p className="text-sm text-neutral-500">Three disciplines, one connected experience.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {DISCIPLINES.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition-colors hover:border-[#7B00FF]/50 hover:bg-[#7B00FF]/10"
                >
                  <Icon className="mb-8 size-6 text-[#B875FF]" aria-hidden="true" />
                  <h4 className="mb-3 text-xl text-white">{title}</h4>
                  <p className="text-sm leading-7 text-neutral-400">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="pt-12 lg:pt-16" aria-labelledby="about-process-title">
            <h3 id="about-process-title" className="mb-8 text-2xl sm:text-3xl">How I dig</h3>
            <ol className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
              {PROCESS.map(([number, title, description]) => (
                <li key={number} className="bg-black p-6 lg:min-h-56 lg:p-7">
                  <span className="text-xs tracking-[0.2em] text-[#B875FF]">{number}</span>
                  <h4 className="mt-8 text-xl text-white">{title}</h4>
                  <p className="mt-3 text-sm leading-7 text-neutral-400">{description}</p>
                </li>
              ))}
            </ol>

            <p className="mx-auto mt-12 max-w-3xl text-center text-xl leading-relaxed text-neutral-200 sm:text-2xl">
              Beneath every problem, there is something worth finding.
            </p>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes aboutPopupBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes aboutPopupPanelIn {
          from { opacity: 0; transform: translateY(28px) scale(0.975); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes aboutOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .about-popup-backdrop {
          animation: aboutPopupBackdropIn 260ms ease-out both;
        }

        .about-popup-panel {
          animation: aboutPopupPanelIn 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
          scrollbar-color: #7B00FF #000000;
        }

        @media (prefers-reduced-motion: reduce) {
          .about-popup-backdrop,
          .about-popup-panel {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export { AboutLayerPopup };
export default React.memo(AboutLayerPopup);
