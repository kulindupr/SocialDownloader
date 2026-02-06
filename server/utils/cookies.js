import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const COOKIES_DIR = join(tmpdir(), 'socialdownloader');
const YOUTUBE_COOKIES_FILE = join(COOKIES_DIR, 'youtube_cookies.txt');
const INSTAGRAM_COOKIES_FILE = join(COOKIES_DIR, 'instagram_cookies.txt');
const TIKTOK_COOKIES_FILE = join(COOKIES_DIR, 'tiktok_cookies.txt');

// Ensure cookies directory exists
const ensureCookiesDir = () => {
  if (!existsSync(COOKIES_DIR)) {
    mkdirSync(COOKIES_DIR, { recursive: true });
  }
};

// Write cookies from base64 environment variable to file
const writeCookiesFromEnv = (envVar, filePath) => {
  const cookiesBase64 = process.env[envVar];
  if (cookiesBase64) {
    try {
      ensureCookiesDir();
      const cookies = Buffer.from(cookiesBase64, 'base64').toString('utf-8');
      writeFileSync(filePath, cookies);
      console.log(`✅ Cookies written to ${filePath}`);
      return true;
    } catch (error) {
      console.error(`Failed to write cookies: ${error.message}`);
      return false;
    }
  }
  return false;
};

// Initialize all cookies on startup
export const initializeCookies = () => {
  ensureCookiesDir();
  
  const results = {
    youtube: writeCookiesFromEnv('YOUTUBE_COOKIES', YOUTUBE_COOKIES_FILE),
    instagram: writeCookiesFromEnv('INSTAGRAM_COOKIES', INSTAGRAM_COOKIES_FILE),
    tiktok: writeCookiesFromEnv('TIKTOK_COOKIES', TIKTOK_COOKIES_FILE)
  };
  
  console.log('Cookie initialization:', results);
  return results;
};

// Get cookies file path if exists
export const getYouTubeCookiesArgs = () => {
  if (existsSync(YOUTUBE_COOKIES_FILE)) {
    return ['--cookies', YOUTUBE_COOKIES_FILE];
  }
  return [];
};

export const getInstagramCookiesArgs = () => {
  if (existsSync(INSTAGRAM_COOKIES_FILE)) {
    return ['--cookies', INSTAGRAM_COOKIES_FILE];
  }
  return [];
};

export const getTikTokCookiesArgs = () => {
  if (existsSync(TIKTOK_COOKIES_FILE)) {
    return ['--cookies', TIKTOK_COOKIES_FILE];
  }
  return [];
};

export { YOUTUBE_COOKIES_FILE, INSTAGRAM_COOKIES_FILE, TIKTOK_COOKIES_FILE };
