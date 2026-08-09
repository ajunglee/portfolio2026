import React, { useEffect, useRef } from 'react';

const CURSOR_IMAGE_URL = new URL('../images/cursor.png', import.meta.url).href;

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia('(pointer: fine)');

    if (!cursor || !finePointer.matches) return;

    let animationFrameId: number | null = null;
    let pointerX = -100;
    let pointerY = -100;

    const updatePosition = () => {
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      animationFrameId = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.style.opacity = '1';

      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(updatePosition);
      }
    };

    const hideCursor = () => {
      cursor.style.opacity = '0';
    };

    document.documentElement.classList.add('custom-cursor-active');
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', hideCursor);
    window.addEventListener('blur', hideCursor);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', hideCursor);
      window.removeEventListener('blur', hideCursor);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[9999] pointer-events-none opacity-0 transition-opacity duration-150 will-change-transform"
    >
      <img
        src={CURSOR_IMAGE_URL}
        alt=""
        draggable={false}
        className="w-[72px] h-[72px] max-w-none select-none object-contain drop-shadow-[0_4px_10px_rgba(168,85,247,0.45)]"
        style={{ transform: 'translate(-32%, -11%)' }}
      />
    </div>
  );
};
