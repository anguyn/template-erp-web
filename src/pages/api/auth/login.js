import { NextApiRequest, NextApiResponse } from 'next';
import usersApi from '@/service/ServiceLayer/authApi';
import cookie from 'cookie';

export default async function handler(req, res) {
    const { method, body } = req;

    if (method === 'POST') {
        const { company, username, password } = body;

        if (!company || !username || !password) {
            return res.status(400).json({ message: 'Missing company, username, or password' });
        }

        try {
            const loginResponse = await usersApi.login(company, username, password);

            // Convert the headers to a plain object
            const headers = loginResponse.headers;

            // Iterate over the headers map to get the 'set-cookie' header
            const headersMap = new Map(headers.entries());
            const setCookieHeaders = headersMap.get('set-cookie') || headersMap.get('Set-Cookie') || [];

            // console.log("Set-Cookie Header: ", setCookieHeaders);

            // Ensure setCookieHeaders is an array
            const cookiesArray = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];

            // If multiple cookies are combined in a single string, split them correctly
            const individualCookies = cookiesArray.flatMap(cookieString => 
                cookieString.split(/,(?=[^;]*;)/) // Split by comma not followed by a semicolon
            );

            // console.log("Individual Cookies: ", individualCookies);

            // Initialize variables to hold cookies
            let b1sessionCookie;
            let routeidCookie;

            // Find B1SESSION and ROUTEID cookies
            individualCookies.forEach(cookie => {
                if (cookie.startsWith('B1SESSION=')) {
                    b1sessionCookie = cookie;
                } else if (cookie.trim().startsWith('ROUTEID=')) {
                    routeidCookie = cookie.trim();
                }
            });

            // Set cookies in the response if they exist
            const serializedCookies = [];
            if (b1sessionCookie) {
                serializedCookies.push(cookie.serialize('B1SESSION', b1sessionCookie.split(';')[0].split('=')[1], {
                    httpOnly: true,
                    secure: true,
                    // secure: process.env.NODE_ENV !== 'development',
                    maxAge: 10800,
                    path: '/',
                    domain: '.localhost',
                    sameSite: 'None'
                }));
            } else {
                console.warn('B1SESSION cookie not found in the set-cookie header.');
            }

            if (routeidCookie) {
                serializedCookies.push(cookie.serialize('ROUTEID', routeidCookie.split(';')[0].split('=')[1], {
                    httpOnly: false,
                    secure: true,
                    // secure: process.env.NODE_ENV !== 'development',
                    maxAge: 10800,
                    path: '/',
                    domain: '.localhost',
                    sameSite: 'None'
                }));
            } else {
                console.warn('ROUTEID cookie not found in the set-cookie header.');
            }

            // Set all cookies in the response
            res.setHeader('Set-Cookie', serializedCookies);

            const data = await loginResponse.json();

            // Respond with the login response status and data
            res.status(loginResponse.status).json(data);
        } catch (error) {
            console.error('Error logging in:', error);
            // Respond with the error status and message
            res.status(error.response?.status || 500).json({ message: error.message });
        }
    } else {
        // Handle unsupported methods
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
