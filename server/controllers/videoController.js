import { validateFacebookUrl, extractVideoInfo } from '../utils/ytdlp.js';
import { streamVideo, streamAudio, getVideoSize } from '../utils/downloader.js';

export const getVideoInfo = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    if (!validateFacebookUrl(url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Facebook URL. Please provide a valid Facebook video link.'
      });
    }

    const videoInfo = await extractVideoInfo(url);

    if (!videoInfo.formats || videoInfo.formats.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No downloadable formats found for this video'
      });
    }

    res.json({
      success: true,
      data: {
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        duration: videoInfo.duration,
        formats: videoInfo.formats
      }
    });
  } catch (error) {
    console.error('Error extracting video info:', error.message);
    
    let errorMessage = 'Failed to extract video information';
    let statusCode = 500;

    if (error.message.includes('not installed')) {
      errorMessage = 'Video extraction service is not available';
      statusCode = 503;
    } else if (error.message.includes('Private video') || error.message.includes('login')) {
      errorMessage = 'This video is private or requires login';
      statusCode = 403;
    } else if (error.message.includes('not available') || error.message.includes('removed')) {
      errorMessage = 'This video is not available or has been removed';
      statusCode = 404;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage
    });
  }
};

export const downloadVideoStream = async (req, res) => {
  try {
    const { url, height, filename } = req.body;

    if (!url || !height) {
      return res.status(400).json({
        success: false,
        error: 'URL and quality height are required'
      });
    }

    const numericHeight = parseInt(height, 10);
    if (isNaN(numericHeight) || numericHeight < 144 || numericHeight > 4320) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quality height'
      });
    }

    if (!validateFacebookUrl(url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Facebook URL'
      });
    }

    const sanitizedFilename = (filename || 'facebook-video')
      .replace(/[^a-zA-Z0-9-_.]/g, '_')
      .substring(0, 200) + '.mp4';

    const fileSize = await getVideoSize(url, numericHeight);

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    if (fileSize) {
      res.setHeader('Content-Length', fileSize);
    }

    const { stream, process: ytdlpProcess, stderr } = streamVideo(url, numericHeight);

    let errorOutput = '';
    stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error.message);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Stream failed' });
      }
    });

    ytdlpProcess.on('error', (error) => {
      console.error('yt-dlp process error:', error.message);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Download failed' });
      }
    });

    ytdlpProcess.on('close', (code) => {
      if (code !== 0 && !res.headersSent) {
        console.error('yt-dlp error output:', errorOutput);
        res.status(500).json({ success: false, error: 'Download failed' });
      }
    });

    req.on('close', () => {
      ytdlpProcess.kill('SIGTERM');
    });

    stream.pipe(res);

  } catch (error) {
    console.error('Download error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to download video'
      });
    }
  }
};

export const downloadAudioStream = async (req, res) => {
  try {
    const { url, filename } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    if (!validateFacebookUrl(url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Facebook URL'
      });
    }

    const sanitizedFilename = (filename || 'facebook-audio')
      .replace(/[^a-zA-Z0-9-_.]/g, '_')
      .substring(0, 200) + '.mp3';

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const { stream, process: ytdlpProcess, stderr } = streamAudio(url);

    let errorOutput = '';
    stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error.message);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Stream failed' });
      }
    });

    ytdlpProcess.on('error', (error) => {
      console.error('yt-dlp process error:', error.message);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Download failed' });
      }
    });

    ytdlpProcess.on('close', (code) => {
      if (code !== 0 && !res.headersSent) {
        console.error('yt-dlp error output:', errorOutput);
        res.status(500).json({ success: false, error: 'Download failed' });
      }
    });

    req.on('close', () => {
      ytdlpProcess.kill('SIGTERM');
    });

    stream.pipe(res);

  } catch (error) {
    console.error('Audio download error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to download audio'
      });
    }
  }
};
