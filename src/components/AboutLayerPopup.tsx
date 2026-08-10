import React, { useEffect, useRef } from 'react';
import { Layers3, Search, Sparkles, X } from 'lucide-react';

interface AboutLayerPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DISCIPLINES = [
  {
    title: '웹 UI/UX',
    description: '복잡한 사용자 여정을 명확하고 직관적인 디지털 경험으로 정리합니다.',
    icon: Search,
  },
  {
    title: '비주얼 디자인',
    description: '모든 접점이 하나의 분명한 목소리를 갖도록 시각 체계를 설계합니다.',
    icon: Layers3,
  },
  {
    title: '모션',
    description: '움직임으로 시선을 이끌고 변화를 설명하며 경험의 리듬을 만듭니다.',
    icon: Sparkles,
  },
];

const PROCESS = [
  ['01', '탐색', '요청의 이면을 살피고 정말 중요한 질문을 발견합니다.'],
  ['02', '정의', '관찰한 내용을 명확한 방향과 우선순위로 정리합니다.'],
  ['03', '디자인', '인터랙션, 이미지, 타이포그래피, 모션을 하나의 아이디어로 연결합니다.'],
  ['04', '다듬기', '모든 요소가 같은 의도를 말할 때까지 세부를 검증하고 다듬습니다.'],
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
        lang="ko"
        className="about-popup-panel chiron-sung-hk relative z-10 max-h-[90svh] w-full max-w-6xl overflow-y-auto overscroll-contain rounded-2xl border border-[#7B00FF]/35 bg-black text-white shadow-[0_24px_100px_rgba(123,0,255,0.24)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black/80 px-5 py-4 backdrop-blur-xl sm:px-8">
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#C084FC]">
            소개 / 디자인 접근 방식
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => onCloseRef.current()}
            aria-label="소개 팝업 닫기"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-[#7B00FF]/70 hover:bg-[#7B00FF]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B875FF]"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="p-5 sm:p-8 lg:p-12">
          <section className="grid items-center gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-16">
            <div>
              <p className="mb-4 text-xs tracking-[0.18em] text-[#B875FF]">깊이 파고드는 디자이너</p>
              <h2
                id="about-popup-title"
                className="max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
              >
                보이는 것 너머의 이유를 파고듭니다.
              </h2>
              <p
                id="about-popup-description"
                className="mt-6 max-w-2xl text-base leading-8 text-neutral-300 sm:text-lg sm:leading-9"
              >
                좋은 디자인은 첫 화면을 그리기 전부터 시작됩니다. 눈앞의 문제 아래를
                들여다보고, 정말 해결할 가치가 있는 지점을 찾아 사람들이 쉽게 이해하고
                오래 기억할 경험으로 바꿉니다.
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
              <h3 id="about-disciplines-title" className="text-2xl sm:text-3xl">제가 탐구하는 영역</h3>
              <p className="text-sm text-neutral-500">세 가지 분야를 하나의 연결된 경험으로 만듭니다.</p>
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
            <h3 id="about-process-title" className="mb-8 text-2xl sm:text-3xl">제가 파고드는 방식</h3>
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
              모든 문제의 이면에는 발견할 가치가 있는 무언가가 있습니다.
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
