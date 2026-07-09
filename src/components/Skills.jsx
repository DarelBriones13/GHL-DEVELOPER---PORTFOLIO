import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  FiLayout, FiServer, FiSmartphone, FiDatabase, FiCpu,
  FiSettings, FiFileText, FiMonitor, FiBriefcase,
  FiX, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import { devMode, ghlMode } from '../data/portfolioData';
import { useMode } from '../context/ModeContext';
import './Skills.css';

/* ─── icon maps ─── */
const DEV_ICONS = {
  Frontend:    FiLayout,
  Backend:     FiServer,
  Database:    FiDatabase,
  'AI & Tools': FiCpu,
  Mobile:      FiSmartphone,
};
const GHL_ICONS = {
  GoHighLevel:    FiSettings,
  Administrative: FiBriefcase,
  'Google Suite': FiMonitor,
  'Creative Tools': FiFileText,
  'AI Productivity': FiCpu,
};

/* ─── bg tones per card index (greyscale only) ─── */
const CARD_TONES = [
  'hsl(0,0%,11%)',
  'hsl(0,0%,18%)',
  'hsl(0,0%,25%)',
  'hsl(0,0%,16%)',
  'hsl(0,0%,22%)',
];
const CARD_TONES_LIGHT = [
  'hsl(0,0%,91%)',
  'hsl(0,0%,85%)',
  'hsl(0,0%,80%)',
  'hsl(0,0%,87%)',
  'hsl(0,0%,83%)',
];

/* ─── Single cinematic card with 3-D tilt ─── */
const SkillCard = ({ cat, index, iconMap, onClick, tone }) => {
  const Icon = iconMap[cat.name] || FiLayout;
  const cardRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-1, 1], [12, -12]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    const r = cardRef.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const handleMouseLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={cardRef}
      className="sk-card"
      style={{ background: tone, rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(cat, index)}
      initial={{ opacity: 0, scale: 0.88, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Mirror sheen — moves with tilt */}
      <motion.div
        className="sk-card__sheen"
        style={{
          background: useTransform(
            [mx, my],
            ([x, y]) =>
              `radial-gradient(ellipse at ${50 + x * 30}% ${50 + y * 30}%, rgba(255,255,255,0.18) 0%, transparent 65%)`,
          ),
        }}
      />

      {/* Card content */}
      <div className="sk-card__inner">
        <div className="sk-card__icon">
          <Icon size={22} />
        </div>
        <h3 className="sk-card__title">{cat.name}</h3>
        <p className="sk-card__count">{cat.skills.length} skills</p>

        {/* Preview tags — show first 3 */}
        <div className="sk-card__tags">
          {cat.skills.slice(0, 3).map(s => (
            <span key={s} className="sk-card__tag">{s}</span>
          ))}
          {cat.skills.length > 3 && (
            <span className="sk-card__tag sk-card__tag--more">+{cat.skills.length - 3}</span>
          )}
        </div>

        <span className="sk-card__cta">Click to expand</span>
      </div>

      {/* Bottom mirror reflection */}
      <div className="sk-card__reflection" aria-hidden="true" />
    </motion.div>
  );
};

/* ─── Expanded detail modal ─── */
const SkillModal = ({ cat, index, iconMap, tone, onClose }) => {
  const Icon = iconMap[cat.name] || FiLayout;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="sk-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="sk-modal"
        style={{ background: tone }}
        initial={{ opacity: 0, scale: 0.75, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.82, y: 40 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        layoutId={`sk-card-${index}`}
      >
        {/* Sheen */}
        <div className="sk-modal__sheen" />

        <button className="sk-modal__close" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>

        <div className="sk-modal__header">
          <div className="sk-modal__icon">
            <Icon size={28} />
          </div>
          <div>
            <h2 className="sk-modal__title">{cat.name}</h2>
            <p className="sk-modal__subtitle">{cat.skills.length} skills in this category</p>
          </div>
        </div>

        <div className="sk-modal__skills">
          {cat.skills.map((s, i) => (
            <motion.span
              key={s}
              className="sk-modal__tag"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.04, duration: 0.3 }}
            >
              {s}
            </motion.span>
          ))}
        </div>

        {/* Mirror reflection */}
        <div className="sk-modal__reflection" aria-hidden="true" />
      </motion.div>
    </motion.div>
  );
};

/* ─── Main Skills section ─── */
const Skills = () => {
  const { mode } = useMode();
  const data    = mode === 'dev' ? devMode.skills  : ghlMode.skills;
  const iconMap = mode === 'dev' ? DEV_ICONS       : GHL_ICONS;

  const [active, setActive]         = useState(null);   // { cat, index }
  const [isDark, setIsDark]         = useState(false);
  const stripRef                    = useRef(null);
  const autoRef                     = useRef(null);

  /* detect theme */
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const tones = isDark ? CARD_TONES : CARD_TONES_LIGHT;

  /* Auto-scroll cinematic loop */
  const startAuto = useCallback(() => {
    stopAuto();
    autoRef.current = setInterval(() => {
      const el = stripRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 280, behavior: 'smooth' });
      }
    }, 2800);
  }, []);

  const stopAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
  };

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, mode]);

  const scrollBy = (dir) => {
    stopAuto();
    stripRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
    startAuto();
  };

  const openModal  = (cat, index) => { stopAuto(); setActive({ cat, index }); };
  const closeModal = () => { setActive(null); startAuto(); };

  return (
    <section id="skills" className="skills-section section">
      {/* Header */}
      <motion.div
        className="container skills-section__header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <span className="section-label">Skills &amp; Expertise</span>
        <h2 className="section-title">
          {mode === 'dev' ? 'Technical' : 'Professional'}{' '}
          <span className="gradient-text">Skills</span>
        </h2>
        <p className="section-subtitle">
          {mode === 'dev'
            ? 'Technologies and tools I use to build scalable web applications.'
            : 'Platforms, tools, and skills I use to manage and automate business systems.'}
        </p>
      </motion.div>

      {/* Cinematic strip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`strip-${mode}`}
          className="sk-stage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Nav arrows */}
          <button className="sk-nav sk-nav--left"  onClick={() => scrollBy(-1)} aria-label="Previous"><FiChevronLeft  size={20} /></button>
          <button className="sk-nav sk-nav--right" onClick={() => scrollBy(1)}  aria-label="Next"><FiChevronRight size={20} /></button>

          {/* Scrollable strip */}
          <div
            ref={stripRef}
            className="sk-strip"
            onMouseEnter={stopAuto}
            onMouseLeave={startAuto}
          >
            {data.categories.map((cat, i) => (
              <SkillCard
                key={`${mode}-${cat.name}`}
                cat={cat}
                index={i}
                iconMap={iconMap}
                onClick={openModal}
                tone={tones[i % tones.length]}
              />
            ))}
          </div>

          {/* Fade edges */}
          <div className="sk-fade sk-fade--left"  aria-hidden="true" />
          <div className="sk-fade sk-fade--right" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>

      {/* Tools row */}
      <motion.div
        className="container skills-section__tools"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h3 className="skills-section__tools-title">Tools &amp; Software</h3>
        <AnimatePresence mode="wait">
          <motion.div
            key={`tools-${mode}`}
            className="skills-section__tools-grid"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {data.tools.map((tool, i) => (
              <motion.div
                key={tool}
                className="tool-chip glass-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
              >
                <span className="tool-chip__name">{tool}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Expanded modal */}
      <AnimatePresence>
        {active && (
          <SkillModal
            cat={active.cat}
            index={active.index}
            iconMap={iconMap}
            tone={tones[active.index % tones.length]}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Skills;
