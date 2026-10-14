import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: [
        'icons/favicon-32x32.png',
        'icons/apple-touch-icon.png',
        'offline.html',
        'sw-push.js',
      ],
      manifest: {
        name: 'Kirana+',
        short_name: 'Kirana+',
        description: 'Grocery shopping and delivery application',
        theme_color: '#2563EB',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        categories: ['shopping', 'food'],
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        importScripts: ['sw-push.js'],
        // Precache the app shell
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        globIgnores: ['**/node_modules/**'],

        // Runtime caching strategies
        runtimeCaching: [
          // Cache First — Google Fonts stylesheets
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Cache First — Google Fonts webfonts
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Stale While Revalidate — Product images (external URLs)
          {
            urlPattern: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'product-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Network First — Public products API (GET only, the only public endpoint)
          {
            urlPattern: ({ url, request }) => {
              return url.pathname === '/api/products' && request.method === 'GET';
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'products-api',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
              cacheableResponse: {
                statuses: [200],
              },
              networkTimeoutSeconds: 10,
            },
          },
          // Network Only — All authenticated/sensitive API endpoints
          // This covers: auth, orders, payments, addresses, profile
          {
            urlPattern: ({ url }) => {
              const sensitivePatterns = [
                '/api/auth',
                '/api/orders',
              ];
              return sensitivePatterns.some(pattern =>
                url.pathname.startsWith(pattern)
              );
            },
            handler: 'NetworkOnly',
          },
          // Network Only — Razorpay
          {
            urlPattern: /^https:\/\/checkout\.razorpay\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          // Network Only — Google OAuth
          {
            urlPattern: /^https:\/\/www\.googleapis\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/accounts\.google\.com\/.*/i,
            handler: 'NetworkOnly',
          },
        ],

        // Offline fallback for navigation requests (App Shell)
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
      },

      // Dev options (enable for testing in dev)
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
