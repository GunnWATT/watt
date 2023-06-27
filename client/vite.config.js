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
        // Tauri supports es2021
        target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
        minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
        sourcemap: true
    },
    server: {
        port: 3000,
        strictPort: true
    },
    // to make use of `TAURI_DEBUG` and other env variables
    // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
    envPrefix: ["VITE_", "TAURI_"],
    clearScreen: false
});
