const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const API_SECRET = process.env.SECRET_KEY;

app.post('/api/auth/create-session', async (req, res) => {
    const { userId, authCode } = req.body;

    try {
        const checksum = crypto
            .createHash('sha256')
            .update(userId + authCode + API_SECRET)
            .digest('hex');

        const response = await axios.post(
            'https://ant.aliceblueonline.com/open-api/od/v1/vendor/getUserDetails',
            {
                checksum: checksum
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        res.json(response.data);

    } catch (err) {
        console.error('ERROR:', err.response?.data || err.message);
        res.status(500).json({
            message: err.message,
            data: err.response?.data
        });
    }
});

// 👇 IMPORTANT for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});