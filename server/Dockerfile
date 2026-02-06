# Use Node 18 (same as local)
FROM node:18-bullseye

# Install FFmpeg and yt-dlp with Python 3.10+ (needed for video processing)
RUN apt-get update && \
    apt-get install -y ffmpeg python3.9 python3.9-pip python3.9-dev curl build-essential software-properties-common && \
    curl -sS https://bootstrap.pypa.io/get-pip.py | python3.9 && \
    python3.9 -m pip install --upgrade yt-dlp && \
    ln -sf /usr/bin/python3.9 /usr/bin/python3 && \
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
