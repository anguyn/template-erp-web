import { NextApiRequest, NextApiResponse } from 'next';
import globalApi from '@/service/ServiceLayer/globalApi';

export default async function handler(req, res) {
    const { method, query } = req;

    if (method === 'GET') {
        try {
            const { select, filter, orderby, top, skip } = query;

            const queryParams = { select, filter: ["Category eq 'bovcOutputTax'"], orderby, top, skip };

            const cookies = req.headers.cookie || '';

            const response = await globalApi.getVatGroups(queryParams, cookies);

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
