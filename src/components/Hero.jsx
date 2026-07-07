import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiArrowRight, FiGithub, FiLinkedin, FiZap, FiBox, FiCpu } from 'react-icons/fi';
import { personalInfo, devMode, ghlMode } from '../data/portfolioData';
import { scrollTo } from '../utils/scrollTo';
import { useTypewriter } from '../hooks/useTypewriter';
import { useMode } from '../context/ModeContext';
import ModeToggle from './ModeToggle';
import ResumeModal from './ResumeModal';
import './Hero.css';

const HERO_BG     = '/assets/hero-background.png';
const PROFILE_PIC = '/assets/profile-pic.png';

const Hero = () => {
  const { mode } = useMode();
  const data  = mode === 'dev' ? devMode : ghlMode;
  const typed = useTypewriter(data.heroSubtitles);
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <section id="hero" className="hero">

      {/* Resume modal */}
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />

      {/* Hero background image */}
      <div
        className="hero__bg-image"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-hidden="true"
      />

      {/* Blobs + dot grid */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__grid" />
      </div>

      <div className="hero__container">

        {/* ── Left: text ── */}
        <div className="hero__content">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <ModeToggle />
          </motion.div>

          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <span className="hero__badge-dot" />
            <span>Open to opportunities</span>
          </motion.div>

          <motion.h1
            className="hero__heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            Hi, I'm{' '}
            <span className="gradient-text">Darel S. Briones</span>
          </motion.h1>

          {/* Typewriter subtitle — no AnimatePresence to avoid flicker */}
          <motion.div
            className="hero__subtitle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <span className="hero__type-text">{typed}</span>
            <span className="hero__cursor" aria-hidden="true">|</span>
          </motion.div>

          {/* Description — no AnimatePresence */}
          <motion.p
            className="hero__description"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {data.heroIntro}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
          >
            <button className="btn-primary" onClick={() => setResumeOpen(true)}>
              <FiFileText size={14} /> View Resume
            </button>
            <button className="btn-secondary" onClick={() => scrollTo('contact')}>
              Contact Me <FiArrowRight size={14} />
            </button>
          </motion.div>

          <motion.div
            className="hero__social"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <a href={personalInfo.social.github}   target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="GitHub"><FiGithub size={16} /></a>
            <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="LinkedIn"><FiLinkedin size={16} /></a>
            <div className="hero__social-divider" />
            <span className="hero__social-label">Follow me</span>
          </motion.div>
        </div>

        {/* ── Right: card cluster ── */}
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
        >
          <div className="hero__card-wrapper">

            <div className="hero__main-card glass-card">
              <div className="hero__card-avatar">
                <img
                  src={PROFILE_PIC}
                  alt="Darel S. Briones"
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                <span className="hero__card-avatar-fallback">DB</span>
              </div>
              <div className="hero__card-info">
                <h3>Darel S. Briones</h3>
                <p>{mode === 'dev' ? 'Full-Stack Developer' : 'GHL Developer & VA'}</p>
                <div className="hero__card-tags">
                  <div className="hero__card-tags-inner">
                    {(mode === 'dev'
                      ? ['React', 'Laravel', 'Python']
                      : ['GoHighLevel', 'CRM', 'Automation']
                    ).map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </div>
            </div>

            <motion.div className="hero__float-card hero__float-card--1 glass-card"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <div className="hero__float-icon" aria-hidden="true"><FiZap size={14} /></div>
              <div>
                <p className="hero__float-label">{mode === 'dev' ? 'Projects' : 'GHL Systems'}</p>
                <p className="hero__float-value">{mode === 'dev' ? '8+' : '3+'}</p>
              </div>
            </motion.div>

            <motion.div className="hero__float-card hero__float-card--2 glass-card"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
              <div className="hero__float-icon" aria-hidden="true"><FiBox size={14} /></div>
              <div>
                <p className="hero__float-label">{mode === 'dev' ? 'Technologies' : 'Automations'}</p>
                <p className="hero__float-value">{mode === 'dev' ? '15+' : '10+'}</p>
              </div>
            </motion.div>

            <motion.div className="hero__float-card hero__float-card--3 glass-card"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
              <div className="hero__float-icon" aria-hidden="true"><FiCpu size={14} /></div>
              <div>
                <p className="hero__float-label">{mode === 'dev' ? 'AI Projects' : 'VA Skills'}</p>
                <p className="hero__float-value">{mode === 'dev' ? '2+' : '20+'}</p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
