import React, { useState } from 'react';
import Sidebar from './Sidebar';
import BackgroundBlobs from './BackgroundBlobs';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout = ({ children, title = "Dashboard" }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="relative flex min-h-screen bg-dark-900 overflow-hidden font-sans text-gray-100">
      <BackgroundBlobs />
      
      {/* Animated Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-dark-900/40 px-6 backdrop-blur-xl lg:px-10">
          <div className="flex items-center gap-4">
            <button
              className="rounded-lg bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white lg:hidden transition-all duration-300"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
              <p className="text-sm text-gray-400 hidden sm:block">Welcome back, {user?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Optional Top Right Actions */}
            <div className="hidden sm:flex px-4 py-2 rounded-lg bg-brand-600/10 border border-brand-500/20 text-brand-300 text-sm font-medium">
              <span className="relative flex h-2 w-2 mr-2 mt-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              System Online
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mx-auto max-w-7xl"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
