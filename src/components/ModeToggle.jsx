import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiSettings } from 'react-icons/fi';
import { useMode } from '../context/ModeContext';
import './ModeToggle.css';

// Unique counter so multiple instances never share the same layoutId
let instanceCount = 0;

const ModeToggle = () => {
  const { mode, setMode } = useMode();
  // Stable ref-based instance ID — never changes after mount
  const idRef = useRef(null);
  if (idRef.current === null) {
    idRef.current = `mode-ind-${instanceCount++}`;
  }

  return (
    <div className="mode-toggle" role="group" aria-label="Portfolio mode">
      <button
        className={`mode-toggle__btn${mode === 'dev' ? ' mode-toggle__btn--active' : ''}`}
        onClick={() => setMode('dev')}
        aria-pressed={mode === 'dev'}
      >
        <FiCode size={13} aria-hidden="true" />
        <span>Developer</span>
      </button>

      <button
        className={`mode-toggle__btn${mode === 'ghl' ? ' mode-toggle__btn--active' : ''}`}
        onClick={() => setMode('ghl')}
        aria-pressed={mode === 'ghl'}
      >
        <FiSettings size={13} aria-hidden="true" />
        <span>GHL &amp; VA</span>
      </button>

      {/* Each ModeToggle instance has its own layoutId — no cross-instance conflicts */}
      <motion.div
        className="mode-toggle__indicator"
        layoutId={idRef.current}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        style={{ left: mode === 'dev' ? 2 : 'calc(50% + 1px)' }}
      />
    </div>
  );
};

export default ModeToggle;
