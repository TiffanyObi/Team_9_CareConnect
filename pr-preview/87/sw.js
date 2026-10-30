
const SCOPE = new URL(self.registration.scope);
const PREFIX = 'careconnect-shell:' + SCOPE.pathname + ':';
const CACHE = PREFIX + "f10545ef71de118d";
const ASSETS = ["assets/AccessibilityOnboardingPage-CwNyouz6.js","assets/AppointmentConfirmationPage-SZwBMHEw.js","assets/AppointmentDetailsPage-BMDWXBVn.js","assets/AppointmentItem-9CkYXXk7.js","assets/AppointmentsPage-gmhUZDN4.js","assets/CarePage-Dq69DBBT.js","assets/DashboardPage-B4rT7qZu.js","assets/DetailPanel-BcO8cLZw.js","assets/EmergencyPage-DT23EqEC.js","assets/ForgotPasswordPage-6Pqnm208.js","assets/HealthLogPage-Cv3-Kax_.js","assets/HelpPage-D_ZHSUdu.js","assets/LoginPage-Dgga6bC0.js","assets/MedicationDetailsPage-DEr4qB4f.js","assets/MedicationLogList-BmQ8Arrx.js","assets/MedicationsPage-DcxxD8_-.js","assets/MessagesPage-DlZev7Dw.js","assets/NewAppointmentPage-RLJAqEmL.js","assets/NewMedicationPage-DOfKhKCy.js","assets/PageHeader-Bs-XmSjb.js","assets/PreferenceFields-Ci4kHk9c.js","assets/SearchVisitsPage-DiQUU9Ro.js","assets/SettingsPage-QpwjY2TF.js","assets/SignUpPage-B7ea0Abr.js","assets/dateTime-Bulj7pLe.js","assets/index-BFPOIKII.js","assets/index-CamkGXr8.css","assets/react-OrosJ8bI.js","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","index.html","manifest.json","robots.txt","sitemap.xml"].map((path) => new URL(path, SCOPE).href);
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
