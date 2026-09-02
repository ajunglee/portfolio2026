import { useEffect, useState } from 'react';
import './DiggingIntro.css';

type IntroPhase = 'active' | 'fading' | 'done';

const INTRO_SESSION_KEY = 'digging-intro-seen';

type DiggingIntroModule = {
  startDiggingIntro: (options?: { onComplete?: () => void }) => () => void;
};

export function DiggingIntro() {
  const [shouldShow, setShouldShow] = useState(false);
  const [phase, setPhase] = useState<IntroPhase>('done');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const forced = new URLSearchParams(window.location.search).get('intro') === '1';
    const hasSeenIntro = window.sessionStorage.getItem(INTRO_SESSION_KEY) === 'true';
    const nextShouldShow = forced || !hasSeenIntro;

    setShouldShow(nextShouldShow);
    setPhase(nextShouldShow ? 'active' : 'done');
  }, []);

  useEffect(() => {
    if (!shouldShow) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let cleanupDemo: (() => void) | undefined;
    let completionTimer: number | undefined;
    let fadeTimer: number | undefined;
    let removeTimer: number | undefined;
    let disposed = false;

    const completeIntro = () => {
      if (disposed || fadeTimer !== undefined) return;
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
      }
      if (completionTimer !== undefined) window.clearTimeout(completionTimer);
      fadeTimer = window.setTimeout(() => {
        setPhase('fading');
        removeTimer = window.setTimeout(() => {
          cleanupDemo?.();
          cleanupDemo = undefined;
          document.body.style.overflow = previousOverflow;
          setPhase('done');
        }, 1000);
      }, 900);
    };

    const mountDemo = async () => {
      const module = await import('../../digging-loading-demo/src/main.js') as DiggingIntroModule;
      if (disposed) return;

      cleanupDemo = module.startDiggingIntro({
        onComplete: completeIntro,
      });
    };

    completionTimer = window.setTimeout(completeIntro, 15050);
    void mountDemo();

    return () => {
      disposed = true;
      if (completionTimer !== undefined) window.clearTimeout(completionTimer);
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer);
      if (removeTimer !== undefined) window.clearTimeout(removeTimer);
      cleanupDemo?.();
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldShow]);

  if (phase === 'done') return null;

  return (
    <div
      id="digging-intro"
      className={`digging-intro ${phase === 'fading' ? 'is-fading' : ''}`}
      aria-label="Loading portfolio"
    >
      <div id="app" className="digging-intro__app">
        <canvas id="scene" />
        <div className="hud">
          <div className="hud-topline" aria-live="polite">
            <span className="loading-word">Digging</span>
            <span className="loading-dots" />
          </div>
          <div className="hud-depth">
            <span id="depth-value" className="value">0000M</span>
          </div>
        </div>
        <button id="replay-btn" type="button" aria-label="Replay loading animation">REPLAY</button>
      </div>
    </div>
  );
}
