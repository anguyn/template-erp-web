import { NextApiRequest, NextApiResponse } from 'next';
import purchaseApi from '@/service/ServiceLayer/purchaseApi';

export default async function handler(req, res) {
    const { method, query } = req;

    if (method === 'POST') {
        try {
            const cookies = req.headers.cookie || '';

            const { id } = query;

            if (!id) {
                return res.status(400).json({
                    error: {
                        code: -1,
                        value: 'ID is required'
                    }
                });
            }
            

            const response = await purchaseApi.cancelGoodReceiptPO(id, cookies);

            if (!response.ok) {
                const errorData = await response.json();
                throw { status: response.status, body: errorData.error };
            }

            if (response.status === 204) {
                return res.status(204).end(); 
            }

            const data = await response.json();

            res.status(response.status).json(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(error.status || 500).json({ error: error.body });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
