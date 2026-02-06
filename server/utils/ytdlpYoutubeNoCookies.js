import { spawn } from 'child_process';
import { existsSync, statSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { YTDLP_PATH } from './ytdlpPath.js';

// Alternative YouTube extraction without cookies
export const extractYouTubeInfo = (url) => {
  return new Promise((resolve, reject) => {
    // Different extraction strategies without cookies
    const strategies = [
      {
        name: 'mobile-android',
        args: [
          '--extractor-args', 'youtube:player_client=android',
          '--user-agent', 'com.google.android.youtube/17.36.4 (Linux; U; Android 12; GB) gzip'
        ]
      },
      {
        name: 'mobile-ios', 
        args: [
          '--extractor-args', 'youtube:player_client=ios',
          '--user-agent', 'com.google.ios.youtube/17.36.4 (iPhone14,3; U; CPU iOS 15_6 like Mac OS X)'
        ]
      },
      {
        name: 'tv-embed',
        args: [
          '--extractor-args', 'youtube:player_client=tv_embedded',
          '--user-agent', 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/76.0.3809.146 TV Safari/537.36'
        ]
      },
      {
        name: 'web-bypass',
        args: [
          '--extractor-args', 'youtube:player_client=web',
          '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          '--add-header', 'Accept-Language:en-US,en;q=0.9'
        ]
      }
    ];

    const tryExtract = async (strategyIndex = 0) => {
      if (strategyIndex >= strategies.length) {
        reject(new Error('All extraction strategies failed'));
        return;
      }

      const strategy = strategies[strategyIndex];
      console.log(`YouTube: Trying strategy ${strategy.name}...`);

      const args = [
        '--dump-json',
        '--no-warnings',
        '--no-check-certificate',
        '--geo-bypass',
        '--force-ipv4',
        '--socket-timeout', '30',
        '--ignore-errors',
        ...strategy.args,
        url
      ];

      const ytdlp = spawn(YTDLP_PATH, args);
      let stdout = '';
      let stderr = '';

      ytdlp.stdout.on('data', (data) => stdout += data.toString());
      ytdlp.stderr.on('data', (data) => stderr += data.toString());

      ytdlp.on('close', (code) => {
        if (code !== 0) {
          console.log(`Strategy ${strategy.name} failed:`, stderr);
          tryExtract(strategyIndex + 1);
          return;
        }

        try {
          const videoInfo = JSON.parse(stdout);
          resolve(videoInfo);
        } catch (error) {
          console.error('Failed to parse video info:', error);
          tryExtract(strategyIndex + 1);
        }
      });
    };

    tryExtract();
  });
};

// Download YouTube video without cookies
export const downloadYouTubeVideo = (url) => {
  return new Promise((resolve, reject) => {
    const tempId = Math.random().toString(36).substring(7);
    const outputTemplate = join(process.cwd(), 'server', 'downloads', `${tempId}.%(ext)s`);
    
    const strategies = [
      {
        name: 'mobile-android',
        args: [
          '--format', 'best[height<=720]/best',
          '--extractor-args', 'youtube:player_client=android',
          '--user-agent', 'com.google.android.youtube/17.36.4 (Linux; U; Android 12; GB) gzip'
        ]
      },
      {
        name: 'mobile-ios',
        args: [
          '--format', 'best[height<=720]/best',
          '--extractor-args', 'youtube:player_client=ios',
          '--user-agent', 'com.google.ios.youtube/17.36.4 (iPhone14,3; U; CPU iOS 15_6 like Mac OS X)'
        ]
      },
      {
        name: 'tv-embed',
        args: [
          '--format', 'best[height<=720]/best',
          '--extractor-args', 'youtube:player_client=tv_embedded',
          '--user-agent', 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 6.0) AppleWebKit/537.36'
        ]
      }
    ];

    const tryDownload = async (strategyIndex = 0) => {
      if (strategyIndex >= strategies.length) {
        reject(new Error('All download strategies failed'));
        return;
      }

      const strategy = strategies[strategyIndex];
      console.log(`YouTube Download: Trying strategy ${strategy.name}...`);

      const args = [
        url,
        '--no-playlist',
        '--output', outputTemplate,
        '--no-warnings',
        '--geo-bypass',
        '--force-ipv4',
        '--socket-timeout', '60',
        '--retries', '3',
        '--ignore-errors',
        ...strategy.args
      ];

      const ytdlp = spawn(YTDLP_PATH, args);
      let stderr = '';

      ytdlp.stderr.on('data', (data) => stderr += data.toString());

      ytdlp.on('close', (code) => {
        if (code !== 0) {
          console.log(`Strategy ${strategy.name} failed:`, stderr);
          tryDownload(strategyIndex + 1);
          return;
        }

        // Find downloaded file
        const possibleFiles = [
          outputTemplate.replace('%(ext)s', 'mp4'),
          outputTemplate.replace('%(ext)s', 'webm'),
          outputTemplate.replace('%(ext)s', 'mkv')
        ];

        const downloadedFile = possibleFiles.find(file => existsSync(file));
        
        if (!downloadedFile) {
          console.log(`No file found for strategy ${strategy.name}`);
          tryDownload(strategyIndex + 1);
          return;
        }

        resolve(downloadedFile);
      });
    };

    tryDownload();
  });
};