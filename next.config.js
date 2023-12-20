/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    // reactStrictMode: true,
    i18n: {
        locales: ["en-us"],
        defaultLocale: "en-us",
    },
    images: {
        remotePatterns: [
            {
                hostname: "*.storage.xata.sh",
                protocol: "https",
            }
        ],
        domains: ["*.storage.xata.sh"]
    }
}

module.exports = nextConfig
