import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import VideoInput from '../components/VideoInput';
import VideoPreview from '../components/VideoPreview';
import QualitySelector from '../components/QualitySelector';
import DownloadButton from '../components/DownloadButton';
import ErrorMessage from '../components/ErrorMessage';
import Footer from '../components/Footer';
import { fetchVideoInfo, downloadVideo } from '../services/api';
import useTheme from '../hooks/useTheme';

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');

  const handleFetch = async (url) => {
    setIsLoading(true);
    setError(null);
    setVideoInfo(null);
    setSelectedQuality(null);
    setDownloadProgress(0);
    setOriginalUrl(url);

    try {
      const response = await fetchVideoInfo(url);
      
      if (response.success && response.data) {
        setVideoInfo(response.data);
        if (response.data.formats?.length > 0) {
          setSelectedQuality(response.data.formats[0].height);
        }
      } else {
        setError(response.error || 'Failed to fetch video info');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo || !selectedQuality || !originalUrl) return;

    const selectedFormat = videoInfo.formats.find(
      (f) => f.height === selectedQuality
    );

    if (!selectedFormat) {
      setError('Selected quality not available');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setError(null);
    
    try {
      const filename = `${videoInfo.title || 'facebook-video'}-${selectedFormat.height}p`
        .replace(/[^a-zA-Z0-9-_.]/g, '_');
      
      await downloadVideo(originalUrl, selectedFormat.height, filename, (progress) => {
        setDownloadProgress(progress);
      });
    } catch (err) {
      setError(err.message || 'Failed to download video');
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-gradient mb-4"
          >
            Download Facebook Videos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Paste a link and download in your preferred quality
          </motion.p>
        </motion.div>

        <div className="space-y-6">
          <VideoInput onFetch={handleFetch} isLoading={isLoading} />

          <AnimatePresence mode="wait">
            {error && (
              <ErrorMessage 
                message={error} 
                onClose={() => setError(null)} 
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-8"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Fetching video information...
                  </p>
                </div>
              </motion.div>
            )}

            {videoInfo && !isLoading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <VideoPreview videoInfo={videoInfo} />

                {videoInfo.formats?.length > 0 && (
                  <div className="glass-card p-6 space-y-6">
                    <QualitySelector
                      formats={videoInfo.formats}
                      selectedQuality={selectedQuality}
                      onSelect={setSelectedQuality}
                    />

                    <DownloadButton
                      disabled={!selectedQuality}
                      isDownloading={isDownloading}
                      progress={downloadProgress}
                      onClick={handleDownload}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
