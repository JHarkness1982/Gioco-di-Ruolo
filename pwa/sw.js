// Installa subito e prepara la cache
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open("gdr-calendar-v1").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./icon-192.png",
        "./icon-512.png"
      ]);
    })
  );
});

// Attiva subito e prendi il controllo della pagina
self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      // Prendi il controllo immediato di tutte le pagine aperte
      self.clients.claim(),

      // Pulisci cache vecchie
      caches.keys().then(keys => {
        return Promise.all(
          keys
            .filter(key => key !== "gdr-calendar-v1")
            .map(key => caches.delete(key))
        );
      })
    ])
  );
});

// Risposte dalla cache + rete
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
