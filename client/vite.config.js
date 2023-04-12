import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';


export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                // Disable service worker on `/api`, allowing the client to request the api without receiving a
                // cached 404 page. Also disable blocking any Firebase reserved URLs.
                navigateFallbackDenylist: [/^\/api/, /^\/__\//]
            }
        })
    ],
    build: {
        sourcemap: true
    },
    server: {
        port: 3000
    }
});
