import { useEffect, useState } from 'react';

export function usePwa() {
  const [online, setOnline] = useState(navigator.onLine);
  const [ready, setReady] = useState(false);
  const [waiting, setWaiting] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let registration;
    let updateFound;
    const removers = [];
    const connection = () => setOnline(navigator.onLine);
    const beforeInstall = (event) => { event.preventDefault(); setInstallPrompt(event); };
    const installed = () => setInstallPrompt(null);
    window.addEventListener('online', connection);
    window.addEventListener('offline', connection);
    window.addEventListener('beforeinstallprompt', beforeInstall);
    window.addEventListener('appinstalled', installed);
    const checkUpdate = () => registration?.update().catch(() => {});
    window.addEventListener('focus', checkUpdate);

    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL, updateViaCache: 'none' }).then((reg) => {
        if (!active) return;
        registration = reg;
        if (reg.waiting) setWaiting(reg.waiting);
        updateFound = () => {
          const worker = reg.installing;
          if (!worker) return;
          const stateChange = () => {
            if (active && worker.state === 'installed' && navigator.serviceWorker.controller) setWaiting(reg.waiting || worker);
          };
          worker.addEventListener('statechange', stateChange);
          removers.push(() => worker.removeEventListener('statechange', stateChange));
        };
        reg.addEventListener('updatefound', updateFound);
        return navigator.serviceWorker.ready.then(() => { if (active) setReady(true); });
      }).catch(() => { if (active) setError('Offline setup could not finish. Reconnect and reload to try again.'); });
    }
    return () => {
      active = false;
      window.removeEventListener('online', connection); window.removeEventListener('offline', connection);
      window.removeEventListener('beforeinstallprompt', beforeInstall); window.removeEventListener('appinstalled', installed);
      window.removeEventListener('focus', checkUpdate);
      if (registration && updateFound) registration.removeEventListener('updatefound', updateFound);
      removers.forEach((remove) => remove());
    };
  }, []);

  return {
    online, ready, waiting, installPrompt, error,
    async install() {
      if (!installPrompt) return;
      try { await installPrompt.prompt(); await installPrompt.userChoice; }
      catch { setError('Install could not start. Try the browser menu.'); }
      finally { setInstallPrompt(null); }
    },
    applyUpdate() {
      if (!waiting) return;
      navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true });
      waiting.postMessage({ type: 'APPLY_UPDATE' });
    },
  };
}
