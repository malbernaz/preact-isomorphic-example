import { createServer } from 'http'
import { h } from 'preact'
import { resolve } from 'universal-router/main.mjs'
import express from 'express'
import path from 'path'
import render from 'preact-render-to-string'
import serveFavicon from 'serve-favicon'
import serveStatic from 'serve-static'

import assets from './assets'
import Html from './components/Html'
import router from './routes'

const app = express()
const port = 3000

app.use(serveStatic(path.resolve(__dirname, 'public')))
app.use(serveFavicon(path.resolve(__dirname, 'public/favicon.ico')))

app.get('*', async (req, res, next) => {
  try {
    const css = []

    const context = {
      insertCss: (...styles) => {
        styles.forEach(style => css.push(style._getCss()))
      }
    }

    const route = await resolve(router, { path: req.url, context })

    const data = { ...route, css }

    data.script = assets.main.js
    data.chunk = assets[route.chunk] && assets[route.chunk].js

    // First render to invoke context change
    render(<Html { ...data } />)

    res.send(`<!DOCTYPE html>${render(<Html { ...data } />)}`)
  } catch (e) {
    next(e)
  }
})

createServer(app).listen(port, err => console.log( // eslint-disable-line no-console
  err || `\n==> server running on port ${port}\n`
))
