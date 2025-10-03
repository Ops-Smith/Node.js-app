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
                <strong>${new Date(msg.timestamp).toLocaleString()}:</strong>
                <span>${msg.message}</span>
            `;
            messagesList.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Failed to load messages:', error);
        document.getElementById('messagesList').innerHTML = 
            '<p style="color: red;">Failed to load messages. Check if backend is running.</p>';
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
setInterval(checkBackendStatus, 30000);