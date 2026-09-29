/**
 * Single place to swap placeholders for real values.
 * Replace the PLACEHOLDER_* strings — no UI code changes needed.
 * Social / WhatsApp URLs may also come from Vite env (.env):
 *   VITE_TIKTOK_URL, VITE_INSTAGRAM_URL, VITE_FACEBOOK_URL,
 *   VITE_YOUTUBE_URL, VITE_WHATSAPP_NUMBER, VITE_CONTACT_EMAIL
 */
export const PLACEHOLDERS = {
  portrait: 'PLACEHOLDER_WANDA_PORTRAIT',
  whatsapp: 'PLACEHOLDER_WHATSAPP',
  tiktok: 'PLACEHOLDER_TIKTOK',
  instagram: 'PLACEHOLDER_INSTAGRAM',
  facebook: 'PLACEHOLDER_FACEBOOK',
  youtube: 'PLACEHOLDER_YOUTUBE',
  eventImage: 'PLACEHOLDER_EVENT_IMAGE',
};

const env = (key) => {
  try {
    return import.meta.env?.[key] || '';
  } catch {
    return '';
  }
};

export const siteConfig = {
  name: 'Wanda Gordon',
  firstName: 'Wanda',
  lastName: 'Gordon',
  tagline: 'Financial Educator · Financial Coach · Speaker',
  heroHeadline: 'Build Wealth With Clarity.',
  heroHeadlineAccent: 'Clarity.',
  heroText:
    'Empowering individuals with practical financial knowledge, smarter money habits and investment awareness for a stronger financial future.',
  // Empty string = disabled gracefully in UI (no fake links).
  whatsappNumber: env('VITE_WHATSAPP_NUMBER') || '255675029833',
  whatsappPlaceholder: PLACEHOLDERS.whatsapp,
  email: env('VITE_CONTACT_EMAIL') || '',
  emailPlaceholder: 'Email coming soon',
  portrait: {
    src: '/wanda-portrait.jpg',
    placeholderLabel: 'ADD PORTRAIT: /src/assets/wanda-portrait.jpg',
    alt: 'Portrait of Wanda Gordon',
    // Tune so her face is never cropped:
    objectPosition: 'center 15%',
  },
  seo: {
    title: 'Wanda Gordon — Financial Educator · Coach · Speaker',
    description:
      'Wanda Gordon is a Multi-Award Winning Certified Financial Educator, Financial Coach and Speaker helping people build wealth with clarity.',
    canonical: 'https://wandagordon.example.com/',
  },
};

export function buildWhatsAppLink(number, text = 'Hello Wanda, I would like to connect.') {
  const clean = (number || '').replace(/[^\d]/g, '');
  if (!clean || clean === PLACEHOLDERS.whatsapp) return '';
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

/** Footer ambient line (editable copy, rendered above the columns). */
export const footerAmbient = {
  heading: 'Stay With Us',
};

export default siteConfig;
