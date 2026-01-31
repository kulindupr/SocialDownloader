import { 
  extractYouTubeInfo, 
  parseYouTubeFormats, 
  streamYouTubeVideo,
  streamYouTubeAudio,
  getYouTubeVideoSize,
  extractPlaylistInfo,
  downloadPlaylistToZip,
  downloadSelectedPlaylistToZip
} from '../utils/ytdlpYoutube.js';

// Get YouTube video info
export const getYouTubeInfo = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)/;
    if (!youtubeRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await extractYouTubeInfo(url);
    const { videoFormats, audioFormats, allFormats } = parseYouTubeFormats(info);

    res.json({
      success: true,
      data: {
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        duration_string: info.duration_string,
        channel: info.channel || info.uploader,
        view_count: info.view_count,
        videoFormats,
        audioFormats,
        formats: allFormats
      }
    });
  } catch (error) {
    console.error('YouTube Info Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch video information' 
    });
  }
};

// Stream download YouTube video or audio
export const downloadYouTubeStream = async (req, res) => {
  try {
    const { url, height, type, filename } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Get file size for Content-Length header
    const fileSize = await getYouTubeVideoSize(url, height, type);

    // Set appropriate headers
    const isAudio = type === 'audio';
    const ext = isAudio ? 'mp3' : 'mp4';
    const mimeType = isAudio ? 'audio/mpeg' : 'video/mp4';
    const downloadFilename = filename || `youtube_${isAudio ? 'audio' : 'video'}_${Date.now()}.${ext}`;

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    
    if (fileSize) {
      res.setHeader('Content-Length', fileSize);
    }

    // Start streaming
    const ytdlp = isAudio 
      ? streamYouTubeAudio(url)
      : streamYouTubeVideo(url, height);

    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on('data', (data) => {
      console.error('yt-dlp stderr:', data.toString());
    });

    ytdlp.on('error', (error) => {
      console.error('yt-dlp error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    });

    ytdlp.on('close', (code) => {
      if (code !== 0 && !res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    });

    // Handle client disconnect
    req.on('close', () => {
      ytdlp.kill();
    });

  } catch (error) {
    console.error('YouTube Download Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  }
};

export const getPlaylistInfo = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const playlistRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?list=|watch\?.*list=))/;
    if (!playlistRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid YouTube playlist URL' });
    }

    const info = await extractPlaylistInfo(url);

    // Filter out deleted and private videos
    const validEntries = (info.entries || []).filter(v => {
      const title = (v.title || '').toLowerCase();
      return !title.includes('[deleted video]') && 
             !title.includes('[private video]') &&
             !title.includes('deleted video') &&
             !title.includes('private video') &&
             v.title !== 'NA';
    });

    res.json({
      success: true,
      data: {
        title: info.title,
        thumbnail: info.thumbnails?.[0]?.url || validEntries[0]?.thumbnail,
        videoCount: validEntries.length,
        channel: info.uploader || info.channel,
        videos: validEntries.map((v, i) => ({
          index: i + 1,
          title: v.title,
          duration: v.duration,
          thumbnail: v.thumbnail,
          originalIndex: info.entries.indexOf(v) + 1
        }))
      }
    });
  } catch (error) {
    console.error('Playlist Info Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch playlist information' 
    });
  }
};

export const downloadPlaylist = async (req, res) => {
  try {
    const { url, type, height } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const isAudio = type === 'audio';
    const filename = `youtube_playlist_${Date.now()}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await downloadPlaylistToZip(url, type, height, res);

  } catch (error) {
    console.error('Playlist Download Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  }
};

export const downloadSelectedPlaylist = async (req, res) => {
  try {
    const { url, type, height, selectedIndices } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!selectedIndices || !Array.isArray(selectedIndices) || selectedIndices.length === 0) {
      return res.status(400).json({ error: 'No videos selected' });
    }

    const filename = `youtube_selected_${Date.now()}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await downloadSelectedPlaylistToZip(url, type, height, selectedIndices, res);

  } catch (error) {
    console.error('Selected Playlist Download Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  }
};
