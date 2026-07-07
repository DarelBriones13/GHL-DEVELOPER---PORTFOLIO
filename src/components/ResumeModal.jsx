import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiExternalLink } from 'react-icons/fi';
import { useMode } from '../context/ModeContext';
import './ResumeModal.css';

const RESUMES = {
  dev: {
    file:     '/documents/BRIONES RESUME - DEVELOPER.pdf',
    label:    'Developer Resume',
    badge:    'Developer',
    download: 'Darel_Briones_Developer_Resume.pdf',
  },
  ghl: {
    file:     '/documents/BRIONES RESUME - GHL.pdf',
    label:    'GHL & VA Resume',
    badge:    'GHL & VA',
    download: 'Darel_Briones_GHL_VA_Resume.pdf',
  },
};

const ResumeModal = ({ open, onClose }) => {
  const { mode } = useMode();
  const resume = RESUMES[mode];

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose]);

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* ── Portal renders directly on document.body ── */
  return createPortal(
    <AnimatePresence>
      {open && (
        /* Outer layer: full-screen fixed flex container */
        <div className="rm-overlay">

          {/* Backdrop — click closes modal */}
          <motion.div
            className="rm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel — centred by flexbox on rm-overlay */}
          <motion.div
            className="rm-panel"
            role="dialog"
            aria-modal="true"
            aria-label={resume.label}
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.94, y: 28 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="rm-header">
              <div className="rm-title-wrap">
                <span className="rm-badge">{resume.badge}</span>
                <h2 className="rm-title">{resume.label}</h2>
              </div>

              <div className="rm-actions">
                <a
                  href={resume.file}
                  download={resume.download}
                  className="rm-download btn-primary"
                >
                  <FiDownload size={13} /> Download
                </a>

                <a
                  href={resume.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rm-icon-btn"
                  aria-label="Open in new tab"
                  title="Open in new tab"
                >
                  <FiExternalLink size={15} />
                </a>

                <button
                  className="rm-icon-btn rm-close"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* PDF iframe */}
            <div className="rm-body">
              <iframe
                key={`${mode}-${resume.file}`}
                src={`${resume.file}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                title={resume.label}
                className="rm-iframe"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body   /* ← portal target: always the root, never inside sidebar */
  );
};

export default ResumeModal;
