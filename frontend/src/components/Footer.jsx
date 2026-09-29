import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowUp } from 'react-icons/fi';
import {
  FaTiktok,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa';
import { navLinks, scrollToSection } from '../data/navLinks';
import { socialLinks, isRealUrl } from '../data/socialLinks';
import { siteConfig, buildWhatsAppLink } from '../data/siteConfig';
import FooterAmbient from './FooterAmbient';

const icons = {
  tiktok: FaTiktok,
  instagram: FaInstagram,
  facebook: FaFacebookF,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
};

/**
 * Wanda Gordon footer (obsidian) — reuses the old 3-column
 * Footer architecture restyled: gold top rule, serif wordmark,
 * section links, social icons that respect empty URLs.
 */
export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const waLink = buildWhatsAppLink(siteConfig.whatsappNumber);
  const socials = socialLinks.map((s) => {
    const url = s.id === 'whatsapp' ? waLink : s.url;
    return { ...s, live: isRealUrl(url), url };
  });

  const go = (id) => {
    if (location.pathname === '/') scrollToSection(id);
    else navigate(`/#${id}`);
  };

  return (
    <footer className="site-footer relative isolate overflow-hidden bg-[var(--footer-bg)] text-[var(--footer-ivory)]">
      <FooterAmbient />
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-[var(--footer-rule)] to-transparent" />
      <div className="container-editorial grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="min-w-0">
          <p className="font-serif text-xl font-semibold tracking-[0.18em]">
            WANDA GORDON
          </p>
          <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--footer-accent)]">
            Financial Educator · Coach · Speaker
          </p>
          <p className="body-editorial mt-4 max-w-[42ch] text-sm text-[var(--footer-m65)]">
            Practical financial knowledge, smarter money habits and
            investment awareness for a stronger financial future.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--footer-m50)]">
            Explore
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => go(l.id)}
                  className="text-[var(--footer-m75)] transition-colors hover:text-[var(--footer-accent)]"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--footer-m50)]">
            Follow
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {socials.map((s) => {
              const Icon = icons[s.id] || FaWhatsapp;
              const cls =
                'flex min-h-[44px] min-w-[44px] items-center justify-center border transition-colors';
              if (!s.live) {
                return (
                  <span
                    key={s.id}
                    title={`${s.platform} — coming soon`}
                    aria-label={`${s.platform} (coming soon)`}
                    aria-disabled="true"
                    className={`${cls} cursor-default border-[var(--footer-hairline)] text-[var(--footer-dim)]`}
                  >
                    <Icon size={17} />
                  </span>
                );
              }
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Wanda Gordon on ${s.platform}`}
                  className={`${cls} border-[var(--footer-line)] text-[var(--footer-accent)] hover:bg-[var(--footer-accent)] hover:text-[var(--footer-bg)]`}
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--footer-hairline)]">
        <div className="container-editorial flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-[var(--footer-m50)]">
          <p>© 2026 Wanda Gordon. All rights reserved.</p>
          <p>
            Built with{' '}
            <a
              href="https://wa.me/255675029833"
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with Gsky on WhatsApp"
              className="text-[var(--footer-accent)] underline decoration-[var(--footer-deco)] underline-offset-4 transition-colors hover:text-[var(--footer-ivory)]"
            >
              Gsky
            </a>
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex min-h-[44px] items-center gap-1.5 uppercase tracking-[0.16em] transition-colors hover:text-[var(--footer-accent)]"
          >
            Back to top <FiArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}
