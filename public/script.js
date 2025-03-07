// Add event listeners for the "Send" button and "Enter" key
document.getElementById('send-btn').addEventListener('click', sendMessage);

document.getElementById('user-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Function to handle sending messages
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;

    // Check if the input is empty
    if (!userInput.trim()) {return};

    const chatBox = document.getElementById('chat-box');

    // Add the user's message to the chat box
    chatBox.innerHTML += `<div class="message user-message"><strong>You:</strong> ${userInput}</div>`;
    document.getElementById('user-input').value = ''; // Clear the input field

    try {
        // Send the user's message to the server
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        });

        const data = await response.json();
        console.log("Frontend Received Response:", data); // Debugging log

        // Add the chatbot's response to the chat box
        if (data.choices && data.choices.length > 0) {
            chatBox.innerHTML += `<div class="message bot-message"><strong>Chatbot:</strong> ${data.choices[0].message.content}</div>`;
        } else {
            chatBox.innerHTML += `<div class="message bot-message"><strong>Chatbot:</strong> Error: No response from API</div>`;
        }

        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Error in frontend request:", error);
        chatBox.innerHTML += `<div class="message bot-message"><strong>Chatbot:</strong> Error: Could not connect to server</div>`;
    }
}