// /pages/api/ssb1s.js
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req, res) {
    const { method, body } = req;

    if (method === 'POST') {
        try {
            // Gửi yêu cầu POST tới máy chủ đích
            const response = await axios.post('https://localhost:50000/b1s/v1/ssob1s', body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Trả lại phản hồi từ máy chủ đích tới client
            res.status(response.status).json(response.data);
        } catch (error) {
            console.error('Error posting to ssb1s:', error);
            res.status(error.response?.status || 500).json({ message: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
