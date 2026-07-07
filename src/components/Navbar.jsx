import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useMode } from '../context/ModeContext';
import { scrollTo } from '../utils/scrollTo';
import ModeToggle from './ModeToggle';
import './Navbar.css';

const DEV_LINKS = [
  { label: 'Home',       to: 'hero' },
  { label: 'About',      to: 'about' },
  { label: 'Experience', to: 'experience' },
  { label: 'Projects',   to: 'projects' },
  { label: 'Skills',     to: 'skills' },
  { label: 'Contact',    to: 'contact' },
];

const GHL_LINKS = [
  { label: 'Home',     to: 'hero' },
  { label: 'About',    to: 'about' },
  { label: 'Services', to: 'services' },
  { label: 'Projects', to: 'projects' },
  { label: 'Skills',   to: 'skills' },
  { label: 'Contact',  to: 'contact' },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { mode } = useMode();
  const [scrolled,      setScrolled]      = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = mode === 'dev' ? DEV_LINKS : GHL_LINKS;
  const sections = navLinks.map(l => l.to);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= y) { setActiveSection(sections[i]); break; }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  useEffect(() => { setActiveSection('hero'); }, [mode]);

  const handleNav = useCallback((id) => {
    scrollTo(id);
    setMobileOpen(false);
  }, []);

  return (
    <>
      <motion.nav
        className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="navbar__container">

          {/* Logo — db-logo image */}
          <button className="navbar__logo" onClick={() => handleNav('hero')}>
            <img
              src="/assets/db-logo.png"
              alt="Darel Briones"
              className="navbar__logo-img"
              onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextSibling.style.display = 'inline';
              }}
            />
            {/* Text fallback */}
            <span className="navbar__logo-text-fallback" style={{ display: 'none' }}>
              <span className="navbar__logo-name">Dar</span>
              <span className="navbar__logo-dot gradient-text">.</span>
            </span>
          </button>

          {/* Desktop nav links — NO AnimatePresence, stays mounted, no flicker */}
          <ul className="navbar__links">
            {navLinks.map(link => (
              <li key={link.to}>
                <button
                  className={`navbar__link${activeSection === link.to ? ' navbar__link--active' : ''}`}
                  onClick={() => handleNav(link.to)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar__actions">
            <div className="navbar__mode-toggle">
              <ModeToggle />
            </div>

            <button
              className="navbar__theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{    rotate:  90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
                </motion.span>
              </AnimatePresence>
            </button>

            <button className="btn-primary navbar__cta" onClick={() => handleNav('contact')}>
              Hire Me
            </button>

            <button
              className="navbar__mobile-btn"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="navbar__mobile-toggle">
              <ModeToggle />
            </div>
            <ul className="navbar__mobile-links">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <button
                    className="navbar__mobile-link"
                    onClick={() => handleNav(link.to)}
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
