import { spawn } from 'child_process';
import { YTDLP_PATH } from './ytdlpPath.js';

export const streamVideo = (url, height) => {
  const formatSelector = `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`;
  
  const args = [
    '-f', formatSelector,
    '--no-warnings',
    '--no-check-certificate',
    '--merge-output-format', 'mp4',
    '-o', '-',
    url
  ];

  const ytdlp = spawn(YTDLP_PATH, args);
  
  return {
    stream: ytdlp.stdout,
    process: ytdlp,
    stderr: ytdlp.stderr
  };
};

export const streamAudio = (url) => {
  const args = [
    '-f', 'bestaudio',
    '--extract-audio',
    '--audio-format', 'mp3',
    '--audio-quality', '0',
    '--no-warnings',
    '--no-check-certificate',
    '-o', '-',
    url
  ];

  const ytdlp = spawn(YTDLP_PATH, args);
  
  return {
    stream: ytdlp.stdout,
    process: ytdlp,
    stderr: ytdlp.stderr
  };
};

export const getVideoSize = (url, height) => {
  return new Promise((resolve, reject) => {
    const formatSelector = `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`;
    
    const args = [
      '-f', formatSelector,
      '--no-warnings',
      '--no-check-certificate',
      '--print', '%(filesize)s',
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
        resolve(null);
        return;
      }
      const size = parseInt(stdout.trim(), 10);
      resolve(isNaN(size) ? null : size);
    });

    ytdlp.on('error', () => {
      resolve(null);
    });
  });
};
