import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import videoRoutes from './routes/video.js';
import youtubeRoutes from './routes/youtube.js';
import instagramRoutes from './routes/instagram.js';
import tiktokRoutes from './routes/tiktok.js';
import { execSync } from 'child_process';

dotenv.config();

const app = express();

// Use Railway's assigned PORT or fallback for local dev
const PORT = parseInt(process.env.PORT, 10) || 5000;

// CORS: allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS blocked: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/video', videoRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/tiktok', tiktokRoutes);

// Health check for Railway
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

// yt-dlp detection
let ytdlpPath = '';
try {
  ytdlpPath = execSync('which yt-dlp').toString().trim();
  console.log(`✅ Found yt-dlp at: ${ytdlpPath}`);
} catch (err) {
  console.error('❌ yt-dlp not found! Install yt-dlp to enable downloads.');
}

// Start server and listen on all interfaces
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check available at /health`);
  if (process.env.FRONTEND_URL) {
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
  }
  if (ytdlpPath) {
    console.log(`🎬 yt-dlp ready for use`);
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
