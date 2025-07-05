// Service Worker for Amino Gym PWA
const CACHE_NAME = "amino-gym-v1";
const urlsToCache = [
  "/",
  "/home",
  "/login",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/yacin-gym-logo.png",
  "/success-sound.mp3",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    }),
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response;
      }
      return fetch(event.request);
    }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline data synchronization when connection is restored
  return new Promise((resolve) => {
    console.log("Background sync triggered");
    resolve();
  });
}

// Push notifications (if needed in future)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "إشعار من Amino Gym",
    icon: "/yacin-gym-logo.png",
    badge: "/yacin-gym-logo.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "فتح التطبيق",
        icon: "/yacin-gym-logo.png",
      },
      {
        action: "close",
        title: "إغلاق",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Amino Gym", options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});
