import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  FiExternalLink, FiGithub, FiX, FiCheck, FiClock,
  FiSettings, FiCpu, FiLayers, FiGlobe, FiSmartphone, FiLayout,
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

/* ─────────────────────────────────────────
   Expanded detail modal
───────────────────────────────────────── */
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
    <motion.div
      className="pm-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      <motion.div
        className="pm-panel"
        initial={{ opacity: 0, scale: 0.86, y: 50 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.92,  y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero */}
        <div className="pm-hero" style={{ background: project.gradient }}>
          {project.image && (
            <img src={project.image} alt={project.title} className="pm-hero__img" />
          )}
          <div className="pm-hero__overlay" />
          <button className="pm-close" onClick={onClose} aria-label="Close"><FiX size={18} /></button>
          <div className="pm-hero__title-wrap">
            <span className="pm-category">{isGhl ? 'GoHighLevel CRM' : project.category}</span>
            <h2 className="pm-title">{project.title}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="pm-body">
          <p className="pm-desc">{project.description}</p>

          {!isGhl && project.tech && (
            <div className="pm-section">
              <h4 className="pm-section-title">Tech Stack</h4>
              <div className="pm-tags">
                {project.tech.map(t => <span key={t} className="pm-tag">{t}</span>)}
              </div>
            </div>
          )}

          {isGhl && project.features && (
            <div className="pm-section">
              <h4 className="pm-section-title">Features</h4>
              <ul className="pm-features">
                {project.features.map(f => (
                  <li key={f} className="pm-feature">
                    <FiCheck size={12} /><span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
              <span className="pm-upcoming"><FiClock size={13} /> Coming Soon</span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   Curved panoramic strip
   — all cards visible, outer ones angled
   inward like a concave arc
───────────────────────────────────────── */

/* Perspective transforms per position in the arc.
   Negative rotY = tilts right face toward viewer (left side of arc)
   Positive rotY = tilts left face toward viewer (right side of arc) */
const ARC = [
  { rotY: -42, x: '-8%',  scale: 0.80, z: -180, brightness: 0.55 },
  { rotY: -18, x:  '2%',  scale: 0.93, z:  -60, brightness: 0.78 },
  { rotY:   0, x: '50%',  scale: 1.00, z:    0, brightness: 1.00 },
  { rotY:  18, x: '98%',  scale: 0.93, z:  -60, brightness: 0.78 },
  { rotY:  42, x:'108%',  scale: 0.80, z: -180, brightness: 0.55 },
];

const PanoramaStrip = ({ projects, isGhl }) => {
  const [offset, setOffset] = useState(0);       // how many positions we've shifted
  const [selected, setSelected] = useState(null);
  const dragStart = useRef(0);
  const total = projects.length;

  // circular index helper
  const idx = (i) => ((i % total) + total) % total;

  // number of arc slots to show (up to 5, but cap at total)
  const slots = Math.min(5, total);
  // centre slot index in ARC array
  const centre = Math.floor(slots / 2);

  // shift offset
  const shift = useCallback((dir) => {
    setOffset(o => o + dir);
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  shift(-1);
      if (e.key === 'ArrowRight') shift(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shift]);

  // auto-scroll
  useEffect(() => {
    if (selected) return;
    const t = setInterval(() => shift(1), 4000);
    return () => clearInterval(t);
  }, [shift, selected]);

  return (
    <>
      <div
        className="pano"
        onMouseDown={e => { dragStart.current = e.clientX; }}
        onMouseUp={e => {
          const dx = e.clientX - dragStart.current;
          if (Math.abs(dx) > 40) shift(dx < 0 ? 1 : -1);
        }}
        onTouchStart={e => { dragStart.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - dragStart.current;
          if (Math.abs(dx) > 40) shift(dx < 0 ? 1 : -1);
        }}
      >
        <div className="pano__stage">
          {Array.from({ length: slots }).map((_, slot) => {
            const projectIdx = idx(offset + slot - centre);
            const project = projects[projectIdx];
            const arc = ARC[slot] || ARC[centre];
            const isCentre = slot === centre;
            const Icon = CATEGORY_ICON[project.category] || (isGhl ? FiSettings : FiGlobe);

            return (
              <motion.div
                key={`slot-${slot}`}
                className={`pano__card${isCentre ? ' pano__card--centre' : ''}`}
                style={{ left: arc.x, zIndex: isCentre ? 10 : 5 - Math.abs(slot - centre) }}
                animate={{
                  rotateY: arc.rotY,
                  scale: arc.scale,
                  z: arc.z,
                  filter: `brightness(${arc.brightness})`,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                onClick={() => {
                  if (isCentre) setSelected(project);
                  else shift(slot < centre ? -1 : 1);
                }}
                whileHover={isCentre ? { filter: 'brightness(1.06)' } : {}}
              >
                {/* Image */}
                <div className="pano__img-wrap" style={{ background: project.gradient }}>
                  {project.image
                    ? <img src={project.image} alt={project.title} className="pano__img" />
                    : <div className="pano__icon"><Icon size={36} /></div>
                  }
                  {/* curved inner shadow on edges */}
                  <div className="pano__curve-left"  />
                  <div className="pano__curve-right" />
                  {/* bottom overlay — only on centre */}
                  {isCentre && <div className="pano__img-gradient" />}
                </div>

                {/* Label — only on centre */}
                <AnimatePresence>
                  {isCentre && (
                    <motion.div
                      className="pano__label"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0  }}
                      exit={{    opacity: 0, y: 8  }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                    >
                      <span className="pano__cat">{isGhl ? 'GoHighLevel' : project.category}</span>
                      <h3 className="pano__title">{project.title}</h3>
                      <p className="pano__hint">Click to view details</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="pano__dots">
          {projects.map((_, i) => {
            const active = idx(offset + centre - centre) === i ||
              idx(((offset % total) + total) % total) === i;
            // simpler: highlight whichever project is at centre slot
            const centreProject = idx(offset);
            return (
              <button
                key={i}
                className={`pano__dot${centreProject === i ? ' pano__dot--active' : ''}`}
                onClick={() => setOffset(i)}
                aria-label={`Go to project ${i + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal
            project={selected}
            isGhl={isGhl}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/* ─────────────────────────────────────────
   Section
───────────────────────────────────────── */
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
              ? 'Real-world applications — drag or click the sides to explore.'
              : 'Complete CRM systems built with GoHighLevel.'
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
              <p className="projects__ghl-notice">
                <FiClock size={14} />
                Portfolio systems currently in development. Coming soon.
              </p>
            )}
            <PanoramaStrip
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
