/**
 * media — "Watch Wanda" feature.
 * videoId empty → UI shows tasteful "Video coming soon" and
 * disables the modal. Embed uses youtube-nocookie, lazy iframe.
 */
export const media = {
  heading: 'Watch Wanda',
  videoId: 'wj274c7tO90',
  videoPlaceholder: 'COMING_SOON',
  thumbnail: '',
  thumbnailAlt: 'Wanda Gordon speaking on financial education',
  embedUrl: '',
};

export function getMediaEmbedUrl(videoId) {
  if (!videoId) return '';
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`;
}

export default media;
