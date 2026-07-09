import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiExternalLink, FiGithub, FiX, FiCheck, FiClock,
  FiSettings, FiCpu, FiLayers, FiGlobe, FiSmartphone, FiLayout,
  FiChevronLeft, FiChevronRight,
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

/* ─── Detail modal ─── */
const ProjectModal = ({ project, isGhl, onClose }) => {
  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <motion.div className="pm-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }} onClick={onClose}>
      <motion.div className="pm-panel"
        initial={{ opacity: 0, scale: 0.88, y: 48 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}>

        <div className="pm-hero" style={{ background: project.gradient }}>
          {project.image && <img src={project.image} alt={project.title} className="pm-hero__img" />}
          <div className="pm-hero__overlay" />
          <button className="pm-close" onClick={onClose}><FiX size={18} /></button>
          <div className="pm-hero__meta">
            <span className="pm-cat">{isGhl ? 'GoHighLevel CRM' : project.category}</span>
            <h2 className="pm-title">{project.title}</h2>
          </div>
        </div>

        <div className="pm-body">
          <p className="pm-desc">{project.description}</p>

          {!isGhl && project.tech && (
            <div className="pm-section">
              <h4 className="pm-section-title">Tech Stack</h4>
              <div className="pm-tags">{project.tech.map(t => <span key={t} className="pm-tag">{t}</span>)}</div>
            </div>
          )}

          {isGhl && project.features && (
            <div className="pm-section">
              <h4 className="pm-section-title">Features</h4>
              <ul className="pm-features">
                {project.features.map(f => (
                  <li key={f} className="pm-feature"><FiCheck size={12} /><span>{f}</span></li>
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

/* ─── Curved panoramic strip ─── */
/*
  The arc is achieved by:
  1. A full-viewport-width stage that bleeds outside the container
  2. 5 cards absolutely positioned along a horizontal band
  3. Each card gets a rotateY + translateZ so outer ones tilt inward
  4. perspective-origin is at vertical center so the warp feels natural
*/

// slot configs: translateX (from stage centre), rotateY, z-depth, opacity
const SLOTS = [
  { tx: -44, ry: 42,  tz: -260, op: 0.55, w: 18 },  // far left
  { tx: -23, ry: 20,  tz:  -80, op: 0.78, w: 22 },  // near left
  { tx:   0, ry:  0,  tz:    0, op: 1.00, w: 26 },  // centre
  { tx:  23, ry: -20, tz:  -80, op: 0.78, w: 22 },  // near right
  { tx:  44, ry: -42, tz: -260, op: 0.55, w: 18 },  // far right
];

const PanoStrip = ({ projects, isGhl }) => {
  const total = projects.length;
  const [centre, setCentre] = useState(0);
  const [selected, setSelected] = useState(null);
  const dragX = useRef(0);

  const go = useCallback((delta) => setCentre(c => ((c + delta) % total + total) % total), [total]);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [go]);

  useEffect(() => {
    if (selected) return;
    const id = setInterval(() => go(1), 4500);
    return () => clearInterval(id);
  }, [go, selected]);

  const numSlots = Math.min(5, total);
  const offset = Math.floor(numSlots / 2); // 2 for 5 slots

  return (
    <>
      {/* Full-bleed wrapper — breaks out of .container */}
      <div className="pano-wrap">

        {/* Left arrow */}
        <button className="pano-arrow pano-arrow--l" onClick={() => go(-1)} aria-label="Previous">
          <FiChevronLeft size={24} />
        </button>

        {/* Stage */}
        <div className="pano-stage"
          onMouseDown={e => { dragX.current = e.clientX; }}
          onMouseUp={e => { const d = e.clientX - dragX.current; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); }}
          onTouchStart={e => { dragX.current = e.touches[0].clientX; }}
          onTouchEnd={e => { const d = e.changedTouches[0].clientX - dragX.current; if (Math.abs(d) > 40) go(d < 0 ? 1 : -1); }}
        >
          {Array.from({ length: numSlots }).map((_, slot) => {
            const pi = ((centre - offset + slot) % total + total) % total;
            const p = projects[pi];
            const s = SLOTS[slot] || SLOTS[2];
            const isCentre = slot === offset;
            const Icon = CATEGORY_ICON[p.category] || (isGhl ? FiSettings : FiGlobe);

            return (
              <motion.div
                key={`s${slot}`}
                className={`pano-card${isCentre ? ' pano-card--active' : ''}`}
                style={{ '--slot-w': `${s.w}%` }}
                animate={{
                  x: `${s.tx}vw`,
                  rotateY: s.ry,
                  z: s.tz,
                  opacity: s.op,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.9 }}
                onClick={() => isCentre ? setSelected(p) : go(slot < offset ? -1 : 1)}
                style={{ cursor: isCentre ? 'pointer' : 'default', '--slot-w': `${s.w}%` }}
              >
                {/* Image */}
                <div className="pano-card__img" style={{ background: p.gradient }}>
                  {p.image
                    ? <img src={p.image} alt={p.title} />
                    : <div className="pano-card__icon"><Icon size={40} /></div>
                  }
                  {/* edge-shadow vignette */}
                  <div className="pano-card__vignette" />
                  {/* bottom gradient only on active */}
                  {isCentre && <div className="pano-card__bottom-grad" />}
                </div>

                {/* Text — only on active card */}
                <AnimatePresence>
                  {isCentre && (
                    <motion.div className="pano-card__text"
                      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.3, delay: 0.08 }}>
                      <span className="pano-card__cat">{isGhl ? 'GoHighLevel' : p.category}</span>
                      <h3 className="pano-card__title">{p.title}</h3>
                      <span className="pano-card__hint">Click to view details</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Right arrow */}
        <button className="pano-arrow pano-arrow--r" onClick={() => go(1)} aria-label="Next">
          <FiChevronRight size={24} />
        </button>
      </div>

      {/* Dots — inside container */}
      <div className="pano-dots">
        {projects.map((_, i) => (
          <button key={i}
            className={`pano-dot${i === centre ? ' pano-dot--on' : ''}`}
            onClick={() => setCentre(i)} aria-label={`Project ${i + 1}`} />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} isGhl={isGhl} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── Section ─── */
const Projects = () => {
  const { mode } = useMode();
  return (
    <section id="projects" className="projects section">
      <div className="container">
        <motion.div className="projects__header"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}>
          <span className="section-label">{mode === 'dev' ? 'Featured Projects' : 'GHL Portfolio'}</span>
          <h2 className="section-title">
            {mode === 'dev' ? <>Things I've <span className="gradient-text">Built</span></> : <>GoHighLevel <span className="gradient-text">Systems</span></>}
          </h2>
          <p className="section-subtitle">
            {mode === 'dev'
              ? 'Real-world applications — click the centre card to explore full details.'
              : 'Complete CRM systems built with GoHighLevel — click to explore.'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={`proj-${mode}`}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {mode === 'ghl' && (
              <div className="projects__notice">
                <FiClock size={14} /> Portfolio systems currently in development. Coming soon.
              </div>
            )}
            <PanoStrip projects={mode === 'dev' ? devMode.projects : ghlMode.projects} isGhl={mode === 'ghl'} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
