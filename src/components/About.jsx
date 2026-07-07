import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCode, FiSmartphone, FiDatabase, FiCpu, FiZap,
  FiSettings, FiCalendar, FiFileText,
  FiMapPin, FiBookOpen, FiBriefcase, FiMessageSquare,
} from 'react-icons/fi';
import { about, personalInfo, internship, devMode, ghlMode } from '../data/portfolioData';
import { useMode } from '../context/ModeContext';
import './About.css';

const devHighlights = [
  { icon: FiCode,       title: 'Full-Stack Development',   desc: 'End-to-end web apps with Laravel, React, and modern frameworks.' },
  { icon: FiSmartphone, title: 'Mobile Development',       desc: 'Cross-platform mobile apps with Flutter and Dart.' },
  { icon: FiDatabase,   title: 'Database Design',          desc: 'MySQL, PostgreSQL, and Supabase for optimized data architecture.' },
  { icon: FiCpu,        title: 'AI Integration',           desc: 'Groq API, NLP, and AI chatbots for intelligent systems.' },
  { icon: FiZap,        title: 'Performance & Optimization', desc: 'Fast, scalable solutions with clean, maintainable code.' },
];

const ghlHighlights = [
  { icon: FiSettings,  title: 'GoHighLevel CRM',         desc: 'Complete CRM setup, pipelines, and contact management.' },
  { icon: FiZap,       title: 'Workflow Automation',     desc: 'Email, SMS, and trigger-based automation workflows.' },
  { icon: FiCode,      title: 'Funnels & Landing Pages', desc: 'High-converting sales funnels and lead capture pages.' },
  { icon: FiCalendar,  title: 'Calendar & Appointments', desc: 'Booking systems, reminders, and scheduling automation.' },
  { icon: FiFileText,  title: 'Snapshots & Onboarding',  desc: 'Reusable GHL snapshots and client onboarding systems.' },
];

const quickFacts = [
  { icon: FiMapPin,        label: 'Location',  value: 'Gingoog City, Misamis Oriental' },
  { icon: FiBookOpen,      label: 'Education', value: 'BS Information Technology' },
  { icon: FiBriefcase,     label: 'Status',    value: 'Available for Work', highlight: true },
  { icon: FiMessageSquare, label: 'Languages', value: 'Filipino, English' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const About = () => {
  const { mode } = useMode();
  const highlights = mode === 'dev' ? devHighlights : ghlHighlights;

  return (
    <section id="about" className="about section">
      <div className="container">

        {/* ── Section header ── */}
        <motion.div className="about__header" {...fadeUp(0)}>
          <span className="section-label">About Me</span>
          <h2 className="section-title">
            Passionate About <span className="gradient-text">Building Solutions</span>
          </h2>
          <p className="section-subtitle">
            GoHighLevel Developer, Technical VA, and Full-Stack Web Developer from the Philippines.
          </p>
        </motion.div>

        {/* ── Top: full-width bio ── */}
        <motion.div className="about__bio glass-card" {...fadeUp(0.1)}>
          <div className="about__bio-paragraphs">
            {about.split('\n\n').map((para, i) => (
              <p key={i} className="about__paragraph">{para}</p>
            ))}
          </div>

          {/* Quick facts in a horizontal row */}
          <div className="about__facts-row">
            {quickFacts.map(({ icon: Icon, label, value, highlight }) => (
              <div key={label} className="about__fact">
                <Icon size={13} className="about__fact-icon" aria-hidden="true" />
                <div>
                  <span className="about__fact-label">{label}</span>
                  <span className={`about__fact-value${highlight ? ' about__fact-value--available' : ''}`}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom: two columns ── */}
        <div className="about__bottom">

          {/* Left: skills/highlights — swaps with mode */}
          <div className="about__highlights-col">
            <motion.h3 className="about__col-title" {...fadeUp(0.15)}>
              {mode === 'dev' ? 'What I Do' : 'My Services'}
            </motion.h3>
            <AnimatePresence mode="wait">
              <motion.div
                key={`highlights-${mode}`}
                className="about__highlights-list"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {highlights.map(({ icon: Icon, title, desc }, i) => (
                  <motion.div key={title} className="about__highlight-card glass-card" {...fadeUp(0.05 * i + 0.2)}>
                    <div className="about__highlight-icon" aria-hidden="true">
                      <Icon size={15} />
                    </div>
                    <div>
                      <h4 className="about__highlight-title">{title}</h4>
                      <p className="about__highlight-desc">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: internship experience */}
          <div className="about__exp-col">
            <motion.h3 className="about__col-title" {...fadeUp(0.15)}>
              Internship Experience
            </motion.h3>
            <motion.div className="about__internship glass-card" {...fadeUp(0.2)}>
              <div className="about__internship-role">
                <div className="about__internship-icon" aria-hidden="true">
                  <FiBriefcase size={16} />
                </div>
                <div>
                  <p className="about__internship-title">{internship.title}</p>
                  <p className="about__internship-company">{internship.company}</p>
                  <span className="about__internship-period">{internship.period}</span>
                </div>
              </div>
              <p className="about__internship-desc">{internship.description}</p>
              <ul className="about__internship-list">
                {internship.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
