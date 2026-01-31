import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Search, Loader2 } from 'lucide-react';

const VideoInput = ({ onFetch, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onFetch(url.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative flex items-center">
            <div className="absolute left-5 text-gray-400">
              <Link className="w-5 h-5" />
            </div>
            
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste Facebook video URL here..."
              className="glass-input pl-14 pr-32"
              disabled={isLoading}
              aria-label="Facebook video URL"
            />

            <motion.button
              type="submit"
              disabled={!url.trim() || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute right-2 glass-button px-5 py-2.5 text-white text-sm flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Fetch</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4"
      >
        Supports facebook.com and fb.watch links
      </motion.p>
    </motion.div>
  );
};

export default VideoInput;
