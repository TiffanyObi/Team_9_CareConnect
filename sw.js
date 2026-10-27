
const SCOPE = new URL(self.registration.scope);
const PREFIX = 'careconnect-shell:' + SCOPE.pathname + ':';
const CACHE = PREFIX + "043a0d90070af169";
const ASSETS = ["assets/AccessibilityOnboardingPage-DI9uqecu.js","assets/AppointmentConfirmationPage-CVv_Jres.js","assets/AppointmentDetailsPage-ttqY1NYB.js","assets/AppointmentItem-Ciy1aIs8.js","assets/AppointmentsPage-ByJ56N5D.js","assets/CarePage-9E2JAnUD.js","assets/DashboardPage-DCKL8h6N.js","assets/DetailPanel-BttJxi9f.js","assets/EmergencyPage-BM407y--.js","assets/ForgotPasswordPage-DLGFmo_e.js","assets/HealthLogPage-C4kmFWST.js","assets/HelpPage-BF_Tme0n.js","assets/LoginPage-4DBJE_jO.js","assets/MedicationDetailsPage-4eItJgYP.js","assets/MedicationLogList-DPOtv3C1.js","assets/MedicationsPage-BW8KNLCF.js","assets/MessagesPage-B33SkNFo.js","assets/NewAppointmentPage-H_JBX5DD.js","assets/NewMedicationPage-IQEqdoiE.js","assets/PageHeader-N6RjFr_w.js","assets/PreferenceFields-Cjb1PhJm.js","assets/SearchVisitsPage-TEwF1hzc.js","assets/SettingsPage-BWOKTdrO.js","assets/SignUpPage-BEJdE7aN.js","assets/dateTime-Bulj7pLe.js","assets/index-CamkGXr8.css","assets/index-CnInck-t.js","assets/react-OrosJ8bI.js","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","index.html","manifest.json","robots.txt","sitemap.xml"].map((path) => new URL(path, SCOPE).href);
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
