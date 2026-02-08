// Gemini Chatbot Integration
const GEMINI_API_KEY = "AIzaSyA5Y8ML4eMeevdAM9Ks-9Gh5DLryrm37s4"; // Exposed for demo
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

document.addEventListener('DOMContentLoaded', () => {
    injectChatStyles();
    injectChatUI();
    setupEventListeners();
});

function injectChatStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #ai-chat-widget {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        #ai-chat-widget.visible {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
        }
        #chat-header {
            background: #1e293b;
            padding: 15px;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #334155;
        }
        #chat-header h3 { margin: 0; color: #f8fafc; font-size: 16px; }
        #close-chat { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 18px; }
        #chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            color: #e2e8f0;
            font-size: 14px;
        }
        .message { margin-bottom: 10px; max-width: 80%; padding: 8px 12px; border-radius: 8px; line-height: 1.4; }
        .user-msg { background: #3b82f6; color: white; align-self: flex-end; margin-left: auto; }
        .ai-msg { background: #334155; color: #f1f5f9; align-self: flex-start; }
        #chat-input-area {
            padding: 15px;
            border-top: 1px solid #334155;
            display: flex;
            gap: 10px;
        }
        #chat-input {
            flex: 1;
            background: #1e293b;
            border: 1px solid #475569;
            border-radius: 6px;
            color: white;
            padding: 8px;
            outline: none;
        }
        #send-btn {
            background: #3b82f6;
            border: none;
            border-radius: 6px;
            color: white;
            padding: 8px 12px;
            cursor: pointer;
        }
        #send-btn:hover { background: #2563eb; }
        .typing-indicator { font-style: italic; color: #94a3b8; font-size: 12px; margin-bottom: 10px; }
    `;
    document.head.appendChild(style);
}

function injectChatUI() {
    const chatDiv = document.createElement('div');
    chatDiv.id = 'ai-chat-widget';
    chatDiv.innerHTML = `
        <div id="chat-header">
            <h3>Research Assistant</h3>
            <button id="close-chat">×</button>
        </div>
        <div id="chat-messages">
            <div class="message ai-msg">Hello! I'm your debate research assistant using Gemini. How can I help you prepare?</div>
        </div>
        <div id="chat-input-area">
            <input type="text" id="chat-input" placeholder="Ask a question..." />
            <button id="send-btn">Send</button>
        </div>
    `;
    document.body.appendChild(chatDiv);
}

function setupEventListeners() {
    const toggleBtn = document.querySelector('.ResearchAssistant-module__a-ADZG__toggleBtn');
    const chatWidget = document.getElementById('ai-chat-widget');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            chatWidget.classList.toggle('visible');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chatWidget.classList.remove('visible');
        });
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Add User Message
        appendMessage(text, 'user-msg');
        input.value = '';

        // show typing
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.textContent = 'Gemini is thinking...';
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "You are a helpful debate assistant. Keep answers concise. User: " + text }] }]
                })
            });

            const data = await response.json();
            messages.removeChild(typingDiv);

            if (data.candidates && data.candidates[0].content) {
                const aiText = data.candidates[0].content.parts[0].text;
                appendMessage(aiText, 'ai-msg');
            } else {
                appendMessage("Sorry, I encountered an error.", 'ai-msg');
            }
        } catch (error) {
            messages.removeChild(typingDiv);
            console.error(error);
            appendMessage("Error connecting to Gemini.", 'ai-msg');
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function appendMessage(text, className) {
        const div = document.createElement('div');
        div.className = `message ${className}`;
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }
}
