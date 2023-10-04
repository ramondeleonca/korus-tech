/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    // reactStrictMode: true,
    i18n: {
        locales: ["en-us"],
        defaultLocale: "en-us",
    }
}

module.exports = nextConfig
