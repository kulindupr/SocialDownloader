import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Download, Menu, X, Youtube, Facebook, Instagram, Music2 } from 'lucide-react';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/youtube', label: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600', badge: 'Playlists' },
    { path: '/facebook', label: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-600' },
    { path: '/instagram', label: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600' },
    { path: '/tiktok', label: 'TikTok', icon: TikTokIcon, color: 'from-gray-900 to-gray-700 dark:from-white dark:to-gray-300' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl shadow-lg border-b border-white/20 dark:border-gray-700/30'
          : 'py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Relative container for absolute centering */}
        <div className="relative flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2 group z-10">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <Download className="w-4 h-4 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
            </div>
            <span className="hidden sm:block text-base font-bold text-gradient">SocialDL</span>
          </Link>

          {/* Center: Navigation - ABSOLUTELY CENTERED on full navbar width */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-1.5 border border-white/20 dark:border-gray-700/30">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive(link.path)
                        ? `bg-gradient-to-r ${link.color} text-white shadow-lg`
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive(link.path) ? '' : link.path === '/tiktok' ? 'text-gray-900 dark:text-white' : ''}`} />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        isActive(link.path) 
                          ? 'bg-white/20 text-white' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </motion.div>
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            </div>
          </div>

          {/* Right: Theme toggle + Mobile menu */}
          <div className="flex items-center gap-2 z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 flex items-center justify-center cursor-pointer transition-all hover:bg-gray-200/80 dark:hover:bg-gray-700/80"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 flex items-center justify-center cursor-pointer"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? 'close' : 'menu'}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Menu className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-3 overflow-hidden"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-2 border border-white/20 dark:border-gray-700/30 space-y-1">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                          isActive(link.path)
                            ? `bg-gradient-to-r ${link.color} text-white shadow-lg`
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span>{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            isActive(link.path) 
                              ? 'bg-white/20 text-white' 
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}>
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
