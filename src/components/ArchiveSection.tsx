import React, { useCallback, useEffect, useState } from 'react';

import { ARCHIVE_COLUMNS } from '../data';
import { ArchiveItem } from '../types';
import ArchiveLayerPopup from './ArchiveLayerPopup';
import ViewportReveal from './ViewportReveal';

const isVideoAsset = (url?: string) =>
  typeof url === 'string' && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

export const ArchiveSection: React.FC = () => {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [tiltMap, setTiltMap] = useState<{ [key: string]: { rotateX: number; rotateY: number } }>({});
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const closeArchivePopup = useCallback(() => setSelectedItem(null), []);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    if (isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -2; // max ±2deg
    const rotateY = ((x - centerX) / centerX) * 3;  // max ±3deg

    setTiltMap((prev) => ({ ...prev, [id]: { rotateX, rotateY } }));
  };

  const handleMouseLeave = (id: string) => {
    setHoveredCardId(null);
    setTiltMap((prev) => ({ ...prev, [id]: { rotateX: 0, rotateY: 0 } }));
  };

  return (
    <section
      id="archive"
      className="relative min-h-[100svh] w-full overflow-hidden bg-black py-48 md:py-72 xl:py-96"
    >
      <div className="portfolio-grid">
        {/* Title */}
        <ViewportReveal
          className="col-span-full mb-24 text-center md:mb-28 xl:mb-32"
          distance={{ mobile: 90, desktop: 170 }}
          progressOffset={[0, 0.68]}
          viewportOffset={['start 98%', 'start 42%']}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[100pt] font-serif-display tracking-tight text-white">
            Visual Archive
          </h2>
        </ViewportReveal>

        {/* Vertical Columns with Opposing Seamless Loops */}
        <ViewportReveal
          className="archive-fade-mask col-span-full grid h-[720px] grid-cols-2 gap-4 overflow-hidden md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:h-[900px] xl:grid-cols-12 xl:gap-10"
          distance={{ mobile: 110, desktop: 210 }}
          delay={0.16}
          progressOffset={[0, 0.96]}
          viewportOffset={['start 98%', 'start 34%']}
        >
          {ARCHIVE_COLUMNS.map((columnItems, colIdx) => {
            const isUp = colIdx % 2 === 0; // Col 0 & 2 bottom->top, Col 1 & 3 top->bottom

            // Duplicate items to ensure smooth infinite seamless scroll loop
            const duplicatedItems = [...columnItems, ...columnItems, ...columnItems];

            return (
            <div key={colIdx} className="xl:col-span-3 relative h-full overflow-hidden select-none">
                <div
                  className={`flex flex-col gap-4 md:gap-6 ${
                    isUp ? 'animate-loop-up' : 'animate-loop-down'
                  }`}
                  style={{
                    animationDuration: `${columnItems.length * 10 + colIdx * 3}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: hoveredCardId || selectedItem ? 'paused' : 'running',
                  }}
                >
                  {duplicatedItems.map((item, itemIdx) => {
                    const uniqueKey = `${item.id}-${colIdx}-${itemIdx}`;
                    const tilt = tiltMap[uniqueKey] || { rotateX: 0, rotateY: 0 };
                    const isHovered = hoveredCardId === uniqueKey;

                    return (
                      <button
                        type="button"
                        key={uniqueKey}
                        onMouseEnter={() => setHoveredCardId(uniqueKey)}
                        onMouseMove={(e) => handleMouseMove(e, uniqueKey)}
                        onMouseLeave={() => handleMouseLeave(uniqueKey)}
                        onFocus={() => setHoveredCardId(uniqueKey)}
                        onBlur={() => handleMouseLeave(uniqueKey)}
                        onClick={() => setSelectedItem(item)}
                        aria-label={`Open ${item.category} archive detail: ${item.keywords.join(', ')}`}
                        aria-haspopup="dialog"
                        className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl bg-black text-left shadow-xl transition-all duration-300 transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                        style={{
                          transform: !isTouchDevice && isHovered
                            ? `scale(1.03) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
                            : 'scale(1) rotateX(0deg) rotateY(0deg)',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {/* Archive image / motion */}
                        {item.image && isVideoAsset(item.image) ? (
                          <video
                            src={item.image}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${
                              !isTouchDevice && isHovered ? 'scale-[1.12]' : 'scale-100'
                            }`}
                            preload="metadata"
                            aria-hidden="true"
                          />
                        ) : item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${
                              !isTouchDevice && isHovered ? 'scale-[1.12]' : 'scale-100'
                            }`}
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            aria-hidden="true"
                          />
                        ) : null}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                        {/* Bottom-left category label */}
                        <div className="absolute inset-x-3 bottom-3 z-10 sm:inset-x-4 sm:bottom-4">
                          <h4 className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-sm">
                            {item.category}
                          </h4>
                          <p className="mt-1 truncate text-[9px] tracking-[0.04em] text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-[11px]">
                            {item.keywords.join(' / ')}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </ViewportReveal>
      </div>

      {/* Inline Keyframes for Infinite Loop Animation */}
      <style>{`
        @keyframes loopUp {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes loopDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
        .animate-loop-up {
          animation-name: loopUp;
        }
        .animate-loop-down {
          animation-name: loopDown;
        }
      `}</style>

      <ArchiveLayerPopup item={selectedItem} onClose={closeArchivePopup} />
    </section>
  );
};
