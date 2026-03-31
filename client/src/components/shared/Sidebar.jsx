import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();

  const roleLinks = {
    admin: [
      { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/users', label: 'Manage Users', icon: Users },
    ],
    faculty: [
      { path: '/faculty', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/faculty/projects', label: 'Projects', icon: BookOpen },
    ],
    mentor: [
      { path: '/mentor', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/mentor/students', label: 'My Students', icon: Users },
    ],
    student: [
      { path: '/student', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/student/log/new', label: 'Submit Log', icon: FileText },
    ]
  };

  const links = roleLinks[user?.role] || [];

  const navVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isMobileOpen ? 0 : (window.innerWidth >= 1024 ? 0 : -300) }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-white/10 glass shadow-2xl lg:sticky lg:top-0 h-screen`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-white/10 bg-dark-900/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <LayoutDashboard size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">RBACS</span>
            </div>
            <button 
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* User Profile Snippet */}
          <div className="p-6">
            <div className="flex items-center gap-3 rounded-xl bg-dark-800/40 p-4 border border-white/5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                <p className="truncate text-xs text-brand-300 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <motion.nav 
            variants={navVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 space-y-2 px-4 py-2 overflow-y-auto"
          >
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.path} variants={itemVariants}>
                  <NavLink
                    to={link.path}
                    end={link.path === `/${user?.role}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`
                    }
                  >
                    <Icon size={18} />
                    {link.label}
                  </NavLink>
                </motion.div>
              );
            })}
          </motion.nav>

          {/* Logout Footer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
