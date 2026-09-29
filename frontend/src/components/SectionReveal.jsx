import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Shared scroll-reveal system: luxury easing, 0.55s reveals,
 * 80ms staggers, once-only viewport triggers. Under
 * prefers-reduced-motion everything collapses to a short fade
 * (no slides), so all sections behave identically.
 */
function useRevealVariants() {
  const reduce = useReducedMotion();
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.3 } },
    };
  }
  return {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE },
    },
  };
}

export function Reveal({ children, className = '', delay = 0 }) {
  const variants = useRevealVariants();
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={reduce ? undefined : { delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: {},
        show: {
          transition: reduce
            ? { duration: 0.01 }
            : { staggerChildren: 0.08, delayChildren: 0.06 },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', style }) {
  const variants = useRevealVariants();
  return (
    <motion.div variants={variants} className={className} style={style}>
      {children}
    </motion.div>
  );
}
