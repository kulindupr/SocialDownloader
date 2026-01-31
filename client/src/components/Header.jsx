import { motion } from 'framer-motion';
import { Sun, Moon, Video } from 'lucide-react';

const Header = ({ theme, toggleTheme }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-6 px-4"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">
              FB Video Downloader
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Fast & Easy Downloads
            </p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="relative w-14 h-14 rounded-2xl glass-card flex items-center justify-center cursor-pointer group"
          aria-label="Toggle theme"
        >
          <motion.div
            initial={false}
            animate={{ 
              rotate: theme === 'dark' ? 0 : 180,
              scale: 1 
            }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            {theme === 'dark' ? (
              <Moon className="w-6 h-6 text-blue-400" />
            ) : (
              <Sun className="w-6 h-6 text-amber-500" />
            )}
          </motion.div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
