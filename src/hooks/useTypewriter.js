import { useState, useEffect, useRef } from 'react';

/**
 * Cycles through `phrases`, typing and deleting each one.
 */
export const useTypewriter = (phrases, typingSpeed = 80, deletingSpeed = 40, pauseMs = 1800) => {
  const [displayed, setDisplayed] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeout = useRef(null);

  useEffect(() => {
    const current = phrases[phraseIndex % phrases.length];

    const tick = () => {
      if (!isDeleting) {
        // Typing
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length + 1 === current.length) {
          // Pause then start deleting
          timeout.current = setTimeout(() => setIsDeleting(true), pauseMs);
          return;
        }
        timeout.current = setTimeout(tick, typingSpeed);
      } else {
        // Deleting
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length - 1 === 0) {
          setIsDeleting(false);
          setPhraseIndex(i => i + 1);
          return;
        }
        timeout.current = setTimeout(tick, deletingSpeed);
      }
    };

    timeout.current = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout.current);
  }, [displayed, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseMs]);

  return displayed;
};
