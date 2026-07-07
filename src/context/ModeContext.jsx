import { createContext, useContext, useState } from 'react';

// 'dev' = Full-Stack Developer mode
// 'ghl' = GoHighLevel / VA mode
const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('dev');
  const toggleMode = (m) => setMode(m);
  return (
    <ModeContext.Provider value={{ mode, setMode: toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
};
