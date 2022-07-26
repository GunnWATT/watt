import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';


export default defineConfig({
    plugins: [
        react({
            // Temporarily revert to `React.createElement` JSX transform due to scoping issue with `headlessui`.
            // https://github.com/tailwindlabs/headlessui/issues/1693
            jsxRuntime: 'classic'
        }),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                // Disable service worker on `/api`, allowing the client to request the api without receiving a
                // cached 404 page.
                navigateFallbackDenylist: [/^\/api/]
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
