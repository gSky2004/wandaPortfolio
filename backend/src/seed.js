const bcrypt = require('bcryptjs');
const db = require('./config/db');
require('dotenv').config();

const experiences = [
  { title: 'Sample Timeline Entry — Replace Me', organization: 'Organization (placeholder)', description: 'Placeholder entry. Replace with real content once provided by the client.', type: 'Other', start_date: null, end_date: null, is_current: false, display_order: 1 },
  { title: 'Sample Timeline Entry 2 — Replace Me', organization: 'Organization (placeholder)', description: 'Placeholder entry. Replace with real content once provided by the client.', type: 'Other', start_date: null, end_date: null, is_current: false, display_order: 2 },
];

const services = [
  { title: 'Sample Service — Replace Me', description: 'Placeholder entry. Replace with real content once provided by the client.', icon: 'FaCode', display_order: 1 },
  { title: 'Sample Service 2 — Replace Me', description: 'Placeholder entry. Replace with real content once provided by the client.', icon: 'FaCode', display_order: 2 },
];

const testimonials = [
  { quote: 'Sample testimonial — replace with a real client quote once provided.', name: 'Sample Name', role: 'Sample Role', display_order: 1 },
  { quote: 'Sample testimonial 2 — replace with a real client quote once provided.', name: 'Sample Name', role: 'Sample Role', display_order: 2 },
];

const mediaItems = [
  { title: 'Sample Video — Replace Me', youtube_id: 'wj274c7tO90', description: 'Placeholder entry. Replace with real videos from Admin → Media.', display_order: 1 },
];

async function seed() {
  const email = (process.env.ADMIN_EMAIL || 'admin@portfolio.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const name = process.env.ADMIN_NAME || 'Admin';
  const hash = await bcrypt.hash(password, 12);

  await db.query(
    `INSERT INTO admins (name, email, password)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password = EXCLUDED.password`,
    [name, email, hash]
  );
  console.log(`Admin ready: ${email}`);

  const expCount = await db.query('SELECT COUNT(*)::int AS c FROM experiences');
  if (expCount.rows[0].c === 0) {
    for (const e of experiences) {
      await db.query(
        `INSERT INTO experiences (title, organization, description, type, start_date, end_date, is_current, display_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [e.title, e.organization, e.description, e.type, e.start_date, e.end_date, e.is_current, e.display_order]
      );
    }
    console.log(`Seeded ${experiences.length} experiences`);
  }

  const svcCount = await db.query('SELECT COUNT(*)::int AS c FROM services');
  if (svcCount.rows[0].c === 0) {
    for (const s of services) {
      await db.query(
        `INSERT INTO services (title, description, icon, display_order) VALUES ($1,$2,$3,$4)`,
        [s.title, s.description, s.icon, s.display_order]
      );
    }
    console.log(`Seeded ${services.length} services`);
  }

  const testiCount = await db.query('SELECT COUNT(*)::int AS c FROM testimonials');
  if (testiCount.rows[0].c === 0) {
    for (const t of testimonials) {
      await db.query(
        `INSERT INTO testimonials (quote, name, role, display_order) VALUES ($1,$2,$3,$4)`,
        [t.quote, t.name, t.role, t.display_order]
      );
    }
    console.log(`Seeded ${testimonials.length} testimonials`);
  }

  const mediaCount = await db.query('SELECT COUNT(*)::int AS c FROM media_items');
  if (mediaCount.rows[0].c === 0) {
    for (const m of mediaItems) {
      await db.query(
        `INSERT INTO media_items (title, youtube_id, description, display_order) VALUES ($1,$2,$3,$4)`,
        [m.title, m.youtube_id, m.description, m.display_order]
      );
    }
    console.log(`Seeded ${mediaItems.length} media items`);
  }

  await db.query(
    `INSERT INTO settings (key, value) VALUES
      ('site_name', 'Wanda Gordon'),
      ('headline', 'Financial Educator · Coach · Speaker'),
      ('bio', 'Placeholder bio. Replace with approved copy.'),
      ('email', ''),
      ('phone', ''),
      ('location', ''),
      ('github', ''),
      ('linkedin', ''),
      ('cv_url', '')
     ON CONFLICT (key) DO NOTHING`
  );

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
