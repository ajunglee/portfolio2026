import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AboutLayerPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ABOUT_MEDIA = {
  hero: new URL('../images/about_top_bg.jpg', import.meta.url).href,
  heroTitle: new URL('../images/about_digging.png', import.meta.url).href,
  whyCrystals: [
    new URL('../images/about_crystal1.png', import.meta.url).href,
    new URL('../images/about_crystal2.png', import.meta.url).href,
    new URL('../images/about_crystal3.png', import.meta.url).href,
    new URL('../images/about_crystal4.png', import.meta.url).href,
    new URL('../images/about_crystal5.png', import.meta.url).href,
  ],
  quoteTextures: [
    new URL('../images/about_crack1.jpg', import.meta.url).href,
    new URL('../images/about_crack2.jpg', import.meta.url).href,
    new URL('../images/about_crack3.jpg', import.meta.url).href,
    new URL('../images/about_crack4.jpg', import.meta.url).href,
    new URL('../images/about_crack5.jpg', import.meta.url).href,
    new URL('../images/about_crack6.jpg', import.meta.url).href,
  ],
  atmosphere: new URL('../images/about_dust.png', import.meta.url).href,
  conceptCardBack: new URL('../images/about_card_bh.png', import.meta.url).href,
  conceptCards: [
    new URL('../images/about_card1.png', import.meta.url).href,
    new URL('../images/about_card2.png', import.meta.url).href,
    new URL('../images/about_card3.png', import.meta.url).href,
    new URL('../images/about_card4.png', import.meta.url).href,
    new URL('../images/about_card5.png', import.meta.url).href,
    new URL('../images/about_card6.png', import.meta.url).href,
  ],
} as const;

const WHY_DIGGING = [
  {
    number: '01',
    text: '디자인을 시작하기 전에 문제를 먼저 이해하려고 해요.',
  },
  {
    number: '02',
    text: '첫 번째 아이디어보다 더 나은 방향이 있는지 고민해요.',
  },
  {
    number: '03',
    text: '여러 가지 경우의 수를 두고 주변 사람들과 의견을 나눠요.',
  },
] as const;

const FOUND_BY_OTHERS = [
  {
    quote: '여러가지 해결책을 줘서 GPT같은 느낌이에요.',
    author: '동료 디자이너',
    fallback:
      'bg-[radial-gradient(circle_at_48%_42%,rgba(87,69,99,0.48),rgba(17,17,17,0.92)_48%,#050505_74%)]',
  },
  {
    quote: '업무할 때 꼼꼼하게 보며 믿고 맡길 수 있어요.',
    author: '프로젝트 매니저',
    fallback:
      'bg-[radial-gradient(circle_at_54%_36%,rgba(85,79,63,0.46),rgba(18,18,17,0.92)_50%,#050505_76%)]',
  },
  {
    quote: '감정적이지 않고 상대가 편한 방향으로 배려해줘요.',
    author: '회사동료',
    fallback:
      'bg-[radial-gradient(circle_at_42%_46%,rgba(67,78,91,0.48),rgba(16,17,18,0.94)_52%,#050505_77%)]',
  },
  {
    quote: '한 문제를 깊이 살피고 적절한 해결책을 내놔요.',
    author: '친구A',
    fallback:
      'bg-[radial-gradient(circle_at_56%_45%,rgba(72,60,88,0.5),rgba(15,15,16,0.94)_49%,#040404_76%)]',
  },
  {
    quote: '삶과 일에 진취적이고 합리적인 것을 좋아해요.',
    author: '친구B',
    fallback:
      'bg-[radial-gradient(circle_at_46%_38%,rgba(80,69,56,0.48),rgba(17,16,15,0.94)_51%,#050505_78%)]',
  },
  {
    quote: '다른 사람의 이야기를 잘 들어주고 조언해줘요.',
    author: '친구C',
    fallback:
      'bg-[radial-gradient(circle_at_52%_44%,rgba(59,75,79,0.5),rgba(15,17,17,0.94)_50%,#040505_77%)]',
  },
] as const;

const DESIGN_CONCEPTS = [
  {
    title: 'CAVE',
    rotation: '-rotate-[4deg] translate-y-3',
  },
  {
    title: 'LIGHT',
    rotation: 'rotate-[2deg]',
  },
  {
    title: 'CRYSTAL',
    rotation: 'rotate-[5deg] translate-y-4',
  },
  {
    title: 'CRACK',
    rotation: 'rotate-[3deg] -translate-y-2',
  },
  {
    title: 'DUST',
    rotation: '-rotate-[3deg] -translate-y-1',
  },
  {
    title: 'METAL',
    rotation: 'rotate-[4deg] -translate-y-2',
  },
] as const;

interface MediaSlotProps {
  src?: string;
  alt: string;
  className: string;
  fallbackClassName: string;
  loading?: 'eager' | 'lazy';
  revealName?: string;
}

const MediaSlot: React.FC<MediaSlotProps> = ({
  src,
  alt,
  className,
  fallbackClassName,
  loading = 'lazy',
  revealName,
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        draggable={false}
        data-about-reveal={revealName}
      />
    );
  }

  return (
    <div
      className={className + ' ' + fallbackClassName}
      aria-hidden="true"
      data-about-reveal={revealName}
    />
  );
};

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

  useLayoutEffect(() => {
    if (!isOpen) return;

    const scroller = dialogRef.current;
    if (!scroller) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const select = <T extends Element>(selector: string) => scroller.querySelector<T>(selector);
        const selectAll = <T extends Element>(selector: string) =>
          Array.from(scroller.querySelectorAll<T>(selector));
        const scrollTriggerFor = (trigger: Element) => ({
          trigger,
          scroller,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        });
        const clearRevealStyles = 'opacity,visibility,transform';

        const heroSection = select<HTMLElement>('[data-about-section="hero"]');
        const heroVisual = select<HTMLElement>('[data-about-reveal="hero-visual"]');
        const heroTitle = select<HTMLElement>('[data-about-reveal="hero-title"]');
        const heroCopy = select<HTMLElement>('[data-about-reveal="hero-copy"]');

        if (heroSection && heroVisual && heroTitle && heroCopy) {
          gsap.set(heroVisual, { autoAlpha: 0, filter: 'brightness(0.62)' });
          gsap.set(heroTitle, { autoAlpha: 0, y: 40 });
          gsap.set(heroCopy, { autoAlpha: 0, y: 20 });

          gsap
            .timeline({ scrollTrigger: scrollTriggerFor(heroSection) })
            .to(
              heroVisual,
              {
                autoAlpha: 1,
                filter: 'brightness(1)',
                duration: 1.4,
                ease: 'power2.out',
                clearProps: 'opacity,visibility,filter',
              },
              0,
            )
            .to(
              heroTitle,
              {
                autoAlpha: 1,
                y: 0,
                duration: 1.3,
                ease: 'power3.out',
                clearProps: clearRevealStyles,
              },
              0.18,
            )
            .to(
              heroCopy,
              {
                autoAlpha: 1,
                y: 0,
                duration: 1.15,
                ease: 'power2.out',
                clearProps: clearRevealStyles,
              },
              0.48,
            );
        }

        const whySection = select<HTMLElement>('[data-about-section="why"]');
        const whyTitle = select<HTMLElement>('[data-about-reveal="why-title"]');
        const whyList = select<HTMLElement>('[data-about-reveal="why-list"]');
        const whyItems = selectAll<HTMLElement>('[data-about-reveal="why-item"]');

        if (whySection && whyTitle && whyList && whyItems.length > 0) {
          gsap.set(whyTitle, { autoAlpha: 0, y: 30 });
          gsap.set(whyItems, { autoAlpha: 0, y: 25 });

          gsap.to(whyTitle, {
            autoAlpha: 1,
            y: 0,
            duration: 1.15,
            ease: 'power3.out',
            clearProps: clearRevealStyles,
            scrollTrigger: scrollTriggerFor(whySection),
          });

          gsap.to(whyItems, {
            autoAlpha: 1,
            y: 0,
            duration: 1.5,
            ease: 'power2.out',
            stagger: 0.45,
            clearProps: clearRevealStyles,
            scrollTrigger: scrollTriggerFor(whyList),
          });
        }

        const foundSection = select<HTMLElement>('[data-about-section="found"]');
        const foundTitle = select<HTMLElement>('[data-about-reveal="found-title"]');
        const foundItems = selectAll<HTMLElement>('[data-about-reveal="found-item"]');

        if (foundSection && foundTitle && foundItems.length > 0) {
          gsap.set(foundTitle, { autoAlpha: 0, y: 30 });
          gsap.set(foundItems, { autoAlpha: 0, y: 30, scale: 0.96 });

          gsap
            .timeline({ scrollTrigger: scrollTriggerFor(foundSection) })
            .to(
              foundTitle,
              {
                autoAlpha: 1,
                y: 0,
                duration: 1.15,
                ease: 'power3.out',
                clearProps: clearRevealStyles,
              },
              0,
            )
            .to(
              foundItems,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 1.15,
                ease: 'power3.out',
                stagger: 0.17,
                clearProps: clearRevealStyles,
              },
              0.38,
            );
        }

        const middleVisual = select<HTMLElement>('[data-about-section="middle-visual"]');
        const middleDust = select<HTMLElement>('[data-about-reveal="middle-dust"]');

        if (middleVisual && middleDust) {
          gsap.set(middleVisual, { autoAlpha: 0 });
          gsap.set(middleDust, {
            maskPosition: '0% 50%',
            webkitMaskPosition: '0% 50%',
          });

          gsap
            .timeline({ scrollTrigger: scrollTriggerFor(middleVisual) })
            .to(
              middleVisual,
              {
                autoAlpha: 1,
                duration: 1.8,
                ease: 'power1.out',
                clearProps: 'opacity,visibility',
              },
              0,
            )
            .to(
              middleDust,
              {
                maskPosition: '100% 50%',
                webkitMaskPosition: '100% 50%',
                duration: 2.6,
                ease: 'power2.inOut',
                clearProps: 'maskPosition,webkitMaskPosition',
              },
              0,
            );
        }

        const conceptSection = select<HTMLElement>('[data-about-section="concept"]');
        const conceptTitle = select<HTMLElement>('[data-about-reveal="concept-title"]');
        const conceptGrid = select<HTMLElement>('[data-about-reveal="concept-grid"]');
        const conceptCards = selectAll<HTMLElement>('[data-about-reveal="concept-card"]');

        if (conceptSection && conceptTitle && conceptGrid && conceptCards.length > 0) {
          gsap.set(conceptTitle, { autoAlpha: 0, y: 30 });
          gsap.set(conceptCards, { rotationY: 180 });

          gsap.to(conceptTitle, {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            clearProps: clearRevealStyles,
            scrollTrigger: scrollTriggerFor(conceptSection),
          });

          gsap.to(conceptCards, {
            rotationY: 0,
            duration: 1.45,
            ease: 'power3.inOut',
            stagger: 0.16,
            force3D: true,
            clearProps: 'transform',
            scrollTrigger: scrollTriggerFor(conceptGrid),
          });
        }

        const keepSection = select<HTMLElement>('[data-about-section="keep"]');
        const keepCopy = select<HTMLElement>('[data-about-reveal="keep-copy"]');

        if (keepSection && keepCopy) {
          gsap.set(keepCopy, { autoAlpha: 0, y: 15 });
          gsap.to(keepCopy, {
            autoAlpha: 1,
            y: 0,
            duration: 1.65,
            ease: 'power2.out',
            clearProps: clearRevealStyles,
            scrollTrigger: scrollTriggerFor(keepSection),
          });
        }

        const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
        let disposed = false;

        const handlePanelAnimationEnd = (event: AnimationEvent) => {
          if (event.target === scroller && event.animationName === 'aboutPopupPanelIn') {
            ScrollTrigger.refresh();
          }
        };

        scroller.addEventListener('animationend', handlePanelAnimationEnd);

        void document.fonts.ready.then(() => {
          if (!disposed && scroller.isConnected) ScrollTrigger.refresh();
        });

        return () => {
          disposed = true;
          window.cancelAnimationFrame(refreshFrame);
          scroller.removeEventListener('animationend', handlePanelAnimationEnd);
        };
      });
    }, scroller);

    return () => context.revert();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden sm:p-6 lg:p-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCloseRef.current();
      }}
    >
      <div className="about-popup-backdrop pointer-events-none absolute inset-0 bg-black/92 backdrop-blur-xl" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-popup-title"
        aria-describedby="about-popup-description"
        lang="ko"
        className="about-popup-panel relative z-10 h-[100svh] w-full max-w-[960px] overflow-y-auto overscroll-contain bg-black text-white shadow-[0_24px_100px_rgba(0,0,0,0.72)] sm:h-auto sm:max-h-[94svh] sm:rounded-2xl sm:border sm:border-white/10"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/72 px-5 py-3 backdrop-blur-xl sm:px-8">
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#C084FC]">About</span>
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

        <main className="overflow-hidden bg-black">
          <section
            className="relative isolate min-h-[445px] overflow-hidden sm:min-h-[720px] lg:min-h-[780px]"
            aria-labelledby="about-popup-title"
            data-about-section="hero"
          >
            <MediaSlot
              src={ABOUT_MEDIA.hero}
              alt=""
              className="absolute inset-0 size-full bg-black object-contain object-top"
              fallbackClassName="bg-[radial-gradient(circle_at_50%_34%,rgba(175,111,255,0.44),transparent_16%),radial-gradient(circle_at_50%_40%,rgba(245,187,79,0.22),transparent_30%),#030303]"
              loading="eager"
              revealName="hero-visual"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_64%,rgba(0,0,0,0.55)_82%,#000_100%)]"
              aria-hidden="true"
            />

            <div className="absolute inset-x-5 bottom-12 z-10 text-center sm:bottom-16">
              <h2
                id="about-popup-title"
                className="w-full"
                data-about-reveal="hero-title"
              >
                <span className="sr-only">DIGGING</span>
                <img
                  src={ABOUT_MEDIA.heroTitle}
                  alt=""
                  width={2070}
                  height={330}
                  className="mx-auto block h-auto w-full max-w-[900px] object-contain"
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  aria-hidden="true"
                />
              </h2>
              <p
                id="about-popup-description"
                className="mt-3 font-serif-display text-xs tracking-[0.04em] text-neutral-300 sm:text-base xl:text-[32px] xl:tracking-[-0.02em]"
                data-about-reveal="hero-copy"
              >
                Finding solutions beneath the surface.
              </p>
            </div>
          </section>

          <section
            className="relative isolate px-5 pb-24 pt-32 sm:px-10 sm:pb-32 sm:pt-44 xl:pt-52"
            aria-labelledby="why-digging-title"
            data-about-section="why"
          >
            <img
              src={ABOUT_MEDIA.whyCrystals[3]}
              alt=""
              aria-hidden="true"
              className="about-floating-mineral pointer-events-none absolute -top-5 left-16 z-0 w-24 -rotate-[18deg] opacity-45 mix-blend-screen sm:-top-6 sm:left-24 sm:w-32"
              draggable={false}
            />
            <img
              src={ABOUT_MEDIA.whyCrystals[4]}
              alt=""
              aria-hidden="true"
              className="about-floating-mineral about-floating-mineral--reverse pointer-events-none absolute -top-8 left-36 z-0 w-12 rotate-[18deg] opacity-35 mix-blend-screen sm:-top-10 sm:left-52 sm:w-16"
              draggable={false}
            />
            <img
              src={ABOUT_MEDIA.whyCrystals[2]}
              alt=""
              aria-hidden="true"
              className="about-floating-mineral pointer-events-none absolute left-[62%] top-16 z-0 w-48 -translate-x-1/2 rotate-[16deg] opacity-45 mix-blend-screen sm:top-14 sm:w-64"
              draggable={false}
            />
            <img
              src={ABOUT_MEDIA.whyCrystals[1]}
              alt=""
              aria-hidden="true"
              className="about-floating-mineral about-floating-mineral--reverse pointer-events-none absolute bottom-4 -left-20 z-0 w-64 -rotate-[24deg] opacity-40 mix-blend-screen sm:bottom-6 sm:w-80"
              draggable={false}
            />
            <img
              src={ABOUT_MEDIA.whyCrystals[0]}
              alt=""
              aria-hidden="true"
              className="about-floating-mineral pointer-events-none absolute -bottom-16 -right-12 z-0 w-44 rotate-[26deg] opacity-45 mix-blend-screen sm:-bottom-20 sm:w-56"
              draggable={false}
            />

            <div className="relative z-10 mx-auto max-w-3xl">
              <h3
                id="why-digging-title"
                className="mb-8 text-center font-serif-display text-3xl text-white sm:mb-12 sm:text-5xl xl:text-[80px]"
                data-about-reveal="why-title"
              >
                Why Digging?
              </h3>

              <ol
                className="space-y-3 sm:space-y-4"
                data-about-reveal="why-list"
              >
                {WHY_DIGGING.map(({ number, text }) => (
                  <li
                    key={number}
                    className="flex items-start gap-3 rounded-[3rem] border border-white/15 bg-[linear-gradient(120deg,rgba(255,255,255,0.11),rgba(255,255,255,0.035))] px-6 py-5 text-[11px] leading-[1.55] text-neutral-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_14px_35px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:items-center sm:gap-5 sm:px-8 sm:py-6 sm:text-sm xl:gap-6 xl:px-10 xl:py-7 xl:text-[24px]"
                    data-about-reveal="why-item"
                  >
                    <span className="shrink-0 whitespace-nowrap bg-gradient-to-r from-[#7B00FF] via-[#C840FF] to-[#FFB14A] bg-clip-text text-[10px] font-semibold tracking-[0.08em] text-transparent sm:text-xs xl:text-[24px]">
                      {number}
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section
            className="px-4 pb-24 sm:px-10 sm:pb-32"
            aria-labelledby="found-by-others-title"
            data-about-section="found"
          >
            <h3
              id="found-by-others-title"
              className="mb-10 text-center font-serif-display text-3xl text-white sm:mb-14 sm:text-5xl xl:text-[48px]"
              data-about-reveal="found-title"
            >
              Found by Others
            </h3>

            <div className="mx-auto grid max-w-3xl grid-cols-3 gap-1 sm:gap-3">
              {FOUND_BY_OTHERS.map(({ quote, author, fallback }, index) => (
                <article
                  key={author + '-' + index}
                  className="relative isolate aspect-square overflow-hidden bg-black"
                  data-about-reveal="found-item"
                >
                  <MediaSlot
                    src={ABOUT_MEDIA.quoteTextures[index]}
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-85"
                    fallbackClassName={fallback}
                  />
                  <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0.58)_76%)]"
                    aria-hidden="true"
                  />
                  <blockquote className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center sm:px-5">
                    <p className="text-[7px] leading-[1.55] text-neutral-200 min-[420px]:text-[8px] sm:text-[11px] sm:leading-5 xl:text-[18px] xl:leading-[1.45]">
                      {quote}
                    </p>
                    <cite className="mt-1 text-[6px] not-italic text-neutral-500 min-[420px]:text-[7px] sm:mt-2 sm:text-[9px] xl:text-[16px]">
                      — {author}
                    </cite>
                  </blockquote>
                </article>
              ))}
            </div>
          </section>

          <section
            className="relative aspect-[1647/955] overflow-hidden"
            aria-label="Digging"
            data-about-section="middle-visual"
          >
            <MediaSlot
              src={ABOUT_MEDIA.atmosphere}
              alt=""
              className="about-middle-dust-reveal absolute inset-0 size-full object-cover object-center opacity-90"
              fallbackClassName="bg-[radial-gradient(ellipse_at_75%_52%,rgba(203,223,255,0.62),rgba(67,79,103,0.32)_25%,rgba(0,0,0,0.98)_65%)]"
              revealName="middle-dust"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(to_bottom,#000_0%,transparent_22%,rgba(0,0,0,0.22)_62%,#000_100%)]"
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] tracking-[0.28em] text-white/20 sm:text-xs xl:text-[24px]">
                파다, 파내다.
              </span>
              <span className="about-digging-word mt-2 font-serif-display text-5xl tracking-[0.04em] sm:text-8xl">
                Digging
              </span>
            </div>
          </section>

          <section
            className="px-3 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28"
            aria-labelledby="design-concept-title"
            data-about-section="concept"
          >
            <h3
              id="design-concept-title"
              className="mb-12 text-center font-serif-display text-3xl text-white sm:mb-16 sm:text-5xl xl:text-[80px]"
              data-about-reveal="concept-title"
            >
              Design Concept
            </h3>

            <div
              className="mx-auto grid max-w-3xl grid-cols-3 gap-x-0 gap-y-0 px-1 sm:gap-x-3 sm:px-5"
              data-about-reveal="concept-grid"
            >
              {DESIGN_CONCEPTS.map(({ title, rotation }, index) => (
                <article
                  key={title}
                  className={[
                    'about-concept-card relative isolate aspect-[7/10] overflow-visible drop-shadow-[0_18px_28px_rgba(0,0,0,0.72)]',
                    rotation,
                  ].join(' ')}
                >
                  <div
                    className="about-concept-card-flip"
                    data-about-reveal="concept-card"
                  >
                    <img
                      src={ABOUT_MEDIA.conceptCardBack}
                      alt=""
                      className="about-concept-card-face about-concept-card-face--back"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      aria-hidden="true"
                    />
                    <img
                      src={ABOUT_MEDIA.conceptCards[index]}
                      alt={`${title} 디자인 콘셉트 카드`}
                      className="about-concept-card-face about-concept-card-face--front"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            className="relative pb-14 pt-2 text-center sm:pb-20"
            data-about-section="keep"
          >
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-[radial-gradient(ellipse_at_bottom,rgba(123,0,255,0.12),transparent_68%)]"
              aria-hidden="true"
            />
            <p
              className="relative mb-5 font-serif-display text-xs tracking-[0.08em] text-neutral-400 xl:text-[24px]"
              data-about-reveal="keep-copy"
            >
              keep digging
            </p>
            <button
              type="button"
              onClick={() => onCloseRef.current()}
              aria-label="소개 팝업 닫기"
              className="relative mx-auto flex size-12 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-neutral-500 transition-all duration-300 hover:border-[#7B00FF]/60 hover:bg-[#7B00FF]/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B875FF]"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export { AboutLayerPopup };
export default React.memo(AboutLayerPopup);
