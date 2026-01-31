import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';

const VideoPreview = ({ videoInfo }) => {
  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="w-full glass-card overflow-hidden"
    >
      <div className="relative aspect-video bg-black/20 overflow-hidden">
        {videoInfo.thumbnail ? (
          <>
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <Play className="w-10 h-10 text-white/60" />
            </div>
          </div>
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </motion.div>

        {videoInfo.duration > 0 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-white/80" />
            <span className="text-xs text-white font-medium">
              {formatDuration(videoInfo.duration)}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 leading-relaxed"
        >
          {videoInfo.title}
        </motion.h3>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 flex items-center gap-2"
        >
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium">
            {videoInfo.formats?.length || 0} qualities available
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VideoPreview;
