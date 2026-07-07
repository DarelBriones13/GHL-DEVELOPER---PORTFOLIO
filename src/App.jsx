import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider }  from './context/ThemeContext';
import { ModeProvider, useMode } from './context/ModeContext';
import Loader         from './components/Loader';
import ScrollProgress from './components/ScrollProgress';
import BackToTop      from './components/BackToTop';
import Navbar         from './components/Navbar';
import Sidebar        from './components/Sidebar';
import Hero           from './components/Hero';
import About          from './components/About';
import Services       from './components/Services';
import Experience     from './components/Experience';
import Projects       from './components/Projects';
import Skills         from './components/Skills';
import Certifications from './components/Certifications';
import Contact        from './components/Contact';
import Footer         from './components/Footer';
import './App.css';

function MainContent() {
  const { mode } = useMode();

  return (
    <main className="app__main">
      <Hero />
      <About />

      {/* Services section only in GHL mode */}
      <AnimatePresence mode="wait">
        {mode === 'ghl' && (
          <motion.div
            key="services"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Services />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experience section only in dev mode */}
      <AnimatePresence mode="wait">
        {mode === 'dev' && (
          <motion.div
            key="experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Experience />
          </motion.div>
        )}
      </AnimatePresence>

      <Projects />
      <Skills />
      <Certifications />
      <Contact />
      <Footer />
    </main>
  );
}

function AppContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Loader show={loading} />

      {!loading && (
        <div className="app">
          <ScrollProgress />
          <Navbar />
          <BackToTop />

          <div className="app__layout">
            <aside className="app__sidebar">
              <Sidebar />
            </aside>
            <MainContent />
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ModeProvider>
        <AppContent />
      </ModeProvider>
    </ThemeProvider>
  );
}
