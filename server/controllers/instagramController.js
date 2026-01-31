import { 
  extractInstagramInfo, 
  parseInstagramFormats, 
  streamInstagramVideo,
  streamInstagramAudio,
  getInstagramSize,
  downloadInstagramVideoToFile
} from '../utils/ytdlpInstagram.js';
import { createReadStream, unlinkSync, statSync } from 'fs';

export const getInstagramInfo = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const instagramRegex = /^(https?:\/\/)?(www\.)?(instagram\.com)\/(p|reel|reels|tv)\/[\w-]+/;
    if (!instagramRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid Instagram URL' });
    }

    const info = await extractInstagramInfo(url);
    const { videoFormats } = parseInstagramFormats(info);

    res.json({
      success: true,
      data: {
        title: info.title || info.description?.substring(0, 100) || 'Instagram Video',
        thumbnail: info.thumbnail,
        duration: info.duration,
        uploader: info.uploader || info.channel,
        formats: videoFormats
      }
    });
  } catch (error) {
    console.error('Instagram Info Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch Instagram video information' 
    });
  }
};

export const downloadInstagramStream = async (req, res) => {
  try {
    const { url, height, type, filename } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const isAudio = type === 'audio';
    const ext = isAudio ? 'mp3' : 'mp4';
    const mimeType = isAudio ? 'audio/mpeg' : 'video/mp4';
    const downloadFilename = filename || `instagram_${isAudio ? 'audio' : 'video'}_${Date.now()}.${ext}`;

    if (isAudio) {
      // For audio, we can stream directly
      const fileSize = await getInstagramSize(url, height, type);
      
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
      
      if (fileSize) {
        res.setHeader('Content-Length', fileSize);
      }

      const ytdlp = streamInstagramAudio(url);
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

      req.on('close', () => {
        ytdlp.kill();
      });
    } else {
      // For video, download to temp file first to ensure proper merging
      console.log('Downloading Instagram video to temp file...');
      
      try {
        const tempFile = await downloadInstagramVideoToFile(url, height);
        const stats = statSync(tempFile);
        
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
        res.setHeader('Content-Length', stats.size);
        
        const readStream = createReadStream(tempFile);
        
        readStream.pipe(res);
        
        readStream.on('end', () => {
          // Clean up temp file after streaming
          try { unlinkSync(tempFile); } catch (e) {}
        });
        
        readStream.on('error', (error) => {
          console.error('Read stream error:', error);
          try { unlinkSync(tempFile); } catch (e) {}
          if (!res.headersSent) {
            res.status(500).json({ error: 'Download failed' });
          }
        });
        
        req.on('close', () => {
          readStream.destroy();
          try { unlinkSync(tempFile); } catch (e) {}
        });
        
      } catch (downloadError) {
        console.error('Video download error:', downloadError);
        if (!res.headersSent) {
          res.status(500).json({ error: downloadError.message || 'Download failed' });
        }
      }
    }

  } catch (error) {
    console.error('Instagram Download Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  }
};
