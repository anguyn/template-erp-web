/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    i18n: {
        locales: ['en', 'fr', 'vi'],
        defaultLocale: 'en',
    },
    webpack: (config, { dev }) => {
        if (dev) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        }
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                port: '',
                pathname: '**',
            },
        ],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 1024, 2048],
        formats: ['image/webp'],
    },
    // experimental: {
    //     appDir: true,
    // },
};

module.exports = nextConfig;
