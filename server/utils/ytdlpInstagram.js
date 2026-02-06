import { spawn } from 'child_process';
import { existsSync, statSync, readFileSync, unlinkSync, createReadStream } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { YTDLP_PATH } from './ytdlpPath.js';

export const extractInstagramInfo = (url) => {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn(YTDLP_PATH, [
      '--dump-json',
      '--no-warnings',
      '--no-playlist',
      '--no-check-certificate',
      '--geo-bypass',
      '--force-ipv4',
      '--user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      url
    ]);

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
        reject(new Error(stderr || 'Failed to extract Instagram video info'));
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

export const parseInstagramFormats = (info) => {
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

export const streamInstagramVideo = (url, height) => {
  // For Instagram, use format that includes both video and audio in one stream
  // Instagram often provides combined formats, so we try those first
  const formatSelector = height 
    ? `best[height<=${height}][ext=mp4]/bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`
    : 'best[ext=mp4]/bestvideo+bestaudio/best';

  return spawn(YTDLP_PATH, [
    '-f', formatSelector,
    '--merge-output-format', 'mp4',
    '-o', '-',
    '--no-warnings',
    '--no-playlist',
    '--no-check-certificates',
    url
  ]);
};

// Download Instagram video to temp file then stream (for reliable merging)
export const downloadInstagramVideoToFile = async (url, height) => {
  const tempFile = join(tmpdir(), `instagram_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`);
  
  return new Promise((resolve, reject) => {
    const formatSelector = height 
      ? `best[height<=${height}][ext=mp4]/bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`
      : 'best[ext=mp4]/bestvideo+bestaudio/best';

    const args = [
      '-f', formatSelector,
      '--merge-output-format', 'mp4',
      '-o', tempFile,
      '--no-warnings',
      '--no-playlist',
      '--no-check-certificates',
      '--extractor-retries', '3',
      url
    ];
    
    console.log('Downloading Instagram video with args:', args.join(' '));
    
    const ytdlp = spawn(YTDLP_PATH, args);
    let stderr = '';
    
    ytdlp.stderr.on('data', (data) => {
      stderr += data.toString();
      console.log('yt-dlp:', data.toString());
    });
    
    ytdlp.on('close', (code) => {
      if (existsSync(tempFile)) {
        const stats = statSync(tempFile);
        if (stats.size > 0) {
          resolve(tempFile);
        } else {
          try { unlinkSync(tempFile); } catch (e) {}
          reject(new Error('Downloaded file is empty'));
        }
      } else {
        reject(new Error(stderr || 'Download failed - no output file'));
      }
    });
    
    ytdlp.on('error', (error) => {
      try { unlinkSync(tempFile); } catch (e) {}
      reject(error);
    });
  });
};

export const streamInstagramAudio = (url) => {
  return spawn(YTDLP_PATH, [
    '-f', 'bestaudio',
    '-x',
    '--audio-format', 'mp3',
    '--audio-quality', '0',
    '-o', '-',
    '--no-warnings',
    '--no-playlist',
    url
  ]);
};

export const getInstagramSize = async (url, height, type = 'video') => {
  return new Promise((resolve) => {
    let args;
    
    if (type === 'audio') {
      args = ['-f', 'bestaudio', '--print', '%(filesize,filesize_approx)s', '--no-playlist', url];
    } else {
      const formatSelector = height 
        ? `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`
        : 'bestvideo+bestaudio/best';
      args = ['-f', formatSelector, '--print', '%(filesize,filesize_approx)s', '--no-playlist', url];
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
