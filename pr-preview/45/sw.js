
const SCOPE = new URL(self.registration.scope);
const PREFIX = 'careconnect-shell:' + SCOPE.pathname + ':';
const CACHE = PREFIX + "b9f378e0c35ff3d2";
const ASSETS = ["assets/AccessibilityOnboardingPage-CFyi0Pda.js","assets/AppointmentConfirmationPage-CV9K5FbP.js","assets/AppointmentDetailsPage-CPze22BY.js","assets/AppointmentsPage-CMeXWBqB.js","assets/DashboardPage-Bnp5EP5H.js","assets/DetailPanel-PZQgk3WQ.js","assets/ForgotPasswordPage-D-lYzSsm.js","assets/HelpPage-B_pi_yiS.js","assets/LoginPage-DPw2eHSK.js","assets/MedicationDetailsPage-ByvEfgNW.js","assets/MedicationLogList-CqOZzxSi.js","assets/MedicationsPage-Cm7VRCso.js","assets/MessagesPage-CisbkTLB.js","assets/NewAppointmentPage-BK2vRq-H.js","assets/NewMedicationPage-DONt5T7j.js","assets/PageHeader-DD8I9Rvn.js","assets/PreferenceFields-CgxPDcN4.js","assets/SearchVisitsPage-D1uF14FJ.js","assets/SettingsPage-C2PJojvI.js","assets/SignUpPage-Dy6TRlRu.js","assets/dateTime-Bulj7pLe.js","assets/index-78fdqyp6.css","assets/index-D20smfc-.js","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","index.html","manifest.json"].map((path) => new URL(path, SCOPE).href);
const SHELL = new URL('index.html', SCOPE).href;
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try { await cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))); }
    catch (error) { await caches.delete(CACHE); throw error; }
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys()).filter((key) => key.startsWith(PREFIX) && key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', (event) => {
  if (event.data?.type === 'APPLY_UPDATE') self.skipWaiting();
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Never store API responses, external resources, or user records.
  if (event.request.mode === 'navigate' && url.pathname.startsWith(SCOPE.pathname)) {
    event.respondWith((async () => (await (await caches.open(CACHE)).match(SHELL)) || fetch(event.request))());
  } else if (!url.search && ASSETS.includes(url.href)) {
    event.respondWith((async () => (await (await caches.open(CACHE)).match(url.href)) || fetch(event.request))());
  }
});
