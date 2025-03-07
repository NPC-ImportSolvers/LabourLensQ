const backendUrl = 'https://your-render-backend-url.onrender.com'; // Replace with your Render backend URL

document.getElementById('send-btn').addEventListener('click', sendMessage);

document.getElementById('user-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;

    if (!userInput.trim()) {return};

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<div class="message user-message"><strong>You:</strong> ${userInput}</div>`;
    document.getElementById('user-input').value = '';

    try {
        const response = await fetch(`${backendUrl}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        });

        const data = await response.json();
        console.log("Frontend Received Response:", data);

        if (data.choices && data.choices.length > 0) {
            chatBox.innerHTML += `<div class="message bot-message"><strong>Chatbot:</strong> ${data.choices[0].message.content}</div>`;
        } else {
            chatBox.innerHTML += `<div class="message bot-message"><strong>Chatbot:</strong> Error: No response from API</div>`;
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Error in frontend request:", error);
        chatBox.innerHTML += `<div class="message bot-message"><strong>Chatbot:</strong> Error: Could not connect to server</div>`;
    }
}