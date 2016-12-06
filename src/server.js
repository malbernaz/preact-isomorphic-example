import { createServer } from 'http'
import { h } from 'preact'
import { resolve } from 'path'
import { resolve as match } from 'universal-router' // eslint-disable-line import/extensions
import { writeFileSync } from 'fs'
import compression from 'compression'
import express from 'express'
import render from 'preact-render-to-string'
import serveFavicon from 'serve-favicon'

import { manifest } from './config'
import assets from './assets' // eslint-disable-line import/extensions
import Html from './components/Html'
import Provider from './lib/ContextProvider'
import router from './routes'

writeFileSync(resolve(__dirname, 'public', 'manifest.json'), JSON.stringify(manifest))

const app = express()
const port = 3000

app.use(compression({ threshold: 0 }))
app.use(express.static(resolve(__dirname, 'public')))
app.use(serveFavicon(resolve(__dirname, 'public', 'favicon.ico')))

app.get('*', async (req, res, next) => {
  try {
    const css = []

    const context = { insertCss: (...s) => s.forEach(style => css.push(style._getCss())) }

    const route = await match(router, { path: req.url })

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
