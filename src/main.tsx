import {lazy, StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const ThreeGlassTestPage = lazy(() => import('./pages/ThreeGlassTestPage.tsx'));
const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/';
const isThreeGlassTestPage = normalizedPath === '/three-glass-test';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isThreeGlassTestPage ? (
      <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
        <ThreeGlassTestPage />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
);
