import { createMemoryHistory } from 'history'
import { createServer } from 'http'
import { h } from 'preact'
import { resolve } from 'path'
import express from 'express'
import render from 'preact-render-to-string'
import serveFavicon from 'serve-favicon'
import serveStatic from 'serve-static'

import Html from './components/Html'
import Root from './containers/Root'

const app = express()
const port = 3000

app.use(serveStatic(resolve(__dirname, 'public')))
app.use(serveFavicon(resolve(__dirname, 'public/favicon.ico')))

app.use((req, res) => {
  const history = createMemoryHistory({
    initialEntries: [req.url]
  })

  res.send(`<!DOCTYPE html>${render(
    <Html>
      <Root history={ history } />
    </Html>
  )}`)
})

createServer(app).listen(port, err => console.log( // eslint-disable-line no-console
  err || `\n==> server running on port ${port}\n`
))
