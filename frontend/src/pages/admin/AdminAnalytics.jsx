import { useEffect, useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import api, { getErrorMessage } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDateTime } from '../../utils/format';
import { getEventBySlug } from '../../data/events';

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-ink-200 dark:border-white/10 bg-white dark:bg-ink-900/40 p-4">
      <p className="text-xs text-ink-500">{label}</p>
      <p className="font-display text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

const STATIC_PAGES = {
  '/': 'Home',
  '/about': 'About',
  '/contact': 'Contact',
};

function friendlyPageName(path) {
  if (!path) return '—';
  if (STATIC_PAGES[path]) return STATIC_PAGES[path];
  const match = path.match(/^\/events\/([^/?#]+)\/?$/);
  if (match) {
    const event = getEventBySlug(match[1]);
    return event?.title || match[1];
  }
  return path;
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/visitors/stats')
      .then((r) => setData(r.data.data))
      .catch((err) => setError(getErrorMessage(err, 'Failed to load analytics.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <p className="text-ink-500">{error || 'Failed to load analytics.'}</p>;

  const pages = (data.pages || []).map((p) => ({ name: friendlyPageName(p.name), count: p.count }));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Visitor Analytics</h1>
      <p className="text-sm text-ink-500 -mt-4">Human visits only — bots are counted separately below.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Total Visitors" value={data.total} />
        <StatCard label="Today" value={data.today} />
        <StatCard label="This Week" value={data.weekly} />
        <StatCard label="This Month" value={data.monthly} />
        <StatCard label="Bot Traffic" value={data.bots ?? 0} />
      </div>

      <div className="rounded-2xl border border-ink-200 dark:border-white/10 bg-white dark:bg-ink-900/40 p-4">
        <h2 className="font-semibold mb-4">Daily visits (30 days)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.dailyTrend}>
              <defs>
                <linearGradient id="vis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a6ff5" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#1a6ff5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#1a6ff5" fill="url(#vis)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { title: 'Browsers', rows: data.browsers.map((b) => ({ name: b.browser, count: b.count })) },
          { title: 'Operating Systems', rows: data.operatingSystems },
          { title: 'Devices', rows: data.devices },
        ].map((block) => (
          <div key={block.title} className="rounded-2xl border border-ink-200 dark:border-white/10 bg-white dark:bg-ink-900/40 p-4">
            <h2 className="font-semibold mb-4">{block.title}</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={block.rows}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0d9488" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-ink-200 dark:border-white/10 bg-white dark:bg-ink-900/40 p-4">
        <h2 className="font-semibold mb-4">Top pages</h2>
        {pages.length === 0 ? (
          <p className="text-sm text-ink-500">No page visits recorded yet.</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pages} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={130} />
                <Tooltip />
                <Bar dataKey="count" fill="#0d9488" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-ink-200 dark:border-white/10 bg-white dark:bg-ink-900/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 dark:bg-ink-900 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Page</th>
              <th className="p-3">Browser</th>
              <th className="p-3">OS</th>
              <th className="p-3">Device</th>
            </tr>
          </thead>
          <tbody>
            {data.recent.length === 0 ? (
              <tr>
                <td className="p-3 text-ink-500" colSpan={5}>No visits recorded yet.</td>
              </tr>
            ) : (
              data.recent.map((v) => (
                <tr key={v.id} className="border-t border-ink-100 dark:border-white/5">
                  <td className="p-3 whitespace-nowrap">{formatDateTime(v.created_at)}</td>
                  <td className="p-3">{friendlyPageName(v.page_visited)}</td>
                  <td className="p-3">{v.browser}</td>
                  <td className="p-3">{v.operating_system}</td>
                  <td className="p-3">{v.device_type}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
