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
                // cached 404 page. Also disable blocking the newly configured Firebase sign-in redirect URL.
                navigateFallbackDenylist: [/^\/api/, /^\/__\/auth\/handler/]
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
