import {
  FiBookOpen,
  FiCompass,
  FiMic,
  FiUsers,
  FiTrendingUp,
  FiSun,
} from 'react-icons/fi';

/**
 * services — "How Wanda Helps" flagship set.
 * Kept DB-compatible (title/description/display_order like the services
 * table) so this can move to /api/services later without UI changes.
 *
 * NOTE: avoid regulated-sounding claims such as "financial planning"
 * or "advice" unless Wanda confirms.
 */
export const services = [
  {
    id: 'financial-education',
    numeral: '01',
    // REVIEW COPY — Wanda: edit title + lines freely, keep the id stable.
    title: 'Financial Education',
    description:
      'Helping individuals understand money, saving, investing and building better financial habits.',
    expanded:
      'REVIEW COPY (draft): Sessions break down everyday money topics into clear, practical ideas you can act on.',
    icon: 'FiBookOpen',
    accent: 'plum',
    display_order: 1,
  },
  {
    id: 'financial-coaching',
    numeral: '02',
    // REVIEW COPY — Wanda: edit title + lines freely, keep the id stable.
    title: 'Financial Coaching',
    description:
      'Personal guidance to move from financial uncertainty toward clarity, confidence and intentional action.',
    expanded:
      'REVIEW COPY (draft): One-to-one conversations focused on your habits, goals and next steps.',
    icon: 'FiCompass',
    accent: 'citrine',
    display_order: 2,
  },
  {
    id: 'speaking-keynotes',
    numeral: '03',
    // REVIEW COPY — Wanda: edit title + lines freely, keep the id stable.
    title: 'Speaking & Keynotes',
    description:
      'Engaging talks for organizations, institutions, communities, conferences and events.',
    expanded:
      'REVIEW COPY (draft): Talks shaped around your audience, from student groups to professional gatherings.',
    icon: 'FiMic',
    accent: 'amber',
    display_order: 3,
  },
  {
    id: 'financial-workshops',
    numeral: '04',
    // REVIEW COPY — Wanda: edit title + lines freely, keep the id stable.
    title: 'Financial Workshops',
    description:
      'Interactive learning experiences around saving, investing, financial literacy and practical money management.',
    expanded:
      'REVIEW COPY (draft): Hands-on group sessions with discussion, exercises and take-home ideas.',
    icon: 'FiUsers',
    accent: 'charcoal',
    display_order: 4,
  },
  {
    id: 'wealth-investment-education',
    numeral: '05',
    // REVIEW COPY — Wanda: edit title + lines freely, keep the id stable.
    title: 'Wealth & Investment Education',
    description:
      'Making investment concepts easier to understand and building a stronger long-term wealth mindset.',
    expanded:
      'REVIEW COPY (draft): Educational walkthroughs of core investing ideas in plain language.',
    icon: 'FiTrendingUp',
    accent: 'crimson',
    display_order: 5,
  },
  {
    id: 'financial-empowerment',
    numeral: '06',
    // REVIEW COPY — Wanda: edit title + lines freely, keep the id stable.
    title: 'Financial Empowerment',
    description:
      'Building the knowledge and confidence to make more informed financial decisions.',
    expanded:
      'REVIEW COPY (draft): Encouragement and education that put you back in charge of your money story.',
    icon: 'FiSun',
    accent: 'cream',
    display_order: 6,
  },
];

export const serviceIcons = {
  FiBookOpen,
  FiCompass,
  FiMic,
  FiUsers,
  FiTrendingUp,
  FiSun,
};

/** About-section chips (thin-border, not pills). */
export const expertiseChips = [
  'Financial Education',
  'Financial Coaching',
  'Public Speaking',
  'Saving',
  'Investment Awareness',
  'Personal Finance',
];

/** Back-compat alias (AboutSection imports { expertiseChips } only). */
export const expertise = services;

export default services;
