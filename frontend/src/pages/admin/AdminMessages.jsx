import { useEffect, useState } from 'react';
import { FiCheck, FiSearch, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/format';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'contact', label: 'Messages' },
  { key: 'speaking', label: 'Speaking Invites' },
];

function SourceBadge({ source }) {
  const speaking = source === 'speaking';
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        speaking ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
      }`}
    >
      {speaking ? 'Speaking' : 'Message'}
    </span>
  );
}

export default function AdminMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);

  const load = (q = search, t = tab) => {
    const params = new URLSearchParams();
    if (q) params.set('search', q);
    if (t !== 'all') params.set('source', t);
    const qs = params.toString();
    return api.get(`/messages${qs ? `?${qs}` : ''}`).then((r) => setItems(r.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const switchTab = (t) => {
    setTab(t);
    setSelected(null);
    setLoading(true);
    load(search, t);
  };

  const markRead = async (id) => {
    await api.patch(`/messages/${id}/read`);
    await load();
    if (selected?.id === id) setSelected((s) => ({ ...s, is_read: true }));
  };

  const remove = async (id) => {
    if (!confirm('Delete message?')) return;
    await api.delete(`/messages/${id}`);
    if (selected?.id === id) setSelected(null);
    await load();
  };

  const openMessage = async (m) => {
    setSelected(m);
    if (!m.is_read) await markRead(m.id);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-4">Message Management</h1>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => switchTab(t.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              tab === t.key ? 'bg-brand-600 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="relative mb-4 max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          placeholder="Search messages..."
          className="input-field !pl-10"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {items.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => openMessage(m)}
                className={`w-full text-left rounded-2xl border p-4 transition ${
                  selected?.id === m.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
                    : 'border-ink-200 dark:border-white/10 bg-white dark:bg-ink-900/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{m.name} {!m.is_read && <span className="text-accent text-xs ml-1">NEW</span>}</p>
                    <p className="text-xs text-ink-500">{m.email}</p>
                  </div>
                  <p className="text-[11px] text-ink-400">{formatDate(m.created_at)}</p>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <SourceBadge source={m.source} />
                  <p className="text-sm truncate">{m.subject || '(No subject)'}</p>
                </div>
              </button>
            ))}
            {items.length === 0 && <p className="text-ink-500 text-sm">No messages yet.</p>}
          </div>

          <div className="rounded-2xl border border-ink-200 dark:border-white/10 bg-white dark:bg-ink-900/40 p-5 min-h-[20rem]">
            {selected ? (
              <>
                <div className="flex justify-between gap-2 mb-4">
                  <div>
                    <div className="mb-1"><SourceBadge source={selected.source} /></div>
                    <h2 className="font-display text-xl font-bold">{selected.subject || 'Message'}</h2>
                    <p className="text-sm text-ink-500">{selected.name} · {selected.email}</p>
                    {selected.phone && (
                      <p className="text-sm text-ink-500 mt-1">
                        WhatsApp:{' '}
                        <a href={`tel:${selected.phone.replace(/\s/g, '')}`} className="text-brand-600 hover:underline">
                          {selected.phone}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {!selected.is_read && (
                      <button type="button" onClick={() => markRead(selected.id)} className="p-2 rounded-lg hover:bg-ink-100" title="Mark read"><FiCheck /></button>
                    )}
                    <button type="button" onClick={() => remove(selected.id)} className="p-2 rounded-lg text-red-500" title="Delete"><FiTrash2 /></button>
                  </div>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </>
            ) : (
              <p className="text-ink-500 text-sm">Select a message to read.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
