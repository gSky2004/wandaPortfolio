import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { footerAmbient } from '../data/siteConfig';

const EASE = [0.22, 1, 0.36, 1];
const DRIFT_COLORS = ['#C6D8AF', '#DBD8B3', '#FCC8B2', '#685369'];

function rnd(seed) {
  const x = Math.sin(seed * 41.3 + 17.7) * 19381.7;
  return x - Math.floor(x);
}

/**
 * Ambient layer behind the footer content: 14 slow-rising shapes
 * (6 on mobile) + a "Stay With Us" line. Fires once via useInView,
 * transform/opacity only, pointer-events-none so no click target
 * is affected. The footer itself is untouched.
 */
export default function FooterAmbient() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const COUNT = isMobile ? 6 : 14;

  return (
    <>
      {/* behind-content particle layer (footer is `isolate`, so -z stays inside) */}
      <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {inView && !reduce && (
          <>
            {Array.from({ length: COUNT }).map((_, i) => {
              const left = 4 + rnd(i + 1) * 92;
              const startY = 40 + rnd(i + 101) * 120;
              const rise = 160 + rnd(i + 201) * 160;
              const sway = (rnd(i + 301) - 0.5) * 56;
              const dur = 3 + rnd(i + 401) * 2;
              const delay = rnd(i + 501) * 1.4;
              const size = 3 + rnd(i + 601) * 5;
              const color = DRIFT_COLORS[i % DRIFT_COLORS.length];
              const kind = i % 3;
              return (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: startY, opacity: 0 }}
                  animate={{ x: [0, sway, -sway * 0.6, 0], y: startY - rise, opacity: [0, 0.85, 0.85, 0] }}
                  transition={{ duration: dur, delay, ease: EASE }}
                  className="absolute"
                  style={{ left: `${left}%`, top: 'auto', bottom: 0 }}
                >
                  {kind === 0 ? (
                    <span className="block rounded-full" style={{ width: size, height: size, backgroundColor: color }} />
                  ) : kind === 1 ? (
                    <span className="block" style={{ width: size * 2.4, height: 1.5, backgroundColor: color }} />
                  ) : (
                    <span className="block" style={{ width: size * 0.7, height: size * 0.7, backgroundColor: color, transform: 'rotate(45deg)' }} />
                  )}
                </motion.span>
              );
            })}
          </>
        )}
      </div>

      {/* heading line in normal flow, above the columns */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: reduce ? 0.3 : 0.6, ease: EASE }}
        className="relative pt-10 text-center font-serif text-lg italic text-[var(--footer-m75)]"
      >
        {footerAmbient.heading}
      </motion.p>
    </>
  );
}
