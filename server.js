import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const fetch = (await import('node-fetch')).default;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from the "public" folder

// API route
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch('https://chatbot4npc.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-02-15-preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.OPENAI_API_KEY,
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: userMessage }],
            }),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching response:', error);
        res.status(500).json({ error: 'Error fetching response.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});