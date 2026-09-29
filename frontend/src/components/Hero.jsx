import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';
import Portrait from './Portrait';
import { siteConfig } from '../data/siteConfig';
import { scrollToSection } from '../data/navLinks';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Wanda Gordon hero — dark obsidian→navy editorial.
 * Reuses the existing Hero's entrance-sequence architecture
 * (staggered motion delays) with new copy, badge and Portrait.
 */
const seq = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

export default function Hero() {
  const reduce = useReducedMotion();
  const anim = (delay) => (reduce ? {} : seq(delay));

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="section-light grain relative overflow-hidden scroll-mt-20"
    >
      {/* ivory wash + one static organic shape (no extra motion) */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-ivory via-warm-white to-sage-soft/60" />
      <div aria-hidden className="absolute -right-32 top-1/3 h-[26rem] w-[26rem] rounded-[42%_58%_60%_40%/48%_42%_58%_52%] bg-sage/[0.22]" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sage/50 to-transparent" />

      <div className="container-editorial relative grid items-center gap-12 py-24 md:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-36">
        <div className="min-w-0 pt-8 lg:pt-0">
          <motion.p {...anim(0)} className="eyebrow mb-5">
            Financial Educator · Coach · Speaker
          </motion.p>

          <motion.h1
            {...anim(0.08)}
            className="headline-editorial text-charcoal"
          >
            Build Wealth
            <br />
            With{' '}
            <em className="relative whitespace-nowrap font-serif italic text-plum-deep">
              Clarity.
              <motion.span
                aria-hidden
                initial={reduce ? { opacity: 0 } : { scaleX: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
                className="absolute inset-x-0 -bottom-1 h-[3px] origin-left bg-sage/80"
              />
            </em>
          </motion.h1>

          <motion.p
            {...anim(0.18)}
            className="body-editorial mt-6 max-w-[52ch] text-base text-charcoal/75 md:text-lg"
          >
            {siteConfig.heroText}
          </motion.p>

          <motion.div {...anim(0.3)} className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="btn-primary group"
            >
              Work With Wanda
              <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="btn-secondary group border-charcoal/25 text-charcoal hover:border-plum hover:text-plum"
            >
              Explore Her Journey
              <FiArrowDown className="transition-transform group-hover:translate-y-0.5" />
            </button>
          </motion.div>

          <motion.div {...anim(0.42)} className="mt-10">
            <motion.div
              animate={reduce ? {} : { y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="flex w-fit items-center gap-3 rounded-[3px] border border-charcoal/10 bg-sand px-4 py-2.5"
            >
              <span aria-hidden className="h-px w-8 bg-sage" />
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-peach" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal">
                Most Influential Woman of the Year · 2026
              </p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
          className="mx-auto w-full max-w-sm lg:max-w-md lg:justify-self-end"
        >
          <Portrait priority withParallax tone="light" caption="Wanda Gordon — Financial Educator · Coach · Speaker" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-charcoal/60">
          Scroll
        </span>
        <span className="flex h-9 w-5 justify-center border border-charcoal/25 pt-1.5">
          <span className="h-1.5 w-px bg-sage" />
        </span>
      </motion.div>
    </section>
  );
}
