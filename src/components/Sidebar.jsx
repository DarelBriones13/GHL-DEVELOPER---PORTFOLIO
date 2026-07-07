import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin, FiPhone, FiMail, FiGlobe,
  FiGithub, FiLinkedin, FiFacebook,
  FiUser, FiLink, FiCode, FiTool, FiSettings, FiFileText,
} from 'react-icons/fi';
import { personalInfo, devMode, ghlMode } from '../data/portfolioData';
import { useMode } from '../context/ModeContext';
import ResumeModal from './ResumeModal';
import './Sidebar.css';

const DEV_SKILLS = [
  'Laravel / PHP', 'React.js', 'JavaScript', 'Python',
  'MySQL', 'Supabase', 'REST APIs', 'Git / GitHub',
  'HTML5 / CSS3', 'Flutter / Dart',
];

const GHL_SKILLS = [
  'GoHighLevel CRM', 'Workflow Automation', 'Email & SMS', 'Sales Funnels',
  'Google Workspace', 'Microsoft Office', 'Canva', 'Data Entry',
  'Lead Generation', 'SOP Creation', 'AI-assisted Work',
];

const DEV_TOOLS = ['VS Code', 'GitHub', 'Figma', 'Postman', 'Android Studio', 'Canva'];
const GHL_TOOLS = ['GoHighLevel', 'Google Workspace', 'Microsoft Office', 'Canva', 'ChatGPT', 'Zapier'];

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: 'easeOut' },
});

const SectionTitle = ({ icon: Icon, label }) => (
  <h3 className="sidebar__section-title">
    <Icon size={11} className="sidebar__section-icon" aria-hidden="true" />
    {label}
  </h3>
);

const Sidebar = () => {
  const { mode } = useMode();
  const [resumeOpen, setResumeOpen] = useState(false);

  const skills    = mode === 'dev' ? DEV_SKILLS : GHL_SKILLS;
  const tools     = mode === 'dev' ? DEV_TOOLS  : GHL_TOOLS;
  const SkillIcon = mode === 'dev' ? FiCode      : FiSettings;
  const skillLabel = mode === 'dev' ? 'Technical Skills' : 'GHL & VA Skills';
  const roleLabel  = mode === 'dev' ? 'Full-Stack Developer' : 'GHL Dev & Tech VA';

  return (
    <aside className="sidebar">
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />

      {/* Profile */}
      <motion.div className="sidebar__profile glass-card" {...fadeIn(0.05)}>
        <div className="sidebar__avatar-wrapper">
          <div className="sidebar__avatar">
            <img
              src="/assets/profile-pic.png"
              alt="Darel S. Briones"
              className="sidebar__avatar-img"
              onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback if image not found */}
            <div className="sidebar__avatar-placeholder" style={{ display: 'none' }}>DB</div>
            <svg className="sidebar__avatar-ring-svg" viewBox="0 0 96 96" fill="none" aria-hidden="true">
              <circle cx="48" cy="48" r="46"
                stroke="url(#ring-grad)" strokeWidth="2"
                strokeLinecap="round" strokeDasharray="180 110" />
              <defs>
                <linearGradient id="ring-grad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#0891B2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="sidebar__status">
            <span className="sidebar__status-dot" aria-hidden="true" />
            Available for work
          </div>
        </div>

        <h2 className="sidebar__name">
          Darel S. <span className="gradient-text">Briones</span>
        </h2>
        <p className="sidebar__title">
          GoHighLevel Developer &bull; Tech VA &bull; Web Developer
        </p>

        {/* Role badge swaps with mode */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`badge-${mode}`}
            className="sidebar__badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {roleLabel}
          </motion.span>
        </AnimatePresence>

        {/* View Resume button */}
        <button
          className="sidebar__resume-btn"
          onClick={() => setResumeOpen(true)}
        >
          <FiFileText size={13} aria-hidden="true" />
          View Resume
        </button>
      </motion.div>

      {/* Contact */}
      <motion.div className="sidebar__section glass-card" {...fadeIn(0.15)}>
        <SectionTitle icon={FiUser} label="Contact" />
        <ul className="sidebar__contact-list">
          <li className="sidebar__contact-item">
            <FiMapPin className="sidebar__contact-icon" aria-hidden="true" />
            <span>{personalInfo.location}</span>
          </li>
          <li className="sidebar__contact-item">
            <FiPhone className="sidebar__contact-icon" aria-hidden="true" />
            <a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a>
          </li>
          <li className="sidebar__contact-item">
            <FiMail className="sidebar__contact-icon" aria-hidden="true" />
            <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
          </li>
          <li className="sidebar__contact-item">
            <FiGlobe className="sidebar__contact-icon" aria-hidden="true" />
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">
              Portfolio Website
            </a>
          </li>
        </ul>
      </motion.div>

      {/* Quick Links */}
      <motion.div className="sidebar__section glass-card" {...fadeIn(0.25)}>
        <SectionTitle icon={FiLink} label="Quick Links" />
        <div className="sidebar__social-links">
          <a href={personalInfo.social.github}   target="_blank" rel="noopener noreferrer" className="sidebar__social-link">
            <FiGithub size={13} aria-hidden="true" /><span>GitHub</span>
          </a>
          <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="sidebar__social-link">
            <FiLinkedin size={13} aria-hidden="true" /><span>LinkedIn</span>
          </a>
          <a href={personalInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="sidebar__social-link">
            <FiFacebook size={13} aria-hidden="true" /><span>Facebook</span>
          </a>
          <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="sidebar__social-link">
            <FiGlobe size={13} aria-hidden="true" /><span>Portfolio</span>
          </a>
        </div>
      </motion.div>

      {/* Skills — swaps with mode */}
      <motion.div className="sidebar__section glass-card" {...fadeIn(0.35)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`skills-${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SectionTitle icon={SkillIcon} label={skillLabel} />
            <div className="sidebar__skills-grid">
              {skills.map(s => (
                <span key={s} className="sidebar__skill-tag">{s}</span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Tools — swaps with mode */}
      <motion.div className="sidebar__section glass-card" {...fadeIn(0.45)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`tools-${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SectionTitle icon={FiTool} label="Tools" />
            <div className="sidebar__tools-list">
              {tools.map(tool => (
                <div key={tool} className="sidebar__tool-item">
                  <span className="sidebar__tool-dot" aria-hidden="true" />
                  <span>{tool}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

    </aside>
  );
};

export default Sidebar;
