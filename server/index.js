import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import videoRoutes from './routes/video.js';
import youtubeRoutes from './routes/youtube.js';
import instagramRoutes from './routes/instagram.js';
import tiktokRoutes from './routes/tiktok.js';
import { YTDLP_PATH } from './utils/ytdlpPath.js';
import { initializeCookies } from './utils/cookies.js';

dotenv.config();

// Initialize cookies from environment variables
const cookieStatus = initializeCookies();

const app = express();

// Use Railway's assigned PORT or fallback for local dev
const PORT = parseInt(process.env.PORT, 10) || 5000;

// CORS configuration - allow Vercel frontend
const corsOptions = {
  origin: [
    'https://social-downloader-delta.vercel.app',
    'https://socialdownloader.vercel.app',
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ].filter(Boolean),
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Enable pre-flight for all routes
app.options('*', cors(corsOptions));

// Apply CORS to all requests
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/video', videoRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/tiktok', tiktokRoutes);

// Health check for Fly.io / Railway
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    ytdlp: YTDLP_PATH ? 'available' : 'missing',
    cookies: cookieStatus
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server and listen on all interfaces
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check available at /health`);
  console.log(`🍪 Cookies: YouTube=${cookieStatus.youtube}, Instagram=${cookieStatus.instagram}, TikTok=${cookieStatus.tiktok}`);
  if (process.env.FRONTEND_URL) {
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
  }
  if (YTDLP_PATH) {
    console.log(`🎬 yt-dlp ready: ${YTDLP_PATH}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⚠️ SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
