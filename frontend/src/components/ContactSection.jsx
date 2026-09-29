import { useState } from 'react';
import { FiArrowUpRight, FiMessageCircle, FiSend } from 'react-icons/fi';
import { Reveal } from './SectionReveal';
import api from '../services/api';
import { siteConfig, buildWhatsAppLink } from '../data/siteConfig';
import { scrollToSection } from '../data/navLinks';

/**
 * Contact / CTA — reuses the original Contact page's form +
 * POST /messages validation/API integration unchanged,
 * restyled to editorial with the three-way CTA row.
 */
export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const waLink = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    'Hello Wanda, I would like to start a conversation.'
  );

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
    if (!form.message.trim()) er.message = 'Please write your message.';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    if (!validate()) return;
    setSending(true);
    try {
      await api.post('/messages', {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || null,
        message: form.message.trim(),
        source: 'contact',
      });
      setStatus({ type: 'ok', text: 'Message sent. Wanda will get back to you soon.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'err',
        text: err.response?.data?.message || 'Failed to send message. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" aria-label="Contact" className="section-light scroll-mt-20">
      <div className="container-editorial section-pad">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-4">Contact</p>
          <h2 className="heading-display text-3xl text-charcoal sm:text-4xl md:text-5xl">
            Let&apos;s Start the Conversation.
          </h2>
          <p className="body-editorial mt-4 text-charcoal/75">
            Looking for a financial educator, coach or speaker for your next
            event, organization or community?
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-8 flex flex-wrap gap-3">
          {waLink ? (
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary group">
              <FiMessageCircle /> WhatsApp Wanda
              <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : (
            <button
              type="button"
              title="Go to the inquiry form"
              onClick={() => {
                scrollToSection('contact-form');
                setTimeout(() => document.getElementById('ct-name')?.focus({ preventScroll: true }), 600);
              }}
              className="btn-primary group"
            >
              <FiMessageCircle /> WhatsApp Wanda
              <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          )}
          <button type="button" onClick={() => scrollToSection('speaking-form')} className="btn-secondary">
            Invite Wanda to Speak
          </button>
        </Reveal>

        <Reveal delay={0.12} className="mt-10">
          <form
            id="contact-form"
            onSubmit={onSubmit}
            noValidate
            className="scroll-mt-24 border border-charcoal/15 bg-white p-6 md:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70" htmlFor="ct-name">
                  Name
                </label>
                <input id="ct-name" name="name" value={form.name} onChange={onChange} className="input-field" placeholder="Your name" autoComplete="name" />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70" htmlFor="ct-email">
                  Email
                </label>
                <input id="ct-email" name="email" type="email" value={form.email} onChange={onChange} className="input-field" placeholder="you@email.com" autoComplete="email" />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70" htmlFor="ct-subject">
                Subject <span className="font-normal normal-case tracking-normal opacity-70">(optional)</span>
              </label>
              <input id="ct-subject" name="subject" value={form.subject} onChange={onChange} className="input-field" placeholder="What is this about?" />
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70" htmlFor="ct-message">
                Message
              </label>
              <textarea id="ct-message" name="message" rows={5} value={form.message} onChange={onChange} className="input-field resize-y" placeholder="Write your inquiry..." />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>

            {status.text && (
              <p role="status" className={`mt-4 text-sm ${status.type === 'ok' ? 'text-plum' : 'text-red-600'}`}>
                {status.text}
              </p>
            )}

            <button type="submit" disabled={sending} className="btn-primary mt-6 w-full disabled:opacity-60 sm:w-auto">
              <FiSend /> {sending ? 'Sending...' : 'Send an Inquiry'}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
