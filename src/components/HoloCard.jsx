import { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useMode } from '../context/ModeContext';
import './HoloCard.css';

const PORTFOLIO_URL = 'https://ghl-developer-portfolio.vercel.app/';
const PROFILE_PIC   = '/assets/profile-pic.png';

/* ── Minimal inline QR (SVG path generated for the portfolio URL) ── */
/* We render a simple grid pattern that visually represents a QR code.
   For a real scannable QR, you'd use a library like 'qrcode.react'. */
const QRGrid = () => (
  <svg viewBox="0 0 29 29" className="hc-qr" aria-label="QR code linking to portfolio">
    {/* Position detection squares */}
    {/* TL */}
    <rect x="0" y="0" width="7" height="7" fill="currentColor"/>
    <rect x="1" y="1" width="5" height="5" fill="var(--hc-bg)"/>
    <rect x="2" y="2" width="3" height="3" fill="currentColor"/>
    {/* TR */}
    <rect x="22" y="0" width="7" height="7" fill="currentColor"/>
    <rect x="23" y="1" width="5" height="5" fill="var(--hc-bg)"/>
    <rect x="24" y="2" width="3" height="3" fill="currentColor"/>
    {/* BL */}
    <rect x="0" y="22" width="7" height="7" fill="currentColor"/>
    <rect x="1" y="23" width="5" height="5" fill="var(--hc-bg)"/>
    <rect x="2" y="24" width="3" height="3" fill="currentColor"/>
    {/* Data cells — pseudo-random pattern */}
    {[
      [9,0],[11,0],[13,0],[15,0],[17,0],[19,0],
      [9,2],[12,2],[14,2],[18,2],
      [10,3],[11,3],[14,3],[17,3],[19,3],
      [9,4],[12,4],[13,4],[15,4],[18,4],
      [10,5],[14,5],[16,5],[19,5],
      [9,6],[11,6],[13,6],[15,6],[17,6],[19,6],
      [0,9],[2,9],[5,9],[7,9],[10,9],[12,9],[14,9],[16,9],[18,9],
      [1,10],[3,10],[6,10],[9,10],[11,10],[15,10],[17,10],[19,10],
      [0,11],[4,11],[7,11],[10,11],[12,11],[14,11],[16,11],[18,11],
      [2,12],[5,12],[8,12],[11,12],[13,12],[15,12],[17,12],[19,12],
      [0,13],[3,13],[6,13],[9,13],[12,13],[14,13],[16,13],[18,13],
      [1,14],[4,14],[7,14],[10,14],[13,14],[15,14],[17,14],[19,14],
      [0,15],[2,15],[5,15],[8,15],[11,15],[14,15],[16,15],[18,15],
      [1,16],[3,16],[6,16],[9,16],[12,16],[15,16],[17,16],[19,16],
      [0,17],[4,17],[7,17],[10,17],[13,17],[15,17],[18,17],
      [1,18],[3,18],[5,18],[8,18],[11,18],[14,18],[16,18],[19,18],
      [0,19],[2,19],[6,19],[9,19],[12,19],[15,19],[17,19],
      [9,22],[11,22],[14,22],[16,22],[18,22],
      [10,23],[13,23],[15,23],[17,23],[19,23],
      [9,24],[12,24],[14,24],[16,24],[18,24],
      [10,25],[11,25],[13,25],[15,25],[17,25],[19,25],
      [9,26],[12,26],[14,26],[16,26],[18,26],
      [10,27],[13,27],[15,27],[17,27],[19,27],
      [9,28],[11,28],[14,28],[16,28],[18,28],
    ].map(([x,y], i) => (
      <rect key={i} x={x} y={y} width="1" height="1" fill="currentColor"/>
    ))}
  </svg>
);

/* ── NFC wave icon ── */
const NFCIcon = () => (
  <svg viewBox="0 0 24 24" className="hc-nfc-icon" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8.5 9.5C9.8 8.2 11 7.5 12 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M6 7C8.2 4.8 10.2 3.5 12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M10.5 12C10.5 10.6 11.2 9.5 12 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="12" cy="14.5" r="1.5" fill="currentColor"/>
  </svg>
);

/* ── Main HoloCard ── */
const HoloCard = () => {
  const { mode } = useMode();
  const cardRef  = useRef(null);
  const [hovered, setHovered]   = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [blinkOn, setBlinkOn]   = useState(true);

  /* LED blink */
  useEffect(() => {
    const id = setInterval(() => setBlinkOn(b => !b), 1400);
    return () => clearInterval(id);
  }, []);

  /* Spring physics for tilt */
  const rotX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotY = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width;   // 0→1
    const ny = (e.clientY - rect.top)  / rect.height;  // 0→1
    setMousePos({ x: nx, y: ny });
    rotX.set((ny - 0.5) * -22);   // tilt up/down
    rotY.set((nx - 0.5) *  22);   // tilt left/right
  };

  const handleMouseLeave = () => {
    setHovered(false);
    rotX.set(0);
    rotY.set(0);
    setMousePos({ x: 0.5, y: 0.5 });
  };

  /* Holographic shine gradient position follows cursor */
  const shineX = useTransform(rotY, [-11, 11], ['0%', '100%']);
  const shineY = useTransform(rotX, [-11, 11], ['0%', '100%']);

  const role = mode === 'dev' ? 'Full-Stack Developer' : 'GHL Developer & VA';
  const dept = mode === 'dev' ? 'DEV-UNIT // WEBSTACK' : 'GHL-UNIT // CRM-OPS';
  const id   = mode === 'dev' ? 'DB-2025-DEV-001' : 'DB-2025-GHL-001';

  return (
    <motion.div
      ref={cardRef}
      className="hc-scene"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
    >
      {/* ── Card body ── */}
      <div className={`hc-card${hovered ? ' hc-card--hovered' : ''}`}>

        {/* Holographic rainbow layer */}
        <motion.div
          className="hc-holo"
          style={{
            backgroundPosition: `${mousePos.x * 100}% ${mousePos.y * 100}%`,
            opacity: hovered ? 0.7 : 0.15,
          }}
        />

        {/* Cursor-following specular highlight */}
        <div
          className="hc-specular"
          style={{
            background: `radial-gradient(circle 160px at ${mousePos.x * 100}% ${mousePos.y * 100}%,
              rgba(255,255,255,0.35) 0%,
              rgba(255,255,255,0.08) 45%,
              transparent 70%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Scan-line overlay */}
        <div className="hc-scanlines" />

        {/* ── Top bar ── */}
        <div className="hc-topbar">
          <span className="hc-corp">DAREL BRIONES</span>
          <div className="hc-led-wrap">
            <span className="hc-led-label">LIVE</span>
            <span className={`hc-led${blinkOn ? ' hc-led--on' : ''}`} />
          </div>
        </div>

        {/* ── Header strip ── */}
        <div className="hc-header-strip">
          <div className="hc-chip">
            <div className="hc-chip-lines">
              {[...Array(4)].map((_,i) => <div key={i} className="hc-chip-line" />)}
            </div>
          </div>
          <div>
            <div className="hc-access-label">ACCESS CARD</div>
            <div className="hc-unit">{dept}</div>
          </div>
          <NFCIcon />
        </div>

        {/* ── Photo + Info ── */}
        <div className="hc-main">
          <div className="hc-photo-wrap">
            <img
              src={PROFILE_PIC}
              alt="Darel S. Briones"
              className="hc-photo"
              onError={e => {
                e.currentTarget.style.display = 'none';
                const fb = e.currentTarget.parentNode.querySelector('.hc-photo-fallback');
                if (fb) fb.style.display = 'flex';
              }}
            />
            <div className="hc-photo-fallback">DB</div>
            <div className="hc-photo-ring" />
          </div>
          <div className="hc-info">
            <div className="hc-name">DAREL S. BRIONES</div>
            <div className="hc-role">{role}</div>
            <div className="hc-id">ID: {id}</div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="hc-divider" />

        {/* ── Bottom: QR + meta ── */}
        <div className="hc-bottom">
          <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer"
            className="hc-qr-wrap" title="Scan to visit portfolio">
            <QRGrid />
            <span className="hc-qr-label">PORTFOLIO</span>
          </a>
          <div className="hc-meta">
            <div className="hc-meta-row">
              <span className="hc-meta-key">STATUS</span>
              <span className="hc-meta-val hc-meta-val--green">● ACTIVE</span>
            </div>
            <div className="hc-meta-row">
              <span className="hc-meta-key">CLEARANCE</span>
              <span className="hc-meta-val">LEVEL 5</span>
            </div>
            <div className="hc-meta-row">
              <span className="hc-meta-key">ISSUED</span>
              <span className="hc-meta-val">2025-01</span>
            </div>
            <div className="hc-meta-row">
              <span className="hc-meta-key">EXPIRES</span>
              <span className="hc-meta-val">∞</span>
            </div>
          </div>
        </div>

        {/* Magnetic stripe */}
        <div className="hc-stripe" />

        {/* Bottom text */}
        <div className="hc-footer-text">
          AUTHORIZED PERSONNEL ONLY // HOLOGRAPHIC SECURITY BADGE
        </div>
      </div>

      {/* Drop shadow that moves with tilt */}
      <motion.div
        className="hc-shadow"
        style={{
          x: useTransform(rotY, [-11, 11], ['8px', '-8px']),
          y: useTransform(rotX, [-11, 11], ['-8px', '8px']),
          opacity: hovered ? 0.5 : 0.25,
        }}
      />
    </motion.div>
  );
};

export default HoloCard;
