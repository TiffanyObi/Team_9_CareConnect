
const SCOPE = new URL(self.registration.scope);
const PREFIX = 'careconnect-shell:' + SCOPE.pathname + ':';
const CACHE = PREFIX + "e8600cc69b1ff56c";
const ASSETS = ["assets/AccessibilityOnboardingPage-MWNVBIpi.js","assets/AppointmentConfirmationPage-CNp0Fv_L.js","assets/AppointmentDetailsPage-D3Va5ah9.js","assets/AppointmentItem-D-75dlBs.js","assets/AppointmentsPage-DoEArR3Y.js","assets/CarePage-Kc8OYEUT.js","assets/DashboardPage-DYqcLX-6.js","assets/DetailPanel-pYlwWjDQ.js","assets/EmergencyPage-CApn_O-l.js","assets/ForgotPasswordPage-DMS0PRgf.js","assets/HealthLogPage-ciT3Gibe.js","assets/HelpPage-Bu6pKIYW.js","assets/LoginPage-BcF54SEr.js","assets/MedicationDetailsPage-onxHentk.js","assets/MedicationLogList-OBDVfWyC.js","assets/MedicationsPage-DByP1FqB.js","assets/MessagesPage-Dq1Ssvei.js","assets/NewAppointmentPage-c31kqDu4.js","assets/NewMedicationPage-D8VwPPid.js","assets/PageHeader-BFO_WRnP.js","assets/PreferenceFields-CCxNbUGU.js","assets/SearchVisitsPage-CGE0hAcY.js","assets/SettingsPage-BXfdtNhY.js","assets/SignUpPage-B2MaNSVn.js","assets/dateTime-Bulj7pLe.js","assets/index-CamkGXr8.css","assets/index-DH8gzStZ.js","assets/react-OrosJ8bI.js","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","index.html","manifest.json","robots.txt","sitemap.xml"].map((path) => new URL(path, SCOPE).href);
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
