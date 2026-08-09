import React, { useEffect, useState } from 'react';

import { ARCHIVE_COLUMNS } from '../data';
import { ArchiveItem } from '../types';
import ViewportReveal from './ViewportReveal';

export const ArchiveSection: React.FC = () => {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [tiltMap, setTiltMap] = useState<{ [key: string]: { rotateX: number; rotateY: number } }>({});
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
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
                    animationDuration: `${30 + colIdx * 3}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite'
                  }}
                >
                  {duplicatedItems.map((item, itemIdx) => {
                    const uniqueKey = `${item.id}-${colIdx}-${itemIdx}`;
                    const tilt = tiltMap[uniqueKey] || { rotateX: 0, rotateY: 0 };
                    const isHovered = hoveredCardId === uniqueKey;

                    return (
                      <div
                        key={uniqueKey}
                        onMouseEnter={() => setHoveredCardId(uniqueKey)}
                        onMouseMove={(e) => handleMouseMove(e, uniqueKey)}
                        onMouseLeave={() => handleMouseLeave(uniqueKey)}
                      className={`relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br ${item.gradient} p-4 flex flex-col justify-end border border-white/10 shadow-xl transition-all duration-300 transform`}
                        style={{
                          transform: !isTouchDevice && isHovered
                            ? `scale(1.03) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
                            : 'scale(1) rotateX(0deg) rotateY(0deg)',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                      {/* Stylized Aesthetic Visual Shader Mesh */}
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

                      <div className="absolute inset-0 flex items-center justify-center opacity-60">
                        <div
                          className="w-32 h-32 rounded-full blur-2xl"
                          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                        />
                      </div>

                      {/* Item Bottom Overlay Label */}
                      <div className={`relative z-10 p-3 rounded-lg ${item.overlayStyle} border border-neutral-800`}>
                        <span className="text-[9px] uppercase tracking-widest text-[#C084FC] font-semibold block mb-0.5">
                          {item.tag}
                        </span>
                        <h4 className="text-sm font-medium font-serif-display text-white truncate">
                          {item.title}
                        </h4>
                      </div>
                      </div>
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
    </section>
  );
};
