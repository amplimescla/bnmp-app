const CACHE = "bnmp-op-v2";
const ASSETS = ["./index.html", "./manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
self.addEventListener("message", e => {
  if (!e.data || e.data.type !== "NOTIFY") return;
  self.registration.showNotification(e.data.title, {
    body: e.data.body,
    icon: "./icon.png",
    badge: "./icon.png",
    tag: e.data.tag || "bnmp-alerta",
    vibrate: [100, 50, 100, 50, 300],
    requireInteraction: true,
    actions: [
      { action: "ver", title: "Ver detalhes" },
      { action: "ok",  title: "Ciente" }
    ]
  });
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  if (e.action === "ver") e.waitUntil(clients.openWindow("./index.html"));
});
