import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from './SectionReveal';
import { achievements } from '../data/achievements';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Recognition & Achievements (light ivory).
 * Scroll-driven spine draw + per-node sage fill, sequential
 * clip-reveal entries, inline celebration below. Content strictly
 * from data/achievements.js — nothing invented.
 */
function TimelineNode({ progress, index, total, reduce }) {
  const fill = useTransform(
    progress,
    [index / total, (index + 0.8) / total],
    [0, 1]
  );
  return (
    <span aria-hidden className="absolute left-0 top-1.5 md:left-1/2 md:-translate-x-1/2">
      <span className="relative block h-[15px] w-[15px] rotate-45 border border-sage bg-white">
        <motion.span
          style={reduce ? { scale: 1, opacity: 1 } : { scale: fill, opacity: fill }}
          className="absolute inset-[3px] bg-sage"
        />
      </span>
      {!reduce && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: [0.5, 1.9], opacity: [0.7, 0] }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="absolute inset-0 rotate-45 border border-sage"
        />
      )}
    </span>
  );
}

export default function RecognitionSection() {
  const listRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.85', 'end 0.55'],
  });
  const total = achievements.length;

  return (
    <section
      id="recognition"
      aria-label="Recognition and achievements"
      className="section-light grain relative scroll-mt-20 overflow-hidden"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sage/50 to-transparent" />
      <div className="container-editorial section-pad relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">Recognition</p>
          <h2 className="heading-display text-3xl text-charcoal sm:text-4xl md:text-5xl">
            Credentials that speak first.
          </h2>
          <div aria-hidden className="gold-rule mx-auto mt-6 max-w-[12rem]" />
        </Reveal>

        <div ref={listRef} className="relative mx-auto mt-14 max-w-2xl">
          {/* track */}
          <div aria-hidden className="absolute bottom-0 left-[7px] top-1 w-px bg-charcoal/10 md:left-1/2 md:-translate-x-1/2" />
          {/* sage draw */}
          <motion.div
            aria-hidden
            style={reduce ? undefined : { scaleY: scrollYProgress }}
            className="absolute bottom-0 left-[7px] top-1 w-px origin-top bg-sage md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="space-y-10">
            {achievements.map((a, i) => {
              const dir = i % 2 === 0 ? -1 : 1;
              return (
                <motion.li
                  key={a.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, x: dir * 28 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.65, ease: EASE, delay: 0.07 * i }}
                  className="relative pl-10 md:grid md:grid-cols-2 md:gap-10 md:pl-0"
                >
                  <TimelineNode progress={scrollYProgress} index={i} total={total} reduce={reduce} />
                  <motion.div
                    whileHover={reduce ? undefined : { y: -4 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={`group ${i % 2 === 0 ? 'md:col-start-1 md:pr-10 md:text-right' : 'md:col-start-2 md:pl-10'}`}
                  >
                    {a.year && (
                      <p className="font-serif text-4xl leading-none text-plum-deep transition-colors duration-300 group-hover:text-plum md:text-5xl">
                        {a.year}
                      </p>
                    )}
                    {!a.year && (
                      <p aria-hidden className="font-serif text-2xl leading-none text-plum/50 transition-colors duration-300 group-hover:text-plum">
                        {String(i + 1).padStart(2, '0')}
                      </p>
                    )}
                    <h3 className="heading-display mt-2 text-xl text-charcoal md:text-2xl">
                      <span className="block overflow-hidden pb-1">
                        <motion.span
                          initial={reduce ? { opacity: 0 } : { y: '110%' }}
                          whileInView={reduce ? { opacity: 1 } : { y: '0%' }}
                          viewport={{ once: true, margin: '-10%' }}
                          transition={{ duration: 0.55, ease: EASE, delay: 0.18 }}
                          className="block"
                        >
                          {a.title}
                        </motion.span>
                      </span>
                    </h3>
                    <span
                      aria-hidden
                      className="mt-1 block h-[2px] w-12 origin-left scale-x-0 bg-sage transition-transform duration-500 group-hover:scale-x-100 md:ml-auto"
                      style={i % 2 === 0 ? undefined : { marginLeft: 0 }}
                    />
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: '-10%' }}
                      transition={{ duration: 0.5, delay: 0.35 }}
                      className="mt-3"
                    >
                      <span className="inline-flex items-center gap-2 border border-charcoal/10 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal transition-colors duration-300 group-hover:border-sage">
                        {a.type}
                        <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-peach opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </span>
                    </motion.p>
                  </motion.div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
