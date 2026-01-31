import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Loader2, Download, Music, Video, AlertCircle, CheckCircle, X, Zap, Shield } from 'lucide-react';
import { fetchTikTokInfo, downloadTikTok } from '../services/api';
import Footer from '../components/Footer';

const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const TikTokPage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState('');
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [downloadType, setDownloadType] = useState('video');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setVideoInfo(null);
    setSelectedFormat(null);

    try {
      const response = await fetchTikTokInfo(url);
      if (response.success) {
        setVideoInfo(response.data);
        if (response.data.formats?.length > 0) {
          setSelectedFormat(response.data.formats[0]);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo) return;

    setDownloading(true);
    setProgress(0);

    try {
      const isAudio = downloadType === 'audio';
      const ext = isAudio ? 'mp3' : 'mp4';
      const sanitizedTitle = (videoInfo.title || 'tiktok-video')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50);
      const filename = `${sanitizedTitle}.${ext}`;

      await downloadTikTok(
        url,
        selectedFormat?.height || null,
        isAudio ? 'audio' : 'video',
        filename,
        (prog) => setProgress(prog)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  const clearVideo = () => {
    setVideoInfo(null);
    setUrl('');
    setSelectedFormat(null);
    setError('');
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 mb-4 shadow-lg">
              <TikTokIcon className="w-8 h-8 text-white dark:text-gray-900" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              TikTok Downloader
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Download TikTok videos without watermark
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="ios-card rounded-2xl p-6 mb-6"
          >
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste TikTok URL here..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !url.trim()}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Fetch</span>
                )}
              </motion.button>
            </div>
          </motion.form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="ios-card rounded-xl p-4 mb-6 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {videoInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="ios-card rounded-2xl overflow-hidden mb-6"
              >
                <div className="relative">
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-full aspect-video object-cover"
                  />
                  {videoInfo.duration && (
                    <span className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/80 text-white text-sm font-medium">
                      {formatDuration(videoInfo.duration)}
                    </span>
                  )}
                  <button
                    onClick={clearVideo}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {videoInfo.title}
                  </h3>
                  {videoInfo.uploader && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">@{videoInfo.uploader}</p>
                  )}

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setDownloadType('video')}
                      className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        downloadType === 'video'
                          ? 'bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>Video (MP4)</span>
                    </button>
                    <button
                      onClick={() => setDownloadType('audio')}
                      className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        downloadType === 'audio'
                          ? 'bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Music className="w-4 h-4" />
                      <span>Audio (MP3)</span>
                    </button>
                  </div>

                  {downloadType === 'video' && videoInfo.formats?.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Quality
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {videoInfo.formats.map((format) => (
                          <button
                            key={format.height}
                            onClick={() => setSelectedFormat(format)}
                            className={`py-2 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                              selectedFormat?.height === format.height
                                ? 'bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-gray-900'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            {format.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    disabled={downloading || (downloadType === 'video' && !selectedFormat)}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>
                          {progress > 0 ? `Downloading... ${progress}%` : 'Preparing download...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>
                          Download {downloadType === 'audio' ? 'MP3' : selectedFormat?.label || 'Video'}
                        </span>
                      </>
                    )}
                  </motion.button>

                  {downloading && progress > 0 && (
                    <div className="mt-4">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!videoInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { icon: Zap, label: 'Fast', desc: 'No watermark' },
                { icon: Shield, label: 'Safe', desc: 'No login needed' },
                { icon: CheckCircle, label: 'Free', desc: 'Unlimited' },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="ios-card rounded-xl p-4 text-center"
                >
                  <feature.icon className="w-6 h-6 mx-auto mb-2 text-gray-900 dark:text-white" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{feature.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TikTokPage;
