import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import {
  FaTiktok,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa';
import { Reveal, Stagger, StaggerItem } from './SectionReveal';
import { socialLinks, isRealUrl } from '../data/socialLinks';
import { siteConfig, buildWhatsAppLink } from '../data/siteConfig';

const EASE = [0.22, 1, 0.36, 1];

const icons = {
  tiktok: FaTiktok,
  instagram: FaInstagram,
  facebook: FaFacebookF,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
};

/**
 * Follow Wanda's Financial Journey (dark) — five large social cards.
 * Reuses the Footer social-icon pattern. Empty URL → intentional
 * placeholder card, never a fake link.
 */
export default function SocialSection() {
  const reduce = useReducedMotion();
  const waLink = buildWhatsAppLink(siteConfig.whatsappNumber);

  const cards = socialLinks.map((s) => {
    const url = s.id === 'whatsapp' ? waLink : s.url;
    return { ...s, live: isRealUrl(url), url };
  });

  return (
    <section aria-label="Follow Wanda" className="section-dark grain relative overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sage/50 to-transparent" />
      <div className="container-editorial section-pad relative">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-4">Community</p>
          <h2 className="heading-display text-3xl text-ivory sm:text-4xl md:text-5xl">
            Follow Wanda&apos;s Financial Journey.
          </h2>
          <div aria-hidden className="gold-rule-left mt-6" />
        </Reveal>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((s) => {
            const Icon = icons[s.id] || FaWhatsapp;
            const inner = (
              <>
                <Icon size={26} className={`${s.live ? 'text-sage' : 'text-ivory/50'} transition-transform duration-300 group-hover:-translate-y-1`} aria-hidden />
                <p className="mt-5 font-serif text-xl text-ivory">{s.platform}</p>
                <p className="mt-1 text-xs tracking-wide text-ivory/70">
                  {s.live ? 'Follow along' : s.handleLabel}
                </p>
                <span
                  aria-hidden
                  className={`mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                    s.live ? 'text-sage opacity-0 group-hover:opacity-100' : 'text-ivory/60'
                  }`}
                >
                  {s.live ? (
                    <>Visit <FiArrowUpRight /></>
                  ) : (
                    'Coming soon'
                  )}
                </span>
              </>
            );

            return (
              <StaggerItem key={s.id}>
                <motion.div
                  whileHover={reduce || !s.live ? undefined : { y: -5 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className={`h-full border p-6 ${
                    s.live ? 'border-sage/30 bg-white/[0.03]' : 'border-ivory/10 bg-white/[0.01]'
                  }`}
                >
                  {s.live ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Wanda Gordon on ${s.platform}`}
                      className="group block h-full"
                    >
                      {inner}
                    </a>
                  ) : (
                    <span aria-disabled="true" title={`${s.platform} — coming soon`} className="block h-full cursor-default">
                      {inner}
                    </span>
                  )}
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
