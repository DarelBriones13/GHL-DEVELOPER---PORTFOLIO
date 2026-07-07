import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiExternalLink, FiGithub, FiStar,
  FiCpu, FiLayers, FiSmartphone, FiLayout, FiGlobe,
  FiSettings, FiCheck, FiClock,
} from 'react-icons/fi';
import { devMode, ghlMode } from '../data/portfolioData';
import { useMode } from '../context/ModeContext';
import './Projects.css';

const DEV_CATEGORIES = ['All', 'Web Application', 'AI & Automation'];
const CATEGORY_ICON  = { 'AI & Automation': FiCpu, 'Web Application': FiLayers, 'Mobile': FiSmartphone, 'Frontend': FiLayout };

const PROFILE_PIC = '/assets/profile-pic.png';

/* ── Developer project card ── */
const DevCard = ({ project, index }) => {
  const Icon = CATEGORY_ICON[project.category] || FiGlobe;
  return (
    <motion.div
      className={`project-card glass-card${project.featured ? ' project-card--featured' : ''}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {/* Card image — real photo if available, gradient + icon otherwise */}
      <div className="project-card__image" style={{ background: project.gradient }}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="project-card__real-img"
          />
        ) : (
          <div className="project-card__icon-wrap" aria-hidden="true">
            <Icon size={30} />
          </div>
        )}
        {project.featured && (
          <div className="project-card__featured-badge">
            <FiStar size={9} /><span>Featured</span>
          </div>
        )}
        <div className="project-card__overlay">
          <a href={project.demo}   target="_blank" rel="noopener noreferrer" className="project-card__overlay-btn"><FiExternalLink size={13} /><span>Demo</span></a>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-card__overlay-btn project-card__overlay-btn--ghost"><FiGithub size={13} /><span>Code</span></a>
        </div>
      </div>
      <div className="project-card__content">
        <span className="project-card__category">{project.category}</span>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        <div className="project-card__tech">
          {project.tech.map(t => <span key={t} className="project-card__tech-tag">{t}</span>)}
        </div>
        <div className="project-card__actions">
          <a href={project.demo}   target="_blank" rel="noopener noreferrer" className="project-card__btn project-card__btn--primary"><FiExternalLink size={12} /> Live Demo</a>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-card__btn project-card__btn--ghost"><FiGithub size={12} /> GitHub</a>
        </div>
      </div>
    </motion.div>
  );
};

/* ── GHL portfolio card ── */
const GhlCard = ({ project, index }) => (
  <motion.div
    className="project-card glass-card"
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3, delay: index * 0.06 }}
  >
    <div className="project-card__image" style={{ background: project.gradient }}>
      <div className="project-card__icon-wrap" aria-hidden="true"><FiSettings size={30} /></div>
      {project.status === 'upcoming' && (
        <div className="project-card__upcoming-badge">
          <FiClock size={9} /><span>Upcoming</span>
        </div>
      )}
    </div>
    <div className="project-card__content">
      <span className="project-card__category">GoHighLevel CRM</span>
      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__desc">{project.description}</p>
      <div className="project-card__features">
        {project.features.map(f => (
          <span key={f} className="project-card__feature">
            <FiCheck size={10} aria-hidden="true" />{f}
          </span>
        ))}
      </div>
      {project.status !== 'upcoming' && (
        <div className="project-card__actions">
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-card__btn project-card__btn--primary"><FiExternalLink size={12} /> View System</a>
        </div>
      )}
    </div>
  </motion.div>
);

const Projects = () => {
  const { mode } = useMode();
  const [activeFilter, setActiveFilter] = useState('All');

  const devFiltered = activeFilter === 'All'
    ? devMode.projects
    : devMode.projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="projects section">
      <div className="container">
        <motion.div
          className="projects__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
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
              ? 'Real-world applications demonstrating full-stack development skills.'
              : 'Complete CRM systems and automation solutions built with GoHighLevel.'
            }
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={`projects-mode-${mode}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dev: filter tabs */}
            {mode === 'dev' && (
              <div className="projects__filters">
                {DEV_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`projects__filter-btn${activeFilter === cat ? ' projects__filter-btn--active' : ''}`}
                    onClick={() => setActiveFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* GHL: section label */}
            {mode === 'ghl' && (
              <div className="projects__ghl-notice">
                <FiClock size={14} aria-hidden="true" />
                <span>Portfolio projects currently in development. Coming soon.</span>
              </div>
            )}

            <motion.div className="projects__grid" layout>
              <AnimatePresence mode="popLayout">
                {mode === 'dev'
                  ? devFiltered.map((p, i) => <DevCard key={p.id} project={p} index={i} />)
                  : ghlMode.projects.map((p, i) => <GhlCard key={p.id} project={p} index={i} />)
                }
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
