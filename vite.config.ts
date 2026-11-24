import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

// Two apps from the same code (Jenia, 24 Nov): the main "Exam Prep" at /exam-prep/, and "Prep Exam Maths"
// at /exam-prep/maths/, which shows only maths tests and has an orange icon. `vite build --mode maths` makes the second.
// Both are on the same site, so they share her saved progress.
export default defineConfig(({ mode }) => {
  const maths = mode === 'maths';
  const icon = (name: string) => (maths ? `maths-${name}` : name);
  return {
  plugins: [
    react(),
    {
      name: 'app-name',
      transformIndexHtml: (html: string) => (maths
        ? html.replace(/<title>[^<]*<\/title>/, '<title>Prep Exam Maths</title>')
          .replace('content="Exam Prep"', 'content="Prep Exam Maths"')
          .replace('content="#5b5bd6"', 'content="#ff8a00"')
          .replace(/\.\/apple-touch-icon\.png/g, './maths-apple-touch-icon.png')
          .replace(/\.\/icon-192\.png/g, './maths-icon-192.png')
        : html),
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [icon('icon-192.png'), icon('icon-512.png'), icon('apple-touch-icon.png')],
      manifest: {
        id: maths ? 'prep-exam-maths' : 'exam-prep',
        name: maths ? 'Prep Exam Maths' : "Adele's Exam Prep",
        short_name: maths ? 'Prep Exam Maths' : 'Exam Prep',
        description: maths ? 'Get ready for the maths test, a little every day.' : 'Revise for the next exam, ten minutes a day.',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f6f5fb',
        theme_color: maths ? '#ff8a00' : '#5b5bd6',
        icons: [
          { src: icon('icon-192.png'), sizes: '192x192', type: 'image/png' },
          { src: icon('icon-512.png'), sizes: '512x512', type: 'image/png' },
          { src: icon('icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webp,woff2,mp4}'],
        // The main app must not answer for the maths app's address with its own page.
        ...(maths ? {} : { navigateFallbackDenylist: [/\/maths\//], globIgnores: ['maths/**'] }),
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  base: './',
  build: maths ? { outDir: 'dist/maths', emptyOutDir: true } : {},
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
  };
});
