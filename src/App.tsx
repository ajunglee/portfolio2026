import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

import { FEATURED_PROJECTS, SCATTER_PROJECTS } from './data';
import { FeaturedProject, ScatterProject } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DiggerSection } from './components/DiggerSection';
import { FeaturedSection } from './components/FeaturedSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ArchiveSection } from './components/ArchiveSection';
import { ContactSection } from './components/ContactSection';
import { LayerPopup } from './components/LayerPopup';
import { ProjectLayerPopup } from './components/ProjectLayerPopup';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  // Selected Featured project for Layer Popup
  const [selectedFeatured, setSelectedFeatured] = useState<FeaturedProject | null>(null);

  // Selected Scatter project for Layer Popup
  const [selectedScatter, setSelectedScatter] = useState<ScatterProject | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let animationFrame: number | null = null;

    const updateBackToTopVisibility = () => {
      animationFrame = null;
      const pageBottom = window.scrollY + window.innerHeight;
      const remainingDistance = document.documentElement.scrollHeight - pageBottom;
      setShowBackToTop(remainingDistance <= 300);
    };

    const requestVisibilityUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateBackToTopVisibility);
      }
    };

    updateBackToTopVisibility();
    window.addEventListener('scroll', requestVisibilityUpdate, { passive: true });
    window.addEventListener('resize', requestVisibilityUpdate);

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', requestVisibilityUpdate);
      window.removeEventListener('resize', requestVisibilityUpdate);
    };
  }, []);

  const handleNavigateFeatured = (direction: 'prev' | 'next') => {
    if (!selectedFeatured) return;
    const currentIndex = FEATURED_PROJECTS.findIndex((p) => p.id === selectedFeatured.id);
    const total = FEATURED_PROJECTS.length;
    let nextIndex = 0;

    if (direction === 'prev') {
      nextIndex = (currentIndex - 1 + total) % total;
    } else {
      nextIndex = (currentIndex + 1) % total;
    }

    setSelectedFeatured(FEATURED_PROJECTS[nextIndex]);
  };

  const handleNavigateScatter = (direction: 'prev' | 'next') => {
    if (!selectedScatter) return;
    const currentIndex = SCATTER_PROJECTS.findIndex((project) => project.id === selectedScatter.id);
    const total = SCATTER_PROJECTS.length;
    let nextIndex = 0;

    if (direction === 'prev') {
      nextIndex = (currentIndex - 1 + total) % total;
    } else {
      nextIndex = (currentIndex + 1) % total;
    }

    setSelectedScatter(SCATTER_PROJECTS[nextIndex]);
  };

  const handleOpenContactModal = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-[#f0f0f0] font-sans selection:bg-[#7B00FF]/60 selection:text-white overflow-x-clip">
      <CustomCursor />

      <button
        type="button"
        aria-label="Back to top"
        onClick={() => {
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }}
        className={`fixed right-6 bottom-6 lg:right-[60px] lg:bottom-[60px] z-40 flex h-[60px] w-[60px] flex-col items-center justify-center rounded-full border border-white/20 bg-[#7B00FF] text-white shadow-[0_10px_30px_rgba(123,0,255,0.4)] transition-[opacity,transform,background-color] duration-300 hover:bg-[#6000CC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C084FC] ${
          showBackToTop
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-4 scale-90 opacity-0'
        }`}
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
        <span className="mt-0.5 text-[9px] tracking-[0.12em]">TOP</span>
      </button>

      {/* Navigation Bar */}
      <Navbar onOpenContactModal={handleOpenContactModal} />

      {/* 01. Hero Section */}
      <HeroSection />

      {/* 02. I'm a Digger Section */}
      <DiggerSection />

      {/* 03. Featured Section */}
      <FeaturedSection onSelectProject={(project) => setSelectedFeatured(project)} />

      {/* 04. Projects Section */}
      <ProjectsSection onSelectScatterProject={(scatter) => setSelectedScatter(scatter)} />

      {/* 05. Visual Archive Section */}
      <ArchiveSection />

      {/* 06. Contact Section */}
      <ContactSection />

      {/* Footer Minimal Copyright */}
      <footer className="portfolio-grid w-full py-8 border-t border-neutral-800 bg-black text-center text-xs text-neutral-500 font-mono tracking-widest">
        <p className="col-span-full">© 2026 AJ PORTFOLIO — ALL RIGHTS RESERVED.</p>
      </footer>

      {/* Layer Popup for Featured Projects */}
      <LayerPopup
        project={selectedFeatured}
        allProjects={FEATURED_PROJECTS}
        onClose={() => setSelectedFeatured(null)}
        onNavigate={handleNavigateFeatured}
      />

      {/* Layer Popup for Projects */}
      <ProjectLayerPopup
        project={selectedScatter}
        allProjects={SCATTER_PROJECTS}
        onClose={() => setSelectedScatter(null)}
        onNavigate={handleNavigateScatter}
      />
    </div>
  );
}
