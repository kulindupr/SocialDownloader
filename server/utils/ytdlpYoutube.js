import { spawn } from 'child_process';
import { existsSync, statSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir, homedir } from 'os';
import { YTDLP_PATH } from './ytdlpPath.js';

// Extract YouTube video info
export const extractYouTubeInfo = (url) => {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn(YTDLP_PATH, [
      '--dump-json',
      '--no-warnings',
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
        reject(new Error(stderr || 'Failed to extract video info'));
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

// Parse formats from YouTube video info - simplified for user-friendly display
export const parseYouTubeFormats = (info) => {
  const formats = info.formats || [];
  const videoFormats = [];
  const audioFormats = [];
  
  // Get unique heights for video quality options
  const heightMap = new Map();
  
  formats.forEach(f => {
    // Only consider formats with video and reasonable quality
    if (f.vcodec && f.vcodec !== 'none' && f.height) {
      const height = f.height;
      if (!heightMap.has(height) || (f.filesize && f.filesize > (heightMap.get(height).filesize || 0))) {
        heightMap.set(height, f);
      }
    }
  });

  // Create simplified format list sorted by quality (highest first)
  const sortedHeights = Array.from(heightMap.keys()).sort((a, b) => b - a);
  
  sortedHeights.forEach(height => {
    const f = heightMap.get(height);
    let label = `${height}p`;
    
    // Add quality labels
    if (height >= 2160) label = '2160p (4K)';
    else if (height >= 1440) label = '1440p (2K)';
    else if (height >= 1080) label = '1080p (Full HD)';
    else if (height >= 720) label = '720p (HD)';
    else if (height >= 480) label = '480p (SD)';
    else if (height >= 360) label = '360p';
    else if (height >= 240) label = '240p';
    else label = `${height}p`;

    videoFormats.push({
      height,
      label,
      format_id: f.format_id,
      filesize: f.filesize || f.filesize_approx || null,
      type: 'video'
    });
  });

  // Add audio-only option for MP3
  audioFormats.push({
    height: null,
    label: 'Audio Only (MP3)',
    format_id: 'bestaudio',
    filesize: null,
    type: 'audio'
  });

  return {
    videoFormats,
    audioFormats,
    allFormats: [...videoFormats, ...audioFormats]
  };
};

// Stream YouTube video download
export const streamYouTubeVideo = (url, height) => {
  const formatSelector = height 
    ? `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`
    : 'bestvideo+bestaudio/best';

  return spawn(YTDLP_PATH, [
    '-f', formatSelector,
    '--merge-output-format', 'mp4',
    '-o', '-',
    '--no-warnings',
    url
  ]);
};

// Stream YouTube audio download (for MP3)
export const streamYouTubeAudio = (url) => {
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

// Get video size for progress tracking
export const getYouTubeVideoSize = async (url, height, type = 'video') => {
  return new Promise((resolve) => {
    let args;
    
    if (type === 'audio') {
      args = ['-f', 'bestaudio', '--print', '%(filesize,filesize_approx)s', url];
    } else {
      const formatSelector = height 
        ? `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`
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

export const extractPlaylistInfo = (url) => {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn(YTDLP_PATH, [
      '--dump-json',
      '--flat-playlist',
      '--no-warnings',
      url
    ]);

    let stdout = '';
    let stderr = '';
    const entries = [];

    ytdlp.stdout.on('data', (data) => {
      stdout += data.toString();
      const lines = stdout.split('\n');
      stdout = lines.pop();
      
      lines.forEach(line => {
        if (line.trim()) {
          try {
            entries.push(JSON.parse(line));
          } catch (e) {}
        }
      });
    });

    ytdlp.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ytdlp.on('close', (code) => {
      if (code !== 0 && entries.length === 0) {
        reject(new Error(stderr || 'Failed to extract playlist info'));
        return;
      }

      if (stdout.trim()) {
        try {
          entries.push(JSON.parse(stdout));
        } catch (e) {}
      }

      const firstEntry = entries[0] || {};
      resolve({
        title: firstEntry.playlist_title || 'YouTube Playlist',
        uploader: firstEntry.playlist_uploader || firstEntry.channel,
        playlist_count: entries.length,
        entries: entries.map(e => ({
          title: e.title,
          duration: e.duration,
          thumbnail: e.thumbnails?.[0]?.url || e.thumbnail,
          url: `https://www.youtube.com/watch?v=${e.id}`
        }))
      });
    });

    ytdlp.on('error', (error) => {
      reject(error);
    });
  });
};

// Helper to check if video is valid (not deleted/private)
const isValidVideo = (video) => {
  if (!video || !video.url) return false;
  
  const title = (video.title || '').toLowerCase();
  // Filter out known unavailable video patterns
  return !title.includes('[deleted video]') && 
         !title.includes('[private video]') &&
         !title.includes('deleted video') &&
         !title.includes('private video') &&
         !title.includes('[unavailable]') &&
         video.title !== 'NA' &&
         video.title !== '[Deleted video]' &&
         video.title !== '[Private video]';
};

// Download a single video to buffer using temp file for proper merging
const downloadVideoToBuffer = async (videoUrl, type, height) => {
  const { spawn } = await import('child_process');
  const fs = await import('fs');
  const path = await import('path');
  const os = await import('os');
  
  const isAudio = type === 'audio';
  const ext = isAudio ? 'mp3' : 'mp4';
  const tempDir = os.tmpdir();
  const tempFile = path.join(tempDir, `ytdl_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`);
  
  return new Promise((resolve, reject) => {
    let args;
    if (isAudio) {
      args = [
        '-f', 'bestaudio',
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', '0',
        '-o', tempFile,
        '--no-warnings',
        '--no-playlist',
        '--no-check-certificates',
        '--extractor-retries', '3',
        '--fragment-retries', '3',
        '--retry-sleep', '1',
        videoUrl
      ];
    } else {
      const formatSelector = height 
        ? `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`
        : 'bestvideo+bestaudio/best';
      args = [
        '-f', formatSelector,
        '--merge-output-format', 'mp4',
        '-o', tempFile,
        '--no-warnings',
        '--no-playlist',
        '--no-check-certificates',
        '--extractor-retries', '3',
        '--fragment-retries', '3',
        '--retry-sleep', '1',
        videoUrl
      ];
    }
    
    const ytdlp = spawn(YTDLP_PATH, args);
    let stderr = '';
    
    ytdlp.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    ytdlp.on('close', async (code) => {
      try {
        // Check if file exists and has content
        if (fs.existsSync(tempFile)) {
          const stats = fs.statSync(tempFile);
          if (stats.size > 0) {
            const buffer = fs.readFileSync(tempFile);
            fs.unlinkSync(tempFile); // Clean up temp file
            resolve(buffer);
          } else {
            fs.unlinkSync(tempFile);
            reject(new Error('Empty file'));
          }
        } else {
          // Parse error message for user-friendly feedback
          let errorMsg = 'Download failed';
          if (stderr.includes('Video unavailable')) {
            errorMsg = 'Video unavailable (deleted/private/region-blocked)';
          } else if (stderr.includes('403')) {
            errorMsg = 'Access forbidden (age-restricted or geo-blocked)';
          } else if (stderr.includes('404')) {
            errorMsg = 'Video not found';
          }
          reject(new Error(errorMsg));
        }
      } catch (err) {
        // Clean up temp file if it exists
        try { fs.unlinkSync(tempFile); } catch (e) {}
        reject(err);
      }
    });
    
    ytdlp.on('error', (error) => {
      try { fs.unlinkSync(tempFile); } catch (e) {}
      reject(error);
    });
  });
};

export const downloadPlaylistToZip = async (url, type, height, res) => {
  const archiver = (await import('archiver')).default;
  
  const archive = archiver('zip', { zlib: { level: 5 } });
  archive.pipe(res);
  
  const playlistInfo = await extractPlaylistInfo(url);
  // Filter out deleted and private videos
  const videos = playlistInfo.entries.filter(isValidVideo).slice(0, 50);
  
  console.log(`Downloading ${videos.length} videos from playlist...`);
  
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const sanitizedTitle = (video.title || `video_${i + 1}`)
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
    
    const isAudio = type === 'audio';
    const ext = isAudio ? 'mp3' : 'mp4';
    const filename = `${String(i + 1).padStart(2, '0')}_${sanitizedTitle}.${ext}`;
    
    console.log(`Downloading ${i + 1}/${videos.length}: ${video.title}`);
    
    try {
      const buffer = await downloadVideoToBuffer(video.url, type, height);
      archive.append(buffer, { name: filename });
      console.log(`✓ Added: ${filename}`);
    } catch (err) {
      console.error(`✗ Failed to download: ${video.title}`, err.message);
    }
  }
  
  await archive.finalize();
};

export const downloadSelectedPlaylistToZip = async (url, type, height, selectedIndices, res) => {
  const archiver = (await import('archiver')).default;
  
  const archive = archiver('zip', { zlib: { level: 5 } });
  archive.pipe(res);
  
  const playlistInfo = await extractPlaylistInfo(url);
  
  // Filter out deleted/private videos first, then filter by selected indices
  const validEntries = playlistInfo.entries.filter(isValidVideo);
  const selectedVideos = validEntries.filter((_, i) => selectedIndices.includes(i + 1));
  
  console.log(`Downloading ${selectedVideos.length} selected videos...`);
  
  for (let i = 0; i < selectedVideos.length; i++) {
    const video = selectedVideos[i];
    const originalIndex = selectedIndices[i];
    const sanitizedTitle = (video.title || `video_${originalIndex}`)
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
    
    const isAudio = type === 'audio';
    const ext = isAudio ? 'mp3' : 'mp4';
    const filename = `${String(originalIndex).padStart(2, '0')}_${sanitizedTitle}.${ext}`;
    
    console.log(`Downloading ${i + 1}/${selectedVideos.length}: ${video.title}`);
    
    try {
      const buffer = await downloadVideoToBuffer(video.url, type, height);
      archive.append(buffer, { name: filename });
      console.log(`✓ Added: ${filename}`);
    } catch (err) {
      console.error(`✗ Failed to download: ${video.title}`, err.message);
    }
  }
  
  await archive.finalize();
};
