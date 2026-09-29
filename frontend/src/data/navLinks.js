/**
 * navLinks — single source for Navbar, mobile menu, footer.
 * `id` must match a <section id="..."> on the home scroll page.
 * Shape is scroll-spy compatible with the existing Navbar
 * (IntersectionObserver over ids).
 */
export const navLinks = [
  { id: 'about', label: 'About', route: '/#about' },
  { id: 'expertise', label: 'Expertise', route: '/#expertise' },
  { id: 'events', label: 'Events', route: '/#events' },
  { id: 'speaking', label: 'Speaking', route: '/#speaking' },
  { id: 'media', label: 'Media', route: '/#media' },
  { id: 'contact', label: 'Contact', route: '/#contact' },
];

export const NAV_OFFSET = 72;

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
  return true;
}

export default navLinks;
