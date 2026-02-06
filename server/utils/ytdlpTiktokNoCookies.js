import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { YTDLP_PATH } from './ytdlpPath.js';

// TikTok extraction without cookies
export const extractTikTokInfo = (url) => {
  return new Promise((resolve, reject) => {
    const strategies = [
      {
        name: 'mobile-app',
        args: [
          '--user-agent', 'TikTok 21.1.0 rv:211017 (iPhone; iOS 14.4.2; en_US) Cronet'
        ]
      },
      {
        name: 'mobile-web',
        args: [
          '--user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1'
        ]
      },
      {
        name: 'desktop-bypass',
        args: [
          '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          '--add-header', 'Accept-Language:en-US,en;q=0.9'
        ]
      }
    ];

    const tryExtract = async (strategyIndex = 0) => {
      if (strategyIndex >= strategies.length) {
        reject(new Error('All TikTok extraction strategies failed'));
        return;
      }

      const strategy = strategies[strategyIndex];
      console.log(`TikTok: Trying strategy ${strategy.name}...`);

      const args = [
        '--dump-json',
        '--no-warnings',
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
          console.error('Failed to parse TikTok info:', error);
          tryExtract(strategyIndex + 1);
        }
      });
    };

    tryExtract();
  });
};

// Download TikTok video without cookies
export const downloadTikTokVideo = (url) => {
  return new Promise((resolve, reject) => {
    const tempId = Math.random().toString(36).substring(7);
    const outputTemplate = join(process.cwd(), 'server', 'downloads', `${tempId}.%(ext)s`);
    
    const strategies = [
      {
        name: 'mobile-app',
        args: [
          '--format', 'best',
          '--user-agent', 'TikTok 21.1.0 rv:211017 (iPhone; iOS 14.4.2; en_US) Cronet'
        ]
      },
      {
        name: 'mobile-web',
        args: [
          '--format', 'best',
          '--user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15'
        ]
      }
    ];

    const tryDownload = async (strategyIndex = 0) => {
      if (strategyIndex >= strategies.length) {
        reject(new Error('All TikTok download strategies failed'));
        return;
      }

      const strategy = strategies[strategyIndex];
      console.log(`TikTok Download: Trying strategy ${strategy.name}...`);

      const args = [
        url,
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

        const possibleFiles = [
          outputTemplate.replace('%(ext)s', 'mp4'),
          outputTemplate.replace('%(ext)s', 'webm')
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