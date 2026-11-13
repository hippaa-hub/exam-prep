import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from './App';
import './ui/styles.css';

// Keeps the app working offline and picks up new versions on the next open.
registerSW({ immediate: true });
// Ask the phone not to clear saved progress when it is short of space.
void navigator.storage?.persist?.();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
