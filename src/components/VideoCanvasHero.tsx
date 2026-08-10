import React, { useEffect, useRef, useState } from 'react';

interface VideoCanvasHeroProps {
  videoUrl?: string;
}

const HERO_VIDEO_URL = new URL('../video/hero_video.mp4', import.meta.url).href;

export const VideoCanvasHero: React.FC<VideoCanvasHeroProps> = ({ videoUrl = HERO_VIDEO_URL }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [useVideo, setUseVideo] = useState(false);

  // Check if video file exists and can be played
  useEffect(() => {
    if (!videoUrl) return;
    const video = document.createElement('video');
    video.src = videoUrl;
    video.oncanplay = () => {
      setUseVideo(true);
    };
    video.onerror = () => {
      setUseVideo(false);
    };
  }, [videoUrl]);

  useEffect(() => {
    if (useVideo) return; // Skip canvas animation if HTML video is active

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating sparkling crystal dust particles
    const particles = Array.from({ length: 85 }, () => ({
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 500,
      size: Math.random() * 2.8 + 0.6,
      speedY: -(Math.random() * 0.6 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      hue: Math.random() * 32,
      pulseSpeed: Math.random() * 0.05 + 0.02
    }));

    let time = 0;

    const render = () => {
      time += 0.018;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const purpleHue = (offset = 0) => 260 + ((time * 10 + offset) % 32);

      const centerX = width / 2;
      const centerY = height * 0.44;
      const baseRadius = Math.min(width, height) * 0.22;

      // Opening animation factor (0 = closed crack, 1 = fully open crystal)
      const openFactor = 0.45 + 0.55 * Math.sin(time * 0.6);

      // 1. Ambient Prismatic Background Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        baseRadius * 3.2
      );
      const mainHue = purpleHue();
      glowGrad.addColorStop(0, `hsla(${mainHue}, 90%, 65%, ${0.25 + openFactor * 0.2})`);
      glowGrad.addColorStop(0.25, `hsla(${purpleHue(10)}, 85%, 55%, ${0.15 + openFactor * 0.1})`);
      glowGrad.addColorStop(0.5, `hsla(${purpleHue(20)}, 80%, 45%, 0.08)`);
      glowGrad.addColorStop(1, 'rgba(10, 10, 10, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 3.2, 0, Math.PI * 2);
      ctx.fill();

      // 2. Volumetric Prismatic Light Beams
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const numRays = 8;
      for (let i = 0; i < numRays; i++) {
        const rayAngle = (i * Math.PI) / (numRays / 2) + time * 0.15;
        const rayWidth = 0.18 + Math.sin(time + i) * 0.08;
        const rayHue = purpleHue(i * 5);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, baseRadius * 2.8, rayAngle - rayWidth, rayAngle + rayWidth);
        ctx.closePath();

        const rayGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          baseRadius * 2.8
        );
        rayGrad.addColorStop(0, `hsla(${rayHue}, 90%, 75%, ${0.2 * openFactor})`);
        rayGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rayGrad;
        ctx.fill();
      }
      ctx.restore();

      // 3. Central Faceted Rainbow Crystal Core
      ctx.save();
      ctx.translate(centerX, centerY);

      // Gentle floating micro-bobbing
      const floatY = Math.sin(time * 1.2) * 8;
      ctx.translate(0, floatY);

      const crystalSize = baseRadius * (0.65 + openFactor * 0.25);

      // Draw Inner Iridescent Crystal Facets
      const numFacets = 12;
      for (let i = 0; i < numFacets; i++) {
        const angle1 = (i * Math.PI * 2) / numFacets + time * 0.2;
        const angle2 = ((i + 1) * Math.PI * 2) / numFacets + time * 0.2;
        const facetHue = purpleHue(i * 3);

        // Facet vertices
        const rOuter = crystalSize;
        const rInner = crystalSize * 0.35;

        const x1 = Math.cos(angle1) * rOuter;
        const y1 = Math.sin(angle1) * rOuter;
        const x2 = Math.cos(angle2) * rOuter;
        const y2 = Math.sin(angle2) * rOuter;

        const cx = Math.cos((angle1 + angle2) / 2) * rInner;
        const cy = Math.sin((angle1 + angle2) / 2) * rInner;

        // Fill facet with bright rainbow gradient
        const facetGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        facetGrad.addColorStop(0, `hsla(${facetHue}, 95%, 70%, ${0.6 + openFactor * 0.35})`);
        facetGrad.addColorStop(0.5, `hsla(${purpleHue(i * 3 + 10)}, 100%, 80%, ${0.8 + openFactor * 0.2})`);
        facetGrad.addColorStop(1, `hsla(${purpleHue(i * 3 + 20)}, 90%, 60%, ${0.5 + openFactor * 0.4})`);

        ctx.fillStyle = facetGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(cx, cy);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x2, y2);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        // Facet Shimmer Borders
        ctx.strokeStyle = `hsla(${purpleHue(i * 3 + 26)}, 100%, 90%, 0.7)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.stroke();
      }

      // Central Diamond Highlight Sparkle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.arc(0, 0, crystalSize * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // 4. Dark Rock Crust Wings (Splitting Open)
      const gapX = openFactor * baseRadius * 0.55;

      // Left Rock Shell
      ctx.save();
      ctx.translate(-gapX, 0);
      ctx.fillStyle = '#0d0d12';
      ctx.strokeStyle = '#262630';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(-baseRadius * 1.5, -baseRadius * 1.4);
      ctx.lineTo(-baseRadius * 0.2, -baseRadius * 1.3);
      ctx.lineTo(-baseRadius * 0.1, -baseRadius * 0.7);
      ctx.lineTo(-baseRadius * 0.3, -baseRadius * 0.2);
      ctx.lineTo(-baseRadius * 0.05, baseRadius * 0.2);
      ctx.lineTo(-baseRadius * 0.25, baseRadius * 0.7);
      ctx.lineTo(-baseRadius * 0.1, baseRadius * 1.3);
      ctx.lineTo(-baseRadius * 1.6, baseRadius * 1.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Left Rock Inner Rainbow Rim Light
      const leftRimGrad = ctx.createLinearGradient(0, -baseRadius, 0, baseRadius);
      leftRimGrad.addColorStop(0, `hsla(${mainHue}, 100%, 75%, 0.9)`);
      leftRimGrad.addColorStop(0.5, `hsla(${purpleHue(10)}, 100%, 75%, 0.9)`);
      leftRimGrad.addColorStop(1, `hsla(${purpleHue(20)}, 100%, 75%, 0.9)`);

      ctx.strokeStyle = leftRimGrad;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-baseRadius * 0.2, -baseRadius * 1.3);
      ctx.lineTo(-baseRadius * 0.1, -baseRadius * 0.7);
      ctx.lineTo(-baseRadius * 0.3, -baseRadius * 0.2);
      ctx.lineTo(-baseRadius * 0.05, baseRadius * 0.2);
      ctx.lineTo(-baseRadius * 0.25, baseRadius * 0.7);
      ctx.lineTo(-baseRadius * 0.1, baseRadius * 1.3);
      ctx.stroke();
      ctx.restore();

      // Right Rock Shell
      ctx.save();
      ctx.translate(gapX, 0);
      ctx.fillStyle = '#0d0d12';
      ctx.strokeStyle = '#262630';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(baseRadius * 1.5, -baseRadius * 1.4);
      ctx.lineTo(baseRadius * 0.2, -baseRadius * 1.3);
      ctx.lineTo(baseRadius * 0.1, -baseRadius * 0.7);
      ctx.lineTo(baseRadius * 0.3, -baseRadius * 0.2);
      ctx.lineTo(baseRadius * 0.05, baseRadius * 0.2);
      ctx.lineTo(baseRadius * 0.25, baseRadius * 0.7);
      ctx.lineTo(baseRadius * 0.1, baseRadius * 1.3);
      ctx.lineTo(baseRadius * 1.6, baseRadius * 1.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right Rock Inner Rainbow Rim Light
      const rightRimGrad = ctx.createLinearGradient(0, -baseRadius, 0, baseRadius);
      rightRimGrad.addColorStop(0, `hsla(${purpleHue(5)}, 100%, 75%, 0.9)`);
      rightRimGrad.addColorStop(0.5, `hsla(${purpleHue(15)}, 100%, 75%, 0.9)`);
      rightRimGrad.addColorStop(1, `hsla(${purpleHue(25)}, 100%, 75%, 0.9)`);

      ctx.strokeStyle = rightRimGrad;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(baseRadius * 0.2, -baseRadius * 1.3);
      ctx.lineTo(baseRadius * 0.1, -baseRadius * 0.7);
      ctx.lineTo(baseRadius * 0.3, -baseRadius * 0.2);
      ctx.lineTo(baseRadius * 0.05, baseRadius * 0.2);
      ctx.lineTo(baseRadius * 0.1, baseRadius * 1.3);
      ctx.stroke();
      ctx.restore();

      ctx.restore(); // restore translate(centerX, centerY)

      // 5. Floating Sparkling Crystal Dust Particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(time * 3 + p.hue));

        if (p.y < -baseRadius * 2) {
          p.y = baseRadius * 2;
          p.x = (Math.random() - 0.5) * baseRadius * 3;
        }

        const px = centerX + p.x;
        const py = centerY + p.y;

        ctx.fillStyle = `hsla(${purpleHue(p.hue)}, 100%, 80%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [useVideo]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {useVideo ? (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-90"
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover opacity-90"
          aria-hidden="true"
        />
      )}
      {/* Feather the scaled video's side edges into the page background. */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to right, #000 0%, rgba(0,0,0,0.72) 3%, transparent 13%, transparent 87%, rgba(0,0,0,0.72) 97%, #000 100%)'
        }}
      />
      {/* Top & Bottom Vignette Overlays for smooth background blending */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.72) 4%, transparent 16%, transparent 82%, rgba(0,0,0,0.72) 95%, #000 100%)'
        }}
      />
    </div>
  );
};
