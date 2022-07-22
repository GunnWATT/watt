const withPWA = require('next-pwa')

module.exports = withPWA({
    reactStrictMode: true,
    experimental: {
        esmExternals: false
    },
    pwa: {
        dest: 'public',
        disable: process.env.NODE_ENV === 'development',
        reloadOnOnline: true,
        skipWaiting: true
    }
});
