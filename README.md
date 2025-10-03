# Node.js Demo Application
A simple full-stack Node.js application demonstrating a message board with frontend and backend services, containerized with Docker.

# 🚀 Overview
This application consists of:

1. Backend API - Node.js/Express server running on port 3001

2. Frontend - Static web server running on port 3000

3. Docker - Containerized deployment with volume persistence

4. Bash Script - Automated build and deployment

# 🏗️ Architecture

nodejs-demo/
├── backend/                 # Express.js API server
│   ├── server.js           # Main backend server
│   ├── package.json        # Backend dependencies
│   └── data/               # Local data storage (messages.json)
├── frontend/               # Static web server
│   ├── server.js           # Frontend static server
│   ├── package.json        # Frontend dependencies
│   └── public/             # Frontend assets
│       ├── index.html      # Main HTML page
│       ├── style.css       # Styling
│       └── app.js          # Frontend JavaScript
├── Dockerfile.backend      # Backend Docker configuration
├── Dockerfile.frontend     # Frontend Docker configuration
└── run.sh                  # Deployment script

# 📋 Features
- ✅ Add new messages via web interface

- ✅ View all messages with timestamps

- ✅ Real-time backend status monitoring

- ✅ Data persistence with Docker volumes

- ✅ Responsive design

- ✅ Health check endpoints