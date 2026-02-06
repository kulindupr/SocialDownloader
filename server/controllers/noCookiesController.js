import { 
  extractYouTubeInfo as extractYouTubeInfoNoCookies, 
  downloadYouTubeVideo as downloadYouTubeVideoNoCookies
} from '../utils/ytdlpYoutubeNoCookies.js';
import { 
  extractInstagramInfo as extractInstagramInfoNoCookies, 
  downloadInstagramVideo as downloadInstagramVideoNoCookies
} from '../utils/ytdlpInstagramNoCookies.js';
import { 
  extractTikTokInfo as extractTikTokInfoNoCookies, 
  downloadTikTokVideo as downloadTikTokVideoNoCookies
} from '../utils/ytdlpTiktokNoCookies.js';
import { existsSync, statSync, createReadStream, unlinkSync } from 'fs';
import { basename } from 'path';
import archiver from 'archiver';

// YouTube without cookies
export const getYouTubeInfoNoCookies = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)/;
    if (!youtubeRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await extractYouTubeInfoNoCookies(url);

    res.json({
      success: true,
      data: {
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        duration_string: info.duration_string,
        channel: info.channel || info.uploader,
        view_count: info.view_count,
        description: info.description?.substring(0, 500) + '...'
      }
    });
  } catch (error) {
    console.error('YouTube Info Error (No Cookies):', error.message);
    
    let errorMessage = 'Failed to fetch video information';
    if (error.message?.includes('403')) {
      errorMessage = 'Video is geo-restricted or requires authentication';
    } else if (error.message?.includes('private')) {
      errorMessage = 'This video is private';
    } else if (error.message?.includes('removed')) {
      errorMessage = 'Video has been removed or is unavailable';
    }
    
    res.status(500).json({ 
      success: false, 
      error: errorMessage,
      details: error.message
    });
  }
};

export const downloadYouTubeNoCookies = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)/;
    if (!youtubeRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const filePath = await downloadYouTubeVideoNoCookies(url);
    
    if (!existsSync(filePath)) {
      throw new Error('Downloaded file not found');
    }

    const stats = statSync(filePath);
    const fileName = basename(filePath);

    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stats.size,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-cache'
    });

    const stream = createReadStream(filePath);
    stream.pipe(res);

    stream.on('end', () => {
      try {
        unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    });

  } catch (error) {
    console.error('YouTube Download Error (No Cookies):', error.message);
    
    let errorMessage = 'Failed to download video';
    if (error.message?.includes('403')) {
      errorMessage = 'Video download blocked - try a different approach';
    }
    
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        error: errorMessage,
        details: error.message
      });
    }
  }
};

// Instagram without cookies
export const getInstagramInfoNoCookies = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+/;
    if (!instagramRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid Instagram URL' });
    }

    const info = await extractInstagramInfoNoCookies(url);

    res.json({
      success: true,
      data: {
        title: info.title || 'Instagram Video',
        thumbnail: info.thumbnail,
        duration: info.duration,
        uploader: info.uploader,
        description: info.description?.substring(0, 300) + '...'
      }
    });
  } catch (error) {
    console.error('Instagram Info Error (No Cookies):', error.message);
    
    let errorMessage = 'Failed to fetch Instagram content';
    if (error.message?.includes('403')) {
      errorMessage = 'Instagram content is restricted';
    } else if (error.message?.includes('private')) {
      errorMessage = 'This account is private';
    }
    
    res.status(500).json({ 
      success: false, 
      error: errorMessage,
      details: error.message
    });
  }
};

export const downloadInstagramNoCookies = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+/;
    if (!instagramRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid Instagram URL' });
    }

    const filePath = await downloadInstagramVideoNoCookies(url);
    
    if (!existsSync(filePath)) {
      throw new Error('Downloaded file not found');
    }

    const stats = statSync(filePath);
    const fileName = basename(filePath);

    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stats.size,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-cache'
    });

    const stream = createReadStream(filePath);
    stream.pipe(res);

    stream.on('end', () => {
      try {
        unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    });

  } catch (error) {
    console.error('Instagram Download Error (No Cookies):', error.message);
    
    let errorMessage = 'Failed to download Instagram content';
    if (error.message?.includes('403')) {
      errorMessage = 'Instagram download blocked - content may be restricted';
    }
    
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        error: errorMessage,
        details: error.message
      });
    }
  }
};

// TikTok without cookies
export const getTikTokInfoNoCookies = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com)/;
    if (!tiktokRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid TikTok URL' });
    }

    const info = await extractTikTokInfoNoCookies(url);

    res.json({
      success: true,
      data: {
        title: info.title || 'TikTok Video',
        thumbnail: info.thumbnail,
        duration: info.duration,
        uploader: info.uploader,
        description: info.description?.substring(0, 300) + '...'
      }
    });
  } catch (error) {
    console.error('TikTok Info Error (No Cookies):', error.message);
    
    let errorMessage = 'Failed to fetch TikTok content';
    if (error.message?.includes('403')) {
      errorMessage = 'TikTok content is geo-restricted';
    } else if (error.message?.includes('private')) {
      errorMessage = 'This TikTok account is private';
    }
    
    res.status(500).json({ 
      success: false, 
      error: errorMessage,
      details: error.message
    });
  }
};

export const downloadTikTokNoCookies = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com)/;
    if (!tiktokRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid TikTok URL' });
    }

    const filePath = await downloadTikTokVideoNoCookies(url);
    
    if (!existsSync(filePath)) {
      throw new Error('Downloaded file not found');
    }

    const stats = statSync(filePath);
    const fileName = basename(filePath);

    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stats.size,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-cache'
    });

    const stream = createReadStream(filePath);
    stream.pipe(res);

    stream.on('end', () => {
      try {
        unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    });

  } catch (error) {
    console.error('TikTok Download Error (No Cookies):', error.message);
    
    let errorMessage = 'Failed to download TikTok content';
    if (error.message?.includes('403')) {
      errorMessage = 'TikTok download blocked - content may be geo-restricted';
    }
    
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        error: errorMessage,
        details: error.message
      });
    }
  }
};