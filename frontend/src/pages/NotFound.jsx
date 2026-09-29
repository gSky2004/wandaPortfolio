import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navLinks } from '../data/navLinks';

const EASE = [0.22, 1, 0.36, 1];

export default function NotFound() {
  return (
    <section className="section-light section-pad relative overflow-hidden">
      <span className="ghost-numeral" aria-hidden="true">
        404
      </span>

      <div className="container-editorial relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="max-w-2xl"
        >
          <p className="eyebrow mb-4">Page not found</p>
          <h1 className="heading-display text-[clamp(2.5rem,6vw,4.25rem)] text-charcoal mb-6">
            This page has moved on.
          </h1>
          <p className="body-editorial text-[17px] text-charcoal/75 mb-10">
            The link you followed does not exist any more. Try one of the sections below, or head back to
            the beginning.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/" className="btn-primary">
              Back to home
            </Link>
            <Link to="/#contact" className="btn-secondary">
              Get in touch
            </Link>
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-3">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link to={link.route} className="link-underline text-sm text-charcoal/70">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
