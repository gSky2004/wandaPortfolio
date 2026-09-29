import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToSection } from '../data/navLinks';

/**
 * Scroll to top on route change, or to a hash target when navigating to /#section.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      let attempts = 0;
      const tryScroll = () => {
        if (scrollToSection(id) || attempts > 40) return;
        attempts += 1;
        requestAnimationFrame(tryScroll);
      };
      const t = setTimeout(tryScroll, 40);
      return () => clearTimeout(t);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return undefined;
  }, [pathname, hash]);

  return null;
}
