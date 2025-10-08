const BACKEND_URL = 'http://localhost:3001';

// Check backend status
async function checkBackendStatus() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/health`);
        if (response.ok) {
            document.getElementById('backendStatus').textContent = 'Connected';
            document.getElementById('backendStatus').className = 'connected';
        } else {
            throw new Error('Backend not responding properly');
        }
    } catch (error) {
        document.getElementById('backendStatus').textContent = 'Disconnected';
        document.getElementById('backendStatus').className = 'error';
    }
}

// Load messages from backend
async function loadMessages() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/messages`);
        const messages = await response.json();
        
        const messagesList = document.getElementById('messagesList');
        messagesList.innerHTML = '';
        
        if (messages.length === 0) {
            messagesList.innerHTML = '<p>No messages yet. Be the first to add one!</p>';
            return;
        }
        
        messages.reverse().forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.className = 'message-item';
            messageElement.innerHTML = `
                <div class="message-content">
                    <strong>${new Date(msg.timestamp).toLocaleString()}:</strong>
                    <span>${msg.message}</span>
                </div>
                <button class="delete-message-btn" onclick="deleteMessage(${msg.id})">Delete</button>
            `;
            messagesList.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Failed to load messages:', error);
        document.getElementById('messagesList').innerHTML = 
            '<p style="color: red;">Failed to load messages. Check if backend is running.</p>';
    }
}

// Add these functions to your existing app.js

// Delete all messages
async function deleteAllMessages() {
    if (!confirm('Are you sure you want to delete ALL messages? This cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/messages`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            alert('All messages deleted successfully');
            loadMessages();
        } else {
            const error = await response.json();
            alert('Failed to delete messages: ' + error.error);
        }
    } catch (error) {
        console.error('Error deleting messages:', error);
        alert('Error deleting messages. Check backend connection.');
    }
}

// Delete a specific message
async function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/messages/${messageId}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            loadMessages();
        } else {
            const error = await response.json();
            alert('Failed to delete message: ' + error.error);
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error deleting message. Check backend connection.');
    }
}

// Cleanup old messages
async function cleanupOldMessages() {
    const hours = prompt('Delete messages older than how many hours?', '24');
    
    if (hours === null) return; // User cancelled
    
    const hoursNum = parseInt(hours);
    if (isNaN(hoursNum) || hoursNum < 1) {
        alert('Please enter a valid number of hours (1 or more)');
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/messages/cleanup/${hoursNum}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            loadMessages();
        } else {
            const error = await response.json();
            alert('Failed to cleanup messages: ' + error.error);
        }
    } catch (error) {
        console.error('Error cleaning up messages:', error);
        alert('Error cleaning up messages. Check backend connection.');
    }
}

// Handle form submission
document.getElementById('messageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        
        if (response.ok) {
            messageInput.value = '';
            loadMessages();
        } else {
            alert('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message. Check backend connection.');
    }
});

// Initialize
checkBackendStatus();
loadMessages();
deleteAllMessages()
cleanupOldMessages()
setInterval(checkBackendStatus, 30000);