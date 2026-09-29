import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollTopButton from '../components/ScrollTopButton';
import WhatsAppFloat from '../components/WhatsAppFloat';
import PageTransition from '../components/PageTransition';
import ScrollProgressBar from '../components/ScrollProgressBar';

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-ivory">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-sage focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-charcoal"
      >
        Skip to content
      </a>
      <div className="relative z-10 flex min-h-screen flex-col">
        <ScrollProgressBar />
        <Navbar />
        <main id="main-content" className="flex-1 pt-16 md:pt-20">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
        <ScrollTopButton />
        <WhatsAppFloat />
      </div>
    </div>
  );
}
