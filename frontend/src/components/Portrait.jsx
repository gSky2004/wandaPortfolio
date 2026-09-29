import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { siteConfig } from '../data/siteConfig';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Editorial portrait — sharp rectangle, thin gold offset frame,
 * vertical rule + caption. Shared by Hero + About so swapping
 * the photo is a one-line data change.
 * New component (justified): no existing image component existed
 * (raw <img> tags everywhere); this centralises aspect,
 * object-position, placeholder and mask-reveal behaviour.
 */
export default function Portrait({
  className = '',
  aspect = 'aspect-[3/4]',
  caption = 'WANDA GORDON — FINANCIAL EDUCATOR',
  withParallax = false,
  tone = 'dark',
  src: srcOverride,
  objectPosition: objectPositionOverride,
  priority = false,
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { src: siteSrc, alt, objectPosition: sitePosition, placeholderLabel } = siteConfig.portrait;
  const src = srcOverride || siteSrc;
  const objectPosition = objectPositionOverride || sitePosition;
  const hasImage = Boolean(src);
  const finePointer =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: fine)').matches;

  const ratio = (aspect.match(/(\d+)\s*\/\s*(\d+)/) || []).slice(1).map(Number);
  const intrinsicW = 720;
  const intrinsicH = ratio.length === 2 && ratio[1] ? Math.round((720 * ratio[1]) / ratio[0]) : 960;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Subtle drift: max ~24px, hero only, fine pointers only.
  const drift = withParallax && !reduce && finePointer ? 24 : 0;
  const y = useTransform(scrollYProgress, [0, 1], [0, drift]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* offset gold outline frame */}
      <div
        aria-hidden
        className="absolute -inset-0 translate-x-4 translate-y-4 border border-sage/50"
      />
      <motion.div
        initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)', opacity: 0.4 }}
        animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
        style={withParallax ? { y } : undefined}
        className={`relative ${aspect} overflow-hidden bg-sand`}
      >
        {hasImage ? (
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            width={intrinsicW}
            height={intrinsicH}
            style={{ objectPosition }}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 border border-charcoal/10 bg-white p-8 text-center">
            <div className="gold-rule-left" aria-hidden />
            <p className="font-serif text-2xl text-charcoal">Wanda Gordon</p>
            <p className="max-w-[26ch] font-mono text-[11px] leading-relaxed tracking-wider text-charcoal/55">
              {placeholderLabel}
            </p>
          </div>
        )}
        {/* legibility shade only over real photos, never the placeholder */}
        {hasImage && (
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-plum-deeper/60 to-transparent" />
        )}
      </motion.div>

      <div className="mt-5 flex items-stretch gap-3">
        <div aria-hidden className="w-px bg-sage/70" />
        <p
          className={`py-0.5 text-[11px] font-semibold uppercase tracking-[0.24em] ${
            tone === 'light' ? 'text-charcoal/60' : 'text-ivory/60'
          }`}
        >
          {caption}
        </p>
      </div>
    </div>
  );
}
