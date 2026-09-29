import { useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const empty = { quote: '', name: '', role: '', display_order: 0 };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  const load = () => api.get('/testimonials').then((r) => setItems(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, display_order: Number(form.display_order) || 0 };
    if (editingId) await api.put(`/testimonials/${editingId}`, payload);
    else await api.post('/testimonials', payload);
    setOpen(false);
    await load();
  };

  const remove = async (id) => {
    if (!confirm('Delete testimonial?')) return;
    await api.delete(`/testimonials/${id}`);
    await load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Testimonial Management</h1>
        <button type="button" className="btn-primary !py-2" onClick={() => { setEditingId(null); setForm(empty); setOpen(true); }}>
          <FiPlus /> Add
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-ink-200 dark:border-white/10 bg-white dark:bg-ink-900/40 p-4">
            <div className="flex justify-between gap-2">
              <div className="min-w-0">
                <p className="font-serif italic line-clamp-3">“{t.quote}”</p>
                <p className="text-xs text-ink-500 mt-2">{t.name}{t.role ? ` · ${t.role}` : ''}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => { setEditingId(t.id); setForm({ ...empty, ...t }); setOpen(true); }} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800" aria-label="Edit"><FiEdit2 /></button>
                <button type="button" onClick={() => remove(t.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50" aria-label="Delete"><FiTrash2 /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-ink-500 text-sm">No testimonials yet. Add the first one above.</p>}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4" onClick={() => setOpen(false)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white dark:bg-ink-900 p-6 space-y-3">
            <h2 className="font-display text-xl font-bold">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
            <textarea name="quote" required value={form.quote} onChange={onChange} placeholder="Quote — use only real quotes provided by the client" className="input-field" rows={4} />
            <input name="name" required value={form.name} onChange={onChange} placeholder="Full name" className="input-field" />
            <input name="role" value={form.role || ''} onChange={onChange} placeholder="Role, organization (optional)" className="input-field" />
            <input name="display_order" type="number" value={form.display_order} onChange={onChange} placeholder="display order" className="input-field" />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
