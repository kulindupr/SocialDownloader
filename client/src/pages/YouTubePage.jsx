import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Link2, Loader2, Download, Music, Video, AlertCircle, CheckCircle, X, ListVideo, Package, Check, Square, CheckSquare } from 'lucide-react';
import { 
  fetchYouTubeInfo, downloadYouTubeVideo, fetchYouTubePlaylistInfo, downloadYouTubePlaylist, downloadSelectedPlaylistVideos
} from '../services/api';
import Footer from '../components/Footer';

const YouTubePage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [error, setError] = useState('');
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [downloadType, setDownloadType] = useState('video');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedVideos, setSelectedVideos] = useState([]);

  // Always use cookie-free endpoints when API URL contains fly.dev (deployed backend)
  const isProduction = import.meta.env.VITE_API_URL?.includes('fly.dev') || true; // Force cookie-free for now

  const isPlaylistUrl = (urlString) => {
    return urlString.includes('list=') || urlString.includes('/playlist');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setVideoInfo(null);
    setPlaylistInfo(null);
    setSelectedFormat(null);

    try {
      if (isPlaylistUrl(url)) {
        const response = await fetchYouTubePlaylistInfo(url);
        if (response.success) {
          setPlaylistInfo(response.data);
          // Select all videos by default
          if (response.data.videos) {
            setSelectedVideos(response.data.videos.map(v => v.index));
          }
        }
      } else {
        const response = await fetchYouTubeInfo(url);
        if (response.success) {
          setVideoInfo(response.data);
          if (response.data.videoFormats?.length > 0) {
            setSelectedFormat(response.data.videoFormats[0]);
          }
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
      const ext = isAudio ? 'mp4' : 'mp4'; // No audio support in no-cookies version
      const sanitizedTitle = videoInfo.title
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 100);
      const filename = `${sanitizedTitle}.${ext}`;

      // Use cookie-free version in production
      if (isProduction) {
        await downloadYouTubeVideoNoCookies(
          url,
          filename,
          (prog) => setProgress(prog)
        );
      } else {
        await downloadYouTubeVideo(
          url,
          selectedFormat?.height || null,
          isAudio ? 'audio' : 'video',
          filename,
          (prog) => setProgress(prog)
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  const handlePlaylistDownload = async () => {
    if (!playlistInfo || selectedVideos.length === 0) return;

    setDownloading(true);
    setProgress(0);

    try {
      // If all videos selected, use normal download
      if (selectedVideos.length === playlistInfo.videos.length) {
        await downloadYouTubePlaylist(
          url,
          downloadType,
          selectedFormat?.height || 720,
          (prog) => setProgress(prog)
        );
      } else {
        // Download only selected videos
        const selectedIndices = selectedVideos;
        await downloadSelectedPlaylistVideos(
          url,
          downloadType,
          selectedFormat?.height || 720,
          selectedIndices,
          (prog) => setProgress(prog)
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  const clearVideo = () => {
    setVideoInfo(null);
    setPlaylistInfo(null);
    setUrl('');
    setSelectedFormat(null);
    setError('');
    setSelectedVideos([]);
  };

  const toggleVideoSelection = (index) => {
    setSelectedVideos(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleSelectAll = () => {
    if (playlistInfo?.videos) {
      if (selectedVideos.length === playlistInfo.videos.length) {
        setSelectedVideos([]);
      } else {
        setSelectedVideos(playlistInfo.videos.map(v => v.index));
      }
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (count) => {
    if (!count) return '';
    if (count >= 1000000000) return `${(count / 1000000000).toFixed(1)}B views`;
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  const qualityOptions = [
    { height: 1080, label: '1080p (Full HD)' },
    { height: 720, label: '720p (HD)' },
    { height: 480, label: '480p (SD)' },
    { height: 360, label: '360p' },
  ];

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 mb-4 shadow-lg">
              <Youtube className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              YouTube Video Downloader
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Download videos and audio from YouTube in any quality
            </p>
          </motion.div>

          {/* URL Input */}
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
                  placeholder="Paste YouTube URL here..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !url.trim()}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Fetch</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>

          {/* Error Message */}
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

          {/* Video Preview */}
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
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {videoInfo.channel && <span>{videoInfo.channel}</span>}
                    {videoInfo.view_count && (
                      <>
                        <span>•</span>
                        <span>{formatViews(videoInfo.view_count)}</span>
                      </>
                    )}
                  </div>

                  {/* Download Type Toggle */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setDownloadType('video')}
                      className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        downloadType === 'video'
                          ? 'bg-red-500 text-white'
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
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Music className="w-4 h-4" />
                      <span>Audio (MP3)</span>
                    </button>
                  </div>

                  {/* Quality Selector (only for video) */}
                  {downloadType === 'video' && videoInfo.videoFormats?.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Quality
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {videoInfo.videoFormats.map((format) => (
                          <button
                            key={format.height}
                            onClick={() => setSelectedFormat(format)}
                            className={`py-2 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                              selectedFormat?.height === format.height
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            {format.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Download Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    disabled={downloading || (downloadType === 'video' && !selectedFormat)}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg cursor-pointer"
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

                  {/* Progress Bar */}
                  {downloading && progress > 0 && (
                    <div className="mt-4">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-gradient-to-r from-red-500 to-red-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Playlist Preview */}
          <AnimatePresence>
            {playlistInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="ios-card rounded-2xl overflow-hidden mb-6"
              >
                <div className="relative">
                  <div className="w-full aspect-video bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <ListVideo className="w-16 h-16 mx-auto mb-3 opacity-80" />
                      <p className="text-2xl font-bold">{playlistInfo.videoCount} Videos</p>
                    </div>
                  </div>
                  <button
                    onClick={clearVideo}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-red-500" />
                    <span className="text-xs font-medium text-red-500 uppercase">Playlist</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {playlistInfo.title}
                  </h3>
                  {playlistInfo.channel && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{playlistInfo.channel}</p>
                  )}

                  {playlistInfo.videos?.length > 0 && (
                    <div className="mb-4">
                      {/* Select All Header */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <button
                          onClick={toggleSelectAll}
                          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                        >
                          {selectedVideos.length === playlistInfo.videos.length ? (
                            <CheckSquare className="w-5 h-5 text-red-500" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                          <span>Select All</span>
                        </button>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedVideos.length} of {playlistInfo.videos.length} selected
                        </span>
                      </div>
                      
                      {/* Full Video List */}
                      <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                        {playlistInfo.videos.map((video, i) => (
                          <div 
                            key={i} 
                            onClick={() => toggleVideoSelection(video.index)}
                            className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
                              selectedVideos.includes(video.index)
                                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50'
                                : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            {selectedVideos.includes(video.index) ? (
                              <CheckSquare className="w-4 h-4 text-red-500 flex-shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className="text-xs text-gray-400 w-6 flex-shrink-0">{video.index}</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1 flex-1">{video.title}</p>
                            {video.duration && (
                              <span className="text-xs text-gray-400 flex-shrink-0">{video.duration}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setDownloadType('video')}
                      className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        downloadType === 'video'
                          ? 'bg-red-500 text-white'
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
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Music className="w-4 h-4" />
                      <span>Audio (MP3)</span>
                    </button>
                  </div>

                  {downloadType === 'video' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Quality
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {qualityOptions.map((format) => (
                          <button
                            key={format.height}
                            onClick={() => setSelectedFormat(format)}
                            className={`py-2 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                              selectedFormat?.height === format.height
                                ? 'bg-red-500 text-white'
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
                    onClick={handlePlaylistDownload}
                    disabled={downloading || (downloadType === 'video' && !selectedFormat) || selectedVideos.length === 0}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>
                          {progress > 0 ? `Downloading... ${progress}%` : 'Preparing ZIP...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Package className="w-5 h-5" />
                        <span>
                          {selectedVideos.length === playlistInfo.videos?.length 
                            ? 'Download All as ZIP' 
                            : `Download ${selectedVideos.length} Selected as ZIP`}
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
                          className="h-full bg-gradient-to-r from-red-500 to-red-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features */}
          {!videoInfo && !playlistInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { icon: Video, label: 'HD Quality', desc: 'Up to 4K' },
                { icon: Music, label: 'MP3 Audio', desc: 'High quality' },
                { icon: ListVideo, label: 'Playlists', desc: 'Download all' },
                { icon: CheckCircle, label: 'Free', desc: 'No limits' },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="ios-card rounded-xl p-4 text-center"
                >
                  <feature.icon className="w-6 h-6 mx-auto mb-2 text-red-500" />
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

export default YouTubePage;
