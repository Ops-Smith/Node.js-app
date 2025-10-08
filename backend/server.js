const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Use /app/data for Docker, ./data for local development
const dataDir = process.env.NODE_ENV === 'production' ? '/app/data' : './data';
const dataFile = path.join(dataDir, 'messages.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
    try {
        if (!fs.existsSync(dataDir)) {
            console.log('📁 Creating data directory:', dataDir);
            fs.mkdirSync(dataDir, { recursive: true });
        }
        if (!fs.existsSync(dataFile)) {
            console.log('📄 Initializing data file');
            fs.writeFileSync(dataFile, JSON.stringify([]));
        }
        console.log('✅ Data directory ready:', dataDir);
        return true;
    } catch (error) {
        console.error('❌ Error setting up data directory:', error.message);
        return false;
    }
};

// Routes
app.get('/', (req, res) => {
    const isDocker = process.env.NODE_ENV === 'production';
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Backend API</title>
        <style>
            body { 
                font-family: 'Arial', sans-serif; 
                margin: 0; 
                padding: 40px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            h1 { 
                color: #333; 
                text-align: center;
                margin-bottom: 10px;
            }
            .environment {
                text-align: center;
                color: #666;
                margin-bottom: 30px;
                padding: 10px;
                background: #e9ecef;
                border-radius: 5px;
            }
            .endpoint { 
                background: #f8f9fa; 
                padding: 20px; 
                margin: 15px 0; 
                border-radius: 8px;
                border-left: 4px solid #007bff;
            }
            .method { 
                display: inline-block; 
                padding: 5px 12px; 
                background: #007bff; 
                color: white; 
                border-radius: 4px;
                font-weight: bold;
                margin-right: 10px;
            }
            .test-link {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background: #28a745;
                color: white;
                text-decoration: none;
                border-radius: 5px;
            }
            .docker-badge {
                background: #2496ed;
                color: white;
                padding: 2px 8px;
                border-radius: 3px;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Backend API is Running!</h1>
            <div class="environment">
                ${isDocker ? '<span class="docker-badge">DOCKER</span>' : 'Local Development'}
                | Data: ${dataDir}
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> /api/messages
                <p>Get all messages</p>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> /api/messages
                <p>Add a new message (send JSON with "message" field)</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> /api/health
                <p>Health check endpoint</p>
            </div>
            
            <div style="text-align: center;">
                <a href="/api/messages" class="test-link" target="_blank">Test Messages Endpoint</a>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.get('/api/messages', (req, res) => {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        const messages = JSON.parse(data);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read messages' });
    }
});

app.post('/api/messages', (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const data = fs.readFileSync(dataFile, 'utf8');
        const messages = JSON.parse(data);
        
        const newMessage = {
            id: Date.now(),
            message: message,
            timestamp: new Date().toISOString()
        };
        
        messages.push(newMessage);
        fs.writeFileSync(dataFile, JSON.stringify(messages, null, 2));
        
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save message' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Healthy', 
        service: 'Message Board API',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        dataPath: dataDir,
        uptime: process.uptime()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 ========================================');
    console.log('🚀     Backend Server Started');
    console.log('🚀 ========================================');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`💾 Data: ${dataDir}`);
    console.log(`🐳 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('🚀 ========================================');
    
    ensureDataDirectory();
});
// Add these routes after your existing routes

// Delete all messages
app.delete('/api/messages', (req, res) => {
    try {
        fs.writeFileSync(dataFile, JSON.stringify([]));
        res.json({ message: 'All messages deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete messages' });
    }
});

// Delete a specific message by ID
app.delete('/api/messages/:id', (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        const data = fs.readFileSync(dataFile, 'utf8');
        const messages = JSON.parse(data);
        
        const initialLength = messages.length;
        const filteredMessages = messages.filter(msg => msg.id !== messageId);
        
        if (filteredMessages.length === initialLength) {
            return res.status(404).json({ error: 'Message not found' });
        }
        
        fs.writeFileSync(dataFile, JSON.stringify(filteredMessages, null, 2));
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

// Delete messages older than X hours
app.delete('/api/messages/cleanup/:hours', (req, res) => {
    try {
        const hours = parseInt(req.params.hours);
        const data = fs.readFileSync(dataFile, 'utf8');
        const messages = JSON.parse(data);
        
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - hours);
        
        const initialLength = messages.length;
        const filteredMessages = messages.filter(msg => new Date(msg.timestamp) > cutoffTime);
        const deletedCount = initialLength - filteredMessages.length;
        
        fs.writeFileSync(dataFile, JSON.stringify(filteredMessages, null, 2));
        
        res.json({ 
            message: `Deleted ${deletedCount} messages older than ${hours} hours`,
            deleted: deletedCount,
            remaining: filteredMessages.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cleanup messages' });
    }
});