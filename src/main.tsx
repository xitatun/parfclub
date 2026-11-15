import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

const updateSW = registerSW({
  immediate: true,
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('atelier:pwa-offline-ready'));
  },
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('atelier:pwa-need-refresh'));
  },
  onRegisteredSW(_swUrl, registration) {
    if (registration) {
      window.dispatchEvent(
        new CustomEvent('atelier:pwa-registered', { detail: { registration } })
      );
    }
  },
});

(window as unknown as { __atelierUpdateSW?: (reloadPage?: boolean) => Promise<void> }).__atelierUpdateSW =
  updateSW;

createRoot(document.getElementById('root')!).render(<App />);
