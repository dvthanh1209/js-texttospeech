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
        text: text,  // Chỉ gửi nội dung văn bản, không cần thêm các thông tin khác vào
        voice: voice,
        speed: speed
    };

    try {
        const response = await axios.post(url, data, { headers });
        if (response.data.async) {
            return res.json({ audio_url: response.data.async });  // Trả về liên kết audio
        } else {
            return res.status(400).json({ error: "Không có liên kết âm thanh trả về." });
        }
    } catch (error) {
        return res.status(500).json({ error: "Lỗi khi gửi yêu cầu." });
    }
});
