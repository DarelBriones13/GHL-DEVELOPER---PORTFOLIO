import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <div className="layout__container">
        {/* Sidebar */}
        <motion.div
          className="layout__sidebar"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Sidebar />
        </motion.div>

        {/* Main Content */}
        <main className="layout__main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
