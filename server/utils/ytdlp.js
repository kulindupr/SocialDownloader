import { spawn } from 'child_process';
import { YTDLP_PATH } from './ytdlpPath.js';

const FACEBOOK_URL_REGEX = /^https?:\/\/(www\.|m\.|web\.|mbasic\.)?(facebook\.com|fb\.watch)\/.+/i;

export const validateFacebookUrl = (url) => {
  return FACEBOOK_URL_REGEX.test(url);
};

export const extractVideoInfo = (url) => {
  return new Promise((resolve, reject) => {
    const args = [
      '--dump-json',
      '--no-warnings',
      '--no-check-certificate',
      '--prefer-free-formats',
      url
    ];

    const ytdlp = spawn(YTDLP_PATH, args);
    let stdout = '';
    let stderr = '';

    ytdlp.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ytdlp.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ytdlp.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || 'Failed to extract video information'));
        return;
      }

      try {
        const videoData = JSON.parse(stdout);
        const formats = parseFormats(videoData.formats || []);
        
        resolve({
          title: videoData.title || 'Facebook Video',
          thumbnail: videoData.thumbnail || null,
          duration: videoData.duration || 0,
          formats
        });
      } catch (error) {
        reject(new Error('Failed to parse video data'));
      }
    });

    ytdlp.on('error', (error) => {
      reject(new Error('yt-dlp is not installed or not accessible'));
    });
  });
};

const parseFormats = (formats) => {
  const heightMap = new Map();
  
  const videoFormats = formats.filter(f => 
    f.vcodec !== 'none' && 
    f.url &&
    f.height &&
    f.height > 0
  );

  videoFormats.forEach(format => {
    const height = format.height;
    
    if (!heightMap.has(height)) {
      heightMap.set(height, {
        height,
        format_id: format.format_id,
        filesize: format.filesize || format.filesize_approx || null,
        tbr: format.tbr || 0
      });
    } else {
      const existing = heightMap.get(height);
      const newTbr = format.tbr || 0;
      if (newTbr > existing.tbr) {
        heightMap.set(height, {
          height,
          format_id: format.format_id,
          filesize: format.filesize || format.filesize_approx || existing.filesize,
          tbr: newTbr
        });
      }
    }
  });

  const getLabel = (height) => {
    if (height >= 2160) return `${height}p (4K)`;
    if (height >= 1440) return `${height}p (2K)`;
    if (height >= 1080) return `${height}p (Full HD)`;
    if (height >= 720) return `${height}p (HD)`;
    if (height >= 480) return `${height}p (SD)`;
    return `${height}p`;
  };

  const result = Array.from(heightMap.values())
    .sort((a, b) => b.height - a.height)
    .map(item => ({
      height: item.height,
      label: getLabel(item.height),
      format_id: item.format_id,
      filesize: item.filesize
    }));

  if (result.length === 0 && formats.length > 0) {
    const bestFormat = formats.find(f => f.vcodec !== 'none' && f.url);
    if (bestFormat) {
      const height = bestFormat.height || 360;
      result.push({
        height,
        label: getLabel(height),
        format_id: bestFormat.format_id,
        filesize: bestFormat.filesize || null
      });
    }
  }

  return result;
};
