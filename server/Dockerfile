# Use Node 18 (same as local)
FROM node:18-bullseye

# Install FFmpeg and yt-dlp (needed for video processing)
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip curl build-essential && \
    pip3 install --upgrade yt-dlp && \
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
