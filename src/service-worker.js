/* eslint-env worker */

importScripts('assets.js')

const VERSION = self.staticAssets.hash
const STATIC_ASSETS = self.staticAssets.assets
const STATIC_PAGES = ['/', '/about', '/contact', '/notfound']

self.oninstall = event => event.waitUntil(
  caches.open(`static-${ VERSION }`)
    .then(cache => cache.addAll([...STATIC_PAGES, ...STATIC_ASSETS]))
    .then(() => self.skipWaiting())
)

self.onactivate = event => event.waitUntil(
  caches.keys()
    .then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(cache => !new RegExp(VERSION).test(cache))
          .map(cache => caches.delete(cache))
      )
    )
    .then(() =>
      self.clients.claim()
    )
)

self.onfetch = event => {
  const requestUrl = new URL(event.request.url)

  const { pathname, href, origin } = requestUrl

  // Webpack Hot Module Reloading
  if (_DEV_ && /(hot-update|sockjs-node)/.test(href)) {
    return event.respondWith(fetch(href))
  }

  // Server Rendered Pages
  if (location.origin === origin && STATIC_PAGES.some(s => s === pathname)) {
    return event.respondWith(
      caches.match(event.request)
        .then(response => response.text())
        .then(responseText =>
          new Response(responseText, {
            headers: { 'Content-Type': 'text/html' }
          })
        )
    )
  }

  // Static Assets
  if (STATIC_ASSETS.some(s => new RegExp(s).test(pathname))) {
    return event.respondWith(caches.match(event.request))
  }

  // Dynamic requests
  if (_DEV_) {
    const fetchedVersion = fetch(event.request)
    const fetchedCopy = fetchedVersion.then(response => response.clone())
    const cachedVersion = caches.match(event.request)

    event.respondWith(
      Promise.race([
        fetchedVersion.catch(() => cachedVersion),
        cachedVersion
      ]).then(response => {
        if (!response) return fetchedVersion
        return response
      }).catch(() =>
        new Response(null, { status: 404 })
      )
    )

    let response
    return event.waitUntil(
      fetchedCopy.then(res => {
        response = res
        return caches.open(`dynamic-${ VERSION }`)
      }).then(cache =>
        cache.put(event.request, response)
      )
    )
  }

  return event.respondWith(fetch(event.request))
}
