import { NextApiRequest, NextApiResponse } from 'next';
import salesApi from '@/service/ServiceLayer/salesApi';

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'POST') {
        try {
            const { select, filter, orderby, top, skip } = req.body;
            
            const queryParams = { select, filter, orderby, top, skip };

            const cookies = req.headers.cookie || '';

            const response = await salesApi.getPaymentTerm(queryParams, cookies);

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
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
