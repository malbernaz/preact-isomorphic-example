/* eslint-env worker */

importScripts('assets.js')

const VERSION = self.staticAssets.hash
const STATIC_ASSETS = self.staticAssets.assets
const STATIC_PAGES = ['/', '/about', '/contact', '/notfound']

function promiseAny (...promises) { // eslint-disable-line
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-param-reassign
    promises = promises.map(p => Promise.resolve(p))

    promises.forEach(p => p.then(resolve))

    promises.reduce((a, b) => a.catch(() => b))
      .catch(() => reject(Error('All failed')))
  })
}

self.oninstall = event => event.waitUntil((async () => {
  console.log('current cache version:', VERSION) // eslint-disable-line no-console

  const cache = await caches.open(`sw-${ VERSION }`)

  await cache.addAll([...STATIC_PAGES, ...STATIC_ASSETS])

  return self.skipWaiting()
})())

self.onactivate = event => event.waitUntil(self.clients.claim())

self.onfetch = event => {
  if (
    event.request.method === 'GET' &&
    event.request.headers.get('accept').indexOf('text/html') !== -1
  ) {
    return event.respondWith((async () => {
      const response = await caches.match(event.request)

      const responseText = await response.text()

      return new Response(responseText, {
        headers: { 'Content-Type': 'text/html' }
      })
    })())
  }

  const requestUrl = new URL(event.request.url)

  const { pathname, search, href } = requestUrl

  if (href.endsWith(VERSION)) {
    return event.respondWith((async () => {
      const response = await caches.match(pathname)

      return response
    })())
  }

  return event.respondWith(fetch(`${ pathname }${ search || '' }`))
}
