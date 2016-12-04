// function promiseAny (promises) {
//   return new Promise((resolve, reject) => {
//     // make sure promises are all promises
//     promises = promises.map(p => Promise.resolve(p)) // eslint-disable-line
//     // resolve this promise as soon as one resolves
//     promises.forEach(p => p.then(resolve))
//     // reject if all promises reject
//     promises.reduce((a, b) => a.catch(() => b))
//       .catch(() => reject(Error('All failed')))
//   })
// }

self.addEventListener('install', event =>
  event.waitUntil(caches.open('sw-v1')
    .then(cache =>
      cache.addAll([
        '/',
        '/about',
        '/contact',
        '/notfound'
      ])
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
})
