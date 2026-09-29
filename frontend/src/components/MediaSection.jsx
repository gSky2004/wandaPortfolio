import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiPlay, FiX } from 'react-icons/fi';
import { Reveal } from './SectionReveal';
import api from '../services/api';
import media, { getMediaEmbedUrl } from '../data/media';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Media — "Watch Wanda".
 * Reuses the modal architecture (AnimatePresence backdrop
 * dialog) extended for video: youtube-nocookie, iframe lazy-mounted
 * only when open (stops on close), Escape/backdrop close, focus
 * trap + return, aria dialog. Empty videoId → disabled placeholder.
 */
export default function MediaSection() {
  const [open, setOpen] = useState(false);
  const [live, setLive] = useState(null);
  const [active, setActive] = useState(null);
  const closeRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    api
      .get('/media')
      .then((r) => {
        const rows = r.data.data || [];
        setLive(rows.map((m) => ({ id: m.id, title: m.title, youtube_id: m.youtube_id })));
      })
      .catch(() => setLive([]));
  }, []);

  const videos =
    live === null || live.length === 0
      ? [{ id: 'static', title: 'Featured talk', youtube_id: media.videoId }]
      : live;
  const featured = videos[0];
  const playing = active || featured;
  const hasVideo = Boolean(playing.youtube_id);
  const embedUrl = getMediaEmbedUrl(playing.youtube_id);

  const play = useCallback((video) => {
    setActive(video);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        // minimal focus trap: keep tab inside the dialog
        const dlg = document.getElementById('wanda-video-dialog');
        if (!dlg) return;
        const focusables = dlg.querySelectorAll('button, iframe, [href], [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <section id="media" aria-label="Watch Wanda" className="section-light scroll-mt-20">
      <div className="container-editorial section-pad">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">Media</p>
          <h2 className="heading-display text-3xl text-charcoal sm:text-4xl md:text-5xl">
            Watch Wanda
          </h2>
          <div aria-hidden className="gold-rule mx-auto mt-6 max-w-[12rem]" />
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-4xl">
          {hasVideo ? (
            <button
              type="button"
              onClick={() => play(featured)}
              aria-label={`Play video: ${featured.title}`}
              className="group relative block w-full overflow-hidden border border-charcoal/15 bg-plum-deep text-left"
            >
              {media.thumbnail ? (
                <img
                  src={media.thumbnail}
                  alt={media.thumbnailAlt}
                  loading="lazy"
                  width={1280}
                  height={720}
                  className="aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <span className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-plum-deep p-8 text-center">
                  <span className="font-serif text-2xl text-ivory/90">Wanda Gordon</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory/55">
                    Featured talk
                  </span>
                </span>
              )}
              <span aria-hidden className="absolute inset-0 bg-plum-deeper/25 transition-colors group-hover:bg-plum-deeper/10" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-sage bg-plum-deeper/70 text-sage transition-transform duration-300 group-hover:scale-110">
                  <FiPlay size={22} className="ml-0.5" />
                </span>
              </span>
            </button>
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center border border-charcoal/15 bg-plum-deep p-8 text-center">
              <span aria-hidden className="gold-rule-left mx-auto mb-5" />
              <p className="font-serif text-2xl text-ivory/90">Watch Wanda</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory/55">
                Video coming soon
              </p>
            </div>
          )}
        </Reveal>

        {videos.length > 1 && (
          <Reveal delay={0.15} className="mx-auto mt-8 max-w-4xl">
            <div className="grid gap-4 sm:grid-cols-2">
              {videos.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => play(v)}
                  aria-label={`Play video: ${v.title}`}
                  className="group flex items-center gap-4 border border-charcoal/15 bg-white p-3 text-left transition-colors hover:border-plum/50"
                >
                  <span className="relative block w-32 shrink-0 overflow-hidden">
                    <img
                      src={`https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      width={480}
                      height={360}
                      className="aspect-video w-full object-cover"
                    />
                    <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-plum-deeper/35 transition-colors group-hover:bg-plum-deeper/15">
                      <FiPlay size={18} className="text-ivory" />
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-serif text-lg text-charcoal">{v.title}</span>
                    <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                      Watch
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <AnimatePresence>
          {open && hasVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="fixed inset-0 z-[70] flex items-center justify-center bg-plum-deeper/85 p-4"
              onClick={close}
            >
              <motion.div
                id="wanda-video-dialog"
                role="dialog"
                aria-modal="true"
                aria-label={playing.title ? `Video: ${playing.title}` : 'Wanda Gordon video'}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="relative w-full max-w-4xl border border-sage/30 bg-plum-deeper"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close video"
                  className="absolute -top-11 right-0 p-2 text-ivory/80 transition-colors hover:text-sage"
                >
                  <FiX size={24} />
                </button>
                <div className="aspect-video w-full">
                  <iframe
                    title={playing.title ? `Wanda Gordon video: ${playing.title}` : 'Wanda Gordon video'}
                    src={embedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
