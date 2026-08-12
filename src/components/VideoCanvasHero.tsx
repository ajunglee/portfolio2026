import React from 'react';

interface VideoCanvasHeroProps {
  videoUrl?: string;
}

const HERO_VIDEO_URL = new URL('../video/hero_video.mp4', import.meta.url).href;

export const VideoCanvasHero: React.FC<VideoCanvasHeroProps> = ({ videoUrl = HERO_VIDEO_URL }) => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black">
    <video
      src={videoUrl}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="h-full w-full object-cover opacity-90"
      aria-hidden="true"
    />

    {/* Feather the scaled video's side edges into the page background. */}
    <div
      className="absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          'linear-gradient(to right, #000 0%, rgba(0,0,0,0.72) 3%, transparent 13%, transparent 87%, rgba(0,0,0,0.72) 97%, #000 100%)',
      }}
    />

    {/* Top & Bottom Vignette Overlays for smooth background blending. */}
    <div
      className="absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.72) 4%, transparent 16%, transparent 82%, rgba(0,0,0,0.72) 95%, #000 100%)',
      }}
    />
  </div>
);
