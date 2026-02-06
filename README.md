# 🎬 SocialDownloader

A modern, feature-rich social media video downloader supporting **YouTube**, **Facebook**, **Instagram**, and **TikTok**. Built with React and Node.js, featuring a beautiful iOS-style glassmorphism UI.

![SocialDownloader](https://img.shields.io/badge/Version-2.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Deployed](https://img.shields.io/badge/Status-Live-brightgreen)

---

## 🌐 Live Demo

**🚀 Try it now:**
- **Frontend:** [https://social-downloader-delta.vercel.app](https://social-downloader-delta.vercel.app)
- **Backend API:** [https://server-twilight-flower-1963.fly.dev](https://server-twilight-flower-1963.fly.dev)
- **Health Check:** [https://server-twilight-flower-1963.fly.dev/health](https://server-twilight-flower-1963.fly.dev/health)

---

## ✨ Features

### 🎯 Multi-Platform Support
- **YouTube** - Videos, Shorts, and full Playlist support with selective download
- **Facebook** - Public videos, Reels, and audio extraction (MP3)
- **Instagram** - Posts, Reels, and IGTV
- **TikTok** - Videos with or without watermark

### 🎨 Modern UI/UX
- iOS-style glassmorphism design
- Smooth Framer Motion animations
- Dark/Light mode with system preference detection
- Fully responsive (mobile, tablet, desktop)
- Beautiful gradient accents and soft shadows

### 📥 Download Options
- **Video (MP4)** - Multiple quality options (360p, 480p, 720p, 1080p, 4K)
- **Audio (MP3)** - High-quality audio extraction
- **Playlist Downloads** - Download entire YouTube playlists as ZIP
- **Selective Playlist** - Choose specific videos from playlists
- **Direct Streaming** - Videos stream directly to your browser

### 🛡️ Robust Architecture
- **Cookie-free extraction** - No personal credentials needed
- **Multiple fallback strategies** - Android, iOS, TV, and Web user agents
- **Auto-retry on failures** - Automatically tries different extraction methods
- **CORS configured** - Secure cross-origin requests

---

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Vercel (Frontend)                            │
│              social-downloader-delta.vercel.app                  │
│                                                                  │
│  • React 18 + Vite                                               │
│  • Tailwind CSS + Framer Motion                                  │
│  • Static file hosting                                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼ API Calls
┌─────────────────────────────────────────────────────────────────┐
│                      Fly.io (Backend)                            │
│            server-twilight-flower-1963.fly.dev                   │
│                                                                  │
│  • Node.js 18 + Express                                          │
│  • yt-dlp (video extraction)                                     │
│  • FFmpeg (video/audio processing)                               │
│  • Cookie-free extraction strategies                             │
│  • Region: Singapore (sin)                                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Social Media Platforms                         │
│         YouTube │ Facebook │ Instagram │ TikTok                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite 5** | Build Tool & Dev Server |
| **Tailwind CSS 3** | Utility-first Styling |
| **Framer Motion 11** | Animations & Transitions |
| **React Router DOM** | Client-side Routing |
| **Axios** | HTTP Client |
| **Lucide React** | Beautiful Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 18** | Runtime Environment |
| **Express.js 4** | Web Framework |
| **yt-dlp** | Video Extraction Engine |
| **Archiver** | ZIP File Creation |
| **CORS** | Cross-Origin Resource Sharing |
| **dotenv** | Environment Variables |

### Deployment
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting (CDN, auto-deploy) |
| **Fly.io** | Backend hosting (Docker, global regions) |
| **Docker** | Backend containerization |

### External Dependencies
| Tool | Purpose |
|------|---------|
| **yt-dlp** | Core video extraction (YouTube, Facebook, Instagram, TikTok) |
| **FFmpeg** | Video/Audio merging and conversion |

---

## 📋 API Endpoints

### Health Check
```
GET /health
```
Response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-06T04:30:00.000Z",
  "ytdlp": "available",
  "cookies": { "youtube": false, "instagram": false, "tiktok": false }
}
```

### YouTube
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/youtube/info` | POST | Get video info |
| `/api/youtube/download` | POST | Download video/audio |
| `/api/youtube/playlist/info` | POST | Get playlist info |
| `/api/youtube/playlist/download` | POST | Download full playlist |
| `/api/youtube/playlist/download-selected` | POST | Download selected videos |

### Facebook
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/video/info` | POST | Get video info |
| `/api/video/download` | POST | Download video |
| `/api/video/download-audio` | POST | Extract audio (MP3) |

### Instagram
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/instagram/info` | POST | Get video info |
| `/api/instagram/download` | POST | Download video |

### TikTok
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tiktok/info` | POST | Get video info |
| `/api/tiktok/download` | POST | Download video |

---

## 🚀 Local Development

### Prerequisites

- **Node.js** v18 or higher
- **yt-dlp** (video extraction tool)
- **FFmpeg** (video processing)

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/yourusername/SocialDownloader.git
cd SocialDownloader
```

**2. Install dependencies:**
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

**3. Configure environment variables:**

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

**4. Start the application:**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

**5. Open in browser:** http://localhost:5173

---

## ☁️ Deployment Guide

### Frontend (Vercel)

**1. Push to GitHub**

**2. Connect to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Set framework preset: **Vite**
- Set root directory: **client**

**3. Environment Variables:**
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://server-twilight-flower-1963.fly.dev/api` |

**4. Deploy!**

---

### Backend (Fly.io)

**1. Install Fly CLI:**
```bash
# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# macOS/Linux
curl -L https://fly.io/install.sh | sh
```

**2. Login to Fly.io:**
```bash
flyctl auth login
```

**3. Deploy:**
```bash
cd server
flyctl deploy
```

**4. Configuration (`fly.toml`):**
```toml
app = 'server-twilight-flower-1963'
primary_region = 'sin'

[env]
  NODE_ENV = "production"
  FRONTEND_URL = "https://social-downloader-delta.vercel.app"

[http_service]
  internal_port = 5000
  force_https = true
  auto_stop_machines = 'stop'
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  memory = '1gb'
  cpus = 1
```

**5. Dockerfile:**
```dockerfile
FROM node:18-bullseye

RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip curl build-essential && \
    python3 -m pip install --upgrade pip setuptools wheel && \
    python3 -m pip install --upgrade yt-dlp && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🔧 Cookie-Free Extraction

The backend uses **cookie-free extraction strategies** to bypass platform restrictions without requiring personal credentials:

### Strategies Used:
1. **Mobile App User Agents** - Android/iOS app signatures
2. **TV Embed** - Smart TV embedded player
3. **Web Bypass** - Desktop browser with custom headers

### Why Cookie-Free?
- ✅ **Privacy** - No personal login sessions shared
- ✅ **Security** - No credential storage
- ✅ **Reliability** - Multiple fallback methods
- ✅ **Deployment-friendly** - Works on cloud servers

---

## 📁 Project Structure

```
SocialDownloader/
├── client/                           # React Frontend
│   ├── src/
│   │   ├── components/               # Reusable UI Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── VideoPreview.jsx
│   │   │   └── DownloadButton.jsx
│   │   ├── pages/                    # Page Components
│   │   │   ├── Home.jsx
│   │   │   ├── YouTubePage.jsx
│   │   │   ├── FacebookPage.jsx
│   │   │   ├── InstagramPage.jsx
│   │   │   └── TikTokPage.jsx
│   │   ├── services/
│   │   │   └── api.js                # API client
│   │   └── App.jsx
│   ├── .env                          # Environment variables
│   ├── vercel.json                   # Vercel config
│   └── package.json
│
├── server/                           # Node.js Backend
│   ├── controllers/
│   │   ├── youtubeController.js
│   │   ├── facebookController.js
│   │   ├── instagramController.js
│   │   ├── tiktokController.js
│   │   └── noCookiesController.js    # Cookie-free handlers
│   ├── routes/
│   │   ├── youtube.js
│   │   ├── video.js                  # Facebook routes
│   │   ├── instagram.js
│   │   └── tiktok.js
│   ├── utils/
│   │   ├── ytdlpYoutube.js
│   │   ├── ytdlpYoutubeNoCookies.js  # Cookie-free YouTube
│   │   ├── ytdlpInstagram.js
│   │   ├── ytdlpInstagramNoCookies.js
│   │   ├── ytdlpTiktok.js
│   │   ├── ytdlpTiktokNoCookies.js
│   │   ├── ytdlpPath.js
│   │   └── cookies.js                # Cookie management
│   ├── downloads/                    # Temporary downloads
│   ├── Dockerfile                    # Docker configuration
│   ├── fly.toml                      # Fly.io configuration
│   ├── .env                          # Environment variables
│   └── package.json
│
└── README.md
```

---

## 🔒 CORS Configuration

The backend is configured to accept requests from:
- `https://social-downloader-delta.vercel.app` (Production)
- `http://localhost:5173` (Development)
- `http://localhost:3000` (Alternative dev)

---

## 🐛 Troubleshooting

### Common Issues

**1. 403 Forbidden Error (YouTube)**
- The backend automatically uses cookie-free extraction
- If still failing, the video may be geo-restricted or private

**2. CORS Errors**
- Ensure `FRONTEND_URL` is set correctly in Fly.io
- Check that preflight OPTIONS requests are allowed

**3. Download Timeout**
- Large files may take longer to process
- Fly.io has request timeouts; consider streaming approach

**4. yt-dlp Not Found (Local)**
- Ensure yt-dlp is installed and in PATH
- Run: `yt-dlp --version` to verify

### Check Backend Health
```bash
curl https://server-twilight-flower-1963.fly.dev/health
```

### View Fly.io Logs
```bash
flyctl logs --app server-twilight-flower-1963
```

---

## 📈 Performance Tips

1. **Use streaming downloads** - Videos stream directly to browser
2. **Limit playlist size** - Large playlists take more time
3. **Choose lower quality** - Faster downloads, less bandwidth
4. **Enable auto-stop** - Fly.io machines stop when idle (saves cost)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

This tool is for **educational purposes only**. Users are responsible for complying with the Terms of Service of respective platforms. Do not download copyrighted content without permission.

---

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Amazing video extraction library
- [FFmpeg](https://ffmpeg.org/) - Video/audio processing
- [Vercel](https://vercel.com) - Frontend hosting
- [Fly.io](https://fly.io) - Backend hosting
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS

---

**Made with ❤️ by Kulindu**
