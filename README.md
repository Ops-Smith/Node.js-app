# Node.js Demo Application
A simple full-stack Node.js application demonstrating a message board with frontend and backend services, containerized with Docker.

# 🚀 Overview
This application consists of:

1. Backend API - Node.js/Express server running on port 3001

2. Frontend - Static web server running on port 3000

3. Docker - Containerized deployment with volume persistence

4. Bash Script - Automated build and deployment

# 🏗️ Architecture
```text
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
```
# 📋 Features
- ✅ Add new messages via web interface

- ✅ View all messages with timestamps

- ✅ Real-time backend status monitoring

- ✅ Data persistence with Docker volumes

- ✅ Responsive design

- ✅ Health check endpoints

# 🛠️ Prerequisites
1. Node.js (v14 or higher)

2. Docker (v20 or higher)

3. Git

# 🏃‍♂️ Local Development
1. Clone and Setup

```bash
git clone <repo url>
cd nodejs-demo
```

2. Backend Setup

```bash
cd backend
npm install
npm start
```
Backend will run on: http://localhost:3001

3. Frontend Setup
```bash

# New terminal window/tab
cd frontend
npm install
npm start
```
Frontend will run on: http://localhost:3000

4. Test the Application
* Open http://localhost:3000 in your browser

* You should see the message board interface

* Backend status should show "Connected ✅"

* Try sending a message - it should appear instantly

# 🐳 Docker Deployment
## Using the Automated Script (Recommended)
```bash
# Make the script executable (first time only)
chmod +x run.sh

# Run the application
./run.sh
```

The script will:

1. 🛑 Stop any existing containers

2. 📦 Build new Docker images

3. 🌐 Create Docker network

4. 🐳 Start both backend and frontend containers

5. ✅ Verify everything is running

6. 🔗 Provide access URLs