import { NextApiRequest, NextApiResponse } from 'next';

// Base URL cho Service Layer của bạn
const baseURL = `${process.env.NEXT_PUBLIC_SERVICE_LAYER_URL}/${process.env.NEXT_PUBLIC_ODATA_VERSION}`;

export default async function handler(req, res) {
    const { method, query } = req;

    if (method === 'GET') {
        try {
            const { select, filter, orderby, top, skip } = query;

            // Xây dựng query string từ các tham số query
            let queryString = '';
            if (select) queryString += `$select=${select}`;
            if (filter) queryString += `${queryString ? '&' : ''}$filter=${filter}`;
            if (orderby) queryString += `${queryString ? '&' : ''}$orderby=${orderby}`;
            if (top) queryString += `${queryString ? '&' : ''}$top=${top}`;
            if (skip) queryString += `${queryString ? '&' : ''}$skip=${skip}`;

            // Tạo URL hoàn chỉnh
            const url = `${baseURL}/Currencies${queryString ? '?' + queryString : ''}`;

            // Lấy cookies từ yêu cầu gốc và gắn vào header của request
            const cookies = req.headers.cookie || '';

            const options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Prefer': 'odata.maxpagesize=0',
                    'Cookie': cookies // Chuyển tiếp cookie từ request
                },
                credentials: 'include' // Đảm bảo cookies được gửi kèm
            };

            // Thực hiện yêu cầu fetch
            const response = await fetch(url, options);

            // Kiểm tra phản hồi có hợp lệ không
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Đọc dữ liệu từ phản hồi
            const data = await response.json();

            // Gửi dữ liệu phản hồi lại cho client
            res.status(response.status).json(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(error.response?.status || 500).json({ message: error.message });
        }
    } else {
        // Xử lý phương thức không được hỗ trợ
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
