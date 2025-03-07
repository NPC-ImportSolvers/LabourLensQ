import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Dynamic import for node-fetch
const fetch = (await import('node-fetch')).default;

const app = express();
app.use(express.json());  
app.use(cors());  
app.use(express.static('public')); 
app.use(cors({ origin: "*" }));

//Check if API key and endpoint are loaded
const apiUrl = "https://chatbot4npc.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-02-15-preview"; // Make sure this is correct!
console.log("Using API URL:", apiUrl);
console.log("API Key Loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");

//API route (Move fetch() inside here)
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message; // Get message from request body

    try {
        let response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.OPENAI_API_KEY 
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: userMessage }]
            })
        });

        let data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2)); // Debugging

        res.json(data); // Send response back to frontend
    } catch (error) {
        console.error("Error fetching response:", error);
        res.status(500).json({ error: "Error fetching response." });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});