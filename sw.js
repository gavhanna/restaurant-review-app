const staticCacheName = "rest-review-static-v6";
const imgCache = "rest-review-imgs";
const allCaches = [staticCacheName, imgCache];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        "/",
        "/restaurant.html",
        "/js/dbhelper.js",
        "/js/main.js",
        "/js/indexedDB.js",
        "js/restaurant_info.js",
        "/css/styles.css",
        "/sw.js"
      ]);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return (
              cacheName.startsWith("rest-review-") &&
              !allCaches.includes(cacheName)
            );
          })
          .map(cacheName => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.search.startsWith("?id=")) {
    console.log(requestUrl.search);
    event.respondWith(
      caches.match("/restaurant.html").then(response => {
        if (response) return response;
        return fetch(event.request);
      })
    );
  }

  if (requestUrl.pathname === "/") {
    event.respondWith(caches.match("/"));
  }
  if (requestUrl.pathname.startsWith("/img/")) {
    event.respondWith(servePhoto(event.request));
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request);
    })
  );
});

function servePhoto(request) {
  const storageUrl = request.url.replace(/-\d\.jpg$/, "");

  return caches.open(imgCache).then(cache => {
    return cache.match(storageUrl).then(response => {
      if (response) return response;
      return fetch(request).then(networkResponse => {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
