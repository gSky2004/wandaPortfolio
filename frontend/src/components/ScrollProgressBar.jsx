import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin sage scroll-progress bar under the navbar.
 * Transform-only (scaleX), mounted once in PublicLayout.
 */
export default function ScrollProgressBar() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <motion.div
        className="h-full origin-left bg-sage"
        style={{ scaleX: smooth }}
      />
    </div>
  );
}
