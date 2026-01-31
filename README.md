# 🎬 SocialDownloader

A modern, feature-rich social media video downloader supporting **YouTube**, **Facebook**, **Instagram**, and **TikTok**. Built with React and Node.js, featuring a beautiful iOS-style glassmorphism UI.

![SocialDownloader](https://img.shields.io/badge/Version-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

### 🎯 Multi-Platform Support
- **YouTube** - Videos, Shorts, and full Playlist support
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

### 🛡️ Robust Error Handling
- Graceful error messages
- Auto-retry on failed downloads
- Filters out deleted/private videos from playlists

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Utility-first Styling |
| **Framer Motion** | Animations & Transitions |
| **React Router DOM** | Client-side Routing |
| **Axios** | HTTP Client |
| **Lucide React** | Beautiful Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **yt-dlp** | Video Extraction Engine |
| **Archiver** | ZIP File Creation |
| **CORS** | Cross-Origin Resource Sharing |
| **dotenv** | Environment Variables |
| **express-validator** | Input Validation |

### External Dependencies
| Tool | Purpose |
|------|---------|
| **yt-dlp** | Core video extraction (YouTube, Facebook, Instagram, TikTok) |
| **FFmpeg** | Video/Audio merging and conversion |

---

## 📋 Prerequisites

Before running this project, ensure you have:

### 1. Node.js (v18 or higher)
Download from [nodejs.org](https://nodejs.org/)

```bash
node --version  # Should be v18+
```

### 2. yt-dlp (Required)

**Windows (using WinGet):**
```powershell
winget install yt-dlp
```

**Windows (using Chocolatey):**
```powershell
choco install yt-dlp
```

**macOS (using Homebrew):**
```bash
brew install yt-dlp
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt install yt-dlp
# or using pip
pip install yt-dlp
```

### 3. FFmpeg (Required for video merging)

**Windows:**
```powershell
winget install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

### 4. Verify Installation
```bash
yt-dlp --version
ffmpeg -version
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/SocialDownloader.git
cd SocialDownloader
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run the Application

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend Dev Server:**
```bash
cd client
npm run dev
```

### 6. Open in Browser
Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
SocialDownloader/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI Components
│   │   │   ├── Navbar.jsx     # Navigation with platform links
│   │   │   └── Footer.jsx     # Professional footer
│   │   ├── pages/             # Page Components
│   │   │   ├── HomePage.jsx   # Landing page
│   │   │   ├── YouTubePage.jsx    # YouTube downloader
│   │   │   ├── FacebookPage.jsx   # Facebook downloader
│   │   │   ├── InstagramPage.jsx  # Instagram downloader
│   │   │   └── TikTokPage.jsx     # TikTok downloader
│   │   ├── services/
│   │   │   └── api.js         # API client functions
│   │   ├── App.jsx            # Main app with routing
│   │   └── index.css          # Global styles + Tailwind
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                    # Node.js Backend
│   ├── controllers/           # Request handlers
│   │   ├── youtubeController.js
│   │   ├── facebookController.js
│   │   ├── instagramController.js
│   │   └── tiktokController.js
│   ├── routes/                # API routes
│   │   ├── youtube.js
│   │   ├── video.js           # Facebook routes
│   │   ├── instagram.js
│   │   └── tiktok.js
│   ├── utils/                 # Utility modules
│   │   ├── ytdlpPath.js       # yt-dlp executable finder
│   │   ├── ytdlpYoutube.js    # YouTube extraction
│   │   ├── ytdlpInstagram.js  # Instagram extraction
│   │   ├── ytdlpTiktok.js     # TikTok extraction
│   │   ├── ytdlp.js           # Facebook extraction
│   │   └── downloader.js      # Stream utilities
│   ├── index.js               # Server entry point
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### YouTube
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/youtube/info` | Get video information |
| POST | `/api/youtube/download` | Download video/audio |
| POST | `/api/youtube/playlist/info` | Get playlist information |
| POST | `/api/youtube/playlist/download` | Download full playlist as ZIP |
| POST | `/api/youtube/playlist/download-selected` | Download selected videos as ZIP |

### Facebook
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/video/info` | Get video information |
| POST | `/api/video/download` | Download video (MP4) |
| POST | `/api/video/download-audio` | Download audio (MP3) |

### Instagram
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/instagram/info` | Get video information |
| POST | `/api/instagram/download` | Download video/audio |

### TikTok
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tiktok/info` | Get video information |
| POST | `/api/tiktok/download` | Download video/audio |

---

## 🎨 UI Components

### Navbar
- Perfectly centered navigation using absolute positioning
- Platform-specific icons (YouTube, Facebook, Instagram, TikTok)
- Dark/Light mode toggle with smooth animation
- Mobile-responsive hamburger menu
- Glassmorphism styling with backdrop blur

### Footer
- Professional design with gradient separator
- Legal disclaimer section
- Feature badges (Safe & Secure, Multi-Platform, Free Forever)
- Copyright notice

### Video Cards
- Thumbnail preview with fallback
- Format/quality selection buttons
- Progress bar for downloads
- Playlist video selection with checkboxes

---

## ⚙️ Configuration

### yt-dlp Path Detection

The application automatically detects yt-dlp in these locations:
1. WinGet Packages folder (Windows)
2. System PATH
3. Common installation directories

If yt-dlp is not found, install it using the commands in Prerequisites.

### Supported URL Formats

**YouTube:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/playlist?list=PLAYLIST_ID`

**Facebook:**
- `https://www.facebook.com/watch?v=VIDEO_ID`
- `https://fb.watch/VIDEO_ID`
- `https://www.facebook.com/reel/VIDEO_ID`

**Instagram:**
- `https://www.instagram.com/p/POST_ID`
- `https://www.instagram.com/reel/REEL_ID`
- `https://www.instagram.com/tv/IGTV_ID`

**TikTok:**
- `https://www.tiktok.com/@username/video/VIDEO_ID`
- `https://vm.tiktok.com/VIDEO_ID`

---

## 🚀 Deployment

### Step 1: Deploy Backend to Railway

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app) and sign up

2. **Install Railway CLI** (optional but recommended)
   ```powershell
   npm install -g @railway/cli
   railway login
   ```

3. **Deploy via GitHub** (Recommended)
   - Push your code to GitHub
   - In Railway Dashboard, click "New Project" → "Deploy from GitHub repo"
   - Select your repository and choose the `server` folder as root directory

4. **Or Deploy via CLI**
   ```powershell
   cd server
   railway init
   railway up
   ```

5. **Set Environment Variables in Railway Dashboard**
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

6. **Copy your Railway URL** (e.g., `https://socialdownloader-production.up.railway.app`)

---

### Step 2: Deploy Frontend to Vercel

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com) and sign up

2. **Install Vercel CLI** (optional)
   ```powershell
   npm install -g vercel
   vercel login
   ```

3. **Deploy via GitHub** (Recommended)
   - In Vercel Dashboard, click "Add New" → "Project"
   - Import your GitHub repository
   - Set the **Root Directory** to `client`
   - Add Environment Variable:
     ```
     VITE_API_URL=https://your-railway-backend-url.railway.app/api
     ```
   - Click Deploy

4. **Or Deploy via CLI**
   ```powershell
   cd client
   vercel --prod
   ```
   When prompted, set:
   - Root Directory: `./` (you're already in client)
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

### Step 3: Update Backend CORS

After deploying frontend, update Railway environment variable:
```
FRONTEND_URL=https://your-app-name.vercel.app
```

---

### Deployment Checklist

| Step | Platform | Action |
|------|----------|--------|
| 1 | Railway | Deploy server folder |
| 2 | Railway | Set `FRONTEND_URL` env variable |
| 3 | Vercel | Deploy client folder |
| 4 | Vercel | Set `VITE_API_URL` env variable |
| 5 | Railway | Update `FRONTEND_URL` with actual Vercel URL |

### Important Notes

⚠️ **Railway automatically installs yt-dlp and FFmpeg** via the `nixpacks.toml` configuration.

⚠️ **Environment Variables**: Make sure to set them in the deployment platform dashboards, not just in local `.env` files.

⚠️ **Free Tier Limits**:
- Railway: 500 hours/month (sleeps after inactivity)
- Vercel: Unlimited for static sites

---

### Frontend (Vercel/Netlify)

```bash
cd client
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Render/DigitalOcean)

⚠️ **Important:** The backend requires yt-dlp and FFmpeg binaries, so it cannot run on serverless platforms like Vercel Functions.

**Recommended:** Deploy on a VPS or container-based platform:
- Railway
- Render
- DigitalOcean App Platform
- Heroku (with buildpacks)
- Self-hosted VPS

---

## 🐛 Troubleshooting

### yt-dlp not found (ENOENT error)
```bash
# Reinstall yt-dlp
winget install yt-dlp  # Windows
brew install yt-dlp    # macOS

# Restart terminal/server after installation
```

### Video downloads with audio only
This happens when video+audio streams need merging. Ensure FFmpeg is installed:
```bash
ffmpeg -version
```

### 403 Forbidden errors
Some videos are age-restricted or geo-blocked. Update yt-dlp to the latest version:
```bash
yt-dlp -U
```

### Playlist shows deleted/private videos
The app automatically filters out unavailable videos. If you still see them, try fetching the playlist again.

---

## 📄 License

This project is licensed under the MIT License.

---

## ⚠️ Disclaimer

This tool is intended for **personal use only**. Users are responsible for ensuring their downloads comply with applicable laws and the terms of service of the respective platforms. We do not host, store, or distribute any copyrighted content.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ by SocialDownloader Team
