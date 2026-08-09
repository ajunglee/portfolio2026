import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

import { FeaturedProject } from '../types';

interface LayerPopupProps {
  project: FeaturedProject | null;
  allProjects: FeaturedProject[];
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const LayerPopup: React.FC<LayerPopupProps> = ({
  project,
  allProjects,
  onClose,
  onNavigate
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-300 animate-fade-in"
      />

      {/* Popup Container */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0A0A0A] border border-neutral-800 text-white shadow-[0_25px_60px_rgba(0,0,0,0.95)] transition-all duration-450 animate-scale-up p-6 sm:p-10">
        
        {/* Top Header Controls */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <span className="text-xs uppercase tracking-widest text-[#D8B4FE] font-mono font-semibold px-2.5 py-1 rounded bg-[#2E005F]/40 border border-[#7B00FF]/20">
              {project.category}
            </span>
            <span className="text-xs text-neutral-400 font-mono">{project.year}</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Prev / Next controls */}
            <button
              onClick={() => onNavigate('prev')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
              title="Previous Project (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('next')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
              title="Next Project (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-2"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="py-8">
          <h2 className="text-4xl sm:text-6xl font-serif-display font-medium text-white mb-3">
            {project.title}
          </h2>
          <p className="text-xl font-serif-display text-neutral-300 font-light max-w-3xl">
            {project.subtitle}
          </p>
        </div>

        {/* Hero Image Showcase */}
        <div className="w-full aspect-[16/9] max-h-[420px] rounded-xl overflow-hidden mb-8 border border-white/10 shadow-2xl relative">
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-t border-white/10">
          {/* Left Metadata Column */}
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 block font-semibold mb-1">
                Client
              </span>
              <p className="text-sm font-medium text-white">{project.client}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 block font-semibold mb-1">
                Role
              </span>
              <p className="text-sm font-medium text-white">{project.role}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 block font-semibold mb-2">
                Technologies & Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Narrative Column */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="text-sm uppercase tracking-widest text-[#C084FC] font-semibold mb-2">
                Overview
              </h4>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <h5 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                  The Challenge
                </h5>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  {project.challenge}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <h5 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                  The Solution
                </h5>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  {project.solution}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#2E005F]/20 border border-[#7B00FF]/20">
              <h5 className="text-xs uppercase tracking-widest text-[#D8B4FE] font-semibold mb-1">
                Impact & Outcome
              </h5>
              <p className="text-xs text-[#E9D5FF]/90 leading-relaxed font-light">
                {project.impact}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Image Showcase */}
        {project.images[1] && (
          <div className="mt-8 w-full aspect-[21/9] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={project.images[1]}
              alt={`${project.title} detail`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Bottom Navigation Control Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => onNavigate('prev')}
            className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Project</span>
          </button>

          <span className="text-xs font-mono text-neutral-500">
            {allProjects.findIndex((p) => p.id === project.id) + 1} / {allProjects.length}
          </span>

          <button
            onClick={() => onNavigate('next')}
            className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Next Project</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 300ms ease-out forwards; }
        .animate-scale-up { animation: scaleUp 450ms ease-out forwards; }
      `}</style>
    </div>
  );
};
