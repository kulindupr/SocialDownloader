# Use Node 18 (same as local)
FROM node:18-bullseye

# Install FFmpeg and yt-dlp (with latest Python available)
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip curl build-essential && \
    python3 -m pip install --upgrade pip setuptools wheel && \
    python3 -m pip install --upgrade yt-dlp && \
    rm -rf /var/lib/apt/lists/*

# Set working folder inside the container
WORKDIR /app

# Copy Node.js dependencies and install
COPY package*.json ./
RUN npm install --production

# Copy all backend code
COPY . .

# Expose port 5000 for Fly.io
EXPOSE 5000

# Start backend server
CMD ["node", "index.js"]
