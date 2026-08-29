import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import { ArchiveItem } from '../types';

interface ArchiveLayerPopupProps {
  item: ArchiveItem | null;
  onClose: () => void;
}

const isVideoAsset = (url?: string) =>
  typeof url === 'string' && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

const ArchiveLayerPopup: React.FC<ArchiveLayerPopupProps> = ({ item, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!item) return;

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

      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [item, onClose]);

  if (!item || typeof document === 'undefined') return null;

  const titleId = `archive-popup-title-${item.id}`;
  const descriptionId = `archive-popup-description-${item.id}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="archive-popup-backdrop pointer-events-none absolute inset-0 bg-black/88 backdrop-blur-xl" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="archive-popup-panel relative z-10 max-h-[92svh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-2xl bg-[#070707] text-white shadow-[0_28px_100px_rgba(0,0,0,0.82)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close archive detail"
          className="absolute right-4 top-4 z-30 flex size-11 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-5 sm:top-5"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <div className="relative aspect-square w-full overflow-hidden bg-black">
          {item.image ? (
            isVideoAsset(item.image) ? (
              <video
                src={item.image}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
                preload="metadata"
              />
            ) : (
              <img
                src={item.image}
                alt={`${item.category} — ${item.keywords.join(', ')}`}
                className="h-full w-full object-cover"
                decoding="async"
                draggable={false}
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center px-8 text-center">
              <span className="text-sm uppercase tracking-[0.24em] text-white/35">
                {item.category}
              </span>
            </div>
          )}
        </div>

        <div className="relative -mt-px px-5 pb-7 pt-5 sm:px-8 sm:pb-9 sm:pt-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C084FC] sm:text-xs">
            {item.category}
          </span>
          <h2
            id={titleId}
            className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl"
          >
            {item.keywords.join(' / ')}
          </h2>
          <p
            id={descriptionId}
            className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400 sm:text-[15px]"
          >
            {item.description}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes archivePopupBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes archivePopupPanelIn {
          from { opacity: 0; transform: translateY(24px) scale(0.975); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .archive-popup-backdrop {
          animation: archivePopupBackdropIn 260ms ease-out both;
        }

        .archive-popup-panel {
          animation: archivePopupPanelIn 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
          scrollbar-color: #7b00ff #070707;
        }

        @media (prefers-reduced-motion: reduce) {
          .archive-popup-backdrop,
          .archive-popup-panel {
            animation: none;
          }
        }
      `}</style>
    </div>,
    document.body,
  );
};

export default React.memo(ArchiveLayerPopup);
