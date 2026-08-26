import React, { useEffect, useRef, useState } from 'react';

interface VideoCanvasDiggerProps {
  videoUrl?: string;
}

const ABOUT_VIDEO_URL = new URL('../video/about_video.mp4', import.meta.url).href;
const ABOUT_POSTER_URL = new URL('../images/about_top_bg.jpg', import.meta.url).href;

export const VideoCanvasDigger: React.FC<VideoCanvasDiggerProps> = ({
  videoUrl = ABOUT_VIDEO_URL
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const startVideo = () => {
      if (!video.src) {
        video.src = videoUrl;
        video.load();
      }
      void video.play().catch(() => undefined);
    };
    const handleCanPlay = () => setUseVideo(true);
    const handleError = () => setUseVideo(false);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    if (!('IntersectionObserver' in window)) {
      startVideo();
    } else {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startVideo();
            observer.disconnect();
          }
        },
        { threshold: 0.05 },
      );
      observer.observe(container);

      return () => {
        observer.disconnect();
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.pause();
        video.removeAttribute('src');
        video.load();
      };
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [videoUrl]);

  useEffect(() => {
    if (useVideo) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 - 30;
      const headRadius = Math.min(width, height) * 0.28;

      // Draw digital scanlines and iridescent audio spectrum glitch lines forming silhouette
      const lineCount = 140;

      for (let i = 0; i < lineCount; i++) {
        const percent = i / lineCount;
        const y = centerY - headRadius + percent * (headRadius * 2.2);

        // Calculate oval head contour width at this Y
        const dy = (y - centerY) / headRadius;
        if (Math.abs(dy) > 1.1) continue;

        const rowWidth = Math.sqrt(Math.max(0, 1 - dy * dy)) * headRadius * 0.95;

        // Wave distortion for digital glitch effect
        const wave = Math.sin(percent * Math.PI * 8 + time * 3) * 8;
        const wave2 = Math.cos(percent * Math.PI * 14 - time * 2) * 6;

        const leftX = centerX - rowWidth + wave;
        const rightX = centerX + rowWidth + wave2;

        // Violet chromatic color cycle
        const hue = 264 + percent * 22 + Math.sin(time * 2) * 4;
        ctx.strokeStyle = `hsla(${hue}, 85%, 60%, ${0.35 + Math.sin(time + percent * 10) * 0.25})`;
        ctx.lineWidth = 1.8;

        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(rightX, y);
        ctx.stroke();

        // Glitch particles along horizontal scanlines
        if (i % 7 === 0) {
          const sparkX = leftX + Math.random() * (rightX - leftX);
          ctx.fillStyle = `hsla(${Math.min(292, hue + 6)}, 95%, 75%, 0.8)`;
          ctx.fillRect(sparkX, y - 1, Math.random() * 8 + 2, 2);
        }
      }

      // Central glowing iris eyes / digital core
      const eyeY = centerY - headRadius * 0.2;
      const eyeOffset = headRadius * 0.3;

      const eyeGlow1 = ctx.createRadialGradient(centerX - eyeOffset, eyeY, 1, centerX - eyeOffset, eyeY, 30);
      eyeGlow1.addColorStop(0, 'rgba(236, 72, 153, 0.9)');
      eyeGlow1.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = eyeGlow1;
      ctx.beginPath();
      ctx.arc(centerX - eyeOffset, eyeY, 30, 0, Math.PI * 2);
      ctx.fill();

      const eyeGlow2 = ctx.createRadialGradient(centerX + eyeOffset, eyeY, 1, centerX + eyeOffset, eyeY, 30);
      eyeGlow2.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
      eyeGlow2.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = eyeGlow2;
      ctx.beginPath();
      ctx.arc(centerX + eyeOffset, eyeY, 30, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [useVideo]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        poster={ABOUT_POSTER_URL}
        className={`w-full h-full object-cover opacity-80 ${useVideo ? 'block' : 'hidden'}`}
        aria-hidden="true"
      />
      {!useVideo && (
        <canvas ref={canvasRef} className="w-full h-full object-cover opacity-80" aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black" />
    </div>
  );
};
