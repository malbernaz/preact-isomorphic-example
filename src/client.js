import { h, render } from 'preact'
import { resolve } from 'universal-router/browser.mjs'

import { StyleProvider } from './lib/styles'
import { updateTitle } from './lib/updateTag'
import UseScroll from './lib/middleware/useScroll'
import config from './config'

let FIRST_RENDER = true
let USE_SCROLL = true

const scroll = new UseScroll()
const history = scroll.history

const context = {
  insertCss (...styles) {
    const removeCss = styles.map(x => x._insertCss())

    return () => { removeCss.forEach(f => f()) }
  }
}

const mountPoint = document.getElementById('root')

async function boot (location) {
  if (FIRST_RENDER) {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    } else {
      USE_SCROLL = false
    }

    const elem = document.getElementById('css')

    elem.parentNode.removeChild(elem)

    FIRST_RENDER = false
  }

  if (USE_SCROLL) {
    scroll.storeScroll(location)
  }

  const router = require('./routes').default // eslint-disable-line global-require

  const route = await resolve(router, { path: location.pathname })

  const component = (
    <StyleProvider context={ context }>
      { route.component }
    </StyleProvider>
  )

  render(component, mountPoint, mountPoint.lastElementChild)

  updateTitle(config.head.title, route.title)

  if (USE_SCROLL) {
    scroll.restoreScroll(location)
  }
}

history.listen(boot)

boot(scroll.currentLocation)

if (module.hot) module.hot.accept('./routes', () => boot(scroll.currentLocation))
