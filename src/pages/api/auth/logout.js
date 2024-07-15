import { NextApiRequest, NextApiResponse } from 'next';
import usersApi from '@/service/ServiceLayer/authApi';

export default async function handler(req, res) {
    const { method, body } = req;

    if (method === 'POST') {
        try {
            const cookies = req.headers.cookie || '';

            const response = await usersApi.logout(cookies);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            res.setHeader('Set-Cookie', [
                'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                'B1SESSION=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
                'ROUTEID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
            ]);

            // console.log("Test logout: ", response)
            
            // const data = await response.json();
            // console.log("Test logout 2: ", data)

            res.status(response.status).json({message: "Successfully"});
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(error.response?.status || 500).json({ message: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
