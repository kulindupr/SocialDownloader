import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import videoRoutes from './routes/video.js';
import youtubeRoutes from './routes/youtube.js';
import instagramRoutes from './routes/instagram.js';
import tiktokRoutes from './routes/tiktok.js';
import { YTDLP_PATH } from './utils/ytdlpPath.js';

dotenv.config();

const app = express();

// Use Railway's assigned PORT or fallback for local dev
const PORT = parseInt(process.env.PORT, 10) || 5000;

// CORS: allowed origins - include Vercel deployment
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://social-downloader-delta.vercel.app',
  'https://socialdownloader.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

// Remove duplicates
const uniqueOrigins = [...new Set(allowedOrigins)];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (health checks, mobile apps, curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches vercel pattern
    if (uniqueOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    console.warn(`CORS blocked: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
    ytdlp: YTDLP_PATH ? 'available' : 'missing'
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
