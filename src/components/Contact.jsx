import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSend, FiMail, FiPhone, FiMapPin,
  FiGithub, FiLinkedin, FiFacebook,
  FiFileText, FiAlertCircle,
} from 'react-icons/fi';
import { personalInfo } from '../data/portfolioData';
import { useMode } from '../context/ModeContext';
import ResumeModal from './ResumeModal';
import Toast from './Toast';
import './Contact.css';

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/darelbriones13@gmail.com';

const contactDetails = [
  { Icon: FiMail,   label: 'Email',    value: personalInfo.email,    href: `mailto:${personalInfo.email}` },
  { Icon: FiPhone,  label: 'Phone',    value: personalInfo.phone,    href: `tel:${personalInfo.phone}` },
  { Icon: FiMapPin, label: 'Location', value: personalInfo.location, href: null },
];

const socialLinks = [
  { Icon: FiGithub,   label: 'GitHub',   href: personalInfo.social.github },
  { Icon: FiLinkedin, label: 'LinkedIn', href: personalInfo.social.linkedin },
  { Icon: FiFacebook, label: 'Facebook', href: personalInfo.social.facebook },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const EMPTY = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
  const { mode } = useMode();
  const [form, setForm]         = useState(EMPTY);
  const [status, setStatus]     = useState('idle'); // idle | loading | validation | error
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast]       = useState(false);  // controls the popup toast
  const [resumeOpen, setResumeOpen] = useState(false);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    setStatus('idle');

    /* Validation */
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('validation');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('validation');
      return;
    }

    setStatus('loading');

    try {
      const data = new FormData();
      data.append('name',    form.name.trim());
      data.append('email',   form.email.trim());
      data.append('subject', form.subject.trim() || 'Portfolio Contact Form');
      data.append('message', form.message.trim());
      data.append('_captcha',  'false');
      data.append('_template', 'table');
      data.append('_subject',  `Portfolio: ${form.subject.trim() || 'New message from ' + form.name.trim()}`);
      data.append('_replyto',  form.email.trim());

      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('idle');
        setForm(EMPTY);
        setToast(true);       // ← show the popup toast
      } else {
        const body = await res.text();
        throw new Error(`${res.status}: ${body}`);
      }
    } catch (err) {
      console.error('Contact error:', err.message);
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="contact section">
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />

      {/* ── Success toast popup ── */}
      <Toast
        show={toast}
        onClose={() => setToast(false)}
        message="I'll get back to you within 24 hours. Thank you for reaching out!"
      />

      <div className="container">
        <motion.div className="contact__header" {...fadeUp(0)}>
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">
            Let's Work <span className="gradient-text">Together</span>
          </h2>
          <p className="section-subtitle">
            Have a project in mind? I'd love to hear about it. Let's build something great.
          </p>
        </motion.div>

        <div className="contact__grid">

          {/* ── Info panel ── */}
          <motion.div {...fadeUp(0.1)}>
            <div className="contact__info-card glass-card">
              <h3 className="contact__info-title">Contact Information</h3>
              <p className="contact__info-desc">
                Feel free to reach out. I typically respond within 24 hours.
              </p>

              <div className="contact__details">
                {contactDetails.map(({ Icon, label, value, href }) => (
                  <div key={label} className="contact__detail">
                    <div className="contact__detail-icon" aria-hidden="true">
                      <Icon size={15} />
                    </div>
                    <div>
                      <p className="contact__detail-label">{label}</p>
                      {href
                        ? <a href={href} className="contact__detail-value">{value}</a>
                        : <p className="contact__detail-value">{value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>

              <button className="contact__resume-btn" onClick={() => setResumeOpen(true)}>
                <FiFileText size={14} aria-hidden="true" />
                View {mode === 'dev' ? 'Developer' : 'GHL & VA'} Resume
              </button>

              <p className="contact__social-label">Find me on</p>
              <div className="contact__social-links">
                {socialLinks.map(({ Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="contact__social-link" aria-label={label}>
                    <Icon size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Form ── */}
          <motion.div {...fadeUp(0.15)}>
            <form className="contact__form glass-card" onSubmit={handleSubmit} noValidate>

              <div className="contact__form-row">
                <div className="contact__field">
                  <label className="contact__label" htmlFor="c-name">
                    Full Name <span className="contact__required">*</span>
                  </label>
                  <input
                    id="c-name" name="name" type="text"
                    className="contact__input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>

                <div className="contact__field">
                  <label className="contact__label" htmlFor="c-email">
                    Email <span className="contact__required">*</span>
                  </label>
                  <input
                    id="c-email" name="email" type="email"
                    className="contact__input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="contact__field">
                <label className="contact__label" htmlFor="c-subject">Subject</label>
                <input
                  id="c-subject" name="subject" type="text"
                  className="contact__input"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="contact__field">
                <label className="contact__label" htmlFor="c-message">
                  Message <span className="contact__required">*</span>
                </label>
                <textarea
                  id="c-message" name="message"
                  className="contact__textarea"
                  placeholder="Tell me about your project..."
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              {/* Inline status — only for validation & errors (success uses toast) */}
              {status === 'validation' && (
                <motion.div
                  className="contact__status contact__status--error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <FiAlertCircle size={15} />
                  <span>Please fill in your name, a valid email, and a message.</span>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  className="contact__status contact__status--error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <FiAlertCircle size={15} />
                  <div>
                    <p>Failed to send. Please email me directly:</p>
                    <a href={`mailto:${personalInfo.email}`} className="contact__direct-link">
                      {personalInfo.email}
                    </a>
                    {errorMsg && (
                      <p className="contact__error-detail">{errorMsg}</p>
                    )}
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                className="contact__submit btn-primary"
                disabled={status === 'loading'}
              >
                {status === 'loading'
                  ? <><span className="contact__spinner" aria-hidden="true" /> Sending...</>
                  : <><FiSend size={14} aria-hidden="true" /> Send Message</>
                }
              </button>

              <p className="contact__powered">
                Powered by{' '}
                <a href="https://formsubmit.co" target="_blank" rel="noopener noreferrer">
                  FormSubmit
                </a>
                {' '}— no spam, no tracking.
              </p>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
