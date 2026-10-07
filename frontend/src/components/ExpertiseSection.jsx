import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Reveal, Stagger, StaggerItem } from './SectionReveal';
import { services, serviceIcons } from '../data/expertise';
import { scrollToSection } from '../data/navLinks';

const EASE = [0.22, 1, 0.36, 1];

/* Surface per accent key — AA-checked pairs only:
   light surfaces → charcoal text, dark surfaces → ivory text. */
const SURFACES = {
  plum: {
    bg: '#142C4F', fg: '#F7F5EF', sub: 'rgba(247,245,239,.75)',
    line: 'rgba(247,245,239,.35)', ghost: 'rgba(247,245,239,.13)',
    ring: '#C9A24B', spot: 'rgba(255,255,255,.10)',
  },
  citrine: {
    bg: '#E4DA72', fg: '#111114', sub: 'rgba(17,17,20,.72)',
    line: 'rgba(17,17,20,.32)', ghost: 'rgba(17,17,20,.10)',
    ring: '#142C4F', spot: 'rgba(255,255,255,.35)',
  },
  amber: {
    bg: '#FFB900', fg: '#111114', sub: 'rgba(17,17,20,.72)',
    line: 'rgba(17,17,20,.3)', ghost: 'rgba(17,17,20,.10)',
    ring: '#142C4F', spot: 'rgba(255,255,255,.3)',
  },
  charcoal: {
    bg: '#111114', fg: '#F7F5EF', sub: 'rgba(247,245,239,.75)',
    line: 'rgba(201,162,77,.45)', ghost: 'rgba(201,162,77,.12)',
    ring: '#C9A24B', spot: 'rgba(201,162,77,.12)',
  },
  crimson: {
    bg: '#D10056', fg: '#F7F5EF', sub: 'rgba(247,245,239,.8)',
    line: 'rgba(247,245,239,.4)', ghost: 'rgba(247,245,239,.14)',
    ring: '#C9A24B', spot: 'rgba(255,255,255,.12)',
  },
  cream: {
    bg: '#FFF1D1', fg: '#111114', sub: 'rgba(17,17,20,.72)',
    line: 'rgba(17,17,20,.28)', ghost: 'rgba(20,44,79,.12)',
    ring: '#142C4F', spot: 'rgba(255,255,255,.4)',
  },
  /* legacy keys (kept so older cached data never breaks) */
  sage: {
    bg: '#E4DA72', fg: '#111114', sub: 'rgba(17,17,20,.72)',
    line: 'rgba(17,17,20,.32)', ghost: 'rgba(17,17,20,.10)',
    ring: '#142C4F', spot: 'rgba(255,255,255,.35)',
  },
  'soft-sage': {
    bg: '#FFB900', fg: '#111114', sub: 'rgba(17,17,20,.72)',
    line: 'rgba(17,17,20,.3)', ghost: 'rgba(17,17,20,.10)',
    ring: '#142C4F', spot: 'rgba(255,255,255,.3)',
  },
};

/* Section wash shifts subtly inside the navy family. */
const SECTION_WASH = {
  base: '#0F2340',
  plum: '#142C4F',
  citrine: '#57512E',
  amber: '#5E4E1E',
  charcoal: '#17171B',
  crimson: '#5C2947',
  cream: '#55503F',
  sage: '#57512E',
  'soft-sage': '#5E4E1E',
};

/**
 * Services flagship — replaces the basic card grid, reusing the
 * section wrapper, heading system, Reveal/Stagger and data file.
 * Desktop: expanding panels · Tablet: 2-col grid, tap to expand ·
 * Mobile: accordion. Panels are real buttons (aria-expanded),
 * keyboard operable; content never depends on hover.
 */
export default function ExpertiseSection() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState(services[0]?.id);
  const btnRefs = useRef({});
  const finePointer = useRef(
    typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: fine)').matches
  );

  const active = services.find((s) => s.id === selected) || services[0];
  const sectionBg = SECTION_WASH[active?.accent] || SECTION_WASH.base;

  const select = useCallback((id) => setSelected(id), []);

  const focusSibling = useCallback(
    (id, dir) => {
      const i = services.findIndex((s) => s.id === id);
      const next = services[(i + dir + services.length) % services.length];
      select(next.id);
      btnRefs.current[next.id]?.focus();
    },
    [select]
  );

  const onKeyDown = (e, id) => {
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
      focusSibling(id, dir);
    }
  };

  const spotlight = (e) => {
    if (!finePointer.current || reduce) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const discuss = (service) => {
    window.dispatchEvent(
      new CustomEvent('wanda:service-interest', { detail: { title: service.title } })
    );
    scrollToSection('speaking-form');
  };

  return (
    <section
      id="expertise"
      aria-label="Services"
      style={{ backgroundColor: sectionBg }}
      className="relative scroll-mt-20 overflow-hidden text-ivory transition-colors duration-700"
    >
      {/* ghost word crossing the top boundary */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 left-0 select-none font-serif text-[22vw] font-semibold leading-none text-white/[0.08] md:text-[13rem]"
      >
        Services
      </span>

      <div className="container-editorial section-pad relative">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-4 !text-sage">Services</p>
          <h2 className="heading-display text-3xl text-ivory sm:text-4xl md:text-5xl">
            How Wanda Helps
          </h2>
          <p className="body-editorial mt-4 text-ivory/70">
            Six ways to learn, grow and take action — hover or tap a panel
            to explore.
          </p>
        </Reveal>

        {/* ── Desktop expanding panels ─────────────────────────── */}
        <Stagger className="mt-12 hidden gap-3 lg:flex">
          {services.map((s) => {
            const surf = SURFACES[s.accent] || SURFACES.plum;
            const isActive = s.id === selected;
            const Icon = serviceIcons[s.icon];
            return (
              <StaggerItem key={s.id} className="min-w-0" style={{ flexGrow: isActive ? 3.4 : 1, flexBasis: 0, transition: 'flex-grow 0.55s cubic-bezier(0.22,1,0.36,1)' }}>
                <div
                  onMouseEnter={() => !reduce && select(s.id)}
                  onMouseMove={spotlight}
                  style={{ backgroundColor: surf.bg, color: surf.fg, opacity: isActive ? 1 : 0.78 }}
                  className="relative flex h-[560px] flex-col overflow-hidden p-7 transition-opacity duration-500"
                >
                  {/* cursor spotlight (fine pointers only) */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{ background: `radial-gradient(240px at var(--mx,50%) var(--my,30%), ${surf.spot}, transparent 70%)` }}
                  />
                  {/* ghost numeral */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-10 -right-3 select-none font-serif text-[11rem] font-semibold leading-none transition-all duration-500"
                    style={{ color: surf.ghost, opacity: isActive ? 1 : 0.45 }}
                  >
                    {s.numeral}
                  </span>
                  {/* rule draws in after appear */}
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
                    className="absolute inset-x-0 top-0 h-[2px] origin-left"
                    style={{ backgroundColor: surf.line }}
                  />

                  <button
                    ref={(el) => { if (el) btnRefs.current[s.id] = el; }}
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={`service-detail-${s.id}`}
                    onClick={() => select(s.id)}
                    onFocus={() => select(s.id)}
                    onKeyDown={(e) => onKeyDown(e, s.id)}
                    style={{ ['--tw-ring-color']: surf.ring }}
                    className="relative block w-full min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    <span className="font-serif text-lg" style={{ color: surf.sub }}>
                      {s.numeral}
                    </span>
                    <span className="mt-auto block pt-24 font-serif text-[1.35rem] font-semibold leading-snug">
                      {s.title}
                    </span>
                    {!isActive && (
                      <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: surf.sub }}>
                        Explore →
                      </span>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        id={`service-detail-${s.id}`}
                        key="detail"
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="relative min-w-0"
                      >
                        <span className="flex items-center gap-3">
                          {Icon && (
                            <span
                              className="inline-flex transition-transform duration-500 group-hover:rotate-6"
                              style={{ color: surf.fg }}
                            >
                              <Icon size={22} className="transition-transform duration-500 hover:rotate-6" />
                            </span>
                          )}
                          <span className="h-px w-10" style={{ backgroundColor: surf.line }} aria-hidden />
                        </span>
                        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: surf.sub }}>
                          {s.description}
                        </p>
                        <p className="mt-3 text-sm italic leading-relaxed opacity-80">
                          {s.expanded.replace(/^REVIEW COPY \(draft\):\s*/, '')}
                        </p>
                        <button
                          type="button"
                          onClick={() => discuss(s)}
                          style={{ ['--tw-ring-color']: surf.ring }}
                          className="group mt-5 inline-flex min-h-[44px] items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] focus-visible:outline-2 focus-visible:outline-offset-4"
                        >
                          Discuss this topic
                          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* ── Tablet 2-col grid, tap to expand ──────────────────── */}
        <div className="mt-12 hidden gap-4 md:grid md:grid-cols-2 lg:hidden">
          {services.map((s, i) => {
            const surf = SURFACES[s.accent] || SURFACES.plum;
            const isActive = s.id === selected;
            const Icon = serviceIcons[s.icon];
            return (
              <motion.article
                key={s.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.07 * i }}
                style={{ backgroundColor: surf.bg, color: surf.fg }}
                className={isActive ? 'md:col-span-2' : ''}
              >
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={`service-tab-${s.id}`}
                  onClick={() => select(isActive ? '' : s.id)}
                  onKeyDown={(e) => onKeyDown(e, s.id)}
                  className="flex min-h-[64px] w-full items-center gap-4 p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                  style={{ ['--tw-ring-color']: surf.ring }}
                >
                  <span className="font-serif text-lg" style={{ color: surf.sub }}>{s.numeral}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-xl font-semibold">{s.title}</span>
                    <span className="mt-1 block text-sm" style={{ color: surf.sub }}>{s.description}</span>
                  </span>
                  {Icon && <Icon size={22} aria-hidden />}
                </button>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      id={`service-tab-${s.id}`}
                      key="tab"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0.01 : 0.45, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6">
                        <p className="text-sm italic opacity-80">
                          {s.expanded.replace(/^REVIEW COPY \(draft\):\s*/, '')}
                        </p>
                        <button
                          type="button"
                          onClick={() => discuss(s)}
                          className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em]"
                        >
                          Discuss this topic <FiArrowRight />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>

        {/* ── Mobile accordion ──────────────────────────────────── */}
        <div className="mt-10 md:hidden">
          {services.map((s) => {
            const isActive = s.id === selected;
            const Icon = serviceIcons[s.icon];
            return (
              <div key={s.id} className="border-b border-ivory/20">
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={`service-acc-${s.id}`}
                  onClick={() => select(isActive ? '' : s.id)}
                  className="flex min-h-[60px] w-full items-center gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                  style={{ ['--tw-ring-color']: '#C9A24B' }}
                >
                  <span className="font-serif text-base text-sage/80">{s.numeral}</span>
                  <span className="min-w-0 flex-1 font-serif text-lg font-semibold text-ivory">
                    {s.title}
                  </span>
                  {Icon && <Icon size={20} className="shrink-0 text-sage" aria-hidden />}
                  <FiArrowRight
                    aria-hidden
                    className={`shrink-0 transition-transform duration-300 ${isActive ? 'rotate-90' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      id={`service-acc-${s.id}`}
                      key="acc"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0.01 : 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pl-10 pr-2">
                        <p className="text-[15px] leading-relaxed text-ivory/80">{s.description}</p>
                        <p className="mt-2 text-sm italic text-ivory/60">
                          {s.expanded.replace(/^REVIEW COPY \(draft\):\s*/, '')}
                        </p>
                        <button
                          type="button"
                          onClick={() => discuss(s)}
                          className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-sage"
                        >
                          Discuss this topic <FiArrowRight />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Listener helper used by the speaking form (preselect support). */
export function useServiceInterest(handler) {
  useEffect(() => {
    window.addEventListener('wanda:service-interest', handler);
    return () => window.removeEventListener('wanda:service-interest', handler);
  }, [handler]);
}
