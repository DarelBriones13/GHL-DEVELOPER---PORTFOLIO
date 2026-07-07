import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiBriefcase, FiBookOpen, FiMapPin } from 'react-icons/fi';
import { devMode, education } from '../data/portfolioData';
import './Experience.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const ExperienceCard = ({ item, delay }) => (
  <motion.div className="exp-card glass-card" {...fadeUp(delay)}>
    <div className="exp-card__header">
      <div className="exp-card__dot" />
      <div className="exp-card__meta">
        <span className="exp-card__type">{item.type}</span>
        <div className="exp-card__period">
          <FiCalendar size={11} aria-hidden="true" />
          <span>{item.period}</span>
        </div>
      </div>
    </div>
    <h3 className="exp-card__title">{item.title}</h3>
    <p className="exp-card__desc">{item.description}</p>
    <ul className="exp-card__highlights">
      {item.highlights.map((h, i) => (
        <li key={i} className="exp-card__highlight">
          <FiCheckCircle className="exp-card__check" aria-hidden="true" />
          <span>{h}</span>
        </li>
      ))}
    </ul>
    <div className="exp-card__tech">
      {item.tech.map(t => (
        <span key={t} className="exp-card__tech-tag">{t}</span>
      ))}
    </div>
  </motion.div>
);

const EducationCard = ({ item, delay }) => (
  <motion.div className="edu-card glass-card" {...fadeUp(delay)}>
    <div className="edu-card__header">
      <div className="edu-card__icon-box" aria-hidden="true">
        <FiBookOpen size={16} />
      </div>
      <div>
        <div className="edu-card__period">
          <FiCalendar size={11} aria-hidden="true" />
          <span>{item.period}</span>
        </div>
        <span className="edu-card__status">{item.status}</span>
      </div>
    </div>
    <h3 className="edu-card__degree">{item.degree}</h3>
    <p className="edu-card__school">{item.school}</p>
    <p className="edu-card__location">
      <FiMapPin size={11} aria-hidden="true" />
      {item.location}
    </p>
    <div className="edu-card__focus">
      <p className="edu-card__focus-label">Focus Areas</p>
      <div className="edu-card__focus-tags">
        {item.focusAreas.map(area => (
          <span key={area} className="edu-card__focus-tag">{area}</span>
        ))}
      </div>
    </div>
  </motion.div>
);

const Experience = () => (
  <section id="experience" className="experience section">
    <div className="container">
      <motion.div className="experience__header" {...fadeUp(0)}>
        <span className="section-label">Experience &amp; Education</span>
        <h2 className="section-title">
          My Journey &amp; <span className="gradient-text">Background</span>
        </h2>
        <p className="section-subtitle">
          Building expertise through real-world projects and academic foundations.
        </p>
      </motion.div>

      <div className="experience__grid">
        <div className="experience__column">
          <motion.h3 className="experience__col-title" {...fadeUp(0.05)}>
            <FiBriefcase size={15} aria-hidden="true" />
            Projects &amp; Work
          </motion.h3>
          <div className="experience__timeline">
            {devMode.experience.map((item, i) => (
              <ExperienceCard key={item.id} item={item} delay={0.1 + i * 0.1} />
            ))}
          </div>
        </div>

        <div className="experience__column">
          <motion.h3 className="experience__col-title" {...fadeUp(0.05)}>
            <FiBookOpen size={15} aria-hidden="true" />
            Education
          </motion.h3>
          <div className="experience__timeline">
            {education.map((item, i) => (
              <EducationCard key={item.id} item={item} delay={0.15 + i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Experience;
