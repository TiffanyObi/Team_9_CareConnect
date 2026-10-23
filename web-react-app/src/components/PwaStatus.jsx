import { usePwa } from '../pwa/usePwa';

export function PwaStatus() {
  const pwa = usePwa();
  return <aside className="pwa-status" aria-label="App connection and install">
    <p role="status">{!pwa.online
      ? `You are offline. ${pwa.ready ? 'Saved demo data is available on this device.' : 'Offline setup has not finished. Reconnect to finish setup.'}`
      : pwa.ready ? 'Ready for offline use on this device.' : 'You are online.'}</p>
    {pwa.error && <p role="alert">{pwa.error}</p>}
    {pwa.installPrompt && <button type="button" className="button button--secondary" onClick={pwa.install}>Install CareConnect</button>}
    {pwa.waiting && <div><p>A new version is ready. Save any form entries before reloading.</p><button type="button" className="button button--secondary" onClick={pwa.applyUpdate}>Reload to update</button></div>}
    <details><summary>Install and offline help</summary><p>Once offline setup is ready, the app and saved demo records work without a connection. Records stay in this browser profile. Logging out locks the workspace; it does not remove saved records.</p><p>Use your browser’s install option if it is offered. On Safari, use Add to Dock on Mac or Add to Home Screen on iPhone or iPad when available.</p></details>
  </aside>;
}
