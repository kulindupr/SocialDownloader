import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { execSync } from 'child_process';

// Get yt-dlp executable path (handles both PATH and WinGet installation)
const getYtDlpPath = () => {
  const localAppData = process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local');
  
  // Check common installation paths first (more reliable than PATH on Windows)
  const possiblePaths = [
    // WinGet Packages folder (most common for WinGet installs)
    join(localAppData, 'Microsoft', 'WinGet', 'Packages', 'yt-dlp.yt-dlp_Microsoft.Winget.Source_8wekyb3d8bbwe', 'yt-dlp.exe'),
    // WinGet Links folder
    join(localAppData, 'Microsoft', 'WinGet', 'Links', 'yt-dlp.exe'),
    // Other common paths
    join(homedir(), 'AppData', 'Local', 'Programs', 'yt-dlp', 'yt-dlp.exe'),
    'C:\\Program Files\\yt-dlp\\yt-dlp.exe',
    'C:\\yt-dlp\\yt-dlp.exe',
    '/usr/local/bin/yt-dlp', // Linux/Mac
    '/usr/bin/yt-dlp',
  ];

  for (const p of possiblePaths) {
    if (existsSync(p)) {
      console.log(`Found yt-dlp at: ${p}`);
      return p;
    }
  }
  
  // Search in WinGet Packages folder for any yt-dlp package
  try {
    const packagesDir = join(localAppData, 'Microsoft', 'WinGet', 'Packages');
    if (existsSync(packagesDir)) {
      const dirs = readdirSync(packagesDir);
      for (const dir of dirs) {
        if (dir.toLowerCase().includes('yt-dlp')) {
          const ytdlpPath = join(packagesDir, dir, 'yt-dlp.exe');
          if (existsSync(ytdlpPath)) {
            console.log(`Found yt-dlp in WinGet packages: ${ytdlpPath}`);
            return ytdlpPath;
          }
        }
      }
    }
  } catch (e) {
    console.error('Error searching WinGet packages:', e.message);
  }
  
  // Try to find via 'where' command on Windows
  try {
    const result = execSync('where.exe yt-dlp', { encoding: 'utf-8', timeout: 5000 }).trim();
    if (result && existsSync(result.split('\n')[0])) {
      console.log(`Found yt-dlp via where: ${result.split('\n')[0]}`);
      return result.split('\n')[0];
    }
  } catch (e) {
    // where command failed, continue
  }

  // Try 'which' on Unix
  try {
    const result = execSync('which yt-dlp', { encoding: 'utf-8', timeout: 5000 }).trim();
    if (result && existsSync(result)) {
      console.log(`Found yt-dlp via which: ${result}`);
      return result;
    }
  } catch (e) {
    // which command failed, continue
  }

  // Last resort - assume it's in PATH (will fail with clear error if not)
  console.error('ERROR: yt-dlp not found! Please install it: winget install yt-dlp');
  return 'yt-dlp';
};

export const YTDLP_PATH = getYtDlpPath();
console.log(`Using yt-dlp from: ${YTDLP_PATH}`);
