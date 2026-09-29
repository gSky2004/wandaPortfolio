import SpeakingSection from '../components/SpeakingSection';
import ContactSection from '../components/ContactSection';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import RecognitionSection from '../components/RecognitionSection';
import ExpertiseSection from '../components/ExpertiseSection';
import EventsSection from '../components/EventsSection';
import MediaSection from '../components/MediaSection';
import TestimonialsSection from '../components/TestimonialsSection';
import SocialSection from '../components/SocialSection';
import CelebrationPopup from '../components/CelebrationPopup';

/**
 * Home scroll journey:
 * Hero → About → Recognition → Expertise → Events →
 * Speaking → Media → Testimonials → Social → Contact.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <RecognitionSection />
      <ExpertiseSection />
      <EventsSection />
      <SpeakingSection />
      <MediaSection />
      <TestimonialsSection />
      <SocialSection />
      <ContactSection />
      <CelebrationPopup />
    </>
  );
}
