import { NextApiRequest, NextApiResponse } from 'next';
import purchaseApi from '@/service/ServiceLayer/purchaseApi';

export default async function handler(req, res) {
    const { method, query } = req;

    if (method === 'GET') {
        try {
            const cookies = req.headers.cookie || '';

            const { id } = query;

            if (!id) {
                return res.status(400).json({ message: 'ID is required' });
            }

            const response = await purchaseApi.getGoodReceiptPO(id, cookies);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            res.status(response.status).json(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(error.response?.status || 500).json({ message: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
