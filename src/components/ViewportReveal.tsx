import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type UseScrollOptions,
} from 'motion/react';

type ResponsiveDistance =
  | number
  | {
      mobile?: number;
      desktop?: number;
    };

export interface ViewportRevealProps {
  children: ReactNode;
  className?: string;
  /** A number applies at every breakpoint. Defaults to 50px mobile / 90px desktop. */
  distance?: ResponsiveDistance;
  /** Delays the reveal by this amount of normalized scroll progress (0–1). */
  delay?: number;
  /** Start and end points within the tracked viewport interval. */
  progressOffset?: readonly [number, number];
  /** Defines the tracked viewport interval used by Motion's useScroll. */
  viewportOffset?: UseScrollOptions['offset'];
  /** Overrides the user's reduced-motion preference when explicitly provided. */
  reducedMotion?: boolean;
}

const DEFAULT_VIEWPORT_OFFSET: NonNullable<UseScrollOptions['offset']> = [
  'start 100%',
  'start 50%',
];

const clampProgress = (value: number) => Math.min(Math.max(value, 0), 1);

function useMobileViewport() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(max-width: 767px)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => setIsMobile(query.matches);

    updateViewport();
    query.addEventListener('change', updateViewport);

    return () => query.removeEventListener('change', updateViewport);
  }, []);

  return isMobile;
}

export default function ViewportReveal({
  children,
  className,
  distance = { mobile: 50, desktop: 90 },
  delay = 0,
  progressOffset = [0, 1],
  viewportOffset = DEFAULT_VIEWPORT_OFFSET,
  reducedMotion,
}: ViewportRevealProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMobileViewport();
  const shouldReduceMotion = reducedMotion ?? Boolean(prefersReducedMotion);
  const revealDistance =
    typeof distance === 'number'
      ? distance
      : isMobile
        ? (distance.mobile ?? 50)
        : (distance.desktop ?? 90);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: viewportOffset,
  });

  const revealStart = Math.min(
    0.99,
    clampProgress(progressOffset[0] + delay),
  );
  const requestedEnd = clampProgress(progressOffset[1]);
  const revealEnd = Math.min(1, Math.max(revealStart + 0.01, requestedEnd));
  const inputRange: [number, number] = [revealStart, revealEnd];

  const opacity = useTransform(scrollYProgress, inputRange, [0, 1]);
  const y = useTransform(scrollYProgress, inputRange, [revealDistance, 0]);
  const scale = useTransform(scrollYProgress, inputRange, [0.97, 1]);
  const filter = useTransform(scrollYProgress, inputRange, [
    'blur(10px)',
    'blur(0px)',
  ]);

  return (
    <motion.div
      ref={targetRef}
      className={className}
      style={
        shouldReduceMotion
          ? undefined
          : {
              opacity,
              y,
              scale,
              filter,
              willChange: 'transform, opacity, filter',
            }
      }
    >
      {children}
    </motion.div>
  );
}
