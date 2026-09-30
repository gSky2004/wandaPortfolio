import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { getEventBySlug } from '../data/events';
import { getMediaEmbedUrl } from '../data/media';
import { scrollToSection } from '../data/navLinks';

/**
 * Event detail — dynamic /events/:slug.
 * Detail hero + conditional blocks as a full page. Every block renders ONLY when
 * its data exists. Unknown slug → branded 404, never a crash.
 */
export default function EventDetail() {
  const { slug } = useParams();
  const event = getEventBySlug(slug || '');

  if (!event) {
    return (
      <div className="section-warm">
        <div className="container-editorial section-pad text-center">
          <p className="eyebrow mb-4">Events</p>
          <h1 className="heading-display text-4xl text-charcoal md:text-5xl">
            This event story isn&apos;t here yet.
          </h1>
          <div aria-hidden className="gold-rule mx-auto mt-6 max-w-[12rem]" />
          <p className="body-editorial mx-auto mt-6 text-charcoal/75">
            The link you followed doesn&apos;t match a published event.
          </p>
          <Link to="/" className="btn-primary mt-8">
            <FiArrowLeft /> Back Home
          </Link>
        </div>
      </div>
    );
  }

  const videoUrl = getMediaEmbedUrl(event.videoId);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Hero */}
      <div className="section-warm relative overflow-hidden">
        <div className="container-editorial relative pb-14 pt-20 md:pt-36">
          <Link
            to="/#events"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-charcoal/60 transition-colors hover:text-plum"
          >
            <FiArrowLeft /> All Events
          </Link>
          <p className="mt-8">
            <span className="inline-block rounded-[3px] bg-sand px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal">
              {event.category}{event.year ? ` · ${event.year}` : ''}
            </span>
            <span aria-hidden className="mt-3 block h-[2px] w-14 bg-peach" />
          </p>
          <h1 className="headline-editorial mt-4 max-w-[16ch] text-charcoal">
            {event.title}
          </h1>
          <div aria-hidden className="gold-rule-left mt-6" />
        </div>
      </div>

      {/* Hero image */}
      <div className="section-warm">
        <div className="container-editorial py-10 md:py-14">
          {event.image ? (
            <img
              src={event.image}
              alt={event.imageAlt || event.title}
              width={1200}
              height={675}
              className="aspect-[16/9] w-full border border-charcoal/10 object-cover"
            />
          ) : (
            <div className="flex aspect-[16/9] w-full flex-col items-center justify-center border border-charcoal/10 bg-plum-deep text-center">
              <div aria-hidden className="gold-rule-left mx-auto mb-4" />
              <p className="font-serif text-2xl text-ivory/90">{event.title}</p>
              <p className="mt-2 font-mono text-[11px] tracking-wider text-ivory/50">
                {event.imagePlaceholder}
              </p>
            </div>
          )}

          <p className="body-editorial mt-8 max-w-[68ch] text-lg text-charcoal/85">
            {event.description}
          </p>

          {event.gallery?.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {event.gallery.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt={`${event.title} gallery`}
                  loading="lazy"
                  className="aspect-[4/3] w-full border border-charcoal/10 object-cover"
                />
              ))}
            </div>
          )}

          {videoUrl && (
            <div className="mt-10 aspect-video w-full overflow-hidden border border-charcoal/10">
              <iframe
                title={`${event.title} video`}
                src={videoUrl}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}

          {event.topicsCovered?.length > 0 && (
            <div className="mt-12">
              <h2 className="heading-display text-2xl text-charcoal">Topics Covered</h2>
              <ul className="mt-4 divide-y divide-charcoal/10 border-y border-charcoal/10">
                {event.topicsCovered.map((t) => (
                  <li key={t} className="flex items-baseline gap-4 py-3">
                    <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-plum" />
                    <span className="text-charcoal/85">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {event.keyTakeaways?.length > 0 && (
            <div className="mt-12">
              <h2 className="heading-display text-2xl text-charcoal">Key Takeaways</h2>
              <ul className="mt-4 grid gap-4 md:grid-cols-2">
                {event.keyTakeaways.map((t) => (
                  <li key={t} className="card-surface p-5 text-charcoal/85">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-charcoal/10 pt-8">
            <button type="button" onClick={() => scrollToSection('speaking')} className="btn-primary group">
              Invite Wanda to Speak
              <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <Link to="/#events" className="btn-secondary">
              <FiArrowLeft /> Back to Events
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
