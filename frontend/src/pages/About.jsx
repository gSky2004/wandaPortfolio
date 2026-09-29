import AboutSection from '../components/AboutSection';
import RecognitionSection from '../components/RecognitionSection';

/**
 * Dedicated /about route — reuses the same data-driven sections
 * as the Home scroll so copy never drifts between the two.
 */
export default function About() {
  return (
    <>
      <h1 className="sr-only">About Wanda Gordon — Financial Educator, Coach and Speaker</h1>
      <AboutSection />
      <RecognitionSection />
    </>
  );
}
