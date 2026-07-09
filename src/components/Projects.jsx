import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiExternalLink, FiGithub, FiChevronLeft, FiChevronRight,
  FiX, FiCheck, FiClock, FiSettings, FiCpu, FiLayers,
  FiGlobe, FiSmartphone, FiLayout,
} from 'react-icons/fi';
import { devMode, ghlMode } from '../data/portfolioData';
import { useMode } from '../context/ModeContext';
import './Projects.css';

const CATEGORY_ICON = {
  'AI & Automation': FiCpu,
  'Web Application': FiLayers,
  'Mobile': FiSmartphone,
  'Frontend': FiLayout,
};

/* ─────────────────────────────────────────────
   Expanded detail modal (portal-style)
───────────────────────────────────────────── */
const ProjectModal = ({ project, isGhl, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="pm-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <motion.div
          className="pm-panel"
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image / gradient hero */}
          <div
            className="pm-hero"
            style={{ background: project.gradient }}
          >
            {project.image && (
              <img src={project.image} alt={project.title} className="pm-hero__img" />
            )}
            <div className="pm-hero__overlay" />
            <button className="pm-close" onClick={onClose} aria-label="Close">
              <FiX size={18} />
            </button>
            <div className="pm-hero__title-wrap">
              <span className="pm-category">
                {isGhl ? 'GoHighLevel CRM' : project.category}
              </span>
              <h2 className="pm-title">{project.title}</h2>
            </div>
          </div>

          {/* Body */}
          <div className="pm-body">
            <p className="pm-desc">{project.description}</p>

            {/* Tech stack (dev) */}
            {!isGhl && project.tech && (
              <div className="pm-section">
                <h4 className="pm-section-title">Tech Stack</h4>
                <div className="pm-tags">
                  {project.tech.map(t => (
                    <span key={t} className="pm-tag">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Features (ghl) */}
            {isGhl && project.features && (
              <div className="pm-section">
                <h4 className="pm-section-title">Features</h4>
                <ul className="pm-features">
                  {project.features.map(f => (
                    <li key={f} className="pm-feature">
                      <FiCheck size={12} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="pm-actions">
              {!isGhl && project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="pm-btn pm-btn--ghost">
                  <FiGithub size={14} /> GitHub
                </a>
              )}
              {project.demo && project.demo !== '#' && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="pm-btn pm-btn--primary">
                  <FiExternalLink size={14} /> Live Demo
                </a>
              )}
              {isGhl && project.status === 'upcoming' && (
                <span className="pm-upcoming">
                  <FiClock size={13} /> Coming Soon
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────
   Cinematic 3-D carousel
───────────────────────────────────────────── */
const Carousel = ({ projects, isGhl }) => {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);
  const total = projects.length;

  const prev = useCallback(() => setActive(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive(i => (i + 1) % total), [total]);

  /* keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  /* auto-advance every 5 s */
  useEffect(() => {
    if (selected) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, selected]);

  const getSlotFor = (index) => {
    // distance from active, wrapped
    let d = (index - active + total) % total;
    if (d > total / 2) d -= total;
    return d; // -2 -1 0 1 2
  };

  return (
    <div className="carousel">
      {/* Stage */}
      <div className="carousel__stage"
        onMouseDown={e => { setDragging(false); dragStart.current = e.clientX; }}
        onMouseUp={e => {
          const dx = e.clientX - dragStart.current;
          if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
        }}
        onTouchStart={e => { dragStart.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - dragStart.current;
          if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
        }}
      >
        {projects.map((project, i) => {
          const slot = getSlotFor(i);
          if (Math.abs(slot) > 2) return null; // only render ±2

          const isCenter = slot === 0;
          const Icon = CATEGORY_ICON[project.category] || (isGhl ? FiSettings : FiGlobe);

          /* 3-D transform values per slot */
          const configs = {
            '-2': { x: '-200%', z: -260, rotY:  40, opacity: 0.25, scale: 0.72 },
            '-1': { x: '-95%',  z: -120, rotY:  28, opacity: 0.65, scale: 0.85 },
             '0': { x: '-50%',  z:    0, rotY:   0, opacity: 1,    scale: 1    },
             '1': { x: '0%',    z: -120, rotY: -28, opacity: 0.65, scale: 0.85 },
             '2': { x: '100%',  z: -260, rotY: -40, opacity: 0.25, scale: 0.72 },
          };
          const cfg = configs[String(slot)] || configs['2'];

          return (
            <motion.div
              key={project.id}
              className={`c-card${isCenter ? ' c-card--active' : ''}`}
              style={{ cursor: isCenter ? 'pointer' : 'default' }}
              animate={{
                x: cfg.x,
                z: cfg.z,
                rotateY: cfg.rotY,
                opacity: cfg.opacity,
                scale: cfg.scale,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              onClick={() => {
                if (isCenter) setSelected(project);
                else setActive(i);
              }}
            >
              {/* Card image or gradient */}
              <div className="c-card__img-wrap" style={{ background: project.gradient }}>
                {project.image
                  ? <img src={project.image} alt={project.title} className="c-card__img" />
                  : <div className="c-card__icon"><Icon size={32} /></div>
                }
                <div className="c-card__img-overlay" />

                {/* Center card badge */}
                {isCenter && (project.featured || (isGhl && project.status === 'upcoming')) && (
                  <div className="c-card__badge">
                    {project.featured ? '★ Featured' : '⏱ Upcoming'}
                  </div>
                )}
              </div>

              {/* Text block — only visible on center card */}
              <AnimatePresence>
                {isCenter && (
                  <motion.div
                    className="c-card__info"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                  >
                    <span className="c-card__cat">
                      {isGhl ? 'GoHighLevel CRM' : project.category}
                    </span>
                    <h3 className="c-card__title">{project.title}</h3>
                    <p className="c-card__desc">{project.description}</p>
                    <p className="c-card__hint">Click to view details</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Nav arrows */}
      <button className="carousel__arrow carousel__arrow--prev" onClick={prev} aria-label="Previous">
        <FiChevronLeft size={22} />
      </button>
      <button className="carousel__arrow carousel__arrow--next" onClick={next} aria-label="Next">
        <FiChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="carousel__dots">
        {projects.map((_, i) => (
          <button
            key={i}
            className={`carousel__dot${i === active ? ' carousel__dot--active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Expanded modal */}
      {selected && (
        <ProjectModal
          project={selected}
          isGhl={isGhl}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Projects section
───────────────────────────────────────────── */
const Projects = () => {
  const { mode } = useMode();

  return (
    <section id="projects" className="projects section">
      <div className="container">
        <motion.div
          className="projects__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <span className="section-label">
            {mode === 'dev' ? 'Featured Projects' : 'GHL Portfolio'}
          </span>
          <h2 className="section-title">
            {mode === 'dev'
              ? <>Things I've <span className="gradient-text">Built</span></>
              : <>GoHighLevel <span className="gradient-text">Systems</span></>
            }
          </h2>
          <p className="section-subtitle">
            {mode === 'dev'
              ? 'Real-world applications — click a card to explore the full details.'
              : 'Complete CRM systems built with GoHighLevel — click to explore.'
            }
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`projects-${mode}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {mode === 'ghl' && (
              <div className="projects__ghl-notice">
                <FiClock size={14} />
                <span>Portfolio systems currently in development. Coming soon.</span>
              </div>
            )}
            <Carousel
              projects={mode === 'dev' ? devMode.projects : ghlMode.projects}
              isGhl={mode === 'ghl'}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
