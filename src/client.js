import { h, render } from 'preact'
import { resolve } from 'universal-router/browser.mjs'

import { StyleProvider } from './helpers/styles'
import { updateTitle } from './helpers/updateTag'
import history from './helpers/history'
import config from './config'

const scrollPositionsHistory = {}

if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

let firstRender = true
function onRenderComplete (route, location) {
  if (firstRender) {
    const elem = document.getElementById('css')

    elem.parentNode.removeChild(elem)

    firstRender = false
  }

  updateTitle(config.head.title, route.title)

  let scrollX = 0
  let scrollY = 0
  const pos = scrollPositionsHistory[location.key]
  if (pos) {
    scrollX = pos.scrollX
    scrollY = pos.scrollY
  } else {
    const targetHash = location.hash.substr(1)
    if (targetHash) {
      const target = document.getElementById(targetHash)
      if (target) {
        scrollY = window.pageYOffset + target.getBoundingClientRect().top
      }
    }
  }

  window.scrollTo(scrollX, scrollY)

  return root
}

const context = {
  insertCss: (...styles) => {
    const removeCss = styles.map(x => x._insertCss())

    return () => { removeCss.forEach(f => f()) }
  }
}

let currentLocation = history.location
const mountPoint = document.getElementById('root')

async function boot (location) {
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset
  }

  if (history.action === 'PUSH') {
    delete scrollPositionsHistory[location.key]
  }

  currentLocation = location

  const router = require('./routes').default // eslint-disable-line global-require

  const route = await resolve(router, { path: location.pathname })

  const component = (
    <StyleProvider context={ context }>
      { route.component }
    </StyleProvider>
  )

  render(component, mountPoint, mountPoint.lastElementChild)

  onRenderComplete(route, location)
}

history.listen(boot)

boot(currentLocation)

if (module.hot) module.hot.accept('./routes', () => boot(currentLocation))
