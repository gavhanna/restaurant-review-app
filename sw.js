const staticCacheName = 'rest-review-static-v4';

self.addEventListener('install', event => {

  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        '/',
        '/restaurant.html',
        '/js/dbhelper.js',
        '/js/main.js',
        'http://localhost:5500/data/restaurants.json',
        '/css/styles.css',
        '/data/restaurants.json',
        '/sw.js'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('rest-review-static-') &&
             cacheName != staticCacheName;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request)
    })
  );
});