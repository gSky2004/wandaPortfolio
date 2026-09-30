import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiMenu, FiX, FiArrowUpRight } from 'react-icons/fi';
import { navLinks, scrollToSection } from '../data/navLinks';
import { siteConfig, buildWhatsAppLink } from '../data/siteConfig';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Wanda Gordon navbar — reuses the existing scroll-spy +
 * mobile-menu architecture, restyled to editorial:
 * serif wordmark, gold sliding underline, obsidian overlay menu.
 * No theme toggle (fixed editorial rhythm).
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMenu = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('about');
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Body scroll lock while menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open ]);

  // Close on route change + Escape
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open ]);

  // Scroll-spy on Home (reused IntersectionObserver pattern)
  useEffect(() => {
    if (!isHome) {
      const hash = location.hash?.replace('#', '');
      setActiveId(hash || '');
      return undefined;
    }
    const ids = navLinks.map((s) => s.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome, location.hash, location.pathname]);

  const goToSection = useCallback(
    (section) => {
      setOpen(false);
      if (isHome) {
        scrollToSection(section.id);
        window.history.replaceState(null, '', `/#${section.id}`);
        return;
      }
      navigate({ pathname: '/', hash: `#${section.id}` });
    },
    [isHome, navigate]
  );

  // Connect always works: WhatsApp chat when a number is configured,
  // otherwise it takes the visitor to the contact section.
  const connectFallback = useCallback(() => {
    setOpen(false);
    if (isHome) {
      scrollToSection('contact');
      window.history.replaceState(null, '', '/#contact');
      return;
    }
    navigate({ pathname: '/', hash: '#contact' });
  }, [isHome, navigate]);

  const waLink = buildWhatsAppLink(siteConfig.whatsappNumber);
  const top = !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-sage/25 bg-plum-deep/85 backdrop-blur-md shadow-[0_12px_32px_-16px_rgba(67,54,74,0.65)]'
          : 'border-b border-charcoal/10 bg-ivory/80 backdrop-blur-md'
      }`}
    >
      <nav
        className={`container-editorial flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'h-14 md:h-16' : 'h-16 md:h-20'
        }`}
        aria-label="Primary"
      >
        <Link
          to="/"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className={`font-serif text-base md:text-lg font-semibold tracking-[0.22em] transition-colors duration-500 ${
            top ? 'text-plum-deep' : 'text-sage'
          }`}
        >
          WANDA&nbsp;GORDON
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((s) => {
            const active = activeId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSection(s)}
                aria-current={active ? 'true' : undefined}
                className={`relative py-2 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? top
                      ? 'text-plum-deep'
                      : 'text-sage'
                    : top
                      ? 'text-charcoal/60 hover:text-charcoal'
                      : 'text-ivory/70 hover:text-ivory'
                }`}
              >
                {s.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ duration: 0.45, ease: EASE }}
                    className={`absolute inset-x-0 -bottom-0.5 h-px ${top ? 'bg-plum' : 'bg-sage'}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className={`group hidden sm:inline-flex min-h-[44px] items-center gap-1.5 rounded-[3px] border px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] transition ${
                top
                  ? 'border-plum-deep/50 text-plum-deep hover:bg-plum-deep hover:text-ivory'
                  : 'border-sage/60 text-sage hover:bg-sage hover:text-charcoal'
              }`}
            >
              Connect
              <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : (
            <button
              type="button"
              onClick={connectFallback}
              title="Go to contact"
              className={`group hidden sm:inline-flex min-h-[44px] items-center gap-1.5 rounded-[3px] border px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] transition ${
                top
                  ? 'border-plum-deep/50 text-plum-deep hover:bg-plum-deep hover:text-ivory'
                  : 'border-sage/60 text-sage hover:bg-sage hover:text-charcoal'
              }`}
            >
              Connect
              <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          )}
          <button
            type="button"
            className={`lg:hidden rounded-[3px] p-2.5 transition-colors ${
              top ? 'text-charcoal hover:text-plum-deep' : 'text-ivory hover:text-sage'
            }`}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <FiMenu size={22} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-50 lg:hidden bg-plum-deeper"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <p className="font-serif text-base font-semibold tracking-[0.22em] text-sage">
                WANDA&nbsp;GORDON
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-2.5 text-ivory hover:text-sage"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="gold-rule mx-4 sm:mx-6 opacity-60" />
            <motion.nav
              className="flex h-[calc(100%-4rem)] flex-col overflow-y-auto px-8 py-6"
              aria-label="Mobile"
              onClick={(e) => e.stopPropagation()}
              initial="hidden"
              animate="show"
              variants={
                reduceMenu
                  ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                  : { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }
              }
            >
              <div className="my-auto flex flex-col gap-1">
              {navLinks.map((s, i) => (
                <motion.div
                  key={s.id}
                  variants={
                    reduceMenu
                      ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                      : {
                          hidden: { opacity: 0, y: 24 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                        }
                  }
                >
                  <button
                    type="button"
                    onClick={() => goToSection(s)}
                    className="group flex w-full items-baseline gap-4 py-3 text-left"
                  >
                    <span className="font-serif text-sm text-sage/70">0{i + 1}</span>
                    <span
                      className={`font-serif text-4xl font-medium transition-colors ${
                        activeId === s.id ? 'text-sage' : 'text-ivory group-hover:text-sage'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                }}
                className="pt-8"
              >
                {waLink ? (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-[3px] bg-sage px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal"
                  >
                    Connect <FiArrowUpRight />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={connectFallback}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-[3px] bg-sage px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal"
                  >
                    Connect <FiArrowUpRight />
                  </button>
                )}
                <p className="eyebrow mt-6 !text-sage">{siteConfig.tagline}</p>
              </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
