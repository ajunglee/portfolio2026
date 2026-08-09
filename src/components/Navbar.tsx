import React, { useState, useEffect } from 'react';

const LOGO_IMAGE_URL = new URL('../images/logo.png', import.meta.url).href;

interface NavbarProps {
  onOpenContactModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContactModal }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-md py-4 border-b border-neutral-800 shadow-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="w-full px-6 sm:px-8 lg:px-[60px] flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="맨 위로 이동"
          className="transition-opacity hover:opacity-80 focus:outline-none"
        >
          <img
            src={LOGO_IMAGE_URL}
            alt="AJ"
            width={47}
            height={48}
            draggable={false}
            className="w-10 sm:w-11 lg:w-[47px] h-auto max-w-full object-contain"
          />
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-10 text-[16px] tracking-[0.2em] uppercase text-neutral-400 font-medium">
          <button
            onClick={() => scrollToSection('digger')}
            className="hover:text-[#D8B4FE] transition-colors cursor-pointer focus:outline-none"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('featured')}
            className="hover:text-[#D8B4FE] transition-colors cursor-pointer focus:outline-none"
          >
            Featured
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className="hover:text-[#D8B4FE] transition-colors cursor-pointer focus:outline-none"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection('archive')}
            className="hover:text-[#D8B4FE] transition-colors cursor-pointer focus:outline-none"
          >
            Archive
          </button>
        </nav>

        {/* Contact Button */}
        <button
          onClick={() => {
            if (onOpenContactModal) {
              onOpenContactModal();
            } else {
              scrollToSection('contact');
            }
          }}
          className="px-5 py-2 text-xs font-semibold tracking-widest rounded-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-black/40"
        >
          Contact
        </button>
      </div>
    </header>
  );
};
