import { NextApiRequest, NextApiResponse } from 'next';
import purchaseApi from '@/service/ServiceLayer/purchaseApi';

export default async function handler(req, res) {
    const { method, query, body } = req;

    if (method === 'PATCH') {
        try {
            const cookies = req.headers.cookie || '';
            const { id } = query;

            if (!id) {
                return res.status(400).json({ message: 'ID is required' });
            }

            const response = await purchaseApi.updateGoodsReceiptPO(id, body, cookies);
            console.log("Response nè: ", response);
            if (response.status === 204 || response.ok) {
                return res.status(200).json({ message: 'Update successful' });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error?.message?.value || 'Unknown error');
            }
        } catch (error) {
            console.error('Error updating data:', error);
            res.status(error.response?.status || 500).json({ message: error.message });
        }
    } else {
        res.setHeader('Allow', ['PATCH']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
