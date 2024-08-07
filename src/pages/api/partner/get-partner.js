import { NextApiRequest, NextApiResponse } from 'next';
import partnersApi from '@/service/ServiceLayer/partnersApi';

export default async function handler(req, res) {
    const { method, query, body } = req;

    if (method === 'POST') {
        try {
            const cookies = req.headers.cookie || '';

            const { id } = query;

            const { select, filter, orderby, top, skip } = body;

            const queryParams = { select, filter, orderby, top, skip };


            if (!id) {
                return res.status(400).json({ message: 'ID is required' });
            }

            const response = await partnersApi.getPartnerByCardCode(id, queryParams, cookies);

            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }

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
