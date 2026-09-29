/**
 * achievements — Recognition timeline.
 * ONLY verified credentials. No invented descriptions/issuers/dates.
 * DB-compatible with the experiences table (title/type/display_order).
 */
export const achievements = [
  {
    id: 'most-influential-2026',
    year: '2026',
    title: 'Most Influential Woman of the Year',
    type: 'Recognition',
    display_order: 1,
  },
  {
    id: 'multi-award-cfe',
    year: '',
    title: 'Multi-Award Winning Certified Financial Educator',
    type: 'Certification',
    display_order: 2,
  },
  {
    id: 'bot-cfe',
    year: '',
    title: 'BOT CFE',
    type: 'Certification',
    display_order: 3,
  },
  {
    id: 'dse-cersit',
    year: '',
    title: 'DSE CerSIT',
    type: 'Certification',
    display_order: 4,
  },
];

export default achievements;

/**
 * celebration — inline moment below the timeline. All copy editable
 * here; JSX renders headline + name only. No new claims.
 */
export const celebration = {
  eyebrow: 'Celebrating',
  headline: 'Congratulations,',
  name: 'Miss Wanda Gordon',
};
