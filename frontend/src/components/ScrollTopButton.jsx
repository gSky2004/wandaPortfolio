import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

export default function ScrollTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 border border-sage bg-plum-deeper/90 p-3 text-sage shadow-[0_16px_32px_-12px_rgba(10,27,51,0.7)] backdrop-blur transition-colors hover:bg-sage hover:text-charcoal"
          aria-label="Scroll to top"
        >
          <FiArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
