import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiCalendar, FiCheck, FiSettings } from 'react-icons/fi';
import { certifications, devMode, ghlMode } from '../data/portfolioData';
import { useMode } from '../context/ModeContext';
import './Certifications.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const Certifications = () => {
  const { mode } = useMode();
  const whyMe = mode === 'dev' ? devMode.whyMe : ghlMode.whyMe;

  /* In dev mode show dev + shared certs; in ghl mode show ghl + shared */
  const visibleCerts = certifications.filter(c =>
    c.category === mode || c.category === 'both' || !c.category
  );

  return (
    <section id="certifications" className="certs section">
      <div className="container">
        <div className="certs__layout">

          {/* ── Left: Certifications timeline ── */}
          <div className="certs__left">
            <motion.div {...fadeUp(0)}>
              <span className="section-label">Certifications</span>
              <h2 className="section-title">
                Recognition &amp; <span className="gradient-text">Credentials</span>
              </h2>
              <p className="certs__subtitle">
                {mode === 'dev'
                  ? 'Technical skills and development certifications.'
                  : 'GoHighLevel, VA, and business automation credentials.'
                }
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`certs-${mode}`}
                className="certs__timeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {visibleCerts.map((cert, i) => {
                  const isGhl = cert.category === 'ghl';
                  const Icon = isGhl ? FiSettings : FiAward;
                  return (
                    <motion.div key={cert.id} className="cert-item" {...fadeUp(i * 0.09)}>
                      <div className="cert-item__line">
                        <div
                          className={`cert-item__dot${isGhl ? ' cert-item__dot--ghl' : ''}`}
                          aria-hidden="true"
                        >
                          <Icon size={15} />
                        </div>
                      </div>
                      <div className="cert-item__card glass-card">
                        <div className="cert-item__header">
                          <div
                            className={`cert-item__icon${isGhl ? ' cert-item__icon--ghl' : ''}`}
                            aria-hidden="true"
                          >
                            <Icon size={13} />
                          </div>
                          <span className="cert-item__date">
                            <FiCalendar size={10} aria-hidden="true" />
                            {cert.date}
                          </span>
                        </div>
                        <h4 className="cert-item__title">{cert.title}</h4>
                        <p className="cert-item__issuer">{cert.issuer}</p>
                        {isGhl && (
                          <span className="cert-item__tag">GoHighLevel</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right: Why Work With Me ── */}
          <div className="certs__right">
            <motion.div {...fadeUp(0.1)}>
              <span className="section-label">Why Work With Me</span>
              <h2 className="section-title">
                {mode === 'dev' ? 'A Developer' : 'A Specialist'}{' '}
                <span className="gradient-text">You Can Rely On</span>
              </h2>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`why-${mode}`}
                className="why-list glass-card"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                {whyMe.map((item, i) => (
                  <motion.div key={i} className="why-item" {...fadeUp(i * 0.07)}>
                    <div className="why-item__icon" aria-hidden="true">
                      <FiCheck size={13} />
                    </div>
                    <p className="why-item__text">{item}</p>
                  </motion.div>
                ))}

                <div className="why-tagline">
                  <p>
                    Building smart systems, automating business processes, and providing
                    reliable technical support through GoHighLevel, web development, and
                    virtual assistance.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Certifications;
