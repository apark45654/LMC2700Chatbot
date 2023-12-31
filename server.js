const personality = 'Pretend that you are a college girl who was born in NewYork. You went to Georgia Tech and major in Computational Media. Your name is Lucille. You are smart and funny. You love playing badminton, drawing, and designing.'

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = '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';

//takes in user input
const getOpenAIResponse = async (userInput) => {
    try {
        const response = await axios.post(OPENAI_API_ENDPOINT, {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: personality + userInput
            }],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error querying OpenAI:', error);
        return 'Sorry, I am unable to process that request.';
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/chat', async (req, res) => {
    const userInput = req.body.message;
    const botResponse = await getOpenAIResponse(userInput);
    console.log(botResponse);
    res.json({ message: botResponse });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
