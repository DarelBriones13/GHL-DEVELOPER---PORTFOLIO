import { motion } from 'framer-motion';
import { FiSettings, FiBriefcase, FiCheck } from 'react-icons/fi';
import { ghlMode } from '../data/portfolioData';
import './Services.css';

const ICONS = { ghl: FiSettings, va: FiBriefcase };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const Services = () => (
  <section id="services" className="services section">
    <div className="container">
      <motion.div className="services__header" {...fadeUp(0)}>
        <span className="section-label">What I Do</span>
        <h2 className="section-title">
          Services &amp; <span className="gradient-text">Capabilities</span>
        </h2>
        <p className="section-subtitle">
          Complete business solutions combining GoHighLevel automation and reliable virtual assistance.
        </p>
      </motion.div>

      <div className="services__grid">
        {ghlMode.services.map((service, i) => {
          const Icon = ICONS[service.id] || FiSettings;
          return (
            <motion.div key={service.id} className="service-card glass-card" {...fadeUp(0.1 + i * 0.1)}>
              <div className="service-card__header">
                <div className="service-card__icon" aria-hidden="true">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__desc">{service.description}</p>
                </div>
              </div>

              <ul className="service-card__list">
                {service.items.map(item => (
                  <li key={item} className="service-card__item">
                    <FiCheck size={11} className="service-card__check" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Services;
