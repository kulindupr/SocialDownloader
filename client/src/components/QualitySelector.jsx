import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Monitor, Smartphone, Tv } from 'lucide-react';

const QualitySelector = ({ formats, selectedQuality, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatFileSize = (bytes) => {
    if (!bytes) return null;
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getQualityIcon = (height) => {
    if (height >= 1080) return Tv;
    if (height >= 720) return Monitor;
    return Smartphone;
  };

  const selectedFormat = formats.find(f => f.height === selectedQuality);

  const handleSelect = (height) => {
    onSelect(height);
    setIsOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full"
      ref={dropdownRef}
    >
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
        Select Video Quality
      </label>

      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.99 }}
          className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between cursor-pointer transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <div className="flex items-center gap-3">
            {selectedFormat ? (
              <>
                {(() => {
                  const IconComponent = getQualityIcon(selectedFormat.height);
                  return <IconComponent className="w-5 h-5 text-blue-500" />;
                })()}
                <span className="font-medium text-gray-800 dark:text-white">
                  {selectedFormat.label}
                </span>
                {selectedFormat.filesize && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({formatFileSize(selectedFormat.filesize)})
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Select video quality</span>
            )}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
            >
              {formats.map((format) => {
                const isSelected = selectedQuality === format.height;
                const IconComponent = getQualityIcon(format.height);

                return (
                  <button
                    key={format.height}
                    type="button"
                    onClick={() => handleSelect(format.height)}
                    className={`w-full px-5 py-3.5 flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-5 h-5 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`} />
                      <span className={`font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>
                        {format.label}
                      </span>
                      {format.filesize && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(format.filesize)}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {formats.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {formats.map((format) => {
            const isSelected = selectedQuality === format.height;

            return (
              <button
                key={format.height}
                type="button"
                onClick={() => onSelect(format.height)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {format.height}p
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default QualitySelector;
