const title = 'preact isomorphic example'
const description = 'A very simple boilerplate for an isomorphic Preact application'
const color = '#673ab8'
const secondaryColor = '#f2f2f2'

export const manifest = {
  name: title,
  icons: [{
    src: '/android-chrome-192x192.png',
    sizes: '192x192',
    type: 'image/png'
  }, {
    src: '/android-chrome-512x512.png',
    sizes: '512x512',
    type: 'image/png'
  }],
  theme_color: color,
  background_color: secondaryColor,
  display: 'standalone',
  orientation: 'portrait'
}

export default {
  lang: 'en',
  head: {
    title,
    description,
    meta: [{
      name: 'viewport',
      content: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'
    }, {
      name: 'theme-color',
      content: color
    }],
    customMeta: [{
      property: 'og:image',
      content: '/og-image.jpg'
    }, {
      property: 'og:image:width',
      content: '279'
    }, {
      property: 'og:image:height',
      content: '279'
    }, {
      property: 'og:title',
      content: title
    }, {
      property: 'og:description',
      content: description
    }, {
      property: 'og:url',
      content: 'malbernaz.me'
    }],
    link: [{
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png'
    }, {
      rel: 'icon',
      type: 'type/png',
      href: '/favicon-16x16.png',
      sizes: '16x16'
    }, {
      rel: 'icon',
      type: 'type/png',
      href: '/favicon-32x32.png',
      sizes: '32x32'
    }, {
      rel: 'manifest',
      href: '/manifest.json'
    }, {
      rel: 'mask-icon',
      href: '/safari-pinned-tab.svg',
      color
    }]
  }
}
