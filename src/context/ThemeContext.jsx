import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

const ThemeContext = createContext();

/* ─── Book-flip overlay ─── */
const FlipOverlay = ({ flipping, nextTheme }) => {
  if (!flipping) return null;

  /* The overlay is the colour of the INCOMING theme so when it lands flat
     you see the new theme's background */
  const incomingBg = nextTheme === 'dark' ? '#0f0e17' : '#fafaf9';
  const incomingAccent = nextTheme === 'dark'
    ? 'rgba(255,255,255,0.04)'
    : 'rgba(0,0,0,0.04)';

  return createPortal(
    <div className="flip-overlay" aria-hidden="true">
      {/* Back face — visible at start of flip (current theme colour, already set on html) */}
      <div className="flip-overlay__page flip-overlay__page--back" />
      {/* Front face — incoming theme colour */}
      <div
        className="flip-overlay__page flip-overlay__page--front"
        style={{ background: incomingBg }}
      >
        {/* Subtle grid texture on the front face */}
        <div className="flip-overlay__grid" style={{
          backgroundImage: `linear-gradient(${incomingAccent} 1px, transparent 1px),
                            linear-gradient(90deg, ${incomingAccent} 1px, transparent 1px)`,
        }} />
        {/* Spine shine — the fold highlight */}
        <div className="flip-overlay__shine" />
      </div>
    </div>,
    document.body
  );
};

export const ThemeProvider = ({ children }) => {
  const [theme,    setTheme]    = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
  const [flipping, setFlipping] = useState(false);
  const [nextTheme, setNext]    = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    if (flipping) return;
    const incoming = theme === 'light' ? 'dark' : 'light';
    setNext(incoming);
    setFlipping(true);
    document.documentElement.classList.add('theme-flipping');

    /* Switch theme at the edge-on midpoint — page is invisible so swap is seamless */
    timerRef.current = setTimeout(() => {
      setTheme(incoming);
    }, 360);

    /* Remove overlay after full animation completes */
    const endTimer = setTimeout(() => {
      setFlipping(false);
      setNext(null);
      document.documentElement.classList.remove('theme-flipping');
    }, 780);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(endTimer);
    };
  }, [theme, flipping]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, flipping }}>
      {children}
      <FlipOverlay flipping={flipping} nextTheme={nextTheme} />
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
