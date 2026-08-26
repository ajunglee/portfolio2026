import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Phone, Mail } from 'lucide-react';

import { CONTACT_INFO } from '../data';

const CONTACT_VIDEO_URL = new URL('../video/contact_video.mp4', import.meta.url).href;
const CONTACT_POSTER_URL = new URL('../images/contact_bg.jpg', import.meta.url).href;

interface ContactSectionProps {
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotionQuery.matches) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) {
            video.src = CONTACT_VIDEO_URL;
            video.load();
          }
          if (video.paused) void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
    >
      <div className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden py-32 md:py-40 xl:py-48">
        {/* Contact background video */}
        <div
          className={`pointer-events-none absolute inset-0 overflow-hidden transition-[opacity,filter] duration-[900ms] ease-out motion-reduce:transition-none ${
            hasEntered ? 'opacity-100 blur-0' : 'opacity-0 blur-[3px]'
          }`}
        >
          <div className="absolute -inset-[4%]">
            <video
              ref={videoRef}
              poster={CONTACT_POSTER_URL}
              muted
              loop
              playsInline
              preload="none"
              onCanPlay={() => setIsVideoReady(true)}
              tabIndex={-1}
              aria-hidden="true"
              className={`h-full w-full object-cover object-center transition-opacity duration-700 ease-out motion-reduce:transition-none ${
                isVideoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </div>

        {/* Content Overlay */}
        <div className="portfolio-grid relative z-20 my-auto w-full items-center gap-y-12 py-12">
          {/* Centered Contact Details */}
          <div className="col-span-full flex flex-col items-center space-y-8 text-center md:col-start-2 md:col-span-6 xl:col-start-4 xl:col-span-6">
            {/* Step 2: Contact Title */}
            <div className="w-full text-center">
              <h2 className="font-serif-display text-5xl tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[100pt]">
                Contact
              </h2>
              <p className="font-serif-display mt-3 text-lg font-light text-neutral-400">
                Let&apos;s dig deeper into your next project together.
              </p>
            </div>

            {/* Contact methods reveal together */}
            <div className="w-full max-w-2xl">
              <div className="flex w-full flex-col gap-4">
                {/* Phone */}
                <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-center backdrop-blur-md transition-colors duration-300 hover:border-[#C084FC]/40">
                  <div className="justify-self-center rounded-lg border border-[#7B00FF]/20 bg-[#7B00FF]/10 p-3 text-[#C084FC]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 text-center">
                    <span className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Phone</span>
                    <a
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="font-serif-display text-lg font-medium text-white transition-colors hover:text-[#C084FC]"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </div>

                  <button
                    onClick={() => handleCopy(CONTACT_INFO.phone, 'phone')}
                    className="cursor-pointer justify-self-center rounded-lg bg-white/5 p-2.5 text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                    title="Copy phone"
                  >
                    {copiedField === 'phone' ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Email */}
                <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-center backdrop-blur-md transition-colors duration-300 hover:border-[#C084FC]/40">
                  <div className="justify-self-center rounded-lg border border-[#7B00FF]/20 bg-[#7B00FF]/10 p-3 text-[#C084FC]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 text-center">
                    <span className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400">E-mail</span>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="font-serif-display break-all text-lg font-medium text-white transition-colors hover:text-[#C084FC]"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>

                  <button
                    onClick={() => handleCopy(CONTACT_INFO.email, 'email')}
                    className="cursor-pointer justify-self-center rounded-lg bg-white/5 p-2.5 text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                    title="Copy email"
                  >
                    {copiedField === 'email' ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
