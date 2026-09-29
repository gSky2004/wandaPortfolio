import { PLACEHOLDERS } from './siteConfig';

/**
 * events — Featured events. Only what was provided.
 * No dates, venues, or attendee numbers invented.
 * Detail route: /events/:slug (slug must be unique).
 */
export const events = [
  {
    id: 'from-saving-to-smart-investing',
    slug: 'from-saving-to-smart-investing',
    category: 'Financial Education Event',
    year: '2026',
    title: 'From Saving to Smart Investing',
    description:
      'An educational experience focused on helping participants understand the journey from simply saving money to making informed investment decisions.',
    image: '/events/wanda-event-feature.jpg',
    imagePlaceholder: PLACEHOLDERS.eventImage,
    imageAlt: 'Wanda Gordon at a financial education event',
    featured: true,
    // Rendered ONLY when non-empty on the detail page:
    gallery: [
      '/events/wanda-event-stage.jpg',
      '/events/wanda-event-session.jpg',
    ],
    videoId: '',
    topicsCovered: [],
    keyTakeaways: [],
    display_order: 1,
  },
];

export function getEventBySlug(slug) {
  return events.find((e) => e.slug === slug || e.id === slug) || null;
}

export default events;
