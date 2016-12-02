import { createServer } from 'http'
import { h } from 'preact'
import { resolve } from 'universal-router' // eslint-disable-line import/extensions
import compression from 'compression'
import express from 'express'
import path from 'path'
import render from 'preact-render-to-string'
import serveFavicon from 'serve-favicon'
import serveStatic from 'serve-static'

import assets from './assets' // eslint-disable-line import/extensions
import Html from './components/Html'
import Provider from './lib/ContextProvider'
import router from './routes'

const app = express()
const port = 3000

app.use(compression({ threshold: 0 }))
app.use(serveStatic(path.resolve(__dirname, 'public')))
app.use(serveFavicon(path.resolve(__dirname, 'public/favicon.ico')))

app.get('*', async (req, res, next) => {
  try {
    const css = []

    const context = { insertCss: (...s) => s.forEach(style => css.push(style._getCss())) }

    const route = await resolve(router, { path: req.url })

    const component = render(
      <Provider context={ context }>
        { route.component }
      </Provider>
    )

    const chunks = Object.keys(assets)
      .filter(k =>
        !!assets[k].js &&
        !/main/.test(k) &&
        !/commons/.test(k) &&
        !/admin/.test(k) &&
        !new RegExp(route.chunk).test(k)
      )
      .map(k => assets[k].js)

    const data = {
      chunks,
      commonjs: assets.commons.js,
      component,
      routeChunk: assets[route.chunk].js,
      script: assets.main.js,
      style: css.join(''),
      title: route.title
    }

    res.send(`<!DOCTYPE html>${ render(<Html { ...data } />) }`)
  } catch (e) {
    next(e)
  }
})

createServer(app).listen(port, err => console.log( // eslint-disable-line no-console
  err || `\n==> server running on port ${ port }\n`
))
