import { useEffect, useState } from 'react';
import api from '../services/api';
import speakingTopics, { eventTypes } from '../data/speakingTopics';

/**
 * Speaking inquiry form — reuses the Contact form's controlled-state +
 * POST /messages + inline-status architecture, extended with
 * Organization / Event type / Topic / Date fields.
 * Backend unchanged: extras are packed into subject/message so the
 * existing express-validator (name/email/message) still passes and
 * the admin inbox keeps working with zero migration.
 */
export default function SpeakingInquiryForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    eventType: eventTypes[0],
    topic: speakingTopics[0],
    eventDate: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  // Preselect support: "Discuss this topic →" on a service card
  // dispatches wanda:service-interest; prefill the message once.
  useEffect(() => {
    const onInterest = (e) => {
      const title = e.detail?.title;
      if (!title) return;
      setForm((f) =>
        f.message.trim()
          ? f
          : { ...f, message: `Hello Wanda, I'd like to discuss: ${title}. ` }
      );
      document.getElementById('sp-message')?.focus({ preventScroll: true });
    };
    window.addEventListener('wanda:service-interest', onInterest);
    return () => window.removeEventListener('wanda:service-interest', onInterest);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'Please share your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      er.email = 'Please enter a valid email.';
    if (form.phone.trim() && !/^\+?[0-9\s\-()]{7,20}$/.test(form.phone.trim()))
      er.phone = 'Please enter a valid WhatsApp number.';
    if (!form.message.trim()) er.message = 'Please tell Wanda about your event.';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    if (!validate()) return;
    setSending(true);
    try {
      const subject = `[${form.eventType}] ${form.organization.trim() || 'Speaking inquiry'} — ${form.topic}`;
      const meta = [
        `Organization: ${form.organization.trim() || '—'}`,
        `Event type: ${form.eventType}`,
        `Preferred topic: ${form.topic}`,
        `Event date: ${form.eventDate || 'Flexible'}`,
      ].join('\n');
      await api.post('/messages', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject,
        message: `${form.message.trim()}\n\n---\n${meta}`,
        source: 'speaking',
      });
      setStatus({
        type: 'ok',
        text: 'Thank you — your speaking inquiry has been received. Wanda will respond soon.',
      });
      setForm({
        name: '',
        email: '',
        phone: '',
        organization: '',
        eventType: eventTypes[0],
        topic: speakingTopics[0],
        eventDate: '',
        message: '',
      });
    } catch (err) {
      setStatus({
        type: 'err',
        text: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  const fieldErr = (name) =>
    errors[name] ? <p className="mt-1 text-xs text-red-600">{errors[name]}</p> : null;

  return (
    <form
      id="speaking-form"
      onSubmit={onSubmit}
      noValidate
      className="scroll-mt-24 border border-charcoal/15 bg-white p-6 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70" htmlFor="sp-name">
            Name
          </label>
          <input id="sp-name" name="name" value={form.name} onChange={onChange} className="input-field" placeholder="Your full name" autoComplete="name" />
          {fieldErr('name')}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70" htmlFor="sp-email">
            Email
          </label>
          <input id="sp-email" name="email" type="email" value={form.email} onChange={onChange} className="input-field" placeholder="you@email.com" autoComplete="email" />
          {fieldErr('email')}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70" htmlFor="sp-phone">
          WhatsApp number <span className="font-normal normal-case tracking-normal opacity-70">(optional — so Wanda can reach you faster)</span>
        </label>
        <input id="sp-phone" name="phone" type="tel" value={form.phone} onChange={onChange} className="input-field" placeholder="+255 ..." autoComplete="tel" />
        {fieldErr('phone')}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70" htmlFor="sp-org">
            Organization
          </label>
          <input id="sp-org" name="organization" value={form.organization} onChange={onChange} className="input-field" placeholder="Company, school, community" autoComplete="organization" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70" htmlFor="sp-date">
            Event date <span className="font-normal normal-case tracking-normal opacity-70">(optional)</span>
          </label>
          <input id="sp-date" name="eventDate" type="date" value={form.eventDate} onChange={onChange} className="input-field" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70" htmlFor="sp-type">
            Event type
          </label>
          <select id="sp-type" name="eventType" value={form.eventType} onChange={onChange} className="input-field">
            {eventTypes.map((t) => (
              <option key={t} value={t} className="text-charcoal">{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70" htmlFor="sp-topic">
            Preferred topic
          </label>
          <select id="sp-topic" name="topic" value={form.topic} onChange={onChange} className="input-field">
            {speakingTopics.map((t) => (
              <option key={t} value={t} className="text-charcoal">{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70" htmlFor="sp-message">
          Message
        </label>
        <textarea id="sp-message" name="message" rows={5} value={form.message} onChange={onChange} className="input-field resize-y" placeholder="Tell Wanda about your event, audience and goals..." />
        {fieldErr('message')}
      </div>

      {status.text && (
        <p role="status" className={`mt-4 text-sm ${status.type === 'ok' ? 'text-plum-deep' : 'text-red-600'}`}>
          {status.text}
        </p>
      )}

      <button type="submit" disabled={sending} className="btn-primary mt-6 w-full disabled:opacity-60 sm:w-auto">
        {sending ? 'Sending...' : 'Invite Wanda to Speak'}
      </button>
    </form>
  );
}
