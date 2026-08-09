import React from 'react';

interface DigDeeperGraphicProps {
  className?: string;
}

export const DigDeeperGraphic: React.FC<DigDeeperGraphicProps> = ({ className = '' }) => {
  return (
    <div className={`relative inline-block light-sweep-effect select-none ${className}`}>
      {/* SVG Image Asset with Iridescent Metallic Shader Text */}
      <svg
        viewBox="0 0 1000 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[95vw] md:max-w-[85vw] lg:max-w-[1100px] drop-shadow-[0_10px_35px_rgba(123,0,255,0.3)]"
        aria-label="DIG DEEPER"
      >
        <defs>
          {/* Prismatic violet and platinum chrome gradient */}
          <linearGradient id="iridescentMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="18%" stopColor="#e9d5ff" />
            <stop offset="35%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#f3e8ff" />
            <stop offset="65%" stopColor="#7B00FF" />
            <stop offset="82%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Crystalline Internal Reflection Gradient */}
          <linearGradient id="crystalHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#f3e8ff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.75" />
          </linearGradient>

          {/* Bevel stroke gradient */}
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7B00FF" />
            <stop offset="25%" stopColor="#e9d5ff" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="75%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#7B00FF" />
          </linearGradient>

          {/* Metallic Grain / Texture */}
          <pattern id="metalNoise" width="100" height="100" patternUnits="userSpaceOnUse">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
          </pattern>
        </defs>

        {/* Outer Bevel Shadow Path */}
        <text
          x="50%"
          y="125"
          textAnchor="middle"
          fontSize="118"
          fontWeight="900"
          fontFamily="'Cinzel', 'Playfair Display', serif"
          letterSpacing="0.18em"
          fill="none"
          stroke="url(#strokeGradient)"
          strokeWidth="3.5"
          className="opacity-90"
        >
          DIG DEEPER
        </text>

        {/* Main Iridescent Chrome Text */}
        <text
          x="50%"
          y="125"
          textAnchor="middle"
          fontSize="118"
          fontWeight="900"
          fontFamily="'Cinzel', 'Playfair Display', serif"
          letterSpacing="0.18em"
          fill="url(#iridescentMetallic)"
        >
          DIG DEEPER
        </text>

        {/* Inner Prismatic Crystal Shimmer Overlay */}
        <text
          x="50%"
          y="125"
          textAnchor="middle"
          fontSize="118"
          fontWeight="900"
          fontFamily="'Cinzel', 'Playfair Display', serif"
          letterSpacing="0.18em"
          fill="url(#crystalHighlight)"
          style={{ mixBlendMode: 'overlay' }}
        >
          DIG DEEPER
        </text>
      </svg>
    </div>
  );
};
