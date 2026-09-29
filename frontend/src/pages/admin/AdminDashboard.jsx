import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiMessageSquare, FiMic, FiUsers, FiVideo } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const cards = [
  { key: 'totalMessages', label: 'Messages', icon: FiMail, to: '/admin/messages', color: 'from-teal-500 to-teal-700' },
  { key: 'totalSpeaking', label: 'Speaking Invites', icon: FiMic, to: '/admin/messages', color: 'from-brand-500 to-brand-700' },
  { key: 'totalTestimonials', label: 'Testimonials', icon: FiMessageSquare, to: '/admin/testimonials', color: 'from-amber-500 to-amber-700' },
  { key: 'totalMedia', label: 'Media Videos', icon: FiVideo, to: '/admin/media', color: 'from-indigo-500 to-indigo-700' },
  { key: 'totalVisitors', label: 'Visitors', icon: FiUsers, to: '/admin/analytics', color: 'from-cyan-500 to-cyan-700' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/stats')
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const pending = (stats?.unreadMessages ?? 0) + (stats?.unreadSpeaking ?? 0);

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Dashboard Overview</h1>
      <p className="text-sm text-ink-500 mb-6">
        {pending > 0 ? `${pending} unread item(s) in your inbox` : 'Inbox all caught up'}
      </p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map(({ key, label, icon: Icon, to, color }) => (
          <Link key={key} to={to} className="rounded-2xl border border-ink-200 dark:border-white/10 bg-white dark:bg-ink-900/50 p-5 hover:shadow-soft transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-ink-500">{label}</p>
                <p className="font-display text-3xl font-bold mt-1">{stats?.[key] ?? 0}</p>
              </div>
              <div className={`rounded-xl bg-gradient-to-br ${color} p-3 text-white`}>
                <Icon size={20} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
