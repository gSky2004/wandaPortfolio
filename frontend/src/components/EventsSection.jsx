import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Reveal } from './SectionReveal';
import { events } from '../data/events';

const EASE = [0.22, 1, 0.36, 1];

function EventImage({ event, className = '' }) {
  if (!event.image) {
    return (
      <div className={`flex items-center justify-center bg-plum-deep p-8 text-center ${className}`}>
        <div>
          <div aria-hidden className="gold-rule-left mx-auto mb-4" />
          <p className="font-serif text-xl text-ivory/90">{event.title}</p>
          <p className="mt-2 font-mono text-[11px] tracking-wider text-ivory/50">
            {event.imagePlaceholder}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className={`group overflow-hidden ${className}`}>
      <img
        src={event.image}
        alt={event.imageAlt || event.title}
        loading="lazy"
        width={960}
        height={600}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
    </div>
  );
}

/**
 * Featured Events — reuses the Projects section/card architecture
 * (feature card + mapped grid) restyled to editorial.
 * Only provided data is shown — no dates/venues/counts invented.
 */
export default function EventsSection() {
  const reduce = useReducedMotion();
  const [featured, ...rest] = events;

  if (!featured) return null;

  return (
    <section id="events" aria-label="Featured events" className="section-warm relative scroll-mt-20 overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sage/60 to-transparent" />
      <div className="container-editorial section-pad relative">
        <Reveal>
          <p className="eyebrow mb-4">Events</p>
          <h2 className="heading-display max-w-[14ch] text-3xl text-charcoal sm:text-4xl md:text-5xl">
            Learning experiences that stay with you.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <article className="group relative grid overflow-hidden border border-charcoal/10 bg-white lg:grid-cols-[1.5fr_1fr]">
            <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left scale-x-0 bg-peach transition-transform duration-500 group-hover:scale-x-100" />
            <motion.div
              initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)', opacity: 0.5 }}
              whileInView={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="min-w-0 overflow-hidden"
            >
              <EventImage event={featured} className="group h-full w-full aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]" />
            </motion.div>
            <div className="flex min-w-0 flex-col justify-center p-7 md:p-10">
              <p>
                <span className="inline-block rounded-[3px] bg-sand px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal">
                  {featured.category} · {featured.year}
                </span>
              </p>
              <h3 className="heading-display mt-4 text-2xl text-charcoal md:text-3xl">
                {featured.title}
              </h3>
              <div aria-hidden className="gold-rule-left mt-5" />
              <p className="body-editorial mt-5 text-[15px] text-charcoal/75">
                {featured.description}
              </p>
              <Link
                to={`/events/${featured.slug}`}
                className="group mt-7 inline-flex w-fit items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-plum-deep"
              >
                <span className="link-underline">View Event Story</span>
                <FiArrowRight aria-hidden className="text-sage transition-all duration-300 group-hover:translate-x-1 group-hover:text-peach" />
              </Link>
            </div>
          </article>
        </Reveal>

        {rest.length > 0 && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {rest.map((e, i) => (
              <motion.article
                key={e.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.07 * i }}
                className="group relative overflow-hidden border border-charcoal/10 bg-white"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left scale-x-0 bg-peach transition-transform duration-500 group-hover:scale-x-100" />
                <EventImage event={e} className="aspect-[16/9]" />
                <div className="p-6">
                  <p>
                    <span className="inline-block rounded-[3px] bg-sand px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-charcoal">
                      {e.category}{e.year ? ` · ${e.year}` : ''}
                    </span>
                  </p>
                  <h3 className="heading-display mt-3 text-xl text-charcoal">{e.title}</h3>
                  <Link
                    to={`/events/${e.slug}`}
                    className="group mt-4 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-plum-deep"
                  >
                    <span className="link-underline">View Event Story</span> <FiArrowRight aria-hidden className="text-sage transition-all duration-300 group-hover:translate-x-1 group-hover:text-peach" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
