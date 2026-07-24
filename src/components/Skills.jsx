import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft, FiChevronRight,
  FiLayout, FiServer, FiSmartphone, FiDatabase, FiCpu,
  FiSettings, FiBriefcase, FiMonitor, FiFileText,
} from 'react-icons/fi';
import {
  SiGithub, SiFigma, SiPostman, SiAndroidstudio, SiCanva,
  SiOpenai, SiZapier,
  SiVscodium,
  SiReact, SiLaravel, SiPython, SiMysql, SiPostgresql,
  SiSupabase, SiFlutter, SiDart, SiHtml5, SiJavascript,
  SiPhp, SiBootstrap, SiFirebase, SiNodedotjs,
  SiGoogledrive, SiGooglesheets, SiGoogledocs, SiGooglecalendar, SiGmail,
} from 'react-icons/si';
import { devMode, ghlMode } from '../data/portfolioData';
import { useMode } from '../context/ModeContext';
import './Skills.css';

/* ── Brand icon + colour map ── */
const BRAND = {
  /* Dev tools */
  'VS Code':        { Icon: SiVscodium,       color: '#007ACC' },
  'GitHub':         { Icon: SiGithub,          color: '#333333' },
  'Figma':          { Icon: SiFigma,           color: '#F24E1E' },
  'Postman':        { Icon: SiPostman,         color: '#FF6C37' },
  'Android Studio': { Icon: SiAndroidstudio,  color: '#3DDC84' },
  'Canva':          { Icon: SiCanva,           color: '#00C4CC' },
  /* GHL tools */
  'GoHighLevel':    { Icon: SiSettings,        color: '#1DB954', useFi: true },
  'Google Workspace':{ Icon: SiGoogledrive,   color: '#4285F4' },
  'Microsoft Office':{ Icon: SiGoogledocs,    color: '#D83B01' },
  'ChatGPT':        { Icon: SiOpenai,         color: '#10A37F' },
  'Zapier':         { Icon: SiZapier,          color: '#FF4A00' },
  /* Skills */
  'React.js':       { Icon: SiReact,           color: '#61DAFB' },
  'Laravel':        { Icon: SiLaravel,         color: '#FF2D20' },
  'Laravel / PHP':  { Icon: SiLaravel,         color: '#FF2D20' },
  'Python':         { Icon: SiPython,          color: '#3776AB' },
  'MySQL':          { Icon: SiMysql,           color: '#4479A1' },
  'MySQL / PostgreSQL': { Icon: SiMysql,       color: '#4479A1' },
  'PostgreSQL':     { Icon: SiPostgresql,      color: '#336791' },
  'Supabase':       { Icon: SiSupabase,        color: '#3ECF8E' },
  'Flutter':        { Icon: SiFlutter,         color: '#02569B' },
  'Flutter / Dart': { Icon: SiFlutter,         color: '#02569B' },
  'Dart':           { Icon: SiDart,            color: '#0175C2' },
  'HTML5 / CSS3':   { Icon: SiHtml5,           color: '#E34F26' },
  'JavaScript':     { Icon: SiJavascript,      color: '#F7DF1E' },
  'PHP':            { Icon: SiPhp,             color: '#777BB4' },
  'Bootstrap':      { Icon: SiBootstrap,       color: '#7952B3' },
  'Firebase':       { Icon: SiFirebase,        color: '#FFCA28' },
  'Node.js':        { Icon: SiNodedotjs,       color: '#339933' },
  'REST APIs':      { Icon: SiNodedotjs,       color: '#339933' },
  'Git / GitHub':   { Icon: SiGithub,          color: '#333333' },
  /* GHL skills */
  'GoHighLevel CRM':{ Icon: SiSettings,        color: '#1DB954', useFi: true },
  'Google Workspace skills': { Icon: SiGoogledrive, color: '#4285F4' },
  'Sheets':         { Icon: SiGooglesheets,    color: '#34A853' },
  'Docs':           { Icon: SiGoogledocs,      color: '#4285F4' },
  'Drive':          { Icon: SiGoogledrive,     color: '#4285F4' },
  'Gmail':          { Icon: SiGmail,           color: '#EA4335' },
  'Calendar':       { Icon: SiGooglecalendar,  color: '#1A73E8' },
};

const getBrand = (name) => BRAND[name] || null;

/* Category icon map */
const DEV_CAT_ICONS  = { 'Frontend': FiLayout, 'Backend': FiServer, 'Database': FiDatabase, 'AI & Tools': FiCpu, 'Mobile': FiSmartphone };
const GHL_CAT_ICONS  = { 'GoHighLevel': FiSettings, 'Administrative': FiBriefcase, 'Google Suite': FiMonitor, 'Creative Tools': FiFileText, 'AI Productivity': FiCpu };

/* ── Animated SVG proficiency ring ── */
const SkillRing = ({ level }) => {
  const size = 82, stroke = 6;
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ - (level / 100) * circ;
  return (
    <svg width={size} height={size} className="sk-ring" aria-hidden="true">
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="var(--color-border)" strokeWidth={stroke} />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="var(--color-brand)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: dash }}
        transition={{ duration: 1.1, ease: [0.22,1,0.36,1], delay: 0.1 }}
        style={{ transform:'rotate(-90deg)', transformOrigin:'50% 50%' }} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
        className="sk-ring__label">{level}%</text>
    </svg>
  );
};

/* ── Skill bar inside slide ── */
const SkillBar = ({ name, level, index }) => (
  <div className="sk-bar">
    <div className="sk-bar__row">
      <span className="sk-bar__name">{name}</span>
      <span className="sk-bar__pct">{level}%</span>
    </div>
    <div className="sk-bar__track">
      <motion.div className="sk-bar__fill"
        initial={{ width: 0 }}
        animate={{ width: `${level}%` }}
        transition={{ duration: 0.9, delay: index * 0.07 + 0.15, ease: [0.22,1,0.36,1] }} />
    </div>
  </div>
);

/* ── Slide animation variants ── */
const variants = {
  enter: (d) => ({ x: d > 0 ? 140 : -140, opacity: 0, scale: 0.93 }),
  centre:      { x: 0, opacity: 1, scale: 1,
    transition: { type:'spring', stiffness:300, damping:28, mass:0.9 } },
  exit: (d) => ({ x: d > 0 ? -140 : 140, opacity: 0, scale: 0.93,
    transition: { duration:0.2, ease:'easeIn' } }),
};

/* ── Tool chip with brand icon ── */
const ToolChip = ({ name }) => {
  const brand = getBrand(name);
  return (
    <span className="sk-tool-chip glass-card">
      {brand && (
        <span className="sk-tool-chip__icon" style={{ color: brand.color }}>
          <brand.Icon size={16} />
        </span>
      )}
      <span className="sk-tool-chip__name">{name}</span>
    </span>
  );
};

/* ── Seamless marquee — CSS animation with JS-doubled array ── */
const Marquee = ({ tools }) => {
  /* Triple the items so the seam is never visible */
  const items = [...tools, ...tools, ...tools];
  return (
    <div className="sk-marquee-wrap">
      <div className="sk-marquee">
        {items.map((tool, i) => (
          <ToolChip key={`${tool}-${i}`} name={tool} />
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
const Skills = () => {
  const { mode } = useMode();
  const data     = mode === 'dev' ? devMode.skills  : ghlMode.skills;
  const catIcons = mode === 'dev' ? DEV_CAT_ICONS   : GHL_CAT_ICONS;

  /* Build slides */
  const slides = data.categories.map(cat => {
    const bars = data.technical.filter(t =>
      cat.skills.some(s =>
        t.name.toLowerCase().includes(s.toLowerCase().split(' ')[0]) ||
        s.toLowerCase().includes(t.name.split(' ')[0].toLowerCase())
      )
    ).slice(0, 4);
    const avg = bars.length
      ? Math.round(bars.reduce((a,b)=>a+b.level,0)/bars.length)
      : 74;
    return { ...cat, Icon: catIcons[cat.name] || FiLayout, bars, avg };
  });

  const total = slides.length;
  const [active, setActive] = useState(0);
  const [dir,    setDir]    = useState(1);
  const dragX  = useRef(0);
  const locked = useRef(false);

  const go = useCallback((delta) => {
    if (locked.current) return;
    locked.current = true;
    setDir(delta);
    setActive(c => ((c + delta) % total + total) % total);
    setTimeout(() => { locked.current = false; }, 460);
  }, [total]);

  useEffect(() => { setActive(0); setDir(1); }, [mode]);
  useEffect(() => {
    const id = setInterval(() => go(1), 4200);
    return () => clearInterval(id);
  }, [go]);

  const s = slides[active];

  return (
    <section id="skills" className="skills-section section">
      <div className="container">

        {/* Header */}
        <motion.div className="skills-section__header"
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0.1 }} transition={{ duration:0.5 }}>
          <span className="section-label">Skills &amp; Expertise</span>
          <h2 className="section-title">
            {mode==='dev' ? 'Technical' : 'Professional'}{' '}
            <span className="gradient-text">Skills</span>
          </h2>
          <p className="section-subtitle">
            {mode==='dev'
              ? 'Technologies and tools I use to build scalable web applications.'
              : 'Platforms, tools, and skills I use to manage and automate business systems.'}
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="sk-carousel">
          <button className="sk-arrow sk-arrow--l" onClick={()=>go(-1)} aria-label="Previous">
            <FiChevronLeft size={20}/>
          </button>

          <div className="sk-window"
            onMouseDown ={e=>{dragX.current=e.clientX;}}
            onMouseUp   ={e=>{const d=e.clientX-dragX.current;if(Math.abs(d)>50)go(d<0?1:-1);}}
            onTouchStart={e=>{dragX.current=e.touches[0].clientX;}}
            onTouchEnd  ={e=>{const d=e.changedTouches[0].clientX-dragX.current;if(Math.abs(d)>40)go(d<0?1:-1);}}>
            <AnimatePresence custom={dir} mode="wait">
              <motion.div key={`${mode}-${active}`} className="sk-slide glass-card"
                custom={dir} variants={variants}
                initial="enter" animate="centre" exit="exit">

                {/* Top row */}
                <div className="sk-slide__top">
                  <div className="sk-slide__icon-wrap">
                    <s.Icon size={22}/>
                  </div>
                  <div className="sk-slide__meta">
                    <h3 className="sk-slide__name">{s.name}</h3>
                    <p className="sk-slide__count">{s.skills.length} skills</p>
                  </div>
                  <SkillRing level={s.avg}/>
                </div>

                {/* Bars */}
                {s.bars.length > 0 && (
                  <div className="sk-slide__bars">
                    {s.bars.map((b,i)=><SkillBar key={b.name} name={b.name} level={b.level} index={i}/>)}
                  </div>
                )}

                {/* Tag cloud with brand icons */}
                <div className="sk-slide__tags">
                  {s.skills.map(skill => {
                    const brand = getBrand(skill);
                    return (
                      <span key={skill} className="sk-tag">
                        {brand && (
                          <span className="sk-tag__icon" style={{ color: brand.color }}>
                            <brand.Icon size={12}/>
                          </span>
                        )}
                        {skill}
                      </span>
                    );
                  })}
                </div>

                {/* Slide counter */}
                <div className="sk-slide__counter">
                  {active+1} / {total}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="sk-arrow sk-arrow--r" onClick={()=>go(1)} aria-label="Next">
            <FiChevronRight size={20}/>
          </button>
        </div>

        {/* Dots */}
        <div className="sk-dots">
          {slides.map((_,i)=>(
            <button key={i}
              className={`sk-dot${i===active?' sk-dot--on':''}`}
              onClick={()=>{setDir(i>active?1:-1);setActive(i);}}
              aria-label={`Skill ${i+1}`}/>
          ))}
        </div>

        {/* Tools marquee */}
        <AnimatePresence mode="wait">
          <motion.div className="sk-tools" key={`tools-${mode}`}
            initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}
            exit={{opacity:0}} transition={{duration:0.3,delay:0.1}}>
            <p className="sk-tools__label">Tools &amp; Software</p>
            <Marquee tools={data.tools}/>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Skills;
