import { PLACEHOLDERS } from './siteConfig';

/**
 * socialLinks — TikTok, Instagram, Facebook, YouTube, WhatsApp.
 * Every URL is '' (empty) until you set a real one in .env or here.
 * UI rule: empty URL → card/icon renders disabled/hidden gracefully,
 * shows "@handle coming soon", never links to a fake URL.
 *
 * Env keys: VITE_TIKTOK_URL, VITE_INSTAGRAM_URL, VITE_FACEBOOK_URL,
 *           VITE_YOUTUBE_URL (WhatsApp number lives in siteConfig).
 */
const env = (key) => {
  try {
    return import.meta.env?.[key] || '';
  } catch {
    return '';
  }
};

function isRealUrl(url) {
  if (!url) return false;
  if (Object.values(PLACEHOLDERS).includes(url)) return false;
  return /^https?:\/\//i.test(url);
}

export const socialLinks = [
  {
    id: 'tiktok',
    platform: 'TikTok',
    url: env('VITE_TIKTOK_URL') || '',
    placeholder: PLACEHOLDERS.tiktok,
    handleLabel: '@handle coming soon',
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    url: env('VITE_INSTAGRAM_URL') || '',
    placeholder: PLACEHOLDERS.instagram,
    handleLabel: '@handle coming soon',
  },
  {
    id: 'facebook',
    platform: 'Facebook',
    url: env('VITE_FACEBOOK_URL') || '',
    placeholder: PLACEHOLDERS.facebook,
    handleLabel: 'Page coming soon',
  },
  {
    id: 'youtube',
    platform: 'YouTube',
    url: env('VITE_YOUTUBE_URL') || '',
    placeholder: PLACEHOLDERS.youtube,
    handleLabel: 'Channel coming soon',
  },
  {
    id: 'whatsapp',
    platform: 'WhatsApp',
    url: '',
    placeholder: PLACEHOLDERS.whatsapp,
    handleLabel: 'Number coming soon',
  },
];

export { isRealUrl };

export default socialLinks;
