import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiStar, FiX } from 'react-icons/fi';
import { celebration } from '../data/achievements';

const EASE = [0.22, 1, 0.36, 1];
const FALL_COLORS = ['#C9A24B', '#EDE3C8', '#E6C87A', '#142C4F', '#FFFFFF'];

function rnd(seed) {
  const x = Math.sin(seed * 91.7 + 53.4) * 28963.23;
  return x - Math.floor(x);
}

/**
 * Finishing popup: when the visitor scrolls to the very bottom,
 * stars and petals rain down and "Congratulations, Miss Wanda Gordon"
 * appears, then fades away on its own after a few seconds.
 * Never blocks scrolling (pointer events only on the card itself),
 * plays once per page load, real DOM text, closeable via ✕ or Escape.
 */
export default function CelebrationPopup() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  const fired = useRef(false);

  // Trigger once: visitor reaches the bottom of the page
  // (footer becomes visible). IntersectionObserver is reliable
  // even as images load and change the page height.
  useEffect(() => {
    if (fired.current) return undefined;
    const footer = document.querySelector('footer');
    if (!footer) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          fired.current = true;
          setTimeout(() => setShow(true), 700);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  // Auto-dismiss after ~6 seconds.
  useEffect(() => {
    if (!show) return undefined;
    const t = setTimeout(() => setShow(false), 6000);
    return () => clearTimeout(t);
  }, [show ]);

  // Escape closes.
  useEffect(() => {
    if (!show) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setShow(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show ]);

  if (gone) return null;

  const COUNT = 36;

  return (
    <AnimatePresence onExitComplete={() => setGone(true)}>
      {show && (
        <div aria-hidden={false} className="pointer-events-none fixed inset-0 z-[80]">
          {/* falling stars + petals */}
          {!reduce && (
            <div aria-hidden className="absolute inset-0 overflow-hidden">
              {Array.from({ length: COUNT }).map((_, i) => {
                const left = rnd(i + 1) * 100;
                const delay = rnd(i + 101) * 1.6;
                const dur = 3.4 + rnd(i + 201) * 2.2;
                const size = 7 + rnd(i + 301) * 9;
                const drift = (rnd(i + 401) - 0.5) * 140;
                const spin = (rnd(i + 501) - 0.5) * 540;
                const color = FALL_COLORS[i % FALL_COLORS.length];
                const kind = i % 4;
                return (
                  <motion.span
                    key={i}
                    initial={{ x: 0, y: '-8vh', opacity: 0, rotate: 0 }}
                    animate={{ x: drift, y: '108vh', opacity: [0, 1, 1, 0], rotate: spin }}
                    transition={{ duration: dur, delay, ease: 'linear' }}
                    className="absolute top-0"
                    style={{ left: `${left}%` }}
                  >
                    {kind === 0 ? (
                      <FiStar size={size} style={{ color }} />
                    ) : kind === 1 ? (
                      <span
                        className="block"
                        style={{
                          width: size * 0.72,
                          height: size,
                          backgroundColor: color,
                          borderRadius: '50% 4px 50% 50%',
                          transform: `rotate(${rnd(i + 601) * 180}deg)`,
                        }}
                      />
                    ) : kind === 2 ? (
                      <span
                        className="block"
                        style={{
                          width: size * 0.62,
                          height: size * 0.62,
                          backgroundColor: color,
                          transform: 'rotate(45deg)',
                        }}
                      />
                    ) : (
                      <span
                        className="block rounded-full"
                        style={{ width: size * 0.45, height: size * 0.45, backgroundColor: color }}
                      />
                    )}
                  </motion.span>
                );
              })}
            </div>
          )}

          {/* message card */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div
              role="dialog"
              aria-label={`${celebration.headline} ${celebration.name}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="pointer-events-auto relative w-full max-w-md border border-charcoal/10 bg-warm-white px-8 py-9 text-center shadow-[0_32px_64px_-24px_rgba(10,27,51,0.5)]"
            >
              <button
                type="button"
                onClick={() => setShow(false)}
                aria-label="Dismiss congratulations"
                className="absolute right-2 top-2 min-h-[44px] min-w-[44px] items-center justify-center p-2.5 text-charcoal/60 transition-colors hover:text-plum"
              >
                <FiX size={18} />
              </button>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-plum">
                {celebration.eyebrow}
              </p>
              <p className="heading-display mt-3 text-3xl leading-tight text-charcoal">
                {celebration.headline}{' '}
                <span className="text-plum-deep">{celebration.name}</span>
              </p>
              <span aria-hidden className="mx-auto mt-5 block h-[2px] w-28 origin-center bg-sage" />
              <span aria-hidden className="mx-auto mt-2 block h-[2px] w-14 origin-center bg-peach" />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
