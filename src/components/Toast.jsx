import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import './Toast.css';

/**
 * Toast — renders via portal so it's always on top of everything.
 * Props:
 *   show     {boolean}  — controls visibility
 *   onClose  {fn}       — called when dismissed or auto-closed
 *   message  {string}   — main text
 *   duration {number}   — ms before auto-close (default 4000)
 */
const Toast = ({ show, onClose, message = "Message sent! I'll get back to you soon.", duration = 4500 }) => {

  /* Auto-dismiss */
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [show, onClose, duration]);

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          className="toast"
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 24, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        >
          {/* Icon */}
          <div className="toast__icon" aria-hidden="true">
            <FiCheckCircle size={20} />
          </div>

          {/* Text */}
          <div className="toast__body">
            <p className="toast__title">Message Sent!</p>
            <p className="toast__msg">{message}</p>
          </div>

          {/* Close button */}
          <button
            className="toast__close"
            onClick={onClose}
            aria-label="Dismiss notification"
          >
            <FiX size={15} />
          </button>

          {/* Progress bar — shrinks to 0 over `duration` ms */}
          <motion.div
            className="toast__progress"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Toast;
