import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

/** The repair script placed in the maths app under the old main-app script names (see tools/old-main-assets.json). */
const REPAIR = `// An old offline copy of the main Exam Prep app answered for this address. Remove it and reload.
(async () => {
  try {
    if (sessionStorage.getItem('maths-repair')) {
      document.body.innerHTML = '<p style="font:600 18px sans-serif;padding:24px">Please close the app completely and open it again.</p>';
      return;
    }
    sessionStorage.setItem('maths-repair', '1');
    const regs = navigator.serviceWorker ? await navigator.serviceWorker.getRegistrations() : [];
    await Promise.all(regs.map((r) => r.unregister()));
    if (window.caches) { const keys = await caches.keys(); await Promise.all(keys.map((k) => caches.delete(k))); }
  } catch (e) { /* reload anyway */ }
  location.replace(location.pathname.replace(/[^/]*$/, '') + '?fresh=' + Date.now());
})();
`;

// Two apps from the same code (Jenia, 24 Nov): the main "Exam Prep" at /exam-prep/, and "Prep Exam Maths"
// at /exam-prep/maths/, which shows only maths tests and has an orange icon. `vite build --mode maths` makes the second.
// Both are on the same site, so they share her saved progress.
// A third app, "exam-prepSCI" (Jenia, 28 Nov): `vite build --mode science` shows only science tests, with a green icon.
// It is published as its own site (hippaa-hub.github.io/exam-prepSCI/), outside the main app's service worker.
export default defineConfig(({ mode }) => {
  const maths = mode === 'maths';
  const science = mode === 'science';
  const icon = (name: string) => (maths ? `maths-${name}` : science ? `science-${name}` : name);
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
        : science
          ? html.replace(/<title>[^<]*<\/title>/, '<title>exam-prepSCI</title>')
            .replace('content="Exam Prep"', 'content="exam-prepSCI"')
            .replace('content="#5b5bd6"', 'content="#1f9d55"')
            .replace(/\.\/apple-touch-icon\.png/g, './science-apple-touch-icon.png')
            .replace(/\.\/icon-192\.png/g, './science-icon-192.png')
          : html),
    },
    maths && {
      name: 'repair-old-main-copies',
      generateBundle() {
        const { names } = JSON.parse(readFileSync(new URL('./tools/old-main-assets.json', import.meta.url), 'utf8')) as { names: string[] };
        for (const name of names) this.emitFile({ type: 'asset', fileName: `assets/${name}`, source: REPAIR });
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [icon('icon-192.png'), icon('icon-512.png'), icon('apple-touch-icon.png')],
      manifest: {
        id: maths ? 'prep-exam-maths' : science ? 'exam-prep-sci' : 'exam-prep',
        name: maths ? 'Prep Exam Maths' : science ? 'exam-prepSCI' : "Adele's Exam Prep",
        short_name: maths ? 'Prep Exam Maths' : science ? 'exam-prepSCI' : 'Exam Prep',
        description: maths ? 'Get ready for the maths test, a little every day.' : science ? 'Get ready for the science test, a little every day.' : 'Revise for the next exam, ten minutes a day.',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f6f5fb',
        theme_color: maths ? '#ff8a00' : science ? '#1f9d55' : '#5b5bd6',
        icons: [
          { src: icon('icon-192.png'), sizes: '192x192', type: 'image/png' },
          { src: icon('icon-512.png'), sizes: '512x512', type: 'image/png' },
          { src: icon('icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webp,woff2,mp4}'],
        // The main app must not answer for the maths app's address with its own page.
        ...(maths ? { globIgnores: JSON.parse(readFileSync(new URL('./tools/old-main-assets.json', import.meta.url), 'utf8')).names.map((n: string) => `assets/${n}`) }
          : science ? {}
            : { navigateFallbackDenylist: [/\/maths\//, /\/science\//], globIgnores: ['maths/**', 'science/**'] }),
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  base: './',
  build: maths ? { outDir: 'dist/maths', emptyOutDir: true } : science ? { outDir: 'dist/science', emptyOutDir: true } : {},
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
  };
});
