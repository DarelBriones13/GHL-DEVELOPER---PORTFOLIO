import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLayout, FiServer, FiSmartphone, FiDatabase, FiCpu,
  FiSettings, FiMail, FiFileText, FiMonitor, FiBriefcase,
  FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import { devMode, ghlMode } from '../data/portfolioData';
import { useMode } from '../context/ModeContext';
import './Skills.css';

const DEV_ICONS = {
  'Frontend':   FiLayout,
  'Backend':    FiServer,
  'Database':   FiDatabase,
  'AI & Tools': FiCpu,
  'Mobile':     FiSmartphone,
};
const GHL_ICONS = {
  'GoHighLevel':    FiSettings,
  'Administrative': FiBriefcase,
  'Google Suite':   FiMonitor,
  'Creative Tools': FiFileText,
  'AI Productivity':FiCpu,
};

/* ── Animated SVG ring showing average skill level ── */
const SkillRing = ({ level, size = 80, stroke = 6 }) => {
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (level / 100) * circ;

  return (
    <svg width={size} height={size} className="sk-ring" aria-hidden="true">
      {/* Track */}
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="var(--color-border)" strokeWidth={stroke} />
      {/* Fill */}
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      {/* Percentage label */}
      <text
        x="50%" y="50%"
        dominantBaseline="central" textAnchor="middle"
        className="sk-ring__label"
      >
        {level}%
      </text>
    </svg>
  );
};

/* ── Individual skill bar inside each card ── */
const SkillBar = ({ name, level, index }) => (
  <div className="sk-bar">
    <div className="sk-bar__row">
      <span className="sk-bar__name">{name}</span>
      <span className="sk-bar__pct">{level}%</span>
    </div>
    <div className="sk-bar__track">
      <motion.div
        className="sk-bar__fill"
        initial={{ width: 0 }}
        animate={{ width: `${level}%` }}
        transition={{ duration: 0.9, delay: index * 0.06 + 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  </div>
);

/* ── Slide variants ── */
const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.94,
  }),
  centre: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 320, damping: 30, mass: 0.85 },
  },
  exit: (dir) => ({
    x: dir > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.22, ease: 'easeIn' },
  }),
};

/* ── Main Skills carousel ── */
const Skills = () => {
  const { mode }   = useMode();
  const data       = mode === 'dev' ? devMode.skills    : ghlMode.skills;
  const iconMap    = mode === 'dev' ? DEV_ICONS         : GHL_ICONS;

  /* Build slides: each category + the technical bars merged in */
  const slides = data.categories.map((cat) => ({
    ...cat,
    Icon: iconMap[cat.name] || FiLayout,
    /* Find matching technical skills to show bars */
    bars: data.technical.filter(t =>
      cat.skills.some(s => t.name.toLowerCase().includes(s.toLowerCase()) ||
                           s.toLowerCase().includes(t.name.split(' ')[0].toLowerCase()))
    ).slice(0, 4),
    /* Average proficiency of matched bars, fallback to 75 */
    avgLevel: (() => {
      const matched = data.technical.filter(t =>
        cat.skills.some(s => t.name.toLowerCase().includes(s.toLowerCase()) ||
                             s.toLowerCase().includes(t.name.split(' ')[0].toLowerCase()))
      );
      return matched.length
        ? Math.round(matched.reduce((a, b) => a + b.level, 0) / matched.length)
        : 75;
    })(),
  }));

  const total    = slides.length;
  const [active, setActive] = useState(0);
  const [dir,    setDir]    = useState(1);
  const dragX    = useRef(0);
  const blocked  = useRef(false);

  const go = useCallback((delta) => {
    if (blocked.current) return;
    blocked.current = true;
    setDir(delta);
    setActive(c => ((c + delta) % total + total) % total);
    setTimeout(() => { blocked.current = false; }, 420);
  }, [total]);

  /* Reset to first slide when mode changes */
  useEffect(() => { setActive(0); setDir(1); }, [mode]);

  /* Auto-advance */
  useEffect(() => {
    const id = setInterval(() => go(1), 4000);
    return () => clearInterval(id);
  }, [go]);

  const slide = slides[active];

  return (
    <section id="skills" className="skills-section section">
      <div className="container">

        {/* Header */}
        <motion.div className="skills-section__header"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5 }}>
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

        {/* ── Carousel ── */}
        <div className="sk-carousel">

          {/* Prev arrow */}
          <button className="sk-arrow sk-arrow--l" onClick={() => go(-1)} aria-label="Previous skill">
            <FiChevronLeft size={20} />
          </button>

          {/* Slide window */}
          <div className="sk-window"
            onMouseDown={e  => { dragX.current = e.clientX; }}
            onMouseUp={e    => { const d = e.clientX - dragX.current; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); }}
            onTouchStart={e => { dragX.current = e.touches[0].clientX; }}
            onTouchEnd={e   => { const d = e.changedTouches[0].clientX - dragX.current; if (Math.abs(d) > 40) go(d < 0 ? 1 : -1); }}
          >
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={`${mode}-${active}`}
                className="sk-slide glass-card"
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="centre"
                exit="exit"
              >
                {/* Top: icon + ring + category name */}
                <div className="sk-slide__top">
                  <div className="sk-slide__icon-wrap">
                    <slide.Icon size={22} />
                  </div>
                  <div className="sk-slide__meta">
                    <h3 className="sk-slide__name">{slide.name}</h3>
                    <p className="sk-slide__count">{slide.skills.length} skills</p>
                  </div>
                  <SkillRing level={slide.avgLevel} />
                </div>

                {/* Skill bars (matched technical skills) */}
                {slide.bars.length > 0 && (
                  <div className="sk-slide__bars">
                    {slide.bars.map((b, i) => (
                      <SkillBar key={b.name} name={b.name} level={b.level} index={i} />
                    ))}
                  </div>
                )}

                {/* Tag cloud */}
                <div className="sk-slide__tags">
                  {slide.skills.map(s => (
                    <span key={s} className="sk-tag">{s}</span>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next arrow */}
          <button className="sk-arrow sk-arrow--r" onClick={() => go(1)} aria-label="Next skill">
            <FiChevronRight size={20} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="sk-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`sk-dot${i === active ? ' sk-dot--on' : ''}`}
              onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }}
              aria-label={`Skill category ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Tools row — auto-scrolling marquee ── */}
        <AnimatePresence mode="wait">
          <motion.div className="sk-tools"
            key={`tools-${mode}`}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <p className="sk-tools__label">Tools &amp; Software</p>
            <div className="sk-marquee-wrap">
              <div className="sk-marquee">
                {/* Duplicate for seamless loop */}
                {[...data.tools, ...data.tools].map((tool, i) => (
                  <span key={i} className="sk-tool-chip glass-card">{tool}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Skills;
