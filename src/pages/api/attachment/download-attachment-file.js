import { NextApiRequest, NextApiResponse } from 'next';
import attachmentApi from '@/service/ServiceLayer/attachmentApi';

export default async function handler(req, res) {
    const { method, body } = req;

    if (method === 'POST') {
        try {
            const cookies = req.headers.cookie || '';

            const { attachmentEntry, fileName, fileExtension } = body;

            if (!attachmentEntry) {
                return res.status(400).json({ message: 'Attachment entry is required' });
            }
            if (!fileName) {
                return res.status(400).json({ message: 'File name is required' });
            }
            if (!fileExtension) {
                return res.status(400).json({ message: 'File extension is required' });
            }

            const response = await attachmentApi.getAttachmentFile(body, cookies);

            console.log("Sắp được ời", response)
            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }

            const fileData = await response.arrayBuffer();

            res.setHeader('Content-Disposition', `attachment; filename="${fileName}.${fileExtension}"`);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.send(Buffer.from(fileData));
            
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(error.response?.status || 500).json({ message: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
