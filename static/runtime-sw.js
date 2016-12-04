importScripts('staticAssets.js') // eslint-disable-line no-undef

function promiseAny (promises) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-param-reassign
    promises = promises.map(p => Promise.resolve(p))

    promises.forEach(p => p.then(resolve))

    promises.reduce((a, b) => a.catch(() => b))
      .catch(() => reject(Error('All failed')))
  })
}

self.addEventListener('install', event =>
  event.waitUntil(caches.open(`sw-${ self.staticAssets.hash }`)
    .then(cache =>
      cache.addAll([
        '/',
        '/about',
        '/contact',
        '/notfound'
      ].concat(self.staticAssets.assets))
    )
  )
)

self.addEventListener('fetch', event => {
  if (
    event.request.method === 'GET' &&
    event.request.headers.get('accept').indexOf('text/html') !== -1
  ) {
    event.respondWith(
      caches.match(event.request)
        .then(res => res.text())
        .then(res => new Response(res, { headers: { 'Content-Type': 'text/html' } }))
    )
  }

  const { pathname, search } = new URL(event.request.url)

  if (self.staticAssets.assets.indexOf(pathname) !== -1) {
    event.respondWith(
      promiseAny([
        caches.match(pathname),
        fetch(`${ pathname }${ search }`)
      ])
    )
  }
})
