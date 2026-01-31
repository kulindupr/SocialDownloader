import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

export const fetchVideoInfo = async (url) => {
  try {
    const response = await api.post('/video/info', { url });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch video info');
    } else if (error.request) {
      throw new Error('Server is not responding. Please try again later.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const downloadVideo = async (videoUrl, height, filename, onProgress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/video/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: videoUrl,
        height: height,
        filename: filename
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Download failed');
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (onProgress && total) {
        onProgress(Math.round((loaded / total) * 100));
      } else if (onProgress) {
        onProgress(-1);
      }
    }

    const blob = new Blob(chunks, { type: 'video/mp4' });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'facebook-video.mp4';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    
    return true;
  } catch (error) {
    console.error('Download error:', error);
    throw new Error(error.message || 'Failed to download video');
  }
};

export const downloadFacebookAudio = async (videoUrl, filename, onProgress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/video/download-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: videoUrl,
        filename: filename
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Download failed');
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (onProgress && total) {
        onProgress(Math.round((loaded / total) * 100));
      } else if (onProgress) {
        onProgress(-1);
      }
    }

    const blob = new Blob(chunks, { type: 'audio/mpeg' });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'facebook-audio.mp3';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    
    return true;
  } catch (error) {
    console.error('Audio download error:', error);
    throw new Error(error.message || 'Failed to download audio');
  }
};

// YouTube API functions
export const fetchYouTubeInfo = async (url) => {
  try {
    const response = await api.post('/youtube/info', { url });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch YouTube video info');
    } else if (error.request) {
      throw new Error('Server is not responding. Please try again later.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const downloadYouTube = async (videoUrl, height, type, filename, onProgress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: videoUrl,
        height: height,
        type: type,
        filename: filename
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Download failed');
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (onProgress && total) {
        onProgress(Math.round((loaded / total) * 100));
      } else if (onProgress) {
        onProgress(-1);
      }
    }

    const isAudio = type === 'audio';
    const mimeType = isAudio ? 'audio/mpeg' : 'video/mp4';
    const ext = isAudio ? 'mp3' : 'mp4';
    
    const blob = new Blob(chunks, { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || `youtube-${isAudio ? 'audio' : 'video'}.${ext}`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    
    return true;
  } catch (error) {
    console.error('YouTube download error:', error);
    throw new Error(error.message || 'Failed to download YouTube content');
  }
};

export const fetchYouTubePlaylistInfo = async (url) => {
  try {
    const response = await api.post('/youtube/playlist/info', { url });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch playlist info');
    } else if (error.request) {
      throw new Error('Server is not responding. Please try again later.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const downloadYouTubePlaylist = async (url, type, height, onProgress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/playlist/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, type, height }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Download failed');
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (onProgress && total) {
        onProgress(Math.round((loaded / total) * 100));
      } else if (onProgress) {
        onProgress(-1);
      }
    }

    const blob = new Blob(chunks, { type: 'application/zip' });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `youtube_playlist_${Date.now()}.zip`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    
    return true;
  } catch (error) {
    console.error('Playlist download error:', error);
    throw new Error(error.message || 'Failed to download playlist');
  }
};

export const downloadSelectedPlaylistVideos = async (url, type, height, selectedIndices, onProgress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/playlist/download-selected`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, type, height, selectedIndices }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Download failed');
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (onProgress && total) {
        onProgress(Math.round((loaded / total) * 100));
      } else if (onProgress) {
        onProgress(-1);
      }
    }

    const blob = new Blob(chunks, { type: 'application/zip' });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `youtube_selected_${Date.now()}.zip`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    
    return true;
  } catch (error) {
    console.error('Selected playlist download error:', error);
    throw new Error(error.message || 'Failed to download selected videos');
  }
};

export const fetchInstagramInfo = async (url) => {
  try {
    const response = await api.post('/instagram/info', { url });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch Instagram video info');
    } else if (error.request) {
      throw new Error('Server is not responding. Please try again later.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const downloadInstagram = async (videoUrl, height, type, filename, onProgress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/instagram/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: videoUrl,
        height: height,
        type: type,
        filename: filename
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Download failed');
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (onProgress && total) {
        onProgress(Math.round((loaded / total) * 100));
      } else if (onProgress) {
        onProgress(-1);
      }
    }

    const isAudio = type === 'audio';
    const mimeType = isAudio ? 'audio/mpeg' : 'video/mp4';
    const ext = isAudio ? 'mp3' : 'mp4';
    
    const blob = new Blob(chunks, { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || `instagram-${isAudio ? 'audio' : 'video'}.${ext}`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    
    return true;
  } catch (error) {
    console.error('Instagram download error:', error);
    throw new Error(error.message || 'Failed to download Instagram content');
  }
};

export const fetchTikTokInfo = async (url) => {
  try {
    const response = await api.post('/tiktok/info', { url });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch TikTok video info');
    } else if (error.request) {
      throw new Error('Server is not responding. Please try again later.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const downloadTikTok = async (videoUrl, height, type, filename, onProgress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tiktok/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: videoUrl,
        height: height,
        type: type,
        filename: filename
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Download failed');
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (onProgress && total) {
        onProgress(Math.round((loaded / total) * 100));
      } else if (onProgress) {
        onProgress(-1);
      }
    }

    const isAudio = type === 'audio';
    const mimeType = isAudio ? 'audio/mpeg' : 'video/mp4';
    const ext = isAudio ? 'mp3' : 'mp4';
    
    const blob = new Blob(chunks, { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || `tiktok-${isAudio ? 'audio' : 'video'}.${ext}`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    
    return true;
  } catch (error) {
    console.error('TikTok download error:', error);
    throw new Error(error.message || 'Failed to download TikTok content');
  }
};

export default api;
