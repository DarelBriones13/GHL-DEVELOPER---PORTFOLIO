import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLayout, FiServer, FiSmartphone, FiDatabase, FiCpu,
  FiSettings, FiMail, FiFileText, FiMonitor, FiBriefcase,
} from 'react-icons/fi';
import { devMode, ghlMode } from '../data/portfolioData';
import { useMode } from '../context/ModeContext';
import './Skills.css';

const DEV_ICONS   = { 'Frontend': FiLayout, 'Backend': FiServer, 'Database': FiDatabase, 'AI & Tools': FiCpu, 'Mobile': FiSmartphone };
const GHL_ICONS   = { 'GoHighLevel': FiSettings, 'Administrative': FiBriefcase, 'Google Suite': FiMonitor, 'Creative Tools': FiFileText, 'AI Productivity': FiCpu };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const SkillBar = ({ skill, index }) => (
  <div className="skill-bar">
    <div className="skill-bar__header">
      <span className="skill-bar__name">{skill.name}</span>
      <span className="skill-bar__level">{skill.level}%</span>
    </div>
    <div className="skill-bar__track">
      <motion.div
        className="skill-bar__fill"
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.1, delay: index * 0.05 + 0.2, ease: 'easeOut' }}
      />
    </div>
  </div>
);

const Skills = () => {
  const { mode } = useMode();
  const data = mode === 'dev' ? devMode.skills : ghlMode.skills;
  const iconMap = mode === 'dev' ? DEV_ICONS : GHL_ICONS;

  return (
    <section id="skills" className="skills-section section">
      <div className="container">
        <motion.div className="skills-section__header" {...fadeUp(0)}>
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

        <AnimatePresence mode="wait">
          <motion.div
            key={`skills-grid-${mode}`}
            className="skills-section__grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Bars */}
            <motion.div className="skills-section__bars glass-card" {...fadeUp(0.1)}>
              <h3 className="skills-section__col-title">Proficiency Levels</h3>
              <div className="skills-section__bars-list">
                {data.technical.map((skill, i) => (
                  <SkillBar key={`${mode}-${skill.name}`} skill={skill} index={i} />
                ))}
              </div>
            </motion.div>

            {/* Categories */}
            <div className="skills-section__categories">
              {data.categories.map((cat, i) => {
                const Icon = iconMap[cat.name] || FiLayout;
                return (
                  <motion.div key={`${mode}-${cat.name}`} className="skill-category glass-card" {...fadeUp(0.1 + i * 0.07)}>
                    <div className="skill-category__header">
                      <div className="skill-category__icon" aria-hidden="true">
                        <Icon size={14} />
                      </div>
                      <h4 className="skill-category__name">{cat.name}</h4>
                    </div>
                    <div className="skill-category__tags">
                      {cat.skills.map(s => (
                        <span key={s} className="skill-category__tag">{s}</span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tools */}
        <motion.div className="skills-section__tools" {...fadeUp(0.2)}>
          <h3 className="skills-section__tools-title">Tools &amp; Software</h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={`tools-${mode}`}
              className="skills-section__tools-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {data.tools.map((tool, i) => (
                <motion.div key={tool} className="tool-chip glass-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}>
                  <span className="tool-chip__name">{tool}</span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
