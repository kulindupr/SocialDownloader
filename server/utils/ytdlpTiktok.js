import { spawn } from 'child_process';
import { YTDLP_PATH } from './ytdlpPath.js';
import { getTikTokCookiesArgs } from './cookies.js';

export const extractTikTokInfo = (url) => {
  return new Promise((resolve, reject) => {
    const cookiesArgs = getTikTokCookiesArgs();
    
    const args = [
      '--dump-json',
      '--no-warnings',
      '--no-check-certificate',
      '--geo-bypass',
      '--force-ipv4',
      '--socket-timeout', '30',
      '--user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      ...cookiesArgs,
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
        reject(new Error(stderr || 'Failed to extract TikTok video info'));
        return;
      }

      try {
        const info = JSON.parse(stdout);
        resolve(info);
      } catch (error) {
        reject(new Error('Failed to parse video info'));
      }
    });

    ytdlp.on('error', (error) => {
      reject(error);
    });
  });
};

export const parseTikTokFormats = (info) => {
  const formats = info.formats || [];
  const heightMap = new Map();
  
  formats.forEach(f => {
    if (f.vcodec && f.vcodec !== 'none' && f.height) {
      const height = f.height;
      if (!heightMap.has(height) || (f.filesize && f.filesize > (heightMap.get(height).filesize || 0))) {
        heightMap.set(height, f);
      }
    }
  });

  const videoFormats = [];
  const sortedHeights = Array.from(heightMap.keys()).sort((a, b) => b - a);
  
  sortedHeights.forEach(height => {
    const f = heightMap.get(height);
    let label = `${height}p`;
    
    if (height >= 1080) label = '1080p (Full HD)';
    else if (height >= 720) label = '720p (HD)';
    else if (height >= 480) label = '480p (SD)';
    else if (height >= 360) label = '360p';
    else label = `${height}p`;

    videoFormats.push({
      height,
      label,
      format_id: f.format_id,
      filesize: f.filesize || f.filesize_approx || null,
      type: 'video'
    });
  });

  return { videoFormats };
};

export const streamTikTokVideo = (url, height) => {
  const formatSelector = height 
    ? `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`
    : 'bestvideo+bestaudio/best';

  return spawn(YTDLP_PATH, [
    '-f', formatSelector,
    '--merge-output-format', 'mp4',
    '-o', '-',
    '--no-warnings',
    url
  ]);
};

export const streamTikTokAudio = (url) => {
  return spawn(YTDLP_PATH, [
    '-f', 'bestaudio',
    '-x',
    '--audio-format', 'mp3',
    '--audio-quality', '0',
    '-o', '-',
    '--no-warnings',
    url
  ]);
};

export const getTikTokSize = async (url, height, type = 'video') => {
  return new Promise((resolve) => {
    let args;
    
    if (type === 'audio') {
      args = ['-f', 'bestaudio', '--print', '%(filesize,filesize_approx)s', url];
    } else {
      const formatSelector = height 
        ? `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`
        : 'bestvideo+bestaudio/best';
      args = ['-f', formatSelector, '--print', '%(filesize,filesize_approx)s', url];
    }

    const ytdlp = spawn(YTDLP_PATH, args);
    let stdout = '';

    ytdlp.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ytdlp.on('close', () => {
      const size = parseInt(stdout.trim());
      resolve(isNaN(size) ? null : size);
    });

    ytdlp.on('error', () => {
      resolve(null);
    });
  });
};
