import ContactSection from '../components/ContactSection';

/**
 * Dedicated /contact route — shares the Home scroll's
 * ContactSection so copy and validation never drift.
 */
export default function Contact() {
  return (
    <>
      <h1 className="sr-only">Contact Wanda Gordon — Financial Educator, Coach and Speaker</h1>
      <ContactSection />
    </>
  );
}
