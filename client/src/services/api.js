import axios from 'axios';

// Fix: Ensure the API_URL is correctly read from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Debug log to verify the URL
console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Facebook API functions
export const fetchVideoInfo = async (url) => {
  const response = await api.post('/video/info', { url });
  return response.data;
};

export const downloadVideo = async (url, height, filename, onProgress) => {
  const response = await api.post('/video/download', 
    { url, height, filename },
    {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  const blob = new Blob([response.data], { type: 'video/mp4' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || 'video.mp4';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export const downloadFacebookAudio = async (url, filename, onProgress) => {
  const response = await api.post('/video/download-audio',
    { url, filename },
    {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  const blob = new Blob([response.data], { type: 'audio/mpeg' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || 'audio.mp3';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

// YouTube API functions
export const fetchYouTubeInfo = async (url) => {
  const response = await api.post('/youtube/info', { url });
  return response.data;
};

// Cookie-free YouTube functions (for deployment)
export const fetchYouTubeInfoNoCookies = async (url) => {
  const response = await api.post('/youtube/info-nocookies', { url });
  return response.data;
};

export const downloadYouTubeVideoNoCookies = async (url, filename, onProgress) => {
  const response = await api.post('/youtube/download-nocookies',
    { url, filename },
    {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  const blob = new Blob([response.data], { type: 'video/mp4' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || 'youtube-video.mp4';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export const fetchYouTubePlaylistInfo = async (url) => {
  const response = await api.post('/youtube/playlist/info', { url });
  return response.data;
};

export const downloadYouTubeVideo = async (url, height, type, filename, onProgress) => {
  const response = await api.post('/youtube/download',
    { url, height, type, filename },
    {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  const mimeType = type === 'audio' ? 'audio/mpeg' : 'video/mp4';
  const ext = type === 'audio' ? 'mp3' : 'mp4';
  const blob = new Blob([response.data], { type: mimeType });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || `video.${ext}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export const downloadYouTubePlaylist = async (url, height, type, onProgress) => {
  const response = await api.post('/youtube/playlist/download',
    { url, height, type },
    {
      responseType: 'blob',
      timeout: 600000,
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  const blob = new Blob([response.data], { type: 'application/zip' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'playlist.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export const downloadSelectedPlaylistVideos = async (url, selectedIndices, height, type, onProgress) => {
  const response = await api.post('/youtube/playlist/download-selected',
    { url, selectedIndices, height, type },
    {
      responseType: 'blob',
      timeout: 600000,
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  const blob = new Blob([response.data], { type: 'application/zip' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'selected-videos.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

// Instagram API functions
export const fetchInstagramInfo = async (url) => {
  const response = await api.post('/instagram/info', { url });
  return response.data;
};

// Cookie-free Instagram functions (for deployment)
export const fetchInstagramInfoNoCookies = async (url) => {
  const response = await api.post('/instagram/info-nocookies', { url });
  return response.data;
};

export const downloadInstagramVideoNoCookies = async (url, filename, onProgress) => {
  const response = await api.post('/instagram/download-nocookies',
    { url, filename },
    {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  const blob = new Blob([response.data], { type: 'video/mp4' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || 'instagram-video.mp4';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export const downloadInstagramVideo = async (url, type, filename, onProgress) => {
  const response = await api.post('/instagram/download',
    { url, type, filename },
    {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  const mimeType = type === 'audio' ? 'audio/mpeg' : 'video/mp4';
  const ext = type === 'audio' ? 'mp3' : 'mp4';
  const blob = new Blob([response.data], { type: mimeType });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || `instagram.${ext}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

// TikTok API functions
export const fetchTikTokInfo = async (url) => {
  const response = await api.post('/tiktok/info', { url });
  return response.data;
};

// Cookie-free TikTok functions (for deployment)
export const fetchTikTokInfoNoCookies = async (url) => {
  const response = await api.post('/tiktok/info-nocookies', { url });
  return response.data;
};

export const downloadTikTokVideoNoCookies = async (url, filename, onProgress) => {
  const response = await api.post('/tiktok/download-nocookies',
    { url, filename },
    {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  const blob = new Blob([response.data], { type: 'video/mp4' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || 'tiktok-video.mp4';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export const downloadTikTokVideo = async (url, type, filename, onProgress) => {
  const response = await api.post('/tiktok/download',
    { url, type, filename },
    {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  const mimeType = type === 'audio' ? 'audio/mpeg' : 'video/mp4';
  const ext = type === 'audio' ? 'mp3' : 'mp4';
  const blob = new Blob([response.data], { type: mimeType });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || `tiktok.${ext}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export default api;