import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import { Reveal } from './SectionReveal';
import SpeakingInquiryForm from './SpeakingInquiryForm';
import speakingTopics from '../data/speakingTopics';
import { scrollToSection } from '../data/navLinks';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Speaking (navy) — ruled topic list + inquiry form.
 * New section (justified): no speaking architecture existed;
 * form reuses the Contact POST/messages pattern with zero
 * backend changes.
 */
export default function SpeakingSection() {
  const reduce = useReducedMotion();

  return (
    <section id="speaking" aria-label="Speaking" className="section-sand relative scroll-mt-20 overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-sage/40" />
      <div className="container-editorial section-pad">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-4">Speaking</p>
          <h2 className="heading-display text-3xl text-charcoal sm:text-4xl md:text-5xl">
            Ideas That Move People Forward.
          </h2>
          <div aria-hidden className="gold-rule-left mt-6" />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="min-w-0">
            <ol className="border-t border-plum/20">
              {speakingTopics.map((topic, i) => (
              <motion.li
                  key={topic}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.06 * i }}
                  className="group flex items-baseline gap-5 border-b border-plum/20 py-5"
                >
                  <span className="font-serif text-sm text-plum">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-serif text-xl text-charcoal transition-colors group-hover:text-plum md:text-2xl">
                    {topic}
                  </span>
                </motion.li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => scrollToSection('speaking-form')}
              className="group mt-8 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-plum-deep"
            >
              Invite Wanda to Speak
              <FiArrowDown className="transition-transform group-hover:translate-y-1" />
            </button>
          </div>

          <Reveal delay={0.1}>
            <SpeakingInquiryForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
