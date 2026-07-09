import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiExternalLink, FiGithub, FiX, FiCheck, FiClock,
  FiSettings, FiCpu, FiLayers, FiGlobe, FiSmartphone, FiLayout,
  FiChevronLeft, FiChevronRight, FiMaximize2,
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

/* ── 3 slot configs: left / centre / right ── */
const SLOTS = [
  { tx: '-32%', ry: 28, tz: -120, scale: 0.82, op: 0.60 }, // left
  { tx: '-50%', ry:  0, tz:    0, scale: 1.00, op: 1.00 }, // centre
  { tx: '-68%', ry:-28, tz: -120, scale: 0.82, op: 0.60 }, // right
];

/* ── Image lightbox ── */
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
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.img
        className="lb-img"
        src={src} alt={alt}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      />
      <button className="lb-close" onClick={onClose} aria-label="Close image">
        <FiX size={20} />
      </button>
    </motion.div>
  );
};

/* ── Detail modal ── */
const ProjectModal = ({ project, isGhl, onClose }) => {
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && !lightbox && onClose();
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose, lightbox]);

  return (
    <>
      <motion.div className="pm-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }} onClick={onClose}>
        <motion.div className="pm-panel"
          initial={{ opacity: 0, scale: 0.88, y: 48 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}>

          {/* Hero — click image to open lightbox */}
          <div className="pm-hero" style={{ background: project.gradient }}>
            {project.image && (
              <>
                <img src={project.image} alt={project.title} className="pm-hero__img" />
                <button
                  className="pm-expand"
                  onClick={() => setLightbox(true)}
                  aria-label="View full image"
                  title="View full image"
                >
                  <FiMaximize2 size={15} />
                </button>
              </>
            )}
            <div className="pm-hero__overlay" />
            <button className="pm-close" onClick={onClose} aria-label="Close"><FiX size={18} /></button>
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

      {/* Lightbox — on top of modal */}
      <AnimatePresence>
        {lightbox && project.image && (
          <Lightbox src={project.image} alt={project.title} onClose={() => setLightbox(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

/* ── 3-card 3D carousel ── */
const Carousel3D = ({ projects, isGhl }) => {
  const total = projects.length;
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(0);         // -1 left, +1 right for exit animation hint
  const [selected, setSelected] = useState(null);
  const dragX = useRef(0);
  const animating = useRef(false);

  const go = useCallback((delta) => {
    if (animating.current) return;
    animating.current = true;
    setDir(delta);
    setActive(c => ((c + delta) % total + total) % total);
    setTimeout(() => { animating.current = false; }, 420);
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

  // which project index maps to which slot (left=0, centre=1, right=2)
  const slotProjects = [
    projects[((active - 1) % total + total) % total],
    projects[active],
    projects[(active + 1) % total],
  ];

  return (
    <>
      <div className="c3-wrap">
        {/* Arrows */}
        <button className="c3-arrow c3-arrow--l" onClick={() => go(-1)} aria-label="Previous">
          <FiChevronLeft size={22} />
        </button>
        <button className="c3-arrow c3-arrow--r" onClick={() => go(1)} aria-label="Next">
          <FiChevronRight size={22} />
        </button>

        {/* Stage */}
        <div className="c3-stage"
          onMouseDown={e => { dragX.current = e.clientX; }}
          onMouseUp={e => { const d = e.clientX - dragX.current; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); }}
          onTouchStart={e => { dragX.current = e.touches[0].clientX; }}
          onTouchEnd={e => { const d = e.changedTouches[0].clientX - dragX.current; if (Math.abs(d) > 40) go(d < 0 ? 1 : -1); }}
        >
          {slotProjects.map((project, slot) => {
            const s = SLOTS[slot];
            const isCentre = slot === 1;
            const Icon = CATEGORY_ICON[project.category] || (isGhl ? FiSettings : FiGlobe);

            return (
              <motion.div
                key={`${active}-${slot}`}
                className={`c3-card${isCentre ? ' c3-card--active' : ''}`}
                style={{ left: s.tx }}
                animate={{
                  rotateY: s.ry,
                  z: s.tz,
                  scale: s.scale,
                  opacity: s.op,
                }}
                initial={{
                  rotateY: s.ry + (dir * -15),
                  z: s.tz - 60,
                  scale: s.scale - 0.05,
                  opacity: 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  mass: 0.85,
                }}
                onClick={() => {
                  if (isCentre) setSelected(project);
                  else go(slot === 0 ? -1 : 1);
                }}
              >
                {/* Image */}
                <div className="c3-card__img" style={{ background: project.gradient }}>
                  {project.image
                    ? <img src={project.image} alt={project.title} />
                    : <div className="c3-card__icon"><Icon size={36} /></div>
                  }
                  <div className="c3-card__vignette" />
                  {isCentre && <div className="c3-card__grad" />}
                </div>

                {/* Label — centre only */}
                <AnimatePresence>
                  {isCentre && (
                    <motion.div className="c3-card__info"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.28, delay: 0.1 }}>
                      <span className="c3-card__cat">{isGhl ? 'GoHighLevel' : project.category}</span>
                      <h3 className="c3-card__title">{project.title}</h3>
                      <span className="c3-card__hint">Click to view details</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="c3-dots">
        {projects.map((_, i) => (
          <button key={i}
            className={`c3-dot${i === active ? ' c3-dot--on' : ''}`}
            onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }}
            aria-label={`Project ${i + 1}`}
          />
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

/* ── Section ── */
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
              ? 'Click the centre card to explore — click the image inside to view it full screen.'
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
