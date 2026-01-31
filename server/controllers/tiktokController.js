import { 
  extractTikTokInfo, 
  parseTikTokFormats, 
  streamTikTokVideo,
  streamTikTokAudio,
  getTikTokSize 
} from '../utils/ytdlpTiktok.js';

export const getTikTokInfo = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const tiktokRegex = /^(https?:\/\/)?(www\.|vm\.|vt\.)?(tiktok\.com)\/.+/;
    if (!tiktokRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid TikTok URL' });
    }

    const info = await extractTikTokInfo(url);
    const { videoFormats } = parseTikTokFormats(info);

    res.json({
      success: true,
      data: {
        title: info.title || info.description?.substring(0, 100) || 'TikTok Video',
        thumbnail: info.thumbnail,
        duration: info.duration,
        uploader: info.uploader || info.creator,
        formats: videoFormats
      }
    });
  } catch (error) {
    console.error('TikTok Info Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch TikTok video information' 
    });
  }
};

export const downloadTikTokStream = async (req, res) => {
  try {
    const { url, height, type, filename } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const fileSize = await getTikTokSize(url, height, type);

    const isAudio = type === 'audio';
    const ext = isAudio ? 'mp3' : 'mp4';
    const mimeType = isAudio ? 'audio/mpeg' : 'video/mp4';
    const downloadFilename = filename || `tiktok_${isAudio ? 'audio' : 'video'}_${Date.now()}.${ext}`;

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    
    if (fileSize) {
      res.setHeader('Content-Length', fileSize);
    }

    const ytdlp = isAudio 
      ? streamTikTokAudio(url)
      : streamTikTokVideo(url, height);

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

    req.on('close', () => {
      ytdlp.kill();
    });

  } catch (error) {
    console.error('TikTok Download Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  }
};
