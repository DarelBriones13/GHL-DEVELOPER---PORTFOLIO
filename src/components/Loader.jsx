import { motion, AnimatePresence } from 'framer-motion';
import './Loader.css';

const Loader = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="loader__logo"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <span>D</span>
        </motion.div>
        <motion.div
          className="loader__bar"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
        <p className="loader__text">Loading portfolio...</p>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Loader;
