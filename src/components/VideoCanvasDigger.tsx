import React, { useEffect, useRef, useState } from 'react';

interface VideoCanvasDiggerProps {
  videoUrl?: string;
}

const ABOUT_VIDEO_URL = new URL('../video/about_video.mp4', import.meta.url).href;

export const VideoCanvasDigger: React.FC<VideoCanvasDiggerProps> = ({
  videoUrl = ABOUT_VIDEO_URL
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const startVideo = () => {
      if (video.dataset.playing === 'true') return;
      video.dataset.playing = 'true';
      void video.play().catch(() => undefined);
    };
    const handleCanPlay = () => {
      setUseVideo(true);
      startVideo();
    };
    const handleLoadedData = () => {
      setUseVideo(true);
      startVideo();
    };
    const handleError = () => setUseVideo(false);

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setUseVideo(true);
      startVideo();
    }

    let observer: IntersectionObserver | null = null;

    if (!('IntersectionObserver' in window)) {
      startVideo();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startVideo();
            observer?.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: '400px 0px' },
      );
      observer.observe(container);
    }

    return () => {
      observer?.disconnect();
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.pause();
      delete video.dataset.playing;
    };
  }, [videoUrl]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 z-10 h-full w-full object-cover opacity-80 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
          useVideo ? 'opacity-80' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black" />
    </div>
  );
};
