import { createServer } from 'http'
import { h } from 'preact'
import { resolve } from 'path'
import Router from 'universal-router' // eslint-disable-line import/extensions
import compression from 'compression'
import express from 'express'
import render from 'preact-render-to-string'
import serveFavicon from 'serve-favicon'

import assets from './assets' // eslint-disable-line import/extensions
import Html from './components/Html'
import Provider from './lib/ContextProvider'
import routes from './routes'

const app = express()
const port = 3000
const router = new Router(routes)

app.use(compression({ threshold: 0 }))
app.use(express.static(resolve(__dirname, 'public')))
app.use(serveFavicon(resolve(__dirname, 'public', 'favicon.ico')))

const chunksToPreload = Object.keys(assets)
  .filter(c => !!assets[c].js && !/(main|commons)/.test(c))
  .map(c => assets[c].js)

app.get('*', async (req, res, next) => {
  try {
    const css = []

    const context = { insertCss: (...s) => s.forEach(style => css.push(style._getCss())) }

    const { _parsedUrl: { pathname }, query } = req

    const route = await router.resolve({ path: pathname, currentRoute: pathname, query })

    const component = render(
      <Provider context={ context }>
        { route.component }
      </Provider>
    )

    const chunks = chunksToPreload.filter(c => !new RegExp(route.chunk).test(c))

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
