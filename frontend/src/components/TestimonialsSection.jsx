import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Reveal } from './SectionReveal';
import api from '../services/api';
import { testimonials as staticTestimonials, testimonialsPlaceholder } from '../data/testimonials';

const EASE = [0.22, 1, 0.36, 1];

function Card({ t, active }) {
  return (
    <div
      className={`h-full border bg-white p-7 transition-all duration-500 md:p-9 ${
        active
          ? 'border-charcoal/15 shadow-[0_24px_48px_-24px_rgba(10,27,51,0.35)]'
          : 'border-charcoal/10'
      }`}
    >
      <p aria-hidden className="font-serif text-6xl leading-[0.8] text-sage">
        &ldquo;
      </p>
      <blockquote className="mt-4 font-serif text-xl italic leading-relaxed text-charcoal md:text-2xl">
        {t.quote}
      </blockquote>
      <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
        {t.name ? (
          <>
            {t.name}
            {t.role ? <span className="text-charcoal/40"> · {t.role}</span> : null}
          </>
        ) : (
          'Name coming soon'
        )}
      </p>
    </div>
  );
}

/**
 * Testimonials carousel — extends the existing placeholder section.
 * One centered card (peeking prev/next on desktop), looping arrows,
 * clickable dots + side cards, swipe on mobile, arrow-key support,
 * cross-fade when reduced motion is preferred. Manual control only.
 */
export default function TestimonialsSection() {
  const reduce = useReducedMotion();
  const [[index, direction], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const [live, setLive] = useState(null);

  useEffect(() => {
    api
      .get('/testimonials')
      .then((r) => {
        const rows = r.data.data || [];
        setLive(rows.map((t) => ({ id: t.id, quote: t.quote, name: t.name, role: t.role || '' })));
      })
      .catch(() => setLive([]));
  }, []);

  const testimonials = live === null || live.length === 0 ? staticTestimonials : live;
  const n = testimonials.length;
  const safeIndex = n === 0 ? 0 : index % n;

  const paginate = useCallback(
    (dir) => setPage(([i]) => [(i + dir + n) % n, dir]),
    [n]
  );
  const goTo = useCallback(
    (i) => setPage(([cur]) => [i, i === cur ? 0 : i > cur ? 1 : -1]),
    []
  );

  // Gentle auto-advance (pauses on hover/focus, off for reduced motion).
  useEffect(() => {
    if (reduce || paused || n <= 1) return undefined;
    const t = setInterval(() => paginate(1), 6000);
    return () => clearInterval(t);
  }, [reduce, paused, n, paginate, index]);

  if (!n) {
    return (
      <section aria-label="Testimonials" className="section-soft">
        <div className="container-editorial py-12 md:py-16">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-4">{testimonialsPlaceholder.heading}</p>
            <div aria-hidden className="gold-rule mx-auto max-w-[10rem]" />
            <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.22em] text-charcoal/50">
              {testimonialsPlaceholder.message}
            </p>
          </Reveal>
        </div>
      </section>
    );
  }

  const prev = testimonials[(safeIndex - 1 + n) % n];
  const next = testimonials[(safeIndex + 1) % n];

  const variants = reduce
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (d) => ({ x: d >= 0 ? 120 : -120, opacity: 0, scale: 0.96 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (d) => ({ x: d >= 0 ? -120 : 120, opacity: 0, scale: 0.96 }),
      };

  return (
    <section aria-label="Testimonials" className="section-soft overflow-hidden">
      <div className="container-editorial section-pad">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">{testimonialsPlaceholder.heading}</p>
          <h2 className="heading-display text-3xl text-charcoal md:text-4xl">
            Kind words, coming soon.
          </h2>
          <div aria-hidden className="gold-rule mx-auto mt-6 max-w-[10rem]" />
        </Reveal>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') paginate(1);
            if (e.key === 'ArrowLeft') paginate(-1);
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="relative mx-auto mt-12 max-w-3xl focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{ ['--tw-ring-color']: '#142C4F' }}
        >
          <div className="flex items-center gap-3 md:gap-5">
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous testimonial"
              className="hidden min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-full border border-plum/40 text-plum transition-colors hover:bg-sage hover:text-charcoal sm:inline-flex"
            >
              <FiArrowLeft size={18} />
            </button>

            {/* peek: previous */}
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Show previous testimonial"
              className="hidden w-[16%] shrink-0 opacity-60 transition-all duration-500 hover:opacity-100 lg:block"
            >
              <div className="scale-95 border border-charcoal/10 bg-white/70 p-4">
                <p className="line-clamp-3 font-serif text-sm italic text-charcoal/70">
                  {prev.quote}
                </p>
              </div>
            </button>

            <div className="relative min-w-0 flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={safeIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduce ? 0.3 : 0.5, ease: EASE }}
                  drag={reduce ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) paginate(1);
                    else if (info.offset.x > 70) paginate(-1);
                  }}
                >
                  <Card t={testimonials[safeIndex]} active />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* peek: next */}
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Show next testimonial"
              className="hidden w-[16%] shrink-0 opacity-60 transition-all duration-500 hover:opacity-100 lg:block"
            >
              <div className="scale-95 border border-charcoal/10 bg-white/70 p-4">
                <p className="line-clamp-3 font-serif text-sm italic text-charcoal/70">
                  {next.quote}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next testimonial"
              className="hidden min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-full border border-plum/40 text-plum transition-colors hover:bg-sage hover:text-charcoal sm:inline-flex"
            >
              <FiArrowRight size={18} />
            </button>
          </div>

          {/* mobile arrows */}
          <div className="mt-6 flex justify-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous testimonial"
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-plum/40 text-plum transition-colors hover:bg-sage hover:text-charcoal"
            >
              <FiArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next testimonial"
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-plum/40 text-plum transition-colors hover:bg-sage hover:text-charcoal"
            >
              <FiArrowRight size={18} />
            </button>
          </div>

          {/* indicators */}
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === safeIndex ? 'true' : undefined}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center"
              >
                <span
                  aria-hidden
                    className={`block h-[3px] w-8 rounded-full transition-colors ${
                      i === safeIndex ? 'bg-sage' : 'bg-charcoal/15'
                    }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
