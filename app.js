const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Trang chủ hiển thị file index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// API route để chuyển đổi text-to-speech
app.post('/convert', async (req, res) => {
    const text = req.body.text; // Lấy văn bản từ form
    const voice = req.body.voice || 'banmai'; // Giọng mặc định là 'banmai'
    const speed = req.body.speed || 0; // Tốc độ mặc định là 0
    const api_key = process.env.API_KEY;

    if (!api_key) {
        return res.status(500).json({ error: "API key chưa được cấu hình." });
    }

    const url = "https://api.fpt.ai/hmi/tts/v5";
    const headers = {
        'api_key': api_key,
        'Content-Type': 'application/json'
    };
    const data = {
        text: text,
        voice: voice,
        speed: speed
    };

    try {
        const response = await axios.post(url, data, { headers });
        if (response.data.async) {
            return res.json({ audio_url: response.data.async });
        } else {
            return res.status(400).json({ error: "Không có liên kết âm thanh trả về." });
        }
    } catch (error) {
        return res.status(500).json({ error: "Lỗi khi gửi yêu cầu." });
    }
});

app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});
