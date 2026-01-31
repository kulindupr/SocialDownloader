import { motion } from 'framer-motion';
import { Download, Loader2, CheckCircle } from 'lucide-react';

const DownloadButton = ({ disabled, onClick, isDownloading, progress = 0 }) => {
  return (
    <div className="w-full">
      <motion.button
        type="button"
        disabled={disabled || isDownloading}
        onClick={onClick}
        whileHover={!disabled && !isDownloading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isDownloading ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`
          w-full relative overflow-hidden py-4 px-8 rounded-2xl font-semibold text-lg
          transition-all duration-300 flex items-center justify-center gap-3
          ${disabled
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'glass-button text-white cursor-pointer'
          }
        `}
        aria-label="Download video"
      >
        {isDownloading && progress > 0 && (
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-white/20"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        )}

        {!disabled && !isDownloading && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-200%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        )}

        <span className="relative flex items-center gap-3">
          {isDownloading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>
                {progress > 0 ? `Downloading... ${progress}%` : progress === -1 ? 'Downloading...' : 'Preparing Download...'}
              </span>
            </>
          ) : (
            <>
              <Download className="w-6 h-6" />
              <span>Download Video</span>
            </>
          )}
        </span>

        {!disabled && !isDownloading && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute right-4 flex items-center gap-1 text-sm opacity-80"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Ready</span>
          </motion.div>
        )}
      </motion.button>

      {isDownloading && (progress > 0 || progress === -1) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3"
        >
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            {progress === -1 ? (
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: '50%' }}
              />
            ) : (
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            {progress === -1 ? 'Downloading video...' : progress < 100 ? 'Downloading video to your device...' : 'Download complete!'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DownloadButton;
