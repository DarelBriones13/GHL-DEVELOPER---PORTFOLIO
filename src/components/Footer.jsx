import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiFacebook, FiArrowUp, FiFileText } from 'react-icons/fi';
import { personalInfo } from '../data/portfolioData';
import { useMode } from '../context/ModeContext';
import { scrollTo } from '../utils/scrollTo';
import ResumeModal from './ResumeModal';
import './Footer.css';

const DEV_NAV = ['hero', 'about', 'experience', 'projects', 'skills', 'contact'];
const GHL_NAV = ['hero', 'about', 'services',  'projects', 'skills', 'contact'];

const LABEL = {
  hero: 'Home', about: 'About', experience: 'Experience',
  services: 'Services', projects: 'Projects',
  skills: 'Skills', contact: 'Contact',
};

const Footer = () => {
  const { mode } = useMode();
  const [resumeOpen, setResumeOpen] = useState(false);
  const navItems = mode === 'dev' ? DEV_NAV : GHL_NAV;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />

      <div className="footer__container">
        <div className="footer__top">

          {/* Brand */}
          <div className="footer__brand">
            {/* Brand — db-logo image */}
            <div className="footer__logo">
              <img
                src="/assets/db-logo.png"
                alt="Darel Briones"
                className="footer__logo-img"
                onError={e => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              <span className="footer__logo-fallback">
                Dar<span className="gradient-text">.</span>
              </span>
            </div>
            <p className="footer__tagline">
              Building smart systems, automating business processes, and providing reliable
              technical support through GoHighLevel, web development, and virtual assistance.
            </p>
            <div className="footer__social">
              <a href={personalInfo.social.github}   target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FiGithub /></a>
              <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href={personalInfo.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook /></a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer__nav">
            <h4 className="footer__nav-title">Navigation</h4>
            <ul className="footer__nav-list">
              {navItems.map(item => (
                <li key={item}>
                  <button className="footer__nav-link" onClick={() => scrollTo(item)}>
                    {LABEL[item]}
                  </button>
                </li>
              ))}
              {/* Resume link */}
              <li>
                <button
                  className="footer__nav-link footer__nav-link--resume"
                  onClick={() => setResumeOpen(true)}
                >
                  <FiFileText size={11} aria-hidden="true" />
                  View Resume
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__contact">
            <h4 className="footer__nav-title">Contact</h4>
            <ul className="footer__contact-list">
              <li><a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></li>
              <li><a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a></li>
              <li>{personalInfo.location}</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {year} Darel S. Briones &mdash; GoHighLevel Developer &bull; Technical VA &bull; Full-Stack Web Developer
          </p>
          <motion.button
            className="footer__back-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
          >
            <FiArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
