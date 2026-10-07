import { FaWhatsapp } from 'react-icons/fa';
import { siteConfig, buildWhatsAppLink } from '../data/siteConfig';

/**
 * Sticky mobile WhatsApp action — renders ONLY when a number is
 * configured. Empty placeholder → nothing in the DOM.
 */
export default function WhatsAppFloat() {
  const link = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    'Hello Wanda, I found you online and would like to connect.'
  );
  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Wanda on WhatsApp"
      className="fixed bottom-6 left-6 z-40 flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-sage bg-plum-deeper/90 p-3.5 text-sage shadow-[0_16px_32px_-12px_rgba(10,27,51,0.7)] backdrop-blur transition-colors hover:bg-sage hover:text-charcoal md:hidden"
    >
      <FaWhatsapp size={22} />
    </a>
  );
}
