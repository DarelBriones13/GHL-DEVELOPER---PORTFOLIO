import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiExternalLink, FiGithub, FiX, FiCheck, FiClock,
  FiSettings, FiCpu, FiLayers, FiGlobe, FiSmartphone,
  FiChevronLeft, FiChevronRight, FiMaximize2,
} from 'react-icons/fi';
import { devMode, ghlMode } from '../data/portfolioData';
import { useMode } from '../context/ModeContext';
import './Projects.css';

const CATEGORY_ICON = {
  'AI & Automation': FiCpu,
  'Web Application': FiLayers,
  'Mobile': FiSmartphone,
  'Frontend': FiLayers,
};

/* ─── Image lightbox ─── */
const Lightbox = ({ src, alt, onClose }) => {
  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <motion.div className="lb-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }} onClick={onClose}>
      <motion.img className="lb-img" src={src} alt={alt}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        exit={{    scale: 0.9,  opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()} />
      <button className="lb-close" onClick={onClose}><FiX size={20} /></button>
    </motion.div>
  );
};

/* ─── Detail modal ─── */
const ProjectModal = ({ project, isGhl, onClose }) => {
  const [lightbox, setLightbox] = useState(false);
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' && !lightbox) onClose(); };
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose, lightbox]);

  return (
    <>
      <motion.div className="pm-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }} onClick={onClose}>
        <motion.div className="pm-panel"
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}>

          <div className="pm-hero" style={{ background: project.gradient }}>
            {project.image && <img src={project.image} alt={project.title} className="pm-hero__img" />}
            <div className="pm-hero__scrim" />
            <button className="pm-close" onClick={onClose}><FiX size={16} /></button>
            {project.image && (
              <button className="pm-expand" onClick={() => setLightbox(true)} title="View full image">
                <FiMaximize2 size={14} />
              </button>
            )}
            <div className="pm-hero__meta">
              <span className="pm-cat">{isGhl ? 'GoHighLevel CRM' : project.category}</span>
              <h2 className="pm-title">{project.title}</h2>
            </div>
          </div>

          <div className="pm-body">
            <p className="pm-desc">{project.description}</p>
            {!isGhl && project.tech && (
              <div className="pm-section">
                <h4 className="pm-section-label">Tech Stack</h4>
                <div className="pm-tags">{project.tech.map(t => <span key={t} className="pm-tag">{t}</span>)}</div>
              </div>
            )}
            {isGhl && project.features && (
              <div className="pm-section">
                <h4 className="pm-section-label">Features</h4>
                <ul className="pm-features">
                  {project.features.map(f => (
                    <li key={f} className="pm-feature"><FiCheck size={11} /><span>{f}</span></li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pm-actions">
              {!isGhl && project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="pm-btn pm-btn--ghost">
                  <FiGithub size={13} /> GitHub
                </a>
              )}
              {project.demo && project.demo !== '#' && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="pm-btn pm-btn--primary">
                  <FiExternalLink size={13} /> Live Demo
                </a>
              )}
              {isGhl && project.status === 'upcoming' && (
                <span className="pm-badge-coming"><FiClock size={12} /> Coming Soon</span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {lightbox && project.image && (
          <Lightbox src={project.image} alt={project.title} onClose={() => setLightbox(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── 3D Carousel ─── */
/*
  Layout strategy:
  - All 3 rendered cards sit in a flex row centred inside the stage
  - The stage has overflow:visible so side cards can bleed outside
  - Each card uses CSS custom props + framer-motion for rotateY / z / scale / opacity
  - Centre card: full size, face-on
  - Side cards: scaled down, pushed back (z), rotated inward (rotateY)
*/

const CARD_W  = 340;   // px — centre card width
const CARD_H  = 360;   // px — card height
const SIDE_W  = 260;   // px — side card visible width
const GAP     = 18;    // px — gap between centre and side cards

// [left, centre, right]
const TRANSFORMS = [
  { rotateY:  28, z: -140, scale: 0.80, opacity: 0.55, x: -(CARD_W/2 + SIDE_W/2 + GAP) },
  { rotateY:   0, z:    0, scale: 1.00, opacity: 1.00, x: 0 },
  { rotateY: -28, z: -140, scale: 0.80, opacity: 0.55, x:  (CARD_W/2 + SIDE_W/2 + GAP) },
];

const Carousel3D = ({ projects, isGhl }) => {
  const total     = projects.length;
  const [active, setActive]   = useState(0);
  const [selected, setSelected] = useState(null);
  const dragX   = useRef(0);
  const blocked = useRef(false);

  const go = useCallback((delta) => {
    if (blocked.current) return;
    blocked.current = true;
    setActive(c => ((c + delta) % total + total) % total);
    setTimeout(() => { blocked.current = false; }, 460);
  }, [total]);

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

  const slots = [
    projects[((active - 1) % total + total) % total],  // left
    projects[active],                                    // centre
    projects[(active + 1) % total],                      // right
  ];

  return (
    <>
      <div className="c3-root">
        {/* Left arrow */}
        <button className="c3-arrow c3-arrow--l" onClick={() => go(-1)} aria-label="Previous">
          <FiChevronLeft size={20} />
        </button>

        {/* Stage — perspective wrapper */}
        <div className="c3-stage"
          onMouseDown={e => { dragX.current = e.clientX; }}
          onMouseUp={e   => { const d = e.clientX - dragX.current; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); }}
          onTouchStart={e => { dragX.current = e.touches[0].clientX; }}
          onTouchEnd={e   => { const d = e.changedTouches[0].clientX - dragX.current; if (Math.abs(d) > 40) go(d < 0 ? 1 : -1); }}
        >
          {slots.map((project, slot) => {
            const tf      = TRANSFORMS[slot];
            const isC     = slot === 1;
            const Icon    = CATEGORY_ICON[project.category] || (isGhl ? FiSettings : FiGlobe);
            const cardW   = isC ? CARD_W : SIDE_W;

            return (
              <motion.div
                key={`${active}-${slot}`}
                className={`c3-card${isC ? ' c3-card--centre' : ''}`}
                style={{ width: cardW, height: CARD_H, cursor: isC ? 'pointer' : 'default' }}
                animate={{
                  x:       tf.x,
                  rotateY: tf.rotateY,
                  z:       tf.z,
                  scale:   tf.scale,
                  opacity: tf.opacity,
                }}
                initial={{
                  x:       tf.x + (slot === 0 ? 60 : slot === 2 ? -60 : 0),
                  rotateY: tf.rotateY,
                  z:       tf.z - 80,
                  scale:   tf.scale * 0.9,
                  opacity: 0,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 30, mass: 0.9 }}
                onClick={() => { if (isC) setSelected(project); else go(slot === 0 ? -1 : 1); }}
                whileHover={isC ? { z: 20, scale: 1.02, transition: { duration: 0.2 } } : {}}
              >
                {/* Image fill */}
                <div className="c3-img-wrap" style={{ background: project.gradient }}>
                  {project.image
                    ? <img src={project.image} alt={project.title} className="c3-img" />
                    : <div className="c3-icon"><Icon size={isC ? 38 : 28} /></div>
                  }
                  {/* subtle vignette on all cards */}
                  <div className="c3-vignette" />
                  {/* bottom scrim only on centre */}
                  {isC && <div className="c3-scrim" />}
                </div>

                {/* Text label — centre only */}
                <AnimatePresence>
                  {isC && (
                    <motion.div className="c3-label"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.26, delay: 0.1 }}>
                      <span className="c3-cat">{isGhl ? 'GoHighLevel' : project.category}</span>
                      <h3 className="c3-title">{project.title}</h3>
                      <span className="c3-hint">Click to view details</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Right arrow */}
        <button className="c3-arrow c3-arrow--r" onClick={() => go(1)} aria-label="Next">
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* Dots */}
      <div className="c3-dots">
        {projects.map((_, i) => (
          <button key={i}
            className={`c3-dot${i === active ? ' c3-dot--on' : ''}`}
            onClick={() => setActive(i)} aria-label={`Project ${i + 1}`} />
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
            {mode === 'dev'
              ? <>Things I've <span className="gradient-text">Built</span></>
              : <>GoHighLevel <span className="gradient-text">Systems</span></>}
          </h2>
          <p className="section-subtitle">
            {mode === 'dev'
              ? 'Click the centre card to explore. Click the image to view full screen.'
              : 'Complete CRM systems built with GoHighLevel. Click to explore.'}
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
            <Carousel3D
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
